import { useProjectStore } from "../store/projectStore";
import { TEMPLATES } from "../templates";
import { FilePlus, FolderOpen, Clock } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Store: () => null, Palette: () => null, Rocket: () => null,
  Calendar: () => null, FileText: () => null, FilePlus: () => null,
};

export default function Splash() {
  const { loadFromTemplate, initProject, openProject, addToast, recentProjects, loadFromStorage } =
    useProjectStore();

  const handleOpenFile = async () => {
    const { loadProjectFromFile } = await import("../utils/storage");
    const p = await loadProjectFromFile();
    if (p) {
      openProject(p);
      addToast("Proyecto abierto");
    } else {
      addToast("No se pudo abrir el archivo", "error");
    }
  };

  const handleNewBlank = () => {
    initProject();
    addToast("Nuevo proyecto en blanco");
  };

  const handleFromTemplate = (id: string) => {
    loadFromTemplate(id);
    addToast("Plantilla cargada");
  };

  const recents = recentProjects.length > 0 ? recentProjects : [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-editor-bg animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-editor-accent mb-3">WebCraft Studio</h1>
        <p className="text-editor-text-sec text-lg">
          Crea páginas web sin escribir código
        </p>
      </div>

      <div className="flex gap-4 mb-12">
        <button
          onClick={handleNewBlank}
          className="flex flex-col items-center gap-2 px-8 py-6 bg-editor-secondary border border-editor-border rounded-xl hover:border-editor-accent transition-all hover:-translate-y-0.5 group"
        >
          <FilePlus size={32} className="text-editor-accent" />
          <span className="text-sm font-medium">Nuevo en blanco</span>
          <span className="text-xs text-editor-text-sec">Empieza desde cero</span>
        </button>
        <button
          onClick={handleOpenFile}
          className="flex flex-col items-center gap-2 px-8 py-6 bg-editor-secondary border border-editor-border rounded-xl hover:border-editor-accent transition-all hover:-translate-y-0.5 group"
        >
          <FolderOpen size={32} className="text-editor-accent" />
          <span className="text-sm font-medium">Abrir proyecto</span>
          <span className="text-xs text-editor-text-sec">Cargar .webcraft.json</span>
        </button>
      </div>

      <div className="w-full max-w-4xl">
        <h2 className="text-lg font-semibold mb-4 text-editor-text-sec">
          Empieza con una plantilla
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {TEMPLATES.filter((t: { id: string }) => t.id !== "blank").map((t: { id: string; name: string; description: string; icon: string }) => {
            const Icon = ICON_MAP[t.icon as keyof typeof ICON_MAP] || FilePlus;
            return (
              <button
                key={t.id}
                onClick={() => handleFromTemplate(t.id)}
                className="flex flex-col items-center gap-3 p-5 bg-editor-secondary border border-editor-border rounded-xl hover:border-editor-accent hover:shadow-lg hover:shadow-editor-accent/10 transition-all hover:-translate-y-0.5 text-left group"
              >
                <Icon size={28} className="text-editor-accent" />
                <div>
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-editor-text-sec mt-0.5">{t.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {recents.length > 0 && (
        <div className="w-full max-w-4xl mt-10">
          <h2 className="text-lg font-semibold mb-4 text-editor-text-sec flex items-center gap-2">
            <Clock size={16} /> Recientes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recents.slice(0, 4).map((r: { name: string; path: string; updatedAt: string }) => (
              <button
                key={r.name}
                onClick={() => {
                  const stored = localStorage.getItem("webcraft_autosave");
                  if (stored) {
                    try {
                      openProject(JSON.parse(stored));
                      addToast("Proyecto abierto");
                    } catch {}
                  }
                }}
                className="p-3 bg-editor-secondary border border-editor-border rounded-xl hover:border-editor-accent transition-all text-left"
              >
                <div className="text-sm font-medium truncate">{r.name}</div>
                <div className="text-xs text-editor-text-sec mt-1">
                  {new Date(r.updatedAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
