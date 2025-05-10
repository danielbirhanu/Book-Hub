/** @type {import('tailwindcss').Config} */
export const content = [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    theme, {
        extend: {
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
            },
        },
    },
    plugins, [],
];