"use strict";

function init() {
  console.info("Client script loaded.");

  const sign_in_btn = document.querySelector("#sign-in-btn");
  const sign_up_btn = document.querySelector("#sign-up-btn");
  const container = document.querySelector(".container");

  sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
  });

  sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
  });

  function slideIn() {
    var elem = document.getElementById("box1");
    elem.style.transition = "top 0.5s ease-in 0s";
    elem.style.top = "0";
  }

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
              sessionStorage.setItem("userId", responseJSON.user.uuid);
              slideIn();
              DelayRedirect();
            }
          }
        },
        queryString
      );
    });
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    console.info("Document fully loaded.");
    init();
  }
};

let image = document.getElementById("image");
let image2 = document.getElementById("image2");
let images = ["./img/blue.svg", "./img/blueflap.svg"];
setInterval(function () {
  let random = Math.floor(Math.random() * 2);
  image.src = images[random];
  image2.src = images[random];
}, 250);
