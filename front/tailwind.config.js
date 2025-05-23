// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./app/components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/globals.css",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    // Couleurs dynamiques par défaut
    {
      pattern:
        /border-(blue|red|orange|green|purple|pink|gray|teal|amber|cyan)-500/,
    },
    {
      pattern:
        /bg-(blue|red|orange|green|purple|pink|gray|teal|amber|cyan)-100/,
    },
    {
      pattern:
        /text-(blue|red|orange|green|purple|pink|gray|teal|amber|cyan)-500/,
    },
    // Même chose au hover : on inclut **toutes** les couleurs listées
    {
      pattern:
        /hover:border-(blue|red|orange|green|purple|pink|gray|teal|amber|cyan)-500/,
    },
    {
      pattern:
        /hover:bg-(blue|red|orange|green|purple|pink|gray|teal|amber|cyan)-100/,
    },
    "hover:scale-105",
    "hover:shadow-lg",
    "hover:z-10",
  ],
};
