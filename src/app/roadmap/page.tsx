"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type NodeStatus = "completed" | "current" | "locked";
type RoadmapCategory = "frontend" | "backend" | "fullstack" | "data" | "devops";

interface RoadmapNode {
  id: string;
  title: string;
  desc: string;
  status: NodeStatus;
  skills: string[];
  resources: string[];
  estimatedWeeks: number;
  xp: number;
}

interface RoadmapPath {
  id: RoadmapCategory;
  title: string;
  icon: string;
  color: string;
  desc: string;
  nodes: RoadmapNode[];
}

const PATHS: RoadmapPath[] = [
  {
    id: "frontend",
    title: "Frontend Developer",
    icon: "🎨",
    color: "#22d3ee",
    desc: "Master modern UI development with React, TypeScript and more",
    nodes: [
      {
        id: "f1",
        title: "HTML & CSS Fundamentals",
        desc: "Build the foundation of every website — structure and styling",
        status: "locked",
        skills: ["HTML5", "CSS3", "Flexbox", "Grid", "Responsive Design"],
        resources: ["MDN Web Docs", "CSS Tricks", "freeCodeCamp"],
        estimatedWeeks: 3,
        xp: 100,
      },
      {
        id: "f2",
        title: "JavaScript Essentials",
        desc: "Learn the language of the web — variables, functions, DOM, async",
        status: "locked",
        skills: ["ES6+", "DOM Manipulation", "Fetch API", "Promises", "Async/Await"],
        resources: ["JavaScript.info", "Eloquent JavaScript", "You Don't Know JS"],
        estimatedWeeks: 5,
        xp: 200,
      },
      {
        id: "f3",
        title: "React & TypeScript",
        desc: "Build scalable component-based UIs with the most popular framework",
        status: "locked",
        skills: ["React 18", "TypeScript", "Hooks", "Context API", "React Router"],
        resources: ["React Docs", "Total TypeScript", "Kent C. Dodds Blog"],
        estimatedWeeks: 6,
        xp: 300,
      },
      {
        id: "f4",
        title: "State Management",
        desc: "Handle complex application state with modern solutions",
        status: "locked",
        skills: ["Zustand", "Redux Toolkit", "React Query", "SWR"],
        resources: ["Redux Docs", "TkDodo Blog", "Zustand GitHub"],
        estimatedWeeks: 3,
        xp: 200,
      },
      {
        id: "f5",
        title: "Testing & Quality",
        desc: "Write reliable tests and ensure your code works as expected",
        status: "locked",
        skills: ["Jest", "React Testing Library", "Cypress", "Playwright"],
        resources: ["Testing Library Docs", "Kent C. Dodds Testing", "Cypress Docs"],
        estimatedWeeks: 3,
        xp: 200,
      },
      {
        id: "f6",
        title: "Performance & Deployment",
        desc: "Optimize your apps and ship them to production",
        status: "locked",
        skills: ["Lighthouse", "Web Vitals", "Vercel", "CI/CD", "Next.js"],
        resources: ["web.dev", "Next.js Docs", "Vercel Docs"],
        estimatedWeeks: 4,
        xp: 300,
      },
    ],
  },
  {
    id: "backend",
    title: "Backend Developer",
    icon: "⚙️",
    color: "#8b5cf6",
    desc: "Build robust APIs, databases, and server-side systems",
    nodes: [
      {
        id: "b1",
        title: "Node.js & Express",
        desc: "Build fast, scalable server-side applications with JavaScript",
        status: "locked",
        skills: ["Node.js", "Express.js", "REST APIs", "Middleware", "Error Handling"],
        resources: ["Node.js Docs", "Express Guide", "The Odin Project"],
        estimatedWeeks: 4,
        xp: 150,
      },
      {
        id: "b2",
        title: "Databases",
        desc: "Store and query data efficiently with SQL and NoSQL databases",
        status: "locked",
        skills: ["PostgreSQL", "MongoDB", "Prisma", "Redis", "Query Optimization"],
        resources: ["PostgreSQL Docs", "MongoDB University", "Prisma Docs"],
        estimatedWeeks: 5,
        xp: 250,
      },
      {
        id: "b3",
        title: "Authentication & Security",
        desc: "Secure your applications with modern auth patterns",
        status: "locked",
        skills: ["JWT", "OAuth 2.0", "bcrypt", "HTTPS", "CORS", "Rate Limiting"],
        resources: ["Auth0 Docs", "OWASP Top 10", "JWT.io"],
        estimatedWeeks: 3,
        xp: 200,
      },
      {
        id: "b4",
        title: "API Design & GraphQL",
        desc: "Design clean, efficient APIs that developers love to use",
        status: "locked",
        skills: ["RESTful Design", "GraphQL", "OpenAPI", "Versioning", "Documentation"],
        resources: ["GraphQL Docs", "Apollo Server", "Swagger"],
        estimatedWeeks: 4,
        xp: 200,
      },
      {
        id: "b5",
        title: "Cloud & DevOps",
        desc: "Deploy and scale your backend on modern cloud platforms",
        status: "locked",
        skills: ["AWS/GCP", "Docker", "Kubernetes", "GitHub Actions", "Monitoring"],
        resources: ["AWS Free Tier", "Docker Docs", "GitHub Actions Docs"],
        estimatedWeeks: 5,
        xp: 350,
      },
    ],
  },
  {
    id: "fullstack",
    title: "Full Stack Developer",
    icon: "🚀",
    color: "#06b6d4",
    desc: "Master both frontend and backend to build complete applications",
    nodes: [
      {
        id: "fs1",
        title: "Web Fundamentals",
        desc: "HTML, CSS, JavaScript — the holy trinity of the web",
        status: "locked",
        skills: ["HTML5", "CSS3", "JavaScript ES6+", "Git", "Chrome DevTools"],
        resources: ["The Odin Project", "freeCodeCamp", "MDN"],
        estimatedWeeks: 6,
        xp: 200,
      },
      {
        id: "fs2",
        title: "React + Node Stack",
        desc: "Build complete web apps with the most popular JS stack",
        status: "locked",
        skills: ["React", "Node.js", "Express", "REST APIs", "JSON"],
        resources: ["Full Stack Open", "MERN Stack Tutorial", "Traversy Media"],
        estimatedWeeks: 8,
        xp: 400,
      },
      {
        id: "fs3",
        title: "Database Integration",
        desc: "Connect your apps to persistent data storage",
        status: "locked",
        skills: ["MongoDB", "PostgreSQL", "Prisma ORM", "Data Modeling"],
        resources: ["Prisma Docs", "MongoDB Atlas", "Supabase"],
        estimatedWeeks: 4,
        xp: 250,
      },
      {
        id: "fs4",
        title: "Next.js & TypeScript",
        desc: "Build production-grade apps with the industry-standard framework",
        status: "locked",
        skills: ["Next.js 14", "TypeScript", "App Router", "Server Components", "Edge Runtime"],
        resources: ["Next.js Docs", "Vercel Blog", "Lee Robinson YouTube"],
        estimatedWeeks: 5,
        xp: 300,
      },
      {
        id: "fs5",
        title: "System Design",
        desc: "Architect scalable systems that handle millions of users",
        status: "locked",
        skills: ["Load Balancing", "Caching", "Microservices", "Message Queues", "CDN"],
        resources: ["System Design Primer", "ByteByteGo", "Designing Data-Intensive Apps"],
        estimatedWeeks: 6,
        xp: 500,
      },
    ],
  },
  {
    id: "data",
    title: "Data Scientist",
    icon: "📊",
    color: "#a78bfa",
    desc: "Analyze data and build ML models that power intelligent products",
    nodes: [
      {
        id: "d1",
        title: "Python for Data",
        desc: "Master Python and its data ecosystem",
        status: "locked",
        skills: ["Python", "NumPy", "Pandas", "Matplotlib", "Jupyter"],
        resources: ["Python Docs", "Kaggle Learn", "Corey Schafer YouTube"],
        estimatedWeeks: 4,
        xp: 150,
      },
      {
        id: "d2",
        title: "Statistics & Math",
        desc: "Build the mathematical foundation for machine learning",
        status: "locked",
        skills: ["Probability", "Linear Algebra", "Statistics", "Calculus Basics"],
        resources: ["Khan Academy", "StatQuest", "3Blue1Brown"],
        estimatedWeeks: 5,
        xp: 200,
      },
      {
        id: "d3",
        title: "Machine Learning",
        desc: "Train models that learn from data and make predictions",
        status: "locked",
        skills: ["Scikit-learn", "Regression", "Classification", "Clustering", "Model Evaluation"],
        resources: ["Scikit-learn Docs", "Hands-On ML Book", "Fast.ai"],
        estimatedWeeks: 8,
        xp: 400,
      },
      {
        id: "d4",
        title: "Deep Learning",
        desc: "Build neural networks for vision, NLP, and more",
        status: "locked",
        skills: ["PyTorch", "TensorFlow", "CNNs", "Transformers", "Fine-tuning"],
        resources: ["PyTorch Docs", "Deep Learning Specialization", "Papers With Code"],
        estimatedWeeks: 10,
        xp: 600,
      },
    ],
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    icon: "🔧",
    color: "#34d399",
    desc: "Bridge development and operations to deploy software reliably",
    nodes: [
      {
        id: "do1",
        title: "Linux & Bash",
        desc: "Master the command line and Linux system administration",
        status: "locked",
        skills: ["Linux", "Bash Scripting", "File System", "Permissions", "Cron Jobs"],
        resources: ["Linux Journey", "The Linux Command Line Book", "OverTheWire"],
        estimatedWeeks: 3,
        xp: 150,
      },
      {
        id: "do2",
        title: "Docker & Containers",
        desc: "Package and run applications in isolated containers",
        status: "locked",
        skills: ["Docker", "Docker Compose", "Images", "Volumes", "Networking"],
        resources: ["Docker Docs", "Play with Docker", "TechWorld with Nana"],
        estimatedWeeks: 4,
        xp: 200,
      },
      {
        id: "do3",
        title: "CI/CD Pipelines",
        desc: "Automate testing and deployment with modern pipelines",
        status: "locked",
        skills: ["GitHub Actions", "Jenkins", "GitLab CI", "Testing Automation"],
        resources: ["GitHub Actions Docs", "Jenkins Docs", "DevOps Roadmap"],
        estimatedWeeks: 4,
        xp: 250,
      },
      {
        id: "do4",
        title: "Kubernetes",
        desc: "Orchestrate containers at scale in production",
        status: "locked",
        skills: ["K8s", "Pods", "Deployments", "Services", "Helm", "kubectl"],
        resources: ["Kubernetes Docs", "KodeKloud", "CKAD Prep"],
        estimatedWeeks: 6,
        xp: 400,
      },
      {
        id: "do5",
        title: "Cloud Platforms",
        desc: "Deploy and manage infrastructure on AWS, GCP, or Azure",
        status: "locked",
        skills: ["AWS/GCP/Azure", "IaC", "Terraform", "Monitoring", "Cost Optimization"],
        resources: ["AWS Free Tier", "A Cloud Guru", "Terraform Docs"],
        estimatedWeeks: 6,
        xp: 450,
      },
    ],
  },
];

function NodeCard({
  node,
  isSelected,
  onClick,
  color,
}: {
  node: RoadmapNode;
  isSelected: boolean;
  onClick: () => void;
  color: string;
}) {
  const statusConfig = {
    completed: { icon: "✓", bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400" },
    current:   { icon: "▶", bg: "bg-cyan-500/10",  border: "border-cyan-500/30",  text: "text-cyan-400"  },
    locked:    { icon: "🔒", bg: "bg-white/3",      border: "border-white/8",      text: "text-slate-500" },
  }[node.status];

  return (
    <motion.button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${statusConfig.bg} ${
        isSelected
          ? "border-opacity-100 shadow-lg"
          : statusConfig.border
      } ${node.status === "locked" ? "opacity-40 cursor-not-allowed" : ""}`}
      style={isSelected ? { borderColor: color + "80", boxShadow: `0 0 20px ${color}20` } : {}}
      whileHover={node.status !== "locked" ? { x: 4 } : {}}
      whileTap={node.status !== "locked" ? { scale: 0.98 } : {}}
      disabled={node.status === "locked"}
    >
      <div className="flex items-start gap-3">
        {/* Status icon */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 border ${statusConfig.border} ${statusConfig.bg} ${statusConfig.text}`}
        >
          {statusConfig.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className={`font-semibold text-sm ${node.status === "locked" ? "text-slate-500" : "text-white"}`}>
              {node.title}
            </h4>
            <span className="text-[10px] text-slate-500 flex-shrink-0">
              {node.estimatedWeeks}w
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {node.desc}
          </p>
          {node.status !== "locked" && (
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ color, background: color + "15", border: `1px solid ${color}25` }}
              >
                +{node.xp} XP
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}

function NodeDetail({
  node,
  color,
  onMarkComplete,
}: {
  node: RoadmapNode;
  color: string;
  onMarkComplete: () => void;
}) {
  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5"
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              node.status === "completed"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : node.status === "current"
                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                : "bg-white/5 text-slate-400 border-white/10"
            }`}
          >
            {node.status === "completed"
              ? "✓ Completed"
              : node.status === "current"
              ? "▶ In Progress"
              : "🔒 Locked"}
          </div>
          <span className="text-xs text-slate-500">
            {node.estimatedWeeks} weeks estimated
          </span>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full ml-auto"
            style={{ color, background: color + "15", border: `1px solid ${color}25` }}
          >
            +{node.xp} XP
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{node.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{node.desc}</p>
      </div>

      {/* Skills */}
      <div>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3">
          Skills you'll learn
        </p>
        <div className="flex flex-wrap gap-2">
          {node.skills.map((skill) => (
            <span
              key={skill}
              className="text-xs px-3 py-1.5 rounded-full border font-medium"
              style={{
                color,
                background: color + "10",
                border: `1px solid ${color}25`,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3">
          Recommended resources
        </p>
        <div className="flex flex-col gap-2">
          {node.resources.map((resource, i) => (
            <div
              key={resource}
              className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 px-4 py-2.5"
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                style={{ background: color + "20", color }}
              >
                {i + 1}
              </span>
              <span className="text-sm text-slate-300">{resource}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action */}
      {node.status === "current" && (
        <motion.button
          onClick={onMarkComplete}
          className="w-full rounded-xl py-3 text-sm font-semibold text-black"
          style={{ background: color }}
          whileHover={{ scale: 1.02, boxShadow: `0 8px 30px ${color}40` }}
          whileTap={{ scale: 0.97 }}
        >
          Mark as Complete ✓
        </motion.button>
      )}
      {node.status === "locked" && (
        <div className="rounded-xl border border-white/8 bg-white/3 py-3 text-sm text-slate-500 text-center">
          🔒 Complete previous steps to unlock
        </div>
      )}
      {node.status === "completed" && (
        <div
          className="rounded-xl py-3 text-sm font-medium text-center"
          style={{
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.2)",
            color: "#4ade80",
          }}
        >
          ✓ Completed — great work!
        </div>
      )}
    </motion.div>
  );
}

export default function RoadmapPage() {
  const { user } = useAuth();
  const [selectedPath, setSelectedPath] = useState<RoadmapCategory>("fullstack");
  const [completedNodes, setCompletedNodes] = useState<Record<string, string[]>>({});
  const [selectedNode, setSelectedNode] = useState<string>("fs1");

  // Read progress from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cf_roadmap_progress");
      if (saved) {
        try {
          setCompletedNodes(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const currentPath = PATHS.find((p) => p.id === selectedPath)!;

  // Compute dynamic nodes status
  const getDynamicNodes = (path: RoadmapPath): RoadmapNode[] => {
    const completedList = completedNodes[path.id] || [];
    let foundCurrent = false;

    return path.nodes.map((node) => {
      let status: NodeStatus = "locked";
      if (completedList.includes(node.id)) {
        status = "completed";
      } else if (!foundCurrent) {
        status = "current";
        foundCurrent = true;
      }
      return { ...node, status };
    });
  };

  const dynamicNodes = getDynamicNodes(currentPath);
  const currentNode = dynamicNodes.find((n) => n.id === selectedNode) ?? dynamicNodes[0];

  // Reset selected node when path changes to the first active/current node
  useEffect(() => {
    const firstCurrent = dynamicNodes.find((n) => n.status === "current") ?? dynamicNodes.find((n) => n.status === "completed") ?? dynamicNodes[0];
    setSelectedNode(firstCurrent.id);
  }, [selectedPath, completedNodes]);

  // Progress calculation
  const completedCount = dynamicNodes.filter((n) => n.status === "completed").length;
  const totalCount = dynamicNodes.length;
  const progress = Math.round((completedCount / totalCount) * 100);
  const totalXP = dynamicNodes
    .filter((n) => n.status === "completed")
    .reduce((sum, n) => sum + n.xp, 0);

  // Handlers
  const handleMarkComplete = () => {
    const pathCompleted = completedNodes[currentPath.id] || [];
    if (!pathCompleted.includes(currentNode.id)) {
      const updated = {
        ...completedNodes,
        [currentPath.id]: [...pathCompleted, currentNode.id],
      };
      setCompletedNodes(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("cf_roadmap_progress", JSON.stringify(updated));
      }
    }
  };

  const handleResetProgress = () => {
    const updated = {
      ...completedNodes,
      [currentPath.id]: [],
    };
    setCompletedNodes(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("cf_roadmap_progress", JSON.stringify(updated));
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="flex flex-col h-screen overflow-hidden">

        {/* ── Top bar ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-cyan-400 text-sm hover:underline">
              ← Home
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">Career Roadmap</span>
              <span className="text-[10px] border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 rounded-full px-2 py-0.5">
                Interactive
              </span>
            </div>
          </div>

          {/* XP + progress */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                XP Earned
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: currentPath.color }}
              >
                {totalXP}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: currentPath.color }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs text-slate-400">{progress}%</span>
            </div>

            <motion.button
              onClick={handleResetProgress}
              disabled={completedCount === 0}
              className="rounded-xl border border-red-500/25 bg-red-500/5 hover:bg-red-500/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-400 disabled:opacity-30 disabled:pointer-events-none transition"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Reset Path
            </motion.button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* ── Path selector sidebar ──────────────────────────────────────── */}
          <div className="w-56 border-r border-white/5 flex flex-col flex-shrink-0 overflow-y-auto">
            <div className="p-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3">
                Career Paths
              </p>
              {PATHS.map((path) => {
                const dynamicPathNodes = getDynamicNodes(path);
                const done = dynamicPathNodes.filter((n) => n.status === "completed").length;
                return (
                  <motion.button
                    key={path.id}
                    onClick={() => setSelectedPath(path.id)}
                    className={`w-full text-left rounded-xl p-3 mb-1.5 border transition ${
                      selectedPath === path.id
                        ? "bg-white/5"
                        : "border-transparent hover:bg-white/3"
                    }`}
                    style={
                      selectedPath === path.id
                        ? { borderColor: path.color + "33" }
                        : {}
                    }
                    whileHover={{ x: 3 }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base">{path.icon}</span>
                      <span className="text-xs font-medium text-white truncate">
                        {path.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(done / path.nodes.length) * 100}%`,
                            background: path.color,
                          }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-500">
                        {done}/{path.nodes.length}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ── Node list ──────────────────────────────────────────────────── */}
          <div className="w-80 border-r border-white/5 flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{currentPath.icon}</span>
                <h2 className="font-bold text-white text-sm">
                  {currentPath.title}
                </h2>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentPath.desc}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {dynamicNodes.map((node, i) => (
                <div key={node.id} className="relative">
                  {/* Connector line */}
                  {i < dynamicNodes.length - 1 && (
                    <div
                      className="absolute left-7 top-full w-px h-2 z-10"
                      style={{
                        background:
                          node.status === "completed"
                            ? currentPath.color + "60"
                            : "rgba(255,255,255,0.08)",
                      }}
                    />
                  )}
                  <NodeCard
                    node={node}
                    isSelected={selectedNode === node.id}
                    onClick={() => {
                      if (node.status !== "locked") setSelectedNode(node.id);
                    }}
                    color={currentPath.color}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Node detail ─────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <NodeDetail
                key={currentNode.id}
                node={currentNode}
                color={currentPath.color}
                onMarkComplete={handleMarkComplete}
              />
            </AnimatePresence>
          </div>

        </div>
      </div>
    </main>
  );
}