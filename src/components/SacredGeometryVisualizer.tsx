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
  const lastBassRef = useRef(0);
  const lastMidRef = useRef(0);
  const tetraFlashRef = useRef(0);

  // Color schemes - clean, distinct colors for each track
  const colorSchemes = [
    { primary: '#00FFFF', secondary: '#FFD700', accent: '#FFFFFF' }, // Track 1: Cyan/Gold
    { primary: '#FFD700', secondary: '#00FFFF', accent: '#FFFFFF' }, // Track 2: Gold/Cyan  
    { primary: '#9945FF', secondary: '#00FFFF', accent: '#FFFFFF' }, // Track 3: Purple/Cyan
  ];

  // Detect transients (snare/clap) from high-mid frequencies
  const detectTransient = useCallback((frequencyData: Uint8Array): boolean => {
    const highMid = Array.from(frequencyData.slice(80, 150)).reduce((a, b) => a + b, 0) / 70;
    const delta = highMid - lastMidRef.current;
    lastMidRef.current = highMid;
    return delta > 40 && highMid > 120;
  }, []);

  // Draw sharp tetrahedron flash
  const drawTetrahedronFlash = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, size: number, intensity: number) => {
    if (intensity < 0.05) return;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationRef.current * 0.5);
    
    const s = size * intensity;
    
    // Draw 3D tetrahedron projection
    const vertices = [
      { x: 0, y: -s },
      { x: -s * 0.866, y: s * 0.5 },
      { x: s * 0.866, y: s * 0.5 },
      { x: 0, y: 0 } // center point for 3D effect
    ];
    
    ctx.strokeStyle = `rgba(255, 255, 255, ${intensity})`;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 30 * intensity;
    ctx.shadowColor = '#FFFFFF';
    
    // Draw outer triangle
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    ctx.lineTo(vertices[1].x, vertices[1].y);
    ctx.lineTo(vertices[2].x, vertices[2].y);
    ctx.closePath();
    ctx.stroke();
    
    // Draw lines to center
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(vertices[i].x, vertices[i].y);
      ctx.lineTo(vertices[3].x, vertices[3].y);
      ctx.stroke();
    }
    
    ctx.restore();
  }, []);

  // Track 1: Flower of Life - precise interlocking circles
  const drawFlowerOfLife = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, baseSize: number, bass: number, highs: number, colors: typeof colorSchemes[0]) => {
    const wobble = 1 + (bass / 255) * 0.15;
    const pulse = 1 + (highs / 255) * 0.1;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationRef.current * 0.02);
    
    const radius = baseSize * 0.3 * wobble;
    
    // Central circle
    ctx.beginPath();
    ctx.arc(0, 0, radius * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.8 + (highs / 255) * 0.2;
    ctx.stroke();
    
    // First ring - 6 circles
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + rotationRef.current * 0.01;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(x, y, radius * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = i % 2 === 0 ? colors.primary : colors.secondary;
      ctx.globalAlpha = 0.6 + (highs / 255) * 0.3;
      ctx.stroke();
    }
    
    // Second ring - 12 circles
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI / 6) * i + rotationRef.current * 0.005;
      const x = radius * 1.732 * Math.cos(angle);
      const y = radius * 1.732 * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(x, y, radius * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = colors.secondary;
      ctx.globalAlpha = 0.4 + (highs / 255) * 0.3;
      ctx.stroke();
    }
    
    // Outer ring - 18 circles
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI / 9) * i;
      const x = radius * 2.6 * wobble * Math.cos(angle);
      const y = radius * 2.6 * wobble * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(x, y, radius * pulse * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = colors.primary;
      ctx.globalAlpha = 0.3 + (highs / 255) * 0.2;
      ctx.stroke();
    }
    
    ctx.restore();
  }, []);

  // Track 2: Metatron's Cube - precise hexagonal structure
  const drawMetatronsCube = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, size: number, bass: number, highs: number, colors: typeof colorSchemes[0]) => {
    const wobble = 1 + (bass / 255) * 0.12;
    const pulse = 1 + (highs / 255) * 0.08;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationRef.current * 0.03);
    
    ctx.lineWidth = 1.5;
    
    // Outer hexagon
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = size * wobble * Math.cos(angle);
      const y = size * wobble * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = colors.primary;
    ctx.globalAlpha = 0.7 + (highs / 255) * 0.3;
    ctx.stroke();
    
    // Inner hexagon
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + Math.PI / 6;
      const x = size * 0.5 * wobble * Math.cos(angle);
      const y = size * 0.5 * wobble * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = colors.secondary;
    ctx.stroke();
    
    // 13 circles (nodes of Metatron's Cube)
    const nodes: {x: number, y: number}[] = [{ x: 0, y: 0 }];
    
    // Inner ring
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      nodes.push({
        x: size * 0.5 * wobble * Math.cos(angle),
        y: size * 0.5 * wobble * Math.sin(angle)
      });
    }
    
    // Outer ring
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      nodes.push({
        x: size * wobble * Math.cos(angle),
        y: size * wobble * Math.sin(angle)
      });
    }
    
    // Draw all connecting lines
    ctx.strokeStyle = colors.primary;
    ctx.globalAlpha = 0.3 + (highs / 255) * 0.2;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
    
    // Draw circles at nodes
    const circleRadius = size * 0.08 * pulse;
    nodes.forEach((node, i) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, circleRadius, 0, Math.PI * 2);
      ctx.strokeStyle = i === 0 ? colors.accent : (i <= 6 ? colors.secondary : colors.primary);
      ctx.globalAlpha = 0.6 + (highs / 255) * 0.4;
      ctx.stroke();
    });
    
    ctx.restore();
  }, []);

  // Track 3: Sri Yantra - interlocking triangles
  const drawSriYantra = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, size: number, bass: number, highs: number, colors: typeof colorSchemes[0]) => {
    const wobble = 1 + (bass / 255) * 0.1;
    const pulse = 1 + (highs / 255) * 0.08;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationRef.current * 0.02);
    
    ctx.lineWidth = 1.5;
    
    // Draw 9 interlocking triangles
    const triangleSizes = [1, 0.85, 0.7, 0.55, 0.4];
    
    triangleSizes.forEach((scale, index) => {
      const s = size * scale * wobble;
      
      // Upward triangle
      ctx.beginPath();
      ctx.moveTo(0, -s * pulse);
      ctx.lineTo(-s * 0.866, s * 0.5);
      ctx.lineTo(s * 0.866, s * 0.5);
      ctx.closePath();
      ctx.strokeStyle = colors.primary;
      ctx.globalAlpha = 0.5 + (highs / 255) * 0.3 - index * 0.08;
      ctx.stroke();
      
      // Downward triangle (offset)
      if (index < 4) {
        const s2 = size * (scale - 0.1) * wobble;
        ctx.beginPath();
        ctx.moveTo(0, s2 * pulse);
        ctx.lineTo(-s2 * 0.866, -s2 * 0.5);
        ctx.lineTo(s2 * 0.866, -s2 * 0.5);
        ctx.closePath();
        ctx.strokeStyle = colors.secondary;
        ctx.stroke();
      }
    });
    
    // Central bindu (dot)
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.03 * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = colors.accent;
    ctx.globalAlpha = 0.9;
    ctx.stroke();
    
    // Outer circle
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.15 * wobble, 0, Math.PI * 2);
    ctx.strokeStyle = colors.primary;
    ctx.globalAlpha = 0.4 + (highs / 255) * 0.2;
    ctx.stroke();
    
    // Lotus petals (16)
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI / 8) * i;
      const innerR = size * 1.2 * wobble;
      const outerR = size * 1.4 * wobble;
      
      ctx.beginPath();
      ctx.moveTo(innerR * Math.cos(angle - 0.1), innerR * Math.sin(angle - 0.1));
      ctx.quadraticCurveTo(
        outerR * Math.cos(angle), outerR * Math.sin(angle),
        innerR * Math.cos(angle + 0.1), innerR * Math.sin(angle + 0.1)
      );
      ctx.strokeStyle = colors.secondary;
      ctx.globalAlpha = 0.3 + (highs / 255) * 0.2;
      ctx.stroke();
    }
    
    ctx.restore();
  }, []);

  // Frequency bars around the geometry
  const drawFrequencyRing = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, frequencyData: Uint8Array, colors: typeof colorSchemes[0]) => {
    const bars = 64;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    
    for (let i = 0; i < bars; i++) {
      const freqValue = frequencyData[Math.floor((i / bars) * 128)] || 0;
      const barHeight = (freqValue / 255) * 60;
      const angle = (i / bars) * Math.PI * 2 - Math.PI / 2;
      
      const x1 = (radius + 5) * Math.cos(angle);
      const y1 = (radius + 5) * Math.sin(angle);
      const x2 = (radius + 5 + barHeight) * Math.cos(angle);
      const y2 = (radius + 5 + barHeight) * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = i % 2 === 0 ? colors.primary : colors.secondary;
      ctx.globalAlpha = 0.4 + (freqValue / 255) * 0.5;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    
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

    // Clear with dark background
    ctx.fillStyle = 'rgba(5, 5, 12, 0.25)';
    ctx.fillRect(0, 0, width, height);

    const colors = colorSchemes[currentTrack] || colorSchemes[0];
    let frequencyData = new Uint8Array(256);

    if (analyser && isPlaying) {
      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(frequencyData);
    } else if (!isPlaying) {
      // Gentle ambient
      for (let i = 0; i < 256; i++) {
        frequencyData[i] = 30 + Math.sin(timeRef.current * 0.002 + i * 0.1) * 15;
      }
    }

    // Extract frequency bands
    const bass = Array.from(frequencyData.slice(0, 20)).reduce((a, b) => a + b, 0) / 20;
    const mids = Array.from(frequencyData.slice(20, 80)).reduce((a, b) => a + b, 0) / 60;
    const highs = Array.from(frequencyData.slice(80, 180)).reduce((a, b) => a + b, 0) / 100;

    // Detect transient for tetrahedron flash
    if (detectTransient(frequencyData)) {
      tetraFlashRef.current = 1;
    }
    tetraFlashRef.current *= 0.85;

    const baseSize = Math.min(width, height) * 0.3;

    // Draw geometry based on current track
    if (currentTrack === 0) {
      drawFlowerOfLife(ctx, centerX, centerY, baseSize, bass, highs, colors);
    } else if (currentTrack === 1) {
      drawMetatronsCube(ctx, centerX, centerY, baseSize, bass, highs, colors);
    } else {
      drawSriYantra(ctx, centerX, centerY, baseSize, bass, highs, colors);
    }

    // Draw frequency ring
    drawFrequencyRing(ctx, centerX, centerY, baseSize * 1.5, frequencyData, colors);

    // Draw tetrahedron flash on snare/clap
    drawTetrahedronFlash(ctx, centerX, centerY, baseSize * 0.8, tetraFlashRef.current);

    // Update rotation based on bass
    rotationRef.current += 0.005 + (bass / 255) * 0.01;
    timeRef.current += 16;
    lastBassRef.current = bass;
    
    animationRef.current = requestAnimationFrame(animate);
  }, [analyser, isPlaying, currentTrack, colorSchemes, drawFlowerOfLife, drawMetatronsCube, drawSriYantra, drawFrequencyRing, drawTetrahedronFlash, detectTransient]);

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
      style={{ background: '#05050c' }}
    />
  );
};

export default SacredGeometryVisualizer;
