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

  ajaxGET(`/users/${sessionStorage.getItem("userId")}`, (data, status) => {
    if (data) {
      console.log("status:", status)
      const {user, message} = JSON.parse(data);
      if (status !== 200) {
        document.getElementById("profile-error-message").innerHTML = message; 
      } else {
        document.getElementById("name-input").value = user.name;
        document.getElementById("email-input").value = user.email;
      }
    }
  });
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    console.info("Document fully loaded.");
    init();
  }
};
