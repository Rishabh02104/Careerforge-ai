"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  color: string;
  r: number; g: number; b: number;
}

const COLORS = [
  { hex: "#22d3ee", r: 34,  g: 211, b: 238 },
  { hex: "#3b82f6", r: 59,  g: 130, b: 246 },
  { hex: "#8b5cf6", r: 139, g: 92,  b: 246 },
  { hex: "#06b6d4", r: 6,   g: 182, b: 212 },
];

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    // More particles, better distributed
    const count = Math.min(160, Math.floor((window.innerWidth * window.innerHeight) / 8000));
    for (let i = 0; i < count; i++) {
      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      const baseVy = -(0.15 + Math.random() * 0.6);
      const baseOpacity = 0.2 + Math.random() * 0.5;
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.2,
        vy: baseVy,
        baseVx: (Math.random() - 0.5) * 0.2,
        baseVy,
        size: 0.8 + Math.random() * 2.2,
        opacity: baseOpacity,
        baseOpacity,
        color: c.hex,
        r: c.r, g: c.g, b: c.b,
      });
    }

    function loop() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: mx, y: my } = mouse.current;
      const REPULSE_R = 130;
      const ATTRACT_R = 250;
      const LINK_R = 110;

      // Draw links first (behind particles)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_R) {
            const alpha = (1 - dist / LINK_R) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Aggressive cursor connections
      particles.forEach((p) => {
        const cdx = p.x - mx;
        const cdy = p.y - my;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

        if (cdist < ATTRACT_R) {
          const alpha = (1 - cdist / ATTRACT_R) * 0.5;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }
      });

      particles.forEach((p) => {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Repulse zone
        if (dist < REPULSE_R && dist > 0) {
          const force = ((REPULSE_R - dist) / REPULSE_R) * 1.2;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Attract zone (outside repulse)
        if (dist >= REPULSE_R && dist < ATTRACT_R) {
          const force = ((ATTRACT_R - dist) / ATTRACT_R) * 0.15;
          p.vx -= (dx / dist) * force;
          p.vy -= (dy / dist) * force;
        }

        // Brighten near cursor
        const targetOpacity = dist < ATTRACT_R
          ? Math.min(1, p.baseOpacity + (1 - dist / ATTRACT_R) * 0.8)
          : p.baseOpacity;
        p.opacity += (targetOpacity - p.opacity) * 0.08;

        // Return to base velocity
        p.vx = p.vx * 0.92 + p.baseVx * 0.08;
        p.vy = p.vy * 0.92 + p.baseVy * 0.08;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
          p.vx = p.baseVx;
          p.vy = p.baseVy;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        // Draw with glow
        const brightenSize = dist < ATTRACT_R
          ? p.size * (1 + (1 - dist / ATTRACT_R) * 1.5)
          : p.size;

        ctx.shadowColor = p.color;
        ctx.shadowBlur = dist < ATTRACT_R ? 8 : 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, brightenSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.opacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Cursor glow dot
      if (mx > 0) {
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(mx, my, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34,211,238,0.6)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}