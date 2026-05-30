import { Link } from "@tanstack/react-router";
import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const links = [
  { href: "#fitur", label: "Fitur" },
  { href: "#avatar", label: "Avatar" },
  { href: "#cara-kerja", label: "Cara Kerja" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <nav className="glass rounded-2xl px-4 py-3 flex items-center justify-between shadow-card">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-violet grid place-items-center shadow-glow">
                <Sparkles className="size-4 text-primary-foreground" />
              </div>
            </div>
            <span className="font-semibold tracking-tight">
              Sinau<span className="text-gradient">.id</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a key={l.href} href={l.href}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Ganti tema"
              className="size-9 grid place-items-center rounded-lg border border-border hover:bg-muted transition-colors"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Link to="/login"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium hover:text-primary transition">
              Masuk
            </Link>
            <Link to="/signup"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition">
              Mulai Sinau
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
