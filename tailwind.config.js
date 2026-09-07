/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        secao:{
          dark: '#0f172a',    // Fundo escuro Slate 900
          card: '#1e293b',    // Cards Slate 800
          red: '#e11d48',    //  Destaque Cinema (Rose 600)
          purple: '#8b5cf6', //  Destaque Anime/Séries (Violet 500)
          border: '#334155'  // Bordas suaves
        }
      }
    },
  },
  plugins: [],
}

