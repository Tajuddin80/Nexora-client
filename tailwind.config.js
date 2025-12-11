module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        // mycustomlight: {
        //   "primary": "#B8001F",
        //   "primary-content": "#FFFFFF",
        //   "base-100": "#FCFAEE",
        //   "base-content": "#000000",
        //   "secondary": "#B8001F",
        //   "accent": "#B8001F",
        //   "neutral": "#000000",
        //   "info": "#3ABFF8",
        //   "success": "#36D399",
        //   "warning": "#FBBF24",
        //   "error": "#F87272",
        // },
        // Soft Yellow Light
        // mycustomlight: {
        //   primary: "#B8001F",
        //   "primary-content": "#FFFFFF",
        //   "base-100": "#FFF9E6", // soft warm yellow
        //   "base-content": "#1A1A1A",
        //   secondary: "#EDBF6D", // matches dark theme
        //   accent: "#F4D06F",
        //   neutral: "#4A4A4A",
        //   info: "#3ABFF8",
        //   success: "#36D399",
        //   warning: "#FBBF24",
        //   error: "#F87272",
        // },
        // // Clean White Modern
        // mycustomlight: {
        //   primary: "#B8001F",
        //   "primary-content": "#FFFFFF",
        //   "base-100": "#FFFFFF",
        //   "base-content": "#111111",
        //   secondary: "#B8001F",
        //   accent: "#FFD54F", // soft golden accent
        //   neutral: "#2D2D2D",
        //   info: "#3ABFF8",
        //   success: "#36D399",
        //   warning: "#FBBF24",
        //   error: "#F87272",
        // },
        // // Slight Yellow Tint
        // mycustomlight: {
        //   primary: "#B8001F",
        //   "primary-content": "#FFFFFF",
        //   "base-100": "#FAF6E8", // very light yellow-beige
        //   "base-content": "#1A1A1A",
        //   secondary: "#B8001F",
        //   accent: "#E8C872",
        //   neutral: "#3A3A3A",
        //   info: "#3ABFF8",
        //   success: "#36D399",
        //   warning: "#FBBF24",
        //   error: "#F87272",
        // },
        // Soft Mint Light
        // mycustomlight: {
        //   primary: "#B8001F",
        //   "primary-content": "#FFFFFF",
        //   "base-100": "#F4FFFA", // mint white
        //   "base-content": "#162020",
        //   secondary: "#56C596", // mint green
        //   accent: "#7EE0B5",
        //   neutral: "#293131",
        //   info: "#3ABFF8",
        //   success: "#3ED598",
        //   warning: "#FFB800",
        //   error: "#F87272",
        // },
        // Calm Lavender Light
        //         mycustomlight: {
        //   "primary": "#B8001F",
        //   "primary-content": "#FFFFFF",
        //   "base-100": "#F7F5FF",
        //   "base-content": "#222222",
        //   "secondary": "#A58DF1",
        //   "accent": "#C7B6FF",
        //   "neutral": "#47425A",
        //   "info": "#3ABFF8",
        //   "success": "#36D399",
        //   "warning": "#FFCA63",
        //   "error": "#F87272",
        // },
        // Ice Blue Light
        // mycustomlight: {
        //   "primary": "#B8001F",
        //   "primary-content": "#FFFFFF",
        //   "base-100": "#F5FAFF",  // icy white
        //   "base-content": "#111B29",
        //   "secondary": "#6CB2FF",
        //   "accent": "#A9D4FF",
        //   "neutral": "#2F3A45",
        //   "info": "#3ABFF8",
        //   "success": "#36D399",
        //   "warning": "#FFB94A",
        //   "error": "#F87272",
        // },
      },
      {
        mycustomdark: {
          primary: "#edbf6d",
          "primary-content": "#ffffff",
          "base-100": "#00032e",
          "base-content": "#ffffff",
          secondary: "#f5f5f5",
          accent: "#fbbf24",
          neutral: "#1f2937",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
      },
    ],
  },
};
