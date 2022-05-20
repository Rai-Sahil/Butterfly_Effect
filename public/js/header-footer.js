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

ajaxGET("/checkadmin", function (isAdmin) {
  if (JSON.parse(isAdmin)) {
    document.querySelector('#admin-dashboard').classList.toggle('display-none');
    document.querySelector('#game-editor').classList.toggle('display-none');
  }
});

function loadComponentToId(nodeId, component) {
  fetch(component)
    .then(res => res.text())
    .then(body => document.querySelector(nodeId).innerHTML = body)
}

loadComponentToId("#header-placeholder", "../html/components/header.html");
loadComponentToId("#footer-placeholder", "../html/components/footer.html");