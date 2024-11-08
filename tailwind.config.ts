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
        'custom-orange': '#FFA034', 
        'custom-cyan': '#34C6FE', 
        'custom-blue': '#07476B', 
        'custom-black': '#1a1a1a', 
        'custom-white': '#f5f5f5', 
        'custom-gray': '#ECECEC',  
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

export default config;