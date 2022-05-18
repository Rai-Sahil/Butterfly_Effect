"use strict";

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
    callback(this.responseText, this.status);
  };
  xhr.open("POST", url);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(params);
}

function addNewUser() {
  const name = document.getElementById("new-user-name").value;
  const email = document.getElementById("new-user-email").value;
  const password = document.getElementById("new-user-password").value;
  const params = "name=" + name + "&email=" + email + "&password=" + password;
  ajaxPOST(
    "/users",
    (data, status) => {
      if (data) {
        const { message } = JSON.parse(data);
        const statusMessageHTML = document.getElementById(
          "dashboard-status-message"
        );
        statusMessageHTML.innerHTML = message;
        if (status !== 200) {
          statusMessageHTML.style.color = "red";
        } else {
          statusMessageHTML.style.color = "green";
          loadUsers();
          document.getElementById("addnew").disabled = false;
        }
      } else {
        statusMessageHTML.innerHTML = "No data in reponse.";
      }
    },
    params
  );
}

function addNewUserRow() {
  const tableBody = document.getElementById("user-table-body");
  const template = document.getElementById("template-new-user-row");
  tableBody.prepend(template.content.cloneNode(true));
  document.getElementById("addnew").disabled = true;
}

const loadUsers = () => ajaxGET("/users", (data, status) => {
    const { users, message } = JSON.parse(data);
    if (status !== 200) {
      console.error(message);
    } else {
      const userTableBody = document.getElementById("user-table-body");
      userTableBody.innerHTML = "";
      const template = document.getElementById("template-user-row");
      users.forEach(({ uuid, name, email, role }) => {
        let userRow = template.content.cloneNode(true);
        userRow.getElementById("user-id").id = uuid;
        userRow.querySelector(".name-input").value = name;
        userRow.querySelector(".email-input").value = email;
        userTableBody.appendChild(userRow);
      });
    }
  });

loadUsers();

function init() {
  
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    console.info("Document fully loaded.");
    init();
  }
};
