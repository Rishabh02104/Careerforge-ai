"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useCursor } from "@/context/CursorContext";

const features = [
  {
    icon: "📄",
    title: "AI Resume Analyzer",
    desc: "Upload your resume and get instant ATS score, keyword gap analysis, and actionable improvement suggestions powered by Claude AI.",
    color: "#22d3ee",
    stats: "78% avg score improvement",
  },
  {
    icon: "💬",
    title: "AI Mock Interviews",
    desc: "Practice with an AI interviewer that asks real questions, scores your answers live, and gives detailed feedback on every response.",
    color: "#8b5cf6",
    stats: "94% interview success rate",
  },
  {
    icon: "💻",
    title: "Coding Practice",
    desc: "Solve DSA problems with a live code editor. Get AI hints when stuck and full solution walkthroughs with time complexity analysis.",
    color: "#06b6d4",
    stats: "200+ curated problems",
  },
  {
    icon: "🗺️",
    title: "Career Roadmap",
    desc: "Get a personalized skill-based learning path to your dream role. Know exactly what to learn next and track your progress.",
    color: "#a78bfa",
    stats: "50+ career paths",
  },
  {
    icon: "🎯",
    title: "Job Match",
    desc: "AI matches your profile to real job listings. See your match percentage, skills gap, and what to improve to land the role.",
    color: "#34d399",
    stats: "10K+ job listings",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    desc: "Track your resume score, interview performance, coding progress, and overall career readiness in one unified dashboard.",
    color: "#f59e0b",
    stats: "Real-time insights",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const { setCursor, resetCursor } = useCursor();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      className="relative rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6 flex flex-col gap-4 overflow-hidden group cursor-pointer"
      onMouseEnter={() => setCursor({ mode: "magnetic" })}
      onMouseLeave={resetCursor}
    >
      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${feature.color}15 0%, transparent 70%)`,
        }}
      />

      {/* Top border glow on hover */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${feature.color}80, transparent)` }}
      />

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ background: feature.color + "15", border: `1px solid ${feature.color}25` }}
      >
        {feature.icon}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-white text-base">{feature.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
      </div>

      {/* Stats */}
      <div
        className="text-[11px] font-medium px-3 py-1.5 rounded-full w-fit"
        style={{
          color: feature.color,
          background: feature.color + "12",
          border: `1px solid ${feature.color}25`,
        }}
      >
        ✦ {feature.stats}
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="relative px-8 md:px-16 py-24">
      {/* Section background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.2), transparent)" }}
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
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            Everything you need
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your complete{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              career toolkit
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Six powerful AI tools working together to take you from application
            to offer letter.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-slate-500 text-sm">
            Join{" "}
            <span className="text-white font-medium">50,000+</span>{" "}
            professionals already using CareerForge
          </p>
        </motion.div>
      </div>
    </section>
  );
}