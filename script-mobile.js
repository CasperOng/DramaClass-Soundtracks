// Clamp a volume value into [0, 1]
function clampVolume(volume) {
	if (volume > 1) return 1;
	if (volume < 0) return 0;
	return volume;
}

// Stop every audio element and clear any pending fade timers
function stopAllTracks() {
	const tracks = document.getElementsByTagName('audio');
	for (let i = 0; i < tracks.length; i++) {
		const track = tracks[i];
		track.pause();
		track.currentTime = 0;
		if (track.fadeOutInterval) {
			clearInterval(track.fadeOutInterval);
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

	stopAllTracks();
	audio.currentTime = 0;
	audio.volume = 0;

	const playPromise = audio.play();

	const fadeInDuration = Number(fadeInTime) || 0;
	if (fadeInDuration > 0) {
		const stepMs = 50;
		const steps = Math.ceil(fadeInDuration / stepMs);
		let currentStep = 0;
		const fadeInInterval = setInterval(() => {
			currentStep += 1;
			audio.volume = clampVolume(currentStep / steps);
			if (currentStep >= steps) {
				clearInterval(fadeInInterval);
			}
		}, stepMs);
	} else {
		audio.volume = 1;
	}

	const fadeOutDuration = Number(fadeOutTime) || 0;
	audio.onended = function() {
		if (fadeOutDuration > 0) {
			const stepMs = 50;
			const steps = Math.ceil(fadeOutDuration / stepMs);
			let currentStep = steps;
			const fadeOutInterval = setInterval(() => {
				currentStep -= 1;
				audio.volume = clampVolume(currentStep / steps);
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
