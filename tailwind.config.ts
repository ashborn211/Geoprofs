import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-red': '#FF6347', // Tomato red
        'custom-blue': '#1E90FF', // Dodger blue
        'custom-black': '#1a1a1a', // Dark black
        'custom-white': '#f5f5f5', // Off white
        'custom-gray': '#d1d5db',  // Light gray
      },
    },
  },
  plugins: [],
};

export default config;
