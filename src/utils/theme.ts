import type { ThemeSettings } from "../types";

export function applyTheme(theme: ThemeSettings): void {
  const root = document.documentElement;

  root.style.setProperty("--bg-editor", theme.bgColor);
  root.style.setProperty("--bg-secondary", theme.cardBgColor);
  root.style.setProperty("--text-primary", theme.textColor);
  root.style.setProperty("--accent", theme.accentColor);
  root.style.setProperty("--accent-hover", adjustColor(theme.accentColor, -20));
  root.style.setProperty("--border", theme.borderColor);

  document.body.style.fontFamily = `"${theme.fontFamily}", system-ui, sans-serif`;

  if (theme.mode === "light") {
    root.classList.add("light");
  } else {
    root.classList.remove("light");
  }
}

export function applyCustomCSS(css: string): void {
  let styleEl = document.getElementById("custom-css");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "custom-css";
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = css;
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
