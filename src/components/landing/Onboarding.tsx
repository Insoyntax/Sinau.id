const steps = [
  {
    n: "01",
    title: "Pilih Fokus Utama",
    desc: "Tentukan bidang yang ingin kamu kuasai — sekolah, kuliah, atau skill baru.",
  },
  {
    n: "02",
    title: "Inisiasi Cyber-Avatar",
    desc: "Nyalakan Core-Drone pertamamu dan beri nama. Dia akan menemani perjalananmu.",
  },
  {
    n: "03",
    title: "Peta Belajar Siap Pakai",
    desc: "Sistem otomatis menyiapkan satu peta belajar, tiga misi tugas, dan jadwal esok hari.",
  },
];

export function Onboarding() {
  return (
    <section className="relative py-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-primary">06 · Starter Kit</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
            Anti bingung, tidak mulai dari <span className="text-gradient">layar kosong</span>.
          </h2>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <div key={s.n} className="relative glass rounded-2xl p-6 shadow-card">
              <div className="font-mono text-5xl text-gradient">{s.n}</div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 size-6 rounded-full border border-primary/40 bg-background grid place-items-center text-primary text-xs font-mono">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
