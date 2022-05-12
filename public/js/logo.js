"use strict";

let image = document.getElementById("image");
let image2 = document.getElementById("image2");
let images = ["./img/blue.svg", "./img/blueflap.svg"];
setInterval(function () {
  let random = Math.floor(Math.random() * 2);
  image.src = images[random];
  image2.src = images[random];
}, 250);
