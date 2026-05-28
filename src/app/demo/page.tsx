"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const features = [
  {
    icon: "📄",
    title: "AI Resume Analyzer",
    desc: "Upload your resume and get instant ATS score, keyword analysis, and improvement suggestions.",
    color: "#22d3ee",
    demo: "Your resume scored 78/100. Add keywords: React, TypeScript, Node.js to boost by 12 points.",
  },
  {
    icon: "💬",
    title: "Mock Interview",
    desc: "Practice with our AI interviewer. Get real-time feedback on your answers.",
    color: "#8b5cf6",
    demo: "Q: Tell me about yourself. AI Analysis: Strong opening. Add specific metrics to your achievements.",
  },
  {
    icon: "💻",
    title: "Coding Practice",
    desc: "Solve real interview problems with AI hints and full solution walkthroughs.",
    color: "#06b6d4",
    demo: "Problem: Two Sum. Difficulty: Easy. Your solution runs in O(n) time. Optimal!",
  },
];

export default function DemoPage() {
  const [active, setActive] = useState(0);

  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <Link href="/" className="text-cyan-400 text-sm hover:underline mb-8 inline-block">
          ← Back to Home
        </Link>

        <div className="mb-12 text-center">
          <div className="inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 mb-4">
            🎮 Live Demo
          </div>
          <h1 className="text-4xl font-bold md:text-6xl">
            See CareerForge{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              In Action
            </span>
          </h1>
          <p className="mt-4 text-gray-400 text-lg">
            Click each feature to see a live preview.
          </p>
        </div>

        {/* Feature tabs */}
        <div className="flex gap-4 justify-center mb-8 flex-wrap">
          {features.map((f, i) => (
            <motion.button
              key={f.title}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition ${
                active === i
                  ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                  : "border-white/10 text-gray-400 hover:text-white"
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {f.icon} {f.title}
            </motion.button>
          ))}
        </div>

        {/* Demo panel */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <span className="text-4xl">{features[active].icon}</span>
            <div>
              <h2 className="text-xl font-bold" style={{ color: features[active].color }}>
                {features[active].title}
              </h2>
              <p className="text-gray-400 text-sm mt-1">{features[active].desc}</p>
            </div>
          </div>

          {/* Mock terminal output */}
          <div className="rounded-xl bg-black/40 border border-white/10 p-4 font-mono text-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="text-gray-500 text-xs ml-2">careerforge ~ ai-analysis</span>
            </div>
            <motion.p
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ color: features[active].color }}
            >
              ✦ {features[active].demo}
            </motion.p>
          </div>

          <div className="mt-6 flex gap-3">
            <Link href="/signup">
              <motion.button
                className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-medium text-black"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Get Full Access →
              </motion.button>
            </Link>
            <Link href="/practice">
              <motion.button
                className="rounded-xl border border-white/20 px-6 py-2.5 text-sm text-gray-300"
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.97 }}
              >
                Try Practice →
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}