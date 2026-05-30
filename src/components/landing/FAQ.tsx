import { Plus } from "lucide-react";

const items = [
  {
    q: "Apakah Sinau.id gratis?",
    a: "Ya, semua fitur inti gratis untuk pelajar. Fitur premium opsional akan hadir di kemudian hari.",
  },
  {
    q: "Apa itu Core-Drone?",
    a: "Cyber-Avatar berupa entitas mekanik yang menemani belajarmu. Diisi daya lewat sesi fokus dan berkembang seiring XP-mu.",
  },
  {
    q: "Bisakah belajar bersama teman?",
    a: "Bisa. Co-op Focus Sessions menyinkronkan timer dan menampilkan avatar semua peserta dalam satu layar.",
  },
  {
    q: "Apakah datanya aman?",
    a: "Semua progres dienkripsi dan terikat ke akunmu. Kamu bisa mengekspor atau menghapusnya kapan saja.",
  },
  {
    q: "Tersedia mode terang dan gelap?",
    a: "Tentu. Tema Ethereal Indigo hadir dalam dua mode agar nyaman dipakai siang maupun malam.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 border-t border-border">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-primary">FAQ</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
            Pertanyaan yang sering ditanyakan
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {items.map((it) => (
            <details key={it.q} className="group glass rounded-2xl p-5 shadow-card">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="font-medium">{it.q}</span>
                <Plus className="size-4 text-primary transition-transform group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
