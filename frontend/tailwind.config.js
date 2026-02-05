/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#10b981', // emerald-500
                    hover: '#059669', // emerald-600
                },
                danger: {
                    DEFAULT: '#f43f5e', // rose-500
                    hover: '#e11d48', // rose-600
                },
                secondary: {
                    DEFAULT: '#8b5cf6', // violet-500
                    hover: '#7c3aed', // violet-600
                },
                dark: {
                    bg: '#0f172a', // slate-900 (Main BG)
                    card: '#1e293b', // slate-800
                    input: '#334155', // slate-700
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
