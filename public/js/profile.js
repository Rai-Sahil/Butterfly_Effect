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
      const {user, message} = JSON.parse(data);
      console.log("user:", user)
      if (status !== 200) {
        document.getElementById("profile-error-message").innerHTML = message; 
      } else {
        document.getElementById("name-input").value = user.name;
        document.getElementById("email-input").value = user.email;
      }
    }
  });

  document.getElementById("name-edit").addEventListener("click", ()=> {
    document.getElementById("name-input").disabled = false;
    document.getElementById("email-input").disabled = true;
    document.getElementById("password-input").disabled = true;
  })

  document.getElementById("email-edit").addEventListener("click", () => {
    document.getElementById("name-input").disabled = true;
    document.getElementById("email-input").disabled = false;
    document.getElementById("password-input").disabled = true;
  });

  document.getElementById("password-edit").addEventListener("click", () => {
    document.getElementById("name-input").disabled = true;
    document.getElementById("email-input").disabled = true;
    document.getElementById("password-input").disabled = false;
  });
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    console.info("Document fully loaded.");
    init();
  }
};
