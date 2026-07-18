import { useState, useEffect } from "react";
import { useProjectStore } from "../store/projectStore";
import Modal from "./ui/Modal";

export default function PageSettings() {
  const { project, updateTheme, updateLayout, updateSEO, updateSettings, setShowPageSettings, addToast } =
    useProjectStore();
  const [tab, setTab] = useState("general");

  if (!project) return null;

  const { settings } = project;

  return (
    <Modal
      open={true}
      onClose={() => setShowPageSettings(false)}
      title="Configuración de Página"
      wide
    >
      <div className="flex gap-6 border-b border-editor-border pb-4 mb-4 overflow-x-auto">
        {["general", "theme", "layout", "seo"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-sm pb-2 border-b-2 transition-colors whitespace-nowrap ${
              tab === t
                ? "text-editor-accent border-editor-accent"
                : "text-editor-text-sec border-transparent hover:text-editor-text"
            }`}
          >
            {t === "general" ? "General" : t === "theme" ? "Tema" : t === "layout" ? "Diseño" : "SEO"}
          </button>
        ))}
      </div>

      {tab === "general" && (
        <div className="space-y-4">
          <div>
            <label className="form-label">Título de la Página</label>
            <input
              value={settings.pageTitle}
              onChange={(e) => updateSettings({ pageTitle: e.target.value })}
              className="form-input"
              placeholder="Mi Página Web"
            />
            <p className="text-xs text-editor-text-sec mt-1">El título que aparece en la pestaña del navegador</p>
          </div>
        </div>
      )}

      {tab === "theme" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Color de fondo</label>
              <input
                type="color"
                value={settings.theme.bgColor}
                onChange={(e) => updateTheme({ bgColor: e.target.value })}
                className="form-input h-12 p-1"
              />
              <p className="text-xs text-editor-text-sec mt-1">El color que se ve detrás de todo el contenido</p>
            </div>
            <div>
              <label className="form-label">Color de acento</label>
              <input
                type="color"
                value={settings.theme.accentColor}
                onChange={(e) => updateTheme({ accentColor: e.target.value })}
                className="form-input h-12 p-1"
              />
              <p className="text-xs text-editor-text-sec mt-1">El color principal de botones y enlaces</p>
            </div>
            <div>
              <label className="form-label">Color del texto</label>
              <input
                type="color"
                value={settings.theme.textColor}
                onChange={(e) => updateTheme({ textColor: e.target.value })}
                className="form-input h-12 p-1"
              />
            </div>
            <div>
              <label className="form-label">Color de fondo de tarjetas</label>
              <input
                type="color"
                value={settings.theme.cardBgColor}
                onChange={(e) => updateTheme({ cardBgColor: e.target.value })}
                className="form-input h-12 p-1"
              />
            </div>
            <div>
              <label className="form-label">Color de bordes</label>
              <input
                type="color"
                value={settings.theme.borderColor}
                onChange={(e) => updateTheme({ borderColor: e.target.value })}
                className="form-input h-12 p-1"
              />
            </div>
            <div>
              <label className="form-label">Modo</label>
              <select
                value={settings.theme.mode}
                onChange={(e) => updateTheme({ mode: e.target.value as "dark" | "light" })}
                className="form-input"
              >
                <option value="dark">Oscuro</option>
                <option value="light">Claro</option>
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Fuente principal</label>
            <select
              value={settings.theme.fontFamily}
              onChange={(e) => updateTheme({ fontFamily: e.target.value })}
              className="form-input"
            >
              {["Inter", "system-ui", "Roboto", "Open Sans", "Playfair Display", "Georgia", "Courier New"].map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <p className="text-xs text-editor-text-sec mt-1">Cambia el tipo de letra de toda la página</p>
          </div>
          <div>
            <label className="form-label">CSS personalizado (opcional)</label>
            <textarea
              value={settings.theme.customCSS}
              onChange={(e) => updateTheme({ customCSS: e.target.value })}
              className="form-input h-24 font-mono text-xs"
              placeholder=".mi-clase { color: red; }"
            />
            <p className="text-xs text-editor-text-sec mt-1">Solo si sabes CSS. Afecta a toda la página.</p>
          </div>
        </div>
      )}

      {tab === "layout" && (
        <div className="space-y-4">
          <div>
            <label className="form-label">Layout del menú</label>
            <select
              value={settings.layout.menuLayout}
              onChange={(e) => updateLayout({ menuLayout: e.target.value as typeof settings.layout.menuLayout })}
              className="form-input"
            >
              <option value="horizontal">Horizontal Superior</option>
              <option value="vertical-left">Vertical Izquierdo</option>
              <option value="vertical-right">Vertical Derecho</option>
              <option value="center">Centrado</option>
            </select>
          </div>
          <div>
            <label className="form-label">Ancho máximo del contenido</label>
            <select
              value={settings.layout.containerWidth}
              onChange={(e) => updateLayout({ containerWidth: e.target.value as typeof settings.layout.containerWidth })}
              className="form-input"
            >
              <option value="narrow">Angosto (800px)</option>
              <option value="normal">Normal (1200px)</option>
              <option value="full">Ancho completo</option>
            </select>
            <p className="text-xs text-editor-text-sec mt-1">Qué tan ancha se ve tu página en pantallas grandes</p>
          </div>
          <div>
            <label className="form-label">Controles en móvil</label>
            <select
              value={settings.layout.mobileControls}
              onChange={(e) => updateLayout({ mobileControls: e.target.value as typeof settings.layout.mobileControls })}
              className="form-input"
            >
              <option value="expanded">Expandidos</option>
              <option value="collapsed">Colapsados</option>
              <option value="hidden">Ocultos</option>
            </select>
          </div>
        </div>
      )}

      {tab === "seo" && (
        <div className="space-y-4">
          <div>
            <label className="form-label">Descripción (meta description)</label>
            <textarea
              value={settings.seo.description}
              onChange={(e) => updateSEO({ description: e.target.value })}
              className="form-input h-20"
              placeholder="Breve descripción para buscadores"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">OG: Título</label>
              <input
                value={settings.seo.ogTitle}
                onChange={(e) => updateSEO({ ogTitle: e.target.value })}
                className="form-input"
                placeholder="Para redes sociales"
              />
            </div>
            <div>
              <label className="form-label">OG: Descripción</label>
              <input
                value={settings.seo.ogDescription}
                onChange={(e) => updateSEO({ ogDescription: e.target.value })}
                className="form-input"
                placeholder="Para redes sociales"
              />
            </div>
            <div>
              <label className="form-label">OG: Imagen (URL)</label>
              <input
                value={settings.seo.ogImage}
                onChange={(e) => updateSEO({ ogImage: e.target.value })}
                className="form-input"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            <div>
              <label className="form-label">Favicon (URL)</label>
              <input
                value={settings.seo.favicon}
                onChange={(e) => updateSEO({ favicon: e.target.value })}
                className="form-input"
                placeholder="https://ejemplo.com/favicon.ico"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Google Analytics ID</label>
            <input
              value={settings.seo.gaId}
              onChange={(e) => updateSEO({ gaId: e.target.value })}
              className="form-input"
              placeholder="G-XXXXXXXXXX"
            />
            <p className="text-xs text-editor-text-sec mt-1">Opcional. Solo si tienes Google Analytics.</p>
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-editor-border">
        <button
          onClick={() => { setShowPageSettings(false); addToast("Configuración aplicada"); }}
          className="btn-primary w-full"
        >
          Aplicar Cambios
        </button>
      </div>
    </Modal>
  );
}
