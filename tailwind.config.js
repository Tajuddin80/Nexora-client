// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mycustomlight: {
          "primary": "#B8001F",
          "primary-content": "#FFFFFF",
          "base-100": "#FCFAEE",
          "base-content": "#000000",
          "secondary": "#B8001F",
          "accent": "#B8001F",
          "neutral": "#000000",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBF24",
          "error": "#F87272",
        },
      },
      {
        mycustomdark: {
          "primary": "#edbf6d",
          "primary-content": "#ffffff",
          "base-100": "#00032e",
          "base-content": "#ffffff",
          "secondary": "#f5f5f5",
          "accent": "#fbbf24",
          "neutral": "#1f2937",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
  },
};
