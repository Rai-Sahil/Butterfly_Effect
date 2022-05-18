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

     

      ajaxGET("/playthrough", function (data){
        let pdata = JSON.parse(data);
        let p_id = pdata.playthrough.id;
        console.log(p_id);


        ajaxGET("/playthrough/questions?playthroughId=" + p_id, function (data){
            let pdata = JSON.parse(data);
            // let p_id = pdata.playthrough.id;
            console.log(pdata);
          });

      });







}

document.onreadystatechange = () => {
    if (document.readyState === "complete") {
      console.info("Document fully loaded.");
      init();
    }
  };