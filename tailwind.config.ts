import type { Config } from "tailwindcss"

/** Warm shop-inspired palette: plum fabric, natural cotton and marigold. */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        awning: {
          DEFAULT: "#59283f", // primary: plum fabric
          deep: "#432032", // hover / dark bands
          night: "#2e2028", // ink
          mist: "#f0e6eb", // tinted surface
        },
        sun: { DEFAULT: "#edb63b", soft: "#faf0d5" }, // marigold accent
        ember: "#9a4052", // berry accent
        leaf: "#91a57a", // sage accent
        paper: "#f8f5ee", // warm neutral surface
        line: "#e3dcd8",
        muted: "#73656d",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: { site: "76rem" },
      borderRadius: { card: "0.75rem" },
      boxShadow: {
        lift: "0 1px 2px rgb(46 32 40 / 0.06), 0 8px 24px -12px rgb(46 32 40 / 0.18)",
      },
    },
  },
  plugins: [],
}
export default config
