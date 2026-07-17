import { useState, useRef, useEffect } from "react";
import { useProjectStore } from "../store/projectStore";
import { useAppStore } from "../store/appStore";
import { saveProject, saveProjectAs, loadProject, loadConfig } from "../utils/fileSystem";
import { FilePlus, FolderOpen, Save, Download, FileArchive, LogOut, Undo2, Redo2, Copy, Trash2, Eye, ZoomIn, ZoomOut, Sun, Moon, Settings, Info, FileDown, ExternalLink, Plus, DownloadCloud, Lightbulb, Heart } from "lucide-react";
import Tooltip from "./ui/Tooltip";
import Modal from "./ui/Modal";

interface MenuItem {
  label: string;
  shortcut?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  divider?: boolean;
  disabled?: boolean;
  tutorialKey?: string;
  custom?: boolean;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

export default function MenuBar() {
  const store = useProjectStore();
  const { isTutorialMode, setTutorialMode } = useAppStore();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setHoveredItem(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleExportHTML = () => {
    store.setShowExportDialog(true);
    setOpenMenu(null);
  };

  const handleNewProject = () => {
    store.initProject();
    store.addToast("Nuevo proyecto");
    setOpenMenu(null);
  };

  const handleOpenProject = async () => {
    const p = await loadProject();
    if (p) {
      store.openProject(p);
      store.addToast("Proyecto abierto correctamente");
    } else {
      store.addToast("No se abrió ningún archivo", "error");
    }
    setOpenMenu(null);
  };

  const handleSave = async () => {
    if (!store.project) return;
    store.saveToStorage();
    const config = loadConfig();
    const path = config.lastSavedPath || undefined;
    const savedPath = await saveProject(store.project, path);
    if (savedPath) {
      store.addToast(`Guardado en: ${savedPath}`);
    } else if (!(typeof window !== "undefined" && "__TAURI__" in window)) {
      store.addToast("Descargado en Descargas");
    }
    setOpenMenu(null);
  };

  const handleSaveAs = async () => {
    if (!store.project) return;
    const savedPath = await saveProjectAs(store.project);
    if (savedPath) {
      store.addToast(`Guardado en: ${savedPath}`);
    }
    setOpenMenu(null);
  };

  const handleCloseApp = () => {
    store.closeProject();
    setOpenMenu(null);
  };

  const handleUndo = () => {
    store.undo();
    setOpenMenu(null);
  };

  const handleRedo = () => {
    store.redo();
    setOpenMenu(null);
  };

  const handleDuplicate = () => {
    const sel = store.editor.selectedSectionId;
    if (sel) {
      store.duplicateSection(sel);
      store.addToast("Bloque duplicado");
    }
    setOpenMenu(null);
  };

  const handleDelete = () => {
    const sel = store.editor.selectedSectionId;
    if (sel) {
      store.deleteSection(sel);
      store.addToast("Bloque eliminado");
    }
    setOpenMenu(null);
  };

  const handlePreview = () => {
    store.togglePreview();
    setOpenMenu(null);
  };

  const handleZoomIn = () => {
    store.setZoom(Math.min((store.editor.zoom || 100) + 10, 200));
    setOpenMenu(null);
  };

  const handleZoomOut = () => {
    store.setZoom(Math.max((store.editor.zoom || 100) - 10, 50));
    setOpenMenu(null);
  };

  const handleThemeToggle = () => {
    if (!store.project) return;
    const newMode = store.project.settings.theme.mode === "dark" ? "light" : "dark";
    store.updateTheme({ mode: newMode });
    setOpenMenu(null);
  };

  const handleOpenSettings = () => {
    store.setShowSettings(true);
    setOpenMenu(null);
  };

  const handleAbout = () => {
    setShowAbout(true);
    setOpenMenu(null);
  };

  if (!store.project) return null;

  const menus: MenuGroup[] = [
    {
      label: "Archivo",
      items: [
        { label: "Nuevo", shortcut: "Ctrl+N", icon: <FilePlus size={14} />, onClick: handleNewProject },
        { label: "Abrir...", shortcut: "Ctrl+O", icon: <FolderOpen size={14} />, onClick: handleOpenProject },
        { label: "Guardar", shortcut: "Ctrl+S", icon: <Save size={14} />, onClick: handleSave, tutorialKey: "guardar-menu" },
        { label: "Guardar como...", shortcut: "Ctrl+Shift+S", icon: <Save size={14} />, onClick: handleSaveAs, divider: true },
        { label: "Exportar HTML", shortcut: "Ctrl+E", icon: <FileDown size={14} />, onClick: () => { store.setShowExportDialog(true); setOpenMenu(null); } },
        { label: "Exportar ZIP", icon: <FileArchive size={14} />, onClick: () => { store.setShowExportDialog(true); setOpenMenu(null); }, divider: true },
        { label: "Salir", icon: <LogOut size={14} />, onClick: handleCloseApp },
      ],
    },
    {
      label: "Editar",
      items: [
        { label: "Deshacer", shortcut: "Ctrl+Z", icon: <Undo2 size={14} />, onClick: handleUndo, disabled: store.editor.undoStack.length === 0 },
        { label: "Rehacer", shortcut: "Ctrl+Shift+Z", icon: <Redo2 size={14} />, onClick: handleRedo, disabled: store.editor.redoStack.length === 0, divider: true },
        { label: "Duplicar bloque", shortcut: "Ctrl+D", icon: <Copy size={14} />, onClick: handleDuplicate, disabled: !store.editor.selectedSectionId },
        { label: "Borrar bloque", shortcut: "Supr", icon: <Trash2 size={14} />, onClick: handleDelete, disabled: !store.editor.selectedSectionId },
      ],
    },
    {
      label: "Ver",
      items: [
        { label: store.editor.isPreviewMode ? "Salir de Vista Previa" : "Vista Previa", shortcut: "F5", icon: <Eye size={14} />, onClick: handlePreview },
        { label: "Acercar", shortcut: "Ctrl++", icon: <ZoomIn size={14} />, onClick: handleZoomIn, divider: true },
        { label: "Alejar", shortcut: "Ctrl+-", icon: <ZoomOut size={14} />, onClick: handleZoomOut },
        { label: store.project?.settings.theme.mode === "dark" ? "Modo Claro" : "Modo Oscuro", icon: store.project?.settings.theme.mode === "dark" ? <Sun size={14} /> : <Moon size={14} />, onClick: handleThemeToggle },
      ],
    },
    {
      label: "Configuración",
      items: [
        { label: "Abrir Configuración", icon: <Settings size={14} />, onClick: handleOpenSettings },
      ],
    },
    {
      label: "Ayuda",
      items: [
        { label: "Acerca de WebCraft Studio", icon: <Info size={14} />, onClick: handleAbout },
        { label: "Documentación", icon: <ExternalLink size={14} />, onClick: () => { store.addToast("Documentación disponible próximamente", "info"); setOpenMenu(null); } },
        { label: "", icon: <Lightbulb size={14} />, onClick: () => { setTutorialMode(!isTutorialMode); setOpenMenu(null); }, custom: true },
      ],
    },
  ];

  return (
    <div ref={barRef} className="fixed top-0 left-0 right-0 z-[15000] bg-editor-secondary/95 backdrop-blur-md border-b border-editor-border select-none">
      <div className="flex items-center h-9 px-2 gap-0">
        <span className="text-sm font-bold text-editor-accent mr-3 shrink-0">WebCraft</span>
        {menus.map((menu) => (
          <div
            key={menu.label}
            className="relative"
            onMouseEnter={() => {
              setOpenMenu(menu.label);
              setHoveredItem(menu.label);
            }}
            onMouseLeave={() => {
              if (hoveredItem === menu.label) {
                setOpenMenu(null);
                setHoveredItem(null);
              }
            }}
          >
            <button
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                openMenu === menu.label
                  ? "bg-editor-tertiary text-editor-text"
                  : "text-editor-text-sec hover:text-editor-text hover:bg-editor-tertiary/50"
              }`}
              onClick={() => setOpenMenu(openMenu === menu.label ? null : menu.label)}
            >
              {menu.label}
            </button>
            {openMenu === menu.label && (
              <div
                className="absolute top-full left-0 mt-0 min-w-[200px] bg-editor-secondary border border-editor-border rounded-lg shadow-xl py-1 animate-fade-in"
                onMouseLeave={() => {
                  setOpenMenu(null);
                  setHoveredItem(null);
                }}
              >
                {menu.items.map((item, i) => (
                  <div key={i}>
                    {item.divider && i > 0 && <div className="border-t border-editor-border my-1" />}
                    {item.custom ? (
                      <div className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-editor-text-sec">
                        <span className="w-4 flex items-center justify-center shrink-0">{item.icon}</span>
                        <span className="flex-1 text-left">Tutorial Guiado</span>
                        <button
                          onClick={() => setTutorialMode(!isTutorialMode)}
                          className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
                            isTutorialMode ? "bg-[#22c55e]" : "bg-editor-border"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                              isTutorialMode ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ) : (
                      <button
                        data-tutorial={item.tutorialKey || undefined}
                        onClick={item.onClick}
                        disabled={item.disabled}
                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs transition-colors ${
                          item.disabled
                            ? "text-editor-text-sec/40 cursor-not-allowed"
                            : "text-editor-text-sec hover:text-editor-text hover:bg-editor-tertiary"
                        }`}
                      >
                        <span className="w-4 flex items-center justify-center shrink-0">{item.icon}</span>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.shortcut && (
                          <span className="text-[10px] text-editor-text-sec/50 ml-4 shrink-0">{item.shortcut}</span>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="flex-1" />
        {store.project && (
          <div className="flex items-center gap-0.5 mr-2">
            <Tooltip text="Deshacer (Ctrl+Z)">
              <button onClick={handleUndo} disabled={store.editor.undoStack.length === 0} className="p-1 rounded hover:bg-editor-tertiary text-editor-text-sec hover:text-editor-text transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <Undo2 size={13} />
              </button>
            </Tooltip>
            <Tooltip text="Rehacer (Ctrl+Shift+Z)">
              <button onClick={handleRedo} disabled={store.editor.redoStack.length === 0} className="p-1 rounded hover:bg-editor-tertiary text-editor-text-sec hover:text-editor-text transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <Redo2 size={13} />
              </button>
            </Tooltip>
            <div className="w-px h-4 bg-editor-border/50 mx-1" />
            <Tooltip text="Añadir sección">
              <button data-tutorial="add-section" onClick={() => { store.setShowComponentLibrary(true); setOpenMenu(null); }} className="p-1 rounded hover:bg-editor-tertiary text-editor-text-sec hover:text-editor-text transition-colors">
                <Plus size={13} />
              </button>
            </Tooltip>
            <Tooltip text="Configurar página">
              <button onClick={() => { store.setShowPageSettings(true); setOpenMenu(null); }} className="p-1 rounded hover:bg-editor-tertiary text-editor-text-sec hover:text-editor-text transition-colors">
                <Settings size={13} />
              </button>
            </Tooltip>
            <Tooltip text="Guardar (Ctrl+S)">
              <button data-tutorial="toolbar-save" onClick={handleSave} className="p-1 rounded hover:bg-editor-tertiary text-editor-text-sec hover:text-editor-text transition-colors">
                <Save size={13} />
              </button>
            </Tooltip>
            <Tooltip text="Exportar (Ctrl+E)">
              <button data-tutorial="export" onClick={() => { store.setShowExportDialog(true); setOpenMenu(null); }} className="p-1 rounded hover:bg-editor-tertiary text-editor-text-sec hover:text-editor-text transition-colors">
                <Download size={13} />
              </button>
            </Tooltip>
            <div className="w-px h-4 bg-editor-border/50 mx-1" />
            <Tooltip text={store.editor.isPreviewMode ? "Salir de Vista Previa (F5)" : "Vista Previa (F5)"}>
              <button data-tutorial="preview" onClick={handlePreview} className={`p-1 rounded hover:bg-editor-tertiary text-editor-text-sec hover:text-editor-text transition-colors ${store.editor.isPreviewMode ? "text-editor-accent" : ""}`}>
                <Eye size={13} />
              </button>
            </Tooltip>
          </div>
        )}
        <span className="text-[10px] text-editor-text-sec/40 mr-1 ml-0">
          {(store.editor.zoom || 100)}%
        </span>
        {store.project && (
          <input
            value={store.project.name}
            onChange={(e) => store.setProjectName(e.target.value)}
            className="bg-transparent border-none text-[11px] font-medium text-editor-text outline-none max-w-[120px] truncate text-right ml-1"
          />
        )}
      </div>
    </div>

      <Modal open={showAbout} onClose={() => setShowAbout(false)} title="Acerca de WebCraft Studio" wide>
        <div className="space-y-5 text-sm">
          <div>
            <p className="text-lg font-bold text-editor-accent">WebCraft Studio v1.0</p>
            <p className="text-editor-text-sec mt-1">Constructor visual de páginas web. Sin código. Sin backend. Sin excusas.</p>
          </div>

          <div className="border-t border-editor-border pt-4">
            <p className="font-semibold mb-2 flex items-center gap-2"><Heart size={14} className="text-red-400" /> Agradecimientos</p>
            <p className="text-editor-text-sec leading-relaxed">
              Este proyecto usa <strong>OpenCode</strong>, <strong>Tauri v2</strong>, <strong>React 19</strong>, <strong>Vite</strong>,
              <strong> TypeScript</strong>, <strong>Tailwind CSS</strong>, <strong>Zustand</strong>, <strong>TipTap</strong>,
              y <strong>Google Fonts</strong>. Ver créditos completos en <code>docs/CREDITS.md</code>.
            </p>
          </div>

          <div className="border-t border-editor-border pt-4">
            <p className="font-semibold mb-2">El equipo</p>
            <p className="text-editor-text-sec">Tres personas, sin Llama hoy, empujando código real.</p>
          </div>

          <div className="border-t border-editor-border pt-4">
            <p className="font-semibold mb-2">Licencia</p>
            <p className="text-editor-text-sec leading-relaxed">
              MIT &mdash; Código libre para usar, modificar y compartir.
              Si quieres continuar este proyecto a tu manera, con IA o sin ella, puedes hacerlo. Es MIT. Adelante.
            </p>
          </div>

          <div className="border-t border-editor-border pt-4 text-center">
            <p className="text-xs text-editor-text-sec/50">
              &copy; 2026 Constructor Web Contributors
            </p>
          </div>
        </div>
      </Modal>
  );
}
