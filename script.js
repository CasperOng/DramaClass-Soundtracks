function setVolume(audio, volume) {
	if (volume > 1) {
	  volume = 1;
	} else if (volume < 0) {
	  volume = 0;
	}
	audio.volume = volume;
  }

  function playTrack(trackId) {
	// get audio element by trackId
	const audio = document.getElementById(trackId);
  
	// stop all other playing tracks
	stopAllTracks(trackId);
  
	// set volume to 0 and play audio
	setVolume(audio, 0);
	audio.play();
  
	// gradually increase volume to 1 with fadeInTime seconds
	const fadeInTime = parseFloat(document.getElementById('fadeInTime').value);
	const fadeOutTime = parseFloat(document.getElementById('fadeOutTime').value);
	const fadeInterval = setInterval(() => {
	  if (audio.volume < 1) {
		setVolume(audio, audio.volume + 0.1);
	  } else {
		clearInterval(fadeInterval);
	  }
	}, fadeInTime * 1000 / 10);
  
	// add event listener to fade out audio when it finishes
	audio.addEventListener('ended', () => {
	  // gradually decrease volume to 0 with fadeOutTime seconds
	  const fadeInterval = setInterval(() => {
		if (audio.volume > 0) {
		  setVolume(audio, audio.volume - 0.1);
		} else {
		  clearInterval(fadeInterval);
		  audio.pause();
		}
	  }, fadeOutTime * 1000 / 10);
	});
  }
  
  function stopAllTracks(excludeTrackId) {
	// loop through all audio elements and stop them if they are not excluded
	const audioElements = document.getElementsByTagName('audio');
	for (let i = 0; i < audioElements.length; i++) {
	  if (audioElements[i].id !== excludeTrackId && !audioElements[i].paused) {
		const fadeOutTime = parseFloat(document.getElementById('fadeOutTime').value);
		const fadeInterval = setInterval(() => {
		  if (audioElements[i].volume > 0) {
			setVolume(audioElements[i], audioElements[i].volume - 0.1);
		  } else {
			clearInterval(fadeInterval);
			audioElements[i].pause();
			audioElements[i].currentTime = 0;
		  }
		}, fadeOutTime * 1000 / 10);
	  }
	}
  }
  