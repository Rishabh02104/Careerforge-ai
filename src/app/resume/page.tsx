"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { analyzeResume, extractTextFromFile, ResumeAnalysis } from "@/services/resumeAnalyzer";
import { useAuth } from "@/context/AuthContext";

type UploadState = "idle" | "uploading" | "analyzing" | "done" | "error";

function ScoreRing({ score, color, size = 80 }: { score: number; color: string; size?: number }) {
  const r = size / 2 - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
      </svg>
      <motion.span
        className="font-bold text-white"
        style={{ fontSize: size * 0.22 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        {score}
      </motion.span>
    </div>
  );
}

function AnalysisResult({ analysis }: { analysis: ResumeAnalysis }) {
const scoreColor =
  analysis.overallScore === 0
    ? "#f87171"
    : analysis.overallScore >= 80
    ? "#22d3ee"
    : analysis.overallScore >= 60
    ? "#a78bfa"
    : "#f87171";

const scoreLabel =
  analysis.overallScore === 0
    ? "Failed"
    : analysis.overallScore >= 80
    ? "Excellent"
    : analysis.overallScore >= 60
    ? "Good"
    : "Needs Work";

  const subScores = [
    { label: "ATS Score",    value: analysis.atsScore,        color: "#22d3ee" },
    { label: "Keywords",     value: analysis.keywordsScore,   color: "#8b5cf6" },
    { label: "Formatting",   value: analysis.formattingScore, color: "#06b6d4" },
    { label: "Experience",   value: analysis.experienceScore, color: "#a78bfa" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6"
    >
      {/* Overall score */}
      <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-6">
        <div className="flex items-center gap-6">
          <ScoreRing score={analysis.overallScore} color={scoreColor} size={100} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-white">{scoreLabel}</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full border font-medium"
                style={{ color: scoreColor, borderColor: scoreColor + "33", background: scoreColor + "11" }}
              >
                {analysis.jobTitleMatch}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{analysis.summary}</p>
          </div>
        </div>
      </div>

      {/* Sub scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {subScores.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-white/8 bg-white/3 p-4 flex flex-col items-center gap-2"
            whileHover={{ y: -3, borderColor: s.color + "44" }}
          >
            <ScoreRing score={s.value} color={s.color} size={64} />
            <span className="text-[11px] text-slate-400 text-center">{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Strengths + Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-green-500/15 bg-green-500/5 p-5"
        >
          <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
            <span>✅</span> Strengths
          </h3>
          <ul className="flex flex-col gap-2">
            {analysis.strengths.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <span className="text-green-400 mt-0.5 text-xs">✦</span>
                {s}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5"
        >
          <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
            <span>⚡</span> Improvements
          </h3>
          <ul className="flex flex-col gap-2">
            {analysis.improvements.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <span className="text-amber-400 mt-0.5 text-xs">→</span>
                {s}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Keywords */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-white/8 bg-white/3 p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Keyword Analysis</h3>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[10px] text-red-400 uppercase tracking-widest mb-2">Missing Keywords</p>
            <div className="flex flex-wrap gap-2">
              {analysis.missingKeywords.map((k, i) => (
                <motion.span
                  key={k}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  className="text-xs px-3 py-1 rounded-full border border-red-500/20 bg-red-500/8 text-red-400"
                >
                  {k}
                </motion.span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-cyan-400 uppercase tracking-widest mb-2">Suggested Keywords</p>
            <div className="flex flex-wrap gap-2">
              {analysis.suggestedKeywords.map((k, i) => (
                <motion.span
                  key={k}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                  className="text-xs px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/8 text-cyan-400"
                >
                  + {k}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link href="/dashboard">
          <motion.button
            className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-black"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Save to Dashboard →
          </motion.button>
        </Link>
        <Link href="/practice">
          <motion.button
            className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-6 py-2.5 text-sm text-purple-400"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Practice Interview →
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function ResumePage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "Reading your resume...",
    "Extracting content...",
    "Running ATS analysis...",
    "Scoring keywords...",
    "Generating insights...",
  ];

  const processFile = useCallback(async (file: File) => {
    if (!file) return;

    const validTypes = ["application/pdf", "text/plain", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|txt|doc|docx)$/i)) {
      setErrorMsg("Please upload a PDF, DOC, DOCX, or TXT file");
      setUploadState("error");
      return;
    }

    setFileName(file.name);
    setUploadState("uploading");
    setAnalysis(null);
    setErrorMsg("");

    // Simulate upload progress
    await new Promise(r => setTimeout(r, 600));
    setUploadState("analyzing");

    // Step through loading messages
    for (let i = 0; i < loadingSteps.length; i++) {
      setLoadingStep(i);
      await new Promise(r => setTimeout(r, 500));
    }

    try {
      const text = await extractTextFromFile(file);

      // Show user what was extracted (debug helper)
      console.log("Extracted text preview:", text.slice(0, 200));

      // Warn if extraction likely failed
      if (text.startsWith("Resume file:") || text.startsWith("Resume:")) {
        setErrorMsg(text);
        setUploadState("error");
        return;
      }

      const result = await analyzeResume(text);

      // If all scores are 0 something went wrong
      if (result.overallScore === 0) {
        setErrorMsg(
          "Could not extract text from this file. Please try uploading as a .txt or .docx file instead."
        );
        setUploadState("error");
        return;
      }

      setAnalysis(result);
      setUploadState("done");
    } catch (err) {
      console.error(err);
      setErrorMsg("Analysis failed. Please try again.");
      setUploadState("error");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href={user ? "/dashboard" : "/"} className="text-cyan-400 text-sm hover:underline mb-4 inline-block">
            ← Back
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="inline-block rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-1.5 text-xs text-cyan-400">
              📄 AI Resume Analyzer
            </div>
          </div>
          <h1 className="text-4xl font-bold">
            Analyze Your{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Resume
            </span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-xl">
            Upload your resume and get instant ATS score, keyword analysis,
            and AI-powered improvement suggestions.
          </p>
        </motion.div>

        {/* Upload zone */}
        <AnimatePresence mode="wait">
          {uploadState === "idle" || uploadState === "error" ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={handleFileChange}
              />

              <motion.div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                animate={dragOver ? { scale: 1.02, borderColor: "rgba(34,211,238,0.6)" } : {}}
                className="relative rounded-2xl border-2 border-dashed border-white/15 bg-white/2 p-12 text-center cursor-pointer transition-all hover:border-cyan-500/40 hover:bg-cyan-500/3"
              >
                {/* Animated dots */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
                  animate={{ opacity: dragOver ? 0.3 : 0 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />
                </motion.div>

                <motion.div
                  className="text-5xl mb-4"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  📄
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {dragOver ? "Drop it here!" : "Drop your resume here"}
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  or click to browse files
                </p>
                <span className="text-[10px] text-slate-500 border border-white/10 rounded-full px-3 py-1">
                  PDF · DOC · DOCX · TXT
                </span>

                {uploadState === "error" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-red-400 text-sm"
                  >
                    ⚠️ {errorMsg}
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          ) : uploadState === "uploading" || uploadState === "analyzing" ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-10 text-center"
            >
              {/* Animated core */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border border-cyan-500/30"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    🔍
                  </motion.div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                Analyzing {fileName}
              </h3>

              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-cyan-400 text-sm mb-6"
                >
                  {loadingSteps[loadingStep]}
                </motion.p>
              </AnimatePresence>

              {/* Progress bar */}
              <div className="w-full max-w-xs mx-auto h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  animate={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {uploadState === "done" && analysis && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-white">Analysis Results</h2>
                  <p className="text-slate-400 text-xs mt-0.5">{fileName}</p>
                </div>
                <motion.button
                  onClick={() => {
                    setUploadState("idle");
                    setAnalysis(null);
                    setFileName("");
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  ↑ Upload New Resume
                </motion.button>
              </div>
              <AnalysisResult analysis={analysis} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}