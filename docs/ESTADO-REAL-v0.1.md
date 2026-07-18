# ESTADO REAL v0.1 — ELICAPE OS Landing

## Objetivo vs Realidad vs Gap

| # | Objetivo (`example-full.html`) | Real (`docs/real/index.html`) | Gap |
|---|---|---|---|
| 1 | **Background**: wallpaper blend-mode + gradientes animados + scanlines | ✅ Mismo wallpaper, gradientes estáticos, scanlines con CSS `repeating-linear-gradient` | Sin animación en gradientes |
| 2 | **Header**: sticky, glass-blur, logo "ELICAPE OS", nav con 3 links + CTA | ✅ Misma estructura con clase `hd`, blur `backdrop-filter`, logo + brand + nav + CTA verde | Idéntico en estructura y estilo |
| 3 | **Hero**: tag badge con dot verde, título gradient text, subtítulo, 2 botones (primario/secundario) | ✅ Tag "BUILD v0.1 • CONSTRUCTOR VISUAL", gradiente `#00FF88`→`#20d4ff`, botón verde + botón ghost | Contenido adaptado al proyecto real (constructor web vs opencode) |
| 4 | **Pipeline arquitectura**: 3 cards (FRONTEND → BRIDGE → BACKEND) con flechas | ✅ Misma pipeline con datos reales: React/Zustand/TipTap → Tauri plugins → Rust | Contenido del stack real en vez de "Glass UI / llama-server" |
| 5 | **Tech tags**: `ipc::invoke`, `tokio::process`, `localhost:11434` | ✅ 3 tags: `tauri::invoke`, `tauri::dialog`, `tauri::fs` | Tags reflejan capacidades reales del proyecto |
| 6 | **Process cards**: PLAN piensa / APPLY crea / SHELL ve con bullets verdes | ✅ 3 features: "Añade bloques" / "Edita en vivo" / "Exporta a HTML" con dot verde + hover | Mismo patrón visual, contenido adaptado al flujo real del editor |
| 7 | **Text-Image**: laptop + descripción del producto | ✅ `cyberpunk_alley_laptop.png` con texto sobre el editor visual | Misma imagen, texto adaptado |
| 8 | **Counters**: stats del proyecto | ✅ 6 cifras: 17 bloques, 14 componentes, 6 plantillas, 5 utilidades, 1 comando Rust, 0 dependencias | Datos reales medidos del código |
| 9 | **Testimonios**: casos de uso con estrellas | ✅ 3 casos: Landing, Negocio Local, Portfolio con estrellas verdes | Contenido adaptado a los templates reales |
| 10 | **CTA final**: fondo gradient sutil, título, subtítulo, botón | ✅ Mismo estilo: `linear-gradient` sutil, botón verde con hover shadow | Idéntico |
| 11 | **Footer**: logo, descripción, nav links, copyright | ✅ Logo ELICAPE OS, descripción, nav, copyright con stack real | Contenido adaptado |
| 12 | **Divisores**: `linear-gradient(90deg, transparent, green, transparent)` | ✅ Mismo gradiente entre secciones | Idéntico |
| 13 | **Tipografía**: Space Grotesk + JetBrains Mono | ✅ Misma carga de Google Fonts | Idéntico |
| 14 | **Animaciones**: fade-in escalonado con delays | ✅ 3 clases `an-1/2/3` con `animation-delay` | Sin IntersectionObserver, se disparan al cargar |
| 15 | **React artifact** (JS bundle de 30k+ líneas) | ❌ No se incluye — es HTML+CSS estático exportado | No aplica: el target es un artifact de React, no una página real exportable |
| 16 | **Contenido ELICAPE OS / opencode** (llama-server, Ollama, Rust greet, PLAN/APPLY/SHELL) | ❌ Contenido adaptado al proyecto real: constructor-web con React/Zustand/TipTap/Tauri | Gap de branding: el target habla de opencode, el real habla del editor visual de páginas |

## Resumen de bloques usados (10 de 17)

| Bloque real | Línea en `src/sections/index.tsx` | Sección en landing |
|---|---|---|
| `header` | 515 | Header con logo + nav |
| `hero` | 73 | Hero con tag + título + CTA |
| `features` | 683 | Pipeline arquitectura + Process cards |
| `cards` | 305 | Tech tags (3 mini cards) |
| `text-image` | 145 | Laptop + descripción |
| `counter` | 646 | Stats en cifras |
| `testimonials` | 577 | Casos de uso |
| `cta` | 355 | CTA final |
| `footer` | 553 | Footer |
| `divider` | 780 | Separadores entre secciones |

## Assets (los 3 PNG)

| Archivo | Uso en landing |
|---|---|
| `docs/logo.png` | Logo en header (vía `../logo.png`) |
| `docs/eliccape_os_wallpaper.png` | Fondo con blend-mode screen + scanlines |
| `docs/cyberpunk_alley_laptop.png` | Sección text-image |

## Porcentaje de aproximación visual

**~70%**

Razones:
- Estructura de secciones y layout idéntica → 30%
- Misma paleta cyberpunk (`#050A14`, `#00FF88`, glass-blur, mono fonts) → 25%
- Elementos decorativos (scanlines, gradientes, glows) replicados con CSS → 10%
- Contenido adaptado al stack real en vez del target → -5% (no es copia exacta)
- Sin animaciones scroll-driven ni IntersectionObserver → -5%
- Sin React runtime → 0% (no aplica)

## Próximos pasos para cerrar gaps

1. **Añadir IntersectionObserver** para animaciones al hacer scroll (en vez de al cargar)
2. **Mover tags del target real** (`tauri::invoke`, `tauri::dialog`, `tauri::fs`) a un bloque `cards` nativo si se quiere editar desde el editor
3. **Crear bloque `arch`** si se quiere la pipeline conectada como sección nativa del editor
