"use strict";

function init() {
  console.info("Client script loaded.");

  function ajaxRequest(method, url, callback, data) {
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
    xhr.open(method, url);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
  }

  ajaxRequest("GET", `/users/${sessionStorage.getItem("userId")}`, (data, status) => {
    if (data) {
        const responseJSON = JSON.parse(data);
        console.log(responseJSON)
    }
  })
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    console.info("Document fully loaded.");
    init();
  }
};
