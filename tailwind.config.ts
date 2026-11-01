import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="DARK_OS"]'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: "var(--bg-primary)",
          surface: "var(--bg-surface)",
          elevated: "var(--bg-surface-elevated)",
          text: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          orange: "var(--accent-orange)",
          cyan: "var(--accent-cyan)",
          border: "var(--border-color)",
          subtle: "var(--border-subtle)",
        },
      },
      fontFamily: {
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          '"JetBrains Mono"',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      boxShadow: {
        retro: "4px 4px 0px 0px rgba(233, 71, 11, 0.35)",
        window: "6px 6px 0px 0px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
