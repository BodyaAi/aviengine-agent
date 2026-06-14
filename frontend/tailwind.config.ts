import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.25rem", screens: { "2xl": "1200px" } },
    extend: {
      fontFamily: { sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"] },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "#1455ff", 50: "#edf4ff", 100: "#dbe9ff", 200: "#bdd7ff", 300: "#8db9ff", 400: "#5a90ff", 500: "#2f6dff", 600: "#1455ff", 700: "#0d3fe0", 800: "#1236b5", 900: "#102a79", 950: "#07143a" },
        ink: { 50: "#f7f9ff", 100: "#edf2ff", 200: "#dce5fb", 300: "#bac7e5", 400: "#8290b8", 500: "#617094", 600: "#445170", 700: "#303a55", 800: "#1b2540", 900: "#111a31", 950: "#070c18" },
        success: "#22c55e", warning: "#f59e0b", danger: "#ef4444", cyan: "#58d8ff", violet: "#8b5cf6"
      },
      boxShadow: {
        glass: "inset 0 1px 0 rgba(255,255,255,.75), 0 24px 80px rgba(4,16,50,.18)",
        glow: "0 0 60px rgba(20,85,255,.35)",
        premium: "0 20px 70px rgba(5,13,35,.35), inset 0 1px 0 rgba(255,255,255,.12)"
      },
      backgroundImage: {
        "blue-radial": "radial-gradient(circle at 25% 10%, rgba(88,216,255,.28), transparent 28%), radial-gradient(circle at 80% 20%, rgba(20,85,255,.35), transparent 30%), linear-gradient(145deg,#06122f 0%, #071a46 38%, #0b2c92 100%)",
        "glass-line": "linear-gradient(135deg,rgba(255,255,255,.14),rgba(255,255,255,.05))"
      },
      borderRadius: { xl: "0.9rem", "2xl": "1.25rem", "3xl": "1.75rem" },
      keyframes: {
        shimmer: { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(100%)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        pulseGlow: { "0%,100%": { opacity: ".55" }, "50%": { opacity: "1" } }
      },
      animation: { float: "float 6s ease-in-out infinite", pulseGlow: "pulseGlow 3s ease-in-out infinite" }
    }
  },
  plugins: []
};
export default config;
