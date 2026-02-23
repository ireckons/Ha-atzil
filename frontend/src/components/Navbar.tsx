import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { strings } from '../i18n';

const t = strings.he.nav;

export default function Navbar() {
    const count = useCartStore((s) => s.count());
    const location = useLocation();

    return (
        <header className="sticky top-0 z-50 bg-brand-black/95 backdrop-blur-sm border-b border-white/10">
            <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between" aria-label="ניווט ראשי">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group" aria-label="האציל – דף הבית">
                    <img src="/bull-silhouette.svg" alt="" className="w-8 h-8 group-hover:scale-110 transition-transform" aria-hidden="true" />
                    <div className="flex flex-col leading-none">
                        <span className="text-xl font-black text-brand-white tracking-wide font-hebrew">האציל</span>
                        <span className="text-xs text-brand-red font-medium">since 2005</span>
                    </div>
                </Link>

                {/* Navigation links */}
                <div className="flex items-center gap-6" role="list">
                    <NavLink to="/catalog" label={t.catalog} active={location.pathname.startsWith('/catalog')} />
                    <NavLink to="/privacy" label={t.privacy} active={location.pathname === '/privacy'} />
                </div>

                {/* Cart */}
                <Link
                    to="/cart"
                    className="relative flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label={`${t.cart} (${count} פריטים)`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m5-9l2 9" />
                    </svg>
                    <span className="hidden sm:inline text-sm font-medium">{t.cart}</span>
                    {count > 0 && (
                        <span className="absolute -top-1.5 -start-1.5 min-w-[20px] h-5 px-1 bg-brand-red text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse-red">
                            {count}
                        </span>
                    )}
                </Link>
            </nav>
        </header>
    );
}

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
    return (
        <li style={{ listStyle: 'none' }}>
            <Link
                to={to}
                className={`text-sm font-medium transition-colors py-1 border-b-2 ${active
                        ? 'text-brand-red border-brand-red'
                        : 'text-brand-light-gray border-transparent hover:text-white hover:border-brand-red/50'
                    }`}
            >
                {label}
            </Link>
        </li>
    );
}
