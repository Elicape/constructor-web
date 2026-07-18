import { create } from "zustand";

const LS_KEY = "webcraft_tutorial_mode";

function loadTutorialMode(): boolean {
  try {
    return localStorage.getItem(LS_KEY) === "true";
  } catch {
    return false;
  }
}

interface AppStore {
  isTutorialMode: boolean;
  setTutorialMode: (v: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isTutorialMode: loadTutorialMode(),
  setTutorialMode: (v: boolean) => {
    try {
      localStorage.setItem(LS_KEY, v ? "true" : "false");
    } catch {}
    set({ isTutorialMode: v });
  },
}));
