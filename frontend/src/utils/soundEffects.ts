let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Tono DTMF corto para el marcado de emergencia en Nivel 1.
 */
export function playDialTone(freq: number = 697): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.12);
}

/**
 * Acorde suave ascendente para clasificación correcta en Triage (Nivel 2) y curaciones (Nivel 4).
 */
export function playSuccessDrop(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + i * 0.08;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.15, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.28);
  });
}

/**
 * Tono grave de advertencia para penalizaciones por error.
 */
export function playErrorBuzzer(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(130, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.25);

  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.28);
}

/**
 * Doble pulso grave sutil para auscultación/revisión de pulso en Nivel 3 (lub-dub cardíaco).
 */
export function playHeartbeat(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const pulses = [0, 0.14];
  pulses.forEach((offset) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + offset;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(85, startTime);
    osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.1);

    gain.gain.setValueAtTime(0.22, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.12);
  });
}

/**
 * Secuencia melódica de triunfo al completar el juego.
 */
export function playVictoryFanfare(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [
    { freq: 523.25, start: 0.0, dur: 0.14 },    // C5
    { freq: 523.25, start: 0.15, dur: 0.14 },   // C5
    { freq: 523.25, start: 0.30, dur: 0.14 },   // C5
    { freq: 659.25, start: 0.45, dur: 0.35 },   // E5
    { freq: 783.99, start: 0.82, dur: 0.22 },   // G5
    { freq: 1046.5, start: 1.05, dur: 0.8 },    // C6
  ];

  notes.forEach((n) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + n.start;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(n.freq, startTime);

    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + n.dur);
  });
}
