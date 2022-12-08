let tg = window.Telegram.WebApp;

var urlParams = new URLSearchParams(window.location.search);
var data = JSON.parse(urlParams.get("data"))
var video = document.getElementById('video');
var videoName = document.getElementById('video_name')

var prevDiv = document.getElementById('div_prev');
var nextDiv = document.getElementById('div_next');

var currentVideo = 0;

function playM3u8(url){
    if(Hls.isSupported()) {
        video.volume = 0.3;
        var hls = new Hls();
        var m3u8Url = decodeURIComponent(url)
        hls.loadSource(m3u8Url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED,function() {
          video.play();
        });
        document.title = url
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('canplay',function() {
           video.play();
        });
        video.volume = 0.3;
        document.title = url;
    }
}

function nextVideo(){
    playM3u8(data["episodes"][currentVideo + 1]['url'])
    currentVideo += 1
}

function prevVideo(){
    playM3u8(data["episodes"][currentVideo - 1]['url'])
    currentVideo -= 1
}

function showControls(state){
    stateString = state ? 'visible' : 'hidden'
    if (state) {
        if (currentVideo > 0) {
            prevDiv.style.visibility = stateString
        } else if (currentVideo + 1 < data['episodes'].length) {
            nextDiv.style.visibility = stateString
        }
    } else {
        prevDiv.style.visibility = stateString
        nextDiv.style.visibility = stateString
    }
}

video.addEventListener('pause', function(e){
    showControls(true)
})

video.addEventListener('play', function(e){
    showControls(false)
})

Telegram.WebApp.onEvent('viewportChanged', function(e){
    video.style.width = tg.viewportHeight;
})

prevDiv.addEventListener('click', function (event) {
    prevVideo()
});

nextDiv.addEventListener('click', function (event) {
    nextVideo()
});

video.addEventListener('timeupdate', function(e){
    videoName.textContent = (parseInt(data['first']) + currentVideo) + " эпизод"
})

video.addEventListener('ended', function(e){
    if (data['autoplay'] && currentVideo < data['episodes'].length){
        nextVideo()
    }
})

$(window).on('load', function () {
    playM3u8(data['episodes'][0]['url'])
});
