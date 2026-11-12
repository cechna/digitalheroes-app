import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        hero: {
          fuchsia: "#E40488",
          "fuchsia-dark": "#B00266",
          "fuchsia-light": "#FA2EA7",
          lightning: "#FFBE01",
          "lightning-glow": "#FFE066",
          navy: "#060B23",
          surface: "#0D132D",
          card: "#121938",
          cyan: "#1DCAFF",
        },
      },
      boxShadow: {
        fuchsia: "0 0 25px -3px rgba(228, 4, 136, 0.4)",
        "fuchsia-lg": "0 0 45px -5px rgba(228, 4, 136, 0.55)",
        lightning: "0 0 25px -3px rgba(255, 190, 1, 0.5)",
      },
      animation: {
        pulseSlow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
