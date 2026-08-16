import React, { useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  alpha: number;
  pulsePhase: number;
  distance: number;
  angle: number;
  speed: number;
}

export const WebGLPulseShader: React.FC<{ height?: number; className?: string }> = ({
  height = 320,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user, telemetry } = useData();
  const isSharing = user.isSharing;
  const isVIP = user.tier === 'vip';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = containerRef.current?.clientWidth || 360);
    let heightPx = (canvas.height = height);

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      width = canvas.width = containerRef.current.clientWidth;
      heightPx = canvas.height = height;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Particle pool for node mesh
    const particleCount = isSharing ? 60 : 25;
    const particles: Particle[] = [];

    const primaryColor = isVIP ? '255, 215, 0' : '0, 255, 135';
    const secondaryColor = isVIP ? '255, 170, 0' : '6, 182, 212';

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * (Math.min(width, heightPx) * 0.42);
      particles.push({
        x: width / 2 + Math.cos(angle) * distance,
        y: heightPx / 2 + Math.sin(angle) * distance,
        radius: Math.random() * 2.2 + 0.8,
        color: Math.random() > 0.4 ? primaryColor : secondaryColor,
        vx: (Math.random() - 0.5) * (isSharing ? 1.4 : 0.4),
        vy: (Math.random() - 0.5) * (isSharing ? 1.4 : 0.4),
        alpha: Math.random() * 0.7 + 0.3,
        pulsePhase: Math.random() * Math.PI * 2,
        distance,
        angle,
        speed: (Math.random() * 0.015 + 0.005) * (isSharing ? 2.5 : 1),
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, heightPx);

      const centerX = width / 2;
      const centerY = heightPx / 2;
      const basePulse = Math.sin(frame * 0.05) * 6;
      const intensity = isSharing ? 1.4 : 0.7;

      // Outer Glow Ambient
      const ambientGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        Math.min(width, heightPx) * 0.48
      );
      ambientGradient.addColorStop(
        0,
        isVIP
          ? `rgba(255, 215, 0, ${isSharing ? '0.18' : '0.06'})`
          : `rgba(0, 255, 135, ${isSharing ? '0.16' : '0.05'})`
      );
      ambientGradient.addColorStop(
        0.5,
        isVIP
          ? `rgba(255, 165, 0, ${isSharing ? '0.08' : '0.02'})`
          : `rgba(6, 182, 212, ${isSharing ? '0.07' : '0.02'})`
      );
      ambientGradient.addColorStop(1, 'rgba(10, 10, 12, 0)');
      ctx.fillStyle = ambientGradient;
      ctx.fillRect(0, 0, width, heightPx);

      // Concentric Cyber Radar Rings
      const ringRadii = [45, 80, 120, 160];
      ringRadii.forEach((r, idx) => {
        const currentR = r + (isSharing ? Math.sin(frame * 0.04 + idx) * 4 : 0);
        ctx.beginPath();
        ctx.arc(centerX, centerY, currentR, 0, Math.PI * 2);
        ctx.strokeStyle = isVIP
          ? `rgba(255, 215, 0, ${0.12 - idx * 0.02})`
          : `rgba(0, 255, 135, ${0.12 - idx * 0.02})`;
        ctx.lineWidth = 1;
        ctx.setLineDash(idx % 2 === 1 ? [4, 8] : []);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Rotating Scanner Arc (when sharing)
      if (isSharing) {
        const scanAngle = (frame * 0.035) % (Math.PI * 2);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, 150, scanAngle, scanAngle + 0.45);
        ctx.closePath();
        const scanGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 150);
        scanGrad.addColorStop(0, `rgba(${primaryColor}, 0.25)`);
        scanGrad.addColorStop(1, `rgba(${primaryColor}, 0.0)`);
        ctx.fillStyle = scanGrad;
        ctx.fill();
      }

      // Draw particle data nodes and interconnected mesh lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (isSharing) {
          // Orbit and radial pulse
          p.angle += p.speed;
          p.x = centerX + Math.cos(p.angle) * (p.distance + Math.sin(frame * 0.06 + p.pulsePhase) * 8);
          p.y = centerY + Math.sin(p.angle) * (p.distance + Math.sin(frame * 0.06 + p.pulsePhase) * 8);
        } else {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 10 || p.x > width - 10) p.vx *= -1;
          if (p.y < 10 || p.y > heightPx - 10) p.vy *= -1;
        }

        // Draw connections to nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${p.color}, ${(1 - dist / 60) * 0.22 * intensity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connecting lines to center core if close
        const centerDist = Math.hypot(p.x - centerX, p.y - centerY);
        if (isSharing && centerDist < 120) {
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(${p.color}, ${(1 - centerDist / 120) * 0.28})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }

        // Draw node dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (isSharing ? 1.2 : 1), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha * (isSharing ? 1 : 0.6)})`;
        ctx.shadowColor = `rgb(${p.color})`;
        ctx.shadowBlur = isSharing ? 10 : 3;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Center Nexus Reactor Core
      const coreRadius = 26 + basePulse * (isSharing ? 1.2 : 0.4);

      // Core Outer Glow
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 4, centerX, centerY, coreRadius * 1.8);
      coreGrad.addColorStop(0, '#FFFFFF');
      coreGrad.addColorStop(0.3, isVIP ? '#FFD700' : '#00FF87');
      coreGrad.addColorStop(0.7, isVIP ? 'rgba(255, 140, 0, 0.5)' : 'rgba(6, 182, 212, 0.4)');
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Solid Core Sphere
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * 0.75, 0, Math.PI * 2);
      ctx.fillStyle = isVIP ? '#1A1408' : '#081711';
      ctx.strokeStyle = isVIP ? '#FFD700' : '#00FF87';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Inner Core Pulse Light
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = isVIP ? '#FFEA79' : '#55FFBA';
      ctx.shadowColor = isVIP ? '#FFD700' : '#00FF87';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [isSharing, isVIP, height]);

  return (
    <div ref={containerRef} className={`relative w-full overflow-hidden select-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full block"
        style={{ height: `${height}px` }}
      />
      {/* Overlay telemetry badges inside canvas viewport */}
      <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0A0A0C]/80 border border-white/10 backdrop-blur-md text-[11px] font-mono text-slate-300">
        <span
          className={`w-2 h-2 rounded-full ${
            isSharing
              ? isVIP
                ? 'bg-amber-400 animate-ping'
                : 'bg-[#00FF87] animate-ping'
              : 'bg-slate-500'
          }`}
        />
        <span>{isSharing ? 'P2P MESH ACTIVE' : 'NODE STANDBY'}</span>
      </div>

      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#0A0A0C]/80 border border-white/10 backdrop-blur-md text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
        <span className="text-[#00FF87]">{isSharing ? `${(telemetry.liveThroughputKBps / 1024).toFixed(2)} MB/s` : '0.00 MB/s'}</span>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">
          {isSharing ? (isVIP ? 'VIP ACCELERATED PROTOCOL' : 'LUMINA DATA REFINERY ENGINE') : 'TAP BUTTON TO ACTIVATE BANDWIDTH MINING'}
        </span>
      </div>
    </div>
  );
};
