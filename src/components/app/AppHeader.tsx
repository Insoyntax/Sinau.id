import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles, LogOut, LayoutDashboard, Kanban, Calendar, Timer } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const tabs = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tugas", label: "Tugas", icon: Kanban },
  { to: "/jadwal", label: "Jadwal", icon: Calendar },
  { to: "/fokus", label: "Fokus", icon: Timer },
] as const;

export function AppHeader() {
  const { profile, signOut } = useAuth();
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <header className="border-b border-border/60 bg-background/70 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-violet grid place-items-center shadow-glow">
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Sinau<span className="text-gradient">.id</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Hai, <b className="text-foreground">{profile?.full_name?.split(" ")[0] ?? "..."}</b>
            </span>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted transition"
            >
              <LogOut className="size-4" /> Keluar
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto -mb-px">
          {tabs.map((t) => {
            const active = path === t.to;
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-sm border-b-2 transition whitespace-nowrap ${
                  active
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" /> {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
