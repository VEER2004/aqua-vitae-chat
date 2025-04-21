
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        aqua: {
          DEFAULT: "#33C3F0",
          light: "#D3E4FD",
        },
        medgreen: {
          DEFAULT: "#F2FCE2",
        },
      },
      borderRadius: {
        xl: "1.25rem",
      },
      boxShadow: {
        soft: "0 2px 8px 0 rgba(51,195,240,0.10)",
        chat: "0 4px 16px 0 rgba(51,195,240,0.08)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
