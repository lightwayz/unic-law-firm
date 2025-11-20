import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                unicPurple: "#4B2BA7",
                unicPurpleDark: "#2B175D",
                unicPurpleLite: "#7A52CC",
                unicLogoPurple: "#5643A9",
                unicBgPurple: "#351F6B",
                unicGold: "#D4AF37",
            },
            fontFamily: {
                sans: ["Nunito", "system-ui", "sans-serif"],
                serif: ["Playfair Display", "serif"],
            },
        },
    },
    plugins: [],
};

export default config;
