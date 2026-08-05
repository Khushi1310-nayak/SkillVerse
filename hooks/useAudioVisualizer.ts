import { useEffect, useRef, useState } from 'react';

interface VisualizerOptions {
  isActive: boolean;
  voiceStatus: 'speaking' | 'listening' | 'generating';
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const useAudioVisualizer = ({ isActive, voiceStatus, canvasRef }: VisualizerOptions) => {
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);

  // Refs for the Web Audio graph — persisted across renders without triggering re-renders
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // KEY FIX: Keep voiceStatus in a ref so the draw loop always reads the latest value.
  // Without this, the draw closure captures a stale snapshot of voiceStatus from when
  // startVisualization() was first called (always 'generating'), so the real-microphone
  // branch never executes even when the user is speaking.
  const voiceStatusRef = useRef<'speaking' | 'listening' | 'generating'>(voiceStatus);

  // Idle animation phase counter (persisted between frames)
  const pulsePhaseRef = useRef<number>(0);

  // Sync the ref to the latest voiceStatus prop on every render
  useEffect(() => {
    voiceStatusRef.current = voiceStatus;
  }, [voiceStatus]);

  useEffect(() => {
    if (!isActive) {
      cleanup();
      return;
    }

    const initAudio = async () => {
      try {
        setMicPermissionDenied(false);

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            // Disable browser audio processing so the analyser receives the raw PCM
            // signal. With echo-cancellation and noise-suppression active the browser
            // aggressively silences low-amplitude samples, causing a flat waveform
            // even when the user is speaking loudly.
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        });
        streamRef.current = stream;

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        audioContextRef.current = audioContext;

        // Some browsers start the AudioContext in 'suspended' state until a user
        // gesture. Resume it immediately so sampling begins right away.
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        const source = audioContext.createMediaStreamSource(stream);
        sourceRef.current = source;

        const analyser = audioContext.createAnalyser();
        // fftSize 2048 → 1024 time-domain bins: good resolution without CPU cost.
        analyser.fftSize = 2048;
        // Reduce smoothing so the waveform reacts quickly to voice changes.
        analyser.smoothingTimeConstant = 0.5;
        // Widen the dynamic range so quiet speech produces visible deflections.
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        analyserRef.current = analyser;

        // Connect source → analyser. No destination node: we visualise only,
        // with no audio output routed through the speakers.
        source.connect(analyser);

        startVisualization();
      } catch (err) {
        console.error('useAudioVisualizer: microphone access failed:', err);
        setMicPermissionDenied(true);
        // Fall back to idle animation so the canvas is not blank
        startVisualization();
      }
    };

    initAudio();

    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const startVisualization = () => {
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }

    const draw = () => {
      animationFrameIdRef.current = requestAnimationFrame(draw);

      const canvas = canvasRef.current;
      if (!canvas) return;

      // --- HiDPI / Retina scaling ---
      // Scale the canvas pixel buffer to match the device pixel ratio so
      // drawings are sharp on high-DPI screens. Only resize when necessary.
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;
      const targetW = Math.round(cssWidth * dpr);
      const targetH = Math.round(cssHeight * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Gradient applied left → right across the full canvas width
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#6968A6');   // primary purple
      gradient.addColorStop(0.5, '#CF9893'); // rose / secondary
      gradient.addColorStop(1, '#6EE7B7');   // emerald accent

      // Read from the ref — this is always the current voiceStatus, never stale.
      const currentStatus = voiceStatusRef.current;

      if (currentStatus === 'listening') {
        // ── REAL MICROPHONE WAVEFORM ─────────────────────────────────────────
        const analyser = analyserRef.current;
        if (!analyser) {
          // Mic failed but we are in listening mode — draw flat line
          drawIdlePulse(ctx, width, height, gradient, 1);
          return;
        }

        const bufferLength = analyser.frequencyBinCount; // fftSize / 2 = 1024
        const dataArray = new Uint8Array(bufferLength);

        // getByteTimeDomainData fills the buffer with raw PCM amplitude values
        // in the range [0, 255] where 128 = silence (zero crossing).
        // This is the correct API for a classic audio waveform — NOT
        // getByteFrequencyData, which gives an EQ spectrum and is always zero
        // during silence, making it appear the mic isn't working.
        analyser.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 2.5 * dpr;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = gradient;
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          // Normalise byte value to [-1, 1], then map to canvas Y.
          // At silence every sample is ~128, so v ≈ 0 and y ≈ height/2 (centre).
          // Speech moves samples away from 128, producing visible wave deflections.
          const v = (dataArray[i] / 128.0) - 1.0;
          const y = height / 2 + v * (height / 2) * 0.9; // 0.9 leaves a small margin

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();

      } else if (currentStatus === 'speaking') {
        // ── AI SPEAKING — subtle low-amplitude idle wave ──────────────────────
        drawIdlePulse(ctx, width, height, gradient, 3);

      } else {
        // ── GENERATING — gentle breathing pulse ───────────────────────────────
        drawIdlePulse(ctx, width, height, gradient, 6);
      }
    };

    draw();
  };

  /** Renders a smooth animated sine-wave pulse. `amplitude` controls peak height in px. */
  const drawIdlePulse = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    strokeStyle: CanvasGradient | string,
    amplitude: number,
  ) => {
    pulsePhaseRef.current += 0.04;
    const segments = 200;
    const sliceWidth = width / segments;
    let x = 0;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 4 + pulsePhaseRef.current;
      const y = height / 2 + Math.sin(angle) * amplitude;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.stroke();
  };

  const cleanup = () => {
    if (animationFrameIdRef.current !== null) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (sourceRef.current) {
      try { sourceRef.current.disconnect(); } catch (_) { }
      sourceRef.current = null;
    }
    if (analyserRef.current) {
      try { analyserRef.current.disconnect(); } catch (_) { }
      analyserRef.current = null;
    }
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => { });
      }
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try { track.stop(); } catch (_) { }
      });
      streamRef.current = null;
    }
  };

  return { micPermissionDenied };
};
