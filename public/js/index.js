function init() {
  console.log("Client script loaded.");

  function ajaxGET(path, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        callback(this.responseText);
      }
    };
    xhr.open("GET", path);
    xhr.send();
  }

  // @TODO make necessary requests here, will be called after docxument load.
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    console.info("Document fully loaded.");
    init();
  }
};
