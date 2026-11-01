// Web Audio API Synthesizer - Zero dependencies, pure browser oscillator

let audioCtx: AudioContext | null = null;
let isAudioEnabled = false;

export function initAudio() {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem('anil_audio_enabled');
  isAudioEnabled = stored === 'true';
}

export function toggleAudio(): boolean {
  if (typeof window === 'undefined') return false;
  isAudioEnabled = !isAudioEnabled;
  localStorage.setItem('anil_audio_enabled', isAudioEnabled ? 'true' : 'false');
  if (isAudioEnabled) {
    playSuccessSound();
  }
  return isAudioEnabled;
}

export function getAudioEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return isAudioEnabled;
}

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playKeySound() {
  if (!isAudioEnabled) return;
  try {
    const ctx = getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(650, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {}
}

export function playBlipSound() {
  if (!isAudioEnabled) return;
  try {
    const ctx = getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {}
}

export function playSuccessSound() {
  if (!isAudioEnabled) return;
  try {
    const ctx = getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);
      gain.gain.setValueAtTime(0.06, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + (i + 1) * 0.07);
    });
  } catch {}
}

