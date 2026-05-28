"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";

const stats = [
  { label: "Resume Score", value: "78", unit: "/100", color: "#22d3ee" },
  { label: "Interviews Done", value: "12", unit: "", color: "#8b5cf6" },
  { label: "Skills Matched", value: "84", unit: "%", color: "#06b6d4" },
  { label: "Jobs Applied", value: "23", unit: "", color: "#a78bfa" },
];

const activities = [
  { icon: "💬", text: "Completed Mock Interview", time: "2h ago" },
  { icon: "📄", text: "Resume analyzed & scored", time: "5h ago" },
  { icon: "💻", text: "Solved 3 coding problems", time: "1d ago" },
  { icon: "🎯", text: "Applied to Google SWE role", time: "2d ago" },
];

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

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

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <motion.aside
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-60 border-r border-white/5 bg-white/2 backdrop-blur-xl flex flex-col p-6 gap-2"
        >
          <Link href="/" className="flex items-center gap-2 text-cyan-400 font-bold text-lg mb-8">
            ⚡ CareerForge
          </Link>

          {[
            { icon: "📊", label: "Dashboard",  active: true,  href: "/dashboard" },
            { icon: "📄", label: "Resume",     active: false, href: "/dashboard" },
            { icon: "💬", label: "Interviews", active: false, href: "/practice" },
            { icon: "💻", label: "Practice",   active: false, href: "/practice" },
            { icon: "🗺️", label: "Roadmap",   active: false, href: "/dashboard" },
            { icon: "⚙️", label: "Settings",  active: false, href: "/dashboard" },
          ].map(item => (
            <motion.a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition ${
                item.active
                  ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              whileHover={{ x: 4 }}
            >
              <span>{item.icon}</span>
              {item.label}
            </motion.a>
          ))}

          {/* User + logout at bottom */}
          <div className="mt-auto pt-4 border-t border-white/5">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-white truncate">{user.name}</span>
                <span className="text-[10px] text-slate-500 truncate">{user.email}</span>
              </div>
            </div>
            <motion.button
              onClick={logout}
              className="w-full text-left px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition"
              whileHover={{ x: 4 }}
            >
              🚪 Sign out
            </motion.button>
          </div>
        </motion.aside>

        {/* Main content */}
        <div className="flex-1 p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
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

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-5"
                  whileHover={{ y: -4, borderColor: s.color + "44" }}
                >
                  <p className="text-[10px] text-slate-400 mb-2 uppercase tracking-widest">
                    {s.label}
                  </p>
                  <p className="text-3xl font-bold" style={{ color: s.color }}>
                    {s.value}
                    <span className="text-lg text-slate-500">{s.unit}</span>
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { icon: "📄", label: "Analyze Resume", desc: "Upload and get AI feedback", href: "/", color: "#22d3ee" },
                { icon: "💬", label: "Start Interview", desc: "Practice with AI interviewer", href: "/practice", color: "#8b5cf6" },
                { icon: "💻", label: "Coding Practice", desc: "Solve DSA problems", href: "/practice", color: "#06b6d4" },
              ].map((a, i) => (
                <motion.a
                  key={a.label}
                  href={a.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-5 flex items-center gap-4 cursor-pointer"
                  whileHover={{ y: -3, borderColor: a.color + "44", backgroundColor: a.color + "08" }}
                >
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <p className="font-medium text-sm text-white">{a.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.desc}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Recent activity */}
            <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6">
              <h2 className="font-semibold text-base mb-4">Recent Activity</h2>
              <div className="flex flex-col">
                {activities.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{a.icon}</span>
                      <span className="text-sm text-slate-300">{a.text}</span>
                    </div>
                    <span className="text-xs text-slate-500">{a.time}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}