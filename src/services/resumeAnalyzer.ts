import * as mammoth from "mammoth";

export interface ResumeAnalysis {
  overallScore: number;
  atsScore: number;
  keywordsScore: number;
  formattingScore: number;
  experienceScore: number;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  suggestedKeywords: string[];
  summary: string;
  jobTitleMatch: string;
}

// ── Extract text from any file type ──────────────────────────────────────────
export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  // ── TXT — read directly ───────────────────────────────────────────────────
  if (ext === "txt" || file.type === "text/plain") {
    return await file.text();
  }

  // ── PDF — use pdfjs-dist ──────────────────────────────────────────────────
  if (ext === "pdf" || file.type === "application/pdf") {
    return await extractFromPDF(file);
  }

  // ── DOCX — use mammoth ────────────────────────────────────────────────────
  if (
    ext === "docx" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return await extractFromDOCX(file);
  }

  // ── DOC — fallback ────────────────────────────────────────────────────────
  if (ext === "doc" || file.type === "application/msword") {
    return await extractFromDOCX(file);
  }

  // ── Unknown — try reading as text ─────────────────────────────────────────
  try {
    return await file.text();
  } catch {
    return `Resume file: ${file.name}`;
  }
}

// ── PDF extraction using pdfjs-dist ──────────────────────────────────────────
async function extractFromPDF(file: File): Promise<string> {
  try {
    // Dynamic import to avoid SSR issues
    const pdfjsLib = await import("pdfjs-dist");

    // Set worker source — use CDN to avoid bundling issues
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);

    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

    let fullText = "";

    // Extract text from every page
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

    if (cleaned.length < 50) {
      return `Resume: ${file.name}. Could not extract sufficient text. Please try a different format.`;
    }

    return cleaned;
  } catch (err) {
    console.error("PDF extraction error:", err);
    return `Resume file: ${file.name}. PDF parsing failed — please try uploading as a .txt or .docx file.`;
  }
}

// ── DOCX extraction using mammoth ─────────────────────────────────────────────
async function extractFromDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value.trim();

    if (text.length < 50) {
      return `Resume: ${file.name}. Could not extract sufficient text.`;
    }

    return text;
  } catch (err) {
    console.error("DOCX extraction error:", err);
    return `Resume file: ${file.name}. DOCX parsing failed — please try uploading as a .txt file.`;
  }
}

// ── Analyze resume with Claude API ───────────────────────────────────────────
export async function analyzeResume(
  resumeText: string
): Promise<ResumeAnalysis> {
  // Guard — if text is too short or looks like an error message
  if (resumeText.length < 100 || resumeText.startsWith("Resume file:")) {
    return getFallbackAnalysis();
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `You are an expert ATS (Applicant Tracking System) resume analyzer.

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
}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("API error:", response.status);
      return getFallbackAnalysis();
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    // Strip any accidental markdown
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsed = JSON.parse(cleaned);
      // Validate all required fields exist
      if (
        typeof parsed.overallScore === "number" &&
        Array.isArray(parsed.strengths)
      ) {
        return parsed as ResumeAnalysis;
      }
      return getFallbackAnalysis();
    } catch {
      return getFallbackAnalysis();
    }
  } catch (err) {
    console.error("Resume analysis error:", err);
    return getFallbackAnalysis();
  }
}

// ── Fallback when extraction or API fails ─────────────────────────────────────
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