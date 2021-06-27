module.exports = {
  darkMode: false, // or 'media' or 'class'
  mode: "jit",
  purge: [`./dist/**/*.{html,js}`],
  theme: {
    extend: {
      textColor: {
        primary: "#4e4e4e",
        heading: "black",
      },
      colors: {
        primary: "#3490dc",
        secondary: "#ffed4a",
        danger: "#e3342f",
      },
      spacing: {
        "1vw": "1vw",
        "2vw": "2vw",
        "3vw": "3vw",
        "4vw": "4vw",
        "5vw": "5vw",
        "6vw": "6vw",
      },
    },
    container: {
      center: true,
      padding: "4vw",
    },
  },
  variants: {
    extend: {},
  },
  corePlugins: {
    // ...
    fontFamily: false,
  },
  plugins: [
    require("tailwindcss-rtl"),
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("tailwindcss-debug-screens"),
  ],
};
