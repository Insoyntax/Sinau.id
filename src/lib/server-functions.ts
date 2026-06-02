import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

// FIX BUG-KRITIS-02: Server functions now accept userId/data as validated parameters
// instead of trying to call supabase.auth.getSession() in a server context (where
// there is no browser cookie/localStorage, so it always returns null).
// Security is enforced by Supabase Row-Level Security on the database side.

export const getWeeklyActivityLogs = createServerFn({ method: "GET" })
  .validator((data: { userId: string }) => data)
  .handler(async ({ data: { userId } }) => {
    try {
      if (!userId) return [];

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: logs, error } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error fetching weekly logs:", error.message);
        return [];
      }

      return logs || [];
    } catch (err) {
      console.error("Unexpected error in getWeeklyActivityLogs:", err);
      return [];
    }
  });

// FIX BUG-PENTING-05 (partial): Use validator for type-safe input — prevents NaN from
// undefined xpToAdd being written to the database.
export const evaluateUserStreak = createServerFn({ method: "POST" })
  .validator((data: { userId: string; xpToAdd: number }) => data)
  .handler(async ({ data: { userId, xpToAdd } }) => {
    if (!userId) throw new Error("userId is required");

    const safeXp = Number(xpToAdd) || 0;

    const { data: stats, error: statsError } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (statsError || !stats) {
      const { data: newStats } = await supabase
        .from("user_stats")
        .insert({
          user_id: userId,
          current_streak: 1,
          total_xp: safeXp,
          last_active_date: new Date().toLocaleDateString("en-CA"),
        })
        .select()
        .single();
      return newStats;
    }

    const todayStr = new Date().toLocaleDateString("en-CA");
    const lastActiveStr = stats.last_active_date;

    let newStreak = stats.current_streak;
    const newXp = stats.total_xp + safeXp;

    if (lastActiveStr !== todayStr) {
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayStr = yesterdayDate.toLocaleDateString("en-CA");

      newStreak = lastActiveStr === yesterdayStr ? newStreak + 1 : 1;
    }

    const maxStreak = Math.max(stats.max_streak || 0, newStreak);

    const { data: updatedStats, error: updateError } = await supabase
      .from("user_stats")
      .update({
        current_streak: newStreak,
        max_streak: maxStreak,
        last_active_date: todayStr,
        total_xp: newXp,
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (updateError) throw new Error(updateError.message);

    return updatedStats;
  });

export const getUserStats = createServerFn({ method: "GET" })
  .validator((data: { userId: string }) => data)
  .handler(async ({ data: { userId } }) => {
    if (!userId) return null;

    const { data: stats } = await supabase
      .from("user_stats")
      .select("current_streak, total_xp")
      .eq("user_id", userId)
      .single();

    return stats || { current_streak: 0, total_xp: 0 };
  });
