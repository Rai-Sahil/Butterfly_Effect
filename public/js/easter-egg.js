var Ymax = 8;
var Xmax = 8;
var Tmax = 500;

const floatimages = Array(30).fill(
  "https://i.pinimg.com/originals/73/25/b5/7325b5da1c12314824328579aeed59f4.gif"
);

var butterfly_speed =
  navigator.appName.indexOf("Netscape") >= 0 &&
  parseFloat(navigator.appVersion) >= 2 &&
  parseFloat(navigator.appVersion) < 2
    ? true
    : false;
var Moving_Index = document.all ? true : false;
var navigate_Fly =
  parseFloat(navigator.appVersion) >= 5 &&
  navigator.appName.indexOf("Netscape") >= 0
    ? true
    : false;
var wind_w,
  wind_h,
  t = "",
  IDs = new Array();
for (i = 0; i < floatimages.length; i++) {
  t += butterfly_speed
    ? '<layer name="pic' +
      i +
      '" visibility="hide" width="10" height="10"><a href="javascript:hidebutterfly()">'
    : '<div id="pic' +
      i +
      '" style="position:absolute; visibility:hidden;width:5px; height:5px; z-index:3000"><a href="javascript:hidebutterfly()">';
  t +=
    '<img src="' +
    floatimages[i] +
    '" name="p' +
    i +
    '" border="0" style="height: 100px; display:none" id="hide' +
    i +
    '">';
  t += butterfly_speed ? "</a></layer>" : "</a></div>";
}
document.write(t);

function moveimage(num) {
  if (getidleft(num) + IDs[num].W + IDs[num].Xstep >= wind_w + getscrollx())
    IDs[num].Xdir = false;
  if (getidleft(num) - IDs[num].Xstep <= getscrollx()) IDs[num].Xdir = true;
  if (getidtop(num) + IDs[num].H + IDs[num].Ystep >= wind_h + getscrolly())
    IDs[num].Ydir = false;
  if (getidtop(num) - IDs[num].Ystep <= getscrolly()) IDs[num].Ydir = true;
  moveidby(
    num,
    IDs[num].Xdir ? IDs[num].Xstep : -IDs[num].Xstep,
    IDs[num].Ydir ? IDs[num].Ystep : -IDs[num].Ystep
  );
}

function getnewprops(num) {
  IDs[num].Ydir = Math.floor(Math.random() * 17) > 10;
  IDs[num].Xdir = Math.floor(Math.random() * 17) > 10;
  IDs[num].Ystep = Math.ceil(Math.random() * Ymax);
  IDs[num].Xstep = Math.ceil(Math.random() * Xmax);
  setTimeout("getnewprops(" + num + ")", Math.floor(Math.random() * Tmax));
}

function getscrollx() {
  if (butterfly_speed || navigate_Fly) return window.pageXOffset;
  if (Moving_Index) return document.body.scrollLeft;
}

function getscrolly() {
  if (butterfly_speed || navigate_Fly) return window.pageYOffset;
  if (Moving_Index) return document.body.scrollTop;
}

function getid(name) {
  if (butterfly_speed) return document.layers[name];
  if (Moving_Index) return document.all[name];
  if (navigate_Fly) return document.getElementById(name);
}

function moveidto(num, x, y) {
  if (butterfly_speed) IDs[num].moveTo(x, y);
  if (Moving_Index || navigate_Fly) {
    IDs[num].style.left = x + "px";
    IDs[num].style.top = y + "px";
  }
}

function getidleft(num) {
  if (butterfly_speed) return IDs[num].left;
  if (Moving_Index || navigate_Fly) return parseInt(IDs[num].style.left);
}

function getidtop(num) {
  if (butterfly_speed) return IDs[num].top;
  if (Moving_Index || navigate_Fly) return parseInt(IDs[num].style.top);
}

function moveidby(num, dx, dy) {
  if (butterfly_speed) IDs[num].moveBy(dx, dy);
  if (Moving_Index || navigate_Fly) {
    IDs[num].style.left = getidleft(num) + dx + "px";
    IDs[num].style.top = getidtop(num) + dy + "px";
  }
}

function getwindowwidth() {
  if (butterfly_speed || navigate_Fly) return window.outerWidth * 1.2;
  if (Moving_Index) return document.body.clientWidth;
}

function getwindowheight() {
  if (butterfly_speed || navigate_Fly) return window.outerHeight * 1.2;
  if (Moving_Index) return document.body.clientHeight;
}

function init() {
  wind_w = getwindowwidth();
  wind_h = getwindowheight();
  for (i = 0; i < floatimages.length; i++) {
    IDs[i] = getid("pic" + i);
    if (butterfly_speed) {
      IDs[i].W = IDs[i].document.images["p" + i].width;
      IDs[i].H = IDs[i].document.images["p" + i].height;
    }
    if (navigate_Fly || Moving_Index) {
      IDs[i].W = document.images["p" + i].width;
      IDs[i].H = document.images["p" + i].height;
    }
    getnewprops(i);
    moveidto(
      i,
      Math.floor(Math.random() * (wind_w - IDs[i].W)),
      Math.floor(Math.random() * (wind_h - IDs[i].H))
    );
    if (butterfly_speed) IDs[i].visibility = "show";
    if (Moving_Index || navigate_Fly) IDs[i].style.visibility = "visible";
    startfly = setInterval(
      "moveimage(" + i + ")",
      Math.floor(Math.random() * 100) + 100
    );
  }
}

if (butterfly_speed || navigate_Fly || Moving_Index) {
  window.onload = init;
  window.onresize = function () {
    wind_w = getwindowwidth();
    wind_h = getwindowheight();
  };
}

function hidebutterfly() {
  for (i = 0; i < floatimages.length; i++) {
    if (Moving_Index)
      eval("document.all.pic" + i + ".style.visibility='hidden'");
    else if (navigate_Fly)
      document.getElementById("pic" + i).style.visibility = "hidden";
    else if (butterfly_speed) eval("document.pic" + i + ".visibility='hide'");
    clearInterval(startfly);
  }
}

function show() {
  for (i = 0; i < floatimages.length; i++) {
    document.querySelector("#hide" + i).style.display = "flex";
  }
}
