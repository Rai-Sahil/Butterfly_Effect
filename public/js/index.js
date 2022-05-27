"use strict";

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

  // Check if player has a playthrough in progress to display "Continue"
  ajaxGET("/playthrough", (data, status) => {
    if (data) {
      const { message, playthrough } = JSON.parse(data);
      if (status !== 200) {
        console.error(message);
      } else {
        if (playthrough && !playthrough.is_complete) {
          document.getElementById("continue").hidden = false;
        }
      }
    } else {
      console.error("No data in response");
    }
  });
}

document.onreadystatechange = () =>
  document.readyState === "complete" && init();
