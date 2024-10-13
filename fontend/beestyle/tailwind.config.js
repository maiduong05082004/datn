/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        extend: {
            screens : {
                'lg': {'min' : '992px'},
                'pc': {'min' : '1336px'}
              }
        },
    },
    plugins: [require("tailwindcss-animate")],
};
