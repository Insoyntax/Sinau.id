import { Play, Pause, Music2, Users, Share2 } from "lucide-react";

// Mini drone SVGs untuk participant avatars
function MiniDroneCharged({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="40" cy="47" rx="20" ry="16" fill="#312e81" />
      <rect x="28" y="22" width="24" height="22" rx="6" fill="#3730a3" />
      <rect x="31" y="27" width="18" height="9" rx="3" fill="#4f46e5" opacity="0.8" />
      <circle cx="37" cy="31" r="2.5" fill="#a78bfa" /><circle cx="47" cy="31" r="2.5" fill="#a78bfa" />
      <rect x="12" y="42" width="14" height="6" rx="3" fill="#3730a3" />
      <rect x="54" y="42" width="14" height="6" rx="3" fill="#3730a3" />
      <ellipse cx="12" cy="39" rx="9" ry="2" fill="#6d28d9" opacity="0.6" />
      <ellipse cx="68" cy="39" rx="9" ry="2" fill="#6d28d9" opacity="0.6" />
    </svg>
  );
}

function MiniDroneMaster({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="40" cy="47" rx="20" ry="16" fill="#581c87" />
      <rect x="28" y="22" width="24" height="22" rx="6" fill="#6b21a8" />
      <rect x="31" y="27" width="18" height="9" rx="3" fill="#ec4899" opacity="0.7" />
      <circle cx="37" cy="31" r="2.5" fill="#f472b6" /><circle cx="47" cy="31" r="2.5" fill="#f472b6" />
      <path d="M32 22 L36 18 L40 21 L44 18 L48 22" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
      <rect x="12" y="42" width="14" height="6" rx="3" fill="#6b21a8" />
      <rect x="54" y="42" width="14" height="6" rx="3" fill="#6b21a8" />
      <ellipse cx="12" cy="39" rx="9" ry="2" fill="#7c3aed" opacity="0.7" />
      <ellipse cx="68" cy="39" rx="9" ry="2" fill="#7c3aed" opacity="0.7" />
    </svg>
  );
}

const participants = [
  { Drone: MiniDroneCharged, label: "kamu" },
  { Drone: MiniDroneMaster, label: "rani.dev" },
];

export function FocusSession() {
  return (
    <section id="cara-kerja" className="relative py-24 border-t border-border">
      <div className="absolute inset-0 bg-aurora opacity-25 pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-primary">04 · Focus Session</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
            Sesi fokus terpandu, <span className="text-gradient">tanpa distraksi</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pemicu satu klik dari kalender, pemutar audio Flow State internal,
            dan Co-op Sessions yang menyinkronkan timer dengan teman belajarmu.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Timer tersinkron antar peserta",
              "Avatar semua peserta tampil berdampingan",
              "Audio lo-fi / ambient bawaan",
              "Kunci layar mode kedap suara",
            ].map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="mt-1 size-1.5 rounded-full bg-primary shadow-glow" />
                <span className="text-muted-foreground">{f}</span>
              </li>
            ))}
          </ul>
          <button className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow">
            <Share2 className="size-4" /> Bagikan kode sesi
          </button>
        </div>

        {/* Mock focus window */}
        <div className="relative">
          <div className="glass rounded-3xl p-8 shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono">SESSION · #X92K-7P</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="size-3.5" /> <span className="font-mono">2</span>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="font-mono text-6xl md:text-7xl tracking-tight text-gradient">
                24:36
              </div>
              <div className="mt-2 text-xs text-muted-foreground font-mono uppercase tracking-widest">
                Fokus · Integral & Diferensial
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button className="size-12 rounded-full bg-primary grid place-items-center text-primary-foreground shadow-glow">
                <Pause className="size-5" />
              </button>
              <button className="size-10 rounded-full border border-border grid place-items-center">
                <Play className="size-4" />
              </button>
            </div>

            <div className="mt-8 flex items-center justify-between rounded-xl bg-muted/40 p-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/15 grid place-items-center text-primary">
                  <Music2 className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">Lo-fi Nebula Drift</div>
                  <div className="text-[10px] text-muted-foreground font-mono">FLOW STATE · 02:14</div>
                </div>
              </div>
              <div className="h-6 flex items-end gap-0.5">
                {[3, 5, 8, 4, 6, 9, 5, 7].map((h, i) => (
                  <span key={i} className="w-1 bg-primary rounded-sm animate-pulse-glow"
                    style={{ height: `${h * 3}px`, animationDelay: `${i * 0.12}s` }} />
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-8">
              {participants.map(({ Drone, label }, i) => (
                <div key={label} className="text-center">
                  <Drone
                    className="w-16 mx-auto animate-float"
                    // @ts-ignore — style is valid on SVG elements
                  />
                  <div className="text-[10px] font-mono text-muted-foreground mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
