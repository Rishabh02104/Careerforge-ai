"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const EASE = [0.22, 1, 0.36, 1] as const;

function stagger(i: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: i * 0.08, ease: EASE },
  };
}

const quickActions = [
  {
    icon: "📄",
    label: "Analyze Resume",
    desc: "Upload and get AI feedback",
    href: "/resume",
    color: "#22d3ee",
  },
  {
    icon: "💬",
    label: "Mock Interview",
    desc: "Practice with AI interviewer",
    href: "/interview",
    color: "#8b5cf6",
  },
  {
    icon: "💻",
    label: "Coding Practice",
    desc: "Solve DSA problems",
    href: "/coding",
    color: "#06b6d4",
  },
  {
    icon: "🧠",
    label: "HR Questions",
    desc: "Practice HR answers",
    href: "/hr",
    color: "#a78bfa",
  },
  {
    icon: "🗺️",
    label: "Career Roadmap",
    desc: "See your learning path",
    href: "/roadmap",
    color: "#34d399",
  },
  {
    icon: "🎯",
    label: "Job Match",
    desc: "Find matching roles",
    href: "/jobs",
    color: "#f59e0b",
  },
];

const activities = [
  { icon: "💬", text: "Completed Mock Interview", time: "2h ago",  color: "#22d3ee" },
  { icon: "📄", text: "Resume analyzed — score 78",time: "5h ago",  color: "#8b5cf6" },
  { icon: "💻", text: "Solved 3 coding problems",  time: "1d ago",  color: "#06b6d4" },
  { icon: "🎯", text: "Applied to Google SWE role",time: "2d ago",  color: "#a78bfa" },
  { icon: "🗺️", text: "Completed React milestone", time: "3d ago",  color: "#34d399" },
];

const sideNavItems = [
  { icon: "📊", label: "Dashboard",  href: "/dashboard",  active: true  },
  { icon: "📄", label: "Resume",     href: "/resume",     active: false },
  { icon: "💬", label: "Interview",  href: "/interview",  active: false },
  { icon: "💻", label: "Coding",     href: "/coding",     active: false },
  { icon: "🧠", label: "HR Prep",    href: "/hr",         active: false },
  { icon: "🗺️", label: "Roadmap",   href: "/roadmap",    active: false },
  { icon: "🎯", label: "Jobs",       href: "/jobs",       active: false },
  { icon: "🎮", label: "Practice",   href: "/practice",   active: false },
];

function StatCard({
  label,
  value,
  unit,
  color,
  index,
  trend,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
  index: number;
  trend?: string;
}) {
  return (
    <motion.div
      {...stagger(index)}
      className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-5 relative overflow-hidden group"
      whileHover={{ y: -4, borderColor: color + "44" }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${color}08 0%, transparent 70%)`,
        }}
      />
      <p className="text-[10px] text-slate-400 mb-2 uppercase tracking-widest">
        {label}
      </p>
      <div className="flex items-end gap-1.5">
        <p className="text-3xl font-bold" style={{ color }}>
          {value}
        </p>
        <span className="text-slate-500 text-sm pb-0.5">{unit}</span>
      </div>
      {trend && (
        <p className="text-[10px] text-green-400 mt-1.5">{trend}</p>
      )}
    </motion.div>
  );
}

function ResumeScoreCard() {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const score = 78;
  const offset = circ - (score / 100) * circ;

  return (
    <motion.div
      {...stagger(4)}
      className="rounded-2xl border border-cyan-500/15 bg-white/3 backdrop-blur-xl p-5"
      whileHover={{ y: -3, borderColor: "rgba(34,211,238,0.3)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Resume Score</h3>
        <motion.span
          className="text-[10px] flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="w-1 h-1 rounded-full bg-cyan-400 inline-block" />
          Live
        </motion.span>
      </div>

      <div className="flex items-center gap-5">
        {/* Ring */}
        <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
          <svg className="absolute" width="80" height="80" viewBox="0 0 80 80">
            <circle
              cx="40" cy="40" r={r}
              fill="none"
              stroke="rgba(34,211,238,0.08)"
              strokeWidth="5"
            />
            <motion.circle
              cx="40" cy="40" r={r}
              fill="none"
              stroke="url(#dashGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
            />
            <defs>
              <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <motion.span
            className="text-xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {score}
          </motion.span>
        </div>

        {/* Breakdown */}
        <div className="flex-1 flex flex-col gap-1.5">
          {[
            { label: "ATS",        value: 82, color: "#22d3ee" },
            { label: "Keywords",   value: 67, color: "#8b5cf6" },
            { label: "Format",     value: 91, color: "#06b6d4" },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex justify-between mb-0.5">
                <span className="text-[10px] text-slate-500">{s.label}</span>
                <span className="text-[10px]" style={{ color: s.color }}>
                  {s.value}%
                </span>
              </div>
              <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: s.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${s.value}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link href="/resume">
        <motion.button
          className="mt-4 w-full rounded-xl border border-cyan-500/20 bg-cyan-500/8 py-2 text-xs font-medium text-cyan-400"
          whileHover={{ backgroundColor: "rgba(34,211,238,0.15)", scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
        >
          Analyze New Resume →
        </motion.button>
      </Link>
    </motion.div>
  );
}

function RoadmapCard() {
  const paths = [
    { label: "React & TypeScript", progress: 65, color: "#22d3ee" },
    { label: "System Design",      progress: 20, color: "#8b5cf6" },
    { label: "DSA Fundamentals",   progress: 45, color: "#06b6d4" },
  ];

  return (
    <motion.div
      {...stagger(5)}
      className="rounded-2xl border border-purple-500/15 bg-white/3 backdrop-blur-xl p-5"
      whileHover={{ y: -3, borderColor: "rgba(139,92,246,0.3)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Career Roadmap</h3>
        <Link href="/roadmap">
          <span className="text-[10px] text-purple-400 hover:underline cursor-pointer">
            View full →
          </span>
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {paths.map((p, i) => (
          <div key={p.label}>
            <div className="flex justify-between mb-1">
              <span className="text-[11px] text-slate-300">{p.label}</span>
              <span className="text-[10px]" style={{ color: p.color }}>
                {p.progress}%
              </span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: p.color }}
                initial={{ width: 0 }}
                animate={{ width: `${p.progress}%` }}
                transition={{
                  duration: 1,
                  ease: "easeOut",
                  delay: 0.6 + i * 0.15,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <Link href="/roadmap">
        <motion.button
          className="mt-4 w-full rounded-xl border border-purple-500/20 bg-purple-500/8 py-2 text-xs font-medium text-purple-400"
          whileHover={{ backgroundColor: "rgba(139,92,246,0.15)", scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
        >
          Continue Learning →
        </motion.button>
      </Link>
    </motion.div>
  );
}

function JobMatchCard() {
  const topJobs = [
    { title: "Frontend Dev", company: "Linear",    match: 94, color: "#5e6ad2" },
    { title: "React Dev",    company: "Vercel",    match: 88, color: "#ffffff" },
    { title: "SWE II",       company: "Anthropic", match: 85, color: "#d97706" },
  ];

  return (
    <motion.div
      {...stagger(6)}
      className="rounded-2xl border border-green-500/15 bg-white/3 backdrop-blur-xl p-5"
      whileHover={{ y: -3, borderColor: "rgba(52,211,153,0.3)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Top Job Matches</h3>
        <Link href="/jobs">
          <span className="text-[10px] text-green-400 hover:underline cursor-pointer">
            View all →
          </span>
        </Link>
      </div>

      <div className="flex flex-col gap-2.5">
        {topJobs.map((job, i) => (
          <motion.div
            key={job.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs border flex-shrink-0"
                style={{
                  background:
                    (job.color === "#ffffff" ? "#a0aec0" : job.color) + "15",
                  borderColor:
                    (job.color === "#ffffff" ? "#a0aec0" : job.color) + "30",
                }}
              >
                💼
              </div>
              <div>
                <p className="text-xs font-medium text-white">{job.title}</p>
                <p className="text-[10px] text-slate-500">{job.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-green-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${job.match}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.7 + i * 0.1 }}
                />
              </div>
              <span className="text-[10px] text-green-400 font-medium w-8 text-right">
                {job.match}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <Link href="/jobs">
        <motion.button
          className="mt-4 w-full rounded-xl border border-green-500/20 bg-green-500/8 py-2 text-xs font-medium text-green-400"
          whileHover={{ backgroundColor: "rgba(52,211,153,0.15)", scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
        >
          View All Matches →
        </motion.button>
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("/dashboard");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-[#050816] flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      </main>
    );
  }

  const stats = [
    { label: "Resume Score",    value: "78", unit: "/100", color: "#22d3ee", trend: "+5 this week",   index: 0 },
    { label: "Interviews Done", value: "12", unit: "",     color: "#8b5cf6", trend: "+2 this week",   index: 1 },
    { label: "Skills Matched",  value: "84", unit: "%",    color: "#06b6d4", trend: "+8% from resume", index: 2 },
    { label: "Jobs Applied",    value: "23", unit: "",     color: "#a78bfa", trend: "3 in review",     index: 3 },
  ];

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="flex min-h-screen">

        {/* ── Sidebar ────────────────────────────────────────────────────── */}
        <motion.aside
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="w-56 border-r border-white/5 bg-white/2 backdrop-blur-xl flex flex-col p-5 gap-1 flex-shrink-0"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-cyan-400 font-bold mb-6"
          >
            ⚡ CareerForge
          </Link>

          {/* Nav items */}
          {sideNavItems.map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                setActiveNav(item.href);
                router.push(item.href);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                activeNav === item.href
                  ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
              whileHover={{ x: 3 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </motion.a>
          ))}

          {/* User section */}
          <div className="mt-auto pt-4 border-t border-white/5">
            <div className="flex items-center gap-2.5 mb-3 px-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400 flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-white truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-500 truncate">
                  {user.email}
                </span>
              </div>
            </div>

            <motion.button
              onClick={logout}
              className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition"
              whileHover={{ x: 3 }}
            >
              🚪 Sign out
            </motion.button>
          </div>
        </motion.aside>

        {/* ── Main content ──────────────────────────────────────────────── */}
        <div className="flex-1 p-8 overflow-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-start justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {user.name.split(" ")[0]}
                </span>{" "}
                👋
              </h1>
              <p className="text-slate-400 mt-1 text-sm">
                Here&apos;s your career progress overview.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Link href="/resume">
                <motion.button
                  className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-semibold text-black"
                  whileHover={{ scale: 1.04, boxShadow: "0 4px 20px rgba(34,211,238,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  + Analyze Resume
                </motion.button>
              </Link>
              <Link href="/interview">
                <motion.button
                  className="rounded-xl border border-purple-500/20 bg-purple-500/8 px-4 py-2 text-xs font-semibold text-purple-400"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  + Start Interview
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          {/* Middle row — Resume score + Roadmap + Job Match */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <ResumeScoreCard />
            <RoadmapCard />
            <JobMatchCard />
          </div>

          {/* Quick actions */}
          <motion.div
            {...stagger(7)}
            className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-5 mb-6"
          >
            <h3 className="text-sm font-semibold text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickActions.map((a, i) => (
                <motion.a
                  key={a.label}
                  href={a.href}
                  onClick={(e) => { e.preventDefault(); router.push(a.href); }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className="flex flex-col items-center gap-2 rounded-xl border border-white/8 bg-white/3 p-3 text-center cursor-pointer"
                  whileHover={{
                    y: -3,
                    borderColor: a.color + "44",
                    backgroundColor: a.color + "08",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: a.color + "15", border: `1px solid ${a.color}25` }}
                  >
                    {a.icon}
                  </span>
                  <span className="text-[11px] font-medium text-white leading-tight">
                    {a.label}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Recent activity */}
          <motion.div
            {...stagger(8)}
            className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-5"
          >
            <h3 className="text-sm font-semibold text-white mb-4">
              Recent Activity
            </h3>
            <div className="flex flex-col">
              {activities.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 group"
                  whileHover={{ x: 3 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: a.color + "15" }}
                    >
                      {a.icon}
                    </div>
                    <span className="text-sm text-slate-300">{a.text}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 flex-shrink-0">
                    {a.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}