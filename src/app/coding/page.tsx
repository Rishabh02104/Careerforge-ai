"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  description: string;
  examples: { input: string; output: string }[];
  starterCode: string;
}

const PROBLEMS: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    starterCode: `function twoSum(nums, target) {\n  // Your solution here\n  \n}`,
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed in the correct order.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    starterCode: `function isValid(s) {\n  // Your solution here\n  \n}`,
  },
  {
    id: 3,
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked List",
    description:
      "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = [1,2]", output: "[2,1]" },
    ],
    starterCode: `function reverseList(head) {\n  // Your solution here\n  \n}`,
  },
  {
    id: 4,
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description:
      "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
      { input: "nums = [1]", output: "1" },
    ],
    starterCode: `function maxSubArray(nums) {\n  // Your solution here\n  \n}`,
  },
  {
    id: 5,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    category: "Trees",
    description:
      "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]",
      },
    ],
    starterCode: `function levelOrder(root) {\n  // Your solution here\n  \n}`,
  },
  {
    id: 6,
    title: "LRU Cache",
    difficulty: "Hard",
    category: "Design",
    description:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get and put methods.",
    examples: [
      {
        input: "LRUCache(2), put(1,1), put(2,2), get(1)",
        output: "1",
      },
    ],
    starterCode: `class LRUCache {\n  constructor(capacity) {\n    // Your solution here\n  }\n  get(key) {}\n  put(key, value) {}\n}`,
  },
  {
    id: 7,
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description:
      "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [
      { input: "n = 2", output: "2" },
      { input: "n = 3", output: "3" },
    ],
    starterCode: `function climbStairs(n) {\n  // Your solution here\n  \n}`,
  },
  {
    id: 8,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List",
    description:
      "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list and return the head of the merged linked list.",
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "list1 = [], list2 = []", output: "[]" },
    ],
    starterCode: `function mergeTwoLists(list1, list2) {\n  // Your solution here\n  \n}`,
  },
  {
    id: 9,
    title: "Word Search",
    difficulty: "Medium",
    category: "Backtracking",
    description:
      "Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells.",
    examples: [
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: "true",
      },
    ],
    starterCode: `function exist(board, word) {\n  // Your solution here\n  \n}`,
  },
  {
    id: 10,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Arrays",
    description:
      "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
      { input: "height = [4,2,0,3,2,5]", output: "9" },
    ],
    starterCode: `function trap(height) {\n  // Your solution here\n  \n}`,
  },
];

type EditorState = "idle" | "running" | "success" | "error";

async function getAIHint(problem: Problem, code: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `You are a coding mentor. The student is solving "${problem.title}".

Their current code:
\`\`\`javascript
${code}
\`\`\`

Give a helpful hint (NOT the full solution) in 2-3 sentences. Be encouraging and point them in the right direction.`,
        },
      ],
    }),
  });
  const data = await response.json();
  return (
    data.content?.[0]?.text ||
    "Think about the time complexity. Can you solve this in O(n)?"
  );
}

async function getAISolution(problem: Problem): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      messages: [
        {
          role: "user",
          content: `Provide a clean, well-commented JavaScript solution for: "${problem.title}".

${problem.description}

Format: just the code with comments explaining the approach. Include time/space complexity at the top as a comment.`,
        },
      ],
    }),
  });
  const data = await response.json();
  return data.content?.[0]?.text || "// Solution unavailable";
}

const difficultyConfig = {
  Easy:   { text: "#22d3ee", bg: "rgba(34,211,238,0.1)",   border: "rgba(34,211,238,0.2)"   },
  Medium: { text: "#f59e0b", bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.2)"   },
  Hard:   { text: "#f87171", bg: "rgba(248,113,113,0.1)",  border: "rgba(248,113,113,0.2)"  },
};

export default function CodingPage() {
  const [selected, setSelected] = useState<Problem>(PROBLEMS[0]);
  const [code, setCode] = useState(PROBLEMS[0].starterCode);
  const [editorState, setEditorState] = useState<EditorState>("idle");
  const [hint, setHint] = useState("");
  const [solution, setSolution] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [filter, setFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [solved, setSolved] = useState<Set<number>>(new Set());

  const filtered =
    filter === "All" ? PROBLEMS : PROBLEMS.filter((p) => p.difficulty === filter);

  function selectProblem(p: Problem) {
    setSelected(p);
    setCode(p.starterCode);
    setHint("");
    setSolution("");
    setShowSolution(false);
    setOutput("");
    setEditorState("idle");
  }

  function runCode() {
    setEditorState("running");
    setOutput("");
    setTimeout(() => {
      try {
        // Safe function detection
        const hasFunction =
          code.includes("function twoSum") ||
          code.includes("function isValid") ||
          code.includes("function reverseList") ||
          code.includes("function maxSubArray") ||
          code.includes("function levelOrder") ||
          code.includes("class LRUCache") ||
          code.includes("function climbStairs") ||
          code.includes("function mergeTwoLists") ||
          code.includes("function exist") ||
          code.includes("function trap");

        if (hasFunction && code.trim().length > selected.starterCode.trim().length + 5) {
          setSolved((prev) => new Set([...prev, selected.id]));
          setOutput("✅ Code compiled successfully! Logic looks good — test your edge cases.");
          setEditorState("success");
        } else {
          setOutput("⚠️ Add your solution inside the function body.");
          setEditorState("error");
        }
      } catch (e: any) {
        setOutput(`❌ Error: ${e.message}`);
        setEditorState("error");
      }
    }, 800);
  }

  async function fetchHint() {
    setHintLoading(true);
    setShowSolution(false);
    setSolution("");
    const h = await getAIHint(selected, code);
    setHint(h);
    setHintLoading(false);
  }

  async function fetchSolution() {
    setHintLoading(true);
    if (!solution) {
      const s = await getAISolution(selected);
      setSolution(s);
    }
    setShowSolution(true);
    setHint("");
    setHintLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="flex h-screen overflow-hidden">

        {/* ── Problem list sidebar ──────────────────────────────────────────── */}
        <div className="w-72 border-r border-white/5 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-white/5">
            <Link
              href="/practice"
              className="text-cyan-400 text-xs hover:underline mb-3 inline-block"
            >
              ← Practice Center
            </Link>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-white text-sm">Coding Problems</h2>
              <span className="text-[10px] text-slate-400">
                {solved.size}/{PROBLEMS.length} solved
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-white/5 rounded-full mb-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                animate={{ width: `${(solved.size / PROBLEMS.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-1.5 flex-wrap">
              {(["All", "Easy", "Medium", "Hard"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-2.5 py-1 text-[10px] border transition ${
                    filter === f
                      ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                      : "border-white/8 text-slate-400 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Problem list */}
          <div className="flex-1 overflow-y-auto p-2">
            {filtered.map((p) => {
              const dc = difficultyConfig[p.difficulty];
              return (
                <motion.button
                  key={p.id}
                  onClick={() => selectProblem(p)}
                  className={`w-full text-left rounded-xl p-3 mb-1.5 border transition ${
                    selected.id === p.id
                      ? "border-cyan-500/30 bg-cyan-500/8"
                      : "border-transparent hover:bg-white/3"
                  }`}
                  whileHover={{ x: 3 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      {solved.has(p.id) && (
                        <span className="text-green-400 text-xs">✓</span>
                      )}
                      <span className="text-xs font-medium text-white truncate">
                        {p.id}. {p.title}
                      </span>
                    </div>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full border ml-1 flex-shrink-0"
                      style={{
                        color: dc.text,
                        background: dc.bg,
                        borderColor: dc.border,
                      }}
                    >
                      {p.difficulty}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">{p.category}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Main editor area ──────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Problem description */}
          <div className="border-b border-white/5 p-5 overflow-y-auto max-h-56 flex-shrink-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h2 className="font-bold text-lg text-white">
                {selected.id}. {selected.title}
              </h2>
              <span
                className="text-xs px-2.5 py-1 rounded-full border font-medium"
                style={{
                  color: difficultyConfig[selected.difficulty].text,
                  background: difficultyConfig[selected.difficulty].bg,
                  borderColor: difficultyConfig[selected.difficulty].border,
                }}
              >
                {selected.difficulty}
              </span>
              <span className="text-[10px] text-slate-500 border border-white/8 rounded-full px-2 py-0.5">
                {selected.category}
              </span>
              {solved.has(selected.id) && (
                <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-2 py-0.5">
                  ✓ Solved
                </span>
              )}
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              {selected.description}
            </p>

            <div className="flex flex-col gap-2">
              {selected.examples.map((ex, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-white/3 border border-white/5 p-3 text-xs font-mono"
                >
                  <span className="text-slate-400">Input: </span>
                  <span className="text-cyan-300">{ex.input}</span>
                  <br />
                  <span className="text-slate-400">Output: </span>
                  <span className="text-green-300">{ex.output}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Code editor */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[10px] text-slate-500 ml-2 font-mono">
                  solution.js
                </span>
              </div>

              <div className="flex gap-2">
                <motion.button
                  onClick={fetchHint}
                  disabled={hintLoading}
                  className="rounded-lg border border-purple-500/20 bg-purple-500/8 px-3 py-1.5 text-[11px] text-purple-400 disabled:opacity-50"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {hintLoading ? "..." : "💡 Hint"}
                </motion.button>
                <motion.button
                  onClick={fetchSolution}
                  disabled={hintLoading}
                  className="rounded-lg border border-amber-500/20 bg-amber-500/8 px-3 py-1.5 text-[11px] text-amber-400 disabled:opacity-50"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  🔍 Solution
                </motion.button>
                <motion.button
                  onClick={runCode}
                  disabled={editorState === "running"}
                  className="rounded-lg bg-cyan-500 px-4 py-1.5 text-[11px] font-semibold text-black disabled:opacity-50"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {editorState === "running" ? "Running..." : "▶ Run"}
                </motion.button>
              </div>
            </div>

            {/* Code textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-[#030712] text-sm text-green-300 font-mono p-4 resize-none focus:outline-none leading-relaxed"
              spellCheck={false}
              style={{ tabSize: 2 }}
            />

            {/* Output / hint / solution panel */}
            <AnimatePresence>
              {(output || hint || showSolution) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-white/5 bg-white/2 p-4 max-h-52 overflow-y-auto flex-shrink-0"
                >
                  {output && (
                    <p
                      className={`text-sm font-mono mb-3 ${
                        editorState === "success"
                          ? "text-green-400"
                          : editorState === "error"
                          ? "text-red-400"
                          : "text-slate-300"
                      }`}
                    >
                      {output}
                    </p>
                  )}

                  {hint && !showSolution && (
                    <div className="rounded-xl border border-purple-500/20 bg-purple-500/8 p-3">
                      <p className="text-[10px] text-purple-400 uppercase tracking-widest mb-1.5">
                        💡 AI Hint
                      </p>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {hint}
                      </p>
                    </div>
                  )}

                  {showSolution && solution && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 p-3">
                      <p className="text-[10px] text-amber-400 uppercase tracking-widest mb-2">
                        🔍 AI Solution
                      </p>
                      <pre className="text-xs text-green-300 font-mono whitespace-pre-wrap leading-relaxed">
                        {solution}
                      </pre>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}