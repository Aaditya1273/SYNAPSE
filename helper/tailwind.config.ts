/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ["var(--font-space-grotesk)", "sans-serif"],
                mono: ["Space Mono", "monospace"],
            },
            colors: {
                primary: {
                    DEFAULT: "#0df26c",
                    dark: "#0ab850",
                },
                "background-light": "#f5f8f7",
                "background-dark": "#102217",
                "surface-dark": "#162e21",
                "surface-darker": "#0d1a12",
                "surface-border": "#284435",
                "card-dark": "#1a3324",
                "border-dark": "#2a4b37",
                "border-green": "#28392f",
                "text-secondary": "#9cbaa8",
                success: "#0bda43",
                warning: "#facc15",
                error: "#fa5538",
            },
            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                "2xl": "1rem",
                full: "9999px",
            },
            keyframes: {
                "pulse-glow": {
                    "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(13,242,108,0.3)" },
                    "50%": { opacity: "0.7", boxShadow: "0 0 40px rgba(13,242,108,0.5)" },
                },
                nodePulse: {
                    "0%, 100%": { opacity: "1", transform: "scale(1)" },
                    "50%": { opacity: "0.7", transform: "scale(1.05)" },
                },
                pipelineFlow: {
                    "0%": { opacity: "0", transform: "translateX(-50%) scaleY(0)", transformOrigin: "top" },
                    "50%": { opacity: "1", transform: "translateX(-50%) scaleY(1)" },
                    "100%": { opacity: "0", transform: "translateX(-50%) scaleY(0)", transformOrigin: "bottom" },
                },
            },
            animation: {
                "pulse-glow": "pulse-glow 2s ease-in-out infinite",
                "node-pulse": "nodePulse 2s ease-in-out infinite",
                "pipeline-flow": "pipelineFlow 1.5s ease-in-out infinite",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
