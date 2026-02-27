import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export default function MobileBottomNav() {
    const count = useCartStore((s) => s.count());

    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 px-6 py-2 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <Link to="/" className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#C8102E]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
            </Link>

            <Link to="/catalog" className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#C8102E]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">Menu</span>
            </Link>

            <Link to="/cart" className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#C8102E] relative">
                <div className="relative">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    {count > 0 && (
                        <div className="absolute -top-1.5 -right-1.5 bg-[#C8102E] text-white text-[10px] font-black min-w-[16px] h-[16px] rounded-full flex items-center justify-center shadow-sm">
                            {count}
                        </div>
                    )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Cart</span>
            </Link>

            <Link to="/login" className="flex flex-col items-center gap-1 text-gray-500 hover:text-[#C8102E]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">Login</span>
            </Link>
        </div>
    );
}
