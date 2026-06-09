"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCursor } from "@/context/CursorContext";

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    color: "#64748b",
    desc: "Get started with the basics",
    features: [
      "3 resume analyses per month",
      "5 mock interview sessions",
      "10 coding problems",
      "Basic career roadmap",
      "Community support",
    ],
    missing: [
      "AI job matching",
      "Unlimited interviews",
      "Priority support",
    ],
    cta: "Get Started Free",
    href: "/signup",
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: 12,
    annualPrice: 8,
    color: "#22d3ee",
    desc: "For serious job seekers",
    features: [
      "Unlimited resume analyses",
      "Unlimited mock interviews",
      "All 10 coding problems",
      "Full career roadmap",
      "AI job matching",
      "Detailed analytics",
      "Priority support",
    ],
    missing: [],
    cta: "Start Pro",
    href: "/signup",
    popular: true,
  },
  {
    name: "Team",
    monthlyPrice: 29,
    annualPrice: 20,
    color: "#8b5cf6",
    desc: "For bootcamps and institutions",
    features: [
      "Everything in Pro",
      "Up to 20 members",
      "Team analytics dashboard",
      "Custom career paths",
      "Bulk resume review",
      "Dedicated support",
      "API access",
    ],
    missing: [],
    cta: "Contact Us",
    href: "/signup",
    popular: false,
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const router = useRouter();
  const { setCursor, resetCursor } = useCursor();

  return (
    <section id="pricing" className="relative px-8 md:px-16 py-24">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(139,92,246,0.2), transparent)",
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
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1.5 text-xs text-purple-400 mb-4">
            💎 Simple pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Invest in your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              career
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
            Start free, upgrade when you need more power.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                !annual
                  ? "bg-cyan-500 text-black font-medium"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-full px-4 py-1.5 text-sm transition flex items-center gap-2 ${
                annual
                  ? "bg-cyan-500 text-black font-medium"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Annual
              <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/20 rounded-full px-1.5 py-0.5">
                -33%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.popular
                  ? "border-2 border-cyan-500/40 bg-cyan-500/5"
                  : "border border-white/8 bg-white/3"
              }`}
              whileHover={{ y: -4 }}
              onMouseEnter={() => setCursor({ mode: "magnetic" })}
              onMouseLeave={resetCursor}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-cyan-500 text-black text-[10px] font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <h3
                  className="font-bold text-lg mb-1"
                  style={{ color: plan.color }}
                >
                  {plan.name}
                </h3>
                <p className="text-slate-400 text-xs mb-4">{plan.desc}</p>

                <div className="flex items-end gap-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={annual ? "annual" : "monthly"}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-4xl font-bold text-white"
                    >
                      $
                      {annual ? plan.annualPrice : plan.monthlyPrice}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-slate-500 text-sm pb-1">
                    {plan.monthlyPrice === 0 ? "forever" : "/mo"}
                  </span>
                </div>
                {annual && plan.monthlyPrice > 0 && (
                  <p className="text-[11px] text-green-400 mt-1">
                    Save ${(plan.monthlyPrice - plan.annualPrice) * 12}/year
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-slate-300"
                  >
                    <span
                      className="mt-0.5 text-xs flex-shrink-0"
                      style={{ color: plan.color }}
                    >
                      ✦
                    </span>
                    {f}
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-slate-600 line-through"
                  >
                    <span className="mt-0.5 text-xs flex-shrink-0 text-slate-700">
                      ✦
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <motion.button
                onClick={() => router.push(plan.href)}
                className={`w-full rounded-xl py-3 text-sm font-semibold transition ${
                  plan.popular
                    ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/25"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {plan.cta} →
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Guarantee */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-500 text-xs mt-8"
        >
          🔒 No credit card required for Free plan · Cancel anytime · 14-day money-back guarantee
        </motion.p>
      </div>
    </section>
  );
}