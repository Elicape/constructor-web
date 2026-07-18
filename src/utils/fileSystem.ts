import type { Project } from "../types";

const isTauri = typeof window !== "undefined" && "__TAURI__" in window;

export interface AppConfig {
  defaultProjectDir: string;
  defaultExportDir: string;
  autoSave: boolean;
  autoSaveInterval: number;
  lastSavedPath: string;
  zoom: number;
}

const CONFIG_KEY = "webcraft_config_v2";

export function getDefaultConfig(): AppConfig {
  return {
    defaultProjectDir: "",
    defaultExportDir: "",
    autoSave: true,
    autoSaveInterval: 30000,
    lastSavedPath: "",
    zoom: 100,
  };
}

export function loadConfig(): AppConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      return { ...getDefaultConfig(), ...JSON.parse(raw) };
    }
  } catch {}
  return getDefaultConfig();
}

export function saveConfig(config: AppConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch {}
}

export async function getDefaultSaveDir(): Promise<string> {
  const config = loadConfig();
  if (config.defaultProjectDir) {
    return config.defaultProjectDir;
  }
  if (isTauri) {
    try {
      const { path } = await import("@tauri-apps/api");
      const documentDir = await path.documentDir();
      const homeDir = await path.homeDir();
      const base = documentDir || homeDir;
      const dir = `${base}/WebCraft`;
      try {
        const { mkdir } = await import("@tauri-apps/plugin-fs");
        await mkdir(dir, { recursive: true });
      } catch {}
      return dir;
    } catch {
      return "";
    }
  }
  return "";
}

function generateFileName(projectName: string): string {
  const clean = projectName.replace(/[^a-zA-Z0-9-_]/g, "_");
  return `${clean}_${Date.now()}.webcraft.json`;
}

export async function saveProject(
  project: Project,
  specificPath?: string
): Promise<string | null> {
  if (isTauri) {
    try {
      const { save } = await import("@tauri-apps/plugin-dialog");
      const { writeTextFile } = await import("@tauri-apps/plugin-fs");
      const defaultDir = await getDefaultSaveDir();
      const defaultName = generateFileName(project.name);
      const path =
        specificPath ||
        (await save({
          filters: [{ name: "WebCraft Project", extensions: ["webcraft.json"] }],
          defaultPath: defaultDir ? `${defaultDir}/${defaultName}` : defaultName,
        }));
      if (!path) return null;
      await writeTextFile(path as string, JSON.stringify(project, null, 2));
      const config = loadConfig();
      config.lastSavedPath = path as string;
      saveConfig(config);
      return path as string;
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
    a.download = generateFileName(project.name);
    a.click();
    URL.revokeObjectURL(url);
    return null;
  } catch {
    return null;
  }
}

export async function saveProjectAs(project: Project): Promise<string | null> {
  try {
    const { save } = await import("@tauri-apps/plugin-dialog");
    const { writeTextFile } = await import("@tauri-apps/plugin-fs");
    const defaultDir = await getDefaultSaveDir();
    const defaultName = generateFileName(project.name);
    const path = await save({
      filters: [{ name: "WebCraft Project", extensions: ["webcraft.json"] }],
      defaultPath: defaultDir ? `${defaultDir}/${defaultName}` : defaultName,
    });
    if (!path) return null;
    await writeTextFile(path as string, JSON.stringify(project, null, 2));
    const config = loadConfig();
    config.lastSavedPath = path as string;
    saveConfig(config);
    return path as string;
  } catch (e) {
    console.error("Tauri save-as failed:", e);
    if (!isTauri) {
      return saveProject(project);
    }
    return null;
  }
}

export async function loadProject(
  path?: string
): Promise<Project | null> {
  if (isTauri) {
    try {
      const { open } = await import("@tauri-apps/plugin-dialog");
      const { readTextFile } = await import("@tauri-apps/plugin-fs");
      const selected =
        path ||
        (await open({
          filters: [{ name: "WebCraft Project", extensions: ["webcraft.json"] }],
          multiple: false,
        }));
      if (!selected) return null;
      const content = await readTextFile(selected as string);
      const project = JSON.parse(content) as Project;
      const config = loadConfig();
      config.lastSavedPath = selected as string;
      saveConfig(config);
      return project;
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
