import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/client';
import HeroParallax from '../components/HeroParallax';

export default function HomePage() {
    const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: productApi.categories });

    return (
        <div className="min-h-screen bg-[#111]" style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
            {/* ── Hero ── */}
            <HeroParallax />

            {/* ── What To Choose Section ── */}
            <section className="relative bg-[#111] py-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Big Editorial Headline */}
                    <div>
                        <p className="text-[#C8102E] text-xs font-bold tracking-[0.3em] uppercase mb-4">OUR SELECTION</p>
                        <h2 className="text-white font-black leading-tight mb-5"
                            style={{ fontSize: 'clamp(48px, 7vw, 90px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
                            what<br />to<br />choose
                        </h2>
                        <div className="w-10 h-[3px] bg-[#C8102E] mb-6" />
                        <p className="text-white/55 text-[15px] leading-relaxed max-w-sm">
                            Premium kosher meats sourced daily from the finest suppliers. Beef, lamb, poultry, and specialties — every cut selected with care for your table.
                        </p>
                        <Link to="/catalog" className="inline-block mt-8 px-6 py-3 border border-[#C8102E] text-[#C8102E] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#C8102E] hover:text-white transition-all duration-200">
                            BROWSE ALL CUTS
                        </Link>
                    </div>

                    {/* Right: Floating Meat Cut Image */}
                    <div className="relative flex items-center justify-center h-[380px]">
                        {/* Box background with red shadow */}
                        <div className="absolute inset-0 bg-[#1a1a1a] rounded-sm overflow-hidden flex items-center justify-center shadow-2xl shadow-[#C8102E]/60 border border-[#C8102E]/30">
                            <img
                                src="/images/premium_cuts.jpg"
                                alt="Premium Meat Cuts"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Decorative red chilli image area */}
                        <div className="absolute bottom-4 right-4 w-24 h-6 flex items-center gap-2 z-10">
                            <div className="w-2 h-2 rounded-full bg-[#C8102E]" />
                            <span className="text-[10px] text-white/70 uppercase tracking-widest font-bold drop-shadow-md">Premium Cuts</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Big Stat / Counter ──  */}
            <section className="bg-[#0d0d0d] py-16 px-6 border-y border-white/5">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                    {/* Left: Small labels */}
                    <div className="grid grid-cols-3 gap-6">
                        {stats.map(s => (
                            <div key={s.label} className="border-t border-white/10 pt-4">
                                <div className="text-[#C8102E] text-xs font-bold tracking-[0.2em] uppercase mb-1">{s.label}</div>
                                <div className="text-white/70 text-[11px] leading-relaxed">{s.desc}</div>
                            </div>
                        ))}
                    </div>
                    {/* Right: Big number */}
                    <div className="text-right">
                        <span className="text-white/8 font-black select-none" style={{ fontSize: 'clamp(80px, 14vw, 160px)', lineHeight: 1, color: 'rgba(255,255,255,0.06)' }}>
                            20+
                        </span>
                        <div className="-mt-8 relative z-10">
                            <h3 className="text-white font-black" style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.1 }}>
                                years of
                                <br />
                                <span className="text-[#C8102E]">expertise</span>
                            </h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Categories showcase ── */}
            <section className="py-20 px-6 bg-[#111]" aria-labelledby="categories-heading">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <p className="text-[#C8102E] text-xs font-bold tracking-[0.3em] uppercase mb-3">SHOP BY TYPE</p>
                            <h2 id="categories-heading" className="text-white font-black" style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.02em' }}>
                                Our Categories
                            </h2>
                        </div>
                        <Link to="/catalog" className="hidden md:inline-block text-white/40 text-xs font-bold tracking-[0.2em] uppercase border-b border-white/20 pb-1 hover:text-white hover:border-white/60 transition-colors">
                            VIEW ALL →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-stretch">
                        {(categories ?? defaultCategories).map((cat) => (
                            <Link
                                key={cat.slug}
                                to={`/catalog/${cat.slug}`}
                                className="flex flex-col rounded-xl overflow-hidden group shadow-lg"
                                aria-label={`Category: ${cat.name_en}`}
                            >
                                {/* Image area — fixed aspect ratio so all cards have identical image height */}
                                <div className="w-full bg-[#1a1a1a] relative overflow-hidden" style={{ paddingBottom: '75%' }}>
                                    <img
                                        src={categoryImages[cat.slug] ?? `https://placehold.co/400x300/1a1a1a/444444?text=${encodeURIComponent(cat.name_en)}`}
                                        alt={cat.name_en}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                </div>

                                {/* Red text block — fixed height so all cards match */}
                                <div className="bg-[#8a201c] px-5 flex flex-col justify-center transition-colors duration-200 group-hover:bg-[#a3251f]"
                                    style={{ height: '88px', flexShrink: 0 }}>
                                    <h3 className="text-white font-bold text-[13px] tracking-[0.1em] uppercase mb-1 leading-tight">
                                        {cat.name_en}
                                    </h3>
                                    <p className="text-white/65 text-[11px] leading-tight">
                                        click to visit our {cat.name_en.toLowerCase()} section
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Cuts / Product Showcase ── */}
            <section className="bg-[#0d0d0d] py-20 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <p className="text-[#C8102E] text-xs font-bold tracking-[0.3em] uppercase mb-3">HIGHLIGHTS</p>
                        <div className="flex items-end justify-between">
                            <h2 className="text-white font-black" style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.02em' }}>
                                about <span className="text-[#C8102E]">30</span>
                                <br />varieties
                            </h2>
                            <Link to="/catalog" className="hidden md:inline-block text-white/40 text-xs font-bold tracking-[0.2em] uppercase border-b border-white/20 pb-1 hover:text-white hover:border-white/60 transition-colors">
                                FULL CATALOG →
                            </Link>
                        </div>
                    </div>

                    {/* 3-column floating cuts display */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredCuts.map((cut) => (
                            <Link key={cut.slug} to={`/catalog/${cut.category}`}
                                className="group relative bg-[#1a1a1a] p-6 flex flex-col gap-4 overflow-hidden hover:bg-[#202020] transition-colors duration-200">
                                {/* Floating cut image - no bg box, just the meat */}
                                <div className="h-[180px] flex items-center justify-center relative">
                                    <img
                                        src={cut.img}
                                        alt={cut.name}
                                        className="max-h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1"
                                        style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.6))' }}
                                    />
                                </div>
                                {/* Cut details */}
                                <div className="border-t border-white/10 pt-4">
                                    <div className="flex items-start justify-between mb-1">
                                        <h3 className="text-white font-bold text-[13px] tracking-[0.08em] uppercase">{cut.name}</h3>
                                        <span className="text-[#C8102E] text-[11px] font-bold tracking-widest uppercase">{cut.category}</span>
                                    </div>
                                    <p className="text-white/40 text-[12px] leading-relaxed">{cut.desc}</p>
                                </div>
                                {/* Hover indicator */}
                                <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[2px] bg-[#C8102E] transition-all duration-300" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Why HaAtzil ── */}
            <section className="py-20 px-6 bg-[#111] border-t border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-[#C8102E] text-xs font-bold tracking-[0.3em] uppercase mb-3">OUR PROMISE</p>
                        <h2 className="text-white font-black" style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.02em' }}>
                            Why <span className="font-hebrew text-[#C8102E]">האציל</span>?
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {perks.map((p, i) => (
                            <div key={p.title} className="relative group pl-6 border-l border-white/10 hover:border-[#C8102E] transition-colors duration-300">
                                <div className="text-white/15 font-black text-[64px] absolute top-0 right-0 leading-none select-none"
                                    style={{ fontVariantNumeric: 'tabular-nums' }}>
                                    {String(i + 1).padStart(2, '0')}
                                </div>

                                {/* 16:9 Image replaced icon */}
                                <div className="relative w-full aspect-video mb-5 overflow-hidden rounded-sm z-10 border border-white/10 bg-[#1a1a1a]">
                                    <img
                                        src={p.img}
                                        alt={p.title}
                                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                    />
                                </div>

                                <h3 className="text-white font-bold text-[15px] uppercase tracking-[0.08em] mb-2 relative z-10">{p.title}</h3>
                                <p className="text-white/50 text-[13px] leading-relaxed relative z-10">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-[#0a0a0a] border-t border-white/10 py-14 px-6" role="contentinfo">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <h3 className="text-white font-black text-xl font-hebrew mb-3">האציל</h3>
                        <p className="text-white/35 text-[12px] leading-relaxed mb-4">
                            Premium kosher meats in the heart of Safed. Since 2005.
                        </p>
                        <div className="text-[#C8102E] text-[10px] font-bold tracking-[0.2em] uppercase">Glatt Kosher · Mehadrin</div>
                    </div>
                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white text-[11px] font-bold tracking-[0.2em] uppercase mb-4">Quick Links</h4>
                        <div className="flex flex-col gap-2">
                            {['Beef', 'Lamb', 'Poultry', 'Prepared', 'Kosher Specials'].map(n => (
                                <Link key={n} to={`/catalog/${n.toLowerCase().replace(' ', '-')}`}
                                    className="text-white/40 text-[13px] hover:text-white transition-colors duration-150">
                                    {n}
                                </Link>
                            ))}
                        </div>
                    </div>
                    {/* Contact */}
                    <div>
                        <h4 className="text-white text-[11px] font-bold tracking-[0.2em] uppercase mb-4">Contact</h4>
                        <div className="flex flex-col gap-2 text-white/40 text-[13px]">
                            <span>77 HaPalmach St, Safed</span>
                            <a href="tel:046226677" className="hover:text-[#C8102E] transition-colors">04-6226677</a>
                            <span>Sun–Thu: 8:00–20:00</span>
                            <span>Fri: 8:00–14:00</span>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                    <p className="text-white/20 text-[11px]">
                        ©️ {new Date().getFullYear()} האציל – All rights reserved
                    </p>
                    <Link to="/privacy" className="text-white/20 text-[11px] hover:text-white/50 transition-colors">
                        Privacy Policy
                    </Link>
                </div>
            </footer>
        </div>
    );
}

const defaultCategories = [
    { slug: 'beef', name_en: 'Beef' },
    { slug: 'lamb', name_en: 'Lamb' },
    { slug: 'poultry', name_en: 'Poultry' },
    { slug: 'prepared', name_en: 'Prepared' },
    { slug: 'kosher-special', name_en: 'Kosher Specials' },
];

const categoryImages: Record<string, string> = {
    beef: '/images/categories/beef.jpg',
    lamb: '/images/categories/lamb.jpg',
    poultry: '/images/categories/poultry.jpg',
    prepared: '/images/categories/prepared.jpg',
    'kosher-special': '/images/categories/kosher-special.jpg',
};

const stats = [
    { label: 'Daily Fresh', desc: 'Delivered fresh every morning from our suppliers' },
    { label: 'Kosher Mehadrin', desc: 'Strict Badatz supervision on all products' },
    { label: 'Since 2005', desc: 'Over 20 years serving the community of Safed' },
];

const featuredCuts = [
    {
        name: 'Beef Bone Broth Kit',
        slug: 'bone_broth',
        category: 'prepared',
        img: '/images/products/prepared/bone_broth.jpg',
        desc: 'Soup bones with root vegetables — the perfect warming broth',
    },
    {
        name: 'Fresh Beef Liver',
        slug: 'liver',
        category: 'beef',
        img: '/images/products/beef/liver.jpg',
        desc: 'Rich in iron, fresh daily — a nutritious classic cut',
    },
    {
        name: 'Whole Fresh Chicken',
        slug: 'whole_chicken',
        category: 'poultry',
        img: '/images/products/poultry/whole_chicken.jpg',
        desc: 'Antibiotic-free whole chicken — great for roast or stew',
    },
];

const perks = [
    { img: '/images/perks/fresh.jpg', title: 'Fresh Daily Meat', desc: 'Meat straight from the premium supplier - fresh every day' },
    { img: '/images/perks/kosher.jpg', title: 'Kosher Mehadrin', desc: 'All products under the supervision of Badatz Mehadrin' },
    { img: '/images/perks/experience.jpg', title: '20 Years of Experience', desc: 'Since 2005 - we know meat, and you can feel it' },
];
