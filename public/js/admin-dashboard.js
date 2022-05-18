"use strict";

function addNewUser() {
  const tableBody = document.getElementById("user-table-body");
  const template = document.getElementById("template-new-user-row"); 
  tableBody.prepend(template.content.cloneNode(true));
  document.getElementById("addnew").disabled = true;
}

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

  ajaxGET("/users", (data, status) => {
    const { users, message } = JSON.parse(data);
    if (status !== 200) {
      console.error(message);
    } else {
      const userTableBody = document.getElementById("user-table-body");

      const template = document.getElementById("template-user-row");
      users.forEach(({ name, email, role }) => {
        let userRow = template.content.cloneNode(true);
        userRow.querySelector(".name-input").value = name;
        userRow.querySelector(".email-input").value = email;
        userTableBody.appendChild(userRow);
      });
    }
  });
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    console.info("Document fully loaded.");
    init();
  }
};
