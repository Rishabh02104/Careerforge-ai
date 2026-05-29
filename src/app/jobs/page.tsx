"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  salary: string;
  matchScore: number;
  postedDays: number;
  logo: string;
  color: string;
  description: string;
  requiredSkills: string[];
  yourSkills: string[];
  missingSkills: string[];
  experience: string;
  category: string;
  applyUrl: string;
}

const JOBS: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "Stripe",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$140K - $180K",
    matchScore: 92,
    postedDays: 2,
    logo: "💳",
    color: "#635bff",
    description: "Join Stripe's frontend team to build the financial infrastructure of the internet. You'll work on highly scalable React applications used by millions of businesses worldwide.",
    requiredSkills: ["React", "TypeScript", "GraphQL", "Node.js", "CSS-in-JS"],
    yourSkills: ["React", "TypeScript", "Node.js"],
    missingSkills: ["GraphQL", "CSS-in-JS"],
    experience: "4+ years",
    category: "Frontend",
    applyUrl: "https://stripe.com/jobs",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "Vercel",
    location: "Remote",
    type: "Remote",
    salary: "$130K - $170K",
    matchScore: 88,
    postedDays: 1,
    logo: "▲",
    color: "#ffffff",
    description: "Build the tools that millions of developers use to deploy and scale their applications. Work on Next.js, edge computing, and developer experience at scale.",
    requiredSkills: ["Next.js", "TypeScript", "React", "Go", "Rust"],
    yourSkills: ["Next.js", "TypeScript", "React"],
    missingSkills: ["Go", "Rust"],
    experience: "3+ years",
    category: "Full Stack",
    applyUrl: "https://vercel.com/careers",
  },
  {
    id: "3",
    title: "Software Engineer II",
    company: "Anthropic",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$160K - $220K",
    matchScore: 85,
    postedDays: 3,
    logo: "🤖",
    color: "#d97706",
    description: "Help build safe and beneficial AI systems. Work on Claude's capabilities, safety research tooling, and the infrastructure powering next-generation AI.",
    requiredSkills: ["Python", "TypeScript", "React", "ML Basics", "Distributed Systems"],
    yourSkills: ["TypeScript", "React", "Python"],
    missingSkills: ["ML Basics", "Distributed Systems"],
    experience: "3+ years",
    category: "AI/ML",
    applyUrl: "https://anthropic.com/careers",
  },
  {
    id: "4",
    title: "React Developer",
    company: "Linear",
    location: "Remote",
    type: "Remote",
    salary: "$120K - $160K",
    matchScore: 94,
    postedDays: 5,
    logo: "📐",
    color: "#5e6ad2",
    description: "Join Linear to build the next generation of project management tools. Work on a fast, keyboard-first product that engineering teams love.",
    requiredSkills: ["React", "TypeScript", "CSS", "Performance Optimization"],
    yourSkills: ["React", "TypeScript", "CSS"],
    missingSkills: ["Performance Optimization"],
    experience: "2+ years",
    category: "Frontend",
    applyUrl: "https://linear.app/careers",
  },
  {
    id: "5",
    title: "Backend Engineer",
    company: "PlanetScale",
    location: "Remote",
    type: "Remote",
    salary: "$130K - $170K",
    matchScore: 76,
    postedDays: 7,
    logo: "🪐",
    color: "#f43f5e",
    description: "Build the database platform that powers the next generation of applications. Work on distributed database systems, developer tooling, and API design.",
    requiredSkills: ["Go", "MySQL", "Kubernetes", "Distributed Systems", "gRPC"],
    yourSkills: ["MySQL"],
    missingSkills: ["Go", "Kubernetes", "Distributed Systems", "gRPC"],
    experience: "4+ years",
    category: "Backend",
    applyUrl: "https://planetscale.com/careers",
  },
  {
    id: "6",
    title: "Product Engineer",
    company: "Raycast",
    location: "Remote",
    type: "Remote",
    salary: "$110K - $150K",
    matchScore: 81,
    postedDays: 4,
    logo: "⚡",
    color: "#ff6363",
    description: "Build Raycast extensions and the core product experience. Shape how developers interact with their tools through a fast, extensible launcher.",
    requiredSkills: ["React", "TypeScript", "Swift", "macOS APIs"],
    yourSkills: ["React", "TypeScript"],
    missingSkills: ["Swift", "macOS APIs"],
    experience: "2+ years",
    category: "Full Stack",
    applyUrl: "https://raycast.com/careers",
  },
  {
    id: "7",
    title: "Frontend Engineer",
    company: "Figma",
    location: "New York, NY",
    type: "Full-time",
    salary: "$145K - $190K",
    matchScore: 79,
    postedDays: 6,
    logo: "🎨",
    color: "#a259ff",
    description: "Build the design tool used by millions of designers and developers. Work on complex rendering, real-time collaboration, and plugin systems.",
    requiredSkills: ["TypeScript", "React", "WebGL", "Canvas API", "WebSockets"],
    yourSkills: ["TypeScript", "React"],
    missingSkills: ["WebGL", "Canvas API", "WebSockets"],
    experience: "3+ years",
    category: "Frontend",
    applyUrl: "https://figma.com/careers",
  },
  {
    id: "8",
    title: "Software Engineer",
    company: "Supabase",
    location: "Remote",
    type: "Remote",
    salary: "$120K - $160K",
    matchScore: 87,
    postedDays: 2,
    logo: "⚡",
    color: "#3ecf8e",
    description: "Build the open-source Firebase alternative. Work on PostgreSQL tooling, real-time subscriptions, edge functions, and developer experience.",
    requiredSkills: ["TypeScript", "React", "PostgreSQL", "Go", "Deno"],
    yourSkills: ["TypeScript", "React", "PostgreSQL"],
    missingSkills: ["Go", "Deno"],
    experience: "2+ years",
    category: "Full Stack",
    applyUrl: "https://supabase.com/careers",
  },
];

type FilterCategory = "All" | "Frontend" | "Backend" | "Full Stack" | "AI/ML";
type SortType = "match" | "recent" | "salary";

function MatchRing({
  score,
  color,
  size = 56,
}: {
  score: number;
  color: string;
  size?: number;
}) {
  const r = size / 2 - 5;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        className="absolute"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="4"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "center",
          }}
        />
      </svg>
      <span
        className="text-xs font-bold"
        style={{ color }}
      >
        {score}%
      </span>
    </div>
  );
}

function JobCard({
  job,
  isSelected,
  onClick,
}: {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
}) {
  const matchColor =
    job.matchScore >= 90
      ? "#22d3ee"
      : job.matchScore >= 75
      ? "#a78bfa"
      : "#f59e0b";

  return (
    <motion.button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${
        isSelected
          ? "bg-white/5"
          : "border-white/8 bg-white/2 hover:bg-white/4"
      }`}
      style={
        isSelected
          ? { borderColor: matchColor + "50", boxShadow: `0 0 20px ${matchColor}15` }
          : {}
      }
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-3">
        {/* Company logo */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border"
          style={{
            background: job.color + "15",
            borderColor: job.color + "30",
          }}
        >
          {job.logo}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <div>
              <h4 className="font-semibold text-sm text-white leading-tight">
                {job.title}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">{job.company}</p>
            </div>
            <MatchRing score={job.matchScore} color={matchColor} size={44} />
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[10px] text-slate-500">{job.location}</span>
            <span className="text-slate-700">·</span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full border"
              style={{
                color: job.color === "#ffffff" ? "#a0aec0" : job.color,
                borderColor:
                  (job.color === "#ffffff" ? "#a0aec0" : job.color) + "30",
                background:
                  (job.color === "#ffffff" ? "#a0aec0" : job.color) + "10",
              }}
            >
              {job.type}
            </span>
            <span className="text-slate-700">·</span>
            <span className="text-[10px] text-slate-500">
              {job.postedDays}d ago
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function JobDetail({ job }: { job: Job }) {
  const matchColor =
    job.matchScore >= 90
      ? "#22d3ee"
      : job.matchScore >= 75
      ? "#a78bfa"
      : "#f59e0b";

  const matchLabel =
    job.matchScore >= 90
      ? "Excellent Match"
      : job.matchScore >= 75
      ? "Good Match"
      : "Partial Match";

  return (
    <motion.div
      key={job.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border flex-shrink-0"
            style={{
              background: job.color + "15",
              borderColor: job.color + "30",
            }}
          >
            {job.logo}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{job.title}</h2>
            <p className="text-slate-400 text-sm mt-0.5">{job.company}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-xs text-slate-400">📍 {job.location}</span>
              <span className="text-xs text-slate-400">💰 {job.salary}</span>
              <span className="text-xs text-slate-400">⏱ {job.experience}</span>
            </div>
          </div>
          <MatchRing score={job.matchScore} color={matchColor} size={64} />
        </div>

        {/* Match label */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium mb-4"
          style={{
            color: matchColor,
            background: matchColor + "12",
            border: `1px solid ${matchColor}25`,
          }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: matchColor }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {matchLabel} — {job.matchScore}% profile match
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">
          {job.description}
        </p>
      </div>

      {/* Skills analysis */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <h3 className="font-semibold text-white text-sm mb-4">
          Skills Analysis
        </h3>

        <div className="flex flex-col gap-4">
          {/* Your matching skills */}
          <div>
            <p className="text-[10px] text-green-400 uppercase tracking-widest mb-2">
              ✓ Your matching skills ({job.yourSkills.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {job.yourSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-3 py-1.5 rounded-full border font-medium bg-green-500/10 text-green-400 border-green-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing skills */}
          {job.missingSkills.length > 0 && (
            <div>
              <p className="text-[10px] text-red-400 uppercase tracking-widest mb-2">
                ✗ Skills to develop ({job.missingSkills.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {job.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1.5 rounded-full border font-medium bg-red-500/10 text-red-400 border-red-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills progress bar */}
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-[10px] text-slate-400">Skills coverage</span>
              <span
                className="text-[10px] font-medium"
                style={{ color: matchColor }}
              >
                {job.yourSkills.length}/{job.requiredSkills.length} skills
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: matchColor }}
                initial={{ width: 0 }}
                animate={{
                  width: `${(job.yourSkills.length / job.requiredSkills.length) * 100}%`,
                }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <motion.a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-xl py-3 text-sm font-semibold text-black text-center"
          style={{ background: matchColor }}
          whileHover={{ scale: 1.02, boxShadow: `0 8px 30px ${matchColor}40` }}
          whileTap={{ scale: 0.97 }}
        >
          Apply Now →
        </motion.a>
        <Link href="/resume">
          <motion.button
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300"
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.97 }}
          >
            Improve Resume
          </motion.button>
        </Link>
        <Link href="/roadmap">
          <motion.button
            className="rounded-xl border border-purple-500/20 bg-purple-500/8 px-5 py-3 text-sm text-purple-400"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            View Roadmap
          </motion.button>
        </Link>
      </div>

      {/* Tips */}
      {job.missingSkills.length > 0 && (
        <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4">
          <p className="text-[10px] text-amber-400 uppercase tracking-widest mb-2">
            💡 How to improve your match
          </p>
          <ul className="flex flex-col gap-1.5">
            {job.missingSkills.slice(0, 3).map((skill) => (
              <li
                key={skill}
                className="text-xs text-slate-300 flex items-center gap-2"
              >
                <span className="text-amber-400">→</span>
                Learn <span className="text-amber-300 font-medium">{skill}</span> to boost your match by ~{Math.round(8 + Math.random() * 5)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

export default function JobsPage() {
  const { user } = useAuth();
  const [selectedJob, setSelectedJob] = useState<Job>(JOBS[0]);
  const [category, setCategory] = useState<FilterCategory>("All");
  const [sort, setSort] = useState<SortType>("match");
  const [search, setSearch] = useState("");

  const categories: FilterCategory[] = [
    "All", "Frontend", "Backend", "Full Stack", "AI/ML",
  ];

  const filtered = JOBS
    .filter((j) => category === "All" || j.category === category)
    .filter(
      (j) =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "match") return b.matchScore - a.matchScore;
      if (sort === "recent") return a.postedDays - b.postedDays;
      if (sort === "salary") {
        const aNum = parseInt(a.salary.replace(/\D/g, "").slice(0, 3));
        const bNum = parseInt(b.salary.replace(/\D/g, "").slice(0, 3));
        return bNum - aNum;
      }
      return 0;
    });

  // Stats
  const avgMatch = Math.round(
    JOBS.reduce((s, j) => s + j.matchScore, 0) / JOBS.length
  );
  const topMatches = JOBS.filter((j) => j.matchScore >= 85).length;

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="flex flex-col h-screen overflow-hidden">

        {/* ── Top bar ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-cyan-400 text-sm hover:underline">
              ← Home
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">Job Match</span>
              <span className="text-[10px] border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 rounded-full px-2 py-0.5">
                AI Powered
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                Avg Match
              </span>
              <span className="text-sm font-bold text-cyan-400">{avgMatch}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                Top Matches
              </span>
              <span className="text-sm font-bold text-purple-400">
                {topMatches} jobs
              </span>
            </div>
            <Link href="/resume">
              <motion.button
                className="rounded-xl border border-cyan-500/20 bg-cyan-500/8 px-4 py-1.5 text-xs text-cyan-400"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Upload Resume to Improve Matches →
              </motion.button>
            </Link>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* ── Job list ──────────────────────────────────────────────────── */}
          <div className="w-96 border-r border-white/5 flex flex-col flex-shrink-0">

            {/* Filters */}
            <div className="p-4 border-b border-white/5 flex flex-col gap-3">
              <input
                type="text"
                placeholder="Search jobs or companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
              />

              <div className="flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`rounded-full px-2.5 py-1 text-[10px] border transition ${
                        category === c
                          ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                          : "border-white/8 text-slate-400 hover:text-white"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortType)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-slate-400 focus:outline-none"
                >
                  <option value="match">Best Match</option>
                  <option value="recent">Most Recent</option>
                  <option value="salary">Highest Salary</option>
                </select>
              </div>

              <p className="text-[10px] text-slate-500">
                {filtered.length} jobs found
              </p>
            </div>

            {/* Job cards */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              <AnimatePresence>
                {filtered.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSelected={selectedJob.id === job.id}
                    onClick={() => setSelectedJob(job)}
                  />
                ))}
              </AnimatePresence>

              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-3xl mb-3">🔍</p>
                  <p className="text-slate-400 text-sm">No jobs found</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Try adjusting your filters
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Job detail ──────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <JobDetail key={selectedJob.id} job={selectedJob} />
            </AnimatePresence>
          </div>

        </div>
      </div>
    </main>
  );
}