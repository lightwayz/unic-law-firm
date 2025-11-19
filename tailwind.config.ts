import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                unicDark: "#020617",   // deep navy/gray
                unicGold: "#D4AF37",
            },
        },
    },
    plugins: [],
};
export default config;
