// Lightweight Web Audio synth for gamification sound effects.
// Uses raw oscillators + gain envelopes instead of static audio files —
// zero network requests, zero bundle size, no latency.

let audioCtx: AudioContext | null = null;

const getContext = (): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx) {
        audioCtx = new AudioContextClass();
    }
    // Browsers suspend the context until a user gesture; resume defensively.
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => { });
    }
    return audioCtx;
};

interface Tone {
    freq: number;
    start: number; // seconds from now
    duration: number; // seconds
    type?: OscillatorType;
    gain?: number;
}

const playTones = (tones: Tone[]) => {
    const ctx = getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    tones.forEach(({ freq, start, duration, type = 'sine', gain = 0.15 }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now + start);

        gainNode.gain.setValueAtTime(0, now + start);
        gainNode.gain.linearRampToValueAtTime(gain, now + start + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now + start);
        osc.stop(now + start + duration + 0.05);
    });
};

export const soundManager = {
    /** Cheerful two-note chime for a correct quiz answer */
    playCorrect: () => {
        playTones([
            { freq: 880, start: 0, duration: 0.12, type: 'sine', gain: 0.18 },
            { freq: 1318.5, start: 0.1, duration: 0.18, type: 'sine', gain: 0.16 },
        ]);
    },

    /** Soft low thud for an incorrect quiz answer */
    playIncorrect: () => {
        playTones([
            { freq: 180, start: 0, duration: 0.22, type: 'sine', gain: 0.16 },
            { freq: 140, start: 0.05, duration: 0.2, type: 'sine', gain: 0.12 },
        ]);
    },

    /** Celebratory ascending fanfare for streak level-ups / badge unlocks */
    playFanfare: () => {
        playTones([
            { freq: 523.25, start: 0, duration: 0.14, type: 'triangle', gain: 0.18 },
            { freq: 659.25, start: 0.12, duration: 0.14, type: 'triangle', gain: 0.18 },
            { freq: 783.99, start: 0.24, duration: 0.14, type: 'triangle', gain: 0.18 },
            { freq: 1046.5, start: 0.36, duration: 0.3, type: 'triangle', gain: 0.2 },
        ]);
    },

    /** Bright coin "ding" for XP Store purchases */
    playCoin: () => {
        playTones([
            { freq: 988, start: 0, duration: 0.08, type: 'square', gain: 0.12 },
            { freq: 1568, start: 0.06, duration: 0.16, type: 'square', gain: 0.14 },
        ]);
    },
};