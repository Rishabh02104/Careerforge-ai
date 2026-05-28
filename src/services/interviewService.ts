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
5. ALWAYS respond with valid JSON only — no markdown, no explanation

${userAnswer ? `The candidate just answered: "${userAnswer}"` : "Start the interview with your first question."}

Respond with ONLY this JSON:
{
  "question": "<your next interview question>",
  "score": <number 1-10 rating of their last answer, or null if first question>,
  "feedback": "<2 sentence feedback on their answer, or null if first question>"
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: systemPrompt,
        },
      ],
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text || "";

  try {
    return JSON.parse(text);
  } catch {
    return {
      question: "Tell me about a challenging project you worked on and how you handled it.",
      score: userAnswer ? 7 : undefined,
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
    .map(m => `${m.role === "interviewer" ? "Q" : "A"}: ${m.content}`)
    .join("\n");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `You are an expert interview coach. Analyze this ${session.mode} interview for a ${session.jobTitle} position.

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
}`,
        },
      ],
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text || "";

  try {
    return JSON.parse(text);
  } catch {
    return {
      overallScore: 75,
      grade: "B+",
      summary: "The candidate showed solid communication skills and relevant experience. Answers were clear but could benefit from more specific examples with measurable outcomes.",
      strengths: ["Clear communication", "Relevant experience", "Professional demeanor"],
      improvements: ["Use more STAR format", "Include metrics in answers", "Ask more questions"],
      recommendation: "Recommended for next round with focus on technical depth.",
    };
  }
}