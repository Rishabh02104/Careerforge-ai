"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCursor } from "@/context/CursorContext";

const EASE = [0.22, 1, 0.36, 1] as const;

const practices = [
  {
    icon: "💬",
    title: "AI Mock Interview",
    desc: "Practice real interview questions with an AI interviewer. Get live scoring and detailed feedback on every answer.",
    tag: "AI Powered",
    color: "#22d3ee",
    href: "/interview",
    items: [
      "Behavioral, Technical & HR modes",
      "Live answer scoring 1-10",
      "Detailed feedback per question",
      "Full report with grade at end",
    ],
    stats: "Interactive session scoring",
    cta: "Start Interview",
  },
  {
    icon: "💻",
    title: "Coding Rounds",
    desc: "Solve real DSA problems in a live editor. Get AI hints when stuck and full solution walkthroughs.",
    tag: "Live Editor",
    color: "#8b5cf6",
    href: "/coding",
    items: [
      "10 curated problems",
      "Easy, Medium, Hard difficulty",
      "AI hints on demand",
      "Full solution walkthroughs",
    ],
    stats: "10 problems across 6 topics",
    cta: "Start Coding",
  },
  {
    icon: "🧠",
    title: "HR Questions",
    desc: "Master the 12 most common HR questions. Practice your answers and get AI feedback instantly.",
    tag: "12 Questions",
    color: "#06b6d4",
    href: "/hr",
    items: [
      "12 real HR questions",
      "Model answers for each",
      "AI feedback on your answers",
      "Progress tracking",
    ],
    stats: "12 questions across 6 categories",
    cta: "Start HR Prep",
  },
];

const quickLinks = [
  { label: "Resume Analysis",  href: "/resume",    icon: "📄", color: "#22d3ee" },
  { label: "Career Roadmap",   href: "/roadmap",   icon: "🗺️", color: "#8b5cf6" },
  { label: "Job Matches",      href: "/jobs",      icon: "🎯", color: "#06b6d4" },
  { label: "Dashboard",        href: "/dashboard", icon: "📊", color: "#a78bfa" },
];

export default function PracticePage() {
  const router = useRouter();
  const { setCursor, resetCursor } = useCursor();

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute left-1/4 top-1/4 w-96 h-96 rounded-full"
          animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 6, repeat: Infinity }}
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)" }}
        />
        <motion.div
          className="absolute right-1/4 bottom-1/4 w-80 h-80 rounded-full"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 8, repeat: Infinity, delay: 3 }}
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12"
        >
          <Link href="/" className="text-cyan-400 text-sm hover:underline mb-6 inline-block">
            ← Back to Home
          </Link>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1.5 text-xs text-purple-400 mb-4">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                Practice Center
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Ace Your{" "}
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Next Interview
                </span>
              </h1>
              <p className="mt-3 text-slate-400 text-base max-w-xl">
                Choose your practice mode. Each tool is fully powered by AI
                to give you real feedback, not generic advice.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-4 flex-wrap">
              {[
                { value: "AI", label: "Mock Interviews", color: "#22d3ee" },
                { value: "10", label: "DSA Problems",    color: "#8b5cf6" },
                { value: "12", label: "HR Questions",    color: "#06b6d4" },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3 text-center min-w-[80px]"
                >
                  <div className="text-xl font-bold" style={{ color: s.color }}>
                    {s.value}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Main practice cards ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {practices.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
              className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6 flex flex-col group cursor-pointer relative overflow-hidden"
              whileHover={{ y: -5, borderColor: p.color + "44" }}
              onClick={() => router.push(p.href)}
              onMouseEnter={() => setCursor({ mode: "magnetic" })}
              onMouseLeave={resetCursor}
            >
              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${p.color}10 0%, transparent 70%)`,
                }}
              />

              {/* Top border glow */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, transparent, ${p.color}80, transparent)`,
                }}
              />

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5"
                style={{ background: p.color + "12", border: `1px solid ${p.color}25` }}
              >
                {p.icon}
              </div>

              {/* Title + tag */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="font-bold text-lg text-white">{p.title}</h2>
                <span
                  className="text-[10px] px-2 py-1 rounded-full border font-medium flex-shrink-0 mt-0.5"
                  style={{
                    color: p.color,
                    borderColor: p.color + "33",
                    background: p.color + "11",
                  }}
                >
                  {p.tag}
                </span>
              </div>

              <p className="text-slate-400 text-sm mb-4 leading-relaxed">{p.desc}</p>

              {/* Feature list */}
              <ul className="flex flex-col gap-2 mb-5 flex-1">
                {p.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-xs flex-shrink-0" style={{ color: p.color }}>
                      ✦
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Stats */}
              <div
                className="text-[11px] font-medium px-3 py-1.5 rounded-full w-fit mb-4"
                style={{
                  color: p.color,
                  background: p.color + "12",
                  border: `1px solid ${p.color}25`,
                }}
              >
                ✦ {p.stats}
              </div>

              {/* CTA button */}
              <motion.div
                className="w-full rounded-xl py-3 text-sm font-semibold text-center"
                style={{
                  background: p.color + "15",
                  color: p.color,
                  border: `1px solid ${p.color}30`,
                }}
                whileHover={{ background: p.color + "25" }}
              >
                {p.cta} →
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* ── Quick links ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-4">
            Also explore
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickLinks.map((link, i) => (
              <motion.button
                key={link.label}
                onClick={() => router.push(link.href)}
                className="rounded-xl border border-white/8 bg-white/3 p-4 flex items-center gap-3 text-left"
                whileHover={{
                  y: -2,
                  borderColor: link.color + "44",
                  backgroundColor: link.color + "08",
                }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                onMouseEnter={() => setCursor({ mode: "magnetic" })}
                onMouseLeave={resetCursor}
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: link.color + "15", border: `1px solid ${link.color}25` }}
                >
                  {link.icon}
                </span>
                <span className="text-sm text-slate-300 font-medium">
                  {link.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

      </div>
    </main>
  );
}