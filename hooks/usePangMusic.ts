import { useEffect, useRef } from 'react';

// PANG-style arcade music - energetic 8-bit tune
export const usePangMusic = (isPlaying: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      isPlayingRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      return;
    }

    // PANG-style melody - energetic arcade tune
    // Notes in Hz
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00;
    const A4 = 440.00, B4 = 493.88, C5 = 523.25, D5 = 587.33, E5 = 659.25;
    const G3 = 196.00, A3 = 220.00, B3 = 246.94;

    // Main melody (PANG-inspired upbeat tune)
    const melody = [
      // Bar 1
      { note: E5, duration: 0.15 }, { note: D5, duration: 0.15 },
      { note: C5, duration: 0.15 }, { note: B4, duration: 0.15 },
      { note: A4, duration: 0.3 }, { note: G4, duration: 0.15 },
      { note: A4, duration: 0.15 },
      // Bar 2
      { note: B4, duration: 0.15 }, { note: C5, duration: 0.15 },
      { note: D5, duration: 0.3 }, { note: E5, duration: 0.3 },
      { note: D5, duration: 0.15 }, { note: C5, duration: 0.15 },
      // Bar 3
      { note: B4, duration: 0.15 }, { note: A4, duration: 0.15 },
      { note: G4, duration: 0.3 }, { note: A4, duration: 0.15 },
      { note: B4, duration: 0.15 }, { note: C5, duration: 0.3 },
      // Bar 4
      { note: D5, duration: 0.15 }, { note: E5, duration: 0.15 },
      { note: D5, duration: 0.15 }, { note: C5, duration: 0.15 },
      { note: B4, duration: 0.3 }, { note: A4, duration: 0.3 },
      // Bar 5 - variation
      { note: C5, duration: 0.15 }, { note: C5, duration: 0.15 },
      { note: B4, duration: 0.15 }, { note: A4, duration: 0.15 },
      { note: G4, duration: 0.3 }, { note: E4, duration: 0.3 },
      // Bar 6
      { note: F4, duration: 0.15 }, { note: G4, duration: 0.15 },
      { note: A4, duration: 0.3 }, { note: B4, duration: 0.15 },
      { note: C5, duration: 0.15 }, { note: D5, duration: 0.3 },
      // Bar 7
      { note: E5, duration: 0.2 }, { note: E5, duration: 0.1 },
      { note: D5, duration: 0.2 }, { note: D5, duration: 0.1 },
      { note: C5, duration: 0.2 }, { note: B4, duration: 0.2 },
      // Bar 8 - ending phrase
      { note: A4, duration: 0.15 }, { note: B4, duration: 0.15 },
      { note: C5, duration: 0.3 }, { note: A4, duration: 0.6 },
    ];

    // Bass line (accompaniment)
    const bassLine = [
      { note: C4, duration: 0.3 }, { note: G3, duration: 0.3 },
      { note: C4, duration: 0.3 }, { note: G3, duration: 0.3 },
      { note: A3, duration: 0.3 }, { note: E4, duration: 0.3 },
      { note: A3, duration: 0.3 }, { note: E4, duration: 0.3 },
      { note: F4, duration: 0.3 }, { note: C4, duration: 0.3 },
      { note: G3, duration: 0.3 }, { note: D4, duration: 0.3 },
      { note: C4, duration: 0.3 }, { note: G3, duration: 0.3 },
      { note: C4, duration: 0.6 },
    ];

    audioContextRef.current = new AudioContext();
    isPlayingRef.current = true;

    const playNote = (
      ctx: AudioContext,
      frequency: number,
      startTime: number,
      duration: number,
      type: OscillatorType = 'square',
      volume: number = 0.15
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, startTime);

      // ADSR envelope for arcade feel
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
      gain.gain.setValueAtTime(volume * 0.8, startTime + duration * 0.3);
      gain.gain.linearRampToValueAtTime(0, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const playMelody = () => {
      if (!isPlayingRef.current || !audioContextRef.current) return;

      const ctx = audioContextRef.current;
      let melodyTime = ctx.currentTime + 0.1;
      let bassTime = ctx.currentTime + 0.1;

      // Play melody
      melody.forEach(({ note, duration }) => {
        if (note > 0) {
          playNote(ctx, note, melodyTime, duration, 'square', 0.12);
        }
        melodyTime += duration;
      });

      // Play bass (triangle wave for deeper sound)
      bassLine.forEach(({ note, duration }) => {
        if (note > 0) {
          playNote(ctx, note, bassTime, duration, 'triangle', 0.15);
        }
        bassTime += duration;
      });

      // Calculate total duration and schedule next loop
      const totalDuration = melody.reduce((acc, n) => acc + n.duration, 0);

      timeoutRef.current = setTimeout(() => {
        if (isPlayingRef.current) {
          playMelody();
        }
      }, totalDuration * 1000);
    };

    playMelody();

    return () => {
      isPlayingRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [isPlaying]);
};
