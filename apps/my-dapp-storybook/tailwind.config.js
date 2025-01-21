/** @type {import('tailwindcss').Config} */
module.exports = {
  
  content: [
    "./node_modules/@mydapp/uiv2/**/*.{js,jsx,ts,tsx}", // 添加这行
    "./stories/**/*.{js,jsx,ts,tsx}",
    
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

