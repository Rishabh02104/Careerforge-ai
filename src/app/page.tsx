import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen text-white">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">

        <div className="mb-6 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm backdrop-blur">
          AI-Powered Career Platform
        </div>

        <h1 className="max-w-5xl text-5xl font-bold leading-tight md:text-7xl">
          Build Your Dream Career With{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            AI CareerForge
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-400">
          Resume analysis, AI mock interviews, coding practice,
          career roadmaps, and analytics — all in one futuristic platform.
        </p>

        <div className="mt-10 flex gap-4">
          <Button>Get Started</Button>

          <Button variant="outline">
            Live Demo
          </Button>
        </div>
      </section>
    </main>
  );
}