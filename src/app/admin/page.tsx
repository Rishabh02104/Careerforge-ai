"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { getUsers, User } from "@/lib/auth";
import Link from "next/link";

export default function AdminPage() {
  const { user, loading, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && !isAdmin) router.push("/login");
    if (isAdmin) setUsers(getUsers());
  }, [loading, isAdmin, router]);

  if (loading || !isAdmin) {
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

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Users",    value: users.length,  color: "#22d3ee" },
    { label: "This Week",      value: users.filter(u => {
        const d = new Date(u.createdAt);
        const now = new Date();
        return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
      }).length, color: "#8b5cf6" },
    { label: "Active Today",   value: Math.floor(users.length * 0.3), color: "#06b6d4" },
    { label: "Avg Score",      value: "78",           color: "#a78bfa" },
  ];

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <motion.aside
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-60 border-r border-white/5 bg-white/2 backdrop-blur-xl flex flex-col p-6 gap-2 flex-shrink-0"
        >
          <Link href="/" className="flex items-center gap-2 text-cyan-400 font-bold text-lg mb-2">
            ⚡ CareerForge
          </Link>
          <div className="mb-6 rounded-lg border border-amber-500/20 bg-amber-500/8 px-3 py-1.5">
            <span className="text-[10px] text-amber-400 font-semibold tracking-widest uppercase">
              Admin Panel
            </span>
          </div>

          {[
            { icon: "📊", label: "Overview",   active: true  },
            { icon: "👥", label: "Users",      active: false },
            { icon: "📄", label: "Resumes",    active: false },
            { icon: "💬", label: "Interviews", active: false },
            { icon: "📈", label: "Analytics",  active: false },
            { icon: "⚙️", label: "Settings",  active: false },
          ].map(item => (
            <motion.div
              key={item.label}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm cursor-pointer transition ${
                item.active
                  ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              whileHover={{ x: 4 }}
            >
              <span>{item.icon}</span>
              {item.label}
            </motion.div>
          ))}

          <div className="mt-auto pt-4 border-t border-white/5">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-400">
                A
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-white">{user?.name}</span>
                <span className="text-[10px] text-amber-400">Administrator</span>
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

        {/* Main */}
        <div className="flex-1 p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">
                  Admin{" "}
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    Dashboard
                  </span>
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Manage users and monitor platform activity
                </p>
              </div>
              <motion.div
                className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-2"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                <span className="text-xs text-amber-400 font-medium">Live</span>
              </motion.div>
            </div>

            {/* Stats */}
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
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Users table */}
            <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-base">Registered Users</h2>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 w-52"
                />
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">👥</p>
                  <p className="text-slate-400 text-sm">
                    {search ? "No users match your search" : "No users signed up yet"}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    {!search && "Users will appear here after signing up"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5">
                        {["User", "Email", "Role", "Joined", "Actions"].map(h => (
                          <th key={h} className="text-left text-[10px] text-slate-400 uppercase tracking-widest pb-3 pr-4">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((u, i) => (
                        <motion.tr
                          key={u.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-white/5 last:border-0 hover:bg-white/3 transition"
                        >
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-white font-medium">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-slate-400">{u.email}</td>
                          <td className="py-3 pr-4">
                            <span className={`text-[10px] px-2 py-1 rounded-full border font-medium ${
                              u.role === "admin"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-slate-400 text-xs">
                            {new Date(u.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-3">
                            <motion.button
                              className="text-xs text-red-400/60 hover:text-red-400 transition"
                              whileHover={{ scale: 1.05 }}
                              onClick={() => {
                                const updated = getUsers().filter(x => x.id !== u.id);
                                localStorage.setItem("cf_users", JSON.stringify(updated));
                                setUsers(updated);
                              }}
                            >
                              Remove
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}