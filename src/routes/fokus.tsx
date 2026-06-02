import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, Play, Pause, RotateCcw, Check, Settings, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { AppHeader } from "@/components/app/AppHeader";
import { logUserActivity } from "@/lib/activity-logger";
import petStage1 from "@/assets/pet-stage1.svg";
import petStage2 from "@/assets/pet-stage2.svg";
import petStage3 from "@/assets/pet-stage3.svg";
import { useFocusStore } from "@/hooks/use-focus-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import * as SliderPrimitive from "@radix-ui/react-slider";
import YouTube, { type YouTubePlayer } from "react-youtube";

export const Route = createFileRoute("/fokus")({
  head: () => ({ meta: [{ title: "Fokus — Sinau.id" }] }),
  component: FokusPage,
});

const PET: Record<string, string> = { stage1: petStage1, stage2: petStage2, stage3: petStage3 };
const DURATIONS = [15, 25, 45, 60];

function FokusPage() {
  const { session, profile, loading } = useRequireAuth();
  const {
    duration, remaining, running, youtubeUrl, audioVolume, selectedTaskTitle, selectedTaskId, pauseCount,
    setDuration, setRemaining, setRunning, setYoutubeUrl, setAudioVolume, setSelectedTask, resetTimer, incrementPauseCount
  } = useFocusStore();

  const [saving, setSaving] = useState(false);
  const [tasks, setTasks] = useState<{id: string, title: string}[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  
  const playerRef = useRef<YouTubePlayer>(null);
  
  // Settings local state
  const [tempYoutubeUrl, setTempYoutubeUrl] = useState(youtubeUrl);
  const [tempTaskId, setTempTaskId] = useState(selectedTaskId || "");
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Fix BUG-PENTING-04: Use ref to avoid stale closure in setInterval
  const onCompleteRef = useRef<() => Promise<void>>();


  useEffect(() => {
    if (session?.user) {
      supabase.from("tasks").select("id,title").neq("status", "selesai").then(({ data }) => {
        if (data) setTasks(data);
      });
    }
  }, [session?.user]);

  useEffect(() => {
    if (!running) setRemaining(duration * 60);
  }, [duration, running, setRemaining]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  // Handle YouTube Play/Pause via playerRef (Fix BUG-PENTING-09)
  useEffect(() => {
    if (playerRef.current) {
      if (running) playerRef.current.playVideo();
      else playerRef.current.pauseVideo();
    }
  }, [running]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          if (onCompleteRef.current) onCompleteRef.current();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
    event.target.setVolume(audioVolume);
  };

  const onComplete = async () => {
    if (!session?.user) return;
    setSaving(true);
    const xp = duration * 2;
    const { error } = await supabase.from("study_sessions").insert({
      user_id: session.user.id,
      subject: selectedTaskTitle || "Belajar Umum",
      duration_minutes: duration,
      xp_earned: xp,
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success(`Sesi selesai! +${xp} XP 🎉`);
      logUserActivity("focus_completed", { duration_minutes: duration, subject: selectedTaskTitle || "Belajar Umum", xp, pause_count: pauseCount });
      resetTimer(); // Reset pause count for next session
    }
  };

  const finishEarly = async () => {
    if (!session?.user) return;
    const elapsed = Math.max(1, Math.round((duration * 60 - remaining) / 60));
    setRunning(false);
    setSaving(true);
    const xp = elapsed * 2;
    const { error } = await supabase.from("study_sessions").insert({
      user_id: session.user.id,
      subject: selectedTaskTitle || "Belajar Umum",
      duration_minutes: elapsed,
      xp_earned: xp,
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success(`Tersimpan: ${elapsed} menit · +${xp} XP`);
      logUserActivity("focus_completed", { duration_minutes: elapsed, subject: selectedTaskTitle || "Belajar Umum", finished_early: true, xp, pause_count: pauseCount });
      resetTimer();
    }
  };

  const saveSettings = () => {
    setYoutubeUrl(tempYoutubeUrl);
    const tk = tasks.find(t => t.id === tempTaskId);
    if (tk) {
      setSelectedTask(tk.id, tk.title);
    } else {
      setSelectedTask(null, "Belajar Umum");
    }
    setModalOpen(false);
    toast.success("Pengaturan sesi disimpan");
  };

  if (loading || !profile) {
    return <div className="min-h-screen grid place-items-center bg-background"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  }

  const pct = ((duration * 60 - remaining) / (duration * 60)) * 100;
  const mins = Math.floor(remaining / 60).toString().padStart(2, "0");
  const secs = (remaining % 60).toString().padStart(2, "0");
  const petImg = PET[profile.pet_choice ?? "stage1"];

  const R = 130;
  const C = 2 * Math.PI * R;

  const getYoutubeVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  const videoId = getYoutubeVideoId(youtubeUrl);

  return (
    <div className="min-h-screen bg-background transition-all duration-700">
      {/* Hidden YouTube Audio Player using react-youtube */}
      {videoId && (
        <div className="hidden">
          <YouTube 
            videoId={videoId}
            opts={{
              playerVars: {
                autoplay: running ? 1 : 0,
                controls: 0,
                loop: 1,
                playlist: videoId
              }
            }}
            onReady={onPlayerReady}
          />
        </div>
      )}

      {/* Immersive Distraction Free Header Hide */}
      {!running && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <AppHeader />
        </div>
      )}
      
      <main className={`mx-auto max-w-3xl px-4 py-8 transition-all duration-700 ${running ? "mt-12 scale-105" : ""}`}>
        {!running && (
          <div className="mb-6 text-center animate-in fade-in duration-500">
            <h1 className="text-2xl font-semibold tracking-tight">Sesi Fokus</h1>
            <p className="text-sm text-muted-foreground mt-1">Siapkan sesi belajarmu tanpa gangguan.</p>
          </div>
        )}

        {running && selectedTaskTitle && (
          <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-xs text-primary/80 font-medium tracking-widest uppercase mb-2">Fokus Saat Ini</p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{selectedTaskTitle}</h2>
          </div>
        )}

        <div className="glass rounded-3xl p-8 shadow-card text-center bg-aurora relative overflow-hidden">
          <div className="relative mx-auto" style={{ width: 320, height: 320 }}>
            <svg viewBox="0 0 320 320" className="absolute inset-0 -rotate-90">
              <circle cx="160" cy="160" r={R} stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/40" />
              <circle
                cx="160" cy="160" r={R}
                stroke="url(#g)" strokeWidth="8" fill="none" strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C - (pct / 100) * C}
                className="transition-all duration-1000 ease-linear"
                style={{ filter: "drop-shadow(0 0 12px oklch(0.65 0.25 290 / 0.6))" }}
              />
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="oklch(0.55 0.22 280)" />
                  <stop offset="100%" stopColor="oklch(0.62 0.24 305)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div>
                <img src={petImg} alt="Pet" className={`mx-auto size-24 object-contain ${running ? "animate-pulse-glow" : "animate-float"}`} />
                <div className="font-mono text-5xl font-semibold mt-2 tabular-nums">{mins}:{secs}</div>
              </div>
            </div>
          </div>

          {!running && (
            <div className="mt-6 flex justify-center gap-2 animate-in fade-in duration-500">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  disabled={running}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition disabled:opacity-50 ${
                    duration === d ? "bg-primary text-primary-foreground border-primary shadow-glow" : "border-border hover:border-primary/60 bg-background/50"
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-center items-center gap-3">
            {!running ? (
              <button
                onClick={() => setRunning(true)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 hover:scale-105 transition-all duration-300"
              >
                <Play className="size-4 fill-current" /> Mulai Fokus
              </button>
            ) : (
              <button
                onClick={() => {
                  setRunning(false);
                  incrementPauseCount();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-background/80 backdrop-blur px-8 py-3.5 text-sm font-semibold border border-border hover:bg-muted hover:scale-105 transition-all duration-300"
              >
                <Pause className="size-4 fill-current" /> Jeda
              </button>
            )}
            
            <button
              onClick={resetTimer}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-full px-4 py-3.5 text-sm border border-border bg-background/50 hover:bg-muted transition disabled:opacity-50"
            >
              <RotateCcw className="size-4" />
            </button>

            {!running && (
              <>
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                  <DialogTrigger asChild>
                    <button
                      onClick={() => {
                        setTempYoutubeUrl(youtubeUrl);
                        setTempTaskId(selectedTaskId || "");
                      }}
                      className="inline-flex items-center gap-2 rounded-full px-4 py-3.5 text-sm border border-border bg-background/50 hover:bg-muted transition text-muted-foreground hover:text-foreground"
                    >
                      <Settings className="size-4" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-zinc-950/95 backdrop-blur-xl border-border/40 sm:max-w-md shadow-2xl rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Pengaturan Sesi Fokus</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Tugas yang Dikerjakan</label>
                        <select 
                          value={tempTaskId}
                          onChange={(e) => setTempTaskId(e.target.value)}
                          className="w-full rounded-xl border border-border/50 bg-zinc-900/50 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-foreground"
                        >
                          <option value="">Belajar Umum (Tanpa Tugas)</option>
                          {tasks.map(t => (
                            <option key={t.id} value={t.id}>{t.title}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Audio Latar (YouTube URL)</label>
                        <input 
                          type="url"
                          value={tempYoutubeUrl}
                          onChange={(e) => setTempYoutubeUrl(e.target.value)}
                          placeholder="Contoh: https://youtu.be/jfKfPfyJRdk"
                          className="w-full rounded-xl border border-border/50 bg-zinc-900/50 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-foreground placeholder:text-muted-foreground/50"
                        />
                        <p className="text-xs text-muted-foreground">Audio akan diputar otomatis secara berulang saat timer berjalan.</p>
                      </div>
                    </div>
                    <DialogFooter>
                      <button 
                        onClick={saveSettings}
                        className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition-all"
                      >
                        Simpan Pengaturan
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Quick-Access Volume Control */}
                <HoverCard openDelay={0} closeDelay={300}>
                  <HoverCardTrigger asChild>
                    <button
                      className="inline-flex items-center gap-2 rounded-full px-4 py-3.5 text-sm border border-border bg-background/50 hover:bg-muted transition text-muted-foreground hover:text-foreground"
                    >
                      <Volume2 className="size-4" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent 
                    side="top" 
                    sideOffset={8}
                    avoidCollisions={true}
                    className="w-auto p-4 glass bg-zinc-950/95 border border-border/50 backdrop-blur-xl shadow-2xl rounded-2xl h-40 flex justify-center items-center"
                  >
                    <SliderPrimitive.Root
                      className="relative flex h-full touch-none select-none flex-col items-center"
                      value={[audioVolume]}
                      max={100}
                      step={1}
                      orientation="vertical"
                      onValueChange={(val) => {
                        setAudioVolume(val[0]);
                        if (playerRef.current) {
                          playerRef.current.setVolume(val[0]);
                        }
                      }}
                    >
                      <SliderPrimitive.Track className="relative w-2 h-full grow overflow-hidden rounded-full bg-primary/20">
                        <SliderPrimitive.Range className="absolute w-full bg-primary bottom-0" />
                      </SliderPrimitive.Track>
                      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50" />
                    </SliderPrimitive.Root>
                  </HoverCardContent>
                </HoverCard>
              </>
            )}

            {(running || remaining < duration * 60) && (
              <button
                onClick={finishEarly}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-sm border border-primary/40 text-primary bg-primary/5 hover:bg-primary/10 transition disabled:opacity-50 font-medium"
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Selesaikan
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
