import { useState } from "react";
import { useProjectStore } from "../store/projectStore";
import { exportStandalone, exportAssets, exportZIP } from "../utils/export";
import Modal from "./ui/Modal";
import { FileDown, FileArchive, Download } from "lucide-react";

export default function ExportDialog() {
  const { project, setShowExportDialog, addToast } = useProjectStore();
  const [mode, setMode] = useState<"standalone" | "assets" | "zip">("standalone");
  const [loading, setLoading] = useState(false);

  if (!project) return null;

  const handleExport = async () => {
    setLoading(true);
    try {
      let path: string | null = null;
      if (mode === "standalone") {
        path = await exportStandalone(project);
      } else if (mode === "assets") {
        path = await exportAssets(project);
      } else {
        path = await exportZIP(project);
      }
      const msg = path ? `Web exportada en: ${path}` : "Página exportada correctamente";
      addToast(msg);
    } catch (e) {
      addToast("Error al exportar: " + (e instanceof Error ? e.message : "desconocido"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={true} onClose={() => setShowExportDialog(false)} title="Exportar Página">
      <div className="space-y-4">
        <p className="text-sm text-editor-text-sec">
          Elige cómo quieres exportar tu página web.
        </p>

        <div className="grid gap-3">
          {[
            { id: "standalone" as const, icon: FileDown, label: "HTML standalone", desc: "Un solo archivo .html con todo incluido. Ideal para Netlify, GitHub Pages." },
            { id: "assets" as const, icon: Download, label: "HTML + carpeta de assets", desc: "El HTML y las imágenes en una carpeta. Ideal para FTP." },
            { id: "zip" as const, icon: FileArchive, label: "ZIP comprimido", desc: "Todo comprimido en un archivo .zip listo para enviar." },
          ].map(({ id, icon: Icon, label, desc }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                mode === id
                  ? "border-editor-accent bg-editor-accent/10"
                  : "border-editor-border bg-editor-secondary hover:border-editor-accent/50"
              }`}
            >
              <Icon size={24} className="text-editor-accent shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-sm">{label}</div>
                <div className="text-xs text-editor-text-sec mt-0.5">{desc}</div>
              </div>
            </button>
          ))}
        </div>

        <button onClick={handleExport} disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-50">
          <Download size={16} />
          {loading ? "Exportando..." : `Exportar como ${mode === "standalone" ? "HTML" : mode === "assets" ? "HTML + Assets" : "ZIP"}`}
        </button>

        <div className="text-xs text-editor-text-sec bg-editor-tertiary p-3 rounded-lg">
          <strong className="text-editor-text">¿Qué se exporta?</strong>
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            <li>Todo el contenido de tu página</li>
            <li>Los colores y fuentes que elegiste</li>
            <li>Meta tags para SEO y redes sociales</li>
            <li>Las imágenes que subiste</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
