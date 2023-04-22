// Helper function to set volume of an audio element
function setVolume(audio, volume) {
	if (volume > 1) {
	  volume = 1;
	} else if (volume < 0) {
	  volume = 0;
	}
	audio.volume = volume;
  }
  
  // Function to stop all tracks and clear fade-out intervals
  function stopAllTracks() {
	const tracks = document.getElementsByTagName('audio');
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
	  document.addEventListener('touchstart', function() {
		playTrack(trackId);
	  });
	  
	}
  }
  
  // Function to play a track with optional fade in/out effects
  function playTrack(trackId, fadeInTime, fadeOutTime) {
	const audio = document.getElementById(trackId);
	
	// Stop all other tracks and set current track to start
	stopAllTracks();
	audio.currentTime = 0;
	
	// Play track with optional fade in effect
	audio.volume = 0;
	audio.play();
	if (fadeInTime) {
	  audio.animate([{ volume: 0 }, { volume: 1 }], { duration: fadeInTime });
	} else {
	  audio.volume = 1;
	}
	
	// Add event listener to fade out track if needed
	audio.addEventListener("ended", function() {
	  if (fadeOutTime) {
		const fadeOutInterval = setInterval(() => {
		  if (audio.volume > 0) {
			setVolume(audio, audio.volume - 0.1);
		  } else {
			clearInterval(fadeOutInterval);
			audio.pause();
			audio.currentTime = 0;
		  }
		}, fadeOutTime * 1000 / 10);
		audio.fadeOutInterval = fadeOutInterval;
	  } else {
		audio.pause();
		audio.currentTime = 0;
	  }
	});
  }
  
  // Function to instantly stop all tracks
  function instantStop() {
	stopAllTracks();
  }
  
  // Add event listeners to play track buttons
  const happyButton = document.getElementById("happy-button");
  happyButton.addEventListener("click", function() {
	const fadeInTime = document.getElementById("fadeInTime").value * 1000;
	const fadeOutTime = document.getElementById("fadeOutTime").value * 1000;
	playTrack("happy", fadeInTime, fadeOutTime);
  });
  
  const elegantButton = document.getElementById("elegant-button");
  elegantButton.addEventListener("click", function() {
	const fadeInTime = document.getElementById("fadeInTime").value * 1000;
	const fadeOutTime = document.getElementById("fadeOutTime").value * 1000;
	playTrack("elegant", fadeInTime, fadeOutTime);
  });
  
  const nervousButton = document.getElementById("nervous-button");
  nervousButton.addEventListener("click", function() {
	const fadeInTime = document.getElementById("fadeInTime").value * 1000;
	const fadeOutTime = document.getElementById("fadeOutTime").value * 1000;
	playTrack("nervous", fadeInTime, fadeOutTime);
  });
  
  // Add event listener to stop button
  const stopButton = document.getElementById("stop-button");
  stopButton.addEventListener("click", function() {
	instantStop();
  });
  