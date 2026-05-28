"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { findUserByEmail, createSession, devAdminBypass } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refreshSession } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const isDev = process.env.NODE_ENV === "development";

  function validate() {
    const e: Record<string, string> = {};
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (!form.password) e.password = "Password is required";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const user = findUserByEmail(form.email);

    if (!user) {
      setErrors({ email: "No account found with this email" });
      setLoading(false);
      return;
    }

    if (user.password !== form.password) {
      setErrors({ password: "Incorrect password" });
      setLoading(false);
      return;
    }

    createSession(user);
    refreshSession();

    // Admin → /admin, users → /dashboard
    if (user.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }

  function handleDevBypass() {
    devAdminBypass();
    refreshSession();
    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-[#050816] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background orb */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 6, repeat: Infinity }}
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-2xl border border-white/10 bg-[#050816]/90 backdrop-blur-xl p-8">

          {/* Header */}
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-cyan-400 font-bold text-xl mb-6"
            >
              ⚡ CareerForge
            </Link>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-slate-400 text-sm mt-1">
              Sign in to continue your journey
            </p>
          </div>

          {/* ✅ Dev bypass — ONLY shows locally, never on Vercel */}
          {isDev && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 rounded-xl border border-amber-500/20 bg-amber-500/8 p-3 flex items-center justify-between"
            >
              <div>
                <p className="text-[10px] text-amber-400 font-semibold tracking-widest uppercase">
                  Dev Mode
                </p>
                <p className="text-xs text-amber-300/70 mt-0.5">
                  Skip login — enter as admin instantly
                </p>
              </div>
              <motion.button
                onClick={handleDevBypass}
                className="rounded-lg bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-400"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Bypass →
              </motion.button>
            </motion.div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-4">
            {[
              {
                key: "email",
                label: "Email",
                type: "email",
                placeholder: "Enter your email",
              },
              {
                key: "password",
                label: "Password",
                type: "password",
                placeholder: "Enter your password",
              },
            ].map((field) => (
              <div key={field.key}>
                <div className="flex justify-between mb-1.5">
                  <label className="text-[10px] text-slate-400 tracking-widest uppercase">
                    {field.label}
                  </label>
                  {field.key === "password" && (
                    <Link
                      href="#"
                      className="text-[10px] text-cyan-400 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => {
                    setForm({ ...form, [field.key]: e.target.value });
                    setErrors({ ...errors, [field.key]: "" });
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className={`w-full rounded-xl border px-4 py-3 text-white text-sm bg-white/5 placeholder-slate-600 focus:outline-none transition ${
                    errors[field.key]
                      ? "border-red-500/50"
                      : "border-white/10 focus:border-cyan-500/50"
                  }`}
                />
                <AnimatePresence>
                  {errors[field.key] && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 text-xs mt-1"
                    >
                      {errors[field.key]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-cyan-500 py-3 font-semibold text-black text-sm"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 8px 30px rgba(34,211,238,0.35)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <motion.span
                  className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ) : (
                "Sign In →"
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/8" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#050816] px-3 text-xs text-slate-500">
                  or continue with
                </span>
              </div>
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Google", icon: "🌐" },
                { label: "GitHub", icon: "🐙" },
              ].map((p) => (
                <motion.button
                  key={p.label}
                  className="rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-slate-300 flex items-center justify-center gap-2"
                  whileHover={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {p.icon} {p.label}
                </motion.button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-cyan-400 hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}