import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../api/client';
import HeroParallax from '../components/HeroParallax';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
    const { t, i18n } = useTranslation();
    const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list });

    return (
        <div className="min-h-screen bg-[#1A1A1A]" style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
            {/* ── Hero ── */}
            <HeroParallax />

            {/* ── What To Choose Section ── */}
            <section className="relative bg-[#1A1A1A] py-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Big Editorial Headline */}
                    <div>
                        <p className="text-[#E5193D] text-xs font-bold tracking-[0.3em] uppercase mb-4">{t('home.our_selection')}</p>
                        <h2 className="text-white font-black leading-tight mb-5"
                            style={{ fontSize: 'clamp(48px, 7vw, 90px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
                            {t('home.what_to')}<br />{i18n.language === 'he' ? '' : <>to<br /></>}{t('home.choose')}
                        </h2>
                        <div className="w-10 h-[3px] bg-[#B21B21] mb-6" />
                        <p className="text-white/70 text-[15px] leading-relaxed max-w-sm">
                            {t('home.selection_desc')}
                        </p>
                        <Link to="/catalog" className="inline-block mt-8 px-6 py-3 border border-[#B21B21] text-[#B21B21] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#6B191E] hover:text-white hover:border-[#6B191E] transition-all duration-200">
                            {t('home.browse_all')}
                        </Link>
                    </div>

                    {/* Right: Floating Meat Cut Image */}
                    <div className="relative flex items-center justify-center">
                        {/* Box without hardcoded black background or height clamps */}
                        <div className="relative w-full rounded-sm overflow-hidden flex items-center justify-center shadow-2xl shadow-[#C8102E]/60 border border-[#C8102E]/30">
                            <img
                                src="/images/what_to_choose.webp"
                                alt="Premium Meat Cuts"
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Big Stat / Counter (Deep Burgundy Section) ──  */}
            <section className="bg-[#6B191E] py-16 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-[1.5fr_1fr_1.5fr] gap-10 items-center">
                    {/* Left: Image block */}
                    <div className="hidden md:block border max-w-lg mx-auto border-white/20 rounded-sm overflow-hidden shadow-2xl pb-0 w-full">
                        <img
                            src="/images/premium_cuts.webp"
                            alt="Premium Cuts"
                            className="w-full h-[350px] object-cover object-center opacity-85 hover:opacity-100 transition-opacity duration-300 contrast-125"
                        />
                    </div>
                    {/* Middle: Small labels */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {stats.map(s => (
                            <div key={s.id} className="border-t border-white/20 pt-4">
                                <div className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-1">{t(`home.stats.${s.id}`)}</div>
                                <div className="text-white/60 text-[11px] leading-relaxed">{t(`home.stats.${s.id}_desc`)}</div>
                            </div>
                        ))}
                    </div>
                    {/* Right: Big editorial number */}
                    <div className="text-right">
                        <span className="font-black select-none" style={{ fontSize: 'clamp(100px, 16vw, 200px)', lineHeight: 0.9, color: 'rgba(255,255,255,0.08)' }}>
                            20+
                        </span>
                        <div className="-mt-8 relative z-10">
                            <h3 className="text-white font-black" style={{ fontSize: 'clamp(32px, 4vw, 56px)', lineHeight: 1.1 }}>
                                {t('home.years_of')}
                                <br />
                                <span className="text-[#E5193D]">{t('home.expertise')}</span>
                            </h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Categories showcase ── */}
            <section className="py-20 px-6 bg-[#F8F6F2]" aria-labelledby="categories-heading">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <p className="text-[#B21B21] text-xs font-bold tracking-[0.3em] uppercase mb-3">{t('home.shop_by_type')}</p>
                            <h2 id="categories-heading" className="text-[#111111] font-black" style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.02em' }}>
                                {t('home.our_categories')}
                            </h2>
                        </div>
                        <Link to="/catalog" className="hidden md:inline-block text-black/40 text-xs font-bold tracking-[0.2em] uppercase border-b border-black/20 pb-1 hover:text-[#B21B21] hover:border-[#B21B21] transition-colors">
                            {t('home.view_all')}
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-stretch">
                        {(categories ?? defaultCategories).filter((cat: any) => cat.is_featured).map((cat: any) => (
                            <Link
                                key={cat.slug}
                                to={`/catalog/${cat.slug}`}
                                className="flex flex-col rounded-xl overflow-hidden group shadow-lg border border-black/5"
                                aria-label={`Category: ${cat.name_en}`}
                            >
                                {/* Image area — fixed aspect ratio so all cards have identical image height */}
                                <div className="w-full bg-[#EAEAEA] relative overflow-hidden" style={{ paddingBottom: '75%' }}>
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
                                        {i18n.language === 'he' ? cat.name_he || cat.name_en : cat.name_en}
                                    </h3>
                                    <p className="text-white/65 text-[11px] leading-tight">
                                        {t('home.click_to_visit', { category: i18n.language === 'he' ? (cat.name_he || cat.name_en) : cat.name_en.toLowerCase() })}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>



            {/* ── Why HaAtzil (Deep Burgundy Section) ── */}
            <section className="py-20 px-6 bg-[#6B191E]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-white/50 text-xs font-bold tracking-[0.3em] uppercase mb-3">{t('home.our_promise')}</p>
                        <h2 className="text-white font-black" style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.02em' }}>
                            {t('home.why')} <span className="font-hebrew text-[#E5193D]">האציל</span>?
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {perks.map((p, i) => (
                            <div key={p.id} className="relative group pl-6 border-l border-white/20 hover:border-white transition-colors duration-300">
                                <div className="text-white/5 font-black text-[64px] absolute top-0 right-0 leading-none select-none"
                                    style={{ fontVariantNumeric: 'tabular-nums' }}>
                                    {String(i + 1).padStart(2, '0')}
                                </div>

                                {/* 16:9 Image */}
                                <div className="relative w-full aspect-video mb-5 overflow-hidden rounded-sm z-10 border border-white/10">
                                    <img
                                        src={p.img}
                                        alt={t(`home.perks.${p.id}`)}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                    />
                                </div>

                                <h3 className="text-white font-bold text-[15px] uppercase tracking-[0.08em] mb-2 relative z-10">{t(`home.perks.${p.id}`)}</h3>
                                <p className="text-white/60 text-[13px] leading-relaxed relative z-10">{t(`home.perks.${p.id}_desc`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Come Visit Us (Google Maps) ── */}
            <section className="py-16 px-6 bg-[#F8F6F2] border-t border-black/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <p className="text-[#B21B21] text-xs font-bold tracking-[0.3em] uppercase mb-3">{t('home.location')}</p>
                        <h2 className="text-[#111111] font-black" style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.02em' }}>
                            {t('home.come_visit')}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-[1fr_2fr] gap-8 items-stretch">
                        {/* Info Column */}
                        <div className="flex flex-col justify-center bg-white p-8 rounded-2xl shadow-md border border-black/5">
                            <div className="mb-6">
                                <h3 className="font-hebrew text-2xl font-black text-[#111]">האציל</h3>
                                <p className="text-gray-600 mt-2">{t('home.address')}</p>
                            </div>
                            <div className="mb-8">
                                <h4 className="font-bold text-sm text-[#B21B21] tracking-widest uppercase mb-2">{t('home.hours')}</h4>
                                <ul className="text-gray-600 flex flex-col gap-1 text-sm font-medium">
                                    <li>{t('home.sun_thu')}</li>
                                    <li>{t('home.fri')}</li>
                                </ul>
                            </div>
                            <div className="flex flex-col gap-3 mt-auto">
                                <a href="https://waze.com/ul?q=HaPalmach+77+Safed" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#33ccff] hover:bg-[#00bfff] text-white font-bold py-3 rounded-lg transition-colors">
                                    {t('home.nav_waze')}
                                </a>
                                <a href="https://maps.google.com/?q=HaPalmach+77+Safed" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-lg transition-colors">
                                    {t('home.nav_google')}
                                </a>
                            </div>
                        </div>

                        {/* Map Column */}
                        <div className="w-full bg-[#f4f4f4] border border-black/10 rounded-2xl overflow-hidden shadow-lg relative min-h-[350px] md:min-h-[400px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.592395982862!2d35.4957454!3d32.9649557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151c313c0b1bbcb5%3A0x6fbcdce057f86641!2sHaPalmach%20St%2077%2C%20Safed!5e0!3m2!1sen!2sil!4v1709425200000!5m2!1sen!2sil"
                                className="absolute top-0 left-0 w-full h-full border-0"
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Ha-atzil Store Location"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-[#1A1A1A] text-white border-t border-black/10 py-14 px-6" role="contentinfo">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <img src="/logo-haatzil.webp" alt="האציל Logo" className="h-16 mb-4 object-contain" />
                        <p className="text-white/35 text-[12px] leading-relaxed mb-4">
                            {t('home.footer_desc')}
                        </p>
                        <div className="text-[#C8102E] text-[10px] font-bold tracking-[0.2em] uppercase">{t('home.glatt')}</div>
                    </div>
                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white text-[11px] font-bold tracking-[0.2em] uppercase mb-4">{t('home.quick_links')}</h4>
                        <div className="flex flex-col gap-2">
                            {['Beef', 'Lamb', 'Poultry', 'Prepared', 'Kosher Specials'].map(n => (
                                <Link key={n} to={`/catalog/${n.toLowerCase().replace(' ', '-')}`}
                                    className="text-white/40 text-[13px] hover:text-white transition-colors duration-150">
                                    {t(`catalog.categories.${n.toLowerCase().replace(' ', '_')}`)}
                                </Link>
                            ))}
                        </div>
                    </div>
                    {/* Contact */}
                    <div>
                        <h4 className="text-white text-[11px] font-bold tracking-[0.2em] uppercase mb-4">{t('home.contact')}</h4>
                        <div className="flex flex-col gap-2 text-white/40 text-[13px]">
                            <span>{t('home.address')}</span>
                            <a href="tel:046226677" className="hover:text-[#C8102E] transition-colors">04-6226677</a>
                            <span>{t('home.sun_thu')}</span>
                            <span>{t('home.fri')}</span>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/20 text-[11px]">
                        ©️ {new Date().getFullYear()} האציל – {t('home.rights')}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/terms" className="text-white/20 text-[11px] hover:text-white/50 transition-colors">
                            {t('home.terms')}
                        </Link>
                        <Link to="/privacy" className="text-white/20 text-[11px] hover:text-white/50 transition-colors">
                            {t('home.privacy')}
                        </Link>
                        <Link to="/accessibility" className="text-white/20 text-[11px] hover:text-white/50 transition-colors">
                            {t('home.accessibility')}
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const defaultCategories = [
    { slug: 'beef', name_en: 'Beef', name_he: 'בקר', is_featured: true },
    { slug: 'lamb', name_en: 'Lamb', name_he: 'כבש', is_featured: true },
    { slug: 'poultry', name_en: 'Poultry', name_he: 'עופות', is_featured: true },
    { slug: 'prepared', name_en: 'Prepared', name_he: 'אוכל מוכן', is_featured: true },
    { slug: 'kosher-special', name_en: 'Kosher Specials', name_he: 'מיוחדים בכשרות', is_featured: true },
];

const categoryImages: Record<string, string> = {
    beef: '/images/categories/beef.jpg',
    lamb: '/images/categories/lamb.jpg',
    poultry: '/images/categories/poultry.jpg',
    prepared: '/images/categories/prepared.jpg',
    'kosher-special': '/images/categories/kosher-special.jpg',
};

const stats = [
    { id: 'daily_fresh' },
    { id: 'kosher_mehadrin' },
    { id: 'since' },
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
    { img: '/images/perks/fresh.webp', id: 'fresh' },
    { img: '/images/perks/kosher.webp', id: 'kosher' },
    { img: '/images/perks/experience.webp', id: 'exp' },
];
