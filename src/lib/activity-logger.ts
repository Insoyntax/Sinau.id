import { supabase } from "@/integrations/supabase/client";
import { evaluateUserStreak } from "./server-functions";
import { useGamificationStore } from "@/hooks/use-gamification-store";

/**
 * Logs a user activity event securely to the Supabase database.
 * 
 * @param eventType - The type of event (e.g., 'task_completed', 'focus_completed')
 * @param metadata - Additional contextual data as a JSON object
 */
export const logUserActivity = async (eventType: string, metadata: Record<string, any> = {}) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { error } = await supabase.from("activity_logs").insert({
      user_id: session.user.id,
      event_type: eventType,
      metadata,
    });

    if (error) {
      console.error("[ActivityLogger] Failed to insert log:", error.message);
    }

    const xp = metadata.xp || 0;
    if (xp > 0 || eventType === "task_completed" || eventType === "focus_completed") {
      useGamificationStore.getState().addXP(xp);
      
      evaluateUserStreak({ data: { xpToAdd: xp } })
        .then((stats) => {
          if (stats) {
            useGamificationStore.getState().setStats(stats.current_streak, stats.total_xp);
          }
        })
        .catch((err) => console.error("[Gamification] Streak eval failed", err));
    }
  } catch (err) {
    console.error("[ActivityLogger] Exception during logging:", err);
  }
};
