"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const stats = [
  { value: "Beta", label: "Current Stage",      color: "#22d3ee" },
  { value: "5",    label: "Career Paths",       color: "#8b5cf6" },
  { value: "10",   label: "Coding Problems",    color: "#06b6d4" },
  { value: "12",   label: "HR Prep Questions",  color: "#a78bfa" },
];

const values = [
  {
    icon: "🤖",
    title: "AI-First",
    desc: "Every feature is powered by state-of-the-art AI. Not gimmicks — real intelligence that actually helps you improve.",
  },
  {
    icon: "🎯",
    title: "Outcome Focused",
    desc: "We measure success by your success. Our goal is one thing: getting you the job offer you deserve.",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    desc: "Your resume and interview data is yours. We never sell your data or use it to train models without consent.",
  },
];

export default function AboutSection() {
  const router = useRouter();

  return (
    <section id="about" className="relative px-8 md:px-16 py-24 pb-32">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(34,211,238,0.15), transparent)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-1.5 text-xs text-cyan-400 mb-4">
            🚀 Our mission
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built for the{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              next generation
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            CareerForge was built because the job market is broken. Too many
            talented people miss out on great roles because they don't know how
            to present themselves. We're fixing that with AI.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-white/8 bg-white/3 p-5 text-center"
              whileHover={{ y: -3, borderColor: s.color + "44" }}
            >
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl border border-white/8 bg-white/3 p-6"
              whileHover={{ y: -4 }}
            >
              <div className="text-3xl mb-4">{v.icon}</div>
              <h3 className="font-bold text-white mb-2">{v.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 p-10 text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-3">
            Ready to forge your career?
          </h3>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Use CareerForge to advance your preparation and land your dream job.
            Start free — no credit card required.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button
              onClick={() => router.push("/signup")}
              className="rounded-xl bg-cyan-500 px-8 py-3 font-semibold text-black text-sm shadow-lg shadow-cyan-500/25"
              whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(34,211,238,0.4)" }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started Free →
            </motion.button>
            <motion.button
              onClick={() => router.push("/demo")}
              className="rounded-xl border border-white/15 bg-white/5 px-8 py-3 text-sm text-white"
              whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.97 }}
            >
              Interactive Sandbox
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}