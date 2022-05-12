"use strict";

function init() {
  console.info("Client script loaded.");

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

  ajaxGET(`/users/${sessionStorage.getItem("userId")}`, (data, status) => {
    if (data) {
      const responseJSON = JSON.parse(data);
      console.log(responseJSON);
    }
  });
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    console.info("Document fully loaded.");
    init();
  }
};
