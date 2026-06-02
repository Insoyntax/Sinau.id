// FIX BUG-PENTING-07: Stage 3 nextThreshold was incorrectly returning 500
// (the stage 2 threshold), showing confusing "750 / 500 XP" in the dashboard.
// Stage 3 is the max level — nextThreshold now correctly represents the current XP total.
export function getPetEvolution(totalXP: number) {
  if (totalXP < 150) {
    return {
      currentStage: 1,
      nextThreshold: 150,
      progressPercentage: Math.min(100, Math.round((totalXP / 150) * 100)),
      label: "Belajar terus untuk evolusi berikutnya.",
      stageKey: "stage1",
    };
  } else if (totalXP < 500) {
    return {
      currentStage: 2,
      nextThreshold: 500,
      progressPercentage: Math.min(100, Math.round(((totalXP - 150) / 350) * 100)),
      label: "Rekan belajarmu semakin pintar!",
      stageKey: "stage2",
    };
  } else {
    return {
      currentStage: 3,
      nextThreshold: totalXP, // Stage 3 = max level; show current XP as the cap
      progressPercentage: 100,
      label: "Bentuk evolusi maksimal! 🌟",
      stageKey: "stage3",
    };
  }
}
