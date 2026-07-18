import type { Section } from "../types";
import { useProjectStore } from "../store/projectStore";
import { useCallback, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowUp, ArrowDown, Copy, Trash2, Eye, EyeOff, GripVertical,
  ClipboardPaste, Repeat,
} from "lucide-react";

interface SectionWrapperProps {
  section: Section;
  index: number;
  total: number;
  children: React.ReactNode;
}

export default function SectionWrapper({ section, index, total, children }: SectionWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);
  const {
    duplicateSection, deleteSection, toggleVisibility, moveSection,
    copySection, pasteSection, convertSection, selectSection,
    editor, addToast,
  } = useProjectStore();

  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging, overIndex, activeIndex,
  } = useSortable({ id: section.id });

  const isDropTarget = activeIndex !== undefined && activeIndex !== index && overIndex === index;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleConvert = useCallback(() => {
    const types = ["hero", "text", "text-image", "cta", "cards", "tabs", "accordion"];
    const newType = prompt(
      `Convertir a: ${types.join(", ")}\n(Actual: ${section.type})`
    );
    if (newType && types.includes(newType)) {
      if (confirm(`¿Convertir de "${section.type}" a "${newType}"? No se perderá contenido.`)) {
        convertSection(section.id, newType as typeof section.type);
        addToast(`Sección convertida a ${newType}`);
      }
    }
  }, [section, convertSection, addToast]);

  if (editor.isPreviewMode) {
    return <div className={!section.visible ? "hidden" : ""}>{children}</div>;
  }

  const isSelected = editor.selectedSectionId === section.id;
  const controlsVisible = isHovered || isSelected;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative border border-transparent min-h-[60px] group mb-4 rounded-xl transition-all ${
        !section.visible ? "opacity-40" : ""
      } ${isSelected ? "border-indigo-500 selected-section" : "hover:border-gray-300"} ${
        isDropTarget && !isDragging ? "border-indigo-500 ring-2 ring-indigo-500" : ""
      }`}
      onClick={() => selectSection(section.id)}
    >
      <div className={`absolute top-2 right-2 z-50 flex gap-1 transition-opacity ${
        controlsVisible ? "opacity-100" : "opacity-0"
      }`}>
        <button
          {...attributes}
          {...listeners}
          className="section-btn cursor-grab active:cursor-grabbing"
          title="Arrastrar para mover"
        >
          <GripVertical size={14} />
        </button>
        <button onClick={() => moveSection(index, Math.max(0, index - 1))} disabled={index === 0} className="section-btn" title="Mover arriba">
          <ArrowUp size={14} />
        </button>
        <button onClick={() => moveSection(index, Math.min(total - 1, index + 1))} disabled={index === total - 1} className="section-btn" title="Mover abajo">
          <ArrowDown size={14} />
        </button>
        <button onClick={() => { duplicateSection(section.id); addToast("Sección duplicada"); }} className="section-btn" title="Duplicar">
          <Copy size={14} />
        </button>
        <button onClick={() => { copySection(section.id); }} className="section-btn" title="Copiar">
          <ClipboardPaste size={14} />
        </button>
        <button onClick={handleConvert} className="section-btn" title="Convertir a...">
          <Repeat size={14} />
        </button>
        <button onClick={() => toggleVisibility(section.id)} className="section-btn" title={section.visible ? "Ocultar" : "Mostrar"}>
          {section.visible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        <button onClick={() => { if (confirm("¿Eliminar esta sección?")) deleteSection(section.id); }} className="section-btn text-editor-danger hover:bg-red-500/20" title="Eliminar">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="pointer-events-auto">{children}</div>
    </div>
  );
}
