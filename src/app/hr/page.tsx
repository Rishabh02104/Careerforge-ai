"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { generateAIResponse } from "@/services/ai";

type ExpLevel = "fresher" | "mid" | "senior";

interface HRQuestion {
  id: number;
  question: string;
  category: string;
  tips: Record<ExpLevel, string>;
  modelAnswers: Record<ExpLevel, string>;
}

const HR_QUESTIONS: HRQuestion[] = [
  {
    id: 1,
    question: "Tell me about yourself.",
    category: "Introduction",
    tips: {
      fresher: "Use the Present-Past-Future formula. Focus on your degree, core projects, internships, and motivation.",
      mid: "Highlight 1-2 key accomplishments from your roles and what you want to specialize in next.",
      senior: "Focus on your overall leadership, technical architecture expertise, and major business impacts."
    },
    modelAnswers: {
      fresher: "I recently graduated with a CS degree where I specialized in web technologies. During my studies, I completed an internship at ABC Corp where I built an internal tool using React and Node.js. I also led a team of three in our senior project to build a mobile app. I'm eager to bring my learning agility and solid foundations to a full-time role here.",
      mid: "I'm a developer with 2 years of experience. In my previous role at TechCorp, I developed features that improved user registration flow, resulting in a 15% increase in conversion. I'm looking to deepen my expertise in cloud services, which is why this opportunity aligns perfectly.",
      senior: "I'm a software engineer with 5 years of experience building scalable applications. In my current role at XYZ, I led the migration of our legacy system to microservices, saving 20% in infrastructure costs and serving 100K+ daily active users. I'm excited about leading high-impact initiatives here."
    }
  },
  {
    id: 2,
    question: "What are your greatest strengths?",
    category: "Self Assessment",
    tips: {
      fresher: "Focus on learning agility, collaboration, and a strong work ethic backed by university/internship examples.",
      mid: "Talk about problem-solving, code quality, and efficiency improvements from your jobs.",
      senior: "Highlight mentorship, system design, technical roadmap planning, and communication between engineering and product."
    },
    modelAnswers: {
      fresher: "My greatest strength is my ability to learn new technologies quickly. For instance, in my final year project, we had to use GraphQL, which wasn't taught in classes. I researched, took courses, and was able to implement it within a week. I'm also very collaborative and thrive in group projects.",
      mid: "My greatest strength is my analytical problem-solving. When we had memory leak issues in our Node.js server, I systematically isolated the route using Chrome DevTools and reduced server crashes by 40%.",
      senior: "My strengths are system design and technical mentorship. I designed our real-time notification engine using WebSockets and Redis. I also mentor junior developers, helping our team ship features 25% faster with higher test coverage."
    }
  },
  {
    id: 3,
    question: "What is your greatest weakness?",
    category: "Self Assessment",
    tips: {
      fresher: "Discuss an academic skill you're working on, like speaking up in large meetings or estimating project timelines.",
      mid: "Talk about delegating, or wanting to deep dive too far into edge cases.",
      senior: "Discuss balancing product priorities with technical debt."
    },
    modelAnswers: {
      fresher: "My greatest weakness is public speaking. I used to get nervous presenting my projects. To improve, I joined a Toastmasters club in college and volunteered for project demo presentations, which has built my confidence significantly.",
      mid: "I sometimes struggle to delegate tasks, wanting to ensure everything is perfect. I've been working on this by establishing clear milestones with teammates and learning to trust their delivery style, which improved our output.",
      senior: "I sometimes get overly focused on technical perfection. I've learned to balance engineering best practices with business deadlines by working closely with product managers to deliver modular solutions that can be refactored later."
    }
  },
  {
    id: 4,
    question: "Where do you see yourself in 5 years?",
    category: "Career Goals",
    tips: {
      fresher: "Show enthusiasm to master technologies, build foundations, and grow within the company.",
      mid: "Focus on transitioning into a Senior Developer or Tech Lead role, owning major component designs.",
      senior: "Focus on engineering leadership, defining architecture roadmaps, or technical strategy decisions."
    },
    modelAnswers: {
      fresher: "In 5 years, I see myself as a seasoned engineer with deep expertise in web architecture. I want to become a core contributor to system designs and help mentor new hires. I'm drawn to this company because your engineering culture will allow me to build a strong foundation.",
      mid: "In 5 years, I aim to become a Tech Lead, owning end-to-end product architecture and driving technical decisions. I want to deepen my skills in system scalability and continue building high-performing applications.",
      senior: "In 5 years, I see myself in a Principal Engineer or engineering management role, shaping the technology roadmap, aligning technical architectures with long-term business goals, and fostering a collaborative, modern engineering organization."
    }
  },
  {
    id: 5,
    question: "Why do you want to work here?",
    category: "Motivation",
    tips: {
      fresher: "Discuss alignment with learning opportunities, company mission, and product quality.",
      mid: "Connect your specific experience (e.g. scaling apps, refactoring) to their engineering challenges.",
      senior: "Align your strategic values, architectural vision, and team leadership values with their culture."
    },
    modelAnswers: {
      fresher: "I've been following your platform's user-centric design for a year. As a fresher, I want to learn how you manage real-time updates at scale. I'm highly motivated by your culture of documentation and peer reviews, which is the perfect place to learn clean coding habits.",
      mid: "I want to work here because your team is solving complex real-time collaboration challenges. In my last role, I worked on reducing WebSocket latency, and I'm excited to bring that knowledge to your collaborative workspace products.",
      senior: "I've admired your technical blog's transparency regarding migration to distributed systems. This role perfectly aligns with my experience in scaling microservices. I'm eager to help your team navigate these structural shifts while maintaining high availability."
    }
  },
  {
    id: 6,
    question: "Why are you looking for a role?",
    category: "Motivation",
    tips: {
      fresher: "Focus on graduating and finding a growth-oriented team to start your career.",
      mid: "Stay positive. Focus on looking for a role with larger scope, ownership, or technical challenges.",
      senior: "Explain how you're looking to apply your architectural and leadership skills to a new set of high-impact scaling challenges."
    },
    modelAnswers: {
      fresher: "I recently completed my studies and am looking for my first full-time role. I want to join an active team where I can apply my JavaScript/TypeScript skills, learn from senior devs, and start contributing to real-world codebases.",
      mid: "I've learned a lot in my current role, but the product is entering a maintenance phase. I'm looking for a new opportunity where I can work on greenfield projects, take on greater ownership of features, and continue growing technically.",
      senior: "I'm looking for my next challenge where I can drive large-scale migrations and system designs. I want to apply my years of scaling microservices and mentoring teams to help a growing engineering team establish mature engineering standards."
    }
  },
  {
    id: 7,
    question: "Describe a conflict with a teammate and how you resolved it.",
    category: "Behavioral",
    tips: {
      fresher: "Use group projects, hackathons, or club activities as examples. Focus on compromise and data.",
      mid: "Focus on disagreements about code style, code review feedback, or small feature architectures.",
      senior: "Highlight conflicts regarding high-level design patterns, system scaling priorities, or cross-team dependencies."
    },
    modelAnswers: {
      fresher: "During a group project, a teammate wanted to use a complex framework we hadn't learned, while I preferred sticking to standard React to meet our deadline. I proposed we build a quick prototype of one page using both. We realized the standard React route was twice as fast to configure, so we chose that and delivered on time.",
      mid: "A colleague disagreed on whether to refactor a component before shipping. I scheduled a quick 10-minute call. We reviewed our team's tech debt guidelines and agreed to ship the feature with basic refactoring now, adding a tech-debt ticket for the next sprint.",
      senior: "A product manager and I clashed over shipping an API before adding rate limiting. I explained the security risks with data, showing how a DDoS attack could disrupt production. We compromised: we shipped on time with a simple IP rate limiter, planning a robust token bucket algorithm for the subsequent release."
    }
  },
  {
    id: 8,
    question: "How do you handle working under tight deadlines?",
    category: "Behavioral",
    tips: {
      fresher: "Discuss balancing exams, multiple assignments, or hackathon sprints.",
      mid: "Focus on task breakdown, communication with stakeholders, and prioritizing blocker items.",
      senior: "Focus on risk mitigation, scope negotiation, team velocity management, and cross-functional coordination."
    },
    modelAnswers: {
      fresher: "During finals week, I had three projects due on the same day. I broke down each project into micro-tasks and scheduled fixed blocks of study. By planning early and communicating progress with project partners, I managed to complete all three with high marks.",
      mid: "When a release date was moved up, I listing out my tasks, flagged dependencies blocking other devs, and updated our JIRA board. I worked closely with my team lead to shift non-critical bugs to the next sprint, ensuring a stable release.",
      senior: "When faced with an urgent client launch, I held a team sync to identify critical path tasks. I renegotiated the scope of secondary features with the PM, organized pair-programming sessions to solve blockers, and delivered the core application on time without team burnout."
    }
  },
  {
    id: 9,
    question: "What motivates you?",
    category: "Motivation",
    tips: {
      fresher: "Focus on the excitement of seeing your code run, solving logic puzzles, and learning new concepts.",
      mid: "Highlight shipping clean, maintainable code, solving real user bugs, and improving system efficiency.",
      senior: "Focus on business outcomes, building team capabilities, architecting highly reliable platforms, and mentoring developers."
    },
    modelAnswers: {
      fresher: "I'm motivated by the feedback loop of building. Seeing a feature I wrote compile, pass tests, and visually render on screen is incredibly satisfying. I love diving into complex algorithms and understanding how things work under the hood.",
      mid: "I'm motivated by shipping high-quality code that users interact with daily. Finding a clever way to refactor a slow database query and watching API response times drop from 800ms to 80ms is what keeps me excited every morning.",
      senior: "What motivates me is creating leverage. Building tooling or frameworks that enable a team of 15 devs to deploy safely with zero friction, and aligning architecture to solve actual commercial goals, is what drives my work."
    }
  },
  {
    id: 10,
    question: "Do you prefer working alone or in a team?",
    category: "Work Style",
    tips: {
      fresher: "Show you can do both: study independently to solve issues, but thrive in team project environments.",
      mid: "Highlight alternating between focused individual implementation (deep work) and collaborative code reviews/sprints.",
      senior: "Emphasize aligning individual developers to form a cohesive system, establishing collaboration protocols, while driving key architectures independently."
    },
    modelAnswers: {
      fresher: "I value both. For understanding new languages or writing initial code, I enjoy working alone to focus. However, I believe the best products are built in teams. I loved collaborating in group projects where we shared ideas, ran code reviews, and helped debug each other's code.",
      mid: "I prefer a hybrid style. I thrive in collaborative sessions like planning and product brainstorms, but I also need blocks of uninterrupted 'deep work' to write quality code. I think structured code reviews are the perfect bridge between the two.",
      senior: "I look at team dynamics strategically. For high-level system design, I initiate collaborative workshops to gather input. Once alignment is reached, I can operate independently on architecture specs. A team-first culture with clear ownership boundaries delivers the best engineering results."
    }
  },
  {
    id: 11,
    question: "Tell me about a time you failed.",
    category: "Behavioral",
    tips: {
      fresher: "Discuss an academic project failure or exam set-back. Focus on the lesson and recovery.",
      mid: "Discuss a bug that slipped to production or an underestimated task. Highlight responsibility and correction.",
      senior: "Discuss an architectural design that didn't scale, or a project management estimate that missed. Focus on systemic post-mortems."
    },
    modelAnswers: {
      fresher: "In a college web project, we spent too much time on styling and ran out of time to connect the backend database, resulting in a failing grade for that milestone. I learned to build a functional skeleton first before polishing UI, and applied this to all future projects.",
      mid: "I once shipped a database query that lacked indexing, slowing down our analytics page in production. I immediately owned the mistake, coordinated with the DevOps lead to rollback, added the required index, and created a linting rule to check query layouts in CI.",
      senior: "I designed a caching system using an eager loading pattern that caused memory spikes during high traffic. I organized a blameless post-mortem, refactored the system to lazy load, and updated our team's system architecture blueprints to prevent similar design flaws."
    }
  },
  {
    id: 12,
    question: "How do you prioritize multiple tasks?",
    category: "Work Style",
    tips: {
      fresher: "Talk about calendars, task lists, and communicating with professors or teammates when overloaded.",
      mid: "Talk about JIRA, dividing work into urgent/important categories, and aligning with team goals.",
      senior: "Talk about impact vs. effort matrices, stakeholder alignment, managing technical debt, and shielding the team from context switching."
    },
    modelAnswers: {
      fresher: "I keep a daily checklist and use Google Calendar to allocate time blocks. When I feel overloaded with multiple deadlines, I write them down, rank them by grade weight and deadline, and talk to teammates to ensure our workloads are shared evenly.",
      mid: "I prioritize tasks by evaluating their impact on our sprint goals and blocking status. I tackle critical bugs and PR reviews first so others aren't blocked, then focus on feature work. I communicate instantly on Slack if a task is running late.",
      senior: "I prioritize using an Eisenhower matrix, balancing product deliverables with technical stability. I allocate fixed bandwidth for tech debt, align engineering priorities directly with product managers, and focus on protecting my team from shifting scopes."
    }
  }
];

const CATEGORIES = [
  "All",
  ...Array.from(new Set(HR_QUESTIONS.map((q) => q.category))),
];

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
    return "Good attempt! Try to use the STAR format: specify a Situation, your exact Task, the Action you took, and the measurable Result. Aim to detail your direct individual contributions.";
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
  const [expLevel, setExpLevel] = useState<ExpLevel>("fresher");

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
    try {
      const fb = await getAIFeedback(selected.question, userAnswer);
      setFeedback(fb);
      setPracticed((prev) => new Set([...prev, selected.id]));
      
      // Save stats to localStorage
      if (typeof window !== "undefined") {
        const key = "cf_hr_practice_count";
        const count = parseInt(localStorage.getItem(key) || "0") + 1;
        localStorage.setItem(key, count.toString());
      }
    } catch (error) {
      console.error(error);
      setFeedback("Sorry, we had trouble connecting to the feedback API. Here's a quick tip: reflect on your direct contributions and structure your response with clear metrics.");
    } finally {
      setFeedbackLoading(false);
    }
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
            <div className="w-full h-1 bg-white/5 rounded-full mb-4 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                animate={{
                  width: `${(practiced.size / HR_QUESTIONS.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Experience level selector */}
            <div className="mb-4">
              <label className="text-[9px] text-slate-500 uppercase tracking-wider mb-1.5 block">
                Experience Level
              </label>
              <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                {(["fresher", "mid", "senior"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setExpLevel(level)}
                    className={`rounded-lg py-1 text-[10px] font-semibold uppercase tracking-wider transition ${
                      expLevel === level
                        ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {level === "fresher" ? "Fresher" : level === "mid" ? "1-2 Yrs" : "3+ Yrs"}
                  </button>
                ))}
              </div>
            </div>

            {/* Category filters */}
            <div className="flex gap-1 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-2 py-0.5 text-[9px] border transition ${
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
                💡 Tip ({expLevel === "fresher" ? "Fresher" : expLevel === "mid" ? "1-2 Years Experience" : "3+ Years Experience"})
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selected.tips[expLevel]}
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
                    📝 Model Answer ({expLevel === "fresher" ? "Fresher" : expLevel === "mid" ? "1-2 Years Experience" : "3+ Years Experience"})
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed font-light">
                    {selected.modelAnswers[expLevel]}
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
                  <p className="text-sm text-slate-300 leading-relaxed font-light">
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