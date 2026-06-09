import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateAIResponse(prompt: string, timeoutMs: number = 12000): Promise<string> {
  const apiCall = (async () => {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });
    return completion.choices[0]?.message?.content || "";
  })();

  const timeoutPromise = new Promise<string>((_, reject) =>
    setTimeout(() => reject(new Error("AI response timeout")), timeoutMs)
  );

  return Promise.race([apiCall, timeoutPromise]);
}