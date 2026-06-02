import { supabase } from "@/integrations/supabase/client";
import { evaluateUserStreak } from "./server-functions";
import { useGamificationStore } from "@/hooks/use-gamification-store";

/**
 * Logs a user activity event securely to the Supabase database,
 * then calls the streak evaluator on the server.
 *
 * FIX BUG-PENTING-06: Removed the optimistic `addXP()` call here.
 * XP state is now set ONLY by the server response from evaluateUserStreak,
 * preventing the "XP flicker" where the store shows +XP optimistically,
 * then gets overwritten by stale server data, then rises again.
 */
export const logUserActivity = async (
  eventType: string,
  metadata: Record<string, unknown> = {},
  userId: string
) => {
  try {
    if (!userId) return;

    const { error } = await supabase.from("activity_logs").insert({
      user_id: userId,
      event_type: eventType,
      metadata,
    });

    if (error) {
      console.error("[ActivityLogger] Failed to insert log:", error.message);
    }

    const xp = typeof metadata.xp === "number" ? metadata.xp : 0;
    if (xp > 0 || eventType === "task_completed" || eventType === "focus_completed") {
      evaluateUserStreak({ data: { userId, xpToAdd: xp } })
        .then((stats) => {
          if (stats) {
            // Single source of truth: only update from server response
            useGamificationStore.getState().setStats(stats.current_streak, stats.total_xp);
          }
        })
        .catch((err) => console.error("[Gamification] Streak eval failed", err));
    }
  } catch (err) {
    console.error("[ActivityLogger] Exception during logging:", err);
  }
};
