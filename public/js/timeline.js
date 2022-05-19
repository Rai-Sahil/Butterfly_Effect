var env_pt = 50; //Environment value at start, 0-100
var com_pt = 50; //Comfort value at start, 0-100

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



    ajaxGET("/playthrough").then(function (data) {
        let p_id = JSON.parse(data).playthrough.id;

        ajaxGET("/playthrough/questions?playthroughId=" + p_id).then(async function (data) {
            let pdata = JSON.parse(data).questions;
            console.log(pdata);

            let cardTemplate = document.getElementById("decision-pin");
            for (let i = pdata.length; i > 0; i--) {
                await ajaxGET("/choice-by-id?cid=" + pdata[i-1].selected_choice_id).then(function (data) {
                    let cards = cardTemplate.content.cloneNode(true);
                    let choiceInfo = JSON.parse(data);
                    cards.querySelector(".decision-count").innerHTML = i;
                    cards.querySelector(".decision-content").innerHTML = pdata[i-1].text;
                    cards.querySelector(".selected-choice").innerHTML = choiceInfo[0].text;
                    if (choiceInfo[0].env_pt > 0) {
                        cards.querySelector("#env-change").innerHTML = "+" + choiceInfo[0].env_pt;
                    } else {
                        cards.querySelector("#env-change").innerHTML = choiceInfo[0].env_pt;
                    }
                    if (choiceInfo[0].com_pt > 0) {
                        cards.querySelector("#com-change").innerHTML = "+" + choiceInfo[0].com_pt;
                    } else {
                        cards.querySelector("#com-change").innerHTML = choiceInfo[0].com_pt;
                    }

                    //Calculate the env_pt and com_pt
                    env_pt += choiceInfo[0].env_pt;
                    cards.querySelector("#env-meter").style.width = env_pt + "%";
                    com_pt += choiceInfo[0].com_pt;
                    cards.querySelector("#com-meter").style.width = com_pt + "%";

                    document.querySelector("#cards-go-here").appendChild(cards);
                });
            }
        });
    });
}

document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        console.info("Document fully loaded.");
        init();
    }
};
