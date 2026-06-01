"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface HRQuestion {
  id: number;
  question: string;
  category: string;
  tip: string;
  modelAnswer: string;
}

const HR_QUESTIONS: HRQuestion[] = [
  {
    id: 1,
    question: "Tell me about yourself.",
    category: "Introduction",
    tip: "Use the Present-Past-Future formula. Keep it under 2 minutes.",
    modelAnswer:
      "I'm a software engineer with 3 years of experience building scalable web applications. In my current role at XYZ, I've led development of features serving 100K+ users. Before that, I completed my CS degree where I specialized in algorithms. I'm now looking for opportunities to work on larger-scale distributed systems, which is why I'm excited about this role.",
  },
  {
    id: 2,
    question: "What are your greatest strengths?",
    category: "Self Assessment",
    tip: "Pick 2-3 strengths relevant to the job. Back each with a specific example.",
    modelAnswer:
      "My greatest strength is problem-solving under pressure. When our production database went down last quarter, I diagnosed and resolved the issue in 45 minutes, preventing significant revenue loss. I'm also strong at communicating technical concepts to non-technical stakeholders, which has helped me bridge gaps between engineering and product teams.",
  },
  {
    id: 3,
    question: "What is your greatest weakness?",
    category: "Self Assessment",
    tip: "Pick a real weakness you're actively improving. Never say 'I work too hard'.",
    modelAnswer:
      "I used to struggle with delegating tasks because I wanted to ensure quality. I've been actively working on this by clearly defining expectations upfront and trusting my teammates. I've seen my team's productivity increase 30% since I started practicing this, and it's freed me to focus on higher-impact work.",
  },
  {
    id: 4,
    question: "Where do you see yourself in 5 years?",
    category: "Career Goals",
    tip: "Align your goals with the company's growth. Show ambition but stay realistic.",
    modelAnswer:
      "In 5 years, I see myself as a senior engineer or tech lead, owning significant product areas and mentoring junior developers. I want to deepen my expertise in distributed systems and contribute to architectural decisions. I'm drawn to this company because your engineering blog shows the kind of technical challenges I want to be solving.",
  },
  {
    id: 5,
    question: "Why do you want to work here?",
    category: "Motivation",
    tip: "Research the company. Mention specific products, culture, or missions that resonate.",
    modelAnswer:
      "I've been following your company's growth for two years. Your approach to solving real-time data processing challenges is exactly the kind of technical problem I want to work on. I also admire your engineering culture — your commitment to code reviews and documentation shows you value quality over speed. That aligns with how I like to work.",
  },
  {
    id: 6,
    question: "Why are you leaving your current job?",
    category: "Career Goals",
    tip: "Always stay positive. Focus on what you're moving toward, not away from.",
    modelAnswer:
      "I've genuinely enjoyed my time at my current company and learned a tremendous amount. I'm looking for a role that offers more opportunities to work on greenfield projects and larger scale systems. This position aligns perfectly with where I want to grow technically.",
  },
  {
    id: 7,
    question: "Describe a conflict with a coworker and how you resolved it.",
    category: "Behavioral",
    tip: "Use the STAR format. Show emotional intelligence and focus on resolution.",
    modelAnswer:
      "A colleague and I disagreed on the architecture for a new microservice. I suggested a meeting where we each presented our approach with trade-offs. We realized we were optimizing for different constraints — they prioritized deployment speed, I prioritized maintainability. We combined both approaches and the final solution was better than either individual proposal.",
  },
  {
    id: 8,
    question: "How do you handle working under pressure or tight deadlines?",
    category: "Behavioral",
    tip: "Give a specific example. Show your process, not just that you can handle it.",
    modelAnswer:
      "When we had a critical client deadline moved up by two weeks, I immediately broke down all tasks, identified the critical path, and had honest conversations about scope. We cut two nice-to-have features, worked in focused sprints, and delivered on time. The client was satisfied and we used the experience to improve our estimation process.",
  },
  {
    id: 9,
    question: "What motivates you?",
    category: "Motivation",
    tip: "Be genuine. Connect your answer to the role's responsibilities.",
    modelAnswer:
      "I'm most motivated when I can see direct impact from my work. Solving a performance issue that reduces load times by 60%, seeing users adopt a feature I built — that tangible feedback loop keeps me engaged. I also get energized by complex technical challenges that require creative thinking.",
  },
  {
    id: 10,
    question: "Do you prefer working alone or in a team?",
    category: "Work Style",
    tip: "Show you can do both. Give examples of each.",
    modelAnswer:
      "I thrive in both environments depending on the task. For deep work like architecture design or debugging complex issues, I prefer focused solo time. For product discovery, problem-solving, and code reviews, collaboration produces better outcomes. I've found that the best results come from alternating between the two modes intentionally.",
  },
  {
    id: 11,
    question: "Tell me about a time you failed.",
    category: "Behavioral",
    tip: "Be honest. Focus on what you learned and how you grew from it.",
    modelAnswer:
      "Early in my career, I underestimated the complexity of a feature and promised a delivery date I couldn't meet. When I realized I would miss it, I immediately communicated to my manager, explained the situation, and proposed a revised timeline. We delivered 4 days late but with full quality. I learned to always add buffer time and communicate risks early.",
  },
  {
    id: 12,
    question: "How do you prioritize when you have multiple tasks?",
    category: "Work Style",
    tip: "Show a systematic approach. Mention stakeholder communication.",
    modelAnswer:
      "I use a combination of impact and urgency to prioritize. First I identify what's blocking other people or has hard deadlines, then I tackle high-impact items. I use a simple task list updated each morning and communicate proactively if priorities shift. When everything seems urgent, I ask my manager to help me align on what matters most to the team.",
  },
];

const CATEGORIES = [
  "All",
  ...Array.from(new Set(HR_QUESTIONS.map((q) => q.category))),
];

import { generateAIResponse } from "@/services/ai";

async function getAIFeedback(
  question: string,
  userAnswer: string
): Promise<string> {
  try {
    const prompt = `
You are an expert HR interview coach.

Question: "${question}"

Candidate's answer: "${userAnswer}"

Give specific, actionable feedback in 3-4 sentences.
Rate it as Strong / Good / Needs Work and explain why.
Be encouraging but honest.
`;

    return await generateAIResponse(prompt);
  } catch (error) {
    console.error("AI Feedback Error:", error);

    return "Good attempt! Focus on using specific examples with measurable outcomes.";
  }
}

export default function HRPage() {
  const [selected, setSelected] = useState<HRQuestion>(HR_QUESTIONS[0]);
  const [category, setCategory] = useState("All");
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [practiced, setPracticed] = useState<Set<number>>(new Set());

  const filtered =
    category === "All"
      ? HR_QUESTIONS
      : HR_QUESTIONS.filter((q) => q.category === category);

  function selectQuestion(q: HRQuestion) {
    setSelected(q);
    setUserAnswer("");
    setFeedback("");
    setShowModel(false);
  }

  async function submitAnswer() {
    if (!userAnswer.trim()) return;
    setFeedbackLoading(true);
    const fb = await getAIFeedback(selected.question, userAnswer);
    setFeedback(fb);
    setPracticed((prev) => new Set([...prev, selected.id]));
    setFeedbackLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="flex h-screen overflow-hidden">

        {/* ── Question list sidebar ──────────────────────────────────────── */}
        <div className="w-72 border-r border-white/5 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-white/5">
            <Link
              href="/practice"
              className="text-cyan-400 text-xs hover:underline mb-3 inline-block"
            >
              ← Practice Center
            </Link>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-white text-sm">HR Questions</h2>
              <span className="text-[10px] text-slate-400">
                {practiced.size}/{HR_QUESTIONS.length} done
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-white/5 rounded-full mb-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                animate={{
                  width: `${(practiced.size / HR_QUESTIONS.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Category filters */}
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map((c) => (
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
          </div>

          {/* Question list */}
          <div className="flex-1 overflow-y-auto p-2">
            {filtered.map((q) => (
              <motion.button
                key={q.id}
                onClick={() => selectQuestion(q)}
                className={`w-full text-left rounded-xl p-3 mb-1.5 border transition ${
                  selected.id === q.id
                    ? "border-cyan-500/30 bg-cyan-500/8"
                    : "border-transparent hover:bg-white/3"
                }`}
                whileHover={{ x: 3 }}
              >
                <div className="flex items-start gap-2 mb-1">
                  {practiced.has(q.id) && (
                    <span className="text-green-400 text-xs flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                  )}
                  <span className="text-xs text-white leading-snug line-clamp-2">
                    {q.question}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">{q.category}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Main content ───────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden p-6 gap-5">

          {/* Question header */}
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] border border-white/10 rounded-full px-2 py-0.5 text-slate-400">
                {selected.category}
              </span>
              {practiced.has(selected.id) && (
                <span className="text-[10px] border border-green-500/20 rounded-full px-2 py-0.5 text-green-400 bg-green-500/8">
                  ✓ Practiced
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white mb-3">
              {selected.question}
            </h2>
            <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 px-4 py-2.5">
              <p className="text-[10px] text-amber-400 uppercase tracking-widest mb-1">
                💡 Tip
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selected.tip}
              </p>
            </div>
          </motion.div>

          {/* Answer area */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto min-h-0">

            {/* Textarea */}
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 block">
                Your Answer
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here... Try to use the STAR format: Situation, Task, Action, Result"
                rows={6}
                className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 resize-none leading-relaxed transition"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-slate-600">
                  {userAnswer.length} characters
                </span>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => setShowModel(!showModel)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {showModel ? "Hide" : "View"} Model Answer
                  </motion.button>
                  <motion.button
                    onClick={submitAnswer}
                    disabled={!userAnswer.trim() || feedbackLoading}
                    className="rounded-lg bg-cyan-500 px-4 py-1.5 text-xs font-semibold text-black disabled:opacity-40"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {feedbackLoading ? "Analyzing..." : "Get AI Feedback →"}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Model answer */}
            <AnimatePresence>
              {showModel && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl border border-purple-500/20 bg-purple-500/8 p-4 flex-shrink-0"
                >
                  <p className="text-[10px] text-purple-400 uppercase tracking-widest mb-2">
                    📝 Model Answer
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selected.modelAnswer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl border border-cyan-500/20 bg-cyan-500/8 p-4 flex-shrink-0"
                >
                  <p className="text-[10px] text-cyan-400 uppercase tracking-widest mb-2">
                    🤖 AI Feedback
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {feedback}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <motion.button
                      onClick={() => {
                        const next = HR_QUESTIONS.find(
                          (q) => q.id === selected.id + 1
                        );
                        if (next) selectQuestion(next);
                      }}
                      className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-3 py-1.5 text-xs text-cyan-400"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Next Question →
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setUserAnswer("");
                        setFeedback("");
                      }}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Try Again
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}