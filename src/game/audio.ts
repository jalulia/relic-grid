let audioCtx: AudioContext | null = null;

export function playWololo() {
  try {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }

    fetch(`${import.meta.env.BASE_URL}images/relics/wololo.mp3`)
      .then(res => res.arrayBuffer())
      .then(buf => audioCtx!.decodeAudioData(buf))
      .then(decoded => {
        const source = audioCtx!.createBufferSource();
        source.buffer = decoded;

        // Distortion
        const waveshaper = audioCtx!.createWaveShaper();
        const curve = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
          const x = (i * 2) / 256 - 1;
          waveshaper.curve = curve;
          curve[i] = (Math.PI + 50) * x / (Math.PI + 50 * Math.abs(x));
        }
        waveshaper.oversample = '4x';

        // Very quiet
        const gain = audioCtx!.createGain();
        gain.gain.value = 0.08;

        // Bandpass for lo-fi effect
        const filter = audioCtx!.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        filter.Q.value = 2;

        source.connect(waveshaper);
        waveshaper.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx!.destination);

        source.start();
      })
      .catch(() => {});
  } catch {
    // silent fail
  }
}
