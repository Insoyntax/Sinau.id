import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { AppHeader } from "@/components/app/AppHeader";
import { logUserActivity } from "@/lib/activity-logger";

import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export const Route = createFileRoute("/tugas")({
  head: () => ({ meta: [{ title: "Tugas — Sinau.id" }] }),
  component: TugasPage,
});

type Status = "rencana" | "dikerjakan" | "evaluasi" | "selesai";
type Task = { id: string; title: string; subject: string; status: Status; xp: number };

const COLUMNS: { id: Status; label: string; tone: string }[] = [
  { id: "rencana", label: "Rencana", tone: "bg-muted-foreground/40" },
  { id: "dikerjakan", label: "Sedang Dikerjakan", tone: "bg-primary" },
  { id: "evaluasi", label: "Evaluasi", tone: "bg-violet" },
  { id: "selesai", label: "Selesai", tone: "bg-emerald-400" },
];

function DraggableTask({ task, onDelete }: { task: Task; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: task,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group rounded-xl border border-border bg-card p-3 cursor-grab hover:border-primary/60 transition touch-none ${
        isDragging ? "shadow-lg scale-105" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="size-4 text-muted-foreground mt-0.5 opacity-50 group-hover:opacity-100" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{task.title}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-accent-foreground">{task.subject}</span>
            <span className="text-[10px] text-primary font-mono">+{task.xp} XP</span>
          </div>
        </div>
        <button
          onPointerDown={(e) => {
            // Prevent drag from starting when clicking delete button
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

function DroppableColumn({ id, title, tone, tasks, onDelete }: { id: string; title: string; tone: string; tasks: Task[]; onDelete: (id: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`glass rounded-2xl p-4 min-h-[300px] shadow-card transition-colors ${
        isOver ? "bg-primary/5 ring-1 ring-primary/40" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`size-2.5 rounded-full ${tone}`} />
        <p className="font-medium text-sm">{title}</p>
        <span className="ml-auto text-xs text-muted-foreground">{tasks.length}</span>
      </div>
      <div className="space-y-2">
        {tasks.map((t) => (
          <DraggableTask key={t.id} task={t} onDelete={() => onDelete(t.id)} />
        ))}
        {tasks.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-6">Kosong — drop di sini</p>
        )}
      </div>
    </div>
  );
}

function TugasPage() {
  const { session, profile, loading } = useRequireAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [adding, setAdding] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // allows clicking inside draggable without triggering drag
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    if (!session?.user) return;
    supabase
      .from("tasks")
      .select("id,title,subject,status,xp")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        else setTasks((data ?? []) as Task[]);
        setLoadingTasks(false);
      });
  }, [session?.user?.id]);

  const addTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user) return;
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get("title") ?? "").trim();
    const subject = String(fd.get("subject") ?? "").trim() || "Umum";
    if (!title) return toast.error("Judul tugas wajib");
    setAdding(true);
    const { data, error } = await supabase
      .from("tasks")
      .insert({ user_id: session.user.id, title, subject, status: "rencana", xp: 20 })
      .select("id,title,subject,status,xp")
      .single();
    setAdding(false);
    if (error) return toast.error(error.message);
    setTasks((t) => [data as Task, ...t]);
    (e.target as HTMLFormElement).reset();
  };

  const moveTask = async (id: string, status: Status) => {
    const prev = tasks;
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, status } : x)));
    const { error } = await supabase.from("tasks").update({ status }).eq("id", id);
    if (error) {
      setTasks(prev);
      toast.error(error.message);
      return;
    }
    if (status === "selesai") {
      const task = prev.find((x) => x.id === id);
      if (task) {
        toast.success(`Tugas selesai! +${task.xp} XP`);
        logUserActivity("task_completed", { task_id: task.id, subject: task.subject, title: task.title, xp: task.xp }, session!.user.id);
      }
    }
  };

  const deleteTask = async (id: string) => {
    const prev = tasks;
    setTasks((t) => t.filter((x) => x.id !== id));
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      setTasks(prev);
      toast.error(error.message);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Status;
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      moveTask(taskId, newStatus);
    }
  };

  if (loading || !profile) {
    return <div className="min-h-screen grid place-items-center bg-background"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Studio Tugas</h1>
            <p className="text-sm text-muted-foreground mt-1">Atur tugas dengan kanban. Drag kartu antar kolom.</p>
          </div>
          <form onSubmit={addTask} className="flex flex-wrap gap-2">
            <input name="title" placeholder="Judul tugas" required className="rounded-lg border border-border bg-background/50 px-3 py-2 text-sm w-56 focus:border-primary outline-none" />
            <input name="subject" placeholder="Mapel" className="rounded-lg border border-border bg-background/50 px-3 py-2 text-sm w-32 focus:border-primary outline-none" />
            <button disabled={adding} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition disabled:opacity-60">
              {adding ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} Tambah
            </button>
          </form>
        </div>

        {loadingTasks ? (
          <div className="py-12 grid place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {COLUMNS.map((col) => (
                <DroppableColumn
                  key={col.id}
                  id={col.id}
                  title={col.label}
                  tone={col.tone}
                  tasks={tasks.filter((t) => t.status === col.id)}
                  onDelete={deleteTask}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTask ? (
                <div className="rounded-xl border border-primary bg-card p-3 shadow-2xl scale-105 rotate-2 cursor-grabbing opacity-90">
                  <div className="flex items-start gap-2">
                    <GripVertical className="size-4 text-primary mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activeTask.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-accent-foreground">{activeTask.subject}</span>
                        <span className="text-[10px] text-primary font-mono">+{activeTask.xp} XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </main>
    </div>
  );
}
