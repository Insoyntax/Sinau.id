import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { AppHeader } from "@/components/app/AppHeader";

export const Route = createFileRoute("/jadwal")({
  head: () => ({ meta: [{ title: "Jadwal — Sinau.id" }] }),
  component: JadwalPage,
});

type Block = { id: string; day_of_week: number; start_hour: number; span_hours: number; title: string };

const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const HOURS = Array.from({ length: 19 }, (_, i) => i + 6); // 06..24
const ROW_H = 36;

function JadwalPage() {
  const { session, profile, loading } = useRequireAuth();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loadingBlocks, setLoadingBlocks] = useState(true);

  useEffect(() => {
    if (!session?.user) return;
    supabase.from("schedule_blocks").select("*").then(({ data, error }) => {
      if (error) toast.error(error.message);
      else setBlocks((data ?? []) as Block[]);
      setLoadingBlocks(false);
    });
  }, [session?.user?.id]);

  const addBlock = async (day: number, hour: number) => {
    if (!session?.user) return;
    const title = window.prompt("Judul blok belajar:");
    if (!title?.trim()) return;
    const spanStr = window.prompt("Durasi (jam, 1-6):", "1");
    const span = Math.max(1, Math.min(6, Number(spanStr) || 1));
    const { data, error } = await supabase
      .from("schedule_blocks")
      .insert({ user_id: session.user.id, day_of_week: day, start_hour: hour, span_hours: span, title: title.trim() })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setBlocks((b) => [...b, data as Block]);
  };

  const deleteBlock = async (id: string) => {
    const prev = blocks;
    setBlocks((b) => b.filter((x) => x.id !== id));
    const { error } = await supabase.from("schedule_blocks").delete().eq("id", id);
    if (error) {
      setBlocks(prev);
      toast.error(error.message);
    }
  };

  if (loading || !profile) {
    return <div className="min-h-screen grid place-items-center bg-background"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  }

  const isOccupied = (day: number, hour: number) =>
    blocks.some((b) => b.day_of_week === day && hour >= b.start_hour && hour < b.start_hour + b.span_hours);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Jadwal Mingguan</h1>
          <p className="text-sm text-muted-foreground mt-1">Klik sel kosong untuk membuat blok belajar. Klik blok untuk menghapus.</p>
        </div>

        {loadingBlocks ? (
          <div className="py-12 grid place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>
        ) : (
          <div className="glass rounded-2xl p-4 shadow-card overflow-x-auto">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[48px_repeat(7,1fr)] gap-px text-xs">
                <div />
                {DAYS.map((d) => (
                  <div key={d} className="text-center font-medium pb-2 text-muted-foreground">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-[48px_repeat(7,1fr)] gap-px relative">
                {HOURS.map((h) => (
                  <Fragment key={`row-${h}`}>
                    <div className="text-[10px] text-muted-foreground pr-2 text-right pt-1" style={{ height: ROW_H }}>
                      {String(h).padStart(2, "0")}:00
                    </div>
                    {DAYS.map((_, d) => (
                      <button
                        key={`${d}-${h}`}
                        onClick={() => !isOccupied(d, h) && addBlock(d, h)}
                        className={`border border-border/40 rounded transition ${
                          isOccupied(d, h) ? "cursor-default" : "hover:bg-primary/10 hover:border-primary/40"
                        }`}
                        style={{ height: ROW_H }}
                      />
                    ))}
                  </Fragment>
                ))}

                {/* Render blocks absolutely positioned */}
                {blocks.map((b) => {
                  const topRowIdx = b.start_hour - HOURS[0];
                  if (topRowIdx < 0) return null;
                  // grid cols: 48px + 7 equal. Compute via percentages relative to inner container.
                  const left = `calc(48px + ${b.day_of_week} * ((100% - 48px) / 7))`;
                  const width = `calc((100% - 48px) / 7)`;
                  const top = topRowIdx * ROW_H + topRowIdx; // include 1px gaps
                  const height = b.span_hours * ROW_H + (b.span_hours - 1);
                  return (
                    <button
                      key={b.id}
                      onClick={() => {
                        if (confirm(`Hapus "${b.title}"?`)) deleteBlock(b.id);
                      }}
                      className="absolute rounded-lg bg-gradient-to-br from-primary to-violet text-primary-foreground text-xs font-medium px-2 py-1 text-left shadow-glow hover:scale-[1.02] transition"
                      style={{ left, width, top, height }}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate">{b.title}</span>
                        <Trash2 className="size-3 opacity-70 shrink-0" />
                      </div>
                      <p className="text-[10px] opacity-80">{String(b.start_hour).padStart(2, "0")}:00 · {b.span_hours}j</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
