import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  id: string;
  full_name: string;
  username: string;
  birth_date: string;
  role: string;
  onboarded: boolean;
  daily_minutes: number | null;
  study_goal: string | null;
  interests: string[] | null;
  pet_choice: string | null;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // FIX BUG-KRITIS-01: Split loading into two states.
  // `loading` is only false when BOTH session AND profile are resolved.
  // This eliminates the race condition where loading=false but profile=null.
  const [sessionLoading, setSessionLoading] = useState(true);
  // Start true: covers the gap between session resolving and profile fetch completing.
  const [profileLoading, setProfileLoading] = useState(true);

  const loading = sessionLoading || profileLoading;

  // Step 1: Resolve the session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        setProfile(null);
        setProfileLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoading(false);
      // If there is no session, no profile will ever be fetched.
      if (!data.session) setProfileLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Step 2: Fetch profile only after session is known
  useEffect(() => {
    if (!session?.user) {
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    const uid = session.user.id;
    supabase.from("profiles").select("*").eq("id", uid).maybeSingle().then(({ data }) => {
      if (data) setProfile(data as Profile);
      setProfileLoading(false);
    });
  }, [session?.user?.id]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
