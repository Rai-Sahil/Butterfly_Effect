function init() {
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

  ajaxGET(`/ending/${sessionStorage.getItem("userId")}`, (data, status) => {
    const {message, endings} = JSON.parse(data);
    if (status === 200) {
      endings.forEach((ending) => {
        console.log(ending)
      })
    } else {
      console.error(message);
    }
  });
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    console.info("Document fully loaded.");
    init();
  }
};
