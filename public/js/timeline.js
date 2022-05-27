"use strict";

const popup = document.querySelector("#popup");
const closePopup = document.querySelector("#popup-close");

var env_pt = 50; //Environment value at start, 0-100
var com_pt = 50; //Comfort value at start, 0-100

function init() {
  function ajaxGET(url) {
    const xhr = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
      xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
          resolve(this.responseText);
        } else {
          reject(this.status);
        }
      };
      xhr.open("GET", url);
      xhr.send();
    });
  }

  ajaxGET("/playthrough").then(function (data) {
    let parsedJSON = JSON.parse(data);
    if (!parsedJSON.playthrough) {
      document.querySelector("#info").innerHTML = "No game record.";
      popup.classList.toggle("display-none");
      return;
    }
    let p_id = parsedJSON.playthrough.id;

    ajaxGET("/playthrough/questions?playthroughId=" + p_id).then(
      async function (data) {
        let pdata = JSON.parse(data).questions;
        let cardTemplate = document.getElementById("decision-pin");
        for (let i = 0; i < pdata.length; i++) {
          if (i == 0 && pdata[i].selected_choice_id == null) {
            document
              .getElementById("game-notification")
              .classList.toggle("display-none");
            document
              .getElementById("main-container")
              .classList.add("display-none");
            return;
          }
          if (pdata[i].selected_choice_id == null) {
            document
              .getElementById("game-notification")
              .classList.toggle("display-none");
            return;
          }

          await ajaxGET(
            "/choice-by-id?cid=" + pdata[i].selected_choice_id
          ).then(function (data) {
            let cards = cardTemplate.content.cloneNode(true);
            let choiceInfo = JSON.parse(data);
            cards.querySelector(".decision-count").innerHTML = i + 1;
            cards.querySelector(".decision-content").innerHTML = pdata[i].text;
            cards.querySelector(".selected-choice").innerHTML =
              choiceInfo[0].text;
            if (choiceInfo[0].env_pt > 0) {
              cards.querySelector("#env-change").innerHTML =
                "+" + choiceInfo[0].env_pt;
            } else {
              cards.querySelector("#env-change").innerHTML =
                choiceInfo[0].env_pt;
            }
            if (choiceInfo[0].com_pt > 0) {
              cards.querySelector("#com-change").innerHTML =
                "+" + choiceInfo[0].com_pt;
            } else {
              cards.querySelector("#com-change").innerHTML =
                choiceInfo[0].com_pt;
            }

            //Calculate the env_pt and com_pt
            env_pt += choiceInfo[0].env_pt;
            cards.querySelector("#env-meter").style.width = env_pt + "%";
            cards.querySelector("#env-current").innerHTML = env_pt;
            com_pt += choiceInfo[0].com_pt;
            cards.querySelector("#com-meter").style.width = com_pt + "%";
            cards.querySelector("#com-current").innerHTML = com_pt;

            document.querySelector("#cards-go-here").prepend(cards);
          });
        }
      }
    );
  });
}

//Close modal and return to main page
closePopup.addEventListener("click", () => {
  window.location.replace("/");
});

document.onreadystatechange = () =>
  document.readyState === "complete" && init();
