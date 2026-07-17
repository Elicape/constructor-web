# WebCraft Studio

**Creador de páginas web visual, sin necesidad de código.**

WebCraft Studio es una aplicación de escritorio (Tauri + React) que permite diseñar y exportar sitios web completos de forma visual. Arrastra, edita y personaliza secciones — como hero, texto, tarjetas, pestañas, galerías — sin escribir una sola línea de código.

---

## Capacidades actuales (v1.0)

### Editor visual
- 17 tipos de sección: hero, texto, texto+imagen, pestañas, acordeón, tarjetas, CTA, espaciador, video, galería, header, footer, testimonios, contador, características, formulario, divisor
- Editor de texto enriquecido (negrita, cursiva, subrayado, títulos, listas, enlaces, citas, código)
- Subida de imágenes (arrastrar o pegar)
- Reordenar secciones por drag & drop
- Duplicar, copiar, ocultar, eliminar y convertir secciones entre tipos
- Zoom del editor (50% – 200%)

### Menú clásico de aplicación
- **Archivo**: Nuevo (Ctrl+N), Abrir (Ctrl+O), Guardar (Ctrl+S), Guardar como (Ctrl+Shift+S), Exportar HTML/ZIP, Salir
- **Editar**: Deshacer (Ctrl+Z), Rehacer (Ctrl+Shift+Z), Duplicar bloque (Ctrl+D), Borrar bloque
- **Ver**: Vista Previa (F5), Acercar/Alejar zoom, Tema oscuro/claro
- **Configuración**: Directorios, auto-guardado
- **Ayuda**: Acerca de, Documentación

### Guardado real (Tauri)
- Guardado nativo con diálogo del sistema operativo
- Auto-guardado configurable (30s / 1min / 5min) en la ruta del último guardado
- Archivos `.webcraft.json` que puedes abrir, editar y compartir
- Fallback web: descarga el archivo en Descargas

### Personalización visual
- Modo oscuro y claro
- Paleta de colores completa (fondo, acento, texto, tarjetas, bordes)
- Más de 20 fuentes de Google Fonts
- CSS personalizado
- Diseño responsive (ancho estrecho, normal, completo)
- Configuración SEO (meta tags, Open Graph, favicon, Google Analytics)

### Vista previa
- F5 o menú Ver > Vista Previa: oculta todo el UI del editor y muestra la página como se verá publicada
- Edición desactivada, contenido centrado sobre fondo blanco
- ESC o F5 para salir

### Exportación
- HTML standalone (un solo archivo, ideal para Netlify/GitHub Pages)
- HTML + carpeta de assets (para FTP)
- ZIP comprimido (todo incluido)

### Temas por sección
Cada sección puede tener su propio fondo de pantalla (color sólido, gradiente o imagen), permitiendo que cada pantalla/pestaña de una web multipágina luzca diferente.

---

## Requisitos

- Node.js 18+
- npm 9+
- Rust y Cargo (solo para Tauri)
- Sistema operativo: Linux, macOS o Windows

## Instalación y uso

```bash
# Clonar o descargar
cd constructor-web

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (Tauri)
npm run tauri dev

# O solo el frontend web
npm run dev
```

Para abrir en navegador sin Tauri: tras `npm run dev`, abre `http://localhost:1420`.

## Compilación para producción

```bash
npm run tauri build
```

El instalador se generará en `src-tauri/target/release/bundle/`.

---

## Tutorial para novatos (no técnicos)

### Primeros pasos

1. **Abre WebCraft Studio**. Verás la pantalla de inicio con varias plantillas predefinidas.
2. **Elige una plantilla** (Negocio, Portafolio, Landing, Evento, Blog o Blank) o haz clic en "Nuevo proyecto vacío".
3. Se abrirá el editor con un menú clásico arriba y una barra de herramientas.

### Añadir contenido

1. Haz clic en **Añadir** (botón en la barra de herramientas, ícono +).
2. Se abre la galería de componentes. Elige un tipo (Hero, Texto, Tarjetas...).
3. La sección aparece en el editor. Haz clic sobre el texto para editarlo directamente.

### Editar texto

- Selecciona texto con el ratón: aparecerá una barra flotante con formato (negrita, cursiva, títulos, listas, enlaces).
- También puedes cambiar colores y estilos desde el panel de propiedades de cada sección.

### Reordenar secciones

- Pasa el ratón sobre una sección y aparecerán controles a la derecha.
- Usa el icono de **grip** (6 puntos) para arrastrar y soltar.
- Usa las flechas arriba/abajo para mover de a una posición.

### Guardar tu proyecto

- **Guardar (Ctrl+S)**: la primera vez abrirá un diálogo para elegir dónde guardar. Las siguientes veces guarda en el mismo sitio sin preguntar.
- **Guardar como (Ctrl+Shift+S)**: siempre abre el diálogo para elegir ubicación.
- **Auto-guardado**: activable en Configuración. Guarda automáticamente cada 30s, 1min o 5min.

### Vista previa

- Presiona **F5** o ve a **Ver > Vista Previa**.
- Todo el entorno de edición desaparece y ves tu página como se vería publicada.
- Presiona **ESC** o **F5** para volver al editor.

### Exportar la página

1. Haz clic en **Exportar** (barra de herramientas) o **Archivo > Exportar HTML/ZIP**.
2. Elige el formato:
   - **HTML standalone**: un único archivo .html listo para subir a cualquier servidor.
   - **HTML + Assets**: el .html más una carpeta con imágenes.
   - **ZIP**: todo comprimido.
3. Haz clic en "Exportar" y elige dónde guardarlo.

### Consejos

- Usa **Ctrl+Z** para deshacer cambios (hasta 50 pasos atrás).
- Duplica secciones con **Ctrl+D** para reutilizar diseños.
- En **Configuración** (menú o icono ⚙️) puedes cambiar directorios por defecto, auto-guardado y ver la ruta del proyecto abierto.
- Si trabajas en equipo, comparte el archivo `.webcraft.json` para que otros lo abran y editen.

---

## Estructura del proyecto

```
constructor-web/
├── src/
│   ├── App.tsx                    # Componente raíz
│   ├── main.tsx                   # Punto de entrada
│   ├── components/                # Componentes de UI
│   │   ├── Editor.tsx             # Lienzo del editor
│   │   ├── MenuBar.tsx            # Menú clásico superior
│   │   ├── Toolbar.tsx            # Barra de herramientas
│   │   ├── SectionWrapper.tsx     # Envoltura de sección (controles)
│   │   ├── RichTextEditor.tsx     # Editor de texto (TipTap)
│   │   ├── SettingsModal.tsx      # Configuración global
│   │   ├── Splash.tsx             # Pantalla de inicio
│   │   └── ...
│   ├── sections/index.tsx         # 17 componentes de sección
│   ├── store/projectStore.ts      # Estado global (Zustand)
│   ├── types/index.ts             # Tipos TypeScript
│   ├── utils/
│   │   ├── fileSystem.ts          # Guardado Tauri / web
│   │   ├── export.ts              # Exportación HTML/ZIP
│   │   ├── theme.ts               # Temas CSS
│   │   ├── storage.ts             # Persistencia localStorage
│   │   └── sanitize.ts            # Sanitización HTML
│   ├── hooks/
│   │   ├── useAutoSave.ts         # Auto-guardado
│   │   └── useKeyboardShortcuts.ts # Atajos de teclado
│   └── templates/                 # Plantillas predefinidas
├── src-tauri/                     # Backend Tauri (Rust)
└── package.json
```

---

## Tecnologías

- **Frontend**: React 19, TypeScript, Tailwind CSS, Zustand
- **Editor rich text**: TipTap (ProseMirror)
- **Drag & drop**: dnd-kit
- **Iconos**: Lucide React
- **Exportación**: JSZip, FileSaver, DOMPurify
- **Desktop**: Tauri 2 (Rust), plugin-dialog, plugin-fs

---

## Créditos y Licencia

Este proyecto usa [OpenCode](https://opencode.ai), Tauri v2, React 19, Vite, TypeScript, Tailwind CSS, Zustand, TipTap y Google Fonts. Ver créditos completos en [`docs/CREDITS.md`](docs/CREDITS.md).

**MIT License** — Copyright (c) 2026 Constructor Web Contributors.

El código es libre para que lo uses, modifiques y compartas. Si quieres continuar este proyecto a tu manera — con IA, sin IA, como prefieras — puedes hacerlo. Es MIT. Adelante.
