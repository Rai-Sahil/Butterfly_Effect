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

    ajaxGET("/endings", (data) => {
        const parsedData = JSON.parse(data);
        const endings = parsedData.endings;
        if (endings.length == 0) {
            document.querySelector("#options").innerHTML +=  "<li>No collected ending.</li>";
            return;
        }
        for (let i = 0; i < endings.length; i++) {
            document.getElementById("ending-" + endings[i].ending_id).classList.toggle("display-none");
            document.getElementById("ending-" + endings[i].ending_id).href = "ending-details?id="+ endings[i].ending_id +"&type=" + endings[i].type + "&threshold=" + endings[i].threshold + "&text=" + endings[i].text;
        }
        for (let j = 0; j < (6 - endings.length); j++) {
            document.querySelector("#options").innerHTML +=  "<li>?</li>";
        }
    });




}

document.onreadystatechange = () =>
  document.readyState === "complete" && init();
  