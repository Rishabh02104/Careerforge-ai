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