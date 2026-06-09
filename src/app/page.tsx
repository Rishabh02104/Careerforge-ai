"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import ParticleBackground from "@/components/landing/particlebackground";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import AboutSection from "@/components/landing/AboutSection";
import MagneticButton from "@/components/ui/MagneticButton";
import { useCursor } from "@/context/CursorContext";
import { useAuth } from "@/context/AuthContext";

const EASE = [0.22, 1, 0.36, 1] as const;

function stagger(i: number) {
  return {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: 0.1 + i * 0.12, ease: EASE },
  };
}

interface Planet {
  a: number;
  label: string;
  color: string;
  textColor: string;
  size: number;
}

interface Orbit {
  r: number;
  speed: number;
  planets: Planet[];
}

interface FlowParticle {
  orbitIdx: number;
  a: number;
  speed: number;
  size: number;
  opacity: number;
}

interface Lightning {
  pts: { x: number; y: number }[];
  life: number;
  color: string;
}

interface NebulaParticle {
  a: number;
  r: number;
  speed: number;
  size: number;
  opacity: number;
  color: string;
}

const PLANET_ROUTES: Record<string, string> = {
  "Resume AI":  "/resume",
  "Job Match":  "/jobs",
  "Interviews": "/interview",
  "Analytics":  "/dashboard",
  "Roadmap":    "/roadmap",
  "Coding":     "/coding",
  "HR Prep":    "/hr",
  "Practice":   "/practice",
};

function AICore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 360, y: 360 });
  const orbitsRef = useRef<Orbit[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;
    // Increased canvas sizing for a larger visual footprint
    const W = 720;
    const H = 720;
    canvas.width = W;
    canvas.height = H;
    const ox = W / 2;
    const oy = H / 2;

    let animState = 0; // 0=pulsar 1=nebula 2=storm
    let clickFlash = 0;

    const nebulaParticles: NebulaParticle[] = Array.from({ length: 65 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 30 + Math.random() * 65,
      speed: (Math.random() - 0.5) * 0.012,
      size: 1 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.6,
      color: Math.random() > 0.5 ? "#22d3ee" : "#a78bfa",
    }));

    let lightnings: Lightning[] = [];

    function makeLightning() {
      const angle = Math.random() * Math.PI * 2;
      const pts = [{ x: ox, y: oy }];
      let lx = ox, ly = oy;
      for (let i = 0; i < 7; i++) {
        lx += Math.cos(angle + (Math.random() - 0.5) * 1.1) * (12 + Math.random() * 18);
        ly += Math.sin(angle + (Math.random() - 0.5) * 1.1) * (12 + Math.random() * 18);
        pts.push({ x: lx, y: ly });
      }
      lightnings.push({
        pts,
        life: 1,
        color: Math.random() > 0.5 ? "#06b6d4" : "#c084fc",
      });
    }

    const handleMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    canvas.addEventListener("mousemove", handleMouse);

    const handleClick = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const cx = e.clientX - r.left;
      const cy = e.clientY - r.top;
      const distToCore = Math.hypot(cx - ox, cy - oy);

      // FIXED: Instant 1-click state change
      if (distToCore < 90) {
        clickFlash = 1;
        animState = (animState + 1) % 3;
        return;
      }

      orbitsRef.current.forEach((o) => {
        o.planets.forEach((p) => {
          const px = ox + Math.cos(p.a) * o.r;
          const py = oy + Math.sin(p.a) * o.r;
          if (Math.hypot(cx - px, cy - py) < 36) {
            const route = PLANET_ROUTES[p.label];
            if (route) window.location.href = route;
          }
        });
      });
    };
    canvas.addEventListener("click", handleClick);

    // FIXED: Upgraded orbit radiuses and charged colors to match neon/cyber theme
    const orbits: Orbit[] = [
      {
        r: 120,
        speed: 0.008,
        planets: [
          { a: 0,    label: "Resume AI", color: "#22d3ee", textColor: "#22d3ee", size: 10 },
          { a: 3.14, label: "Job Match", color: "#a78bfa", textColor: "#a78bfa", size: 9 },
        ],
      },
      {
        r: 195,
        speed: 0.005,
        planets: [
          { a: 0.5,  label: "Interviews", color: "#38bdf8", textColor: "#38bdf8", size: 9 },
          { a: 2.6,  label: "Analytics",  color: "#c084fc", textColor: "#c084fc", size: 10 },
          { a: 4.7,  label: "Roadmap",    color: "#06b6d4", textColor: "#22d3ee", size: 8 },
        ],
      },
      {
        r: 265,
        speed: 0.003,
        planets: [
          { a: 1.0,  label: "Coding",     color: "#6366f1", textColor: "#818cf8", size: 10 },
          { a: 3.2,  label: "HR Prep",    color: "#e0a7ff", textColor: "#e8bfff", size: 9 },
          { a: 5.3,  label: "Practice",   color: "#22d3ee", textColor: "#67e8f9", size: 8 },
        ],
      },
    ];
    orbitsRef.current = orbits;

    const flowParticles: FlowParticle[] = orbits.flatMap((o, oi) =>
      Array.from({ length: 12 }, (_, i) => ({
        orbitIdx: oi,
        a: (i / 12) * Math.PI * 2,
        speed: o.speed * 0.7,
        size: 1.5,
        opacity: 0.15 + Math.random() * 0.25,
      }))
    );

    function glow(color: string, blur: number) {
      ctx!.shadowColor = color;
      ctx!.shadowBlur = blur;
    }
    function noGlow() { ctx!.shadowBlur = 0; }

    function drawOrbitRings() {
      orbits.forEach((o) => {
        ctx!.beginPath();
        ctx!.arc(ox, oy, o.r, 0, Math.PI * 2);
        ctx!.strokeStyle = "rgba(34,211,238,0.06)";
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
      });
    }

    function drawFlowParticles() {
      flowParticles.forEach((p) => {
        p.a += p.speed;
        const r = orbits[p.orbitIdx].r;
        const px = ox + Math.cos(p.a) * r;
        const py = oy + Math.sin(p.a) * r;
        ctx!.beginPath();
        ctx!.arc(px, py, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(34,211,238,${p.opacity})`;
        ctx!.fill();
      });
    }

    function drawPlanet(
      px: number, py: number,
      label: string, color: string,
      textColor: string, size: number
    ) {
      const distToMouse = Math.hypot(px - mouseRef.current.x, py - mouseRef.current.y);
      const hover = distToMouse < 50;
      const scale = hover ? 1.7 : 1;

      const grad = ctx!.createRadialGradient(px, py, 0, px, py, size * 4 * scale);
      grad.addColorStop(0, color + "44");
      grad.addColorStop(1, color + "00");
      ctx!.beginPath();
      ctx!.arc(px, py, size * 4 * scale, 0, Math.PI * 2);
      ctx!.fillStyle = grad;
      ctx!.fill();

      glow(color, hover ? 28 : 14);
      ctx!.beginPath();
      ctx!.arc(px, py, size * scale, 0, Math.PI * 2);
      ctx!.fillStyle = color;
      ctx!.fill();
      noGlow();

      const dx = px - ox;
      const dy = py - oy;
      const dist = Math.hypot(dx, dy);
      const lx = px + (dx / dist) * (size * scale + 22);
      const ly = py + (dy / dist) * (size * scale + 22);

      ctx!.font = hover ? "bold 14px system-ui" : "12px system-ui";
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";

      if (hover) {
        glow(color, 12);
        canvas!.style.cursor = "pointer";
      }
      ctx!.fillStyle = textColor;
      ctx!.fillText(label, lx, ly);
      noGlow();
    }

    // FIXED: Reworked lighting vectors and deep shadows for a high-fidelity 3D core
    function drawPlanetBase() {
      const prox = Math.max(0, 1 - Math.hypot(mouseRef.current.x - ox, mouseRef.current.y - oy) / 200);
      const r = 58 + Math.sin(t) * 2.5; // Made the core planet significantly bigger
      const ac = animState === 0 ? "34,211,238" : animState === 1 ? "168,85,247" : "99,102,241";

      const sg = ctx!.createRadialGradient(ox - 22, oy - 24, 4, ox, oy, r);
      if (animState === 0) {
        sg.addColorStop(0, "rgba(165,243,252,0.98)");
        sg.addColorStop(0.25, "rgba(34,211,238,0.9)");
        sg.addColorStop(0.65, "rgba(8,80,120,0.95)");
        sg.addColorStop(1, "rgba(2,12,32,0.98)");
      } else if (animState === 1) {
        sg.addColorStop(0, "rgba(232,191,255,0.98)");
        sg.addColorStop(0.25, "rgba(168,85,247,0.9)");
        sg.addColorStop(0.65, "rgba(76,29,149,0.95)");
        sg.addColorStop(1, "rgba(15,5,35,0.98)");
      } else {
        sg.addColorStop(0, "rgba(199,210,254,0.98)");
        sg.addColorStop(0.25, "rgba(99,102,241,0.9)");
        sg.addColorStop(0.65, "rgba(49,46,129,0.95)");
        sg.addColorStop(1, "rgba(7,10,30,0.98)");
      }

      glow(
        animState === 0 ? "#22d3ee" : animState === 1 ? "#a855f7" : "#6366f1",
        40 + prox * 25
      );
      ctx!.beginPath();
      ctx!.arc(ox, oy, r, 0, Math.PI * 2);
      ctx!.fillStyle = sg;
      ctx!.fill();
      noGlow();

      ctx!.save();
      ctx!.beginPath();
      ctx!.arc(ox, oy, r, 0, Math.PI * 2);
      ctx!.clip();

      const bandColors =
        animState === 0
          ? ["rgba(34,211,238,0.16)", "rgba(6,182,212,0.1)", "rgba(14,116,144,0.15)"]
          : animState === 1
          ? ["rgba(168,85,247,0.16)", "rgba(109,40,217,0.1)", "rgba(192,132,252,0.15)"]
          : ["rgba(99,102,241,0.18)", "rgba(79,70,229,0.12)", "rgba(129,140,248,0.15)"];

      for (let i = 0; i < 3; i++) {
        const by = oy - r + (i + 1) * ((r * 2) / 4) + Math.sin(t * 0.4 + i) * 4;
        ctx!.beginPath();
        ctx!.ellipse(ox, by, r * 0.98, 7 + i * 2.5, 0, 0, Math.PI * 2);
        ctx!.fillStyle = bandColors[i];
        ctx!.fill();
      }

      // Stronger 3D atmospheric rim specular highlight
      const hg = ctx!.createRadialGradient(ox - 20, oy - 22, 0, ox - 15, oy - 15, r * 0.75);
      hg.addColorStop(0, "rgba(255,255,255,0.35)");
      hg.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.beginPath();
      ctx!.arc(ox, oy, r, 0, Math.PI * 2);
      ctx!.fillStyle = hg;
      ctx!.fill();

      // Deep spatial occlusion drop shadow to anchor the 3D depth
      const tg = ctx!.createRadialGradient(ox + r * 0.3, oy + r * 0.2, r * 0.2, ox + r * 0.4, oy + r * 0.3, r * 1.05);
      tg.addColorStop(0, "rgba(0,0,0,0)");
      tg.addColorStop(1, "rgba(2,4,16,0.85)");
      ctx!.beginPath();
      ctx!.arc(ox, oy, r, 0, Math.PI * 2);
      ctx!.fillStyle = tg;
      ctx!.fill();
      ctx!.restore();

      const ag = ctx!.createRadialGradient(ox, oy, r - 5, ox, oy, r + 18);
      ag.addColorStop(0, `rgba(${ac},0.45)`);
      ag.addColorStop(0.5, `rgba(${ac},0.15)`);
      ag.addColorStop(1, `rgba(${ac},0)`);
      ctx!.beginPath();
      ctx!.arc(ox, oy, r + 18, 0, Math.PI * 2);
      ctx!.fillStyle = ag;
      ctx!.fill();

      if (clickFlash > 0) {
        ctx!.beginPath();
        ctx!.arc(ox, oy, r + clickFlash * 45, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(${ac},${clickFlash * 0.8})`;
        ctx!.lineWidth = 2.5;
        ctx!.stroke();
        clickFlash -= 0.06;
      }
    }

    function drawPulsar() {
      for (let i = 0; i < 3; i++) {
        const phase = (t * 0.8 + i * 1.2) % (Math.PI * 2);
        const prog = (Math.sin(phase) + 1) / 2;
        const pr = 70 + prog * 190;
        const alpha = (1 - prog) * 0.4;
        ctx!.beginPath();
        ctx!.arc(ox, oy, pr, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(34,211,238,${alpha})`;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
      }
      for (let b = 0; b < 2; b++) {
        const angle = t * 1.3 + b * Math.PI;
        const len = 240;
        ctx!.save();
        ctx!.translate(ox, oy);
        ctx!.rotate(angle);
        const bg = ctx!.createLinearGradient(60, 0, len, 0);
        bg.addColorStop(0, "rgba(34,211,238,0.55)");
        bg.addColorStop(1, "rgba(34,211,238,0)");
        ctx!.fillStyle = bg;
        ctx!.beginPath();
        ctx!.moveTo(60, -8);
        ctx!.lineTo(len, 0);
        ctx!.lineTo(60, 8);
        ctx!.fill();
        ctx!.restore();
      }
      drawPlanetBase();
    }

    function drawNebula() {
      for (let l = 0; l < 4; l++) {
        const rot = t * (0.08 + l * 0.04) * (l % 2 === 0 ? 1 : -1);
        ctx!.save();
        ctx!.translate(ox, oy);
        ctx!.rotate(rot);
        const ng = ctx!.createRadialGradient(0, 0, 40, 0, 0, 120 + l * 25);
        const alpha = 0.07 - l * 0.01;
        ng.addColorStop(0, `rgba(168,85,247,${alpha * 3})`);
        ng.addColorStop(0.4, `rgba(34,211,238,${alpha * 2})`);
        ng.addColorStop(0.7, `rgba(147,51,234,${alpha})`);
        ng.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.beginPath();
        ctx!.ellipse(0, 0, 120 + l * 30, 85 + l * 20, l * 0.4, 0, Math.PI * 2);
        ctx!.fillStyle = ng;
        ctx!.fill();
        ctx!.restore();
      }
      ctx!.save();
      ctx!.translate(ox, oy);
      ctx!.scale(1, 0.28);
      for (let ri = 0; ri < 3; ri++) {
        const rr = 80 + ri * 22;
        ctx!.beginPath();
        ctx!.arc(0, 0, rr, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(168,85,247,${0.35 - ri * 0.08})`;
        ctx!.lineWidth = 5 + ri * 2;
        ctx!.stroke();
      }
      ctx!.restore();
      
      nebulaParticles.forEach((p) => {
        p.a += p.speed;
        const px = ox + Math.cos(p.a) * p.r;
        const py = oy + Math.sin(p.a) * p.r * 0.5;
        glow(p.color, 6);
        ctx!.beginPath();
        ctx!.arc(px, py, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, "0");
        ctx!.fill();
        noGlow();
      });
      drawPlanetBase();
    }

    function drawStorm() {
      for (let l = 0; l < 3; l++) {
        const ang = t * (0.35 + l * 0.08) * (l % 2 === 0 ? 1 : -1);
        ctx!.save();
        ctx!.translate(ox, oy);
        ctx!.rotate(ang);
        const sg = ctx!.createRadialGradient(0, 0, 50, 0, 0, 120 + l * 20);
        sg.addColorStop(0, "rgba(99,102,241,0.1)");
        sg.addColorStop(0.5, "rgba(79,70,229,0.06)");
        sg.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.beginPath();
        ctx!.ellipse(0, 0, 115 + l * 25, 85 + l * 15, l * 0.3, 0, Math.PI * 2);
        ctx!.fillStyle = sg;
        ctx!.fill();
        ctx!.restore();
      }
      if (Math.random() < 0.18) makeLightning();
      lightnings = lightnings.filter((l) => l.life > 0.02);
      lightnings.forEach((l) => {
        l.life *= 0.86;
        ctx!.beginPath();
        ctx!.moveTo(l.pts[0].x, l.pts[0].y);
        l.pts.slice(1).forEach((p) => ctx!.lineTo(p.x, p.y));
        ctx!.strokeStyle = l.color + Math.floor(l.life * 220).toString(16).padStart(2, "0");
        ctx!.lineWidth = 1.8;
        glow(l.color, 12);
        ctx!.stroke();
        noGlow();
      });
      ctx!.save();
      ctx!.translate(ox, oy);
      ctx!.rotate(-t * 0.5);
      for (let e = 0; e < 4; e++) {
        const er = 24 + e * 9;
        ctx!.beginPath();
        ctx!.arc(0, 0, er, 0, Math.PI * (1.6 + e * 0.1));
        ctx!.strokeStyle = `rgba(129,140,248,${0.35 - e * 0.07})`;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
      }
      ctx!.restore();
      drawPlanetBase();
    }

    function drawMouseBeam() {
      const d = Math.hypot(mouseRef.current.x - ox, mouseRef.current.y - oy);
      if (d < 340 && d > 75) {
        const ac = animState === 0 ? "34,211,238" : animState === 1 ? "168,85,247" : "99,102,241";
        const alpha = (1 - d / 340) * 0.18;
        ctx!.beginPath();
        ctx!.strokeStyle = `rgba(${ac},${alpha})`;
        ctx!.lineWidth = 1;
        ctx!.setLineDash([4, 6]);
        ctx!.moveTo(mouseRef.current.x, mouseRef.current.y);
        ctx!.lineTo(ox, oy);
        ctx!.stroke();
        ctx!.setLineDash([]);
      }
    }

    function loop() {
      t += 0.016;
      ctx!.clearRect(0, 0, W, H);
      canvas!.style.cursor = "default";

      drawOrbitRings();
      drawFlowParticles();
      drawMouseBeam();

      if (animState === 0) drawPulsar();
      else if (animState === 1) drawNebula();
      else drawStorm();

      orbits.forEach((o) => {
        o.planets.forEach((p) => {
          p.a += o.speed;
          const px = ox + Math.cos(p.a) * o.r;
          const py = oy + Math.sin(p.a) * o.r;
          drawPlanet(px, py, p.label, p.color, p.textColor, p.size);
        });
      });

      orbitsRef.current = orbits;
      animId = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={720}
      height={720}
      className="pointer-events-auto"
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
}

export default function Home() {
  const { user } = useAuth();
  const { setCursor, resetCursor } = useCursor();
  const router = useRouter();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 18 });

  const d1x = useTransform(springX, [-1, 1], [-6,   6]);
  const d1y = useTransform(springY, [-1, 1], [-4,   4]);
  const d2x = useTransform(springX, [-1, 1], [-12, 12]);
  const d2y = useTransform(springY, [-1, 1], [-8,   8]);
  const d3x = useTransform(springX, [-1, 1], [-20, 20]);
  const d3y = useTransform(springY, [-1, 1], [-14, 14]);
  const orbX = useTransform(springX, [-1, 1], [20, -20]);
  const orbY = useTransform(springY, [-1, 1], [12, -12]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [mouseX, mouseY]);

  return (
    <main className="min-h-screen bg-[#050816] text-white overflow-hidden">
      <Navbar />

      <section
        id="hero-section"
        className="relative flex min-h-screen items-center justify-between px-8 md:px-16 gap-4"
      >
        <ParticleBackground />

        <motion.div
          className="absolute left-[45%] top-[15%] h-[480px] w-[480px] rounded-full pointer-events-none"
          animate={{ scale: [1, 1.12, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
            x: orbX,
            y: orbY,
          }}
        />

        <motion.div
          className="absolute right-[5%] bottom-[10%] h-72 w-72 rounded-full pointer-events-none"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
          }}
        />

        {/* LEFT: Hero Text */}
        <div className="relative z-10 flex flex-col items-start max-w-xl flex-shrink-0">
          <motion.div
            {...stagger(0)}
            style={{ x: d1x, y: d1y }}
            className="mb-5 flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-1.5 text-xs text-cyan-400 backdrop-blur"
            onMouseEnter={() => setCursor({ mode: "magnetic" })}
            onMouseLeave={resetCursor}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            AI-Powered Career Platform · Now in Beta
          </motion.div>

          <motion.h1
            {...stagger(1)}
            style={{ x: d2x, y: d2y }}
            className="text-5xl font-bold leading-[1.1] tracking-tight md:text-[62px]"
            onMouseEnter={() => setCursor({ mode: "text" })}
            onMouseLeave={resetCursor}
          >
            Build Your{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Dream Career
              </span>
              <motion.span
                className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-cyan-400 to-blue-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              />
            </span>{" "}
            With AI
          </motion.h1>

          <motion.p
            {...stagger(2)}
            style={{ x: d1x, y: d1y }}
            className="mt-5 max-w-lg text-base leading-relaxed text-slate-300"
            onMouseEnter={() => setCursor({ mode: "text" })}
            onMouseLeave={resetCursor}
          >
            Resume analysis, AI mock interviews, coding practice, career
            roadmaps, and real-time analytics —{" "}
            <span className="text-white font-medium">all in one platform.</span>
          </motion.p>

          <motion.div
            {...stagger(3)}
            className="mt-6 flex items-center gap-8"
          >
            {[
              { value: "Beta", label: "Current Stage" },
              { value: "Active",  label: "Development" },
              { value: "LLaMA & Groq", label: "AI Models" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-lg font-bold text-white">{s.value}</span>
                <span className="text-xs text-slate-500">{s.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            {...stagger(4)}
            style={{ x: d3x, y: d3y }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <MagneticButton
              transitionType="ripple"
              cursorMode="button-ripple"
              className="rounded-xl bg-cyan-500 px-7 py-3 font-semibold text-black text-sm shadow-lg shadow-cyan-500/25"
              onClick={() => router.push(user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/signup")}
            >
              Get Started Free →
            </MagneticButton>

            <MagneticButton
              transitionType="wipe"
              cursorMode="button-wipe"
              className="rounded-xl border border-white/15 bg-white/5 px-7 py-3 text-sm text-white backdrop-blur"
              onClick={() => router.push("/demo")}
            >
              Interactive Sandbox
            </MagneticButton>
          </motion.div>

          <motion.div {...stagger(5)} className="mt-3">
            <MagneticButton
              transitionType="shatter"
              cursorMode="button-shatter"
              className="rounded-xl border border-cyan-500/20 px-4 py-2 text-xs text-cyan-400/80 hover:text-cyan-400"
              onClick={() =>
                document
                  .querySelector("#features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              ⚡ Explore Features
            </MagneticButton>
          </motion.div>
        </div>

        {/* FIXED: Added a flex-grow wrapper to dynamically bridge the gap */}
        <div className="flex-grow hidden lg:flex items-center justify-center min-w-[100px] relative">
          {/* Spatial connector lines or visual content ideas can be placed here */}
        </div>

        {/* RIGHT: AI Core Orbit */}
        <motion.div
          className="relative z-10 hidden lg:flex items-center justify-center flex-shrink-0"
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <AICore />
        </motion.div>

      </section>

      {/* ── FEATURES SECTION ────────────────────────────────────────────────── */}
      <FeaturesSection />

      {/* ── PRICING SECTION ─────────────────────────────────────────────────── */}
      <PricingSection />

      {/* ── ABOUT SECTION ───────────────────────────────────────────────────── */}
      <AboutSection />

    </main>
  );
}