$(function () {
    $('#myCarousel').carousel({
        interval: 3500
    });
    
});

$(window).load(function () {
    var currentUrl = window.location.href;
    var musicUrl = currentUrl.substring(0, currentUrl.indexOf('/') + 1) + "music/Lisa Ekdahl - I Don't Miss You Anymore.mp3";
    if (currentUrl.substring(0, 4) != 'http') {
        musicUrl = currentUrl.substring(0, currentUrl.indexOf('src') + 4) + "music/Lisa Ekdahl - I Don't Miss You Anymore.mp3";
    }

    var lastPartUrl = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
    var jPlayer_currentTime = parseInt($.cookie('jPlayer_currentTime'));
    if (jPlayer_currentTime == null || lastPartUrl == 'index.html' || lastPartUrl.indexOf('.com') != -1) {
        jPlayer_currentTime = 0;
    }

    $('#jpId').jPlayer({
        volume: 0.2,
        ready: function () {
            $(this).jPlayer('setMedia', {
                mp3: musicUrl// Defines the mp3 url
            }).jPlayer('play', jPlayer_currentTime);
        },
        ended: function () { // The $.jPlayer.event.ended event
            $(this).jPlayer("play"); // Repeat the media
        }
    })
    $('#footer-text').append('<li><a title="Pause" class="speaker-play" href="javascript:void(0)">speaker</a></li><li style="line-height: 48px;margin: 0 20px;">CopyRight &copy; ' + new Date().getFullYear() + ' TouVision </li>');

    $('.speaker-play').click(function () {
        var title = $(this).attr('title');
        if (title == 'Pause') {
            $(this).attr("title", 'Play');
            $('#jpId').jPlayer('pause');
        }
        else {
            $(this).attr("title", 'Pause');
            $('#jpId').jPlayer('play');
        }
        $(this).toggleClass('speaker-pause');
    });

});

$(window).unload(function () {
    $.cookie('jPlayer_currentTime', $('#jpId').data("jPlayer").status.currentTime, { path: '/' });
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-35020526-1']);
_gaq.push(['_trackPageview']);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

