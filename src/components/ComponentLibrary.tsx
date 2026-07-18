import { useProjectStore } from "../store/projectStore";
import Modal from "./ui/Modal";
import type { SectionType } from "../types";
import {
  Heading, AlignLeft, Image as ImageIcon, Columns3, ChevronDown,
  LayoutGrid, Megaphone, ArrowUpDown, Video, Images, Menu,
  PanelBottom, MessageSquare, Sigma, List, ClipboardList, Minus,
} from "lucide-react";

const SECTION_TYPES: { type: SectionType; icon: typeof Heading; label: string; desc: string }[] = [
  { type: "hero", icon: Heading, label: "Hero", desc: "Título grande con imagen de fondo" },
  { type: "text", icon: AlignLeft, label: "Texto", desc: "Título y párrafos editables" },
  { type: "text-image", icon: ImageIcon, label: "Texto + Imagen", desc: "Texto con imagen al lado" },
  { type: "tabs", icon: Columns3, label: "Pestañas", desc: "Contenido en pestañas" },
  { type: "accordion", icon: ChevronDown, label: "Panel Expandible", desc: "Acordeón con contenido plegable" },
  { type: "cards", icon: LayoutGrid, label: "Tarjetas", desc: "Grid de tarjetas" },
  { type: "cta", icon: Megaphone, label: "CTA", desc: "Llamada a la acción" },
  { type: "spacer", icon: ArrowUpDown, label: "Espaciador", desc: "Espacio en blanco" },
  { type: "video", icon: Video, label: "Video", desc: "Video embebido o local" },
  { type: "gallery", icon: Images, label: "Galería", desc: "Grid o carrusel de imágenes" },
  { type: "header", icon: Menu, label: "Header", desc: "Barra de navegación" },
  { type: "footer", icon: PanelBottom, label: "Footer", desc: "Pie de página" },
  { type: "testimonials", icon: MessageSquare, label: "Testimonios", desc: "Opiniones de clientes" },
  { type: "counter", icon: Sigma, label: "Contador", desc: "Estadísticas animadas" },
  { type: "features", icon: List, label: "Lista", desc: "Características con iconos" },
  { type: "form", icon: ClipboardList, label: "Formulario", desc: "Formulario de contacto" },
  { type: "divider", icon: Minus, label: "Separador", desc: "Línea decorativa" },
];

export default function ComponentLibrary() {
  const { setShowComponentLibrary, addSection, addToast } = useProjectStore();

  const handleAdd = (type: SectionType) => {
    addSection(type);
    setShowComponentLibrary(false);
    addToast("Sección añadida");
  };

  return (
    <Modal open={true} onClose={() => setShowComponentLibrary(false)} title="Añadir Sección" wide>
      <p className="text-sm text-editor-text-sec mb-4">
        Elige el tipo de sección que quieres añadir a tu página.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {SECTION_TYPES.map(({ type, icon: Icon, label, desc }) => (
          <button
            key={type}
            onClick={() => handleAdd(type)}
            className="flex flex-col items-center gap-2 p-4 bg-editor-tertiary rounded-xl border border-transparent hover:border-editor-accent hover:shadow-lg hover:shadow-editor-accent/10 transition-all"
          >
            <Icon size={24} className="text-editor-accent" />
            <div className="text-center">
              <div className="font-medium text-sm">{label}</div>
              <div className="text-xs text-editor-text-sec mt-0.5">{desc}</div>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
