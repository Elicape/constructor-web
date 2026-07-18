/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        editor: {
          bg: "var(--bg-editor)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
          text: "var(--text-primary)",
          "text-sec": "var(--text-secondary)",
          accent: "var(--accent)",
          "accent-hover": "var(--accent-hover)",
          border: "var(--border)",
          success: "var(--success)",
          danger: "var(--danger)",
        },
      },
      fontFamily: {
        editor: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
