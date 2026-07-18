import type { Project, Section } from "../types";
import JSZip from "jszip";
import { sanitizeHTML } from "./sanitize";

/* ===== HELPERS ===== */

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Returns true if src is a local filesystem path that should not appear in export */
function isLocalSystemPath(src: string): boolean {
  if (!src) return true;
  if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://")) return false;
  if (/^\/home\//.test(src) || /^\/Users\//.test(src) || /^\/media\//.test(src) || /^\/mnt\//.test(src)) return true;
  if (/^\w:\\/.test(src)) return true;
  if (/\/?(?:IA-APPS|agenti[co]|gui-|node_modules|dist|build|\.git)/.test(src)) return true;
  return true;
}

/** Returns a valid image src or empty string to use a placeholder */
function cleanImageSrc(src: unknown): string {
  if (!src || typeof src !== "string") return "";
  const s = src.trim();
  if (!s) return "";
  if (s.startsWith("data:") || s.startsWith("http://") || s.startsWith("https://")) return s;
  if (isLocalSystemPath(s)) return "";
  if (/\.(png|jpg|jpeg|gif|svg|webp|avif)(\?.*)?$/i.test(s)) return s;
  return "";
}

function imgTag(src: string, alt: string = ""): string {
  const clean = cleanImageSrc(src);
  if (!clean) {
    return `<div class="ep-img-placeholder" role="img" aria-label="${escapeHTML(alt)}"></div>`;
  }
  return `<img src="${escapeHTML(clean)}" alt="${escapeHTML(alt)}" loading="lazy">`;
}

function sh(val: unknown): string {
  if (!val) return "";
  return sanitizeHTML(val as string);
}

/* ===== SECTION RENDERER ===== */

function renderSection(section: Section): string {
  const c = section.content;

  switch (section.type) {
    case "header": {
      const links = (c.links as Array<{ label: string; url: string }>) || [];
      return `<header class="ep-header">
        <div class="ep-header-logo">${sh(c.logoText) || "Logo"}</div>
        ${links.length ? `<nav class="ep-header-nav">${links.map(l => `<a href="${escapeHTML(l.url)}">${sh(l.label)}</a>`).join("")}</nav>` : ""}
      </header>`;
    }

    case "hero": {
      const align = (c.align as string) === "left" ? "ep-hero-left" : (c.align as string) === "right" ? "ep-hero-right" : "";
      return `<section class="ep-hero ${align}">
        <div class="ep-hero-inner">
          <h1 class="ep-hero-title">${sh(c.title) || "Tu Título"}</h1>
          ${c.subtitle ? `<p class="ep-hero-sub">${sh(c.subtitle)}</p>` : ""}
          ${c.ctaText ? `<a href="${escapeHTML((c.ctaUrl as string) || "#")}" class="ep-hero-cta">${sh(c.ctaText)}</a>` : ""}
        </div>
      </section>`;
    }

    case "text":
      return `<section class="ep-section ep-text-section">
        <div class="ep-container ep-text-content">
          ${c.title ? sh(c.title) : ""}
          ${c.content ? sh(c.content) : ""}
        </div>
      </section>`;

    case "text-image": {
      const layout = (c.layout as string) === "left" ? "ep-grid-2-rev" : "ep-grid-2";
      return `<section class="ep-section">
        <div class="ep-container ${layout}">
          <div class="ep-ti-media">${c.imageSrc ? imgTag(c.imageSrc as string, (c.imageAlt as string) || "") : ""}</div>
          <div class="ep-ti-body">${c.content ? sh(c.content) : ""}</div>
        </div>
      </section>`;
    }

    case "tabs": {
      const tabs = (c.tabs as Array<{ title: string; content: string }>) || [];
      const id = section.id.replace(/[^a-zA-Z0-9_-]/g, "");
      return `<section class="ep-section">
        <div class="ep-container">
          ${c.title ? `<h2 class="ep-section-title">${sh(c.title)}</h2>` : ""}
          <div class="ep-tabs" role="tablist">${tabs.map((t, i) =>
            `<button class="ep-tab-btn${i === 0 ? " ep-active" : ""}" role="tab" data-tab="t-${id}-${i}">${sh(t.title)}</button>`
          ).join("")}</div>
          ${tabs.map((t, i) =>
            `<div id="t-${id}-${i}" class="ep-tab-pane${i === 0 ? " ep-active" : ""}" role="tabpanel">${sh(t.content)}</div>`
          ).join("")}
        </div>
      </section>`;
    }

    case "accordion": {
      const panels = (c.panels as Array<{ title: string; content: string }>) || [];
      return `<section class="ep-section">
        <div class="ep-container">
          ${c.title ? `<h2 class="ep-section-title">${sh(c.title)}</h2>` : ""}
          <div class="ep-accordion">${panels.map((p, i) =>
            `<details class="ep-panel"${i === 0 ? " open" : ""}>
              <summary class="ep-panel-header"><span>${sh(p.title)}</span><span class="ep-panel-arrow">▼</span></summary>
              <div class="ep-panel-body">${sh(p.content)}</div>
            </details>`
          ).join("")}</div>
        </div>
      </section>`;
    }

    case "cards": {
      const items = (c.items as Array<{ title: string; description: string; icon: string }>) || [];
      return `<section class="ep-section">
        <div class="ep-container">
          ${c.title ? `<h2 class="ep-section-title ep-text-center">${sh(c.title)}</h2>` : ""}
          <div class="ep-cards">${items.map(card =>
            `<div class="ep-card">
              ${card.icon ? `<div class="ep-card-icon">${card.icon}</div>` : ""}
              <h3 class="ep-card-title">${sh(card.title)}</h3>
              <p class="ep-card-desc">${sh(card.description)}</p>
            </div>`
          ).join("")}</div>
        </div>
      </section>`;
    }

    case "cta":
      return `<section class="ep-section ep-cta">
        <div class="ep-container ep-text-center">
          <h2 class="ep-cta-title">${sh(c.title) || "¿Listo para empezar?"}</h2>
          ${c.subtitle ? `<p class="ep-cta-sub">${sh(c.subtitle)}</p>` : ""}
          ${c.buttonText ? `<a href="${escapeHTML((c.buttonUrl as string) || "#")}" class="ep-btn">${sh(c.buttonText)}</a>` : ""}
        </div>
      </section>`;

    case "spacer":
      return `<div class="ep-spacer" style="height:${Math.min(Math.max((c.height as number) || 40, 20), 200)}px"></div>`;

    case "video":
      return `<section class="ep-section">
        <div class="ep-container">
          ${c.title ? `<h2 class="ep-section-title ep-text-center">${sh(c.title)}</h2>` : ""}
          <div class="ep-video-wrapper" style="aspect-ratio:${(c.ratio as string) === "4:3" ? "4/3" : (c.ratio as string) === "1:1" ? "1/1" : "16/9"}">
            ${c.embedUrl ? `<iframe src="${escapeHTML(c.embedUrl as string)}" allowfullscreen loading="lazy"></iframe>` : `<div class="ep-video-placeholder">Video</div>`}
          </div>
        </div>
      </section>`;

    case "gallery": {
      const items = (c.items as Array<{ src: string; alt: string }>) || [];
      return `<section class="ep-section">
        <div class="ep-container">
          ${c.title ? `<h2 class="ep-section-title ep-text-center">${sh(c.title)}</h2>` : ""}
          <div class="ep-gallery">${items.map(img =>
            `<div class="ep-gallery-item">${imgTag(img.src, img.alt)}</div>`
          ).join("")}</div>
        </div>
      </section>`;
    }

    case "footer":
      return `<footer class="ep-footer">
        <div class="ep-container ep-text-center">
          <div class="ep-footer-logo">${sh(c.logoText) || "Logo"}</div>
          ${c.description ? `<p class="ep-footer-desc">${sh(c.description)}</p>` : ""}
          <p class="ep-footer-copy">© ${new Date().getFullYear()} ${sh(c.logoText) || "Web"}</p>
        </div>
      </footer>`;

    case "testimonials": {
      const items = (c.items as Array<{ name: string; role: string; text: string; rating: number }>) || [];
      return `<section class="ep-section">
        <div class="ep-container">
          ${c.title ? `<h2 class="ep-section-title ep-text-center">${sh(c.title)}</h2>` : ""}
          <div class="ep-testimonials">${items.map(t =>
            `<div class="ep-testimonial">
              <div class="ep-stars">${Array.from({ length: 5 }).map((_, s) =>
                `<span class="${s < t.rating ? "ep-star-on" : "ep-star-off"}">★</span>`
              ).join("")}</div>
              <p class="ep-testimonial-text">${sh(t.text)}</p>
              <div class="ep-testimonial-author"><strong>${sh(t.name)}</strong>${t.role ? ` — ${sh(t.role)}` : ""}</div>
            </div>`
          ).join("")}</div>
        </div>
      </section>`;
    }

    case "counter": {
      const items = (c.items as Array<{ value: number; label: string; suffix: string }>) || [];
      return `<section class="ep-section">
        <div class="ep-container">
          ${c.title ? `<h2 class="ep-section-title ep-text-center">${sh(c.title)}</h2>` : ""}
          <div class="ep-counters">${items.map(ct =>
            `<div class="ep-counter"><div class="ep-counter-val">${ct.value}${ct.suffix || ""}</div><p>${sh(ct.label)}</p></div>`
          ).join("")}</div>
        </div>
      </section>`;
    }

    case "features": {
      const items = (c.items as Array<{ icon: string; title: string; description: string }>) || [];
      return `<section class="ep-section">
        <div class="ep-container">
          ${c.title ? `<h2 class="ep-section-title ep-text-center">${sh(c.title)}</h2>` : ""}
          <div class="ep-features">${items.map(f =>
            `<div class="ep-feature">
              ${f.icon ? `<div class="ep-feature-icon">${f.icon}</div>` : ""}
              <div><h4>${sh(f.title)}</h4><p>${sh(f.description)}</p></div>
            </div>`
          ).join("")}</div>
        </div>
      </section>`;
    }

    case "form": {
      const fields = (c.fields as Array<{ name: string; label: string; type: string; required: boolean }>) || [];
      return `<section class="ep-section">
        <div class="ep-container ep-form-wrap">
          ${c.title ? `<h2 class="ep-section-title ep-text-center">${sh(c.title)}</h2>` : ""}
          <form class="ep-form">${fields.map(f =>
            `<div class="ep-field"><label>${sh(f.label)}${f.required ? ' <span class="ep-req">*</span>' : ''}</label>
              ${f.type === "textarea" ? `<textarea rows="4"></textarea>` : `<input type="${f.type}">`}
            </div>`
          ).join("")}
            <button type="submit" class="ep-btn ep-btn-block">${c.buttonText ? sh(c.buttonText) : "Enviar"}</button>
          </form>
        </div>
      </section>`;
    }

    case "divider": {
      const style = (c.style as string) || "solid";
      return style === "gradient"
        ? `<hr class="ep-hr ep-hr-grad">`
        : style === "dotted"
        ? `<hr class="ep-hr ep-hr-dot">`
        : `<hr class="ep-hr">`;
    }

    default:
      return "";
  }
}

/* ===== EXPORT CSS (always light/premium, independent of project theme) ===== */

function buildExportCSS(): string {
  return `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Inter',system-ui,sans-serif;background:#f8fafc;color:#0f172a;line-height:1.6;-webkit-font-smoothing:antialiased}
img{max-width:100%;height:auto;display:block;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08)}
a{color:#6366f1;text-decoration:none}
a:hover{text-decoration:underline}

.ep-container{max-width:1100px;margin:0 auto;padding:0 1.5rem}
.ep-text-center{text-align:center}
.ep-section{padding:5rem 0;border-bottom:1px solid #e2e8f0}
.ep-section:last-child{border-bottom:none}
.ep-section-title{font-family:'Space Grotesk',sans-serif;font-size:2rem;font-weight:800;letter-spacing:-0.02em;margin-bottom:3rem;color:#0f172a}
.ep-text-content>*+*{margin-top:1rem}
.ep-text-content h2{font-family:'Space Grotesk',sans-serif;font-size:1.75rem;font-weight:700;letter-spacing:-0.02em;color:#0f172a;margin-top:2rem}
.ep-text-content p{font-size:1.125rem;color:#475569;max-width:720px;line-height:1.8}
.ep-text-content ul,.ep-text-content ol{padding-left:1.5rem;color:#475569}
.ep-text-content blockquote{border-left:4px solid #6366f1;padding-left:1.5rem;margin:1.5rem 0;color:#64748b;font-style:italic}

/* HEADER */
.ep-header{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 2rem;background:#fff;border-bottom:1px solid #e2e8f0;position:sticky;top:0;z-index:100}
.ep-header-logo{font-family:'Space Grotesk',sans-serif;font-size:1.35rem;font-weight:700;color:#6366f1}
.ep-header-nav{display:flex;gap:2rem}
.ep-header-nav a{color:#475569;font-size:0.9375rem;font-weight:500}
.ep-header-nav a:hover{color:#6366f1;text-decoration:none}

/* HERO */
.ep-hero{padding:7rem 2rem;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;overflow:hidden;position:relative}
.ep-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,rgba(255,255,255,0.1) 0%,transparent 60%)}
.ep-hero-inner{position:relative;max-width:800px;margin:0 auto}
.ep-hero-left .ep-hero-inner{margin:0}
.ep-hero-right .ep-hero-inner{margin:0 0 0 auto}
.ep-hero-title{font-family:'Space Grotesk',sans-serif;font-size:3.25rem;font-weight:800;line-height:1.15;letter-spacing:-0.03em;margin-bottom:1.25rem}
.ep-hero-sub{font-size:1.25rem;opacity:0.9;margin-bottom:2.25rem;line-height:1.7;max-width:600px}
.ep-hero-left .ep-hero-sub{margin-left:0}
.ep-hero-right .ep-hero-sub{margin-right:0}
.ep-hero-cta{display:inline-block;padding:1rem 2.75rem;background:rgba(255,255,255,0.18);backdrop-filter:blur(8px);border-radius:999px;color:#fff;text-decoration:none;font-weight:600;font-size:1.0625rem;transition:background 0.2s}
.ep-hero-cta:hover{background:rgba(255,255,255,0.28);text-decoration:none}

/* TEXT-IMAGE */
.ep-grid-2,.ep-grid-2-rev{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}
.ep-ti-body p{font-size:1.125rem;color:#475569;line-height:1.8}
.ep-ti-body>*+*{margin-top:1rem}
.ep-ti-media img,.ep-ti-media .ep-img-placeholder{width:100%;aspect-ratio:4/3;object-fit:cover}

/* CARDS */
.ep-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:2rem}
.ep-card{background:#fff;padding:2.5rem 2rem;border-radius:20px;border:1px solid #e2e8f0;text-align:center;transition:box-shadow 0.2s,transform 0.2s}
.ep-card:hover{box-shadow:0 8px 40px rgba(0,0,0,0.06);transform:translateY(-2px)}
.ep-card-icon{font-size:2.75rem;margin-bottom:1.25rem}
.ep-card-title{font-family:'Space Grotesk',sans-serif;font-size:1.2rem;font-weight:700;margin-bottom:0.5rem;color:#0f172a}
.ep-card-desc{font-size:0.9375rem;color:#64748b;line-height:1.6}

/* CTA */
.ep-cta{background:linear-gradient(135deg,#6366f1,#4f46e5);border-radius:24px;margin:2rem 1.5rem;padding:4rem 2rem;border:none!important}
.ep-cta-title{font-family:'Space Grotesk',sans-serif;font-size:2.25rem;font-weight:800;color:#fff;margin-bottom:0.75rem}
.ep-cta-sub{font-size:1.125rem;color:rgba(255,255,255,0.8);margin-bottom:2rem}
.ep-btn{display:inline-block;padding:0.875rem 2.5rem;background:#fff;color:#6366f1;border-radius:999px;font-weight:700;font-size:1rem;transition:transform 0.2s,box-shadow 0.2s;border:none;cursor:pointer;text-decoration:none}
.ep-btn:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(0,0,0,0.15);text-decoration:none}

/* TABS */
.ep-tabs{display:flex;gap:0.25rem;border-bottom:2px solid #e2e8f0;margin-bottom:2rem;overflow-x:auto}
.ep-tab-btn{padding:0.75rem 1.5rem;background:transparent;border:none;color:#94a3b8;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;white-space:nowrap;font-size:0.9375rem;font-weight:500;transition:color 0.2s}
.ep-tab-btn.ep-active{color:#6366f1;border-bottom-color:#6366f1}
.ep-tab-btn:hover{color:#6366f1}
.ep-tab-pane{display:none}
.ep-tab-pane.ep-active{display:block}
.ep-tab-pane p{color:#475569;line-height:1.8}

/* ACCORDION */
.ep-accordion{display:flex;flex-direction:column;gap:0.75rem}
.ep-panel{border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;background:#fff}
.ep-panel-header{list-style:none;padding:1.25rem 1.5rem;display:flex;justify-content:space-between;align-items:center;font-weight:600;font-size:1rem;cursor:pointer;color:#0f172a;background:#f8fafc}
.ep-panel-header::-webkit-details-marker{display:none}
.ep-panel-arrow{font-size:0.75rem;color:#94a3b8;transition:transform 0.2s}
details[open] .ep-panel-arrow{transform:rotate(180deg)}
.ep-panel-body{padding:1.5rem;border-top:1px solid #e2e8f0}
.ep-panel-body p{color:#475569;line-height:1.8}

/* GALLERY */
.ep-gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.25rem}
.ep-gallery-item{border-radius:16px;overflow:hidden;aspect-ratio:1}
.ep-gallery-item img,.ep-gallery-item .ep-img-placeholder{width:100%;height:100%;object-fit:cover}

/* TESTIMONIALS */
.ep-testimonials{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem}
.ep-testimonial{background:#fff;padding:1.75rem;border-radius:20px;border:1px solid #e2e8f0}
.ep-stars{margin-bottom:0.75rem;font-size:1.25rem}
.ep-star-on{color:#f59e0b}
.ep-star-off{color:#e2e8f0}
.ep-testimonial-text{color:#475569;font-size:0.9375rem;line-height:1.7;margin-bottom:1rem;font-style:italic}
.ep-testimonial-author{font-size:0.875rem;color:#64748b}

/* COUNTERS */
.ep-counters{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:2rem;text-align:center}
.ep-counter-val{font-family:'Space Grotesk',sans-serif;font-size:3rem;font-weight:800;color:#6366f1;line-height:1}
.ep-counter p{color:#64748b;margin-top:0.5rem;font-size:0.9375rem}

/* FEATURES */
.ep-features{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem}
.ep-feature{display:flex;gap:1rem;align-items:flex-start;padding:1.25rem;background:#fff;border-radius:16px;border:1px solid #e2e8f0}
.ep-feature-icon{font-size:1.75rem;line-height:1}
.ep-feature h4{font-size:1rem;font-weight:600;margin-bottom:0.25rem;color:#0f172a}
.ep-feature p{font-size:0.875rem;color:#64748b;line-height:1.6}

/* FORM */
.ep-form-wrap .ep-form{max-width:480px;margin:0 auto;display:flex;flex-direction:column;gap:1.25rem}
.ep-field{display:flex;flex-direction:column;gap:0.375rem}
.ep-field label{font-size:0.875rem;font-weight:600;color:#0f172a}
.ep-field .ep-req{color:#ef4444}
.ep-field input,.ep-field textarea{padding:0.875rem 1rem;background:#fff;border:2px solid #e2e8f0;border-radius:12px;font-size:0.9375rem;color:#0f172a;outline:none;transition:border-color 0.2s;font-family:inherit}
.ep-field input:focus,.ep-field textarea:focus{border-color:#6366f1}
.ep-btn-block{width:100%;text-align:center;padding:1rem;font-size:1rem}

/* FOOTER */
.ep-footer{padding:4rem 1.5rem;background:#fff;border-top:1px solid #e2e8f0}
.ep-footer-logo{font-family:'Space Grotesk',sans-serif;font-size:1.35rem;font-weight:700;color:#6366f1;margin-bottom:0.75rem}
.ep-footer-desc{color:#64748b;max-width:400px;margin:0 auto 1rem;font-size:0.9375rem}
.ep-footer-copy{font-size:0.8125rem;color:#94a3b8}

/* DIVIDERS */
.ep-hr{border:none;height:1px;background:#e2e8f0;margin:0}
.ep-hr-dot{border:none;border-top:2px dotted #cbd5e1;height:0;background:transparent;margin:0}
.ep-hr-grad{border:none;height:2px;background:linear-gradient(90deg,transparent,#6366f1,transparent);margin:0}

/* SPACER */
.ep-spacer{width:100%}

/* VIDEO */
.ep-video-wrapper{border-radius:16px;overflow:hidden;background:#e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.ep-video-wrapper iframe,.ep-video-wrapper video{width:100%;height:100%;border:none}
.ep-video-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:0.9375rem}

/* IMAGE PLACEHOLDER */
.ep-img-placeholder{width:100%;height:100%;min-height:200px;border-radius:16px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.ep-img-placeholder::before{content:'';position:absolute;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.15);top:50%;left:50%;transform:translate(-50%,-60%)}
.ep-img-placeholder::after{content:'✦';font-size:2rem;color:rgba(255,255,255,0.5)}

/* RESPONSIVE */
@media(max-width:768px){
  .ep-hero{padding:4rem 1.5rem}
  .ep-hero-title{font-size:2.25rem}
  .ep-section{padding:3rem 0}
  .ep-grid-2,.ep-grid-2-rev{grid-template-columns:1fr;gap:2rem}
  .ep-header{padding:1rem;flex-direction:column;gap:0.75rem}
  .ep-header-nav{gap:1rem}
  .ep-cards{grid-template-columns:1fr}
  .ep-cta{margin:1rem;padding:3rem 1.5rem}
  .ep-cta-title{font-size:1.75rem}
  .ep-counter-val{font-size:2.25rem}
  .ep-testimonials{grid-template-columns:1fr}
  .ep-features{grid-template-columns:1fr}
  .ep-gallery{grid-template-columns:repeat(2,1fr)}
  .ep-gallery-item{aspect-ratio:1}
}
`.trim();
}

/* ===== BUILD HTML ===== */

function buildExportPage(project: Project, bodyHTML: string): string {
  const { settings } = project;
  const { seo } = settings;

  const css = buildExportCSS();

  const meta = [
    seo.description ? `<meta name="description" content="${escapeHTML(seo.description)}">` : "",
    seo.ogTitle ? `<meta property="og:title" content="${escapeHTML(seo.ogTitle)}">` : "",
    seo.ogDescription ? `<meta property="og:description" content="${escapeHTML(seo.ogDescription)}">` : "",
    seo.ogImage ? `<meta property="og:image" content="${escapeHTML(seo.ogImage)}">` : "",
    seo.favicon ? `<link rel="icon" href="${escapeHTML(seo.favicon)}">` : "",
  ].filter(Boolean).join("\n    ");

  const ga = seo.gaId
    ? `\n    <script async src="https://www.googletagmanager.com/gtag/js?id=${escapeHTML(seo.gaId)}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${escapeHTML(seo.gaId)}');</script>`
    : "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${escapeHTML(settings.pageTitle)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet">
  ${meta}${ga}
<style>${css}</style>
</head>
<body>
${bodyHTML}
<script>
(function(){document.querySelectorAll('.ep-tab-btn').forEach(function(b){b.addEventListener('click',function(){var p=this.closest('.ep-tabs');p.querySelectorAll('.ep-tab-btn').forEach(function(x){x.classList.remove('ep-active')});var id=this.getAttribute('data-tab');var c=this.closest('.ep-container');c.querySelectorAll('.ep-tab-pane').forEach(function(x){x.classList.remove('ep-active')});this.classList.add('ep-active');if(id){var el=document.getElementById(id);if(el)el.classList.add('ep-active')}})})})();
</script>
</body>
</html>`;
}

/* ===== PROCESS IMAGES IN HTML FOR ZIP ===== */

function extractImages(html: string): { html: string; images: Map<string, string> } {
  const images = new Map<string, string>();
  let idx = 0;

  const cleaned = html.replace(/<img[^>]+src="([^"]+)"[^>]*>/g, (match, src) => {
    if (src.startsWith("data:") && !src.startsWith("data:image/svg") && src.length > 50000) {
      idx++;
      const ext = src.split(";")[0].split("/")[1] || "png";
      const name = `image-${idx}.${ext}`;
      images.set(name, src);
      return match.replace(src, `images/${name}`);
    }
    return match;
  });

  return { html: cleaned, images };
}

/* ===== EXPORT FUNCTIONS ===== */

export async function exportStandalone(project: Project): Promise<string | null> {
  const sections = project.sections.filter(s => s.visible);
  const bodyHTML = sections.map(s => renderSection(s)).join("\n");
  const html = buildExportPage(project, bodyHTML);
  return downloadBlob(new Blob([html], { type: "text/html" }), `${project.name}.html`);
}

export async function exportAssets(project: Project): Promise<string | null> {
  const zip = new JSZip();
  const sections = project.sections.filter(s => s.visible);
  const bodyHTML = sections.map(s => renderSection(s)).join("\n");

  const { html, images } = extractImages(bodyHTML);
  const fullHTML = buildExportPage(project, html);

  zip.file("index.html", fullHTML);

  if (images.size) {
    const imgFolder = zip.folder("images");
    if (imgFolder) {
      images.forEach((dataUrl, name) => {
        if (dataUrl.startsWith("data:")) {
          const base64 = dataUrl.split(",")[1];
          if (base64) imgFolder.file(name, base64, { base64: true });
        } else {
          imgFolder.file(name, dataUrl, { base64: true });
        }
      });
    }
  }

  const blob = await zip.generateAsync({ type: "blob" });
  return downloadBlob(blob, `${project.name}-assets.zip`);
}

export async function exportZIP(project: Project): Promise<string | null> {
  const zip = new JSZip();
  const sections = project.sections.filter(s => s.visible);
  const bodyHTML = sections.map(s => renderSection(s)).join("\n");

  const { html, images } = extractImages(bodyHTML);
  const fullHTML = buildExportPage(project, html);

  zip.file("index.html", fullHTML);

  if (images.size) {
    const imgFolder = zip.folder("images");
    if (imgFolder) {
      images.forEach((dataUrl, name) => {
        if (dataUrl.startsWith("data:")) {
          const base64 = dataUrl.split(",")[1];
          if (base64) imgFolder.file(name, base64, { base64: true });
        } else {
          imgFolder.file(name, dataUrl, { base64: true });
        }
      });
    }
  }

  const blob = await zip.generateAsync({ type: "blob" });
  return downloadBlob(blob, `${project.name}.zip`);
}

/* ===== DOWNLOAD / SAVE ===== */

const isTauri = typeof window !== "undefined" && "__TAURI__" in window;

async function saveBlobViaTauri(blob: Blob, defaultName: string): Promise<string | null> {
  try {
    const { save } = await import("@tauri-apps/plugin-dialog");
    const { writeFile } = await import("@tauri-apps/plugin-fs");
    const ext = defaultName.endsWith(".zip") ? "zip" : "html";
    const path = await save({
      defaultPath: defaultName,
      filters: [{ name: ext === "zip" ? "ZIP Archive" : "HTML File", extensions: [ext] }],
    });
    if (!path) return null;
    const buf = await blob.arrayBuffer();
    await writeFile(path, new Uint8Array(buf));
    return path;
  } catch {
    return null;
  }
}

async function downloadBlob(blob: Blob, filename: string): Promise<string | null> {
  if (isTauri) {
    const path = await saveBlobViaTauri(blob, filename);
    return path;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return null;
}
