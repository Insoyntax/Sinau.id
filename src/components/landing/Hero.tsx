import { ArrowRight, Play, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";

// SVG avatar drone inline — tidak memerlukan file gambar eksternal
function DroneAvatar({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Core-Drone Cyber Avatar"
    >
      {/* Body */}
      <ellipse cx="100" cy="110" rx="50" ry="40" fill="url(#bodyGrad)" />
      {/* Head */}
      <rect x="70" y="55" width="60" height="50" rx="12" fill="url(#headGrad)" />
      {/* Visor */}
      <rect x="78" y="67" width="44" height="22" rx="6" fill="url(#visorGrad)" />
      {/* Eyes */}
      <circle cx="92" cy="78" r="5" fill="#a78bfa" />
      <circle cx="108" cy="78" r="5" fill="#a78bfa" />
      <circle cx="93" cy="77" r="2" fill="white" opacity="0.7" />
      <circle cx="109" cy="77" r="2" fill="white" opacity="0.7" />
      {/* Antenna */}
      <line x1="100" y1="55" x2="100" y2="38" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="34" r="5" fill="#7c3aed" />
      <circle cx="100" cy="34" r="3" fill="#c4b5fd" />
      {/* Arms */}
      <rect x="30" y="100" width="36" height="12" rx="6" fill="url(#armGrad)" />
      <rect x="134" y="100" width="36" height="12" rx="6" fill="url(#armGrad)" />
      {/* Propellers */}
      <ellipse cx="30" cy="96" rx="20" ry="4" fill="#6d28d9" opacity="0.5" />
      <ellipse cx="170" cy="96" rx="20" ry="4" fill="#6d28d9" opacity="0.5" />
      {/* Chest panel */}
      <rect x="84" y="120" width="32" height="20" rx="4" fill="#1e1b4b" opacity="0.6" />
      <circle cx="90" cy="130" r="3" fill="#818cf8" />
      <circle cx="100" cy="130" r="3" fill="#34d399" />
      <circle cx="110" cy="130" r="3" fill="#f472b6" />
      {/* Legs */}
      <rect x="80" y="148" width="14" height="24" rx="5" fill="url(#legGrad)" />
      <rect x="106" y="148" width="14" height="24" rx="5" fill="url(#legGrad)" />
      {/* Feet */}
      <rect x="76" y="168" width="22" height="8" rx="4" fill="#4c1d95" />
      <rect x="102" y="168" width="22" height="8" rx="4" fill="#4c1d95" />
      {/* Glow ring */}
      <circle cx="100" cy="105" r="68" stroke="url(#ringGrad)" strokeWidth="1.5" fill="none" opacity="0.4" />
      <defs>
        <linearGradient id="bodyGrad" x1="50" y1="70" x2="150" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#312e81" />
          <stop offset="1" stopColor="#4c1d95" />
        </linearGradient>
        <linearGradient id="headGrad" x1="70" y1="55" x2="130" y2="105" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3730a3" />
          <stop offset="1" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id="visorGrad" x1="78" y1="67" x2="122" y2="89" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f46e5" stopOpacity="0.8" />
          <stop offset="1" stopColor="#7c3aed" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="armGrad" x1="30" y1="100" x2="170" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3730a3" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="legGrad" x1="80" y1="148" x2="120" y2="172" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3730a3" />
          <stop offset="1" stopColor="#312e81" />
        </linearGradient>
        <linearGradient id="ringGrad" x1="32" y1="37" x2="168" y2="173" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818cf8" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-70 pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs">
            <span className="size-1.5 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-muted-foreground">Ethereal Indigo Edition · v1.0</span>
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            Ruang belajar digital yang bikin kamu{" "}
            <span className="text-gradient">ketagihan fokus</span>.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl">
            Sinau.id menggabungkan manajemen tugas, kalender, dan sesi fokus terpandu
            dengan rekan belajar virtual berupa Cyber-Avatar — agar setiap menit
            belajarmu terasa seperti petualangan.
          </p>
          <div className="mt-8 flex flex-wrap gap-3" id="mulai">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow hover:translate-y-[-1px] transition"
            >
              Mulai Petualangan <ArrowRight className="size-4" />
            </Link>
            <a
              href="#cara-kerja"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 backdrop-blur px-5 py-3 text-sm font-medium hover:bg-muted transition"
            >
              <Play className="size-4" /> Lihat Demo
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {[
              { k: "12k+", v: "Pelajar aktif" },
              { k: "94%", v: "Tetap konsisten" },
              { k: "4.9", v: "Rating pengguna" },
            ].map((s) => (
              <div key={s.v} className="glass rounded-xl p-3">
                <div className="font-mono text-xl text-gradient">{s.k}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[460px] lg:h-[560px]">
          {/* orbits */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="size-[340px] md:size-[420px] rounded-full border border-primary/20" />
          </div>
          <div className="absolute inset-0 grid place-items-center">
            <div className="size-[240px] md:size-[300px] rounded-full border border-violet/30" />
          </div>
          <div className="absolute inset-0 grid place-items-center">
            <div className="size-[420px] md:size-[520px] rounded-full bg-primary/20 blur-3xl" />
          </div>

          <div className="absolute inset-0 grid place-items-center">
            <DroneAvatar className="relative z-10 w-[280px] md:w-[360px] drop-shadow-[0_30px_60px_rgba(120,80,255,0.5)] animate-float" />
          </div>

          {/* floating chips */}
          <div className="absolute top-8 right-4 glass rounded-xl px-3 py-2 text-xs animate-float [animation-delay:-2s]">
            <div className="flex items-center gap-2">
              <Zap className="size-3.5 text-primary" />
              <span className="font-mono">+250 XP</span>
            </div>
          </div>
          <div className="absolute bottom-10 left-2 glass rounded-xl px-3 py-2 text-xs animate-float [animation-delay:-4s]">
            <div className="text-muted-foreground">Battery</div>
            <div className="mt-1 h-1.5 w-24 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-[82%] bg-gradient-to-r from-primary to-violet animate-pulse-glow" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
