"use strict";

function initsignup() {
  function DelayRedirect2() {
    setTimeout(function () {
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

  // Event listener to make signup request to server.
  document
    .querySelector("#signup-submit")
    .addEventListener("click", function (event) {
      event.preventDefault();
      const name = document.getElementById("signup-name");

      const email = document.getElementById("signup-email");
      const password = document.getElementById("signup-password");
      const queryString =
        "name=" +
        name.value +
        "&email=" +
        email.value +
        "&password=" +
        password.value;

      ajaxPOST(
        "/signup",
        function (data, status) {
          if (data) {
            const responseJSON = JSON.parse(data);

            if (status != 200) {
              document.getElementById("signup-error-message").innerHTML =
                responseJSON.message;
                document
                .getElementById("signup-email")
                .addEventListener("click", function (e) {
                  document.getElementById("signup-error-message").innerHTML = "";
                });
            } else {
              sessionStorage.setItem("userId", responseJSON.user.uuid);
             
              DelayRedirect2();
            }
          }
        },
        queryString
      );
    });
}



document.addEventListener('readystatechange', (event) => {
  
    if (document.readyState === "complete") {
      initsignup();
    }
  }
  
  );








