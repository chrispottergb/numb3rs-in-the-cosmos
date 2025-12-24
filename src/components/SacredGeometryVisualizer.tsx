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
  const hueShiftRef = useRef(0);
  const lastBassRef = useRef(0);
  const strobeIntensityRef = useRef(0);

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

  // New: Kaleidoscope mirror effect
  const drawKaleidoscope = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, size: number, frequencyData: Uint8Array, colors: typeof colorSchemes[0]) => {
    const segments = 8;
    const avgFreq = Array.from(frequencyData.slice(0, 64)).reduce((a, b) => a + b, 0) / 64;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    
    for (let seg = 0; seg < segments; seg++) {
      ctx.save();
      ctx.rotate((Math.PI * 2 / segments) * seg + rotationRef.current * 0.2);
      
      // Draw mirrored patterns
      for (let i = 0; i < 12; i++) {
        const freqIdx = (seg * 16 + i * 10) % 128;
        const freqValue = frequencyData[freqIdx] || 128;
        const pulse = (freqValue / 255);
        
        const dist = 30 + i * 15 + pulse * 40;
        const waveOffset = Math.sin(timeRef.current * 0.003 + i * 0.5) * 20 * pulse;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(dist + waveOffset, i * 8);
        ctx.lineTo(dist + waveOffset, -i * 8);
        ctx.closePath();
        
        const hue = (hueShiftRef.current + seg * 45 + i * 10) % 360;
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${0.1 + pulse * 0.3})`;
        ctx.strokeStyle = `hsla(${hue}, 90%, 70%, ${0.3 + pulse * 0.5})`;
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
      }
      
      ctx.restore();
    }
    
    ctx.restore();
  }, []);

  // New: Warping tunnel effect
  const drawWarpTunnel = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, size: number, frequencyData: Uint8Array, colors: typeof colorSchemes[0]) => {
    const rings = 20;
    const bassFreq = Array.from(frequencyData.slice(0, 32)).reduce((a, b) => a + b, 0) / 32;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    
    for (let ring = rings; ring > 0; ring--) {
      const progress = ring / rings;
      const freqIdx = Math.floor(progress * 64);
      const freqValue = frequencyData[freqIdx] || 128;
      const pulse = 1 + (freqValue / 255) * 0.5;
      
      const baseRadius = size * progress * pulse;
      const warp = Math.sin(timeRef.current * 0.004 + ring * 0.3) * 15 * (bassFreq / 255);
      
      ctx.beginPath();
      
      // Distorted circle
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
        const wobble = Math.sin(angle * 6 + timeRef.current * 0.005 + ring) * warp;
        const r = baseRadius + wobble;
        const x = r * Math.cos(angle + rotationRef.current * 0.1 * (1 - progress));
        const y = r * Math.sin(angle + rotationRef.current * 0.1 * (1 - progress));
        
        if (angle === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      ctx.closePath();
      
      const hue = (hueShiftRef.current + ring * 18 + timeRef.current * 0.05) % 360;
      ctx.strokeStyle = `hsla(${hue}, 85%, 55%, ${0.2 + (freqValue / 255) * 0.5})`;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = `hsla(${hue}, 85%, 55%, 0.8)`;
      ctx.stroke();
    }
    
    ctx.restore();
  }, []);

  // New: Pulsing energy waves
  const drawEnergyWaves = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, size: number, frequencyData: Uint8Array, colors: typeof colorSchemes[0]) => {
    const waves = 8;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    
    for (let wave = 0; wave < waves; wave++) {
      const wavePhase = (timeRef.current * 0.002 + wave * 0.5) % (Math.PI * 2);
      const freqIdx = wave * 16;
      const freqValue = frequencyData[freqIdx] || 128;
      const amplitude = 20 + (freqValue / 255) * 60;
      
      ctx.beginPath();
      
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
        const waveEffect = Math.sin(angle * 8 + wavePhase) * amplitude;
        const baseR = size * 0.3 + wave * 25;
        const r = baseR + waveEffect;
        
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        
        if (angle === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      ctx.closePath();
      
      const hue = (hueShiftRef.current + wave * 40) % 360;
      ctx.strokeStyle = `hsla(${hue}, 90%, 60%, ${0.15 + (freqValue / 255) * 0.4})`;
      ctx.lineWidth = 2 + (freqValue / 255) * 2;
      ctx.shadowBlur = 20;
      ctx.shadowColor = `hsla(${hue}, 90%, 60%, 0.6)`;
      ctx.stroke();
    }
    
    ctx.restore();
  }, []);

  // New: Fractal spirals
  const drawFractalSpirals = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, size: number, frequencyData: Uint8Array, colors: typeof colorSchemes[0]) => {
    const spirals = 6;
    const avgFreq = Array.from(frequencyData.slice(0, 128)).reduce((a, b) => a + b, 0) / 128;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    
    for (let s = 0; s < spirals; s++) {
      ctx.save();
      ctx.rotate((Math.PI * 2 / spirals) * s + rotationRef.current * 0.3);
      
      ctx.beginPath();
      
      for (let t = 0; t < 200; t++) {
        const freqIdx = t % 128;
        const freqValue = frequencyData[freqIdx] || 128;
        const pulse = 1 + (freqValue / 255) * 0.5;
        
        const angle = t * 0.1;
        const radius = t * 0.8 * pulse;
        const wobble = Math.sin(timeRef.current * 0.003 + t * 0.05) * 5;
        
        const x = (radius + wobble) * Math.cos(angle);
        const y = (radius + wobble) * Math.sin(angle);
        
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      const hue = (hueShiftRef.current + s * 60) % 360;
      ctx.strokeStyle = `hsla(${hue}, 85%, 60%, ${0.3 + (avgFreq / 255) * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsla(${hue}, 85%, 60%, 0.8)`;
      ctx.stroke();
      
      ctx.restore();
    }
    
    ctx.restore();
  }, []);

  const drawFlowerOfLife = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, baseRadius: number, frequencyData: Uint8Array, colors: typeof colorSchemes[0]) => {
    const avgFreq = Array.from(frequencyData.slice(0, 64)).reduce((a, b) => a + b, 0) / 64;
    const pulse = 1 + (avgFreq / 255) * 0.4;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotationRef.current * 0.15);

    // Central circle with glow
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius * pulse, 0, Math.PI * 2);
    const hue = (hueShiftRef.current) % 360;
    ctx.strokeStyle = `hsla(${hue}, 90%, 60%, 1)`;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 25;
    ctx.shadowColor = `hsla(${hue}, 90%, 60%, 0.8)`;
    ctx.globalAlpha = 0.7 + (avgFreq / 255) * 0.3;
    ctx.stroke();

    // Multiple layers of surrounding circles
    for (let layer = 1; layer <= 3; layer++) {
      for (let i = 0; i < 6 * layer; i++) {
        const freqIndex = Math.floor((i / (6 * layer)) * 32);
        const freqValue = frequencyData[freqIndex] || 128;
        const angle = (Math.PI * 2 / (6 * layer)) * i + rotationRef.current * 0.1 * layer;
        const dist = baseRadius * pulse * layer * 0.8;
        const circleX = dist * Math.cos(angle);
        const circleY = dist * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(circleX, circleY, baseRadius * pulse * 0.6, 0, Math.PI * 2);
        const layerHue = (hueShiftRef.current + layer * 30 + i * 10) % 360;
        ctx.strokeStyle = `hsla(${layerHue}, 85%, 55%, 1)`;
        ctx.globalAlpha = 0.3 + (freqValue / 255) * 0.5;
        ctx.shadowColor = `hsla(${layerHue}, 85%, 55%, 0.6)`;
        ctx.stroke();
      }
    }

    ctx.restore();
  }, []);

  const drawMetatronsCube = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, frequencyData: Uint8Array, colors: typeof colorSchemes[0]) => {
    const avgFreq = Array.from(frequencyData.slice(32, 96)).reduce((a, b) => a + b, 0) / 64;
    const pulse = 1 + (avgFreq / 255) * 0.35;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotationRef.current * 0.08);

    // Draw multiple rotating hexagons
    for (let h = 0; h < 4; h++) {
      const hexSize = size * pulse * (1 - h * 0.2);
      const hue = (hueShiftRef.current + h * 40) % 360;
      drawHexagon(ctx, 0, 0, hexSize, rotationRef.current * (0.05 + h * 0.03), 0.4 + (avgFreq / 255) * 0.4, `hsla(${hue}, 85%, 60%, 1)`);
    }

    // Draw inner hexagons at vertices with trails
    for (let i = 0; i < 6; i++) {
      const freqIndex = Math.floor((i / 6) * 48) + 16;
      const freqValue = frequencyData[freqIndex] || 128;
      const angle = (Math.PI / 3) * i + rotationRef.current * 0.05;
      const dist = size * 0.6 * pulse;
      const vx = dist * Math.cos(angle);
      const vy = dist * Math.sin(angle);
      
      const hue = (hueShiftRef.current + i * 60) % 360;
      drawHexagon(ctx, vx, vy, size * 0.35 * pulse, -rotationRef.current * 0.15, 0.4 + (freqValue / 255) * 0.6, `hsla(${hue}, 90%, 55%, 1)`);
    }

    // Draw pulsing connecting lines
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      for (let j = i + 1; j < 6; j++) {
        const angle1 = (Math.PI / 3) * i + rotationRef.current * 0.05;
        const angle2 = (Math.PI / 3) * j + rotationRef.current * 0.05;
        const x1 = (size * 0.6 * pulse) * Math.cos(angle1);
        const y1 = (size * 0.6 * pulse) * Math.sin(angle1);
        const x2 = (size * 0.6 * pulse) * Math.cos(angle2);
        const y2 = (size * 0.6 * pulse) * Math.sin(angle2);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
    }
    const lineHue = (hueShiftRef.current + 180) % 360;
    ctx.strokeStyle = `hsla(${lineHue}, 80%, 50%, ${0.3 + (avgFreq / 255) * 0.4})`;
    ctx.lineWidth = 1;
    ctx.shadowBlur = 10;
    ctx.shadowColor = `hsla(${lineHue}, 80%, 50%, 0.6)`;
    ctx.stroke();

    ctx.restore();
  }, [drawHexagon]);

  const drawTorus = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, frequencyData: Uint8Array, colors: typeof colorSchemes[0]) => {
    const bassFreq = Array.from(frequencyData.slice(0, 16)).reduce((a, b) => a + b, 0) / 16;
    const midFreq = Array.from(frequencyData.slice(16, 64)).reduce((a, b) => a + b, 0) / 48;
    const highFreq = Array.from(frequencyData.slice(64, 128)).reduce((a, b) => a + b, 0) / 64;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotationRef.current * 0.02);

    const rings = 16;
    const pointsPerRing = 48;

    for (let ring = 0; ring < rings; ring++) {
      const ringProgress = ring / rings;
      const freqValue = ring < 5 ? bassFreq : ring < 11 ? midFreq : highFreq;
      const pulse = 1 + (freqValue / 255) * 0.5;

      ctx.beginPath();
      for (let point = 0; point <= pointsPerRing; point++) {
        const theta = (point / pointsPerRing) * Math.PI * 2;
        const phi = ringProgress * Math.PI * 2 + rotationRef.current * 0.4;

        const torusR = size * 0.6;
        const tubeR = size * 0.3 * pulse;
        const warp = Math.sin(theta * 4 + timeRef.current * 0.003) * 10 * (freqValue / 255);

        const px = (torusR + tubeR * Math.cos(phi) + warp) * Math.cos(theta);
        const py = (tubeR * Math.sin(phi) + warp * 0.5);
        const scale = 1 + (torusR + tubeR * Math.cos(phi)) / (torusR * 3);

        if (point === 0) ctx.moveTo(px * scale, py * scale);
        else ctx.lineTo(px * scale, py * scale);
      }

      const hue = (hueShiftRef.current + ring * 22) % 360;
      ctx.strokeStyle = `hsla(${hue}, 85%, 55%, ${0.2 + (freqValue / 255) * 0.6})`;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `hsla(${hue}, 85%, 55%, 0.7)`;
      ctx.stroke();
    }

    ctx.restore();
  }, []);

  const drawGoldenSpiral = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, frequencyData: Uint8Array, colors: typeof colorSchemes[0]) => {
    const avgFreq = Array.from(frequencyData.slice(0, 128)).reduce((a, b) => a + b, 0) / 128;
    const pulse = 1 + (avgFreq / 255) * 0.4;
    const phi = 1.618033988749;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotationRef.current * 0.2);

    // Draw multiple intertwined spirals
    for (let spiral = 0; spiral < 4; spiral++) {
      ctx.beginPath();
      let a = 2;
      const b = 0.17;

      for (let theta = 0; theta < 7 * Math.PI; theta += 0.02) {
        const freqIndex = Math.floor((theta / (7 * Math.PI)) * 128);
        const freqValue = frequencyData[freqIndex] || 128;
        const wobble = Math.sin(timeRef.current * 0.003 + theta) * 5 * (freqValue / 255);
        const r = (a * Math.pow(phi, theta * b) * pulse + wobble) * (0.8 + spiral * 0.1);
        const px = r * Math.cos(theta + spiral * (Math.PI / 2));
        const py = r * Math.sin(theta + spiral * (Math.PI / 2));

        if (theta === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }

      const hue = (hueShiftRef.current + spiral * 90) % 360;
      ctx.strokeStyle = `hsla(${hue}, 85%, 55%, ${0.5 + (avgFreq / 255) * 0.4})`;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = `hsla(${hue}, 85%, 55%, 0.8)`;
      ctx.stroke();
    }

    ctx.restore();
  }, []);

  const drawFrequencyBars = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, frequencyData: Uint8Array, colors: typeof colorSchemes[0]) => {
    const bars = 72;
    
    for (let i = 0; i < bars; i++) {
      const freqValue = frequencyData[Math.floor((i / bars) * 128)] || 0;
      const barHeight = (freqValue / 255) * 100;
      const angle = (i / bars) * Math.PI * 2 - Math.PI / 2 + rotationRef.current * 0.05;

      const x1 = centerX + (radius + 10) * Math.cos(angle);
      const y1 = centerY + (radius + 10) * Math.sin(angle);
      const x2 = centerX + (radius + 10 + barHeight) * Math.cos(angle);
      const y2 = centerY + (radius + 10 + barHeight) * Math.sin(angle);

      const hue = (hueShiftRef.current + i * 5) % 360;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `hsla(${hue}, 90%, 55%, ${0.5 + (freqValue / 255) * 0.5})`;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 8;
      ctx.shadowColor = `hsla(${hue}, 90%, 55%, 0.8)`;
      ctx.stroke();
    }
  }, []);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, frequencyData: Uint8Array, colors: typeof colorSchemes[0]) => {
    const avgFreq = Array.from(frequencyData).reduce((a, b) => a + b, 0) / frequencyData.length;
    const particleCount = Math.floor(40 + (avgFreq / 255) * 60);

    for (let i = 0; i < particleCount; i++) {
      const t = timeRef.current * 0.001 + i * 0.3;
      const orbitRadius = 150 + i * 4 + Math.sin(t * 0.5) * 50;
      const x = width / 2 + Math.sin(t * 0.7 + i * 0.4) * orbitRadius;
      const y = height / 2 + Math.cos(t * 0.5 + i * 0.6) * orbitRadius * 0.7;
      const freqIndex = i % 128;
      const size = 2 + (frequencyData[freqIndex] / 255) * 6;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      
      const hue = (hueShiftRef.current + i * 8) % 360;
      ctx.fillStyle = `hsla(${hue}, 85%, 60%, ${0.4 + (frequencyData[freqIndex] / 255) * 0.6})`;
      ctx.shadowBlur = 15;
      ctx.shadowColor = `hsla(${hue}, 85%, 60%, 0.8)`;
      ctx.fill();
    }
  }, []);

  // New: Psychedelic background
  const drawPsychedelicBackground = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, frequencyData: Uint8Array) => {
    const avgFreq = Array.from(frequencyData.slice(0, 32)).reduce((a, b) => a + b, 0) / 32;
    
    // Radial gradient background that shifts with audio
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) * 0.7
    );
    
    const hue1 = (hueShiftRef.current) % 360;
    const hue2 = (hueShiftRef.current + 120) % 360;
    const hue3 = (hueShiftRef.current + 240) % 360;
    
    gradient.addColorStop(0, `hsla(${hue1}, 60%, 5%, 0.05)`);
    gradient.addColorStop(0.4, `hsla(${hue2}, 50%, 3%, 0.03)`);
    gradient.addColorStop(1, `hsla(${hue3}, 40%, 2%, 0.02)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }, []);

  // Bass strobe with geometric patterns
  const drawBassStrobe = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, centerX: number, centerY: number, frequencyData: Uint8Array) => {
    // Calculate bass intensity (first 16 frequency bins are sub-bass/bass)
    const bassFreq = Array.from(frequencyData.slice(0, 16)).reduce((a, b) => a + b, 0) / 16;
    const subBass = Array.from(frequencyData.slice(0, 8)).reduce((a, b) => a + b, 0) / 8;
    
    // Detect bass hit (sudden increase in bass)
    const bassDelta = bassFreq - lastBassRef.current;
    lastBassRef.current = bassFreq;
    
    // Trigger strobe on bass hits above threshold
    if (bassDelta > 30 && bassFreq > 150) {
      strobeIntensityRef.current = Math.min(1, strobeIntensityRef.current + 0.8);
    }
    
    // Decay strobe intensity
    strobeIntensityRef.current *= 0.85;
    
    if (strobeIntensityRef.current < 0.05) return;
    
    const intensity = strobeIntensityRef.current;
    const hue = (hueShiftRef.current + bassFreq) % 360;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    
    // Geometric strobe pattern 1: Expanding hexagon burst
    const hexCount = 6;
    for (let h = 0; h < hexCount; h++) {
      const hexSize = (50 + h * 80) * intensity * (1 + subBass / 255);
      const hexAlpha = intensity * (1 - h / hexCount) * 0.7;
      
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + rotationRef.current * 0.5;
        const px = hexSize * Math.cos(angle);
        const py = hexSize * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      
      ctx.strokeStyle = `hsla(${hue + h * 30}, 100%, 70%, ${hexAlpha})`;
      ctx.lineWidth = 3 + intensity * 4;
      ctx.shadowBlur = 40 * intensity;
      ctx.shadowColor = `hsla(${hue + h * 30}, 100%, 60%, ${hexAlpha})`;
      ctx.stroke();
    }
    
    // Geometric strobe pattern 2: Radiating triangles (outline only)
    const triangleCount = 12;
    for (let t = 0; t < triangleCount; t++) {
      const angle = (Math.PI * 2 / triangleCount) * t + timeRef.current * 0.002;
      const dist = 100 + (bassFreq / 255) * 150 * intensity;
      
      ctx.save();
      ctx.rotate(angle);
      ctx.translate(dist, 0);
      
      ctx.beginPath();
      const triSize = 30 * intensity * (1 + subBass / 500);
      ctx.moveTo(0, -triSize);
      ctx.lineTo(triSize * 0.866, triSize * 0.5);
      ctx.lineTo(-triSize * 0.866, triSize * 0.5);
      ctx.closePath();
      
      const triHue = (hue + t * 30) % 360;
      ctx.strokeStyle = `hsla(${triHue}, 100%, 65%, ${intensity * 0.4})`;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 15 * intensity;
      ctx.shadowColor = `hsla(${triHue}, 100%, 60%, 0.6)`;
      ctx.stroke();
      
      ctx.restore();
    }
    
    // Geometric strobe pattern 3: Sacred geometry star burst (thinner lines)
    const starPoints = 8;
    ctx.beginPath();
    for (let i = 0; i < starPoints * 2; i++) {
      const angle = (Math.PI / starPoints) * i;
      const radius = i % 2 === 0 ? 200 * intensity : 100 * intensity;
      const adjustedRadius = radius * (1 + bassFreq / 400);
      const px = adjustedRadius * Math.cos(angle + rotationRef.current);
      const py = adjustedRadius * Math.sin(angle + rotationRef.current);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = `hsla(${(hue + 180) % 360}, 100%, 80%, ${intensity * 0.4})`;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 20 * intensity;
    ctx.shadowColor = `hsla(${(hue + 180) % 360}, 100%, 70%, 0.6)`;
    ctx.stroke();
    
    ctx.restore();
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

    // Clear with stronger fade for trail effect
    ctx.fillStyle = 'rgba(5, 5, 15, 0.12)';
    ctx.fillRect(0, 0, width, height);

    const colors = colorSchemes[currentTrack] || colorSchemes[0];
    let frequencyData = new Uint8Array(256);

    if (analyser && isPlaying) {
      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(frequencyData);
    } else if (!isPlaying) {
      // More dynamic ambient animation when not playing
      for (let i = 0; i < 256; i++) {
        frequencyData[i] = 40 + Math.sin(timeRef.current * 0.002 + i * 0.08) * 30 + 
                          Math.cos(timeRef.current * 0.003 + i * 0.12) * 20;
      }
    }

    // Update hue shift based on audio intensity
    const avgFreq = Array.from(frequencyData).reduce((a, b) => a + b, 0) / frequencyData.length;
    hueShiftRef.current += 0.3 + (avgFreq / 255) * 0.8;

    // Draw psychedelic background
    drawPsychedelicBackground(ctx, width, height, frequencyData);

    // Draw particles in background
    drawParticles(ctx, width, height, frequencyData, colors);

    // Draw based on current track with enhanced effects
    const baseSize = Math.min(width, height) * 0.28;

    // Always draw energy waves in background
    drawEnergyWaves(ctx, centerX, centerY, baseSize * 1.5, frequencyData, colors);

    if (currentTrack === 0) {
      // Spell Breaker - Hexagonal 528Hz pattern with kaleidoscope
      drawKaleidoscope(ctx, centerX, centerY, baseSize, frequencyData, colors);
      drawFlowerOfLife(ctx, centerX, centerY, baseSize * 0.5, frequencyData, colors);
      drawMetatronsCube(ctx, centerX, centerY, baseSize, frequencyData, colors);
      drawFrequencyBars(ctx, centerX, centerY, baseSize + 40, frequencyData, colors);
    } else if (currentTrack === 1) {
      // Numb3rs in the Cosmos - Golden Spiral with warp tunnel
      drawWarpTunnel(ctx, centerX, centerY, baseSize * 1.2, frequencyData, colors);
      drawGoldenSpiral(ctx, centerX, centerY, baseSize, frequencyData, colors);
      drawFractalSpirals(ctx, centerX, centerY, baseSize * 0.6, frequencyData, colors);
      drawFrequencyBars(ctx, centerX, centerY, baseSize + 30, frequencyData, colors);
    } else {
      // Infinity Sign - Torus Field with enhanced effects
      drawWarpTunnel(ctx, centerX, centerY, baseSize * 0.8, frequencyData, colors);
      drawTorus(ctx, centerX, centerY, baseSize * 1.1, frequencyData, colors);
      drawFlowerOfLife(ctx, centerX, centerY, baseSize * 0.3, frequencyData, colors);
      drawFrequencyBars(ctx, centerX, centerY, baseSize + 50, frequencyData, colors);
    }

    // Draw bass strobe effect on top of everything
    drawBassStrobe(ctx, width, height, centerX, centerY, frequencyData);

    rotationRef.current += 0.015 + (avgFreq / 255) * 0.01;
    timeRef.current += 16;
    animationRef.current = requestAnimationFrame(animate);
  }, [analyser, isPlaying, currentTrack, colorSchemes, drawFlowerOfLife, drawMetatronsCube, drawTorus, drawGoldenSpiral, drawFrequencyBars, drawParticles, drawKaleidoscope, drawWarpTunnel, drawEnergyWaves, drawFractalSpirals, drawPsychedelicBackground, drawBassStrobe]);

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
