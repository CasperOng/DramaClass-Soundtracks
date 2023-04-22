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

function playTrack(trackName) {
	var track = document.getElementById(trackName);
	var isFadeNeeded = document.getElementById("isFadeNeeded").checked;
	var fadeInTime = parseFloat(document.getElementById("fadeInTime").value);
	var fadeOutTime = parseFloat(document.getElementById("fadeOutTime").value);
  
	// Stop all other tracks with fade
	stopAllTracks();
  
	// Set volume to 0 to prepare for fade in
	track.volume = 0;
  
	// Play the track
	track.play();
  
	// If fade is needed, fade in
	if (isFadeNeeded) {
	  track.addEventListener('timeupdate', function() {
		var currentTime = track.currentTime;
		var duration = track.duration;
  
		// Calculate the current volume based on time
		var volume = currentTime / duration;
  
		// Fade in
		if (currentTime < fadeInTime) {
		  track.volume = volume;
		}
  
		// Fade out
		if (duration - currentTime < fadeOutTime) {
		  track.volume = (duration - currentTime) / fadeOutTime;
		}
	  });
	}
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
