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

function ajaxDELETE(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", url);
  xhr.send();
  xhr.onload = function () {
    callback(this.responseText, this.status);
  };
  xhr.onerror = function () {
    console.error("NO CONNECTION");
  };
}

function addNewUser() {
  const name = document.getElementById("new-user-name").value;
  const email = document.getElementById("new-user-email").value;
  const password = document.getElementById("new-user-password").value;
  const params = "name=" + name + "&email=" + email + "&password=" + password;
  ajaxPOST(
    "/users",
    (data, status) => {
      const statusMessageHTML = document.getElementById(
        "dashboard-status-message"
      );
      if (data) {
        const { message } = JSON.parse(data);

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

function enableEdit(element, attribute) {
  element.closest("td").querySelector(`.${attribute}-input`).disabled = false;
  element.querySelector(".material-icons").innerHTML = "save";
  element.onclick = function () {
    return saveChanges(element, attribute);
  };
}

function saveChanges(element, attribute) {
  const value = element
    .closest("tr")
    .querySelector(`.${attribute}-input`).value;
  const param = `${attribute}=${value}`;
  ajaxPUT(
    `users/${element.closest("tr").id}`,
    (data, status) => {
      const statusMessageHTML = document.getElementById(
        "dashboard-status-message"
      );
      if (data) {
        const { message } = JSON.parse(data);

        statusMessageHTML.innerHTML = message;
        if (status !== 200) {
          statusMessageHTML.style.color = "red";
        } else {
          statusMessageHTML.style.color = "green";
          element.querySelector(".material-icons").innerHTML = "edit";
          element
            .closest("td")
            .querySelector(`.${attribute}-input`).disabled = true;
          element.onclick = function () {
            enableEdit(element, attribute);
          };
        }
      } else {
        statusMessageHTML.innerHTML = "No data in reponse.";
      }
    },
    param
  );
}

function deleteUser() {
  ajaxDELETE(`users/${this.closest("tr").id}`, (data, status) => {
    const statusMessageHTML = document.getElementById(
      "dashboard-status-message"
    );
    if (data) {
      const { message } = JSON.parse(data);

      statusMessageHTML.innerHTML = message;
      if (status !== 200) {
        statusMessageHTML.style.color = "red";
      } else {
        statusMessageHTML.style.color = "green";
        loadUsers();
      }
    } else {
      statusMessageHTML.innerHTML = "No data in reponse.";
    }
  });
}

const loadUsers = () =>
  ajaxGET("/users", (data, status) => {
    const { users, message } = JSON.parse(data);
    if (status !== 200) {
      statusMessageHTML.innerHTML = message;
    } else {
      const userTableBody = document.getElementById("user-table-body");
      userTableBody.innerHTML = "";
      const template = document.getElementById("template-user-row");
      users.forEach(({ uuid, name, email, role }) => {
        let userRow = template.content.cloneNode(true);
        userRow.getElementById("user-id").id = uuid;
        userRow.querySelector(".name-input").value = name;
        userRow.querySelector(".email-input").value = email;
        userRow.querySelector(".name-edit").onclick = function () {
          enableEdit(this, "name");
        };
        userRow.querySelector(".email-edit").onclick = function () {
          enableEdit(this, "email");
        };
        userRow.querySelector(".password-edit").onclick = function () {
          enableEdit(this, "password");
        };
        userRow.querySelector(".delete-user").onclick = deleteUser;
        userTableBody.appendChild(userRow);
      });
    }
  });

document.onreadystatechange = () =>
  document.readyState === "complete" && loadUsers();  
