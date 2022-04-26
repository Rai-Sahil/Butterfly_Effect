function init() {
    console.info("Client script loaded.")

    function ajaxPOST(url, callback, data) {
        let params = typeof data == "string" ? data : Object
        .keys(data)
        .map({
            function (key) {
                return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
            }
        })
        .join('&');
        console.info("ajaxPOST params: ", params);

        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                callback(this.responseText);

            } else {
                console.warn(this.status);
            }
        }
        xhr.open("POST", url);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params);
    }

    // Event listener to make login request to server.
    document.querySelector("#login-submit").addEventListener("click", function(event) {
        event.preventDefault();
        const email = document.getElementById("login-email");
        const password = document.getElementById("login-password");
        const queryString = "email=" + email.value + "&password=" + password.value;
    
        ajaxPOST("/login", function (data) {
            if (data) {
                const responseJSON = JSON.parse(data);
                if (responseJSON.status == "fail") {
                    document.getElementById("login-error-message").innerHTML = responseJSON.msg;
                } else {
                    sessionStorage.setItem("userId", responseJSON.user.ID)
                    window.location.replace("/");
                }
            }
        }, queryString);
    })
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        console.info("Document fully loaded.");
        init();
    }
}