import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'ml-yellow': '#FFE600',
        'ml-blue': '#3483FA',
        'ml-green': '#00A650',
      },
    },
  },
  plugins: [],
};
export default config;
