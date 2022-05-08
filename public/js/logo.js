"use strict";

let image = document.getElementById("image");
let images = ["./img/blue.svg", "./img/blueflap.svg"];
setInterval(function () {
  let random = Math.floor(Math.random() * 2);
  image.src = images[random];
}, 250);
