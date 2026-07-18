import type { Project } from "../types";

const AUTOSAVE_KEY = "webcraft_autosave_v2";
const RECENT_KEY = "webcraft_recent_v2";

const isTauri = typeof window !== "undefined" && "__TAURI__" in window;

export async function saveProjectToDisk(project: Project): Promise<string | null> {
  if (isTauri) {
    try {
      const { save } = await import("@tauri-apps/plugin-dialog");
      const { writeTextFile } = await import("@tauri-apps/plugin-fs");
      const path = await save({
        filters: [{ name: "WebCraft", extensions: ["webcraft.json"] }],
        defaultPath: `${project.name.replace(/[^a-zA-Z0-9-_]/g, "_")}.webcraft.json`,
      });
      if (!path) return null;
      await writeTextFile(path, JSON.stringify(project, null, 2));
      return path;
    } catch (e) {
      console.error("Tauri save failed:", e);
      return null;
    }
  }
  try {
    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/[^a-zA-Z0-9-_]/g, "_")}.webcraft.json`;
    a.click();
    URL.revokeObjectURL(url);
    return null;
  } catch {
    return null;
  }
}

export function saveAutoSave(project: Project): void {
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(project));
  } catch {}
}

export function loadAutoSave(): Project | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    return raw ? (JSON.parse(raw) as Project) : null;
  } catch {
    return null;
  }
}

export function clearAutoSave(): void {
  localStorage.removeItem(AUTOSAVE_KEY);
}

export function addRecentProject(name: string): void {
  try {
    const recents = getRecentProjects();
    const filtered = recents.filter((r) => r.name !== name);
    filtered.unshift({
      name,
      path: `~/Documents/WebCraft/${name}.webcraft.json`,
      updatedAt: new Date().toISOString(),
    });
    localStorage.setItem(RECENT_KEY, JSON.stringify(filtered.slice(0, 10)));
  } catch {}
}

export function getRecentProjects() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]") as {
      name: string;
      path: string;
      updatedAt: string;
    }[];
  } catch {
    return [];
  }
}

export async function loadProjectFromFile(): Promise<Project | null> {
  if (isTauri) {
    try {
      const { open } = await import("@tauri-apps/plugin-dialog");
      const { readTextFile } = await import("@tauri-apps/plugin-fs");
      const selected = await open({
        filters: [{ name: "WebCraft", extensions: ["webcraft.json"] }],
        multiple: false,
      });
      if (!selected) return null;
      const path = selected as string;
      const content = await readTextFile(path);
      return JSON.parse(content) as Project;
    } catch (e) {
      console.error("Tauri open failed:", e);
      return null;
    }
  }
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".webcraft.json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      try {
        const text = await file.text();
        resolve(JSON.parse(text) as Project);
      } catch {
        resolve(null);
      }
    };
    input.click();
  });
}
