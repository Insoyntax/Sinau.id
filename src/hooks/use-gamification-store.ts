import { create } from "zustand";

interface GamificationState {
  currentStreak: number;
  totalXP: number;
  setStats: (streak: number, xp: number) => void;
  addXP: (xp: number) => void;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  currentStreak: 0,
  totalXP: 0,
  setStats: (currentStreak, totalXP) => set({ currentStreak, totalXP }),
  addXP: (xp) => set((state) => ({ totalXP: state.totalXP + xp })),
}));
