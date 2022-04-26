

console.log("Client script loaded.");

function ajaxGET(path, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            callback(this.responseText);
        }
    }
    xhr.open("GET", path);
    xhr.send();
}

ajaxGET("/data/newsfeed", function(data) {
    //console.log(data);
    document.getElementById("newsfeed").innerHTML = data;
});


document.querySelector("#click4NewsFeed").addEventListener("click", function(e) {
    e.preventDefault();

    ajaxGET("/data/newsfeed", function(data) {
        //console.log(data);
        document.getElementById("newsfeed2").innerHTML = data;
    });

}, false);
