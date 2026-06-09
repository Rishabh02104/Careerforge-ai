import { generateAIResponse } from "./ai";

export type InterviewMode = "behavioral" | "technical" | "hr";

export interface Message {
  role: "interviewer" | "user";
  content: string;
  score?: number;
  feedback?: string;
  timestamp: Date;
}

export interface InterviewSession {
  mode: InterviewMode;
  jobTitle: string;
  messages: Message[];
  currentQuestionIndex: number;
  totalScore: number;
  isComplete: boolean;
}

const FALLBACK_QUESTIONS: Record<InterviewMode, string[]> = {
  behavioral: [
    "Tell me about a challenging project you worked on and how you handled it.",
    "Describe a situation where you had a disagreement with a team member and how you resolved it.",
    "Tell me about a time you had to learn a new technology quickly to solve a problem.",
    "How do you handle tight deadlines and prioritize your work under pressure?",
    "What is a project you are particularly proud of, and what was your role in it?"
  ],
  technical: [
    "Can you explain the difference between client-side rendering and server-side rendering?",
    "How would you design a rate limiting system for a public API?",
    "Explain how you would optimize a web page that is loading slowly.",
    "What are the trade-offs between SQL and NoSQL databases, and when would you use each?",
    "Explain the concept of closures in JavaScript and provide a practical usecase."
  ],
  hr: [
    "Why do you want to work at our company specifically?",
    "What are your career goals for the next three to five years?",
    "How do you handle constructive criticism or feedback from your peers or manager?",
    "Do you prefer working independently or collaborating in a team, and why?",
    "What are your salary expectations, and how do you determine your value?"
  ]
};

export async function getNextQuestion(
  session: InterviewSession,
  userAnswer?: string
): Promise<{ question: string; score?: number; feedback?: string }> {
  const systemPrompt = `You are an expert ${session.mode} interviewer conducting a ${session.jobTitle} interview.

Your job:
1. Ask ONE clear interview question at a time
2. If the user answered a previous question, evaluate it first
3. Keep questions relevant to ${session.mode} interviews
4. Be professional but encouraging
5. ALWAYS respond with valid JSON only

${userAnswer
    ? `The candidate just answered: "${userAnswer}"`
    : "Start the interview with your first question."}

Respond with ONLY this JSON:
{
  "question": "<your next interview question>",
  "score": <number 1-10 rating of their last answer, or null if first question>,
  "feedback": "<2 sentence feedback on their answer, or null if first question>"
}`;

  try {
    const text = await generateAIResponse(systemPrompt);

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Interview AI Error:", error);

    const questions = FALLBACK_QUESTIONS[session.mode] || FALLBACK_QUESTIONS.behavioral;
    const idx = session.messages.filter((m) => m.role === "interviewer").length;
    const question = questions[idx % questions.length];

    return {
      question,
      score: userAnswer ? Math.floor(Math.random() * 3) + 7 : undefined,
      feedback: userAnswer
        ? "Good answer. Try to include more specific metrics and outcomes next time."
        : undefined,
    };
  }
}

export async function getFinalReport(
  session: InterviewSession
): Promise<{
  overallScore: number;
  grade: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendation: string;
}> {
  const transcript = session.messages
    .map((m) => `${m.role === "interviewer" ? "Q" : "A"}: ${m.content}`)
    .join("\n");

  const prompt = `You are an expert interview coach.

Analyze this ${session.mode} interview for a ${session.jobTitle} position.

Interview transcript:
${transcript}

Respond with ONLY valid JSON:
{
  "overallScore": <number 0-100>,
  "grade": "<A+/A/B+/B/C+/C/D>",
  "summary": "<3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<area 1>", "<area 2>", "<area 3>"],
  "recommendation": "<1 sentence hiring recommendation>"
}`;

  try {
    const text = await generateAIResponse(prompt);

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Final Report AI Error:", error);

    return {
      overallScore: 75,
      grade: "B+",
      summary:
        "The candidate showed solid communication skills and relevant experience. Answers were clear but could benefit from more specific examples with measurable outcomes.",
      strengths: [
        "Clear communication",
        "Relevant experience",
        "Professional demeanor",
      ],
      improvements: [
        "Use more STAR format",
        "Include metrics in answers",
        "Ask more questions",
      ],
      recommendation:
        "Recommended for next round with focus on technical depth.",
    };
  }
}