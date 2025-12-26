import { useCallback, useRef } from 'react';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';

type SoundType = 'click' | 'match' | 'levelUp' | 'badge' | 'combo' | 'powerup' | 'fail' | 'coin' | 'jump' | 'hit';

// Softer, more pleasant frequencies (musical notes)
const FREQUENCIES: Record<SoundType, number[]> = {
  click: [523], // C5 - single soft click
  match: [392, 523, 659], // G4, C5, E5 - pleasant chord
  levelUp: [523, 659, 784], // C5, E5, G5 - major chord ascending
  badge: [392, 494, 587, 784], // G4, B4, D5, G5 - triumphant
  combo: [440, 523, 659], // A4, C5, E5 - minor feel
  powerup: [330, 392, 494], // E4, G4, B4 - power chord
  fail: [294, 262], // D4, C4 - descending
  coin: [784, 988], // G5, B5 - high ping
  jump: [330, 440], // E4, A4 - bounce
  hit: [196, 165], // G3, E3 - low thump
};

// Shorter, snappier durations
const DURATIONS: Record<SoundType, number> = {
  click: 30,
  match: 120,
  levelUp: 250,
  badge: 400,
  combo: 150,
  powerup: 200,
  fail: 150,
  coin: 60,
  jump: 50,
  hit: 60,
};

export const useGameSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const { isPlaying, volume } = useAudioPlayerContext();
  
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((type: SoundType) => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const frequencies = FREQUENCIES[type];
      const duration = DURATIONS[type] / 1000;
      const baseVolume = isPlaying ? volume * 0.15 : volume * 0.25; // Much quieter overall
      
      frequencies.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine'; // Always use soft sine waves
        
        const startTime = ctx.currentTime + (index * duration / frequencies.length);
        const endTime = startTime + duration / frequencies.length;
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(baseVolume * 0.3, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
        
        oscillator.start(startTime);
        oscillator.stop(endTime + 0.1);
      });
    } catch (e) {
      console.log('Sound playback failed:', e);
    }
  }, [getAudioContext, isPlaying, volume]);

  const playClick = useCallback(() => playSound('click'), [playSound]);
  const playMatch = useCallback(() => playSound('match'), [playSound]);
  const playLevelUp = useCallback(() => playSound('levelUp'), [playSound]);
  const playBadge = useCallback(() => playSound('badge'), [playSound]);
  const playCombo = useCallback(() => playSound('combo'), [playSound]);
  const playPowerup = useCallback(() => playSound('powerup'), [playSound]);
  const playFail = useCallback(() => playSound('fail'), [playSound]);
  const playCoin = useCallback(() => playSound('coin'), [playSound]);
  const playJump = useCallback(() => playSound('jump'), [playSound]);
  const playHit = useCallback(() => playSound('hit'), [playSound]);

  return {
    playSound,
    playClick,
    playMatch,
    playLevelUp,
    playBadge,
    playCombo,
    playPowerup,
    playFail,
    playCoin,
    playJump,
    playHit,
  };
};

export default useGameSounds;
