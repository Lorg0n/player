let tg = window.Telegram.WebApp;

var urlParams = new URLSearchParams(window.location.search);
var video = document.getElementById('video');

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
    }
	else if (video.canPlayType('application/vnd.apple.mpegurl')) {
		video.src = url;
		video.addEventListener('canplay',function() {
		  video.play();
		});
		video.volume = 0.3;
		document.title = url;
  	}
}

function playPause() {
    video.paused?video.play():video.pause();
}

function volumeUp() {
    if(video.volume <= 0.9) video.volume+=0.1;
}

function volumeDown() {
    if(video.volume >= 0.1) video.volume-=0.1;
}

function seekRight() {
    video.currentTime+=5;
}

function seekLeft() {
    video.currentTime-=5;
}

function vidFullscreen() {
    if (video.requestFullscreen) {
      video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
  } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    }
}

nextPlay = () => {
    console.log('[!] Open next link!')
    window.open(urlParams.get('next_link'),"_self")
}


Telegram.WebApp.onEvent('viewportChanged', function(e){
    video.style.width = tg.viewportHeight;
})

playM3u8(urlParams.get('video'))
$(window).on('load', function () {
    $('#video').on('click', function(){this.paused?this.play():this.pause();});
    $('#video').attr('poster', urlParams.get('poster'))
});
video.addEventListener('ended', nextPlay, false)
