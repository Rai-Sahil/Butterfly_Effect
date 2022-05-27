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
    const { message, endings } = JSON.parse(data);
    if (status === 200) {
      endings.forEach((ending) => {
        document.getElementById(`${ending.type}-ending-text`).innerHTML =
          ending.text;
        document.getElementById(
          `${ending.type}-ending-image`
        ).src = `/img/${ending.type}${ending.threshold}.png`;
        const meter = document.getElementById(`${ending.type}-ending-meter`);
        const radius = meter.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        const offset = (ending.earned_points / 100) * circumference;
        meter.style.strokeDasharray = `${offset} ${circumference - offset}`;
        meter.style.strokeDashoffset = offset;
      });
    } else {
      console.error(message);
    }
  });
}

document.onreadystatechange = () =>
  document.readyState === "complete" && init();
