"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  getNextQuestion,
  getFinalReport,
  InterviewSession,
  InterviewMode,
  Message,
} from "@/services/interviewService";

type Stage = "setup" | "interview" | "report";

const MODES = [
  {
    id: "behavioral" as InterviewMode,
    icon: "💬",
    title: "Behavioral",
    desc: "Situational questions about past experiences",
    color: "#22d3ee",
  },
  {
    id: "technical" as InterviewMode,
    icon: "💻",
    title: "Technical",
    desc: "Problem-solving and technical knowledge",
    color: "#8b5cf6",
  },
  {
    id: "hr" as InterviewMode,
    icon: "🧠",
    title: "HR Round",
    desc: "Culture fit, goals, and personality",
    color: "#06b6d4",
  },
];

const JOB_TITLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer",
  "DevOps Engineer",
  "Machine Learning Engineer",
  "Business Analyst",
];

// ── Setup Screen ──────────────────────────────────────────────────────────────
function SetupScreen({
  onStart,
}: {
  onStart: (mode: InterviewMode, jobTitle: string) => void;
}) {
  const [selectedMode, setSelectedMode] = useState<InterviewMode>("behavioral");
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [custom, setCustom] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8 text-center">
        <div className="inline-block rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-1.5 text-xs text-cyan-400 mb-4">
          💬 AI Mock Interview
        </div>
        <h1 className="text-4xl font-bold text-white">
          Practice Your{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Interview
          </span>
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Choose your interview type and job title to begin
        </p>
      </div>

      {/* Mode selection */}
      <div className="mb-6">
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">
          Interview Type
        </p>
        <div className="grid grid-cols-3 gap-3">
          {MODES.map((m) => (
            <motion.button
              key={m.id}
              onClick={() => setSelectedMode(m.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                selectedMode === m.id
                  ? "border-cyan-500/40 bg-cyan-500/10"
                  : "border-white/8 bg-white/3 hover:border-white/15"
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="text-2xl mb-2">{m.icon}</div>
              <div className="font-semibold text-sm text-white">{m.title}</div>
              <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {m.desc}
              </div>
              {selectedMode === m.id && (
                <motion.div
                  layoutId="modeSelected"
                  className="mt-2 w-2 h-2 rounded-full bg-cyan-400"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Job title */}
      <div className="mb-8">
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">
          Job Title
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {JOB_TITLES.map((title) => (
            <motion.button
              key={title}
              onClick={() => { setJobTitle(title); setCustom(""); }}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                jobTitle === title && !custom
                  ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                  : "border-white/8 text-slate-400 hover:text-white hover:border-white/20"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {title}
            </motion.button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Or type a custom job title..."
          value={custom}
          onChange={(e) => { setCustom(e.target.value); setJobTitle(e.target.value); }}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      <motion.button
        onClick={() => onStart(selectedMode, jobTitle || "Software Engineer")}
        className="w-full rounded-xl bg-cyan-500 py-3.5 font-semibold text-black text-sm"
        whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(34,211,238,0.35)" }}
        whileTap={{ scale: 0.97 }}
      >
        Start Interview →
      </motion.button>
    </motion.div>
  );
}

// ── Message Bubble ────────────────────────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isInterviewer = message.role === "interviewer";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex gap-3 ${isInterviewer ? "" : "flex-row-reverse"}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border ${
          isInterviewer
            ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
            : "bg-purple-500/15 border-purple-500/30 text-purple-400"
        }`}
      >
        {isInterviewer ? "AI" : "You"}
      </div>

      <div className={`flex flex-col gap-1 max-w-[80%] ${isInterviewer ? "" : "items-end"}`}>
        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isInterviewer
              ? "bg-white/5 border border-white/8 text-slate-200 rounded-tl-sm"
              : "bg-cyan-500/10 border border-cyan-500/20 text-white rounded-tr-sm"
          }`}
        >
          {message.content}
        </div>

        {/* Score + feedback */}
        {message.score !== undefined && message.feedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-xs"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-slate-400">Score:</span>
              <span
                className="font-bold"
                style={{
                  color: message.score >= 8 ? "#22d3ee" :
                         message.score >= 6 ? "#a78bfa" : "#f87171",
                }}
              >
                {message.score}/10
              </span>
              <div className="flex gap-0.5 ml-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: i < message.score!
                        ? (message.score! >= 8 ? "#22d3ee" : message.score! >= 6 ? "#a78bfa" : "#f87171")
                        : "rgba(255,255,255,0.1)",
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed">{message.feedback}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ── Interview Screen ──────────────────────────────────────────────────────────
function InterviewScreen({
  session,
  onAnswer,
  onEnd,
  isLoading,
}: {
  session: InterviewSession;
  onAnswer: (answer: string) => void;
  onEnd: () => void;
  isLoading: boolean;
}) {
  const [answer, setAnswer] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.messages, isLoading]);

  const handleSubmit = () => {
    if (!answer.trim() || isLoading) return;
    onAnswer(answer.trim());
    setAnswer("");
  };

  const questionCount = session.messages.filter(
    (m) => m.role === "interviewer"
  ).length;

  const modeColor =
    session.mode === "behavioral" ? "#22d3ee" :
    session.mode === "technical"  ? "#8b5cf6" : "#06b6d4";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-120px)]"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest border"
            style={{
              color: modeColor,
              borderColor: modeColor + "33",
              background: modeColor + "11",
            }}
          >
            {session.mode} Interview
          </div>
          <span className="text-slate-400 text-xs">{session.jobTitle}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            Q{questionCount} of 5
          </span>
          {/* Progress bar */}
          <div className="w-24 h-1 bg-white/8 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: modeColor }}
              animate={{ width: `${(questionCount / 5) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <motion.button
            onClick={onEnd}
            className="rounded-xl border border-red-500/20 bg-red-500/8 px-3 py-1.5 text-xs text-red-400"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            End Interview
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2 mb-4">
        {session.messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400 flex-shrink-0">
              AI
            </div>
            <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0">
        <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-3">
          <textarea
            ref={textareaRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Type your answer... (Enter to submit, Shift+Enter for new line)"
            rows={3}
            disabled={isLoading}
            className="w-full bg-transparent text-sm text-white placeholder-slate-600 resize-none focus:outline-none"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-slate-600">
              {answer.length} characters
            </span>
            <div className="flex gap-2">
              <motion.button
                onClick={() => setAnswer("")}
                disabled={!answer || isLoading}
                className="rounded-lg border border-white/8 px-3 py-1.5 text-xs text-slate-400 disabled:opacity-30"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Clear
              </motion.button>
              <motion.button
                onClick={handleSubmit}
                disabled={!answer.trim() || isLoading}
                className="rounded-lg bg-cyan-500 px-4 py-1.5 text-xs font-semibold text-black disabled:opacity-40"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Submit →
              </motion.button>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-slate-600 text-center mt-2">
          Take your time. Think before you answer. Quality matters.
        </p>
      </div>
    </motion.div>
  );
}

// ── Report Screen ─────────────────────────────────────────────────────────────
function ReportScreen({
  session,
  report,
  onRestart,
}: {
  session: InterviewSession;
  report: {
    overallScore: number;
    grade: string;
    summary: string;
    strengths: string[];
    improvements: string[];
    recommendation: string;
  };
  onRestart: () => void;
}) {
  const gradeColor =
    report.grade.startsWith("A") ? "#22d3ee" :
    report.grade.startsWith("B") ? "#8b5cf6" :
    report.grade.startsWith("C") ? "#f59e0b" : "#f87171";

  const answerScores = session.messages
    .filter((m) => m.role === "interviewer" && m.score !== undefined)
    .map((m) => m.score!);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto flex flex-col gap-6"
    >
      {/* Grade card */}
      <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-6 flex items-center gap-6">
        <motion.div
          className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl font-bold flex-shrink-0"
          style={{
            background: gradeColor + "15",
            border: `2px solid ${gradeColor}33`,
            color: gradeColor,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        >
          {report.grade}
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold text-white">
              {report.overallScore}/100
            </span>
            <span className="text-xs text-slate-400">Overall Score</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{report.summary}</p>
        </div>
      </div>

      {/* Per-question scores */}
      {answerScores.length > 0 && (
        <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Answer Scores</h3>
          <div className="flex gap-3 flex-wrap">
            {answerScores.map((score, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border"
                  style={{
                    color: score >= 8 ? "#22d3ee" : score >= 6 ? "#a78bfa" : "#f87171",
                    borderColor: (score >= 8 ? "#22d3ee" : score >= 6 ? "#a78bfa" : "#f87171") + "33",
                    background: (score >= 8 ? "#22d3ee" : score >= 6 ? "#a78bfa" : "#f87171") + "11",
                  }}
                >
                  {score}
                </div>
                <span className="text-[9px] text-slate-500">Q{i + 1}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths + Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-green-500/15 bg-green-500/5 p-5">
          <h3 className="text-sm font-semibold text-green-400 mb-3">✅ Strengths</h3>
          <ul className="flex flex-col gap-2">
            {report.strengths.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <span className="text-green-400 text-xs mt-0.5">✦</span>
                {s}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5">
          <h3 className="text-sm font-semibold text-amber-400 mb-3">⚡ Improvements</h3>
          <ul className="flex flex-col gap-2">
            {report.improvements.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <span className="text-amber-400 text-xs mt-0.5">→</span>
                {s}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendation */}
      <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
        <h3 className="text-sm font-semibold text-cyan-400 mb-2">
          🎯 Recommendation
        </h3>
        <p className="text-slate-300 text-sm">{report.recommendation}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <motion.button
          onClick={onRestart}
          className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-black"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Practice Again →
        </motion.button>
        <Link href="/resume">
          <motion.button
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-slate-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Analyze Resume →
          </motion.button>
        </Link>
        <Link href="/dashboard">
          <motion.button
            className="rounded-xl border border-purple-500/20 bg-purple-500/8 px-6 py-2.5 text-sm text-purple-400"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            View Dashboard →
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

// ── Main Interview Page ───────────────────────────────────────────────────────
export default function InterviewPage() {
  const [stage, setStage] = useState<Stage>("setup");
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<Awaited<ReturnType<typeof getFinalReport>> | null>(null);

  async function startInterview(mode: InterviewMode, jobTitle: string) {
    const newSession: InterviewSession = {
      mode,
      jobTitle,
      messages: [],
      currentQuestionIndex: 0,
      totalScore: 0,
      isComplete: false,
    };

    setSession(newSession);
    setStage("interview");
    setIsLoading(true);

    const { question } = await getNextQuestion(newSession);

    setSession((prev) => ({
      ...prev!,
      messages: [
        {
          role: "interviewer",
          content: question,
          timestamp: new Date(),
        },
      ],
    }));

    setIsLoading(false);
  }

  async function handleAnswer(answer: string) {
    if (!session) return;

    // Add user message
    const updatedSession: InterviewSession = {
      ...session,
      messages: [
        ...session.messages,
        { role: "user", content: answer, timestamp: new Date() },
      ],
      currentQuestionIndex: session.currentQuestionIndex + 1,
    };
    setSession(updatedSession);
    setIsLoading(true);

    const questionCount = updatedSession.messages.filter(
      (m) => m.role === "interviewer"
    ).length;

    // End after 5 questions
    if (questionCount >= 5) {
      await endInterview(updatedSession);
      return;
    }

    // Get next question + score for this answer
    const result = await getNextQuestion(updatedSession, answer);

    setSession((prev) => ({
      ...prev!,
      messages: [
        ...prev!.messages.slice(0, -1), // remove last user msg
        {
          role: "user",
          content: answer,
          score: result.score,
          feedback: result.feedback,
          timestamp: new Date(),
        },
        {
          role: "interviewer",
          content: result.question,
          timestamp: new Date(),
        },
      ],
    }));

    setIsLoading(false);
  }

  async function endInterview(sessionToEnd?: InterviewSession) {
    const s = sessionToEnd || session;
    if (!s) return;

    setIsLoading(true);
    const finalReport = await getFinalReport(s);
    setReport(finalReport);
    setStage("report");
    setIsLoading(false);
  }

  function restart() {
    setStage("setup");
    setSession(null);
    setReport(null);
    setIsLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Top nav */}
        {/* Top nav */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Link
            href="/practice"
            className="text-cyan-400 text-sm hover:underline"
          >
            ← Practice Center
          </Link>

          {stage === "interview" && session && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              Interview in progress
            </div>
          )}
        </motion.div>
        <AnimatePresence mode="wait">
          {stage === "setup" && (
            <SetupScreen key="setup" onStart={startInterview} />
          )}
          {stage === "interview" && session && (
            <InterviewScreen
              key="interview"
              session={session}
              onAnswer={handleAnswer}
              onEnd={() => endInterview()}
              isLoading={isLoading}
            />
          )}
          {stage === "report" && session && report && (
            <ReportScreen
              key="report"
              session={session}
              report={report}
              onRestart={restart}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}