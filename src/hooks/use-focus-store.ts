import { create } from "zustand";

interface FocusState {
  duration: number;
  remaining: number;
  running: boolean;
  youtubeUrl: string;
  audioVolume: number;
  selectedTaskId: string | null;
  selectedTaskTitle: string;
  pauseCount: number;
  
  setDuration: (duration: number) => void;
  incrementPauseCount: () => void;
  setRemaining: (remaining: number | ((prev: number) => number)) => void;
  setRunning: (running: boolean) => void;
  setYoutubeUrl: (url: string) => void;
  setAudioVolume: (volume: number) => void;
  setSelectedTask: (id: string | null, title: string) => void;
  resetTimer: () => void;
}

export const useFocusStore = create<FocusState>((set) => ({
  duration: 25,
  remaining: 25 * 60,
  running: false,
  youtubeUrl: "",
  audioVolume: 50,
  selectedTaskId: null,
  selectedTaskTitle: "Belajar Umum",
  pauseCount: 0,

  setDuration: (duration) => set({ duration, remaining: duration * 60 }),
  incrementPauseCount: () => set((state) => ({ pauseCount: state.pauseCount + 1 })),
  setRemaining: (remaining) => set((state) => ({ 
    remaining: typeof remaining === "function" ? remaining(state.remaining) : remaining 
  })),
  setRunning: (running) => set({ running }),
  setYoutubeUrl: (youtubeUrl) => set({ youtubeUrl }),
  setAudioVolume: (audioVolume) => set({ audioVolume }),
  setSelectedTask: (selectedTaskId, selectedTaskTitle) => set({ selectedTaskId, selectedTaskTitle }),
  resetTimer: () => set((state) => ({ running: false, remaining: state.duration * 60, pauseCount: 0 })),
}));
