import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#f78a1d",
        tremor: {
          brand: {
            faint: "#fff5e9",
            muted: "#ffd7a8",
            subtle: "#ffb366",
            DEFAULT: "#f78a1d",
            emphasis: "#e67300",
            inverted: "#ffffff",
          },
        },
      },
      keyframes: {
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
        glow: {
          '0%': { opacity: '0.8' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.8' },
        }
      },
      animation: {
        aurora: "aurora 60s linear infinite",
        glow: 'glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
