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
let currentQuestionChoices; //Choice related info for current question
let step; //Current position in this round

function init() {
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
      callback(this.responseText, this.status);
    };
    xhr.open("POST", url);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
  }

  function ajaxPUT(url, callback, data) {
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
      callback(this.responseText, this.status);
    };
    xhr.open("PUT", url);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
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
    if (value > 0) {
      document.getElementById("env-change").classList.toggle("hidden");
      document.getElementById("env-change").style.color = "#49BEAA";
      document.getElementById("env-change").innerHTML = "+" + value;
    } else {
      document.getElementById("env-change").classList.toggle("hidden");
      document.getElementById("env-change").style.color = "#af1313";
      document.getElementById("env-change").innerHTML = value;
    }
    setTimeout(() => { document.getElementById("env-change").classList.toggle("hidden"); }, 1000);
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
    if (value > 0) {
      document.getElementById("com-change").classList.toggle("hidden");
      document.getElementById("com-change").style.color = "#49BEAA";
      document.getElementById("com-change").innerHTML = "+" + value;
    } else {
      document.getElementById("com-change").classList.toggle("hidden");
      document.getElementById("com-change").style.color = "#af1313";
      document.getElementById("com-change").innerHTML = value;
    }
    setTimeout(() => { document.getElementById("com-change").classList.toggle("hidden"); }, 1000);
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
          (question) => question.id === playthrough.current_question_id
        );
        qnum = questions.length;
        showQuestion(step);
      }
    );
  }

  async function getChoices(qid) {
    await ajaxGET("/choices?qid=" + qid, function (data) {
      currentQuestionChoices = JSON.parse(data);
    });
  }

  async function showQuestion(index) {
    const currentQuestion = questionList[index];
    document.querySelector(".question").innerHTML = currentQuestion.text;
    await getChoices(currentQuestion.question_id);
    return ajaxGET("/choices?qid=" + currentQuestion.question_id, (data) => {
      currentQuestionChoices = JSON.parse(data);
      document.querySelector("#choices-go-here").innerHTML = null;
      let choiceTemplate = document.getElementById("choice");

      currentQuestionChoices.forEach((currentChoice) => {
        let choiceButton = choiceTemplate.content.cloneNode(true);
        choiceButton.querySelector("#option").innerHTML = currentChoice.text;
        choiceButton.querySelector("#option").onclick = () => {
          const queryString =
            "playthroughId=" +
            sessionStorage.getItem("playthroughId") +
            "&questionId=" +
            currentQuestion.id +
            "&choiceId=" +
            currentChoice.id;
          ajaxPUT(
            "/playthrough",
            (data, status) => {
              if (status !== 200) {
                const { message } = JSON.parse(data);
                document.querySelector("#info").innerHTML = message;
                popup.classList.toggle("display-none");
              } else {
                setCom(currentChoice.com_pt);
                setEnv(currentChoice.env_pt);
                step++;
                if (step == qnum) {
                  ajaxPOST("/ending", (data, status) => {
                    const {message} = JSON.parse(data);
                    if (status !== 200) {
                       document.querySelector("#info").innerHTML = message;
                    } else {
                      window.location.replace("/ending");
                    }
                  }, "")
                  return;
                }
                showQuestion(step);
              }
            },
            queryString
          );
        };
        choiceButton
          .querySelector("#option")
          .setAttribute("id", "option" + currentChoice.id); //Set unique id for each button
        document.querySelector("#choices-go-here").appendChild(choiceButton);
      });
    });
  }

  //Close modal and return to main page
  closePopup.addEventListener("click", () => {
    window.location.replace("/");
  });
}

document.onreadystatechange = () =>
  document.readyState === "complete" && init();
