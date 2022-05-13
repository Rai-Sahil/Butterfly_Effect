"use strict";

function initlogin() {
  console.info("Client script loaded.");

  function DelayRedirect() {
    setTimeout(function () {
      // dvCountDown.style.display = "none";
      window.location.replace("/");
    }, 1000);
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

  // Event listener to make login request to server.
  document
    .querySelector("#login-submit")
    .addEventListener("click", function (event) {
      event.preventDefault();
      const email = document.getElementById("login-email");
      const password = document.getElementById("login-password");
      const queryString =
        "email=" + email.value + "&password=" + password.value;

      ajaxPOST(
        "/login",
        function (data, status) {
          if (data) {
            const responseJSON = JSON.parse(data);

            if (status != 200) {
              document.getElementById("login-error-message").innerHTML =
                responseJSON.message;
            } else {
              sessionStorage.setItem("userId", responseJSON.user.ID);
              
              DelayRedirect();
            }
          }
        },
        queryString
      );
    });
}



document.addEventListener('readystatechange', (event) => {
  
  if (document.readyState === "complete") {
    console.info("Init login Starting Now");
    initlogin();
  }
}

);

let image = document.getElementById("image");
let image2 = document.getElementById("image2");
let images = ["./img/blue.svg", "./img/blueflap.svg"];
setInterval(function () {
  let random = Math.floor(Math.random() * 2);
  image.src = images[random];
  image2.src = images[random];
}, 250);
