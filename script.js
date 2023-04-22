function setVolume(audio, volume) {
	if (volume > 1) {
		volume = 1;
	} else if (volume < 0) {
		volume = 0;
	}
	audio.volume = volume;
}

function stopAllTracks() {
    // get all audio elements
    const tracks = document.getElementsByTagName('audio');

    // stop each track and clear any fade-out interval
    for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        if (!track.paused) {
            track.pause();
            track.currentTime = 0;
        }
        const fadeOutInterval = track.fadeOutInterval;
        if (fadeOutInterval) {
            clearInterval(fadeOutInterval);
            delete track.fadeOutInterval;
        }
    }
}

function playTrack(trackId) {
    // get audio element by trackId
    const audio = document.getElementById(trackId);

    // stop all other playing tracks
    stopAllTracks(trackId);

    // play audio immediately without fading in/out
    audio.volume = 1;
    audio.currentTime = 0;
    audio.play();
}



function fadeOut(audio, fadeOutTime) {
	// gradually decrease volume to 0 with fadeOutTime seconds
	const fadeInterval = setInterval(() => {
		if (audio.volume > 0) {
			setVolume(audio, audio.volume - 0.1);
		} else {
			clearInterval(fadeInterval);
			audio.pause();
		}
	}, fadeOutTime * 1000 / 10);
}


function instantStop() {
	const audioElements = document.getElementsByTagName('audio');
	for (let i = 0; i < audioElements.length; i++) {
		if (!audioElements[i].paused) {
			audioElements[i].pause();
			audioElements[i].currentTime = 0;
		}
	}
}
