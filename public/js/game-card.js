"use strict";

//Define these constants first
const qnum = 3; //Questions per round, less or equal to total question number in db
const environment = 50; //Environment value at start, 0-100
const comfort = 50; //Comfort value at start, 0-100

const popup = document.querySelector("#popup");
const closePopup = document.querySelector("#popup-close");

var env_pt; //Environment Gauge
var com_pt; //Comfort Gauge
var questionList; //Game Question List
var choiceInfo; //Choice related info for current question
var step; //Current position in this round



function init() {
    console.log("Client script loaded.");
    function ajaxGET(url) {
        const xhr = new XMLHttpRequest();
        return new Promise(function (resolve, reject) {
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        resolve(this.responseText);
                    } else {
                        console.log(this.status);
                    }
                } else {
                    reject(this.status);
                }
            }
            xhr.open("GET", url);
            xhr.send();
        });
    }

    //Start the game
    initMeters();
    getQuestions().then(() => showQuestion(step));

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

    async function getQuestions() {
        await ajaxGET("/questions").then(function (data) {
            let questionPool = JSON.parse(data);
            if (questionPool.status == 500) {
                document.querySelector('#info').innerHTML = questionPool.message;
                popup.classList.toggle("display-none");
            }
            if (questionPool.length == 0){
                document.querySelector('#info').innerHTML = "No queestion in the database.";
                popup.classList.toggle("display-none");
            }
            //Pick up question randomly from the question pool.
            questionList = questionPool.map((n, i, all) => {
                const j = i + Math.floor(Math.random() * (all.length - i));
                const v = all[j];
                all[j] = n;
                return v;
            }).slice(0, qnum);
        });
    }

    async function getChoices(qid) {
        await ajaxGET("/choices?qid=" + qid).then(function (data) {
            choiceInfo = JSON.parse(data);
        });
    }

    async function showQuestion(num) {
        document.querySelector('.question').innerHTML = questionList[num].question;
        await getChoices(questionList[num].ID);
        document.querySelector('#choices-go-here').innerHTML = null;
        let choiceTemplate = document.getElementById("choice");
        for (let j = 0; j < choiceInfo.length; j++) {
            let choiceButton = choiceTemplate.content.cloneNode(true);
            choiceButton.querySelector('#option').innerHTML = choiceInfo[j].text;
            choiceButton.querySelector('#option').onclick = () => {
                setCom(choiceInfo[j].com_pt);
                setEnv(choiceInfo[j].env_pt);
                step++;
                if (com_pt == 0) {
                    //Comfort=0, bad ending 1
                    document.querySelector('#info').innerHTML = "You reached the BAD ENDING 1<br/>Environment = " + env_pt + "<br/>Happiness = " + com_pt;
                    popup.classList.toggle("display-none");
                    return;
                }
                if (env_pt == 0) {
                    //Environment=0, bad ending 2
                    document.querySelector('#info').innerHTML = "You reached the BAD ENDING 2<br/>Environment = " + env_pt + "<br/>Happiness = " + com_pt;
                    popup.classList.toggle("display-none");
                    return;
                }
                if (com_pt == 100) {
                    //Comfort=100, good ending 1
                    document.querySelector('#info').innerHTML = "You reached the GOOD ENDING 1<br/>Environment = " + env_pt + "<br/>Happiness = " + com_pt;
                    popup.classList.toggle("display-none");
                    return;
                }
                if (env_pt == 100) {
                    //Environment=100, good ending 2
                    document.querySelector('#info').innerHTML = "You reached the GOOD ENDING 2<br/>Environment = " + env_pt + "<br/>Happiness = " + com_pt;
                    popup.classList.toggle("display-none");
                    return;
                }
                if (step == qnum) {
                    //No more question left in this round
                    document.querySelector('#info').innerHTML = "This is the last question!<br/>Environment = " + env_pt + "<br/>Happiness = " + com_pt;
                    popup.classList.toggle("display-none");
                    return;
                }
                showQuestion(step);
            };
            choiceButton.querySelector('#option').setAttribute("id", "option" + choiceInfo[j].ID); //Set unique id for each button
            document.querySelector("#choices-go-here").appendChild(choiceButton);
        }
    }

    //Close modal and return to main page
    closePopup.addEventListener('click', () => {
        window.location.replace("/");
    });

}


document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        console.info("Document fully loaded.");
        init();
    }
};

