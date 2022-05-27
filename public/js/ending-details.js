showDetails();

function showDetails() {
  let details = new URL(window.location.href);
  document.querySelector("#app-name").innerHTML =
    details.searchParams.get("type") + details.searchParams.get("threshold");
  document.querySelector(".text").innerHTML = details.searchParams.get("text");
  if (details.searchParams.get("type") === "environment") {
    document
      .getElementById("meter")
      .classList.add("circle-earth" + details.searchParams.get("threshold"));
    document.getElementById("comfort").src =
      "../img/environment" + details.searchParams.get("threshold") + ".png";
    document.getElementById("smiley").src = "../img/earth.svg";
  }
  if (details.searchParams.get("type") === "comfort") {
    document
      .getElementById("meter")
      .classList.add("circle-comfort" + details.searchParams.get("threshold"));
    document.getElementById("comfort").src =
      "../img/comfort" + details.searchParams.get("threshold") + ".png";
    document.getElementById("smiley").src = "../img/smileyface.svg";
  }
}
