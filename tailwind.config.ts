import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      green: "#6eb072",
      red: "#f65c5c",
      darkGrey: "#25263e",
      primaryMain: "#8359ff",
      primaryDark: "#5834a9",
      drawerColor: "#252935",
      white: "#fff",
      black: "#000",
      riverBed: "#4D4F5C",
      santaGrey: "#a1a0ae",
      magnolia: "#f5f6fa",
      porcelain: "#f2f2f2",
      platinum: "#e4e4e4",
      ashGrey: "#b9babf",
      aluminium: "#afafaf",
      pastelGrey: "#ccc",
      dune: "#333",
      mercury: "#e6e6e6",
      silverChalice: "#adadad",
      jungleGreen: "#212529",
      mountainMist: "#949494",
      smokeyGrey: "#706e6e",
      whiteIce: "#dff9ed",
      primary: "#8359ff",
      fontGrey: "#999999",
      fontDark: "#28004b",
      lightGrey: "#eeeeee",
      success: "#5bc5a7",
      danger: "#fe652f",
      gainsboro: "#dddddd",
      smoke: "#f8f8f8",
      linkColor: "#2075ec",
      linkHover: "#005580",
      amber: "#d97706",
      noteCard: "#e4e6edc4",
      successColor: "#5ac12f",
    },
  },
  plugins: [],
};
export default config;
