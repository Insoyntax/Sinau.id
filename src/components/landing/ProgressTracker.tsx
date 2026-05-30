import { Trophy, Flame, Target, Sparkles } from "lucide-react";

const bars = [3, 5, 4, 7, 6, 8, 9];
const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const max = 10;

const badges = [
  { icon: Flame, label: "7 Hari Beruntun", desc: "Streak konsisten 1 minggu" },
  { icon: Target, label: "Sniper Tugas", desc: "20 tugas selesai tanpa terlambat" },
  { icon: Trophy, label: "Master Fokus", desc: "100 jam fokus terkumpul" },
  { icon: Sparkles, label: "Kolektor XP", desc: "Mencapai 10.000 XP" },
];

export function ProgressTracker() {
  return (
    <section className="relative py-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-primary">05 · Progress Tracker</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
            Lihat sejauh mana kamu <span className="text-gradient">berkembang</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Bagan fluktuasi jam belajar harian dan papan lencana untuk merayakan
            setiap pencapaian baru.
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-[1.3fr_1fr] gap-5">
          <div className="glass rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Minggu ini</div>
                <div className="font-mono text-3xl mt-1">42<span className="text-muted-foreground text-base">j 12m</span></div>
              </div>
              <div className="text-xs text-emerald-400 font-mono">+18% vs minggu lalu</div>
            </div>
            <div className="mt-8 flex items-end justify-between gap-2 h-48">
              {bars.map((b, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full rounded-t-md bg-gradient-to-t from-primary to-violet shadow-glow"
                    style={{ height: `${(b / max) * 100}%` }} />
                  <div className="text-[10px] font-mono text-muted-foreground">{days[i]}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {badges.map((b) => (
              <div key={b.label} className="glass rounded-2xl p-4 shadow-card">
                <div className="size-10 grid place-items-center rounded-xl bg-gradient-to-br from-primary to-violet shadow-glow">
                  <b.icon className="size-5 text-primary-foreground" />
                </div>
                <div className="mt-3 text-sm font-semibold">{b.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
