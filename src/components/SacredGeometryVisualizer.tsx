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
  const rotation2Ref = useRef(0);
  const rotation3Ref = useRef(0);
  const timeRef = useRef(0);
  const lastBassRef = useRef(0);
  const lastMidRef = useRef(0);
  const tetraFlashRef = useRef(0);
  const breatheRef = useRef(0);
  const orbitRef = useRef(0);

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

  // Track 1: Flower of Life - precise interlocking circles with enhanced motion
  const drawFlowerOfLife = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, baseSize: number, bass: number, highs: number, colors: typeof colorSchemes[0]) => {
    const wobble = 1 + (bass / 255) * 0.2;
    const pulse = 1 + (highs / 255) * 0.15;
    const breathe = Math.sin(breatheRef.current) * 0.1 + 1;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    
    const radius = baseSize * 0.3 * wobble * breathe;
    
    // Central circle with rotation
    ctx.save();
    ctx.rotate(rotationRef.current * 0.1);
    ctx.beginPath();
    ctx.arc(0, 0, radius * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.8 + (highs / 255) * 0.2;
    ctx.stroke();
    ctx.restore();
    
    // First ring - 6 circles with orbital motion
    for (let i = 0; i < 6; i++) {
      const baseAngle = (Math.PI / 3) * i;
      const orbitOffset = Math.sin(orbitRef.current + i * 0.5) * 0.1;
      const angle = baseAngle + rotationRef.current * 0.08 + orbitOffset;
      const dist = radius * (1 + Math.sin(breatheRef.current + i) * 0.08);
      const x = dist * Math.cos(angle);
      const y = dist * Math.sin(angle);
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation2Ref.current * 0.15);
      ctx.beginPath();
      ctx.arc(0, 0, radius * pulse * (1 + Math.sin(orbitRef.current + i) * 0.1), 0, Math.PI * 2);
      ctx.strokeStyle = i % 2 === 0 ? colors.primary : colors.secondary;
      ctx.globalAlpha = 0.6 + (highs / 255) * 0.3;
      ctx.stroke();
      ctx.restore();
    }
    
    // Second ring - 12 circles with counter-rotation
    for (let i = 0; i < 12; i++) {
      const baseAngle = (Math.PI / 6) * i;
      const angle = baseAngle - rotation2Ref.current * 0.05;
      const pulseDist = 1.732 + Math.sin(breatheRef.current * 1.5 + i * 0.3) * 0.15;
      const x = radius * pulseDist * Math.cos(angle);
      const y = radius * pulseDist * Math.sin(angle);
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-rotationRef.current * 0.1);
      ctx.beginPath();
      const circleSize = radius * pulse * (0.9 + Math.sin(orbitRef.current * 2 + i) * 0.15);
      ctx.arc(0, 0, circleSize, 0, Math.PI * 2);
      ctx.strokeStyle = colors.secondary;
      ctx.globalAlpha = 0.4 + (highs / 255) * 0.3;
      ctx.stroke();
      ctx.restore();
    }
    
    // Outer ring - 18 circles with wave motion
    for (let i = 0; i < 18; i++) {
      const baseAngle = (Math.PI / 9) * i;
      const angle = baseAngle + rotation3Ref.current * 0.03;
      const waveOffset = Math.sin(orbitRef.current * 1.5 + i * 0.4) * 0.2;
      const dist = radius * (2.6 + waveOffset) * wobble;
      const x = dist * Math.cos(angle);
      const y = dist * Math.sin(angle);
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation2Ref.current * 0.2);
      ctx.beginPath();
      ctx.arc(0, 0, radius * pulse * (0.7 + Math.sin(breatheRef.current + i * 0.2) * 0.15), 0, Math.PI * 2);
      ctx.strokeStyle = colors.primary;
      ctx.globalAlpha = 0.3 + (highs / 255) * 0.2;
      ctx.stroke();
      ctx.restore();
    }
    
    ctx.restore();
  }, []);

  // Track 2: Metatron's Cube - precise hexagonal structure with enhanced motion
  const drawMetatronsCube = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, size: number, bass: number, highs: number, colors: typeof colorSchemes[0]) => {
    const wobble = 1 + (bass / 255) * 0.18;
    const pulse = 1 + (highs / 255) * 0.12;
    const breathe = Math.sin(breatheRef.current * 0.8) * 0.12 + 1;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationRef.current * 0.06);
    
    ctx.lineWidth = 1.5;
    
    // Outer hexagon with pulsing vertices
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const baseAngle = (Math.PI / 3) * i;
      const vertexPulse = 1 + Math.sin(orbitRef.current * 2 + i) * 0.08;
      const angle = baseAngle + Math.sin(breatheRef.current + i * 0.5) * 0.05;
      const x = size * wobble * vertexPulse * Math.cos(angle);
      const y = size * wobble * vertexPulse * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = colors.primary;
    ctx.globalAlpha = 0.7 + (highs / 255) * 0.3;
    ctx.stroke();
    
    // Inner hexagon with counter-rotation
    ctx.save();
    ctx.rotate(-rotation2Ref.current * 0.1);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const baseAngle = (Math.PI / 3) * i + Math.PI / 6;
      const vertexPulse = 1 + Math.sin(orbitRef.current * 2.5 + i) * 0.1;
      const x = size * 0.5 * wobble * vertexPulse * breathe * Math.cos(baseAngle);
      const y = size * 0.5 * wobble * vertexPulse * breathe * Math.sin(baseAngle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = colors.secondary;
    ctx.stroke();
    ctx.restore();
    
    // 13 circles (nodes of Metatron's Cube) with orbital motion
    const nodes: {x: number, y: number, scale: number}[] = [{ x: 0, y: 0, scale: 1 + Math.sin(breatheRef.current) * 0.2 }];
    
    // Inner ring with individual orbits
    for (let i = 0; i < 6; i++) {
      const baseAngle = (Math.PI / 3) * i;
      const orbitOffset = Math.sin(orbitRef.current * 1.5 + i * 0.8) * 0.15;
      const angle = baseAngle + rotation2Ref.current * 0.08;
      const dist = size * (0.5 + orbitOffset) * wobble;
      nodes.push({
        x: dist * Math.cos(angle),
        y: dist * Math.sin(angle),
        scale: 1 + Math.sin(breatheRef.current + i) * 0.15
      });
    }
    
    // Outer ring with wave motion
    for (let i = 0; i < 6; i++) {
      const baseAngle = (Math.PI / 3) * i;
      const waveOffset = Math.sin(orbitRef.current + i * 0.6) * 0.12;
      const angle = baseAngle - rotation3Ref.current * 0.04;
      const dist = size * (1 + waveOffset) * wobble;
      nodes.push({
        x: dist * Math.cos(angle),
        y: dist * Math.sin(angle),
        scale: 1 + Math.sin(breatheRef.current * 1.2 + i) * 0.12
      });
    }
    
    // Draw all connecting lines with animated opacity
    ctx.strokeStyle = colors.primary;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const lineAlpha = 0.2 + Math.sin(orbitRef.current + i + j) * 0.1 + (highs / 255) * 0.2;
        ctx.globalAlpha = lineAlpha;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
    
    // Draw circles at nodes with individual pulsing
    nodes.forEach((node, i) => {
      const circleRadius = size * 0.08 * pulse * node.scale;
      ctx.beginPath();
      ctx.arc(node.x, node.y, circleRadius, 0, Math.PI * 2);
      ctx.strokeStyle = i === 0 ? colors.accent : (i <= 6 ? colors.secondary : colors.primary);
      ctx.globalAlpha = 0.6 + (highs / 255) * 0.4;
      ctx.stroke();
    });
    
    ctx.restore();
  }, []);

  // Track 3: Infinity Sign (Lemniscate) - flowing figure-eight with enhanced motion
  const drawInfinitySign = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, size: number, bass: number, highs: number, colors: typeof colorSchemes[0]) => {
    const wobble = 1 + (bass / 255) * 0.2;
    const pulse = 1 + (highs / 255) * 0.15;
    const breathe = Math.sin(breatheRef.current * 0.8) * 0.12 + 1;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationRef.current * 0.02);
    
    ctx.lineWidth = 2;
    
    // Draw multiple layered infinity signs with different scales and rotations
    const layers = 5;
    for (let layer = 0; layer < layers; layer++) {
      const layerScale = 1 - layer * 0.15;
      const layerBreath = Math.sin(breatheRef.current + layer * 0.6) * 0.1 + 1;
      const layerRotation = rotation2Ref.current * 0.03 * (layer % 2 === 0 ? 1 : -1);
      
      ctx.save();
      ctx.rotate(layerRotation);
      
      // Draw lemniscate using parametric equations
      ctx.beginPath();
      const a = size * 0.8 * layerScale * wobble * layerBreath; // Width parameter
      const steps = 120;
      
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        const waveOffset = Math.sin(orbitRef.current * 2 + t * 3) * (highs / 255) * 8;
        
        // Lemniscate of Bernoulli parametric equations
        const denominator = 1 + Math.sin(t) * Math.sin(t);
        const x = (a * Math.cos(t) / denominator) * pulse + waveOffset * Math.cos(t);
        const y = (a * Math.sin(t) * Math.cos(t) / denominator) * breathe * 0.6 + waveOffset * Math.sin(t) * 0.3;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.strokeStyle = layer % 2 === 0 ? colors.primary : colors.secondary;
      ctx.globalAlpha = (0.8 - layer * 0.12) + (highs / 255) * 0.2;
      ctx.stroke();
      ctx.restore();
    }
    
    // Draw flowing particles along the infinity path
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
      const t = ((orbitRef.current * 0.5 + i * (Math.PI * 2 / particleCount)) % (Math.PI * 2));
      const a = size * 0.8 * wobble;
      
      const denominator = 1 + Math.sin(t) * Math.sin(t);
      const x = (a * Math.cos(t) / denominator) * pulse;
      const y = (a * Math.sin(t) * Math.cos(t) / denominator) * breathe * 0.6;
      
      const particleSize = 4 + (highs / 255) * 6 + Math.sin(breatheRef.current + i) * 2;
      
      ctx.beginPath();
      ctx.arc(x, y, particleSize, 0, Math.PI * 2);
      ctx.fillStyle = colors.accent;
      ctx.globalAlpha = 0.6 + (highs / 255) * 0.4;
      ctx.fill();
      
      // Particle glow
      ctx.beginPath();
      ctx.arc(x, y, particleSize * 2, 0, Math.PI * 2);
      ctx.fillStyle = colors.primary;
      ctx.globalAlpha = 0.2 + (highs / 255) * 0.2;
      ctx.fill();
    }
    
    // Central energy point with pulsing
    const centerSize = size * 0.05 * pulse * (1 + Math.sin(breatheRef.current * 2) * 0.4);
    ctx.beginPath();
    ctx.arc(0, 0, centerSize, 0, Math.PI * 2);
    ctx.fillStyle = colors.accent;
    ctx.globalAlpha = 0.9;
    ctx.fill();
    
    // Outer orbital rings
    for (let ring = 0; ring < 3; ring++) {
      const ringRadius = size * (1.1 + ring * 0.2) * wobble;
      const ringRotation = rotation3Ref.current * 0.04 * (ring % 2 === 0 ? 1 : -1);
      const ringWave = Math.sin(orbitRef.current + ring * 0.8) * 0.1 + 1;
      
      ctx.save();
      ctx.rotate(ringRotation);
      
      // Draw elliptical orbit
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRadius * ringWave, ringRadius * 0.4 * ringWave, 0, 0, Math.PI * 2);
      ctx.strokeStyle = ring === 1 ? colors.secondary : colors.primary;
      ctx.globalAlpha = 0.25 + (highs / 255) * 0.15 - ring * 0.05;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
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
      drawInfinitySign(ctx, centerX, centerY, baseSize, bass, highs, colors);
    }

    // Draw frequency ring
    drawFrequencyRing(ctx, centerX, centerY, baseSize * 1.5, frequencyData, colors);

    // Draw tetrahedron flash on snare/clap
    drawTetrahedronFlash(ctx, centerX, centerY, baseSize * 0.8, tetraFlashRef.current);

    // Update rotations based on bass - multiple rotation speeds
    const bassIntensity = bass / 255;
    rotationRef.current += 0.012 + bassIntensity * 0.02;
    rotation2Ref.current += 0.008 + bassIntensity * 0.015;
    rotation3Ref.current += 0.005 + bassIntensity * 0.01;
    breatheRef.current += 0.03 + bassIntensity * 0.02;
    orbitRef.current += 0.025 + bassIntensity * 0.03;
    timeRef.current += 16;
    lastBassRef.current = bass;
    
    animationRef.current = requestAnimationFrame(animate);
  }, [analyser, isPlaying, currentTrack, colorSchemes, drawFlowerOfLife, drawMetatronsCube, drawInfinitySign, drawFrequencyRing, drawTetrahedronFlash, detectTransient]);

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
