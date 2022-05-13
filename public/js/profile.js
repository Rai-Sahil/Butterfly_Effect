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
      const { user, message } = JSON.parse(data);
      console.log("user:", user);
      if (status !== 200) {
        document.getElementById("profile-error-message").innerHTML = message;
      } else {
        document.getElementById("name-input").value = user.name;
        document.getElementById("email-input").value = user.email;
      }
    }
  });

  function ajaxPUT(url, callback, data) {
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
    xhr.open("PUT", url);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
  }

  document.getElementById("name-edit").addEventListener("click", () => {
    document.getElementById("name-input").disabled = false;
    document.getElementById("email-input").disabled = true;
    document.getElementById("password-input").disabled = true;
  });

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

  function updateInputElement(id) {
    return (data, status) => {
      const { message } = JSON.parse(data);
      const statusMessageHTML = document.getElementById(
        "profile-status-message"
      );
      statusMessageHTML.innerHTML = message;
      if (status != 200) {
        statusMessageHTML.style.color = "red";
      } else {
        statusMessageHTML.style.color = "green";
        document.getElementById(id).disabled = true;
      }
    };
  }

  document.getElementById("name-save").addEventListener("click", () => {
    const newName = document.getElementById("name-input").value;
    const queryString = `name=${newName}`;
    ajaxPUT(
      `/users/${sessionStorage.getItem("userId")}`,
      updateInputElement("name-input"),
      queryString
    );
  });

  document.getElementById("email-save").addEventListener("click", () => {
    const newName = document.getElementById("email-input").value;
    const queryString = `email=${newName}`;
    ajaxPUT(
      `/users/${sessionStorage.getItem("userId")}`,
      updateInputElement("email-input"),
      queryString
    );
  });

  document.getElementById("password-save").addEventListener("click", () => {
    const newName = document.getElementById("password-input").value;
    const queryString = `password=${newName}`;
    ajaxPUT(
      `/users/${sessionStorage.getItem("userId")}`,
      updateInputElement("password-input"),
      queryString
    );
  });
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    console.info("Document fully loaded.");
    init();
  }
};
