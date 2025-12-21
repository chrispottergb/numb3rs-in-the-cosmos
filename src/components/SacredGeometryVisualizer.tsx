import { useRef, useEffect, useCallback } from 'react';

interface SacredGeometryVisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  currentTrack: number;
}

const SacredGeometryVisualizer = ({ analyser, isPlaying, currentTrack }: SacredGeometryVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const rotationRef = useRef(0);
  const timeRef = useRef(0);

  // Color schemes for each track
  const colorSchemes = [
    { primary: '#00FFFF', secondary: '#FFD700', tertiary: '#9945FF' }, // Spell Breaker - Cyan/Gold
    { primary: '#FFD700', secondary: '#00FFFF', tertiary: '#FF6B9D' }, // Numb3rs - Gold/Cyan
    { primary: '#9945FF', secondary: '#00FFFF', tertiary: '#FFD700' }, // Infinity - Purple/Cyan
  ];

  const drawHexagon = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, alpha: number, color: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const px = size * Math.cos(angle);
      const py = size * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.stroke();
    ctx.restore();
  }, []);

  const drawFlowerOfLife = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, baseRadius: number, frequencyData: Uint8Array, colors: typeof colorSchemes[0]) => {
    const circles = 7;
    const avgFreq = Array.from(frequencyData.slice(0, 64)).reduce((a, b) => a + b, 0) / 64;
    const pulse = 1 + (avgFreq / 255) * 0.3;

    ctx.save();
    ctx.translate(x, y);

    // Central circle
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 15;
    ctx.shadowColor = colors.primary;
    ctx.globalAlpha = 0.6 + (avgFreq / 255) * 0.4;
    ctx.stroke();

    // Surrounding circles
    for (let i = 0; i < 6; i++) {
      const freqIndex = Math.floor((i / 6) * 32);
      const freqValue = frequencyData[freqIndex] || 128;
      const angle = (Math.PI / 3) * i + rotationRef.current * 0.1;
      const circleX = baseRadius * pulse * Math.cos(angle);
      const circleY = baseRadius * pulse * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(circleX, circleY, baseRadius * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = i % 2 === 0 ? colors.secondary : colors.tertiary;
      ctx.globalAlpha = 0.4 + (freqValue / 255) * 0.6;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.stroke();
    }

    ctx.restore();
  }, []);

  const drawMetatronsCube = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, frequencyData: Uint8Array, colors: typeof colorSchemes[0]) => {
    const avgFreq = Array.from(frequencyData.slice(32, 96)).reduce((a, b) => a + b, 0) / 64;
    const pulse = 1 + (avgFreq / 255) * 0.25;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotationRef.current * 0.05);

    // Draw outer hexagon
    drawHexagon(ctx, 0, 0, size * pulse, 0, 0.5 + (avgFreq / 255) * 0.5, colors.primary);

    // Draw inner hexagons at vertices
    for (let i = 0; i < 6; i++) {
      const freqIndex = Math.floor((i / 6) * 48) + 16;
      const freqValue = frequencyData[freqIndex] || 128;
      const angle = (Math.PI / 3) * i;
      const vx = (size * 0.6 * pulse) * Math.cos(angle);
      const vy = (size * 0.6 * pulse) * Math.sin(angle);
      drawHexagon(ctx, vx, vy, size * 0.35 * pulse, rotationRef.current * 0.1, 0.3 + (freqValue / 255) * 0.7, colors.secondary);
    }

    // Draw connecting lines with frequency response
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle1 = (Math.PI / 3) * i;
      const angle2 = (Math.PI / 3) * ((i + 2) % 6);
      const x1 = (size * 0.6 * pulse) * Math.cos(angle1);
      const y1 = (size * 0.6 * pulse) * Math.sin(angle1);
      const x2 = (size * 0.6 * pulse) * Math.cos(angle2);
      const y2 = (size * 0.6 * pulse) * Math.sin(angle2);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.strokeStyle = colors.tertiary;
    ctx.globalAlpha = 0.4 + (avgFreq / 255) * 0.4;
    ctx.lineWidth = 1;
    ctx.shadowBlur = 10;
    ctx.shadowColor = colors.tertiary;
    ctx.stroke();

    ctx.restore();
  }, [drawHexagon]);

  const drawTorus = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, frequencyData: Uint8Array, colors: typeof colorSchemes[0]) => {
    const bassFreq = Array.from(frequencyData.slice(0, 16)).reduce((a, b) => a + b, 0) / 16;
    const midFreq = Array.from(frequencyData.slice(16, 64)).reduce((a, b) => a + b, 0) / 48;
    const highFreq = Array.from(frequencyData.slice(64, 128)).reduce((a, b) => a + b, 0) / 64;

    ctx.save();
    ctx.translate(x, y);

    const rings = 12;
    const pointsPerRing = 36;

    for (let ring = 0; ring < rings; ring++) {
      const ringProgress = ring / rings;
      const freqValue = ring < 4 ? bassFreq : ring < 8 ? midFreq : highFreq;
      const pulse = 1 + (freqValue / 255) * 0.4;

      ctx.beginPath();
      for (let point = 0; point <= pointsPerRing; point++) {
        const theta = (point / pointsPerRing) * Math.PI * 2;
        const phi = ringProgress * Math.PI * 2 + rotationRef.current * 0.3;

        const torusR = size * 0.6;
        const tubeR = size * 0.25 * pulse;

        const px = (torusR + tubeR * Math.cos(phi)) * Math.cos(theta);
        const py = tubeR * Math.sin(phi);
        const scale = 1 + (torusR + tubeR * Math.cos(phi)) / (torusR * 3);

        if (point === 0) ctx.moveTo(px * scale, py * scale);
        else ctx.lineTo(px * scale, py * scale);
      }

      const gradient = ctx.createLinearGradient(-size, 0, size, 0);
      gradient.addColorStop(0, colors.primary);
      gradient.addColorStop(0.5, colors.secondary);
      gradient.addColorStop(1, colors.tertiary);

      ctx.strokeStyle = gradient;
      ctx.globalAlpha = 0.15 + (freqValue / 255) * 0.5;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = ring % 3 === 0 ? colors.primary : ring % 3 === 1 ? colors.secondary : colors.tertiary;
      ctx.stroke();
    }

    ctx.restore();
  }, []);

  const drawGoldenSpiral = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, frequencyData: Uint8Array, colors: typeof colorSchemes[0]) => {
    const avgFreq = Array.from(frequencyData.slice(0, 128)).reduce((a, b) => a + b, 0) / 128;
    const pulse = 1 + (avgFreq / 255) * 0.3;
    const phi = 1.618033988749;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotationRef.current * 0.15);

    // Draw spiral
    ctx.beginPath();
    let a = 2;
    const b = 0.17;

    for (let theta = 0; theta < 6 * Math.PI; theta += 0.02) {
      const freqIndex = Math.floor((theta / (6 * Math.PI)) * 128);
      const freqValue = frequencyData[freqIndex] || 128;
      const r = a * Math.pow(phi, theta * b) * pulse * (1 + (freqValue / 255) * 0.15);
      const px = r * Math.cos(theta);
      const py = r * Math.sin(theta);

      if (theta === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, colors.tertiary);
    gradient.addColorStop(0.5, colors.secondary);
    gradient.addColorStop(1, colors.primary);

    ctx.strokeStyle = gradient;
    ctx.globalAlpha = 0.6 + (avgFreq / 255) * 0.4;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = colors.primary;
    ctx.stroke();

    // Draw golden rectangles
    let rectSize = size * 0.4 * pulse;
    for (let i = 0; i < 6; i++) {
      const freqValue = frequencyData[i * 20] || 128;
      ctx.globalAlpha = 0.2 + (freqValue / 255) * 0.3;
      ctx.strokeStyle = i % 2 === 0 ? colors.secondary : colors.tertiary;
      ctx.strokeRect(-rectSize / 2, -rectSize / 2, rectSize, rectSize);
      ctx.rotate(Math.PI / 2);
      rectSize /= phi;
    }

    ctx.restore();
  }, []);

  const drawFrequencyBars = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, frequencyData: Uint8Array, colors: typeof colorSchemes[0]) => {
    const bars = 64;
    const barWidth = (Math.PI * 2) / bars;

    for (let i = 0; i < bars; i++) {
      const freqValue = frequencyData[Math.floor((i / bars) * 128)] || 0;
      const barHeight = (freqValue / 255) * 80;
      const angle = (i / bars) * Math.PI * 2 - Math.PI / 2;

      const x1 = centerX + (radius + 10) * Math.cos(angle);
      const y1 = centerY + (radius + 10) * Math.sin(angle);
      const x2 = centerX + (radius + 10 + barHeight) * Math.cos(angle);
      const y2 = centerY + (radius + 10 + barHeight) * Math.sin(angle);

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, colors.primary);
      gradient.addColorStop(0.5, colors.secondary);
      gradient.addColorStop(1, colors.tertiary);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = gradient;
      ctx.globalAlpha = 0.6 + (freqValue / 255) * 0.4;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 5;
      ctx.shadowColor = colors.primary;
      ctx.stroke();
    }
  }, []);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, frequencyData: Uint8Array, colors: typeof colorSchemes[0]) => {
    const avgFreq = Array.from(frequencyData).reduce((a, b) => a + b, 0) / frequencyData.length;
    const particleCount = Math.floor(20 + (avgFreq / 255) * 30);

    for (let i = 0; i < particleCount; i++) {
      const t = timeRef.current * 0.001 + i * 0.5;
      const x = width / 2 + Math.sin(t * 0.5 + i) * (100 + i * 5);
      const y = height / 2 + Math.cos(t * 0.3 + i * 0.7) * (80 + i * 4);
      const freqIndex = i % 128;
      const size = 1 + (frequencyData[freqIndex] / 255) * 4;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.tertiary;
      ctx.globalAlpha = 0.3 + (frequencyData[freqIndex] / 255) * 0.7;
      ctx.shadowBlur = 10;
      ctx.shadowColor = ctx.fillStyle;
      ctx.fill();
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear with fade effect
    ctx.fillStyle = 'rgba(5, 5, 15, 0.15)';
    ctx.fillRect(0, 0, width, height);

    const colors = colorSchemes[currentTrack] || colorSchemes[0];
    let frequencyData = new Uint8Array(256);

    if (analyser && isPlaying) {
      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(frequencyData);
    } else if (!isPlaying) {
      // Gentle ambient animation when not playing
      for (let i = 0; i < 256; i++) {
        frequencyData[i] = 30 + Math.sin(timeRef.current * 0.002 + i * 0.1) * 20;
      }
    }

    // Draw particles in background
    drawParticles(ctx, width, height, frequencyData, colors);

    // Draw based on current track
    const baseSize = Math.min(width, height) * 0.25;

    if (currentTrack === 0) {
      // Spell Breaker - Hexagonal 528Hz pattern
      drawFlowerOfLife(ctx, centerX, centerY, baseSize * 0.4, frequencyData, colors);
      drawMetatronsCube(ctx, centerX, centerY, baseSize, frequencyData, colors);
      drawFrequencyBars(ctx, centerX, centerY, baseSize + 30, frequencyData, colors);
    } else if (currentTrack === 1) {
      // Numb3rs in the Cosmos - Golden Spiral
      drawGoldenSpiral(ctx, centerX, centerY, baseSize, frequencyData, colors);
      drawFlowerOfLife(ctx, centerX, centerY, baseSize * 0.3, frequencyData, colors);
      drawFrequencyBars(ctx, centerX, centerY, baseSize + 20, frequencyData, colors);
    } else {
      // Infinity Sign - Torus Field
      drawTorus(ctx, centerX, centerY, baseSize, frequencyData, colors);
      drawFlowerOfLife(ctx, centerX, centerY, baseSize * 0.25, frequencyData, colors);
      drawFrequencyBars(ctx, centerX, centerY, baseSize + 40, frequencyData, colors);
    }

    rotationRef.current += 0.01;
    timeRef.current += 16;
    animationRef.current = requestAnimationFrame(animate);
  }, [analyser, isPlaying, currentTrack, colorSchemes, drawFlowerOfLife, drawMetatronsCube, drawTorus, drawGoldenSpiral, drawFrequencyBars, drawParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
};

export default SacredGeometryVisualizer;
