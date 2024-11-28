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
        /*new theme colours*/
        'custom-black2': '#000000',  
        'custom-blue2': '#2E56A2',  
        'linear1': '#B7C9D3',  
        'linear2': '#DAEDFF', 
        'custom-orange2': '#FFA034',
        'special-gray': '#ECECEC',
        'special-gray2': '#EDEDED',
        'custom-white2': '#FFFFFF',
        'custom-blue3' : '#0D8BD1',
        'custom-darkblue' : '#2C6E93',
        'custom-green' : '#33FF18',
        'custom-red' : '#E11F1F',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

export default config;