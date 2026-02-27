import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export default function FloatingCart() {
    const count = useCartStore((s) => s.count());

    if (count === 0) return null;

    return (
        <Link
            to="/cart"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#C8102E] text-white rounded-full shadow-2xl hover:bg-[#A00D24] hover:scale-105 transition-all duration-300 md:hidden border-2 border-white/20"
        >
            <div className="relative flex items-center justify-center w-full h-full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <div className="absolute -top-1 -right-1 bg-white text-[#C8102E] text-xs font-black min-w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#C8102E] shadow-lg">
                    {count}
                </div>
            </div>
        </Link>
    );
}
