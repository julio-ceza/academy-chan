/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-saas': '#10B981',    // Emerald Green
        'secondary-saas': '#1F2937',  // Dark Gray
        'client-bg': '#F0F4F8',       // Light blue-gray for client UI
      }
    },
  },
  plugins: [],
}