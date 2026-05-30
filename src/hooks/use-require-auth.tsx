import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export function useRequireAuth() {
  const navigate = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    if (!auth.loading && !auth.session) navigate({ to: "/login", replace: true });
  }, [auth.loading, auth.session, navigate]);
  useEffect(() => {
    if (auth.profile && !auth.profile.onboarded) navigate({ to: "/onboarding", replace: true });
  }, [auth.profile, navigate]);
  return auth;
}
