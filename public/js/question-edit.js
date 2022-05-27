"use strict";

const modalAddQuestion = document.querySelector("#add-q");
const modalAddChoice = document.querySelector("#add-c");
const modalEditChoice = document.querySelector("#edit-c");
const modalEditQuestion = document.querySelector("#edit-q");
const popup = document.querySelector("#popup");
const closem1 = document.querySelector("#new-question-close");
const closem2 = document.querySelector("#new-choice-close");
const closem3 = document.querySelector("#edit-choice-close");
const closem4 = document.querySelector("#edit-question-close");
const closem5 = document.querySelector("#popup-close");

var currentQID, currentOID;

function init() {
  function ajaxGET(path, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        callback(this.responseText);
      }
    };
    xhr.open("GET", path);
    xhr.send();
  }

  function ajaxPOST(url, callback, data) {
    const params =
      typeof data == "string"
        ? data
        : Object.keys(data)
            .map({
              function(key) {
                return (
                  encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
                );
              },
            })
            .join("&");

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (!this.readyState == XMLHttpRequest.DONE || this.status != 200) {
        console.warn(this.status);
      }
      callback(this.responseText, this.status);
    };
    xhr.open("POST", url);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
  }

  function ajaxDELETE(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url);
    xhr.send();
    xhr.onload = function () {
      callback(this.responseText);
    };
  }

  populateQuestions();

  //Add new question
  document.querySelector("#add-new").addEventListener("click", function (e) {
    e.preventDefault();
    var newQuestion =
      "question=" + document.querySelector("#add-new-question").value + "&qid=";
    ajaxPOST(
      "/questions",
      function (data, status) {
        var response = JSON.parse(data);
        if (status != 200) {
          document.querySelector("#info").innerHTML = response.message;
          popup.classList.toggle("display-none");
        } else {
          location.reload();
        }
      },
      newQuestion
    );
  });

  //Update question
  document
    .querySelector("#update-question")
    .addEventListener("click", function (e) {
      e.preventDefault();
      var editQuestion =
        "question=" +
        document.querySelector("#edit-question").value +
        "&qid=" +
        currentQID;
      ajaxPOST(
        "/questions",
        function (data, status) {
          var response = JSON.parse(data);
          if (status != 200) {
            document.querySelector("#info").innerHTML = response.message;
            popup.classList.toggle("display-none");
          } else {
            location.reload();
          }
        },
        editQuestion
      );
    });

  //Update choices
  document
    .querySelector("#update-choice")
    .addEventListener("click", function (e) {
      e.preventDefault();
      var updates =
        "questionID=" +
        currentQID +
        "&optionID=" +
        currentOID +
        "&text=" +
        document.querySelector("#l1").value +
        "&envi=" +
        document.querySelector("#l2").value +
        "&comf=" +
        document.querySelector("#l3").value;
      ajaxPOST(
        "/choices",
        function (data, status) {
          var response = JSON.parse(data);
          if (status != 200) {
            document.querySelector("#info").innerHTML = response.message;
            popup.classList.toggle("display-none");
          } else {
            populateChoices();
            modalEditChoice.classList.toggle("display-none");
          }
        },
        updates
      );
    });

  //Add choice
  document
    .querySelector("#insert-choice")
    .addEventListener("click", function (e) {
      e.preventDefault();
      var updates =
        "questionID=" +
        currentQID +
        "&optionID=&text=" +
        document.querySelector("#al1").value +
        "&envi=" +
        document.querySelector("#al2").value +
        "&comf=" +
        document.querySelector("#al3").value;
      ajaxPOST(
        "/choices",
        function (data, status) {
          var response = JSON.parse(data);
          if (status != 200) {
            document.querySelector("#info").innerHTML = response.message;
            popup.classList.toggle("display-none");
          } else {
            populateChoices();
            modalAddChoice.classList.toggle("display-none");
          }
        },
        updates
      );
    });

  function populateQuestions() {
    document.querySelector("#questions").innerHTML = null;
    document.querySelector("#options").innerHTML = null;
    currentQID = "";
    currentOID = "";
    //Get questions from database
    ajaxGET("/questions", function (data) {
      let parsedData = JSON.parse(data);
      if (parsedData.status == 500) {
        document.querySelector("#info").innerHTML = parsedData.message;
        popup.classList.toggle("display-none");
      }
      //Populate questions
      let template = document.getElementById("question-card");
      for (let i = 0; i < parsedData.length; i++) {
        let nc = template.content.cloneNode(true);
        nc.querySelector("#q-num").innerHTML = i + 1;
        nc.querySelector("#q-id").innerHTML = parsedData[i].id;
        nc.querySelector("#text").innerHTML = parsedData[i].question;
        nc.querySelector(".question-card").setAttribute("id", "card" + i);

        //Delete question
        nc.querySelector("#delete").onclick = () => {
          ajaxDELETE(
            "/question?qid=" + parsedData[i].id + "&oid=",
            function (e) {
              let response = JSON.parse(e);
              document.querySelector("#info").innerHTML = response.message;
              popup.classList.toggle("display-none");
              populateQuestions();
            }
          );
        };
        //Edit question
        nc.querySelector("#edit").onclick = () => {
          currentQID = parsedData[i].id;
          document.querySelector("#edit-question").value =
            parsedData[i].question;
          modalEditQuestion.classList.toggle("display-none");
        };

        nc.querySelector(".question-card").onclick = () => {
          currentQID = parsedData[i].id;
          selected(i, parsedData.length);
          populateChoices();
        };
        document.querySelector("#questions").appendChild(nc);
      }
    });
  }

  function populateChoices() {
    document.querySelector("#options").innerHTML = null;
    document.querySelector("#al1").value = null;
    document.querySelector("#al2").value = null;
    document.querySelector("#al3").value = null;
    currentOID = "";
    ajaxGET("/choices?qid=" + currentQID, function (option) {
      //Populate choices
      let choiceData = JSON.parse(option);
      let optionTemplate = document.getElementById("option-card");
      for (let j = 0; j < choiceData.length; j++) {
        let cc = optionTemplate.content.cloneNode(true);
        cc.querySelector("#opt-num").innerHTML = j + 1;
        cc.querySelector("#opt-text").innerHTML = choiceData[j].text;
        //Show choice details
        cc.querySelector("#edit-option").onclick = () => {
          currentOID = choiceData[j].id;
          modalEditChoice.classList.toggle("display-none");
          document.querySelector("#l1").value = choiceData[j].text;
          document.querySelector("#l2").value = choiceData[j].env_pt;
          document.querySelector("#l3").value = choiceData[j].com_pt;
        };
        //Delete choice
        cc.querySelector("#delete-option").onclick = () => {
          ajaxDELETE(
            "/question?qid=" + currentQID + "&oid=" + choiceData[j].id,
            function (e) {
              let response = JSON.parse(e);
              document.querySelector("#info").innerHTML = response.message;
              popup.classList.toggle("display-none");
              populateChoices();
            }
          );
        };
        document.querySelector("#options").appendChild(cc);
      }
    });
  }

  //Modals manipulation
  //Open modal for adding new question
  document
    .querySelector("#add-questions")
    .addEventListener("click", function (e) {
      e.preventDefault();
      modalAddQuestion.classList.toggle("display-none");
    });
  //Open modal for adding new choice
  document
    .querySelector("#add-choices")
    .addEventListener("click", function (e) {
      e.preventDefault();
      modalAddChoice.classList.toggle("display-none");
    });
  //Close "add new question modal"
  closem1.addEventListener("click", () => {
    modalAddQuestion.classList.toggle("display-none");
  });
  //Close "add new choice modal"
  closem2.addEventListener("click", () => {
    modalAddChoice.classList.toggle("display-none");
  });
  //Close "update choice modal"
  closem3.addEventListener("click", () => {
    modalEditChoice.classList.toggle("display-none");
  });
  //Close "update question modal"
  closem4.addEventListener("click", () => {
    modalEditQuestion.classList.toggle("display-none");
  });
  //Close "popup info modal"
  closem5.addEventListener("click", () => {
    popup.classList.toggle("display-none");
  });
}

function selected(sel, all) {
  for (let x = 0; x < all; x++) {
    document.querySelector("#card" + x).style.backgroundColor = "white";
  }
  document.querySelector("#card" + sel).style.backgroundColor = "#4290D8";
}

document.onreadystatechange = () =>
  document.readyState === "complete" && init();
