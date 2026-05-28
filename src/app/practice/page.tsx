"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const practices = [
  {
    icon: "💬",
    title: "AI Mock Interview",
    desc: "Practice real interview questions with AI feedback on your answers",
    tag: "AI Powered",
    color: "cyan",
    items: ["Behavioral questions", "Technical deep-dives", "Answer scoring", "Tips & improvements"],
    // Added a path flag to identify the route for this specific card dynamically
    path: "/interview", 
  },
  {
    icon: "💻",
    title: "Coding Rounds",
    desc: "Solve DSA problems with real-time hints and solution walkthroughs",
    tag: "Live Editor",
    color: "purple",
    items: ["Arrays & strings", "Trees & graphs", "Dynamic programming", "System design"],
  },
  {
    icon: "🧠",
    title: "HR Questions",
    desc: "Master 50+ most common HR questions with model answers",
    tag: "50+ Questions",
    color: "blue",
    items: ["Tell me about yourself", "Strengths & weaknesses", "Salary negotiation", "Culture fit"],
  },
];

export default function PracticePage() {
  // 1. Placed right here inside the top level of your component
  const router = useRouter();

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

        <div className="mb-12">
          <div className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-400 mb-4">
            🎯 Practice Center
          </div>
          <h1 className="text-4xl font-bold md:text-6xl">
            Ace Your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Next Interview
            </span>
          </h1>
          <p className="mt-4 text-gray-400 text-lg max-w-2xl">
            Everything you need to prepare — mock interviews, coding challenges, and HR practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {practices.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-6 flex flex-col"
              whileHover={{
                borderColor: p.color === "cyan"
                  ? "rgba(34,211,238,0.4)"
                  : p.color === "purple"
                  ? "rgba(139,92,246,0.4)"
                  : "rgba(59,130,246,0.4)",
                y: -4,
              }}
            >
              <div className="text-3xl mb-4">{p.icon}</div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-lg">{p.title}</h2>
                <span className={`text-[10px] px-2 py-1 rounded-full border font-medium ${
                  p.color === "cyan"
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                    : p.color === "purple"
                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                }`}>
                  {p.tag}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">{p.desc}</p>
              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {p.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-cyan-400 text-xs">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
              
              {/* 2. Added the onClick logic safely using the path mapping */}
              <motion.button
                onClick={() => p.path && router.push(p.path)}
                className={`w-full rounded-xl py-2.5 text-sm font-medium ${
                  p.color === "cyan"
                    ? "bg-cyan-500 text-black"
                    : p.color === "purple"
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Start {p.title} →
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}