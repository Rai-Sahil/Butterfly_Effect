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

ajaxGET("/checkadmin", function (data, status) {
  console.log(data);
  console.log(status);
  // if (status != 200) {
  //   console.log(JSON.parse(data).message);
  //   return;
  // }
  // document.querySelector('#admin-dashboard').classList.toggle('display-none');
  // document.querySelector('#game-editor').classList.toggle('display-none');
});



function loadComponentToId(nodeId, component) {
  fetch(component)
    .then(res => res.text())
    .then(body => document.querySelector(nodeId).innerHTML = body)
}

loadComponentToId("#header-placeholder", "../html/components/header.html");
loadComponentToId("#footer-placeholder", "../html/components/footer.html");