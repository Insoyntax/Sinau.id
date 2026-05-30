import { FileText, Link2, BookMarked } from "lucide-react";

const columns = [
  {
    title: "Rencana",
    tone: "bg-muted-foreground/30",
    cards: [
      { t: "Riset materi UTS Fisika", tag: "Fisika", xp: 40 },
      { t: "Susun outline esai", tag: "B. Indonesia", xp: 25 },
    ],
  },
  {
    title: "Sedang Dikerjakan",
    tone: "bg-primary",
    cards: [{ t: "Latihan soal integral", tag: "Matematika", xp: 60, active: true }],
  },
  {
    title: "Evaluasi",
    tone: "bg-violet",
    cards: [{ t: "Review jawaban quiz Biologi", tag: "Biologi", xp: 30 }],
  },
  {
    title: "Selesai",
    tone: "bg-emerald-400",
    cards: [
      { t: "Baca bab 3 — Termodinamika", tag: "Fisika", xp: 50 },
      { t: "Hafalan kosakata", tag: "B. Inggris", xp: 20 },
    ],
  },
];

const vault = [
  { icon: FileText, label: "Bab 3 Termodinamika.pdf", meta: "PDF · 2.4 MB" },
  { icon: Link2, label: "Khan Academy — Integral", meta: "Tautan" },
  { icon: BookMarked, label: "Catatan kelas Bu Sri", meta: "Markdown" },
];

export function HomeworkStudio() {
  return (
    <section id="fitur" className="relative py-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-primary">02 · Homework Studio</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
            Papan kerja yang <span className="text-gradient">memuaskan</span> secara visual.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Susun misi belajar dalam empat kolom, tarik-lepas kartu seiring progres,
            dan tarik referensi dari Knowledge Vault langsung ke dalamnya.
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-[1fr_320px] gap-5">
          {/* Kanban */}
          <div className="glass rounded-2xl p-5 shadow-card overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {columns.map((col) => (
                <div key={col.title} className="rounded-xl bg-muted/40 p-3 min-h-[260px]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${col.tone}`} />
                      <h4 className="text-xs font-semibold uppercase tracking-wider">{col.title}</h4>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{col.cards.length}</span>
                  </div>
                  <div className="space-y-2">
                    {col.cards.map((c) => (
                      <div key={c.t}
                        className={`rounded-lg bg-card p-3 text-xs border border-border ${
                          "active" in c && c.active ? "ring-1 ring-primary shadow-glow" : ""
                        }`}>
                        <div className="font-medium leading-snug">{c.t}</div>
                        <div className="mt-2 flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground">{c.tag}</span>
                          <span className="font-mono text-primary">+{c.xp} XP</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vault */}
          <div className="glass rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-2">
              <BookMarked className="size-4 text-primary" />
              <h4 className="font-semibold">Knowledge Vault</h4>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Sumber daya siap tarik ke kartu tugas.</p>
            <div className="mt-4 space-y-2">
              {vault.map((v) => (
                <div key={v.label}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card/60 p-3 hover:border-primary/50 transition cursor-grab">
                  <div className="size-9 grid place-items-center rounded-lg bg-primary/15 text-primary">
                    <v.icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{v.label}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{v.meta}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg bg-gradient-to-br from-primary/15 to-violet/15 p-3 text-xs">
              <div className="font-medium">Imbalan Energi</div>
              <p className="text-muted-foreground mt-1">Setiap kartu yang Selesai memberi XP instan ke Core-Drone-mu.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
