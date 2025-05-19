module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // dossier app/ (layout, page, etc.)
    "./app/components/**/*.{js,ts,jsx,tsx}", // vos composants
    "./pages/**/*.{js,ts,jsx,tsx}", // si vous avez encore un dossier pages/
    "./components/**/*.{js,ts,jsx,tsx}", // si vous avez un dossier components/ à la racine
    "./app/globals.css", // votre CSS global
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    "hover:border-blue-500",
    "hover:bg-blue-100",
    "hover:border-red-500",
    "hover:bg-red-100",
    "hover:border-orange-500",
    "hover:bg-orange-100",
    "hover:border-green-500",
    "hover:bg-green-100",
    "hover:border-purple-500",
    "hover:bg-purple-100",
    "hover:border-pink-500",
    "hover:bg-pink-100",
    "hover:scale-105",
    "hover:shadow-lg",
    "hover:z-10",
  ],
};
