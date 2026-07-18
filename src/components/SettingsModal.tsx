import { useState, useEffect } from "react";
import { useProjectStore } from "../store/projectStore";
import Modal from "./ui/Modal";
import { loadConfig, saveConfig, getDefaultSaveDir, type AppConfig } from "../utils/fileSystem";
import { FolderOpen } from "lucide-react";

const isTauri = typeof window !== "undefined" && "__TAURI__" in window;

export default function SettingsModal() {
  const { setShowSettings, addToast, project } = useProjectStore();
  const [config, setConfig] = useState<AppConfig>(loadConfig());
  const [projectDir, setProjectDir] = useState(config.defaultProjectDir);
  const [exportDir, setExportDir] = useState(config.defaultExportDir);
  const [autoSave, setAutoSave] = useState(config.autoSave);
  const [autoSaveInterval, setAutoSaveInterval] = useState(config.autoSaveInterval);

  useEffect(() => {
    if (!config.defaultProjectDir && isTauri) {
      getDefaultSaveDir().then((dir) => {
        if (dir) {
          setProjectDir(dir);
          setConfig((prev) => ({ ...prev, defaultProjectDir: dir }));
        }
      });
    }
  }, []);

  const handleSelectDir = async (field: "projectDir" | "exportDir") => {
    if (!isTauri) return;
    try {
      const { open } = await import("@tauri-apps/plugin-dialog");
      const selected = await open({ directory: true, multiple: false, title: "Seleccionar directorio" });
      if (selected) {
        const dir = selected as string;
        if (field === "projectDir") {
          setProjectDir(dir);
        } else {
          setExportDir(dir);
        }
      }
    } catch {}
  };

  const handleSave = () => {
    const newConfig: AppConfig = {
      ...config,
      defaultProjectDir: projectDir,
      defaultExportDir: exportDir,
      autoSave,
      autoSaveInterval,
    };
    saveConfig(newConfig);
    setShowSettings(false);
    addToast("Configuración guardada");
  };

  return (
    <Modal open={true} onClose={() => setShowSettings(false)} title="Configuración" wide>
      <div className="space-y-5">
        <div>
          <label className="form-label">Directorio por defecto para proyectos</label>
          <div className="flex gap-2">
            <input
              value={projectDir}
              onChange={(e) => setProjectDir(e.target.value)}
              className="form-input flex-1 text-xs"
              placeholder="~/Documents/WebCraft/"
            />
            {isTauri && (
              <button onClick={() => handleSelectDir("projectDir")} className="btn-secondary px-3">
                <FolderOpen size={16} />
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="form-label">Directorio por defecto para exportaciones</label>
          <div className="flex gap-2">
            <input
              value={exportDir}
              onChange={(e) => setExportDir(e.target.value)}
              className="form-input flex-1 text-xs"
              placeholder="~/Desktop/"
            />
            {isTauri && (
              <button onClick={() => handleSelectDir("exportDir")} className="btn-secondary px-3">
                <FolderOpen size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between py-3 px-4 bg-editor-tertiary rounded-xl">
          <div>
            <div className="text-sm font-medium">Auto-guardado</div>
            <div className="text-xs text-editor-text-sec">Guarda automáticamente los cambios</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-editor-border rounded-full peer peer-checked:bg-editor-accent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
          </label>
        </div>

        {autoSave && (
          <div>
            <label className="form-label">Intervalo de auto-guardado</label>
            <select
              value={autoSaveInterval}
              onChange={(e) => setAutoSaveInterval(Number(e.target.value))}
              className="form-input"
            >
              <option value={30000}>30 segundos</option>
              <option value={60000}>1 minuto</option>
              <option value={300000}>5 minutos</option>
            </select>
          </div>
        )}

        {project && config.lastSavedPath && isTauri && (
          <div className="bg-editor-tertiary p-3 rounded-xl text-xs">
            <span className="text-editor-text-sec">Proyecto actual: </span>
            <span className="text-editor-text break-all">{config.lastSavedPath}</span>
          </div>
        )}

        <div className="pt-4 border-t border-editor-border">
          <button onClick={handleSave} className="btn-primary w-full">
            Guardar configuración
          </button>
        </div>
      </div>
    </Modal>
  );
}
