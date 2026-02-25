import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
    const count = useCartStore((s) => s.count());
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [locationOpen, setLocationOpen] = useState(false);
    const [location, setLocation] = useState('Safed');

    const locations = ['Safed', 'Jerusalem', 'Tel Aviv', 'Haifa'];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header
            className="sticky top-0 z-50"
            style={{
                background: 'rgba(8,8,8,0.97)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(200,16,46,0.3)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
            }}
        >
            <div
                className="max-w-7xl mx-auto px-4"
                style={{
                    height: 70,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                }}
            >
                {/* ── Logo ── */}
                <Link to="/" style={{ display: 'block' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <span className="font-hebrew" style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '0.05em' }}>
                            האציל
                        </span>
                    </div>
                </Link>

                {/* ── Navigation Links ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginLeft: 24, flexShrink: 0 }}>
                    <Link
                        to="/"
                        style={{
                            color: '#fff',
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontSize: 14,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#C8102E')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
                    >
                        Home
                    </Link>
                    <Link
                        to="/catalog"
                        style={{
                            color: '#fff',
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontSize: 14,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#C8102E')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
                    >
                        Menu
                    </Link>
                </div>

                {/* ── Search Bar ── */}
                <form
                    onSubmit={handleSearch}
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.07)',
                        borderRadius: 6,
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.12)',
                        maxWidth: 520,
                    }}
                >
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Explore Ha-Atzil's best picks..."
                        style={{
                            flex: 1,
                            padding: '10px 16px',
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            fontSize: 13,
                            color: '#fff',
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '10px 16px',
                            background: '#C8102E',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </button>
                </form>

                {/* ── Right Icons ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto', flexShrink: 0 }}>

                    {/* Login */}
                    <Link
                        to="/login"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '10px 16px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            textDecoration: 'none',
                            color: 'rgba(255,255,255,0.95)',
                            borderRadius: 8,
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.95)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.03em' }}>Login</span>
                    </Link>

                    {/* Cart */}
                    <Link
                        to="/cart"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '10px 20px',
                            background: '#C8102E', // Primary CTA button
                            border: '1px solid #C8102E',
                            textDecoration: 'none',
                            color: '#fff',
                            borderRadius: 8,
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#A00D24'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#C8102E'; }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.02em' }}>
                            Cart {count > 0 ? `(${count})` : ''}
                        </span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
