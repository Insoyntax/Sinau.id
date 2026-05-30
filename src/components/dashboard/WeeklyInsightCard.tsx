import { Lightbulb, Loader2, AlertCircle, Sparkles, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getWeeklyActivityLogs } from "@/lib/server-functions";
import { calculatePrimeTime, calculateFocusEfficiency } from "@/lib/analytics/insightEngine";
import { useAuth } from "@/hooks/use-auth";

export function WeeklyInsightCard() {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const { data: logs, isLoading, isError } = useQuery({
    queryKey: ['activity_logs', userId],
    queryFn: () => getWeeklyActivityLogs(),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-5 shadow-card border border-primary/30 h-[100px] flex items-center justify-center animate-pulse">
        <Loader2 className="size-5 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass rounded-2xl p-5 shadow-card border border-destructive/30 flex gap-4 items-center bg-destructive/5">
        <AlertCircle className="size-5 text-destructive shrink-0" />
        <p className="text-sm text-foreground">
          Gagal memuat insight. Coba muat ulang halaman.
        </p>
      </div>
    );
  }

  const primeTime = logs ? calculatePrimeTime(logs) : null;
  const focusEfficiency = logs ? calculateFocusEfficiency(logs) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Prime Time Card */}
      {(!primeTime || primeTime.type === 'empty') ? (
        <div className="glass rounded-2xl p-5 shadow-card border border-border/50 relative overflow-hidden flex gap-4 items-start">
          <div className="rounded-xl bg-muted p-2.5 text-muted-foreground shrink-0 shadow-inner">
            <Sparkles className="size-5 opacity-60" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground mb-1">
              Data Belum Cukup
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Selesaikan tugas atau sesi fokus pertamamu minggu ini untuk membuka wawasan belajarmu.
            </p>
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-5 shadow-card border border-primary/30 relative overflow-hidden group h-full">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
          <div className="relative flex gap-4 items-start h-full">
            <div className="rounded-xl bg-primary/20 p-2.5 text-primary shrink-0 shadow-inner">
              <Lightbulb className="size-5 animate-pulse-glow" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground mb-1 flex items-center gap-2">
                Prime Time
                <span className="text-[9px] uppercase tracking-wider font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded">Personalized</span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">{primeTime.title}</strong> {primeTime.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Focus Efficiency Card */}
      {(!focusEfficiency || focusEfficiency.type === 'empty') ? (
        <div className="glass rounded-2xl p-5 shadow-card border border-border/50 relative overflow-hidden flex gap-4 items-start">
          <div className="rounded-xl bg-muted p-2.5 text-muted-foreground shrink-0 shadow-inner">
            <Target className="size-5 opacity-60" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground mb-1">
              Fokus Belum Terukur
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Mulai sesi fokus pertamamu minggu ini untuk mengukur efisiensi belajarmu.
            </p>
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-5 shadow-card border border-violet/30 relative overflow-hidden group h-full">
          <div className="absolute -inset-4 bg-gradient-to-r from-violet/10 via-fuchsia/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
          <div className="relative flex gap-4 items-start h-full">
            <div className="rounded-xl bg-violet-500/20 p-2.5 text-violet-500 shrink-0 shadow-inner">
              <Target className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground mb-1 flex items-center gap-2">
                Efisiensi Fokus
                <span className="text-[9px] uppercase tracking-wider font-bold bg-violet-500/20 text-violet-500 px-1.5 py-0.5 rounded">Baru</span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">{focusEfficiency.title}</strong> {focusEfficiency.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
