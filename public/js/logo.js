"use strict";

let image = document.getElementById("image");
let images = ["./img/Butterfly_flaps_up.svg", "./img/Butterfly_flaps_down.svg"];
setInterval(function () {
  let random = Math.floor(Math.random() * 2);
  image.src = images[random];
}, 250);
