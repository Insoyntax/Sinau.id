// Drone SVG components — tidak memerlukan file gambar eksternal

function DroneCharged({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="80" cy="80" r="72" fill="url(#chargedGlow)" opacity="0.2" />
      <ellipse cx="80" cy="94" rx="40" ry="32" fill="url(#chargedBody)" />
      <rect x="56" y="44" width="48" height="44" rx="10" fill="url(#chargedHead)" />
      <rect x="62" y="54" width="36" height="18" rx="5" fill="url(#chargedVisor)" />
      <circle cx="75" cy="63" r="4" fill="#a78bfa" />
      <circle cx="91" cy="63" r="4" fill="#a78bfa" />
      <circle cx="76" cy="62" r="1.5" fill="white" opacity="0.8" />
      <circle cx="92" cy="62" r="1.5" fill="white" opacity="0.8" />
      <line x1="80" y1="44" x2="80" y2="30" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="80" cy="27" r="4" fill="#818cf8" />
      <rect x="24" y="84" width="28" height="10" rx="5" fill="url(#chargedArm)" />
      <rect x="108" y="84" width="28" height="10" rx="5" fill="url(#chargedArm)" />
      <ellipse cx="24" cy="80" rx="16" ry="3.5" fill="#6d28d9" opacity="0.6" />
      <ellipse cx="136" cy="80" rx="16" ry="3.5" fill="#6d28d9" opacity="0.6" />
      <rect x="64" y="104" width="11" height="20" rx="4" fill="url(#chargedLeg)" />
      <rect x="85" y="104" width="11" height="20" rx="4" fill="url(#chargedLeg)" />
      {/* glow lines */}
      <line x1="65" y1="60" x2="62" y2="56" stroke="#818cf8" strokeWidth="1" opacity="0.5" />
      <line x1="95" y1="60" x2="98" y2="56" stroke="#818cf8" strokeWidth="1" opacity="0.5" />
      <defs>
        <radialGradient id="chargedGlow" cx="50%" cy="50%" r="50%">
          <stop stopColor="#818cf8" /><stop offset="1" stopColor="#7c3aed" />
        </radialGradient>
        <linearGradient id="chargedBody" x1="40" y1="62" x2="120" y2="126" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3730a3" /><stop offset="1" stopColor="#4c1d95" />
        </linearGradient>
        <linearGradient id="chargedHead" x1="56" y1="44" x2="104" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4338ca" /><stop offset="1" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id="chargedVisor" x1="62" y1="54" x2="98" y2="72" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" stopOpacity="0.9" /><stop offset="1" stopColor="#7c3aed" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="chargedArm" x1="24" y1="84" x2="136" y2="94" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3730a3" /><stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="chargedLeg" x1="64" y1="104" x2="96" y2="124" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3730a3" /><stop offset="1" stopColor="#312e81" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DroneSleep({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="80" cy="94" rx="40" ry="32" fill="url(#sleepBody)" />
      <rect x="56" y="44" width="48" height="44" rx="10" fill="url(#sleepHead)" />
      <rect x="62" y="54" width="36" height="18" rx="5" fill="url(#sleepVisor)" />
      {/* Tired eyes — closed */}
      <line x1="72" y1="63" x2="78" y2="63" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
      <line x1="88" y1="63" x2="94" y2="63" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
      {/* Z Z Z */}
      <text x="95" y="42" fontSize="8" fill="#94a3b8" fontFamily="monospace">z</text>
      <text x="100" y="35" fontSize="10" fill="#94a3b8" fontFamily="monospace">z</text>
      <text x="107" y="27" fontSize="12" fill="#94a3b8" fontFamily="monospace">z</text>
      <line x1="80" y1="44" x2="80" y2="30" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="80" cy="27" r="4" fill="#475569" />
      <rect x="24" y="84" width="28" height="10" rx="5" fill="#334155" />
      <rect x="108" y="84" width="28" height="10" rx="5" fill="#334155" />
      <ellipse cx="24" cy="80" rx="16" ry="3.5" fill="#334155" opacity="0.5" />
      <ellipse cx="136" cy="80" rx="16" ry="3.5" fill="#334155" opacity="0.5" />
      <rect x="64" y="104" width="11" height="20" rx="4" fill="#334155" />
      <rect x="85" y="104" width="11" height="20" rx="4" fill="#334155" />
      <defs>
        <linearGradient id="sleepBody" x1="40" y1="62" x2="120" y2="126" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e293b" /><stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="sleepHead" x1="56" y1="44" x2="104" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e293b" /><stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="sleepVisor" x1="62" y1="54" x2="98" y2="72" gradientUnits="userSpaceOnUse">
          <stop stopColor="#334155" stopOpacity="0.9" /><stop offset="1" stopColor="#1e293b" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DroneMaster({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="80" cy="80" r="72" fill="url(#masterGlow)" opacity="0.25" />
      <ellipse cx="80" cy="94" rx="40" ry="32" fill="url(#masterBody)" />
      <rect x="56" y="44" width="48" height="44" rx="10" fill="url(#masterHead)" />
      <rect x="62" y="54" width="36" height="18" rx="5" fill="url(#masterVisor)" />
      {/* Glowing eyes */}
      <circle cx="75" cy="63" r="5" fill="#f472b6" />
      <circle cx="91" cy="63" r="5" fill="#f472b6" />
      <circle cx="75" cy="63" r="2.5" fill="white" opacity="0.9" />
      <circle cx="91" cy="63" r="2.5" fill="white" opacity="0.9" />
      {/* Crown */}
      <path d="M64 44 L72 36 L80 42 L88 36 L96 44" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      <circle cx="72" cy="36" r="2.5" fill="#fbbf24" />
      <circle cx="80" cy="41" r="2.5" fill="#fbbf24" />
      <circle cx="88" cy="36" r="2.5" fill="#fbbf24" />
      {/* Wings */}
      <path d="M18 72 Q10 60 24 56 L40 84" fill="url(#wingGrad)" opacity="0.7" />
      <path d="M142 72 Q150 60 136 56 L120 84" fill="url(#wingGrad)" opacity="0.7" />
      <rect x="24" y="84" width="28" height="10" rx="5" fill="url(#masterArm)" />
      <rect x="108" y="84" width="28" height="10" rx="5" fill="url(#masterArm)" />
      <ellipse cx="24" cy="80" rx="16" ry="3.5" fill="#7c3aed" opacity="0.8" />
      <ellipse cx="136" cy="80" rx="16" ry="3.5" fill="#7c3aed" opacity="0.8" />
      <rect x="64" y="104" width="11" height="20" rx="4" fill="url(#masterLeg)" />
      <rect x="85" y="104" width="11" height="20" rx="4" fill="url(#masterLeg)" />
      {/* Medals */}
      <circle cx="80" cy="112" r="5" fill="#f59e0b" />
      <circle cx="80" cy="112" r="3" fill="#fbbf24" />
      <defs>
        <radialGradient id="masterGlow" cx="50%" cy="50%" r="50%">
          <stop stopColor="#f472b6" /><stop offset="1" stopColor="#7c3aed" />
        </radialGradient>
        <linearGradient id="masterBody" x1="40" y1="62" x2="120" y2="126" gradientUnits="userSpaceOnUse">
          <stop stopColor="#581c87" /><stop offset="1" stopColor="#4c1d95" />
        </linearGradient>
        <linearGradient id="masterHead" x1="56" y1="44" x2="104" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6b21a8" /><stop offset="1" stopColor="#3b0764" />
        </linearGradient>
        <linearGradient id="masterVisor" x1="62" y1="54" x2="98" y2="72" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ec4899" stopOpacity="0.9" /><stop offset="1" stopColor="#a21caf" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="masterArm" x1="24" y1="84" x2="136" y2="94" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6b21a8" /><stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="masterLeg" x1="64" y1="104" x2="96" y2="124" gradientUnits="userSpaceOnUse">
          <stop stopColor="#581c87" /><stop offset="1" stopColor="#4c1d95" />
        </linearGradient>
        <linearGradient id="wingGrad" x1="18" y1="56" x2="40" y2="84" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a855f7" stopOpacity="0.6" /><stop offset="1" stopColor="#7c3aed" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const states = [
  {
    drone: DroneCharged,
    title: "Charged",
    level: "Apprentice · Lvl 12",
    battery: 92,
    desc: "Saat kamu produktif, Core-Drone memancarkan cahaya optik terang.",
    tone: "from-primary to-violet",
  },
  {
    drone: DroneSleep,
    title: "Sleep Mode",
    level: "Idle",
    battery: 14,
    desc: "Sering menunda tugas? Avatar masuk mode tidur dan meredup.",
    tone: "from-muted-foreground to-muted-foreground",
  },
  {
    drone: DroneMaster,
    title: "Master Chassis",
    level: "Master · Lvl 50",
    battery: 100,
    desc: "Buka pemutakhiran sayap penyeimbang & sasis aerodinamis.",
    tone: "from-violet to-primary",
  },
];

export function AvatarShowcase() {
  return (
    <section id="avatar" className="relative py-24">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-primary">01 · Cyber-Avatar</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
            Rekan belajar yang <span className="text-gradient">hidup</span> di sudut layarmu.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Core-Drone tidak butuh makan — ia butuh diisi daya lewat Sesi Fokus.
            Kumpulkan XP untuk membuka pemutakhiran suku cadang dari Apprentice hingga Master.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {states.map((s, i) => (
            <div key={s.title}
              className="glass rounded-2xl p-6 shadow-card hover:translate-y-[-4px] transition group">
              <div className="relative h-56 grid place-items-center">
                <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-2xl opacity-60 group-hover:opacity-100 transition" />
                <s.drone
                  className={`relative w-44 drop-shadow-[0_20px_40px_rgba(120,80,255,0.4)] ${i !== 1 ? "animate-float" : ""}`}
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{s.level}</p>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{s.battery}%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${s.tone}`} style={{ width: `${s.battery}%` }} />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
