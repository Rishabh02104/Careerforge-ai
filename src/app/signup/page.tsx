"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { findUserByEmail, saveUser, createSession } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { user, loading, refreshSession } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [user, loading, router]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 800)); // simulate API

    if (findUserByEmail(form.email)) {
      setErrors({ email: "Account already exists" });
      setIsSubmitting(false);
      return;
    }

    const user = {
      id: crypto.randomUUID(),
      name: form.name,
      email: form.email,
      password: form.password,
      createdAt: new Date().toISOString(),
      role: "user" as const,
    };

    saveUser(user);
    createSession(user);
    refreshSession();
    setSuccess(true);

    setTimeout(() => router.push("/dashboard"), 1200);
  }

  return (
    <main className="min-h-screen bg-[#050816] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background orb */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 6, repeat: Infinity }}
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <AnimatePresence>
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-cyan-500/20 bg-[#050816]/90 backdrop-blur-xl p-10 text-center"
            >
              <motion.div
                className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-3xl mx-auto mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ✓
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-2">Welcome aboard!</h2>
              <p className="text-slate-400 text-sm">Redirecting to your dashboard...</p>
            </motion.div>
          ) : (
            <motion.div
              className="rounded-2xl border border-white/10 bg-[#050816]/90 backdrop-blur-xl p-8"
            >
              {/* Header */}
              <div className="mb-8 text-center">
                <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 font-bold text-xl mb-6">
                  ⚡ CareerForge
                </Link>
                <h1 className="text-2xl font-bold text-white">Create your account</h1>
                <p className="text-slate-400 text-sm mt-1">Start building your dream career today</p>
              </div>

              {/* Form */}
              <div className="flex flex-col gap-4">
                {[
                  { key: "name",     label: "Full Name", type: "text",     placeholder: "John Doe" },
                  { key: "email",    label: "Email",     type: "email",    placeholder: "john@example.com" },
                  { key: "password", label: "Password",  type: "password", placeholder: "Min 6 characters" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-[10px] text-slate-400 mb-1.5 block tracking-widest uppercase">
                      {field.label}
                    </label>
                    <motion.input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={e => {
                        setForm({ ...form, [field.key]: e.target.value });
                        setErrors({ ...errors, [field.key]: "" });
                      }}
                      onKeyDown={e => e.key === "Enter" && handleSubmit()}
                      className={`w-full rounded-xl border px-4 py-3 text-white text-sm bg-white/5 placeholder-slate-600 focus:outline-none transition ${
                        errors[field.key]
                          ? "border-red-500/50 focus:border-red-500"
                          : "border-white/10 focus:border-cyan-500/50"
                      }`}
                      whileFocus={{ borderColor: "rgba(34,211,238,0.5)" }}
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
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-xl bg-cyan-500 py-3 font-semibold text-black text-sm relative overflow-hidden"
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(34,211,238,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isSubmitting ? (
                    <motion.span
                      className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    "Create Account →"
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

                {/* Social buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Google",  icon: "🌐" },
                    { label: "GitHub",  icon: "🐙" },
                  ].map(p => (
                    <motion.button
                      key={p.label}
                      className="rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-slate-300 flex items-center justify-center gap-2"
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.08)", scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {p.icon} {p.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <p className="mt-6 text-center text-xs text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="text-cyan-400 hover:underline">
                  Sign in
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}