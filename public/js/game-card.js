"use strict";

//Define these constants first
const environment = 50; //Environment value at start, 0-100
const comfort = 50; //Comfort value at start, 0-100

const popup = document.querySelector("#popup");
const closePopup = document.querySelector("#popup-close");

let qnum; //Questions per round, less or equal to total question number in db
let env_pt; //Environment Gauge
let com_pt; //Comfort Gauge
let questionList; //Game Question List
let choiceInfo; //Choice related info for current question
let step; //Current position in this round

function init() {
  console.info("Client script loaded.");
  function ajaxGET(path, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.readyState == XMLHttpRequest.DONE) {
        callback(this.responseText, this.status);
      }
    };
    xhr.open("GET", path);
    xhr.send();
  }

  //Start the game
  initMeters();
  getQuestions();

  function initMeters() {
    env_pt = environment;
    com_pt = comfort;
    step = 0;
    document.getElementById("com-meter").style.width = com_pt + "%";
    document.getElementById("env-meter").style.width = env_pt + "%";
  }

  function setEnv(value) {
    let temp = env_pt + value;
    if (temp > 100) {
      env_pt = 100;
    } else if (temp < 0) {
      env_pt = 0;
    } else {
      env_pt = temp;
    }
    document.getElementById("env-meter").style.width = env_pt + "%";
  }

  function setCom(value) {
    let temp = com_pt + value;
    if (temp > 100) {
      com_pt = 100;
    } else if (temp < 0) {
      com_pt = 0;
    } else {
      com_pt = temp;
    }
    document.getElementById("com-meter").style.width = com_pt + "%";
  }

  function getQuestions() {
    const queryParam = `?playthroughId=${sessionStorage.getItem(
      "playthroughId"
    )}`;
    return ajaxGET(
      "/playthrough/questions" + queryParam,
      function (data, status) {
        const { playthrough, questions, message } = JSON.parse(data);
        if (status !== 200) {
          document.querySelector("#info").innerHTML = message;
          popup.classList.toggle("display-none");
        }
        //Pick up question randomly from the question pool.
        questionList = questions;
        step = questions.findIndex(
          (question) => question.id === playthrough.last_question_id
        );
        qnum = questions.length;
        showQuestion(step);
      }
    );
  }

  async function getChoices(qid) {
    await ajaxGET("/choices?qid=" + qid, function (data) {
      choiceInfo = JSON.parse(data);
    });
  }

  async function showQuestion(index) {
    document.querySelector(".question").innerHTML = questionList[index].text;
    await getChoices(questionList[index].question_id);
    return ajaxGET(
      "/choices?qid=" + questionList[index].question_id,
      (data) => {
        choiceInfo = JSON.parse(data);
        document.querySelector("#choices-go-here").innerHTML = null;
        let choiceTemplate = document.getElementById("choice");
        for (let j = 0; j < choiceInfo.length; j++) {
          let choiceButton = choiceTemplate.content.cloneNode(true);
          choiceButton.querySelector("#option").innerHTML = choiceInfo[j].text;
          choiceButton.querySelector("#option").onclick = () => {
            // @TODO save user choice and playthrough progress
            setCom(choiceInfo[j].com_pt);
            setEnv(choiceInfo[j].env_pt);
            step++;
            if (com_pt == 0) {
              //Comfort=0, bad ending 1
              document.querySelector("#info").innerHTML =
                "You reached the BAD ENDING 1<br/>Environment = " +
                env_pt +
                "<br/>Happiness = " +
                com_pt;
              popup.classList.toggle("display-none");
              return;
            }
            if (env_pt == 0) {
              //Environment=0, bad ending 2
              document.querySelector("#info").innerHTML =
                "You reached the BAD ENDING 2<br/>Environment = " +
                env_pt +
                "<br/>Happiness = " +
                com_pt;
              popup.classList.toggle("display-none");
              return;
            }
            if (com_pt == 100) {
              //Comfort=100, good ending 1
              document.querySelector("#info").innerHTML =
                "You reached the GOOD ENDING 1<br/>Environment = " +
                env_pt +
                "<br/>Happiness = " +
                com_pt;
              popup.classList.toggle("display-none");
              return;
            }
            if (env_pt == 100) {
              //Environment=100, good ending 2
              document.querySelector("#info").innerHTML =
                "You reached the GOOD ENDING 2<br/>Environment = " +
                env_pt +
                "<br/>Happiness = " +
                com_pt;
              popup.classList.toggle("display-none");
              return;
            }
            if (step == qnum) {
              //No more question left in this round
              document.querySelector("#info").innerHTML =
                "This is the last question!<br/>Environment = " +
                env_pt +
                "<br/>Happiness = " +
                com_pt;
              popup.classList.toggle("display-none");
              return;
            }
            showQuestion(step);
          };
          choiceButton
            .querySelector("#option")
            .setAttribute("id", "option" + choiceInfo[j].ID); //Set unique id for each button
          document.querySelector("#choices-go-here").appendChild(choiceButton);
        }
      }
    );
  }

  //Close modal and return to main page
  closePopup.addEventListener("click", () => {
    window.location.replace("/");
  });
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    console.info("Document fully loaded.");
    init();
  }
};
