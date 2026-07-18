import { useState } from "react";
import { useProjectStore } from "../store/projectStore";
import SortableSection from "../sections/index";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  DragOverlay, type DragEndEvent, type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { GripVertical } from "lucide-react";

export default function Editor() {
  const { project, moveSection, setSections, editor } = useProjectStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!project) return null;

  const allSections = project.sections;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = allSections.findIndex((s) => s.id === active.id);
    const to = allSections.findIndex((s) => s.id === over.id);
    if (from !== -1 && to !== -1) {
      moveSection(from, to);
    }
  }

  const containerClass =
    project.settings.layout.containerWidth === "narrow"
      ? "max-w-3xl"
      : project.settings.layout.containerWidth === "full"
      ? "max-w-full"
      : "max-w-5xl";

  const activeSection = activeId ? allSections.find((s) => s.id === activeId) : null;

  if (editor.isPreviewMode) {
    return (
      <div className={`mx-auto ${containerClass}`}>
        {allSections
          .filter((s) => s.visible)
          .map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              index={allSections.indexOf(section)}
              total={allSections.length}
            />
          ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <div data-tutorial="canvas" className={`mx-auto px-4 ${containerClass}`}>
        <div className="min-h-[calc(100vh-3rem)] py-6">
          {allSections.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-editor-text-sec">
              <p className="text-lg mb-4">Tu página está vacía</p>
              <button
                onClick={() => useProjectStore.getState().setShowComponentLibrary(true)}
                className="btn-primary"
              >
                Añadir tu primera sección
              </button>
            </div>
          ) : (
            <SortableContext
              items={allSections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {allSections.map((section, index) => (
                <div key={section.id}>
                  <SortableSection
                    section={section}
                    index={index}
                    total={allSections.length}
                  />
                </div>
              ))}
            </SortableContext>
          )}
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeSection ? (
          <div className="bg-editor-secondary border-2 border-indigo-500 rounded-xl p-4 shadow-xl opacity-90">
            <div className="flex items-center gap-2 text-sm text-editor-text-sec">
              <GripVertical size={14} />
              <span className="font-medium capitalize">{activeSection.type}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
