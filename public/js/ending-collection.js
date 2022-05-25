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

    ajaxGET("/endings", (data) => {
        const parsedData = JSON.parse(data);
        const endings = parsedData.endings;
        console.log(endings);
        for (let i = 0; i < endings.length; i++) {
            document.getElementById("ending-" + endings[i].ending_id).classList.toggle("display-none");
        }
    });




}

document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        console.info("Document fully loaded.");
        init();
    }
};
