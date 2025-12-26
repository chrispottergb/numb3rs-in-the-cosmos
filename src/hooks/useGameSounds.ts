import { useCallback, useRef } from 'react';
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';

type SoundType = 'click' | 'match' | 'levelUp' | 'badge' | 'combo' | 'powerup' | 'fail' | 'coin' | 'jump' | 'hit';

const FREQUENCIES: Record<SoundType, number[]> = {
  click: [440, 880],
  match: [523, 659, 784],
  levelUp: [392, 523, 659, 784, 1047],
  badge: [523, 659, 784, 1047, 1319],
  combo: [440, 554, 659],
  powerup: [262, 330, 392, 523],
  fail: [200, 150],
  coin: [1047, 1319],
  jump: [262, 392],
  hit: [150, 100],
};

const DURATIONS: Record<SoundType, number> = {
  click: 50,
  match: 150,
  levelUp: 400,
  badge: 600,
  combo: 200,
  powerup: 300,
  fail: 200,
  coin: 100,
  jump: 80,
  hit: 100,
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
      const baseVolume = isPlaying ? volume * 0.3 : volume * 0.5; // Lower if music is playing
      
      frequencies.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = type === 'fail' || type === 'hit' ? 'sawtooth' : 'sine';
        
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
