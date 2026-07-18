import { create } from "zustand";
import type { Project, Section, PageSettings, Toast, EditorState, RecentProject } from "../types";
import { getDefaultSettings } from "../templates";
import { v4 as uuid } from "uuid";
import { saveAutoSave, loadAutoSave, getRecentProjects, addRecentProject } from "../utils/storage";

const initialRecents = getRecentProjects();

interface ProjectStore {
  project: Project | null;
  recentProjects: RecentProject[];
  toasts: Toast[];
  editor: EditorState;

  initProject: () => void;
  loadFromTemplate: (templateId: string) => void;
  openProject: (data: Project) => void;
  closeProject: () => void;
  setProjectName: (name: string) => void;

  addSection: (type: Section["type"]) => void;
  updateSection: (id: string, content: Partial<Section["content"]>) => void;
  duplicateSection: (id: string) => void;
  deleteSection: (id: string) => void;
  moveSection: (from: number, to: number) => void;
  toggleVisibility: (id: string) => void;
  setSections: (sections: Section[]) => void;
  copySection: (id: string) => void;
  pasteSection: () => void;
  convertSection: (id: string, newType: Section["type"]) => void;

  updateSettings: (settings: Partial<PageSettings>) => void;
  updateTheme: (theme: Partial<PageSettings["theme"]>) => void;
  updateLayout: (layout: Partial<PageSettings["layout"]>) => void;
  updateSEO: (seo: Partial<PageSettings["seo"]>) => void;

  setPreviewMode: (v: boolean) => void;
  togglePreview: () => void;
  selectSection: (id: string | null) => void;
  setShowPageSettings: (v: boolean) => void;
  setShowExportDialog: (v: boolean) => void;
  setShowComponentLibrary: (v: boolean) => void;
  setShowSettings: (v: boolean) => void;
  setZoom: (v: number) => void;

  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;

  pushUndo: () => void;
  undo: () => void;
  redo: () => void;

  saveToStorage: () => void;
  loadFromStorage: () => boolean;
}

const DEFAULT_PROJECT: Project = {
  version: 2,
  name: "Sin título",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: getDefaultSettings(),
  sections: [],
  assets: { images: {} },
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  project: null,
  recentProjects: initialRecents,
  toasts: [],
  editor: {
    isPreviewMode: false,
    selectedSectionId: null,
    showPageSettings: false,
    showExportDialog: false,
    showComponentLibrary: false,
    showSettings: false,
    clipboard: null,
    undoStack: [],
    redoStack: [],
    zoom: 100,
  },

  initProject: () => {
    set({
      project: {
        ...DEFAULT_PROJECT,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      editor: {
        ...get().editor,
        undoStack: [],
        redoStack: [],
      },
    });
  },

  loadFromTemplate: (templateId: string) => {
    import("../templates").then(({ getTemplate }) => {
      const template = getTemplate(templateId);
      if (template) {
        set({
          project: {
            ...DEFAULT_PROJECT,
            name: template.name,
            settings: JSON.parse(JSON.stringify(template.settings)),
            sections: JSON.parse(JSON.stringify(template.sections)),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          editor: {
            ...get().editor,
            undoStack: [],
            redoStack: [],
          },
        });
      }
    });
  },

  openProject: (data: Project) => {
    set({
      project: data,
      editor: {
        ...get().editor,
        undoStack: [],
        redoStack: [],
      },
    });
  },

  closeProject: () => {
    set({ project: null });
  },

  setProjectName: (name: string) => {
    const p = get().project;
    if (!p) return;
    set({ project: { ...p, name, updatedAt: new Date().toISOString() } });
  },

  addSection: (type: Section["type"]) => {
    const p = get().project;
    if (!p) return;
    get().pushUndo();
    const newSection: Section = {
      id: uuid(),
      type,
      visible: true,
      content: {},
    };
    set({
      project: {
        ...p,
        sections: [...p.sections, newSection],
        updatedAt: new Date().toISOString(),
      },
      editor: { ...get().editor, selectedSectionId: newSection.id },
    });
  },

  updateSection: (id: string, content: Partial<Section["content"]>) => {
    const p = get().project;
    if (!p) return;
    set({
      project: {
        ...p,
        sections: p.sections.map((s) =>
          s.id === id ? { ...s, content: { ...s.content, ...content } } : s
        ),
        updatedAt: new Date().toISOString(),
      },
    });
  },

  duplicateSection: (id: string) => {
    const p = get().project;
    if (!p) return;
    get().pushUndo();
    const idx = p.sections.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const dup: Section = {
      ...JSON.parse(JSON.stringify(p.sections[idx])),
      id: uuid(),
    };
    const sections = [...p.sections];
    sections.splice(idx + 1, 0, dup);
    set({
      project: { ...p, sections, updatedAt: new Date().toISOString() },
    });
  },

  deleteSection: (id: string) => {
    const p = get().project;
    if (!p) return;
    get().pushUndo();
    set({
      project: {
        ...p,
        sections: p.sections.filter((s) => s.id !== id),
        updatedAt: new Date().toISOString(),
      },
      editor: {
        ...get().editor,
        selectedSectionId:
          get().editor.selectedSectionId === id ? null : get().editor.selectedSectionId,
      },
    });
  },

  moveSection: (from: number, to: number) => {
    const p = get().project;
    if (!p) return;
    get().pushUndo();
    const sections = [...p.sections];
    const [moved] = sections.splice(from, 1);
    sections.splice(to, 0, moved);
    set({
      project: { ...p, sections, updatedAt: new Date().toISOString() },
    });
  },

  toggleVisibility: (id: string) => {
    const p = get().project;
    if (!p) return;
    set({
      project: {
        ...p,
        sections: p.sections.map((s) =>
          s.id === id ? { ...s, visible: !s.visible } : s
        ),
      },
    });
  },

  setSections: (sections: Section[]) => {
    const p = get().project;
    if (!p) return;
    set({ project: { ...p, sections, updatedAt: new Date().toISOString() } });
  },

  copySection: (id: string) => {
    const p = get().project;
    if (!p) return;
    const section = p.sections.find((s) => s.id === id);
    if (section) {
      set({
        editor: { ...get().editor, clipboard: JSON.parse(JSON.stringify(section)) },
      });
      get().addToast("Sección copiada al portapapeles");
    }
  },

  pasteSection: () => {
    const p = get().project;
    const clip = get().editor.clipboard;
    if (!p || !clip) return;
    get().pushUndo();
    const newSection: Section = {
      ...JSON.parse(JSON.stringify(clip)),
      id: uuid(),
    };
    set({
      project: {
        ...p,
        sections: [...p.sections, newSection],
        updatedAt: new Date().toISOString(),
      },
    });
  },

  convertSection: (id: string, newType: Section["type"]) => {
    const p = get().project;
    if (!p) return;
    get().pushUndo();
    set({
      project: {
        ...p,
        sections: p.sections.map((s) =>
          s.id === id ? { ...s, type: newType, content: {} } : s
        ),
        updatedAt: new Date().toISOString(),
      },
    });
  },

  updateSettings: (settings: Partial<PageSettings>) => {
    const p = get().project;
    if (!p) return;
    set({
      project: {
        ...p,
        settings: { ...p.settings, ...settings },
        updatedAt: new Date().toISOString(),
      },
    });
  },

  updateTheme: (theme: Partial<PageSettings["theme"]>) => {
    const p = get().project;
    if (!p) return;
    set({
      project: {
        ...p,
        settings: {
          ...p.settings,
          theme: { ...p.settings.theme, ...theme },
        },
        updatedAt: new Date().toISOString(),
      },
    });
  },

  updateLayout: (layout: Partial<PageSettings["layout"]>) => {
    const p = get().project;
    if (!p) return;
    set({
      project: {
        ...p,
        settings: {
          ...p.settings,
          layout: { ...p.settings.layout, ...layout },
        },
        updatedAt: new Date().toISOString(),
      },
    });
  },

  updateSEO: (seo: Partial<PageSettings["seo"]>) => {
    const p = get().project;
    if (!p) return;
    set({
      project: {
        ...p,
        settings: {
          ...p.settings,
          seo: { ...p.settings.seo, ...seo },
        },
        updatedAt: new Date().toISOString(),
      },
    });
  },

  setPreviewMode: (v: boolean) => {
    set({ editor: { ...get().editor, isPreviewMode: v } });
  },

  togglePreview: () => {
    set({
      editor: {
        ...get().editor,
        isPreviewMode: !get().editor.isPreviewMode,
      },
    });
  },

  selectSection: (id: string | null) => {
    set({ editor: { ...get().editor, selectedSectionId: id } });
  },

  setShowPageSettings: (v: boolean) => {
    set({ editor: { ...get().editor, showPageSettings: v } });
  },
  setShowExportDialog: (v: boolean) => {
    set({ editor: { ...get().editor, showExportDialog: v } });
  },
  setShowComponentLibrary: (v: boolean) => {
    set({ editor: { ...get().editor, showComponentLibrary: v } });
  },
  setShowSettings: (v: boolean) => {
    set({ editor: { ...get().editor, showSettings: v } });
  },
  setZoom: (v: number) => {
    set({ editor: { ...get().editor, zoom: v } });
  },

  addToast: (message: string, type: Toast["type"] = "success") => {
    const id = uuid();
    set({ toasts: [...get().toasts, { id, message, type }] });
    setTimeout(() => get().removeToast(id), 3000);
  },

  removeToast: (id: string) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },

  pushUndo: () => {
    const p = get().project;
    if (!p) return;
    set({
      editor: {
        ...get().editor,
        undoStack: [
          ...get().editor.undoStack.slice(-50),
          JSON.parse(JSON.stringify(p.sections)),
        ],
        redoStack: [],
      },
    });
  },

  undo: () => {
    const { project, editor } = get();
    if (!project || editor.undoStack.length === 0) return;
    const prev = editor.undoStack[editor.undoStack.length - 1];
    set({
      project: { ...project, sections: prev, updatedAt: new Date().toISOString() },
      editor: {
        ...editor,
        undoStack: editor.undoStack.slice(0, -1),
        redoStack: [
          ...editor.redoStack,
          JSON.parse(JSON.stringify(project.sections)),
        ],
      },
    });
  },

  redo: () => {
    const { project, editor } = get();
    if (!project || editor.redoStack.length === 0) return;
    const next = editor.redoStack[editor.redoStack.length - 1];
    set({
      project: { ...project, sections: next, updatedAt: new Date().toISOString() },
      editor: {
        ...editor,
        redoStack: editor.redoStack.slice(0, -1),
        undoStack: [
          ...editor.undoStack,
          JSON.parse(JSON.stringify(project.sections)),
        ],
      },
    });
  },

  saveToStorage: () => {
    const p = get().project;
    if (!p) return;
    try {
      localStorage.setItem("webcraft_autosave", JSON.stringify(p));
      addRecentProject(p.name);
      set({ recentProjects: getRecentProjects() });
    } catch {}
  },

  loadFromStorage: () => {
    try {
      const raw = localStorage.getItem("webcraft_autosave");
      if (raw) {
        const p = JSON.parse(raw) as Project;
        set({ project: p });
        return true;
      }
    } catch {}
    return false;
  },
}));
