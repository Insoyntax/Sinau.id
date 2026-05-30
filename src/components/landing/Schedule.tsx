const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const hours = Array.from({ length: 19 }, (_, i) => i + 6); // 06..24
const ROW = 32;

type Block = { day: number; start: number; span: number; title: string; tone: string };
const blocks: Block[] = [
  { day: 0, start: 8, span: 2, title: "Fisika · Bab 3", tone: "from-primary to-violet" },
  { day: 1, start: 10, span: 1, title: "Quiz Bio", tone: "from-violet to-primary" },
  { day: 2, start: 14, span: 3, title: "Studio Tugas", tone: "from-primary to-violet" },
  { day: 3, start: 9, span: 2, title: "Latihan Soal", tone: "from-violet to-primary" },
  { day: 4, start: 16, span: 2, title: "Esai B.Ind", tone: "from-primary to-violet" },
  { day: 6, start: 19, span: 2, title: "Co-op Focus", tone: "from-violet to-primary" },
];

export function Schedule() {
  return (
    <section className="relative py-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-primary">03 · Interactive Schedule</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
            Petakan minggumu dalam <span className="text-gradient">format 24 jam</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Klik kotak jam untuk membuat blok belajar instan. Garis waktu bercahaya bergerak
            real-time, menjaga kamu tetap di jalur rencana.
          </p>
        </div>

        <div className="mt-12 glass rounded-2xl p-5 shadow-card overflow-x-auto">
          <div className="min-w-[640px]">
            {/* Header */}
            <div className="grid grid-cols-[48px_repeat(7,1fr)] gap-px text-xs pb-2">
              <div />
              {days.map((d) => (
                <div key={d} className="text-center font-mono text-muted-foreground">{d}</div>
              ))}
            </div>

            {/* Body: a relatively positioned wrapper with grid of cells + absolute blocks */}
            <div className="relative grid grid-cols-[48px_repeat(7,1fr)] gap-px">
              {hours.flatMap((h) => [
                <div
                  key={`h-${h}`}
                  className="text-[10px] font-mono text-muted-foreground pr-2 text-right flex items-start justify-end pt-0.5"
                  style={{ height: ROW }}
                >
                  {String(h).padStart(2, "0")}
                </div>,
                ...days.map((_, di) => (
                  <div
                    key={`c-${h}-${di}`}
                    className="bg-muted/30 hover:bg-primary/15 transition cursor-pointer border-r border-b border-border/40"
                    style={{ height: ROW }}
                  />
                )),
              ])}

              {/* Blocks overlay using grid placement */}
              {blocks.map((b, i) => (
                <div
                  key={i}
                  className={`rounded-md bg-gradient-to-br ${b.tone} text-primary-foreground text-[10px] p-1.5 shadow-glow m-0.5 overflow-hidden`}
                  style={{
                    gridColumn: `${b.day + 2} / span 1`,
                    gridRow: `${b.start - 6 + 1} / span ${b.span}`,
                  }}
                >
                  <div className="font-semibold truncate">{b.title}</div>
                  <div className="font-mono opacity-80 mt-0.5">
                    {String(b.start).padStart(2, "0")}:00
                  </div>
                </div>
              ))}

              {/* Running timeline */}
              <div className="pointer-events-none absolute left-[48px] right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent shadow-glow animate-timeline" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
