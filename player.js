let tg = window.Telegram.WebApp;
let hls = new Hls();

var urlParams = new URLSearchParams(window.location.search);
var data = JSON.parse(urlParams.get("data"));
var video = document.getElementById("video");
var videoName = document.getElementById("video_name");

var prevDiv = document.getElementById("div_prev");
var nextDiv = document.getElementById("div_next");
var skipDiv = document.getElementById("div_skip");

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

function playEpisode(url){
  cachingNodes = JSON.parse(httpGet("https://api.anilibria.tv/v2/getCachingNodes"));
  checkForErrors(cachingNodes, url).then((link) => link && playM3u8(link))
}

const checkForErrors = async (array, episode) => {
  for (const node of array) {
    const url = 'https://'+node+episode;
    try {
      const res = await fetch(url);
      console.log(url);
      if (res.ok) {
        console.log(url);
        return url;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

function httpGet(theUrl)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false);
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

function nextVideo() {
  if (nextState){
    playEpisode(data["episodes"][currentVideo + 1]["url"]);
    currentVideo += 1;
    controlUpdate();
  }
}

function skipVideo() {
  video.currentTime += 60;
}

function prevVideo() {
  if (prevState){
    playEpisode(data["episodes"][currentVideo - 1]["url"]);
    currentVideo -= 1;
    controlUpdate();
  }
}

skipDiv.addEventListener('click', function (event) {
  skipVideo()
});

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

video.addEventListener("ended", function (e) {
  nextVideo();
});

$(window).on("load", function () {
  playEpisode(data["episodes"][0]["url"]);
  controlUpdate();
});

screen.addEventListener("orientationchange", function () {
  console.log("The orientation of the screen is: " + screen.orientation);
});
