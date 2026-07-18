import { useEffect, useRef } from "react";
import { useProjectStore } from "./store/projectStore";
import { useAutoSave } from "./hooks/useAutoSave";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { applyTheme, applyCustomCSS } from "./utils/theme";
import { loadConfig } from "./utils/fileSystem";
import Splash from "./components/Splash";
import MenuBar from "./components/MenuBar";
import Editor from "./components/Editor";
import PageSettings from "./components/PageSettings";
import ExportDialog from "./components/ExportDialog";
import ComponentLibrary from "./components/ComponentLibrary";
import SettingsModal from "./components/SettingsModal";
import PreviewExitBar from "./components/PreviewExitBar";
import GuidedTooltips from "./components/GuidedTooltips";
import ToastContainer from "./components/ui/Toast";
import { loadAutoSave } from "./utils/storage";

export default function App() {
  const { project, editor } = useProjectStore();
  const config = loadConfig();
  const editorRef = useRef<HTMLDivElement>(null);

  useAutoSave(config.autoSave ? config.autoSaveInterval : 0);
  useKeyboardShortcuts();

  useEffect(() => {
    if (project) {
      applyTheme(project.settings.theme);
      if (project.settings.theme.customCSS) {
        applyCustomCSS(project.settings.theme.customCSS);
      }
    }
  }, [project?.settings.theme]);

  useEffect(() => {
    if (!editor.isPreviewMode) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "F5") {
        e.preventDefault();
        useProjectStore.getState().setPreviewMode(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [editor.isPreviewMode]);

  if (!project) {
    return (
      <>
        <Splash />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className={`min-h-screen ${editor.isPreviewMode ? "bg-white" : "bg-editor-bg"}`}>
      {!editor.isPreviewMode && <MenuBar />}
      {editor.isPreviewMode && <PreviewExitBar />}
      <div
        ref={editorRef}
        className={editor.isPreviewMode ? "pt-10 preview-mode" : "pt-9"}
        style={
          editor.isPreviewMode
            ? {}
            : {
                transform: `scale(${(editor.zoom || 100) / 100})`,
                transformOrigin: "top center",
                transition: "transform 0.15s ease",
              }
        }
      >
        {editor.isPreviewMode ? (
          <div className="min-h-screen bg-white">
            <Editor />
          </div>
        ) : (
          <Editor />
        )}
      </div>

      {editor.showPageSettings && <PageSettings />}
      {editor.showExportDialog && <ExportDialog />}
      {editor.showComponentLibrary && <ComponentLibrary />}
      {editor.showSettings && <SettingsModal />}

      <GuidedTooltips />
      <ToastContainer />
    </div>
  );
}
