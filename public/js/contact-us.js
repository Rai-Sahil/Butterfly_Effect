"use strict";

(function () {
    emailjs.init('OlvXpRhzN0mp_r2d0');
})();

window.onload = function () {
    document.getElementById('contact-form').addEventListener('submit', function (event) {
        event.preventDefault();
        var params = {
            from_name: document.getElementById("user_name").value,
            email_id: document.getElementById("user_email").value,
            message: document.getElementById("message").value
        }
        emailjs.send('service_aar4kv5', 'template_xjczf8h', params)
    });
}
