# Guía de Bloques — WebCraft Studio

## Hero

<a id="hero"></a>

El bloque **Hero** es la sección principal de tu página. Está diseñado para captar la atención del visitante de inmediato.

**Campos:**
- **Título**: Texto grande y llamativo (máx. 60 caracteres recomendados).
- **Subtítulo**: Texto secundario de apoyo.
- **Botón CTA**: Botón de llamada a la acción. Si no se especifica URL, el botón no navega a ningún lado.
- **URL del botón**: Enlace de destino al hacer clic en el CTA.
- **Alineación**: Controla si el contenido se alinea a la izquierda, centro o derecha.

**Ejemplo de uso:** Página de aterrizaje para un nuevo producto, campaña de lanzamiento, o portada de sitio web.

---

## Texto

<a id="texto"></a>

El bloque **Texto** es un contenedor de contenido enriquecido. Soporta párrafos, títulos, listas y citas.

**Campos:**
- **Título**: Encabezado de la sección.
- **Contenido**: Cuerpo del texto con formato (negrita, cursiva, enlaces, etc.).

---

## Texto + Imagen

<a id="imagen_texto"></a>

El bloque **Texto + Imagen** presenta un grid de dos columnas con una imagen a un lado y texto al otro.

**Campos:**
- **Imagen**: Sube una imagen o pega una URL.
- **Texto alternativo**: Descripción para accesibilidad y SEO.
- **Layout**: Controla si la imagen va a la izquierda o a la derecha del texto.
- **Contenido**: Texto enriquecido que acompaña a la imagen.

**Consejo:** Usa imágenes de al menos 800px de ancho para mejor calidad visual.

---

## Botón CTA

<a id="boton"></a>

El bloque **CTA** (Call to Action) es un llamado a la acción destacado con botón.

**Campos:**
- **Título**: Texto principal del CTA (ej: "¿Listo para empezar?").
- **Subtítulo**: Texto de apoyo (ej: "Crea tu web sin programación").
- **Texto del botón**: Texto que aparece en el botón (ej: "Comenzar Ahora", "Comprar").
- **URL del botón**: Dirección web a la que navega el botón. Si no se pone URL, el botón no hará nada.

**Ejemplo:** Texto del botón "Comprar" → URL "https://tutienda.com/compra"

---

## Guardar proyecto

<a id="guardar"></a>

Puedes guardar tu proyecto desde el menú **Archivo > Guardar** o con **Ctrl+S**.

**¿Dónde se guarda?**
- En Tauri: Se guarda en `~/Documents/WebCraft/` como archivo `.json`.
- En navegador: Se descarga como archivo `.json`.

El proyecto guardado aparece en la lista **Recientes** al iniciar la aplicación.

---

## Exportar

<a id="exportar"></a>

Exporta tu página como HTML independiente o ZIP con assets.

**Opciones:**
- **HTML**: Archivo HTML listo para subir a cualquier hosting.
- **ZIP**: HTML + imágenes extraídas en una carpeta `images/`.

**Atajos:** `Ctrl+E` para abrir el diálogo de exportación.

---

## Editor / Área de trabajo

<a id="editor"></a>

El área de trabajo central donde construyes tu página.

**Funcionalidades:**
- Arrastra secciones para reordenarlas (icono de agarre a la izquierda).
- Pasa el ratón sobre una sección para ver controles (mover, duplicar, eliminar).
- Haz clic en una sección para seleccionarla y editar sus propiedades.

---

## Vista Previa

<a id="vista_previa"></a>

La **Vista Previa** muestra tu página sin la interfaz de edición, tal como la verá tu cliente.

**Atajos:** `F5` para abrir/cerrar vista previa. `Escape` para salir.

---

## Añadir bloque

<a id="anadir"></a>

Desde el botón **+ Añadir** en la barra de herramientas o el menú contextual, puedes agregar nuevos bloques a tu página.

**Tipos de bloque disponibles:** Hero, Texto, Texto+Imagen, Pestañas, Acordeón, Tarjetas, CTA, Espaciador, Video, Galería, Encabezado, Pie, Testimonios, Contador, Características, Formulario, Divisor.
