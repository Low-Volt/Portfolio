/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="night"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mint: {
          100: "#dffcf3",
          200: "#baf5e3",
          300: "#8fedd1",
          400: "#5de2bc",
          500: "#2fd4a9",
          600: "#18b88f"
        }
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        glow: "0 18px 45px -22px rgba(47, 212, 169, 0.55)"
      }
    }
  },
  plugins: []
};
