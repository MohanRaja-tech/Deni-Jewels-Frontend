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
                    50: '#FFF9F0',
                    100: '#FFF3E0',
                    200: '#FFE4BA',
                    300: '#FFD699',
                    400: '#F0C066',
                    500: '#D4A853',
                    600: '#B8923E',
                    700: '#9A7A33',
                    800: '#7C6228',
                    900: '#5E4A1E',
                },
                champagne: '#F7E7CE',
                ivory: '#FFFFF0',
                pearl: '#F8F6F0',
                beige: '#F5F0E8',
                blush: '#FDE8E8',
                'soft-gold': '#D4A853',
                'deep-gold': '#B8860B',
                'rose-gold': '#B76E79',
                cream: '#FFFDD0',
                'warm-white': '#FAF9F6',
            },
            fontFamily: {
                serif: ['Playfair Display', 'Georgia', 'serif'],
                sans: ['Outfit', 'system-ui', 'sans-serif'],
                display: ['Cormorant Garamond', 'serif'],
            },
            boxShadow: {
                'luxury': '0 4px 30px rgba(212, 168, 83, 0.15)',
                'luxury-lg': '0 10px 50px rgba(212, 168, 83, 0.2)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
                'soft': '0 2px 20px rgba(0, 0, 0, 0.06)',
                'elegant': '0 4px 40px rgba(0, 0, 0, 0.08)',
            },
            backgroundImage: {
                'gold-gradient': 'linear-gradient(135deg, #D4A853 0%, #F0D68A 50%, #D4A853 100%)',
                'hero-gradient': 'linear-gradient(135deg, #FFF9F0 0%, #F7E7CE 50%, #FFF3E0 100%)',
                'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
            },
            animation: {
                'shimmer': 'shimmer 2s infinite',
                'float': 'float 3s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(212, 168, 83, 0.2)' },
                    '100%': { boxShadow: '0 0 40px rgba(212, 168, 83, 0.4)' },
                },
            },
        },
    },
    plugins: [],
};
