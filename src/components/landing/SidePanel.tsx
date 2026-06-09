"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useCursor } from "@/context/CursorContext";
import { useTransition } from "@/context/TransitionContext";

const skills = [
  { label: "ATS Score",   value: 82, color: "#22d3ee" },
  { label: "Keywords",    value: 67, color: "#8b5cf6" },
  { label: "Formatting",  value: 91, color: "#06b6d4" },
  { label: "Experience",  value: 74, color: "#a78bfa" },
];

function CircleScore({ score }: { score: number }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center w-20 h-20">
      <svg className="absolute" width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(34,211,238,0.08)" strokeWidth="5" />
        <motion.circle
          cx="40" cy="40" r={r}
          fill="none" stroke="url(#scoreGrad)" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.6 }}
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <motion.span
        className="text-xl font-bold text-white"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
      >
        {score}
      </motion.span>
    </div>
  );
}

function TiltCard({ children, className, delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 200, damping: 20 });
  const sRotY = useSpring(rotY, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotX.set(-y * 8);
    rotY.set(x * 8);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => { rotX.set(0); rotY.set(0); }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX: sRotX,
        rotateY: sRotY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function SidePanel() {
  const { setCursor, resetCursor } = useCursor();
  const router = useRouter();
  const { triggerTransition } = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      className="fixed right-5 top-1/2 z-40 flex flex-col gap-3"
      style={{ translateY: "-50%" }}
    >
      {/* Resume Score — PRIMARY card */}
      <TiltCard
        delay={0.7}
        className="w-52 rounded-2xl border border-cyan-500/15 bg-[#050816]/90 backdrop-blur-2xl p-4 shadow-xl shadow-cyan-500/5"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold text-cyan-400 tracking-[0.15em] uppercase">
              Resume Score
            </span>
            <motion.span
              className="flex items-center gap-1 text-[9px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-1 h-1 rounded-full bg-cyan-400 inline-block" />
              Live
            </motion.span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <CircleScore score={78} />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-slate-400">Overall</span>
              <span className="text-lg font-bold text-white">Good</span>
              <span className="text-[10px] text-cyan-400">+5 this week</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            {skills.map((s, i) => (
              <div key={s.label}>
                <div className="flex justify-between mb-0.5">
                  <span className="text-[10px] text-slate-500">{s.label}</span>
                  <span className="text-[10px] font-medium" style={{ color: s.color }}>{s.value}%</span>
                </div>
                <div className="h-0.5 w-full rounded-full bg-white/5">
                  <motion.div
                    className="h-0.5 rounded-full"
                    style={{ background: s.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.value}%` }}
                    transition={{ duration: 1.2, delay: 0.9 + i * 0.12, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => console.log("File:", e.target.files?.[0]?.name)}
          />
          <motion.button
            className="w-full rounded-xl border border-cyan-500/20 bg-cyan-500/8 py-2 text-[11px] font-semibold text-cyan-400 tracking-wide"
            whileHover={{
              backgroundColor: "rgba(34,211,238,0.15)",
              borderColor: "rgba(34,211,238,0.4)",
              boxShadow: "0 0 20px rgba(34,211,238,0.15)",
            }}
            whileTap={{ scale: 0.97 }}
            onMouseEnter={() => setCursor({ mode: "button-ripple" })}
            onMouseLeave={resetCursor}
            onClick={() => triggerTransition("ripple", () => router.push("/resume"))}
          >
            Upload Resume →
          </motion.button>
        </motion.div>
      </TiltCard>

      {/* Practice — SECONDARY card (smaller visual weight) */}
      <TiltCard
        delay={0.85}
        className="w-52 rounded-2xl border border-white/8 bg-[#050816]/80 backdrop-blur-2xl p-4 shadow-lg shadow-purple-500/5"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <motion.div
              className="w-5 h-5 rounded-full bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-[10px]"
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🎯
            </motion.div>
            <span className="text-[10px] font-semibold text-purple-400 tracking-[0.15em] uppercase">
              Practice Center
            </span>
          </div>

          {[
            { icon: "💬", label: "Mock Interview", tag: "AI", color: "#22d3ee" },
            { icon: "💻", label: "Coding Rounds",  tag: "Live", color: "#8b5cf6" },
            { icon: "🧠", label: "HR Questions",   tag: "12", color: "#a78bfa" },
          ].map((item, i) => (
            <motion.button
              key={item.label}
              className="w-full flex items-center justify-between rounded-lg px-2.5 py-2 mb-1.5 text-left border border-transparent"
              whileHover={{
                backgroundColor: "rgba(139,92,246,0.08)",
                borderColor: "rgba(139,92,246,0.2)",
                x: 3,
              }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.08 }}
              onMouseEnter={() => setCursor({ mode: "button-wipe" })}
              onMouseLeave={resetCursor}
              onClick={() => triggerTransition("wipe", () => router.push("/practice"))}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs">{item.icon}</span>
                <span className="text-[11px] text-slate-300">{item.label}</span>
              </div>
              <span
                className="text-[9px] px-1.5 py-0.5 rounded-full border font-medium"
                style={{
                  color: item.color,
                  borderColor: item.color + "33",
                  background: item.color + "11",
                }}
              >
                {item.tag}
              </span>
            </motion.button>
          ))}

          <motion.button
            className="mt-2 w-full rounded-xl bg-purple-500/10 border border-purple-500/20 py-2 text-[11px] font-semibold text-purple-400"
            whileHover={{
              backgroundColor: "rgba(139,92,246,0.2)",
              borderColor: "rgba(139,92,246,0.4)",
              boxShadow: "0 0 20px rgba(139,92,246,0.15)",
            }}
            whileTap={{ scale: 0.97 }}
            onMouseEnter={() => setCursor({ mode: "button-wipe" })}
            onMouseLeave={resetCursor}
            onClick={() => triggerTransition("wipe", () => router.push("/practice"))}
          >
            Start Practicing →
          </motion.button>
        </motion.div>
      </TiltCard>
    </motion.div>
  );
}