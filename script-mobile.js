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
	// Clamp the volume to the valid range
	function clampVolume(volume) {
		if (volume > 1) {
			return 1;
		}
		if (volume < 0) {
			return 0;
		}
		return volume;
	}

	// Stop every audio element and clear any pending fade timers
	function stopAllTracks() {
		const tracks = document.getElementsByTagName('audio');
		for (let i = 0; i < tracks.length; i++) {
			const track = tracks[i];
			track.pause();
			track.currentTime = 0;
			const fadeOutInterval = track.fadeOutInterval;
			if (fadeOutInterval) {
				clearInterval(fadeOutInterval);
				delete track.fadeOutInterval;
			}
			track.onended = null;
		}
	}

	// Play a track with optional fade in/out durations in milliseconds
	function playTrack(trackId, fadeInTime, fadeOutTime) {
		const audio = document.getElementById(trackId);
		if (!audio) {
			console.error('No audio element found for id', trackId);
			return;
		}

		// Stop any other sounds first
		stopAllTracks();
		audio.currentTime = 0;

		// Start playback
		audio.volume = 0;
		const playPromise = audio.play();

		// Apply optional fade-in
		const fadeInDuration = Number(fadeInTime) || 0;
		if (fadeInDuration > 0) {
			const stepMs = 50;
			const steps = Math.ceil(fadeInDuration / stepMs);
			let currentStep = 0;
			const fadeInInterval = setInterval(() => {
				currentStep += 1;
				const nextVolume = clampVolume(currentStep / steps);
				audio.volume = nextVolume;
				if (currentStep >= steps) {
					clearInterval(fadeInInterval);
				}
			}, stepMs);
		} else {
			audio.volume = 1;
		}

		// On end, optionally fade out before stopping
		const fadeOutDuration = Number(fadeOutTime) || 0;
		audio.onended = function() {
			if (fadeOutDuration > 0) {
				const stepMs = 50;
				const steps = Math.ceil(fadeOutDuration / stepMs);
				let currentStep = steps;
				const fadeOutInterval = setInterval(() => {
					currentStep -= 1;
					const nextVolume = clampVolume(currentStep / steps);
					audio.volume = nextVolume;
					if (currentStep <= 0) {
						clearInterval(fadeOutInterval);
						audio.pause();
						audio.currentTime = 0;
					}
				}, stepMs);
				audio.fadeOutInterval = fadeOutInterval;
			} else {
				audio.pause();
				audio.currentTime = 0;
			}
		};

		// Avoid unhandled promise rejections on autoplay blocks
		if (playPromise && playPromise.catch) {
			playPromise.catch((err) => {
				console.warn('Playback blocked or unsupported source', err);
			});
		}
	}

	// Public helper used by the Stop All button
	function instantStop() {
		stopAllTracks();
	}

	// Provided for HTML onended hook (logic handled in playTrack)
	function stopTrack() {}