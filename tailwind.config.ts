import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // enable dark mode with the 'class' strategy
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Custom colors for dark and light mode
        darkBackground: '#0f172a',
        darkText: '#e0e0e0',
        lightBackground: '#ffffff',
        lightText: '#000000',
      },
    },
  },
  plugins: [],
};
export default config;
