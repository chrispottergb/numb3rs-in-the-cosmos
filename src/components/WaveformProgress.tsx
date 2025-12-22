import { useEffect, useRef, useState } from 'react';

interface WaveformProgressProps {
  analyser: AnalyserNode | null;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  isPlaying: boolean;
}

const WaveformProgress = ({ analyser, currentTime, duration, onSeek, isPlaying }: WaveformProgressProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const animationRef = useRef<number>();

  // Number of bars in the waveform
  const BARS_COUNT = 100;

  // Capture waveform data while playing
  useEffect(() => {
    if (!analyser || !isPlaying) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const captureData = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate progress position
      const progress = duration > 0 ? currentTime / duration : 0;
      const barIndex = Math.floor(progress * BARS_COUNT);
      
      // Get average amplitude for this moment
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      const normalizedValue = avg / 255;
      
      setWaveformData(prev => {
        const newData = [...prev];
        // Fill in any gaps and set current position
        for (let i = newData.length; i <= barIndex; i++) {
          newData[i] = i === barIndex ? normalizedValue : (newData[i - 1] || 0.1);
        }
        newData[barIndex] = Math.max(newData[barIndex] || 0, normalizedValue);
        return newData;
      });

      animationRef.current = requestAnimationFrame(captureData);
    };

    captureData();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isPlaying, currentTime, duration]);

  // Reset waveform when track changes
  useEffect(() => {
    if (currentTime === 0) {
      setWaveformData([]);
    }
  }, [currentTime]);

  // Draw waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;
    const barWidth = width / BARS_COUNT;
    const progress = duration > 0 ? currentTime / duration : 0;
    const progressBarIndex = Math.floor(progress * BARS_COUNT);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw bars
    for (let i = 0; i < BARS_COUNT; i++) {
      const amplitude = waveformData[i] || 0.05;
      const barHeight = Math.max(4, amplitude * (height - 8));
      const x = i * barWidth;
      const y = (height - barHeight) / 2;

      // Determine color based on progress
      if (i < progressBarIndex) {
        // Played portion - gradient from cyan to gold
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, 'hsl(187, 100%, 50%)');
        gradient.addColorStop(1, 'hsl(45, 100%, 50%)');
        ctx.fillStyle = gradient;
        ctx.shadowColor = 'hsl(187, 100%, 50%)';
        ctx.shadowBlur = 4;
      } else if (i === progressBarIndex) {
        // Current position - bright
        ctx.fillStyle = 'hsl(187, 100%, 70%)';
        ctx.shadowColor = 'hsl(187, 100%, 50%)';
        ctx.shadowBlur = 10;
      } else {
        // Unplayed portion
        ctx.fillStyle = 'hsl(240, 15%, 25%)';
        ctx.shadowBlur = 0;
      }

      // Draw rounded bar
      const radius = Math.min(2, barWidth / 2 - 1);
      ctx.beginPath();
      ctx.roundRect(x + 1, y, barWidth - 2, barHeight, radius);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Draw playhead
    const playheadX = progress * width;
    ctx.fillStyle = 'hsl(45, 100%, 60%)';
    ctx.shadowColor = 'hsl(45, 100%, 50%)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(playheadX, height / 2, 6, 0, Math.PI * 2);
    ctx.fill();
  }, [waveformData, currentTime, duration]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container || duration === 0) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    const seekTime = progress * duration;
    onSeek(Math.max(0, Math.min(duration, seekTime)));
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="w-full h-16 cursor-pointer relative rounded-lg overflow-hidden bg-muted/20 backdrop-blur-sm border border-border/30"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      {/* Time labels */}
      <div className="absolute bottom-1 left-2 text-xs text-muted-foreground font-mono">
        {formatTime(currentTime)}
      </div>
      <div className="absolute bottom-1 right-2 text-xs text-muted-foreground font-mono">
        {formatTime(duration)}
      </div>
    </div>
  );
};

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default WaveformProgress;
