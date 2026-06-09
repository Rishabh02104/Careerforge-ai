"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

type DemoTab = "resume" | "interview" | "coding";

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<DemoTab>("resume");

  // ── RESUME CHECK STATE ──────────────────────────────────────────────────────
  const [pastedResume, setPastedResume] = useState(
    "John Doe\nAssociate Web Developer\n\nSkills: HTML, CSS, JavaScript, React\n\nExperience:\n- Built a personal portfolio website\n- Developed simple components for client sites"
  );
  const [resumeAnalyzing, setResumeAnalyzing] = useState(false);
  const [resumeResult, setResumeResult] = useState<any>(null);

  const handleAnalyzeResume = async () => {
    if (pastedResume.trim().length < 20) return;
    setResumeAnalyzing(true);
    setResumeResult(null);

    // Simulate analysis steps
    await new Promise((r) => setTimeout(r, 1600));

    setResumeResult({
      overallScore: 62,
      atsScore: 68,
      keywordsScore: 50,
      formattingScore: 85,
      jobTitleMatch: "Frontend Developer (Junior)",
      missingKeywords: ["TypeScript", "Next.js", "Zustand", "Git/GitHub", "Tailwind CSS"],
      strengths: ["Clean document formatting", "Good use of standard bullet points"],
      improvements: [
        "Include measurable results (e.g. 'improved loading time by 20%')",
        "Add modern tools like TypeScript and Next.js to match current jobs",
        "Add a summary statement explaining your professional objectives"
      ]
    });
    setResumeAnalyzing(false);
  };

  // ── MOCK INTERVIEW STATE ──────────────────────────────────────────────────
  const [chatHistory, setChatHistory] = useState<any[]>([
    {
      role: "ai",
      text: "AI Coach: Hello! Welcome to your mock interview demo. Let's start with a classic: 'Tell me about yourself and your background.'"
    }
  ]);
  const [userAnswer, setUserAnswer] = useState("");
  const [interviewThinking, setInterviewThinking] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || interviewThinking) return;

    const newHistory = [...chatHistory, { role: "user", text: userAnswer }];
    setChatHistory(newHistory);
    setUserAnswer("");
    setInterviewThinking(true);

    // Simulate response delay
    await new Promise((r) => setTimeout(r, 1500));

    if (newHistory.length === 2) {
      setChatHistory([
        ...newHistory,
        {
          role: "ai",
          text: "AI Coach: Great start! You highlighted your core projects. Tip: Try to state your specific role and team size. Now, next question: 'Describe a challenging technical problem you faced and how you solved it.'"
        }
      ]);
    } else {
      setChatHistory([
        ...newHistory,
        {
          role: "ai",
          text: "AI Coach: That's a good explanation of your problem-solving process. Using the STAR method (Situation, Task, Action, Result) will make it even stronger. Demo complete! Ready to try the full 5-question interview?"
        }
      ]);
      setInterviewCompleted(true);
    }
    setInterviewThinking(false);
  };

  // ── CODING CHALLENGE STATE ──────────────────────────────────────────────────
  const [code, setCode] = useState(
    `function reverseString(str) {\n  // Write your code here\n  return str;\n}`
  );
  const [codingStatus, setCodingStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [codingOutput, setCodingOutput] = useState("");

  const handleRunCode = async () => {
    setCodingStatus("running");
    setCodingOutput("");

    await new Promise((r) => setTimeout(r, 1200));

    // Simple test suite simulation
    const codeClean = code.replace(/\s+/g, "");
    const hasReverse = codeClean.includes(".reverse") || codeClean.includes("split('').reverse") || codeClean.includes("split(\"\").reverse");
    const hasLoop = codeClean.includes("for(") || codeClean.includes("while(") || codeClean.includes("for ");

    if (hasReverse || hasLoop) {
      setCodingStatus("success");
      setCodingOutput(
        "✓ Test 1: reverseString('hello') -> 'olleh' (Passed)\n✓ Test 2: reverseString('careerforge') -> 'egrofreerac' (Passed)\n\nGreat job! Your solution is correct. Time Complexity: O(N), Space Complexity: O(N)."
      );
    } else {
      setCodingStatus("error");
      setCodingOutput(
        "✗ Test 1: reverseString('hello') -> 'hello' (Failed. Expected 'olleh')\n\n🤖 AI Hint: You returned the original string. To reverse a string, try splitting it into an array of characters, reversing that array, and joining it back together: str.split('').reverse().join('')"
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <Link href="/" className="text-cyan-400 text-sm hover:underline mb-8 inline-block">
          ← Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-1.5 text-xs text-cyan-400 mb-4 font-semibold uppercase tracking-wider">
            🎮 Interactive Sandbox
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Try CareerForge{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Live
            </span>
          </h1>
          <p className="mt-3 text-slate-400 text-sm max-w-xl mx-auto">
            Interact with our three main AI features directly inside the demo. No account or API keys required.
          </p>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl max-w-lg mx-auto mb-10">
          {[
            { id: "resume", label: "📄 Resume Check" },
            { id: "interview", label: "💬 Mock Interview" },
            { id: "coding", label: "💻 Coding Run" }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as DemoTab)}
              className={`rounded-xl py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === t.id
                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Demo Content */}
        <div className="min-h-[460px]">
          <AnimatePresence mode="wait">
            {/* 📄 RESUME ANALYZER TAB */}
            {activeTab === "resume" && (
              <motion.div
                key="resume-demo"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Input block */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                    <h3 className="text-sm font-semibold text-white mb-2">Simulated ATS Scan</h3>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      Paste a mock resume structure below, then hit Analyze.
                    </p>
                    <textarea
                      value={pastedResume}
                      onChange={(e) => setPastedResume(e.target.value)}
                      rows={8}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500/40 resize-none leading-relaxed transition"
                      disabled={resumeAnalyzing}
                    />
                    <motion.button
                      onClick={handleAnalyzeResume}
                      disabled={resumeAnalyzing || pastedResume.trim().length < 20}
                      className="mt-4 w-full rounded-xl bg-cyan-500 py-3 text-xs font-bold text-black disabled:opacity-40"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {resumeAnalyzing ? "Running Simulated ATS check..." : "Analyze Resume Demo →"}
                    </motion.button>
                  </div>
                </div>

                {/* Output block */}
                <div className="lg:col-span-7">
                  <div className="rounded-2xl border border-white/8 bg-white/2 p-6 h-full flex flex-col justify-center min-h-[350px]">
                    {resumeAnalyzing ? (
                      <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <div className="relative w-16 h-16">
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-cyan-500/30"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-xl">🔍</div>
                        </div>
                        <p className="text-xs text-cyan-400">Scoring keyword frequency & format markers...</p>
                      </div>
                    ) : resumeResult ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col gap-5"
                      >
                        {/* Overall score row */}
                        <div className="flex items-center gap-6 border-b border-white/5 pb-4">
                          <div className="w-16 h-16 rounded-full border-4 border-cyan-500/40 flex items-center justify-center text-lg font-bold text-cyan-400 bg-cyan-500/5">
                            {resumeResult.overallScore}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">ATS Score Checklist</span>
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                                {resumeResult.jobTitleMatch}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                              Simulated score shows keyword gaps. Check the recommendations below.
                            </p>
                          </div>
                        </div>

                        {/* Keyword gap */}
                        <div>
                          <p className="text-[9px] text-red-400 uppercase tracking-wider mb-2 font-semibold">Missing Keywords</p>
                          <div className="flex flex-wrap gap-1.5">
                            {resumeResult.missingKeywords.map((k: string) => (
                              <span key={k} className="text-[10px] px-2.5 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 font-medium">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Suggestions */}
                        <div>
                          <p className="text-[9px] text-amber-400 uppercase tracking-wider mb-2 font-semibold">Key Improvements</p>
                          <ul className="flex flex-col gap-1.5">
                            {resumeResult.improvements.map((imp: string, i: number) => (
                              <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                <span className="text-amber-400 mt-0.5">→</span>
                                <span>{imp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Try Full Feature CTA */}
                        <Link href="/resume" className="mt-2">
                          <motion.button
                            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs text-slate-300 font-semibold hover:border-cyan-500/30 hover:text-cyan-400 transition"
                            whileHover={{ scale: 1.02 }}
                          >
                            Try Full ATS Analyzer with your PDF Resume →
                          </motion.button>
                        </Link>
                      </motion.div>
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-3xl mb-3">📄</p>
                        <p className="text-slate-400 text-sm font-medium">Ready for Resume Scan</p>
                        <p className="text-slate-500 text-xs mt-1 max-w-xs mx-auto leading-relaxed">
                          Click Analyze to check the sample resume text for keywords and format parameters.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 💬 MOCK INTERVIEW TAB */}
            {activeTab === "interview" && (
              <motion.div
                key="interview-demo"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto rounded-2xl border border-white/10 bg-white/3 p-6 flex flex-col gap-4"
              >
                {/* Chat window */}
                <div className="h-64 overflow-y-auto flex flex-col gap-3 pr-2 mb-2 bg-black/20 border border-white/5 rounded-xl p-4">
                  {chatHistory.map((chat, idx) => (
                    <div key={idx} className={`flex gap-2.5 ${chat.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border flex-shrink-0 ${
                        chat.role === "user" ? "bg-purple-500/10 border-purple-500/30 text-purple-400" : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                      }`}>
                        {chat.role === "user" ? "You" : "AI"}
                      </div>
                      <div className={`rounded-xl px-3.5 py-2 text-xs leading-relaxed max-w-[85%] ${
                        chat.role === "user" ? "bg-purple-500/10 border border-purple-500/20 text-slate-100" : "bg-white/5 border border-white/8 text-slate-200"
                      }`}>
                        {chat.text}
                      </div>
                    </div>
                  ))}
                  {interviewThinking && (
                    <div className="flex gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[10px] font-bold text-cyan-400">AI</div>
                      <div className="bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 flex items-center gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Input controls */}
                {!interviewCompleted ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmitAnswer()}
                      placeholder="Type your mock interview response..."
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                      disabled={interviewThinking}
                    />
                    <motion.button
                      onClick={handleSubmitAnswer}
                      disabled={!userAnswer.trim() || interviewThinking}
                      className="rounded-xl bg-cyan-500 px-5 text-xs font-bold text-black disabled:opacity-40"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Submit
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex gap-3 justify-center mt-2">
                    <Link href="/interview">
                      <motion.button
                        className="rounded-xl bg-cyan-500 px-6 py-2.5 text-xs font-bold text-black"
                        whileHover={{ scale: 1.03 }}
                      >
                        Start Real Mock Interview →
                      </motion.button>
                    </Link>
                    <motion.button
                      onClick={() => {
                        setChatHistory([{ role: "ai", text: "AI Coach: Hello! Let's start: 'Tell me about yourself and your background.'" }]);
                        setInterviewCompleted(false);
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-xs text-slate-400 font-semibold"
                      whileHover={{ scale: 1.03 }}
                    >
                      Restart Demo
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}

            {/* 💻 CODING PRACTICE TAB */}
            {activeTab === "coding" && (
              <motion.div
                key="coding-demo"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Editor block */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="rounded-2xl border border-white/10 bg-[#0c0f1e] p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                      <div>
                        <span className="text-xs font-semibold text-white">Challenge: Reverse a String</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">Write a function to return the input string reversed.</p>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full border border-green-500/20 bg-green-500/10 text-green-400 font-bold uppercase">
                        Easy
                      </span>
                    </div>

                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      rows={8}
                      className="w-full bg-[#050816]/60 border border-white/5 rounded-xl px-4 py-3 font-mono text-xs text-cyan-400 leading-relaxed focus:outline-none focus:border-cyan-500/30 resize-none"
                      disabled={codingStatus === "running"}
                    />

                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] text-slate-500 font-mono">JS Engine Node v18</span>
                      <motion.button
                        onClick={handleRunCode}
                        disabled={codingStatus === "running"}
                        className="rounded-xl bg-cyan-500 px-6 py-2.5 text-xs font-bold text-black"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {codingStatus === "running" ? "Executing tests..." : "Run Test Suite →"}
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Console Output block */}
                <div className="lg:col-span-5">
                  <div className="rounded-2xl border border-white/8 bg-black/40 p-5 h-full flex flex-col min-h-[280px]">
                    <div className="flex items-center gap-1.5 border-b border-white/5 pb-3 mb-4">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                      <span className="text-[10px] text-slate-500 font-mono ml-2">Console Output</span>
                    </div>

                    {codingStatus === "running" ? (
                      <div className="flex-1 flex flex-col justify-center items-center text-center gap-3">
                        <motion.div
                          className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                        <span className="text-[10px] text-slate-500 font-mono">Running unit test assertion cases...</span>
                      </div>
                    ) : codingStatus === "success" ? (
                      <div className="flex-1 flex flex-col gap-4 font-mono text-[11px] text-green-400">
                        <p className="whitespace-pre-wrap leading-relaxed">{codingOutput}</p>
                        <Link href="/coding" className="mt-auto">
                          <motion.button
                            className="w-full rounded-xl border border-green-500/25 bg-green-500/5 py-2.5 text-xs text-green-400 font-semibold hover:bg-green-500/10 transition"
                            whileHover={{ scale: 1.02 }}
                          >
                            Explore Coding Practice Center →
                          </motion.button>
                        </Link>
                      </div>
                    ) : codingStatus === "error" ? (
                      <div className="flex-1 flex flex-col gap-4 font-mono text-[11px] text-red-400">
                        <p className="whitespace-pre-wrap leading-relaxed">{codingOutput}</p>
                        <motion.button
                          onClick={() => setCode(`function reverseString(str) {\n  return str.split('').reverse().join('');\n}`)}
                          className="mt-auto w-full rounded-xl border border-red-500/25 bg-red-500/5 py-2.5 text-xs text-red-400 font-semibold hover:bg-red-500/10 transition"
                          whileHover={{ scale: 1.02 }}
                        >
                          Auto-Apply Fix & Run again
                        </motion.button>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col justify-center items-center text-center text-slate-500 py-6">
                        <p className="text-2xl mb-2">💻</p>
                        <p className="text-xs font-mono">Console is idle.</p>
                        <p className="text-[10px] max-w-[200px] mt-1 leading-relaxed">
                          Click Run Test Suite to execute the function against assertions.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global CTA footer */}
        <div className="mt-16 text-center border-t border-white/5 pt-10">
          <p className="text-slate-400 text-sm mb-4">Ready to polish your resume, practice interviews, and match to jobs?</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup">
              <motion.button
                className="rounded-xl bg-cyan-500 px-8 py-3 text-sm font-semibold text-black shadow-lg shadow-cyan-500/20"
                whileHover={{ scale: 1.03 }}
              >
                Create Free Account →
              </motion.button>
            </Link>
            <Link href="/practice">
              <motion.button
                className="rounded-xl border border-white/10 bg-white/5 px-8 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/8 transition"
                whileHover={{ scale: 1.03 }}
              >
                Go to Practice Hub
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}