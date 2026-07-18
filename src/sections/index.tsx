import { useState, useRef } from "react";
import type { Section } from "../types";
import { useProjectStore } from "../store/projectStore";
import SectionWrapper from "../components/SectionWrapper";
import RichTextEditor from "../components/RichTextEditor";

interface SortableSectionProps {
  section: Section;
  index: number;
  total: number;
}

export default function SortableSection({ section, index, total }: SortableSectionProps) {
  const { project, updateSection, editor } = useProjectStore();
  if (!project) return null;

  const content = section.content;

  const renderContent = () => {
    switch (section.type) {
      case "hero":
        return <HeroSection content={content} onChange={(c) => updateSection(section.id, c)} />;
      case "text":
        return <TextSection content={content} onChange={(c) => updateSection(section.id, c)} />;
      case "text-image":
        return <TextImageSection content={content} onChange={(c) => updateSection(section.id, c)} />;
      case "tabs":
        return <TabsSection content={content} onChange={(c) => updateSection(section.id, c)} />;
      case "accordion":
        return <AccordionSection content={content} onChange={(c) => updateSection(section.id, c)} />;
      case "cards":
        return <CardsSection content={content} onChange={(c) => updateSection(section.id, c)} />;
      case "cta":
        return <CTASection content={content} onChange={(c) => updateSection(section.id, c)} />;
      case "spacer":
        return <SpacerSection content={content} onChange={(c) => updateSection(section.id, c)} />;
      case "video":
        return <VideoSection content={content} onChange={(c) => updateSection(section.id, c)} />;
      case "gallery":
        return <GallerySection content={content} onChange={(c) => updateSection(section.id, c)} />;
      case "header":
        return <HeaderSection content={content} onChange={(c) => updateSection(section.id, c)} />;
      case "footer":
        return <FooterSection content={content} onChange={(c) => updateSection(section.id, c)} />;
      case "testimonials":
        return <TestimonialsSection content={content} onChange={(c) => updateSection(section.id, c)} />;
      case "counter":
        return <CounterSection content={content} onChange={(c) => updateSection(section.id, c)} />;
      case "features":
        return <FeaturesSection content={content} onChange={(c) => updateSection(section.id, c)} />;
      case "form":
        return <FormSection content={content} onChange={(c) => updateSection(section.id, c)} />;
      case "divider":
        return <DividerSection content={content} onChange={(c) => updateSection(section.id, c)} />;
      default:
        return <div className="p-4 text-editor-text-sec">Sección: {section.type}</div>;
    }
  };

  if (editor.isPreviewMode) {
    return <>{renderContent()}</>;
  }

  return (
    <SectionWrapper section={section} index={index} total={total}>
      {renderContent()}
    </SectionWrapper>
  );
}

/* ===== SECTION COMPONENTS ===== */

function HeroSection({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  return (
    <div
      data-tutorial="hero"
      className="rounded-xl text-white overflow-hidden"
      style={{
        background: `linear-gradient(135deg, var(--accent), var(--accent-hover))`,
        textAlign: ((content.align as string) || "center") as React.CSSProperties["textAlign"],
        minHeight: content.fullHeight ? "100vh" : "auto",
      }}
    >
      <div className="p-8 md:p-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
          <RichTextEditor
            content={(content.title as string) || "<p>Tu Título Aquí</p>"}
            onChange={(v) => onChange({ ...content, title: v })}
            placeholder="Título principal"
            singleLine
          />
        </h1>
        <p className="text-lg md:text-xl mb-6 opacity-90 max-w-2xl mx-auto">
          <RichTextEditor
            content={(content.subtitle as string) || "<p>Escribe un subtítulo impactante</p>"}
            onChange={(v) => onChange({ ...content, subtitle: v })}
            placeholder="Subtítulo"
            singleLine
          />
        </p>
        {content.ctaText ? (
          <RichTextEditor
            content={(content.ctaText as string) || "<p>Llamada a la Acción</p>"}
            onChange={(v) => onChange({ ...content, ctaText: v })}
            placeholder="Texto del botón"
            singleLine
          />
        ) : (
          <button
            onClick={() => onChange({ ...content, ctaText: "<p>Llamada a la Acción</p>" })}
            className="px-6 py-3 bg-white/20 rounded-lg font-semibold backdrop-blur-sm cursor-default"
          >
            + Añadir botón
          </button>
        )}
      </div>
      <Properties>
        <PropInput label="URL del botón" value={content.ctaUrl as string} onChange={(v) => onChange({ ...content, ctaUrl: v })} tutorialKey="prop-url" />
        <PropSelect label="Alineación" value={(content.align as string) || "center"} onChange={(v) => onChange({ ...content, align: v })} options={[{ value: "left", label: "Izquierda" }, { value: "center", label: "Centro" }, { value: "right", label: "Derecha" }]} tutorialKey="prop-align" />
      </Properties>
    </div>
  );
}

function TextSection({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl md:text-3xl font-bold">
        <RichTextEditor
          content={(content.title as string) || "<p>Título de Sección</p>"}
          onChange={(v) => onChange({ ...content, title: v })}
          placeholder="Título"
          singleLine
        />
      </h2>
      <RichTextEditor
        content={(content.content as string) || "<p>Haz click aquí para editar este texto.</p>"}
        onChange={(v) => onChange({ ...content, content: v })}
        placeholder="Escribe tu contenido aquí..."
      />
    </div>
  );
}

function TextImageSection({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const layout = (content.layout as string) || "right";

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      onChange({ ...content, imageSrc: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div data-tutorial="text-image" className={`p-6 flex flex-col ${layout === "left" ? "md:flex-row-reverse" : "md:flex-row"} gap-6 items-start`}>
      <div className="flex-1 min-w-[200px]">
        <div className="relative group/image rounded-xl overflow-hidden bg-editor-tertiary">
          {content.imageSrc ? (
            <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
              <img
                src={content.imageSrc as string}
                alt={(content.imageAlt as string) || ""}
                className="w-full h-auto object-cover rounded-xl"
                style={{ maxHeight: 400 }}
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center">
                <span className="text-white text-sm opacity-0 hover:opacity-100">Click para cambiar</span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center h-48 text-editor-text-sec text-sm cursor-pointer hover:bg-editor-tertiary/80 transition-colors"
            >
              Sin imagen
            </div>
          )}
          <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleImageUpload} />
        </div>
      </div>
      <div className="flex-1 min-w-[200px]">
        <RichTextEditor
          content={(content.content as string) || "<p>Texto junto a la imagen.</p>"}
          onChange={(v) => onChange({ ...content, content: v })}
          placeholder="Escribe tu contenido..."
        />
      </div>
      <Properties>
        <PropInput label="URL de la imagen" value={content.imageSrc as string} onChange={(v) => onChange({ ...content, imageSrc: v })} />
        <PropInput label="Texto alternativo" value={content.imageAlt as string} onChange={(v) => onChange({ ...content, imageAlt: v })} />
        <PropSelect label="Layout" value={layout} onChange={(v) => onChange({ ...content, layout: v })} options={[{ value: "left", label: "Imagen izquierda" }, { value: "right", label: "Imagen derecha" }]} />
      </Properties>
    </div>
  );
}

function TabsSection({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const tabs = (content.tabs as Array<{ title: string; content: string }>) || [
    { title: "Pestaña 1", content: "<p>Contenido de la primera pestaña</p>" },
    { title: "Pestaña 2", content: "<p>Contenido de la segunda pestaña</p>" },
  ];
  const [active, setActive] = useState(0);

  const updateTab = (i: number, field: string, val: string) => {
    const updated = tabs.map((t, idx) => (idx === i ? { ...t, [field]: val } : t));
    onChange({ ...content, tabs: updated });
  };

  return (
    <div className="p-6">
      <div className="flex border-b border-editor-border mb-4 gap-1 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 transition-colors ${
              i === active ? "border-editor-accent text-editor-accent" : "border-transparent text-editor-text-sec"
            }`}
          >
            <RichTextEditor
              content={tab.title || `<p>Pestaña ${i + 1}</p>`}
              onChange={(v) => updateTab(i, "title", v)}
              placeholder="Nombre"
              singleLine
            />
          </button>
        ))}
        <button
          onClick={() => onChange({ ...content, tabs: [...tabs, { title: `<p>Pestaña ${tabs.length + 1}</p>`, content: "<p>Nuevo contenido</p>" }] })}
          className="px-3 py-2 text-editor-accent text-sm font-medium"
        >
          + Añadir
        </button>
      </div>
      <div className="animate-fade-in">
        <RichTextEditor
          content={tabs[active]?.content || ""}
          onChange={(v) => updateTab(active, "content", v)}
          placeholder="Contenido de la pestaña"
        />
      </div>
    </div>
  );
}

function AccordionSection({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const panels = (content.panels as Array<{ title: string; content: string }>) || [
    { title: "Panel 1", content: "<p>Contenido del panel</p>" },
  ];
  const [open, setOpen] = useState<number[]>([]);

  const toggle = (i: number) => {
    setOpen((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  };

  const updatePanel = (i: number, field: string, val: string) => {
    const updated = panels.map((p, idx) => (idx === i ? { ...p, [field]: val } : p));
    onChange({ ...content, panels: updated });
  };

  return (
    <div className="p-6 space-y-2">
      {panels.map((panel, i) => (
        <div key={i} className="border border-editor-border rounded-xl overflow-hidden bg-editor-secondary">
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between p-4 bg-editor-tertiary hover:bg-editor-tertiary/80 transition-colors text-left"
          >
            <RichTextEditor
              content={panel.title || `<p>Panel ${i + 1}</p>`}
              onChange={(v) => updatePanel(i, "title", v)}
              placeholder="Título del panel"
              singleLine
            />
            <span className={`transition-transform shrink-0 ${open.includes(i) ? "rotate-180" : ""}`}>▼</span>
          </button>
          {open.includes(i) && (
            <div className="p-4 animate-fade-in">
              <RichTextEditor
                content={panel.content}
                onChange={(v) => updatePanel(i, "content", v)}
                placeholder="Contenido del panel"
              />
            </div>
          )}
        </div>
      ))}
      <button
        onClick={() => onChange({ ...content, panels: [...panels, { title: `<p>Panel ${panels.length + 1}</p>`, content: "<p>Nuevo panel</p>" }] })}
        className="text-sm text-editor-accent hover:underline"
      >
        + Añadir panel
      </button>
    </div>
  );
}

function CardsSection({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const items = (content.items as Array<{ title: string; description: string; icon: string }>) || [
    { title: "Rápido", description: "Edita todo sin código", icon: "🚀" },
    { title: "Flexible", description: "Arrastra y suelta elementos", icon: "🎨" },
    { title: "Moderno", description: "Diseño profesional", icon: "✨" },
  ];

  return (
    <div className="p-6">
      <div className="text-2xl font-bold text-center mb-6">
        <RichTextEditor
          content={(content.title as string) || "<p>Tarjetas de Contenido</p>"}
          onChange={(v) => onChange({ ...content, title: v })}
          placeholder="Título de la sección"
          singleLine
        />
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))` }}>
        {items.map((item, i) => (
          <div key={i} className="bg-editor-tertiary p-5 rounded-xl border border-editor-border text-center">
            <div className="text-3xl mb-3">{item.icon || "📄"}</div>
            <div className="text-lg font-semibold mb-2">
              <RichTextEditor
                content={item.title}
                onChange={(v) => {
                  const updated = items.map((x, idx) => idx === i ? { ...x, title: v } : x);
                  onChange({ ...content, items: updated });
                }}
                placeholder="Título"
                singleLine
              />
            </div>
            <div className="text-sm text-editor-text-sec">
              <RichTextEditor
                content={item.description}
                onChange={(v) => {
                  const updated = items.map((x, idx) => idx === i ? { ...x, description: v } : x);
                  onChange({ ...content, items: updated });
                }}
                placeholder="Descripción"
                singleLine
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CTASection({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  return (
    <div className="p-8 text-center bg-editor-secondary rounded-xl border border-editor-border m-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-3">
        <RichTextEditor
          content={(content.title as string) || "<p>¿Listo para empezar?</p>"}
          onChange={(v) => onChange({ ...content, title: v })}
          placeholder="Título"
          singleLine
        />
      </h2>
      <p className="text-base mb-6 max-w-lg mx-auto text-editor-text-sec">
        <RichTextEditor
          content={(content.subtitle as string) || "<p>Crea tu página web sin necesidad de saber programación</p>"}
          onChange={(v) => onChange({ ...content, subtitle: v })}
          placeholder="Subtítulo"
          singleLine
        />
      </p>
      <RichTextEditor
        content={(content.buttonText as string) || "<p>Comenzar Ahora</p>"}
        onChange={(v) => onChange({ ...content, buttonText: v })}
        placeholder="Texto del botón"
        singleLine
      />
      <Properties>
        <PropInput label="URL del botón" value={content.buttonUrl as string} onChange={(v) => onChange({ ...content, buttonUrl: v })} />
      </Properties>
    </div>
  );
}

function SpacerSection({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const height = Math.min(Math.max((content.height as number) || 40, 20), 200);
  return (
    <div className="relative group py-2">
      <div style={{ height }} className="bg-editor-tertiary/20 rounded" />
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
        <input
          type="range"
          min={20}
          max={200}
          value={height}
          onChange={(e) => onChange({ ...content, height: parseInt(e.target.value) })}
          className="w-24"
        />
        <span className="text-xs text-editor-text-sec">{height}px</span>
      </div>
    </div>
  );
}

function VideoSection({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const ratio = (content.ratio as string) || "16:9";
  const [ratioW, ratioH] = ratio.split(":").map(Number);

  return (
    <div className="p-6">
      <div className="text-xl font-bold mb-4">
        <RichTextEditor
          content={(content.title as string) || "<p>Video</p>"}
          onChange={(v) => onChange({ ...content, title: v })}
          placeholder="Título del video"
          singleLine
        />
      </div>
      <div className="rounded-xl overflow-hidden bg-editor-tertiary" style={{ aspectRatio: `${ratioW}/${ratioH}` }}>
        {content.embedUrl ? (
          <iframe
            src={content.embedUrl as string}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : content.localSrc ? (
          <video controls className="w-full h-full object-contain">
            <source src={content.localSrc as string} />
          </video>
        ) : (
          <div className="flex items-center justify-center h-full text-editor-text-sec text-sm">
            Añade una URL de video (YouTube/Vimeo)
          </div>
        )}
      </div>
      <Properties>
        <PropInput label="URL del video" value={content.embedUrl as string} onChange={(v) => onChange({ ...content, embedUrl: v })} />
        <PropSelect label="Formato" value={ratio} onChange={(v) => onChange({ ...content, ratio: v })} options={[{ value: "16:9", label: "16:9" }, { value: "4:3", label: "4:3" }, { value: "1:1", label: "1:1" }]} />
      </Properties>
    </div>
  );
}

function GallerySection({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const items = (content.items as Array<{ src: string; alt: string }>) || [
    { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop", alt: "Foto 1" },
  ];
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleGalleryUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const updated = items.map((item, idx) =>
        idx === index ? { ...item, src: dataUrl } : item
      );
      onChange({ ...content, items: updated });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6">
      <div className="text-xl font-bold mb-4 text-center">
        <RichTextEditor
          content={(content.title as string) || "<p>Galería</p>"}
          onChange={(v) => onChange({ ...content, title: v })}
          placeholder="Título"
          singleLine
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-editor-tertiary aspect-square">
            {item.src ? (
              <div onClick={() => fileInputRefs.current[i]?.click()} className="w-full h-full cursor-pointer relative group/gallery-img">
                <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center">
                  <span className="text-white text-sm opacity-0 group-hover/gallery-img:opacity-100">Cambiar</span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRefs.current[i]?.click()}
                className="flex items-center justify-center h-full text-editor-text-sec text-sm cursor-pointer hover:bg-editor-tertiary/80 transition-colors"
              >
                Sin imagen
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              hidden
              ref={(el) => { fileInputRefs.current[i] = el; }}
              onChange={(e) => handleGalleryUpload(i, e)}
            />
          </div>
        ))}
      </div>
      <button
        onClick={() => onChange({ ...content, items: [...items, { src: "", alt: `Foto ${items.length + 1}` }] })}
        className="mt-3 text-sm text-editor-accent hover:underline"
      >
        + Añadir imagen
      </button>
    </div>
  );
}

function HeaderSection({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const links = (content.links as Array<{ label: string; url: string }>) || [
    { label: "Inicio", url: "#" },
  ];

  return (
    <div className="flex items-center justify-between p-4 bg-editor-secondary border-b border-editor-border">
      <RichTextEditor
        content={(content.logoText as string) || "<p>Logo</p>"}
        onChange={(v) => onChange({ ...content, logoText: v })}
        placeholder="Logo"
        singleLine
      />
      <div className="flex gap-4 items-center">
        {links.map((link, i) => (
          <div key={i} className="text-sm text-editor-text-sec">
            <RichTextEditor
              content={link.label}
              onChange={(v) => {
                const updated = links.map((x, idx) => idx === i ? { ...x, label: v } : x);
                onChange({ ...content, links: updated });
              }}
              placeholder="Enlace"
              singleLine
            />
          </div>
        ))}
        <button
          onClick={() => onChange({ ...content, links: [...links, { label: "Nuevo", url: "#" }] })}
          className="text-xs text-editor-accent"
        >
          + Añadir
        </button>
      </div>
    </div>
  );
}

function FooterSection({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  return (
    <div className="p-6 bg-editor-secondary border-t border-editor-border text-center">
      <div className="text-lg font-bold text-editor-accent mb-2">
        <RichTextEditor
          content={(content.logoText as string) || "<p>WebCraft</p>"}
          onChange={(v) => onChange({ ...content, logoText: v })}
          placeholder="Logo"
          singleLine
        />
      </div>
      <div className="text-sm text-editor-text-sec max-w-md mx-auto mb-3">
        <RichTextEditor
          content={(content.description as string) || "<p>Descripción del footer</p>"}
          onChange={(v) => onChange({ ...content, description: v })}
          placeholder="Descripción"
          singleLine
        />
      </div>
      <div className="text-xs text-editor-text-sec">© {new Date().getFullYear()} {(content.logoText as string) || "WebCraft"}</div>
    </div>
  );
}

function TestimonialsSection({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const items = (content.items as Array<{ name: string; role: string; text: string; rating: number }>) || [
    { name: "Cliente", role: "Cliente", text: "Excelente servicio, muy recomendable.", rating: 5 },
  ];

  return (
    <div className="p-6">
      <div className="text-xl font-bold text-center mb-6">
        <RichTextEditor
          content={(content.title as string) || "<p>Testimonios</p>"}
          onChange={(v) => onChange({ ...content, title: v })}
          placeholder="Título"
          singleLine
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {items.map((item, i) => (
          <div key={i} className="bg-editor-tertiary p-5 rounded-xl border border-editor-border">
            <div className="flex gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, s) => (
                <span key={s} className={s < item.rating ? "text-yellow-400" : "text-editor-border"}>★</span>
              ))}
            </div>
            <div className="text-sm mb-3 italic">
              <RichTextEditor
                content={item.text}
                onChange={(v) => {
                  const updated = items.map((x, idx) => idx === i ? { ...x, text: v } : x);
                  onChange({ ...content, items: updated });
                }}
                placeholder="Opinión del cliente"
                singleLine
              />
            </div>
            <div className="text-sm font-semibold">
              <RichTextEditor
                content={item.name}
                onChange={(v) => {
                  const updated = items.map((x, idx) => idx === i ? { ...x, name: v } : x);
                  onChange({ ...content, items: updated });
                }}
                placeholder="Nombre"
                singleLine
              />
            </div>
            <div className="text-xs text-editor-text-sec">
              <RichTextEditor
                content={item.role}
                onChange={(v) => {
                  const updated = items.map((x, idx) => idx === i ? { ...x, role: v } : x);
                  onChange({ ...content, items: updated });
                }}
                placeholder="Cargo"
                singleLine
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => onChange({ ...content, items: [...items, { name: "Nuevo", role: "Cliente", text: "Opinión", rating: 5 }] })}
        className="mt-3 text-sm text-editor-accent hover:underline mx-auto block"
      >
        + Añadir testimonio
      </button>
    </div>
  );
}

function CounterSection({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const items = (content.items as Array<{ value: number; label: string; suffix: string }>) || [
    { value: 500, label: "Clientes", suffix: "+" },
  ];

  return (
    <div className="p-6 text-center">
      <div className="text-xl font-bold mb-6">
        <RichTextEditor
          content={(content.title as string) || "<p>En números</p>"}
          onChange={(v) => onChange({ ...content, title: v })}
          placeholder="Título"
          singleLine
        />
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
        {items.map((item, i) => (
          <div key={i}>
            <div className="text-3xl md:text-4xl font-bold text-editor-accent">
              {item.value}{item.suffix || ""}
            </div>
            <RichTextEditor
              content={item.label}
              onChange={(v) => {
                const updated = items.map((x, idx) => idx === i ? { ...x, label: v } : x);
                onChange({ ...content, items: updated });
              }}
              placeholder="Etiqueta"
              singleLine
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesSection({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const items = (content.items as Array<{ icon: string; title: string; description: string }>) || [
    { icon: "⚡", title: "Rápido", description: "Funciona al instante" },
  ];

  return (
    <div className="p-6">
      <div className="text-xl font-bold text-center mb-6">
        <RichTextEditor
          content={(content.title as string) || "<p>Características</p>"}
          onChange={(v) => onChange({ ...content, title: v })}
          placeholder="Título"
          singleLine
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3 items-start p-4 bg-editor-tertiary rounded-xl border border-editor-border">
            <span className="text-2xl shrink-0">{item.icon || "📄"}</span>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm">
                <RichTextEditor
                  content={item.title}
                  onChange={(v) => {
                    const updated = items.map((x, idx) => idx === i ? { ...x, title: v } : x);
                    onChange({ ...content, items: updated });
                  }}
                  placeholder="Título"
                  singleLine
                />
              </div>
              <div className="text-xs text-editor-text-sec mt-0.5">
                <RichTextEditor
                  content={item.description}
                  onChange={(v) => {
                    const updated = items.map((x, idx) => idx === i ? { ...x, description: v } : x);
                    onChange({ ...content, items: updated });
                  }}
                  placeholder="Descripción"
                  singleLine
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => onChange({ ...content, items: [...items, { icon: "✨", title: "Nueva", description: "Descripción" }] })}
        className="mt-3 text-sm text-editor-accent hover:underline mx-auto block"
      >
        + Añadir característica
      </button>
    </div>
  );
}

function FormSection({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const fields = (content.fields as Array<{ name: string; label: string; type: string; required: boolean }>) || [
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "mensaje", label: "Mensaje", type: "textarea", required: true },
  ];

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="text-xl font-bold text-center mb-6">
        <RichTextEditor
          content={(content.title as string) || "<p>Contacto</p>"}
          onChange={(v) => onChange({ ...content, title: v })}
          placeholder="Título"
          singleLine
        />
      </div>
      <div className="space-y-4">
        {fields.map((field, i) => (
          <div key={i}>
            <label className="block text-sm font-medium mb-1">{field.label}{field.required ? " *" : ""}</label>
            {field.type === "textarea" ? (
              <textarea className="form-input h-24" placeholder={field.label} />
            ) : (
              <input type={field.type} className="form-input" placeholder={field.label} />
            )}
          </div>
        ))}
        <div className="text-center">
          <RichTextEditor
            content={(content.buttonText as string) || "<p>Enviar</p>"}
            onChange={(v) => onChange({ ...content, buttonText: v })}
            placeholder="Texto del botón"
            singleLine
          />
        </div>
      </div>
    </div>
  );
}

function DividerSection({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const style = (content.style as string) || "solid";
  const bgGradient = style === "gradient" ? "linear-gradient(90deg, transparent, var(--accent), transparent)" : undefined;

  return (
    <div className="py-6 px-6">
      <hr
        style={{
          borderStyle: style === "dotted" ? "dotted" : "solid",
          borderColor: style === "gradient" ? "transparent" : "var(--border)",
          height: 1,
          background: bgGradient,
        }}
      />
    </div>
  );
}

/* ===== HELPERS ===== */

function Properties({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-editor-border mt-4 pt-3 px-6 pb-4 opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
      <div className="text-xs font-semibold text-editor-text-sec uppercase tracking-wider mb-2">Propiedades</div>
      {children}
    </div>
  );
}

function PropInput({ label, value, onChange, tutorialKey }: { label: string; value?: string; onChange: (v: string) => void; tutorialKey?: string }) {
  return (
    <div data-tutorial={tutorialKey} className="flex items-center gap-2">
      <label className="text-xs text-editor-text-sec w-28 shrink-0">{label}</label>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-editor-tertiary border border-editor-border rounded px-2 py-1 text-xs text-editor-text outline-none focus:border-editor-accent"
      />
    </div>
  );
}

function PropSelect({ label, value, onChange, options, tutorialKey }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; tutorialKey?: string }) {
  return (
    <div data-tutorial={tutorialKey} className="flex items-center gap-2">
      <label className="text-xs text-editor-text-sec w-28 shrink-0">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-editor-tertiary border border-editor-border rounded px-2 py-1 text-xs text-editor-text outline-none">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
