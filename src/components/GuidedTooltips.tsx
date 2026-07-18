import { useEffect, useState, useRef, useCallback, useLayoutEffect } from "react";
import { useAppStore } from "../store/appStore";

interface TipData {
  title: string;
  desc: string;
  docAnchor: string;
}

const TIP_MAP: Record<string, TipData> = {
  "guardar-menu": {
    title: "💾 Guardar proyecto",
    desc: `Guardas todo el proyecto en el disco de tu máquina. Se recupera después desde "Recientes".

• Si cierras el navegador sin guardar, pierdes los cambios.
• Se guarda en ~/Documents/WebCraft/ como archivo .json.
• El icono de la nube ☁️ en la toolbar te dice si hay cambios sin guardar.

Tip: Pulsa F5 para ver cómo queda de verdad.`,
    docAnchor: "#guardar",
  },
  "add-section": {
    title: "➕ Añadir bloque",
    desc: `Abre el catálogo de bloques para añadir una sección nueva a tu web.

• Elige entre: Hero (portada), Texto, Imagen+Texto, Tabs, Acordeón, Cards, CTA, Separador, Video, Galería, Header, Footer, Testimonios, Contadores, Features, Formulario, Divisor.
• Cada bloque se añade al final de la página.
• Luego puedes arrastrarlo para reordenarlo en el canvas.

Tip: Pulsa F5 para ver cómo queda de verdad.`,
    docAnchor: "#anadir",
  },
  hero: {
    title: "🏠 Bloque HERO / Portada (DIRECTO A LA META)",
    desc: `Es la primera sección que ve el usuario. Debe impactar en menos de 3 segundos.

• TÍTULO GRANDE (H1): El encabezado principal. Google lo usa para entender el tema de tu web. Ej: "ELICAPE OS - Directo a la meta".
• SUBTÍTULO: Texto de apoyo debajo del título. Explica en 1 frase qué haces. Ej: "Soluciones simples y eficientes para tu negocio".
• BOTÓN (CTA): Llamada a la acción. En PROPIEDADES (abajo) puedes cambiar su Texto y su URL. Si no pones URL, el botón se ve pero no navega a ningún lado.

Tip: Pulsa F5 para ver cómo queda de verdad.`,
    docAnchor: "#hero",
  },
  "text-image": {
    title: "🖼️ Bloque Imagen + Texto",
    desc: `Grid de 2 columnas: a un lado una imagen y al otro texto editable.

• La imagen se puede subir desde tu PC o pegar una URL (Pega una URL de Unsplash, por ej).
• Si no pones imagen, se ve un recuadro gris con texto "Sin imagen".
• En PROPIEDADES puedes invertir el orden con "Layout": elige "Imagen izquierda" o "Imagen derecha".
• Útil para mostrar productos, servicios, o secciones "Sobre nosotros".

Ej: ELICAPE22 usa este bloque para mostrar una captura de pantalla de su software a la izquierda y una lista de features a la derecha.

Tip: Pulsa F5 para ver cómo queda de verdad.`,
    docAnchor: "#imagen_texto",
  },
  "prop-url": {
    title: "🔗 URL del Botón",
    desc: `Define a dónde irá el usuario al hacer clic en el botón.

• Debe ser una URL completa para enlaces externos. Ej: https://ejemplo.com/contacto
• Para ir a una sección de la misma página usa /#seccion. Ej: /#servicios
• Si lo dejas vacío, el botón se muestra visualmente pero no navega.
• Para que el botón abra WhatsApp usa: https://wa.me/34123456789
• Para un email: mailto:hola@ejemplo.com

Ej: miduDev usa /#contacto en su Hero para bajar suavemente al formulario de contacto.

Tip: Pulsa F5 para ver cómo queda de verdad.`,
    docAnchor: "#boton",
  },
  "prop-align": {
    title: "📐 Alineación",
    desc: `Controla dónde se coloca el contenido dentro del bloque.

• Izquierda: Ideal para landing pages con mucho texto, mejora la legibilidad.
• Centro: Valor por defecto. Perfecto para portadas (Hero) y CTAs.
• Derecha: Menos común, útil para diseños asimétricos o resaltar elementos laterales.
• Cambia el select y verás cómo se mueve el contenido en tiempo real.

Ej: ELICAPE22 usa alineación centrada en el Hero y alineación izquierda en los bloques de texto.

Tip: Pulsa F5 para ver cómo queda de verdad.`,
    docAnchor: "#texto",
  },
  preview: {
    title: "👁️ Vista Previa",
    desc: `Muestra tu web limpia, sin la interfaz del editor, tal como la verá tu cliente.

• Pulsa F5 como acceso directo (más rápido).
• Para salir de la vista previa pulsa F5 de nuevo o "Cerrar Vista Previa".
• Aquí puedes probar los enlaces y botones como funcionarán en producción.
• No puedes editar en modo vista previa; es solo para comprobar el resultado final.

Tip: Pulsa F5 para ver cómo queda de verdad.`,
    docAnchor: "#vista_previa",
  },
  export: {
    title: "📦 Exportar",
    desc: `Genera un archivo HTML listo para subir a cualquier hosting.

• El HTML incluye todo: estilos inline, imágenes en base64 (si las subiste), fuentes y scripts.
• Compatible con Netlify, Vercel, GitHub Pages, Hostinger, etc.
• El archivo se descarga automáticamente en tu PC.
• Si exportas para un cliente, el HTML se abre en cualquier navegador sin dependencias.

Ej: ELICAPE22 exporta el HTML y lo sube a Netlify en 1 clic desde el panel de arrastre.

Tip: Pulsa F5 para ver cómo queda de verdad.`,
    docAnchor: "#exportar",
  },
  canvas: {
    title: "🎨 Área de trabajo (Canvas)",
    desc: `Aquí ves y editas tu página web en tiempo real.

• Arrastra las secciones por el icono de 6 puntos ⋮⋮ para reordenarlas.
• Pasa el ratón por encima de cada sección para ver sus controles: mover, editar propiedades, duplicar, eliminar.
• Cada sección es independiente: puedes cambiar su contenido sin afectar a las demás.
• El canvas mide 1024px de ancho (vista desktop) por defecto.

Tip: Pulsa F5 para ver cómo queda de verdad.`,
    docAnchor: "#editor",
  },
  "toolbar-save": {
    title: "💾 Guardado rápido",
    desc: `Guarda el proyecto actual con un solo clic, sin abrir el menú.

• Es lo mismo que ir a Menú > Guardar.
• Siempre guarda antes de exportar o cerrar el navegador.
• Los proyectos guardados aparecen en "Recientes" al recargar la página.

Tip: Pulsa F5 para ver cómo queda de verdad.`,
    docAnchor: "#guardar",
  },
};

export default function GuidedTooltips() {
  const isTutorialMode = useAppStore((s) => s.isTutorialMode);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOnTooltipRef = useRef(false);

  const clearHide = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHide();
    hideTimerRef.current = setTimeout(() => {
      if (!isOnTooltipRef.current) {
        setActiveKey(null);
        targetRef.current = null;
      }
    }, 200);
  }, [clearHide]);

  useEffect(() => {
    if (!isTutorialMode) {
      setActiveKey(null);
      targetRef.current = null;
      return;
    }

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-tutorial]") as HTMLElement | null;
      if (!target) return;
      const key = target.dataset.tutorial;
      if (!key || !TIP_MAP[key] || dismissed.has(key)) return;
      clearHide();
      targetRef.current = target;
      setActiveKey(key);
    };

    const onOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-tutorial]") as HTMLElement | null;
      if (!target) return;
      scheduleHide();
    };

    document.addEventListener("mouseover", onOver, true);
    document.addEventListener("mouseout", onOut, true);
    return () => {
      document.removeEventListener("mouseover", onOver, true);
      document.removeEventListener("mouseout", onOut, true);
      clearHide();
    };
  }, [isTutorialMode, dismissed, clearHide, scheduleHide]);

  useLayoutEffect(() => {
    if (!activeKey || !tooltipRef.current || !targetRef.current) return;
    const tip = tooltipRef.current;
    const el = targetRef.current;
    const rect = el.getBoundingClientRect();
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    const { innerWidth, innerHeight } = window;

    let top = rect.bottom + 8;
    let left = rect.left + rect.width / 2 - tw / 2;

    if (top + th > innerHeight - 8) {
      top = rect.top - th - 8;
    }
    if (left < 8) left = 8;
    if (left + tw > innerWidth - 8) {
      left = innerWidth - tw - 8;
    }

    tip.style.top = `${top}px`;
    tip.style.left = `${left}px`;
  }, [activeKey]);

  if (!isTutorialMode || !activeKey) return null;

  const data = TIP_MAP[activeKey];
  if (!data) return null;

  const dismissTip = () => {
    setDismissed((prev) => new Set(prev).add(activeKey));
    setActiveKey(null);
    targetRef.current = null;
  };

  return (
    <div
      ref={tooltipRef}
      onMouseEnter={() => { isOnTooltipRef.current = true; clearHide(); }}
      onMouseLeave={() => { isOnTooltipRef.current = false; scheduleHide(); }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99999,
        background: "#1e293b",
        color: "#fff",
        border: "1px solid #6366f1",
        borderRadius: 12,
        padding: "14px 18px",
        maxWidth: 440,
        fontSize: 13,
        lineHeight: 1.5,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -6,
          left: "50%",
          marginLeft: -6,
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderBottom: "6px solid #6366f1",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <strong style={{ fontSize: 14, color: "#818cf8" }}>{data.title}</strong>
        <button
          onClick={() => { setActiveKey(null); targetRef.current = null; }}
          style={{
            background: "none", border: "none", color: "#94a3b8", cursor: "pointer",
            fontSize: 16, lineHeight: 1, padding: "0 2px",
          }}
          title="Cerrar"
        >
          ✕
        </button>
      </div>
      <div className="whitespace-pre-line text-sm leading-relaxed" style={{ color: "#cbd5e1", margin: 0 }}>{data.desc}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, fontSize: 12 }}>
        <a
          href={`/docs/GUIA-BLOQUES.md${data.docAnchor}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#818cf8", textDecoration: "underline" }}
        >
          Ver docs ampliada
        </a>
        <button
          onClick={dismissTip}
          style={{
            background: "none", border: "none", color: "#64748b", cursor: "pointer",
            fontSize: 11, padding: 0,
          }}
        >
          No volver a mostrar este tip
        </button>
      </div>
    </div>
  );
}
