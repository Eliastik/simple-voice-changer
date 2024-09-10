import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@eliastik/simple-sound-studio-components/lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            maxWidth: {
                "28": "7rem",
                "32": "8rem",
                "36": "9rem",
            },
            fontSize: {
                "filters": "12.5px"
            }
        },
    },
    daisyui: {
        themes: [
            {
                light: {
                    "primary": "#60a5fa",
                    "secondary": "#bfdbfe",
                    "accent": "#1dcdbc",
                    "neutral": "#2b3440",
                    "base-100": "#ffffff",
                    "base-200": "#f2f2f2",
                    "info": "#3abff8",
                    "success": "#36d399",
                    "warning": "#fbbd23",
                    "error": "#f87272",
                }
            },
            {
                dark: {
                    "primary": "#3884ff",
                    "secondary": "#7b9cff",
                    "secondary-content": "#333333",
                    "accent": "#2db3aa",
                    "neutral": "#a8b2cc",
                    "base-100": "#1e262f",
                    "base-200": "#232a34",
                    "info": "#3abff8",
                    "success": "#36d399",
                    "warning": "#fbbd23",
                    "error": "#f87272"
                }
            }
        ],
    },
    plugins: [require("daisyui")],
    themes: ["light", "dark"]
};

export default config;
