let wololoAudio: HTMLAudioElement | null = null;

export function playWololo() {
  try {
    if (!wololoAudio) {
      wololoAudio = new Audio('/images/relics/wololo.mp3');
      wololoAudio.volume = 0.5;
    }
    wololoAudio.currentTime = 0;
    wololoAudio.play().catch(() => {});
  } catch {
    // silent fail
  }
}
