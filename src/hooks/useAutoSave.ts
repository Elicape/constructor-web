import { useEffect, useRef } from "react";
import { useProjectStore } from "../store/projectStore";
import { loadConfig, saveConfig } from "../utils/fileSystem";

const isTauri = typeof window !== "undefined" && "__TAURI__" in window;

export function useAutoSave(interval = 30000): void {
  const project = useProjectStore((s) => s.project);
  const saveToStorage = useProjectStore((s) => s.saveToStorage);
  const lastSaved = useRef<string>("");

  useEffect(() => {
    if (!project || interval === 0) return;

    const id = setInterval(async () => {
      const current = JSON.stringify(project.sections);
      if (current !== lastSaved.current) {
        saveToStorage();
        lastSaved.current = current;
        if (isTauri) {
          const cfg = loadConfig();
          if (cfg.lastSavedPath) {
            try {
              const { writeTextFile } = await import("@tauri-apps/plugin-fs");
              await writeTextFile(cfg.lastSavedPath, JSON.stringify(project, null, 2));
            } catch {}
          }
        }
      }
    }, interval);

    return () => clearInterval(id);
  }, [project, interval, saveToStorage]);
}
