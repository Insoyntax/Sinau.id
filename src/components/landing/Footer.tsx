import { ArrowRight, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative pt-24 pb-12 border-t border-border">
      <div className="absolute inset-0 bg-aurora opacity-30 pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="glass rounded-3xl p-10 md:p-16 text-center shadow-card overflow-hidden relative">
          <div className="absolute inset-0 bg-aurora opacity-50" />
          <div className="relative">
            <h3 className="text-3xl md:text-5xl font-semibold tracking-tight">
              Siap mengisi daya{" "}
              <span className="text-gradient">Core-Drone</span> pertamamu?
            </h3>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Gabung dengan ribuan pelajar yang menjadikan belajar sebuah petualangan harian.
            </p>
            <a href="#mulai"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow">
              Mulai Petualangan Gratis <ArrowRight className="size-4" />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-md bg-gradient-to-br from-primary to-violet grid place-items-center">
              <Sparkles className="size-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Sinau<span className="text-gradient">.id</span></span>
            <span className="ml-3 font-mono text-xs">© 2026</span>
          </div>
          <div className="flex items-center gap-5 text-xs">
            <a href="#" className="hover:text-foreground">Privasi</a>
            <a href="#" className="hover:text-foreground">Syarat</a>
            <a href="#" className="hover:text-foreground">Kontak</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
