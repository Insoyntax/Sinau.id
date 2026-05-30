import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, Suspense } from "react";
import { Loader2, Flame, Trophy, Clock, Target, Plus, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AppHeader } from "@/components/app/AppHeader";
import petStage1 from "@/assets/pet-stage1.svg";
import petStage2 from "@/assets/pet-stage2.svg";
import petStage3 from "@/assets/pet-stage3.svg";
import { WeeklyInsightCard } from "@/components/dashboard/WeeklyInsightCard";
import { useGamificationStore } from "@/hooks/use-gamification-store";
import { getPetEvolution } from "@/lib/gamification/pet-evolution";
import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "@/lib/server-functions";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Sinau.id" }] }),
  component: DashboardPage,
});

type Session = {
  id: string;
  subject: string;
  duration_minutes: number;
  xp_earned: number;
  completed_at: string;
};

const PET_IMG: Record<string, string> = {
  stage1: petStage1,
  stage2: petStage2,
  stage3: petStage3,
};

function DashboardPage() {
  const navigate = useNavigate();
  const { session, profile, loading } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [adding, setAdding] = useState(false);
  const { currentStreak, totalXP, setStats } = useGamificationStore();

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['user_stats', session?.user?.id],
    queryFn: () => getUserStats(),
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (stats) {
      setStats(stats.current_streak, stats.total_xp);
    }
  }, [stats, setStats]);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login", replace: true });
  }, [session, loading, navigate]);

  useEffect(() => {
    // Hanya redirect jika profile sudah selesai dimuat DAN onboarded false
    if (!loading && profile && !profile.onboarded) navigate({ to: "/onboarding", replace: true });
  }, [profile, loading, navigate]);

  useEffect(() => {
    if (!session?.user) return;
    supabase
      .from("study_sessions")
      .select("*")
      .order("completed_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        else setSessions((data ?? []) as Session[]);
        setLoadingSessions(false);
      });
  }, [session?.user?.id]);

  const totalMinutes = sessions.reduce((s, x) => s + x.duration_minutes, 0);
  const today = new Date().toDateString();
  const todayMinutes = sessions
    .filter((s) => new Date(s.completed_at).toDateString() === today)
    .reduce((s, x) => s + x.duration_minutes, 0);
  const dailyTarget = profile?.daily_minutes ?? 30;
  const progress = Math.min(100, Math.round((todayMinutes / dailyTarget) * 100));

  const evolution = getPetEvolution(totalXP);

  const onAddSession = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user) return;
    const fd = new FormData(e.currentTarget);
    const subject = String(fd.get("subject") ?? "").trim();
    const duration = Number(fd.get("duration"));
    if (!subject || !duration || duration < 1) return toast.error("Isi subject & durasi");
    setAdding(true);
    const xp = Math.round(duration * 2);
    const { data, error } = await supabase
      .from("study_sessions")
      .insert({ user_id: session.user.id, subject, duration_minutes: duration, xp_earned: xp })
      .select()
      .single();
    setAdding(false);
    if (error) return toast.error(error.message);
    setSessions((s) => [data as Session, ...s]);
    (e.target as HTMLFormElement).reset();
    toast.success(`+${xp} XP! Pet kamu makin kuat 🌟`);
  };

  if (loading || !profile || loadingStats) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />


      <main className="mx-auto max-w-6xl px-4 py-8 grid lg:grid-cols-3 gap-6">
        {/* Pet card */}
        <section className="lg:col-span-1 glass rounded-2xl p-6 shadow-card">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Rekan belajarmu</p>
          <div className={`mt-3 aspect-square rounded-2xl grid place-items-center overflow-hidden transition-all duration-1000 ${
            evolution.currentStage === 3 ? "bg-gradient-to-br from-violet/20 via-primary/20 to-fuchsia/20" :
            evolution.currentStage === 2 ? "bg-gradient-to-br from-blue-500/10 via-primary/10 to-transparent hue-rotate-15" :
            "bg-aurora"
          }`}>
            <img 
              src={PET_IMG[evolution.stageKey]} 
              alt="Pet" 
              className={`size-48 object-contain animate-float transition-all duration-1000 ${
                evolution.currentStage === 3 ? "drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]" :
                evolution.currentStage === 2 ? "drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] hue-rotate-15" :
                ""
              }`} 
            />
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <p className="font-semibold">Stage {evolution.currentStage}</p>
              <p className="text-xs text-muted-foreground">{totalXP} / {evolution.nextThreshold} XP</p>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-violet transition-all duration-1000" style={{ width: `${evolution.progressPercentage}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {evolution.label}
            </p>
          </div>
        </section>

        {/* Stats + form + history */}
        <section className="lg:col-span-2 space-y-6">
          <Suspense fallback={<div className="h-[100px] glass animate-pulse rounded-2xl" />}>
            <WeeklyInsightCard />
          </Suspense>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat icon={<Flame className="size-4" />} label="Streak" value={`${currentStreak} hari`} />
            <Stat icon={<Clock className="size-4" />} label="Total" value={`${totalMinutes}m`} />
            <Stat icon={<Trophy className="size-4" />} label="XP" value={totalXP.toString()} />
            <Stat icon={<Target className="size-4" />} label="Hari ini" value={`${todayMinutes}/${dailyTarget}m`} />
          </div>

          {/* Daily progress */}
          <div className="glass rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="font-medium">Target hari ini</p>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <div className="mt-3 h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-violet transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Add session */}
          <form onSubmit={onAddSession} className="glass rounded-2xl p-5 shadow-card">
            <p className="font-medium mb-3">Catat sesi belajar</p>
            <div className="grid sm:grid-cols-[1fr_120px_auto] gap-3">
              <input
                name="subject"
                placeholder="Matematika, Fisika, ..."
                required
                className="rounded-lg border border-border bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              />
              <input
                name="duration"
                type="number"
                min={1}
                max={600}
                defaultValue={25}
                required
                className="rounded-lg border border-border bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
              />
              <button
                type="submit"
                disabled={adding}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition disabled:opacity-60"
              >
                {adding ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                Tambah
              </button>
            </div>
          </form>

          {/* History */}
          <div className="glass rounded-2xl p-5 shadow-card">
            <p className="font-medium mb-3">Riwayat terakhir</p>
            {loadingSessions ? (
              <div className="py-6 grid place-items-center"><Loader2 className="size-5 animate-spin text-primary" /></div>
            ) : sessions.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <BookOpen className="size-6 mx-auto mb-2 opacity-60" />
                Belum ada sesi. Mulai dari atas ya!
              </div>
            ) : (
              <ul className="divide-y divide-border/60">
                {sessions.slice(0, 10).map((s) => (
                  <li key={s.id} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{s.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(s.completed_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{s.duration_minutes}m</p>
                      <p className="text-xs text-primary">+{s.xp_earned} XP</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-4 shadow-card">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
        {icon}<span>{label}</span>
      </div>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
