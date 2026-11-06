import type { Config } from "tailwindcss"

/**
 * Palette is taken from the store's awning: royal blue field, white lettering,
 * a yellow "F", an orange-red "S" and green "Uniform".
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        awning: {
          DEFAULT: "#1e3fa3", // primary: the awning
          deep: "#152e7e", // hover / dark bands
          night: "#0f1a40", // ink
          mist: "#e9eefa", // tinted surface
        },
        sun: { DEFAULT: "#f7c02b", soft: "#fdf1cc" }, // the yellow F
        ember: "#e8522c", // the orange-red S (accent only)
        leaf: "#6cc24a", // "Uniform" green (wordmark + small accents)
        paper: "#f7f5f0", // warm neutral surface
        line: "#dde1ea",
        muted: "#4a5370",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-rounded", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: { site: "76rem" },
      borderRadius: { card: "0.75rem" },
      boxShadow: {
        lift: "0 1px 2px rgb(15 26 64 / 0.06), 0 8px 24px -12px rgb(15 26 64 / 0.18)",
      },
    },
  },
  plugins: [],
}
export default config
