var env_pt = 50; //Environment value at start, 0-100
var com_pt = 50; //Comfort value at start, 0-100

function init() {
    console.log("Client script loaded.");

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



    ajaxGET("/playthrough", function (data) {
        let p_id = JSON.parse(data).playthrough.id;

        ajaxGET("/playthrough/questions?playthroughId=" + p_id, function (data) {
            let pdata = JSON.parse(data).questions;
            let cardTemplate = document.getElementById("decision-pin");

            for (let i = 0; i < pdata.length; i++) {
                ajaxGET("/choice-by-id?cid=" + pdata[i].selected_choice_id, function (data) {
                    let cards = cardTemplate.content.cloneNode(true);
                    let choiceInfo = JSON.parse(data);
                    console.log(choiceInfo);
                    cards.querySelector(".decision-count").innerHTML = (pdata.length - i);
                    cards.querySelector(".decision-content").innerHTML = pdata[i].text;
                    cards.querySelector(".selected-choice").innerHTML = choiceInfo[0].text;
                    if(choiceInfo[0].env_pt > 0){
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
