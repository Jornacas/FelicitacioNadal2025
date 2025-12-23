
import { useEffect, useRef, useCallback } from 'react';

// "Jingle Bells" - Very well known Christmas song
// Notes: E E E | E E E | E G C D | E ...
const MELODY = [
  // "Jingle bells, jingle bells"
  { note: 330, duration: 300 },  // E4
  { note: 330, duration: 300 },  // E4
  { note: 330, duration: 600 },  // E4
  { note: 330, duration: 300 },  // E4
  { note: 330, duration: 300 },  // E4
  { note: 330, duration: 600 },  // E4

  // "Jingle all the way"
  { note: 330, duration: 300 },  // E4
  { note: 392, duration: 300 },  // G4
  { note: 262, duration: 300 },  // C4
  { note: 294, duration: 300 },  // D4
  { note: 330, duration: 900 },  // E4

  { note: 0, duration: 300 },    // Rest

  // "Oh what fun it is to ride"
  { note: 349, duration: 300 },  // F4
  { note: 349, duration: 300 },  // F4
  { note: 349, duration: 300 },  // F4
  { note: 349, duration: 300 },  // F4
  { note: 349, duration: 300 },  // F4
  { note: 330, duration: 300 },  // E4
  { note: 330, duration: 300 },  // E4
  { note: 330, duration: 150 },  // E4
  { note: 330, duration: 150 },  // E4

  // "In a one horse open sleigh"
  { note: 330, duration: 300 },  // E4
  { note: 294, duration: 300 },  // D4
  { note: 294, duration: 300 },  // D4
  { note: 330, duration: 300 },  // E4
  { note: 294, duration: 600 },  // D4
  { note: 392, duration: 600 },  // G4

  { note: 0, duration: 400 },    // Rest

  // Repeat "Jingle bells, jingle bells"
  { note: 330, duration: 300 },  // E4
  { note: 330, duration: 300 },  // E4
  { note: 330, duration: 600 },  // E4
  { note: 330, duration: 300 },  // E4
  { note: 330, duration: 300 },  // E4
  { note: 330, duration: 600 },  // E4

  // "Jingle all the way"
  { note: 330, duration: 300 },  // E4
  { note: 392, duration: 300 },  // G4
  { note: 262, duration: 300 },  // C4
  { note: 294, duration: 300 },  // D4
  { note: 330, duration: 900 },  // E4

  { note: 0, duration: 300 },    // Rest

  // "Oh what fun it is to ride"
  { note: 349, duration: 300 },  // F4
  { note: 349, duration: 300 },  // F4
  { note: 349, duration: 300 },  // F4
  { note: 349, duration: 300 },  // F4
  { note: 349, duration: 300 },  // F4
  { note: 330, duration: 300 },  // E4
  { note: 330, duration: 300 },  // E4
  { note: 330, duration: 150 },  // E4
  { note: 330, duration: 150 },  // E4

  // "In a one horse open sleigh, HEY!"
  { note: 392, duration: 300 },  // G4
  { note: 392, duration: 300 },  // G4
  { note: 349, duration: 300 },  // F4
  { note: 294, duration: 300 },  // D4
  { note: 262, duration: 900 },  // C4
];

export function useChristmasMusic(isPlaying: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playNote = useCallback((frequency: number, duration: number, startTime: number, isBass: boolean = false) => {
    if (!audioContextRef.current || frequency === 0) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Use square wave for 8-bit sound
    oscillator.type = isBass ? 'triangle' : 'square';
    oscillator.frequency.setValueAtTime(frequency, startTime);

    // ADSR envelope
    const volume = isBass ? 0.06 : 0.10;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02);
    gainNode.gain.setValueAtTime(volume * 0.8, startTime + duration / 1000 - 0.05);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration / 1000);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration / 1000 + 0.1);
  }, []);

  const playMelody = useCallback(() => {
    if (!audioContextRef.current || !isPlayingRef.current) return;

    const ctx = audioContextRef.current;
    let currentTime = ctx.currentTime + 0.1;

    // Play melody
    MELODY.forEach((item) => {
      if (item.note > 0) {
        playNote(item.note, item.duration, currentTime);
        // Add harmony on some notes
        if (item.duration >= 600) {
          playNote(item.note * 0.5, item.duration, currentTime, true); // Bass octave below
        }
      }
      currentTime += item.duration / 1000;
    });

    // Loop the melody
    const totalDuration = MELODY.reduce((acc, item) => acc + item.duration, 0) + 800;
    timeoutRef.current = setTimeout(() => {
      if (isPlayingRef.current) {
        playMelody();
      }
    }, totalDuration);
  }, [playNote]);

  const startMusic = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    isPlayingRef.current = true;
    playMelody();
  }, [playMelody]);

  const stopMusic = useCallback(() => {
    isPlayingRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startMusic();
    } else {
      stopMusic();
    }

    return () => {
      stopMusic();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [isPlaying, startMusic, stopMusic]);

  return { startMusic, stopMusic };
}
