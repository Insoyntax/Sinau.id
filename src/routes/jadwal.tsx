import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { AppHeader } from "@/components/app/AppHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

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
    supabase.from("schedule_blocks").select("*").eq("user_id", session.user.id).then(({ data, error }) => {
      if (error) toast.error(error.message);
      else setBlocks((data ?? []) as Block[]);
      setLoadingBlocks(false);
    });
  }, [session?.user?.id]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: number; hour: number } | null>(null);
  const [adding, setAdding] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<Block | null>(null);

  const handleCellClick = (day: number, hour: number) => {
    if (isOccupied(day, hour)) return;
    setSelectedSlot({ day, hour });
    setAddDialogOpen(true);
  };

  const onAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user || !selectedSlot) return;
    
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") ?? "").trim();
    const spanStr = String(fd.get("span") ?? "1");
    if (!title) return;
    
    setAdding(true);
    const span = Math.max(1, Math.min(6, Number(spanStr) || 1));
    const { data, error } = await supabase
      .from("schedule_blocks")
      .insert({ user_id: session.user.id, day_of_week: selectedSlot.day, start_hour: selectedSlot.hour, span_hours: span, title })
      .select()
      .single();
    
    setAdding(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    
    setBlocks((b) => [...b, data as Block]);
    setAddDialogOpen(false);
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
                        onClick={() => handleCellClick(d, h)}
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
                        setBlockToDelete(b);
                        setDeleteDialogOpen(true);
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

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-zinc-950/95 backdrop-blur-xl border-border/40 sm:max-w-md shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Buat Blok Belajar</DialogTitle>
          </DialogHeader>
          <form onSubmit={onAddSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Judul Blok</label>
              <input 
                name="title"
                required
                placeholder="Contoh: Matematika Diskret"
                className="w-full rounded-xl border border-border/50 bg-zinc-900/50 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Durasi (jam)</label>
              <input 
                name="span"
                type="number"
                min="1"
                max="6"
                defaultValue="1"
                required
                className="w-full rounded-xl border border-border/50 bg-zinc-900/50 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-foreground"
              />
            </div>
            <DialogFooter>
              <button 
                type="button"
                onClick={() => setAddDialogOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted transition"
              >
                Batal
              </button>
              <button 
                type="submit"
                disabled={adding}
                className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition-all disabled:opacity-50 inline-flex items-center gap-2"
              >
                {adding && <Loader2 className="size-4 animate-spin" />}
                Simpan
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-zinc-950/95 backdrop-blur-xl border-border/40 sm:max-w-md shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Hapus Jadwal?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Apakah kamu yakin ingin menghapus blok belajar <strong className="text-foreground">{blockToDelete?.title}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <DialogFooter>
            <button 
              onClick={() => setDeleteDialogOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted transition"
            >
              Batal
            </button>
            <button 
              onClick={() => {
                if (blockToDelete) deleteBlock(blockToDelete.id);
                setDeleteDialogOpen(false);
              }}
              className="rounded-xl bg-destructive px-4 py-3 text-sm font-semibold text-destructive-foreground hover:opacity-90 transition-all"
            >
              Hapus
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
