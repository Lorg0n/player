let tg = window.Telegram.WebApp;
let hls = new Hls();

var urlParams = new URLSearchParams(window.location.search);
var data = JSON.parse(urlParams.get("data"));
var video = document.getElementById("video");
var videoName = document.getElementById("video_name");

var prevDiv = document.getElementById("div_prev");
var nextDiv = document.getElementById("div_next");

var nextState = false;
var prevState = false;

var currentVideo = 0;

function playM3u8(url) {
  if (Hls.isSupported()) {
    video.volume = 0.3;
    var m3u8Url = decodeURIComponent(url);
    hls.loadSource(m3u8Url);
    hls.attachMedia(video);
    document.title = url;
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = url;
    video.volume = 0.3;
    document.title = url;
  }
}

function nextVideo() {
  if (nextState){
    playM3u8(data["episodes"][currentVideo + 1]["url"]);
    currentVideo += 1;
  }
}

function prevVideo() {
  if (prevState){
    playM3u8(data["episodes"][currentVideo - 1]["url"]);
    currentVideo -= 1;
  }
}

prevDiv.addEventListener('click', function (event) {
  prevVideo()
});

nextDiv.addEventListener('click', function (event) {
  nextVideo()
});

Telegram.WebApp.onEvent("viewportChanged", function (e) {
  video.style.width = tg.viewportHeight;
});

function controlUpdate(){
  videoName.textContent = (parseInt(data['first']) + currentVideo) + " ЭПИЗОД"
  if (currentVideo > 0) {
    prevState = true;
    var svg = prevDiv.querySelector('svg');
    svg.style.fill = "#FFFFFF";
  } else {
    prevState = false;
    var svg = prevDiv.querySelector('svg');
    svg.style.fill = "#606060";
  }
  if (currentVideo + 1 < data['episodes'].length) {
    nextState = true;
    var svg = nextDiv.querySelector('svg');
    svg.style.fill = "#FFFFFF";
  } else { 
    nextState = false;
    var svg = nextDiv.querySelector('svg');
    svg.style.fill = "#606060";
  }
}

window.setInterval(function () {
  controlUpdate();
}, 0.1);

video.addEventListener("ended", function (e) {
  if (data["autoplay"] && currentVideo < data["episodes"].length) {
    nextVideo();
  }
});

$(window).on("load", function () {
  playM3u8(data["episodes"][0]["url"]);
});
