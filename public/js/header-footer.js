"use strict";

async function loadComponentToId(nodeId, component) {
  await fetch(component)
    .then(res => res.text())
    .then(body => document.querySelector(nodeId).innerHTML = body)
}

async function loadHeaderFooter() {
  await loadComponentToId("#header-placeholder", "../html/components/header.html");
  await loadComponentToId("#footer-placeholder", "../html/components/footer.html");
}


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

loadHeaderFooter().then(() => {ajaxGET("/checkadmin", async function (isAdmin) {
  if (await JSON.parse(isAdmin)) {
    document.querySelector('#admin-dashboard').classList.toggle('display-none');
    document.querySelector('#game-editor').classList.toggle('display-none');
  }
});});
