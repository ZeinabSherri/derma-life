/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // Site-wide 2-font system (see src/app/app.css for the --font-heading /
      // --font-body variable definitions, which point at the next/font-
      // generated variables from src/app/layout.tsx). No italic accent font.
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "slide-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        // Content is rendered twice back-to-back (see CategoryTicker), so
        // -50% is exactly one copy's width - the loop point is seamless
        // regardless of how wide the label text ends up being.
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "slide-left": "slide-left 3s linear infinite",
        "spin-slow": "spin 6s linear infinite",
        marquee: "marquee 22s linear infinite",
      },
    },
  },
};
