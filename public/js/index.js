"use strict";

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

  // @TODO notify user if playthrough fails to start 
  document.getElementById("start").onclick = function (event) {
    event.preventDefault();
    ajaxPOST(
      "/playthrough",
      function (data, status) {
        if (data) {
          const { playthroughId, questionId, message } = JSON.parse(data);
          if (status == 200) {
            sessionStorage.setItem("playthroughId", playthroughId);
            sessionStorage.setItem("questionId", questionId);
            window.location.replace("/game");
          } else {
            console.error(message);
          }
        } else {
          console.error("No data in response.");
        }
      },
      ""
    );
  };

  document.getElementById("continue").onclick = function (event) {
    event.preventDefault();
    ajaxGET("/playthrough", (data, status) =>{
      if (data) {
        const x = JSON.parse(data);
        console.log(x)
      } else {
        console.error("No data in response");
      }
    });
  }
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    console.info("Document fully loaded.");
    init();
  }
};
