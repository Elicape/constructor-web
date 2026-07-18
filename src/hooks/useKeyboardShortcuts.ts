import { useEffect } from "react";
import { useProjectStore } from "../store/projectStore";

const isTauri = typeof window !== "undefined" && "__TAURI__" in window;

export function useKeyboardShortcuts(): void {
  const store = useProjectStore();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      if (e.key === "F5") {
        e.preventDefault();
        store.togglePreview();
        return;
      }

      if (!ctrl) return;

      switch (e.key.toLowerCase()) {
        case "z":
          e.preventDefault();
          if (shift) {
            store.redo();
          } else {
            store.undo();
          }
          break;
        case "s":
          e.preventDefault();
          store.saveToStorage();
          if (shift) {
            import("../utils/fileSystem").then(m =>
              m.saveProjectAs(store.project!).then(path => {
                if (path) store.addToast(`Guardado en: ${path}`);
              })
            );
          } else {
            import("../utils/fileSystem").then(m =>
              m.saveProject(store.project!).then(path => {
                if (path) store.addToast(`Guardado en: ${path}`);
                else if (!isTauri) store.addToast("Descargado en Descargas");
              })
            );
          }
          break;
        case "o":
          if (!shift) {
            e.preventDefault();
            import("../utils/fileSystem").then(({ loadProject }) =>
              loadProject().then((p) => {
                if (p) {
                  store.openProject(p);
                  store.addToast("Proyecto abierto correctamente");
                } else {
                  store.addToast("No se abrió ningún archivo", "error");
                }
              })
            );
          }
          break;
        case "n":
          e.preventDefault();
          store.initProject();
          break;
        case "e":
          e.preventDefault();
          store.setShowExportDialog(true);
          break;
        case "p":
          e.preventDefault();
          store.togglePreview();
          break;
        case "d":
          if (store.editor.selectedSectionId) {
            e.preventDefault();
            store.duplicateSection(store.editor.selectedSectionId);
          }
          break;
      }
    }

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [store]);
}
