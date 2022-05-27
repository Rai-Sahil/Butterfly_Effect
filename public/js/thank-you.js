"use strict";

const popup = document.getElementById("thankyou-popup");

function openPopup(){
    if (document.getElementById("user_name").value != "" 
    && document.getElementById("user_email").value != "" 
    && document.getElementById("message").value != "") {
        popup.classList.add("thankyou-openpopup");
    }
}