import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export const getWeeklyActivityLogs = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        return []; // Fail silently to empty array if unauthorized
      }
      
      const userId = session.user.id;
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

export const evaluateUserStreak = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const { xpToAdd } = ctx.data;
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      throw new Error("Unauthorized");
    }
    
    const userId = session.user.id;
    
    const { data: stats, error: statsError } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (statsError || !stats) {
      const { data: newStats } = await supabase
        .from("user_stats")
        .insert({ user_id: userId, current_streak: 1, total_xp: xpToAdd, last_active_date: new Date().toLocaleDateString("en-CA") })
        .select().single();
      return newStats;
    }

    const todayDate = new Date();
    const todayStr = todayDate.toLocaleDateString("en-CA");
    const lastActiveStr = stats.last_active_date;
    
    let newStreak = stats.current_streak;
    const newXp = stats.total_xp + xpToAdd;

    if (lastActiveStr !== todayStr) {
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayStr = yesterdayDate.toLocaleDateString("en-CA");

      if (lastActiveStr === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    const maxStreak = Math.max(stats.max_streak || 0, newStreak);

    const { data: updatedStats, error: updateError } = await supabase
      .from("user_stats")
      .update({
        current_streak: newStreak,
        max_streak: maxStreak,
        last_active_date: todayStr,
        total_xp: newXp
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    return updatedStats;
  });

export const getUserStats = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      return null;
    }
    
    const { data: stats } = await supabase
      .from("user_stats")
      .select("current_streak, total_xp")
      .eq("user_id", session.user.id)
      .single();
      
    return stats || { current_streak: 0, total_xp: 0 };
  });
