import type { Config } from 'tailwindcss';

export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    black: '#000000',
                    white: '#FFFFFF',
                    red: '#C8102E',
                    'dark-gray': '#1F1F1F',
                    'light-gray': '#F5F5F5',
                    'red-dark': '#A00C24',
                    'red-light': '#E5193D',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                hebrew: ['Heebo', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'pulse-red': 'pulseRed 2s infinite',
            },
            keyframes: {
                fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
                slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
                pulseRed: { '0%,100%': { boxShadow: '0 0 0 0 rgba(200,16,46,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(200,16,46,0)' } },
            },
            backgroundImage: {
                'hero-pattern': "url('/bull-silhouette.svg')",
            },
        },
    },
    plugins: [],
} satisfies Config;
