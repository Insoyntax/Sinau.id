import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Sparkles, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import petStage1 from "@/assets/pet-stage1.svg";
import petStage2 from "@/assets/pet-stage2.svg";
import petStage3 from "@/assets/pet-stage3.svg";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding — Sinau.id" }] }),
  component: OnboardingPage,
});

const GOALS = [
  { id: "ujian", label: "Persiapan Ujian", desc: "Fokus untuk PTS, PAS, atau UTBK" },
  { id: "harian", label: "Belajar Harian", desc: "Konsisten setiap hari" },
  { id: "skill", label: "Kembangkan Skill", desc: "Belajar topik baru di luar sekolah" },
  { id: "tugas", label: "Selesaikan Tugas", desc: "Manajemen PR & deadline" },
];

const INTERESTS = [
  "Matematika", "Fisika", "Kimia", "Biologi", "Sejarah",
  "Bahasa Inggris", "Bahasa Indonesia", "Ekonomi", "Geografi",
  "Pemrograman", "Desain", "Musik",
];

const PETS = [
  { id: "stage1", label: "Sparky", img: petStage1, desc: "Energik & ceria" },
  { id: "stage2", label: "Volt", img: petStage2, desc: "Tangkas & cerdas" },
  { id: "stage3", label: "Magnus", img: petStage3, desc: "Bijak & kuat" },
];

const DAILY_OPTS = [15, 30, 45, 60, 90];

function OnboardingPage() {
  const navigate = useNavigate();
  const { session, profile, loading } = useAuth();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [daily, setDaily] = useState(30);
  const [pet, setPet] = useState("stage1");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login", replace: true });
  }, [session, loading, navigate]);

  useEffect(() => {
    if (profile?.onboarded) navigate({ to: "/dashboard", replace: true });
  }, [profile, navigate]);

  const toggleInterest = (i: string) =>
    setInterests((prev) => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const next = () => {
    if (step === 0 && !goal) return toast.error("Pilih tujuan belajarmu");
    if (step === 1 && interests.length === 0) return toast.error("Pilih minimal 1 minat");
    setStep((s) => s + 1);
  };

  const submit = async () => {
    if (!session?.user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        study_goal: goal,
        interests,
        daily_minutes: daily,
        pet_choice: pet,
        onboarded: true,
      })
      .eq("id", session.user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Selamat datang! Pet kamu siap menemani 🎉");
    navigate({ to: "/dashboard", replace: true });
  };

  const steps = ["Tujuan", "Minat", "Target Harian", "Pilih Pet"];

  return (
    <div className="min-h-screen bg-background bg-aurora">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="flex items-center gap-2 mb-8">
          <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-violet grid place-items-center shadow-glow">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">Sinau<span className="text-gradient">.id</span></span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full transition ${i <= step ? "bg-primary" : "bg-muted"}`} />
              <p className={`mt-2 text-xs ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{label}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-8 shadow-card">
          {step === 0 && (
            <Section title="Apa tujuan belajarmu?" subtitle="Kami akan menyesuaikan pengalaman buatmu.">
              <div className="grid sm:grid-cols-2 gap-3">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`text-left rounded-xl border p-4 transition hover:border-primary/60 ${
                      goal === g.id ? "border-primary bg-primary/5 shadow-glow" : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{g.label}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{g.desc}</p>
                      </div>
                      {goal === g.id && <Check className="size-4 text-primary mt-1" />}
                    </div>
                  </button>
                ))}
              </div>
            </Section>
          )}

          {step === 1 && (
            <Section title="Apa minatmu?" subtitle="Pilih satu atau lebih. Bisa diubah nanti.">
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((i) => {
                  const active = interests.includes(i);
                  return (
                    <button
                      key={i}
                      onClick={() => toggleInterest(i)}
                      className={`px-4 py-2 rounded-full text-sm border transition ${
                        active
                          ? "bg-primary text-primary-foreground border-primary shadow-glow"
                          : "border-border hover:border-primary/60"
                      }`}
                    >
                      {i}
                    </button>
                  );
                })}
              </div>
            </Section>
          )}

          {step === 2 && (
            <Section title="Berapa menit per hari?" subtitle="Target realistis lebih baik daripada ambisius tapi gagal.">
              <div className="grid grid-cols-5 gap-3">
                {DAILY_OPTS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setDaily(m)}
                    className={`rounded-xl border p-4 text-center transition ${
                      daily === m ? "border-primary bg-primary/5 shadow-glow" : "border-border hover:border-primary/60"
                    }`}
                  >
                    <p className="text-2xl font-semibold">{m}</p>
                    <p className="text-xs text-muted-foreground">menit</p>
                  </button>
                ))}
              </div>
            </Section>
          )}

          {step === 3 && (
            <Section title="Pilih pet belajarmu" subtitle="Pet akan berevolusi seiring perkembanganmu.">
              <div className="grid sm:grid-cols-3 gap-4">
                {PETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPet(p.id)}
                    className={`rounded-2xl border p-4 transition ${
                      pet === p.id ? "border-primary bg-primary/5 shadow-glow" : "border-border hover:border-primary/60"
                    }`}
                  >
                    <div className="aspect-square grid place-items-center bg-aurora rounded-xl mb-3 overflow-hidden">
                      <img src={p.img} alt={p.label} className="size-32 object-contain animate-float" />
                    </div>
                    <p className="font-medium">{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </button>
                ))}
              </div>
            </Section>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-40 hover:bg-muted transition"
            >
              <ArrowLeft className="size-4" /> Kembali
            </button>

            {step < steps.length - 1 ? (
              <button
                onClick={next}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm shadow-glow hover:opacity-90 transition"
              >
                Lanjut <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm shadow-glow hover:opacity-90 transition disabled:opacity-60"
              >
                {saving && <Loader2 className="size-4 animate-spin" />}
                Selesai
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground mt-1 mb-6">{subtitle}</p>
      {children}
    </div>
  );
}
