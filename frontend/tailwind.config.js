module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // if you're using React
    "./public/index.html",         // optional but safe to include
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",   // Indigo
        secondary: "#10B981", // Emerald
        base: "#F9FAFB",      // Light background
      },
    },
  },
  plugins: [],
}
