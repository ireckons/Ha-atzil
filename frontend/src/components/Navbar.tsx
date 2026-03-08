import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const count = useCartStore((s) => s.count());
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-[#B21B21] md:bg-[#000000] border-b border-white/10 shadow-md font-sans">
            <div className="max-w-7xl mx-auto px-4 h-[70px] flex items-center justify-between gap-2 md:gap-4">


                {/* ── Logo ── */}
                <Link to="/" className="flex items-center justify-center shrink-0">
                    <img src="/navbar-logo.svg" alt="Navbar Logo" className="h-[36px] md:h-[48px] object-contain text-[#C8102E]" />
                </Link>

                {/* ── Mobile Search Bar ── */}
                <form
                    onSubmit={handleSearch}
                    className="md:hidden flex flex-1 items-center bg-white/10 rounded-md border border-white/20 overflow-hidden ml-2"
                >
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('nav.explore')}
                        className="flex-1 px-3 py-2 bg-transparent border-none outline-none text-[13px] text-white placeholder-white/40"
                    />
                    <button type="submit" className="px-3 py-2 bg-transparent flex items-center justify-center text-white/60 hover:text-white">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </button>
                </form>

                {/* ── Navigation Links ── */}
                <div className="hidden md:flex items-center gap-4 md:gap-8 mx-auto shrink-0">
                    <Link to="/" className="text-white md:text-[#B21B21] font-bold text-sm uppercase tracking-wider hover:text-white md:hover:text-[#6B191E] transition-colors">
                        {t('nav.home')}
                    </Link>
                    <Link to="/catalog" className="text-white md:text-[#B21B21] font-bold text-sm uppercase tracking-wider hover:text-white md:hover:text-[#6B191E] transition-colors">
                        {t('nav.menu')}
                    </Link>
                </div>

                {/* ── Search Bar (Desktop) ── */}
                <form
                    onSubmit={handleSearch}
                    className="hidden md:flex flex-1 items-center bg-white/10 rounded-md border border-white/20 max-w-[400px] overflow-hidden mx-4"
                >
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('nav.explore_haatzil')}
                        className="flex-1 px-4 py-2.5 bg-transparent border-none outline-none text-sm text-white placeholder-white/40"
                    />
                    <button type="submit" className="px-4 py-2.5 bg-[#B21B21] flex items-center justify-center hover:bg-[#6B191E] transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </button>
                </form>

                {/* ── Right Icons ── */}
                <div className="hidden md:flex items-center gap-2 md:gap-3 shrink-0">
                    {/* Language Switcher */}
                    <button
                        onClick={() => i18n.changeLanguage(i18n.language.startsWith('en') ? 'he' : 'en')}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all font-bold"
                        aria-label="Toggle language"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        <span className="hidden lg:inline text-[13px] font-bold tracking-wide">
                            {i18n.language.startsWith('en') ? 'עברית' : 'EN'}
                        </span>
                    </button>

                    {/* Login */}
                    <Link
                        to="/login"
                        className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all font-bold"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span className="hidden lg:inline text-[13px] font-bold tracking-wide">{t('nav.login')}</span>
                    </Link>

                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-[#B21B21] border border-[#B21B21] text-white rounded-lg hover:bg-[#6B191E] hover:border-[#6B191E] transition-all whitespace-nowrap font-extrabold"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        <span className="text-[13px] md:text-[14px] font-extrabold tracking-wide">
                            <span className="hidden lg:inline">{t('nav.cart')} </span>
                            {count > 0 ? `(${count})` : ''}
                        </span>
                    </Link>
                </div>
            </div>


        </header>
    );
}
