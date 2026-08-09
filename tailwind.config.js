/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          bg: "#FBF3DB",
          text: "#3A3226",
        },
        bluetint: {
          bg: "#EAF1F8",
          text: "#1F2933",
        },
      },
      fontFamily: {
        opendyslexic: ["OpenDyslexic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
