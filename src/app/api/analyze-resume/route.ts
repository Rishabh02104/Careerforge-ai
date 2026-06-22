import { NextResponse } from "next/server";
import * as path from "path";
import * as mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { generateAIResponse } from "@/services/ai";
import { ResumeAnalysis } from "@/services/resumeAnalyzer";

// ── Setup PDF Worker for Server Context ──────────────────────────────────────
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.mjs",
  import.meta.url
).toString();

// ── Extract Text from Buffer based on Extension ──────────────────────────────
async function extractTextFromBuffer(buffer: Buffer, fileName: string): Promise<string> {
  const ext = fileName.split(".").pop()?.toLowerCase();

  if (ext === "txt") {
    const text = buffer.toString("utf-8");
    return text.trim().length < 50 ? "SCANNED_PDF_OR_EMPTY" : text;
  }

  if (ext === "pdf") {
    return await extractTextFromPDFBuffer(buffer);
  }

  if (ext === "docx" || ext === "doc") {
    return await extractTextFromDOCXBuffer(buffer);
  }

  // Fallback as text
  const text = buffer.toString("utf-8");
  return text.trim().length < 50 ? "SCANNED_PDF_OR_EMPTY" : text;
}

// ── PDF Text Extraction ──────────────────────────────────────────────────────
async function extractTextFromPDFBuffer(buffer: Buffer): Promise<string> {
  try {
    const typedArray = new Uint8Array(buffer);
    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ");
      fullText += pageText + "\n";
    }

    const cleaned = fullText
      .replace(/\s+/g, " ")
      .replace(/[^\x20-\x7E\n]/g, " ")
      .trim();

    return cleaned.length < 50 ? "SCANNED_PDF_OR_EMPTY" : cleaned;
  } catch (err) {
    console.error("PDF parse error:", err);
    return "SCANNED_PDF_OR_EMPTY";
  }
}

// ── DOCX Text Extraction ─────────────────────────────────────────────────────
async function extractTextFromDOCXBuffer(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value.trim();
    return text.length < 50 ? "SCANNED_PDF_OR_EMPTY" : text;
  } catch (err) {
    console.error("DOCX parse error:", err);
    return "SCANNED_PDF_OR_EMPTY";
  }
}

// ── Analyze Resume with Groq on Server ───────────────────────────────────────
async function analyzeResumeTextServer(resumeText: string): Promise<ResumeAnalysis> {
  if (resumeText.length < 100 || resumeText.startsWith("Resume file:")) {
    return getFallbackAnalysis();
  }

  try {
    const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer.

Analyze this resume and respond ONLY with a valid JSON object. No explanation, no markdown, no backticks. Just raw JSON.

Resume text:
"""
${resumeText.slice(0, 4000)}
"""

Respond with exactly this JSON structure:
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "keywordsScore": <number 0-100>,
  "formattingScore": <number 0-100>,
  "experienceScore": <number 0-100>,
  "strengths": [<3-4 short strings>],
  "improvements": [<3-4 short strings>],
  "missingKeywords": [<5-6 important missing keywords>],
  "suggestedKeywords": [<5-6 keywords to add>],
  "summary": "<2 sentence summary of the resume>",
  "jobTitleMatch": "<most likely job title this resume targets>"
}`;

    const text = await generateAIResponse(prompt);
    
    try {
      // Find the JSON block using a regex to ignore any surrounding conversational text or markdown codeblocks
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON object found in response");
      }
      
      const parsed = JSON.parse(jsonMatch[0].trim());
      
      // Map properties with robust fallbacks and type-safety
      const overallScore = Number(parsed.overallScore) || 75;
      const atsScore = Number(parsed.atsScore) || overallScore;
      const keywordsScore = Number(parsed.keywordsScore) || overallScore;
      const formattingScore = Number(parsed.formattingScore) || overallScore;
      const experienceScore = Number(parsed.experienceScore) || overallScore;
      
      const strengths = Array.isArray(parsed.strengths) && parsed.strengths.length > 0
        ? parsed.strengths.map(String)
        : ["Good structural layout", "Clean readability and structure"];
        
      const improvements = Array.isArray(parsed.improvements) && parsed.improvements.length > 0
        ? parsed.improvements.map(String)
        : ["Add more quantifiable achievements", "Tailor keywords to match targeted roles"];
        
      const missingKeywords = Array.isArray(parsed.missingKeywords)
        ? parsed.missingKeywords.map(String)
        : [];
        
      const suggestedKeywords = Array.isArray(parsed.suggestedKeywords)
        ? parsed.suggestedKeywords.map(String)
        : [];
        
      const summary = typeof parsed.summary === "string" && parsed.summary
        ? parsed.summary
        : "Resume analyzed successfully with standard structural checks.";
        
      const jobTitleMatch = typeof parsed.jobTitleMatch === "string" && parsed.jobTitleMatch
        ? parsed.jobTitleMatch
        : "Professional";

      return {
        overallScore,
        atsScore,
        keywordsScore,
        formattingScore,
        experienceScore,
        strengths,
        improvements,
        missingKeywords,
        suggestedKeywords,
        summary,
        jobTitleMatch
      };
    } catch (parseError) {
      console.error("JSON parsing/mapping failed:", parseError, "Raw output:", text);
      return getFallbackAnalysis();
    }
  } catch (err) {
    console.error("Resume analysis error:", err);
    return getFallbackAnalysis();
  }
}

function getFallbackAnalysis(): ResumeAnalysis {
  return {
    overallScore: 0,
    atsScore: 0,
    keywordsScore: 0,
    formattingScore: 0,
    experienceScore: 0,
    strengths: [],
    improvements: [
      "Could not parse resume — please try a .txt or .docx format",
      "Ensure your resume has selectable text (not a scanned image)",
    ],
    missingKeywords: [],
    suggestedKeywords: [],
    summary:
      "Resume could not be analyzed. Please upload a text-based PDF, DOCX, or TXT file.",
    jobTitleMatch: "Unknown",
  };
}

// ── POST Request Handler ─────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let resumeText = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      resumeText = await extractTextFromBuffer(buffer, file.name);
      if (resumeText === "SCANNED_PDF_OR_EMPTY") {
        return NextResponse.json({ 
          error: "This looks like a scanned PDF or empty document. Please paste your resume text.", 
          code: "SCANNED_PDF_OR_EMPTY" 
        }, { status: 422 });
      }
    } else if (contentType.includes("application/json")) {
      const body = await request.json();
      resumeText = body.text || "";
      if (resumeText.trim().length < 50) {
        return NextResponse.json({ error: "Resume text must be at least 50 characters" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
    }

    const result = await analyzeResumeTextServer(resumeText);
    if (result.overallScore === 0) {
      return NextResponse.json({ error: "Analysis failed. Could not parse text structure." }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("API Error in resume analysis:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
