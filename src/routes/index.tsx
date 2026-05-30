import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { AvatarShowcase } from "@/components/landing/AvatarShowcase";
import { HomeworkStudio } from "@/components/landing/HomeworkStudio";
import { Schedule } from "@/components/landing/Schedule";
import { FocusSession } from "@/components/landing/FocusSession";
import { ProgressTracker } from "@/components/landing/ProgressTracker";
import { Onboarding } from "@/components/landing/Onboarding";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sinau.id — Ruang Belajar Digital Interaktif & Gamifikasi" },
      {
        name: "description",
        content:
          "Sinau.id adalah ekosistem belajar digital dengan Cyber-Avatar, papan tugas Kanban, kalender 24 jam, dan sesi fokus co-op untuk membuat belajar terasa menyenangkan.",
      },
      { property: "og:title", content: "Sinau.id — Ruang Belajar Digital Interaktif" },
      {
        property: "og:description",
        content:
          "Belajar jadi petualangan: rekan virtual Core-Drone, papan tugas, fokus terpandu, dan co-op multiplayer.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />
      <main>
        <Hero />
        <AvatarShowcase />
        <HomeworkStudio />
        <Schedule />
        <FocusSession />
        <ProgressTracker />
        <Onboarding />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
