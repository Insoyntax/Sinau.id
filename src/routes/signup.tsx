import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

const schema = z.object({
  full_name: z.string().trim().min(1, "Nama lengkap wajib diisi").max(100),
  username: z.string().trim().min(3, "Min. 3 karakter").max(32).regex(/^[a-zA-Z0-9_]+$/, "Hanya huruf, angka, underscore"),
  birth_date: z.string().min(1, "Tanggal lahir wajib diisi"),
  role: z.string().trim().min(1, "Role wajib diisi").max(50),
  email: z.string().trim().email("Email tidak valid").max(255),
  password: z.string().min(8, "Password min. 8 karakter").max(72),
});

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Daftar — Sinau.id" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/onboarding", replace: true });
  }, [session, navigate]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Data tidak valid");
      return;
    }
    setLoading(true);
    const { email, password, ...meta } = parsed.data;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: meta,
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Akun berhasil dibuat! Selamat memulai petualangan.");
    navigate({ to: "/onboarding", replace: true });
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-12 bg-background">
      <div className="w-full max-w-md glass rounded-2xl p-8 shadow-card">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-violet grid place-items-center shadow-glow">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">Sinau<span className="text-gradient">.id</span></span>
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Mulai petualangan belajarmu</h1>
        <p className="text-sm text-muted-foreground mt-1">Buat akun untuk membangkitkan pet kartunmu.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field label="Nama lengkap" name="full_name" placeholder="Budi Santoso" />
          <Field label="Username" name="username" placeholder="budi_belajar" />
          <Field label="Tanggal lahir" name="birth_date" type="date" />
          <Field label="Role" name="role" placeholder="Pelajar SMA / Mahasiswa / Guru / ..." />
          <Field label="Email" name="email" type="email" placeholder="you@email.com" />
          <Field label="Password" name="password" type="password" placeholder="Min. 8 karakter" />

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition disabled:opacity-60"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Daftar sekarang
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-primary hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground/90">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="mt-1.5 w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
      />
    </label>
  );
}
