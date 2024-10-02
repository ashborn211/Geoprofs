const { nextui } = require("@nextui-org/react");
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-orange': '#FFA034', // Tomato red
        'custom-cyan': '#34C6FE', // Dodger blue
        'custom-blue': '#07476B', // Dark blue 
        'custom-black': '#1a1a1a', // Dark black
        'custom-white': '#f5f5f5', // Off white
        'custom-gray': '#ECECEC',  // Light gray
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

export default config;