# 🚀 CareerForge.AI

CareerForge.AI is an all-in-one, AI-powered career preparation platform designed to help job seekers optimize their resumes, practice live coding challenges, simulate realistic interviews, and trace tailored career roadmaps.

Built as a premium portfolio project with a state-of-the-art dark-mode aesthetic, CareerForge leverages next-generation design patterns, fluid micro-animations, and AI models to elevate your job-hunting process.

---

## ✨ Features

### 1. 📄 AI Resume Analyzer
* **Instant ATS Scoring:** Upload your resume (`.pdf`, `.doc`, `.docx`) to get an instant rating across formatting, keywords, experience, and overall structure.
* **Scan Detection & Fallback:** Automatically detects scanned or text-empty PDFs and prompts with a clean copy-paste text fallback so you can analyze your content regardless of format.
* **Dashboard Sync:** Automatically synchronizes and saves your latest ATS score metrics locally to your user dashboard.

### 2. 💬 AI Mock Interviews
* **Interactive Evaluation:** Engage in realistic conversation with an AI career coach that asks questions, listens to responses, and evaluates answers.
* **Mode Selection:** Supports tailored modes: **Behavioral**, **Technical**, and **HR Prep**.
* **Robust Timeout Protection:** Uses a 12-second API fallback wrapper. If the network drops or API keys are missing, the interview shifts gracefully to local mock questions and report cards without hanging.

### 3. 💻 Coding Practice (DSA)
* **Live Code Editor:** Solve actual data structures and algorithms practice problems directly in the browser.
* **AI Hints on Demand:** Get step-by-step guidance from the AI assistant when stuck on optimization or logic errors.
* **Topic Categorization:** Practice across 10 problems spanning Stack, Arrays, Trees, Linked Lists, Design, and Dynamic Programming.

### 4. 🧠 HR Questions Prep
* **Experience Tiers:** Toggle between **Fresher**, **1-2 Years**, and **3+ Years** experience levels.
* **Model Answers:** Get customized advice, tips, and professional model answers tailored to your level of experience (e.g., student projects/internships vs. system design and leadership).

### 5. 🗺️ Career Roadmaps
* **Milestone Progressions:** Interactive paths for **Frontend Developer**, **Backend Developer**, **Fullstack Developer**, **DevOps Engineer**, and **Data Engineer**.
* **Unlocking Milestones:** Saves status locally. Complete nodes to unlock succeeding roadmap tiers or reset your paths to retry.

### 6. 📊 User Onboarding Dashboard
* **Dynamic Analytics:** Displays total mock interviews, resume score analytics, pending roadmap levels, and applied jobs.
* **Job Tracker Integration:** Automatically tracks application statuses whenever you click "Apply Now" on our curated jobs board.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router, static pre-rendering)
* **Styling:** TailwindCSS (Custom dark theme, grid-layouts, and fluid borders)
* **Animations:** Framer Motion (Smooth hover effects, magnetic buttons, and page transitions)
* **AI Integration:** LLMs / Claude API with custom timeout fallbacks
* **Storage:** Client-side local storage persistence for a fully personalized, serverless UX

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rishabh02104/Careerforge-ai.git
   cd careerforge-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your AI key:
   ```env
   NEXT_PUBLIC_CLAUDE_API_KEY=your_claude_api_key_here
   ```
   *(If no API key is specified, the application will automatically fall back to fully functional offline mock modes.)*

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the App:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔒 Privacy First

CareerForge.AI is designed to operate locally. All resume, interview, roadmap, and analytics data is stored directly in your browser's `localStorage`. No personal details, files, or transcript data are uploaded to external databases.
