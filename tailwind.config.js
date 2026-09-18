/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // Matches https://dermalife-3d.norma313.chatgpt.site/ exactly: no
      // custom web font, just the system stacks it uses directly in its
      // own CSS (`body{font-family:Helvetica Neue,Arial,sans-serif}`,
      // `em{font-family:Georgia,serif}`).
      fontFamily: {
        sans: ['"Helvetica Neue"', "Arial", "sans-serif"],
        serif: ["Georgia", '"Times New Roman"', "serif"],
      },
      keyframes: {
        "slide-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "slide-left": "slide-left 3s linear infinite",
        "spin-slow": "spin 6s linear infinite",
      },
    },
  },
};
