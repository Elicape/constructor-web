import type { Template, Section, PageSettings, SectionType } from "../types";

export function getDefaultSettings(): PageSettings {
  return {
    pageTitle: "Mi Página Web",
    theme: {
      bgColor: "#0f172a",
      accentColor: "#6366f1",
      textColor: "#f1f5f9",
      cardBgColor: "#1e293b",
      borderColor: "#475569",
      fontFamily: "Inter",
      mode: "dark",
      customCSS: "",
    },
    layout: {
      menuLayout: "horizontal",
      containerWidth: "normal",
      mobileControls: "expanded",
    },
    seo: {
      description: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      favicon: "",
      gaId: "",
    },
  };
}

function s(type: SectionType, overrides: Partial<Section> = {}): Section {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
    type,
    visible: true,
    content: {},
    ...overrides,
  };
}

export const TEMPLATES: Template[] = [
  {
    id: "business",
    name: "Negocio Local",
    description: "Header con logo y teléfono, servicios, testimonios, contador",
    icon: "Store",
    settings: {
      ...getDefaultSettings(),
      pageTitle: "Mi Negocio - Profesional y Cercano",
      theme: { ...getDefaultSettings().theme, accentColor: "#059669", mode: "dark" },
    },
    sections: [
      { ...s("header"), content: { logoText: "MiNegocio", phone: "+34 612 345 678", links: [{ label: "Servicios", url: "#servicios" }, { label: "Clientes", url: "#clientes" }, { label: "Contacto", url: "#contacto" }] } },
      { ...s("hero"), content: { title: "Tu Negocio Local de Confianza", subtitle: "Más de 10 años ofreciendo el mejor servicio a nuestros clientes", ctaText: "Llámanos Ahora", ctaUrl: "tel:+34612345678", align: "center" } },
      { ...s("cards"), content: { title: "Nuestros Servicios", items: [{ title: "Servicio 1", description: "Descripción del primer servicio con calidad garantizada", icon: "⭐" }, { title: "Servicio 2", description: "El segundo servicio que ofrece tu negocio", icon: "⭐" }, { title: "Servicio 3", description: "El tercer servicio que te hace único", icon: "⭐" }], columns: 3 } },
      { ...s("testimonials"), content: { title: "Lo que dicen nuestros clientes", items: [{ name: "María García", role: "Cliente desde 2020", text: "Excelente servicio, muy recomendable. Siempre atentos y profesionales.", rating: 5 }, { name: "Carlos López", role: "Cliente desde 2022", text: "La mejor experiencia que hemos tenido. Volveremos sin duda.", rating: 5 }, { name: "Ana Martínez", role: "Cliente desde 2021", text: "Profesionalidad y cercanía. Así deberían ser todos los negocios.", rating: 4 }] } },
      { ...s("counter"), content: { title: "Nuestros números", items: [{ value: 500, label: "Clientes satisfechos", suffix: "+" }, { value: 10, label: "Años de experiencia", suffix: "+" }, { value: 98, label: "% Recomendación", suffix: "%" }] } },
      { ...s("cta"), content: { title: "¿Hablamos?", subtitle: "Sin compromiso, te asesoramos sobre lo que necesitas", buttonText: "Contactar Ahora", buttonUrl: "#contacto" } },
      { ...s("footer"), content: { logoText: "MiNegocio", description: "Tu negocio local de confianza. Estamos aquí para ayudarte.", email: "info@minegocio.com", phone: "+34 612 345 678", socialLinks: [{ platform: "facebook", url: "#" }, { platform: "instagram", url: "#" }] } },
    ],
  },
  {
    id: "portfolio",
    name: "Portfolio Creativo",
    description: "Hero impactante, galería masonry, sobre mí, formulario",
    icon: "Palette",
    settings: {
      ...getDefaultSettings(),
      pageTitle: "Portfolio Creativo",
      theme: { ...getDefaultSettings().theme, accentColor: "#8b5cf6", mode: "dark" },
    },
    sections: [
      { ...s("hero"), content: { title: "Soy [Tu Nombre]", subtitle: "Diseñador y Desarrollador Creativo", ctaText: "Ver Mi Trabajo", ctaUrl: "#galeria", align: "center", fullHeight: true } },
      { ...s("text-image"), content: { title: "Sobre Mí", content: "Soy un apasionado del diseño y desarrollo web. Me encanta crear experiencias digitales únicas que combinan creatividad con funcionalidad.", imageSrc: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop", imageAlt: "Sobre mí", layout: "right" } },
      { ...s("gallery"), content: { title: "Mi Trabajo", items: [
        { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop", alt: "Proyecto 1", caption: "Proyecto Creativo 1" },
        { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop", alt: "Proyecto 2", caption: "Proyecto Creativo 2" },
        { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop", alt: "Proyecto 3", caption: "Proyecto Creativo 3" },
      ], layout: "grid" } },
      { ...s("features"), content: { title: "Habilidades", items: [
        { icon: "🎨", title: "Diseño UI/UX", description: "Interfaces modernas y funcionales" },
        { icon: "⚛️", title: "Desarrollo Web", description: "React, TypeScript, Tailwind" },
        { icon: "📱", title: "Responsive", description: "Adaptado a cualquier dispositivo" },
      ] } },
      { ...s("form"), content: { title: "Contáctame", fields: [{ name: "nombre", label: "Nombre", type: "text", required: true }, { name: "email", label: "Email", type: "email", required: true }, { name: "mensaje", label: "Mensaje", type: "textarea", required: true }], buttonText: "Enviar Mensaje" } },
    ],
  },
  {
    id: "landing",
    name: "Landing Producto",
    description: "Hero con producto, beneficios, video demo, FAQ, CTA con precio",
    icon: "Rocket",
    settings: {
      ...getDefaultSettings(),
      pageTitle: "Producto Landing",
      theme: { ...getDefaultSettings().theme, accentColor: "#f59e0b", mode: "dark" },
    },
    sections: [
      { ...s("hero"), content: { title: "Producto Revolucionario", subtitle: "La herramienta que cambiará tu forma de trabajar", ctaText: "Comprar Ahora — 29€", ctaUrl: "#", align: "left", fullHeight: false } },
      { ...s("features"), content: { title: "Beneficios", items: [
        { icon: "✅", title: "Fácil de usar", description: "Sin curva de aprendizaje" },
        { icon: "✅", title: "Rápido", description: "Resultados en minutos" },
        { icon: "✅", title: "Eficiente", description: "Ahorra horas de trabajo" },
        { icon: "✅", title: "Soporte 24/7", description: "Siempre disponible" },
        { icon: "✅", title: "Actualizaciones", description: "Mejoras constantes" },
        { icon: "✅", title: "Seguro", description: "Tus datos protegidos" },
      ] } },
      { ...s("video"), content: { title: "Ver Demo", embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", ratio: "16:9" } },
      { ...s("testimonials"), content: { title: "Lo que dicen", items: [{ name: "Usuario 1", role: "Cliente", text: "Increíble producto, me ha cambiado la vida.", rating: 5 }, { name: "Usuario 2", role: "Cliente", text: "Lo recomiendo 100%.", rating: 5 }], layout: "carousel" } },
      { ...s("counter"), content: { title: "En números", items: [{ value: 10000, label: "Usuarios activos", suffix: "+" }, { value: 4.9, label: "Valoración media", suffix: "/5" }] } },
      { ...s("cta"), content: { title: "Empieza Hoy por Solo 29€", subtitle: "Pago único, sin suscripciones", buttonText: "Comprar Ahora", buttonUrl: "#" } },
      { ...s("accordion"), content: { title: "Preguntas Frecuentes", panels: [
        { title: "¿Cómo funciona?", content: "Es muy sencillo. Solo tienes que registrarte y empezar a usarlo." },
        { title: "¿Hay garantía?", content: "Sí, ofrecemos 30 días de garantía de devolución." },
        { title: "¿Aceptan tarjetas?", content: "Sí, aceptamos todas las tarjetas de crédito." },
      ] } },
    ],
  },
  {
    id: "event",
    name: "Evento / Reserva",
    description: "Hero con fecha, lugar galería, ponentes, formulario",
    icon: "Calendar",
    settings: {
      ...getDefaultSettings(),
      pageTitle: "Evento Especial",
      theme: { ...getDefaultSettings().theme, accentColor: "#ef4444", mode: "dark" },
    },
    sections: [
      { ...s("hero"), content: { title: "Gran Evento 2026", subtitle: "15 de Diciembre · Madrid", ctaText: "Reservar mi plaza", ctaUrl: "#", align: "center" } },
      { ...s("text-image"), content: { title: "El Lugar", content: "Un espacio único en el corazón de Madrid. Con capacidad para 500 asistentes.", imageSrc: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop", imageAlt: "Lugar del evento", layout: "left" } },
      { ...s("gallery"), content: { title: "Ediciones Anteriores", items: [
        { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop", alt: "Foto 1" },
        { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop", alt: "Foto 2" },
        { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop", alt: "Foto 3" },
      ], layout: "grid" } },
      { ...s("cards"), content: { title: "Ponentes", items: [
        { title: "Ponente 1", description: "Experto en tecnología", icon: "🎤" },
        { title: "Ponente 2", description: "Referente en innovación", icon: "🎤" },
      ], columns: 2 } },
      { ...s("form"), content: { title: "Reserva tu Plaza", fields: [
        { name: "nombre", label: "Nombre completo", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "entradas", label: "Número de entradas", type: "number", required: true },
      ], buttonText: "Reservar" } },
      { ...s("footer"), content: { logoText: "Evento 2026", description: "No te lo pierdas.", email: "info@evento2026.com" } },
    ],
  },
  {
    id: "blog",
    name: "Blog / One-pager",
    description: "Header sticky, índice, secciones de texto, citas, CTA suscripción",
    icon: "FileText",
    settings: {
      ...getDefaultSettings(),
      pageTitle: "Mi Blog",
      theme: { ...getDefaultSettings().theme, accentColor: "#3b82f6", mode: "dark", fontFamily: "Playfair Display" },
    },
    sections: [
      { ...s("header"), content: { logoText: "Mi Blog", links: [{ label: "Inicio", url: "#" }, { label: "Artículos", url: "#articulos" }, { label: "Contacto", url: "#contacto" }], sticky: true } },
      { ...s("hero"), content: { title: "Ideas que Inspiran", subtitle: "Un blog sobre tecnología, diseño y creatividad", ctaText: "Leer más", ctaUrl: "#articulos", align: "center", fullHeight: false } },
      { ...s("text"), content: { title: "El Poder de las Ideas", content: "<p>Las ideas tienen el poder de transformar el mundo. En este blog exploramos cómo las pequeñas chispas de creatividad pueden convertirse en proyectos que cambian vidas.</p><p>Cada artículo está escrito con pasión y dedicación, buscando siempre aportar valor a nuestros lectores.</p>" } },
      { ...s("divider"), content: { style: "dotted" } },
      { ...s("text"), content: { title: "Cómo Empezar", content: "<p>El primer paso es siempre el más difícil. Pero una vez que lo das, el camino se vuelve más claro. Aquí compartimos estrategias y consejos para que puedas dar ese paso con confianza.</p><blockquote>El viaje de mil millas comienza con un solo paso. — Lao Tzu</blockquote>" } },
      { ...s("divider"), content: { style: "gradient" } },
      { ...s("cta"), content: { title: "Suscríbete al Newsletter", subtitle: "Recibe los mejores artículos cada semana en tu correo", buttonText: "Suscribirme", buttonUrl: "#" } },
    ],
  },
  {
    id: "blank",
    name: "Página en Blanco",
    description: "Empieza desde cero con una página vacía",
    icon: "FilePlus",
    settings: getDefaultSettings(),
    sections: [],
  },
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function getTemplates(): Template[] {
  return TEMPLATES;
}
