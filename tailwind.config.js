/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        primary: '#030014', //dark violet blue
        secondary: '#151312',  //Dark charcoal gray
        light: {
          100:'#bddeff', //Light blue sky
          200:'#A8B5DB', //Gray-blue
          300:'#9CA4AB' //Silver-gray
        },
        dark: {
          100:'#221f3d', //violet blue
          200:'#0e0454' //Deep indigo
        },
        accent: '#6398ef' //Vivid blue
      }
    },
  },
  plugins: [],
}
