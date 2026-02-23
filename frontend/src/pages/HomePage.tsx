import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/client';
import FlagStrip from '../components/FlagStrip';

export default function HomePage() {
    const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: productApi.categories });

    return (
        <div className="min-h-screen bg-brand-black">
            {/* ── Hero ── */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden" aria-labelledby="hero-heading">
                {/* Bull watermark background */}
                <div
                    className="absolute inset-0 opacity-[0.04] bg-repeat"
                    style={{ backgroundImage: "url('/bull-silhouette.svg')", backgroundSize: '160px 160px' }}
                    aria-hidden="true"
                />
                {/* Red accent lines */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-brand-red" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-red" aria-hidden="true" />

                {/* Hero content */}
                <div className="relative z-10 text-center px-4 py-20 animate-fade-in">
                    {/* Bull logo */}
                    <div className="flex justify-center mb-6">
                        <img src="/bull-silhouette.svg" alt="" className="w-24 h-24 opacity-90" aria-hidden="true" />
                    </div>

                    {/* Brand arch decoration */}
                    <div className="flex items-center justify-center gap-4 mb-2">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-brand-red/60" />
                        <span className="text-brand-red text-sm font-medium tracking-[0.3em]">since 2005</span>
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-brand-red/60" />
                    </div>

                    <h1 id="hero-heading" className="text-7xl sm:text-8xl md:text-9xl font-black text-white mb-4 leading-none tracking-tight font-hebrew">
                        האציל
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 font-light mb-10 font-hebrew tracking-wide">
                        בשרים שמכבדים אירוח
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/catalog" className="btn-primary text-lg px-8 py-4 rounded-xl min-w-[200px]">
                            הזמן עכשיו
                        </Link>
                        <a href="tel:04-6226677" className="btn-secondary text-lg px-8 py-4 rounded-xl min-w-[200px]">
                            📞 04-6226677
                        </a>
                    </div>

                    <p className="mt-8 text-white/40 text-sm tracking-wider">
                        הפלמ&quot;ח 77 | צפת
                    </p>
                </div>
            </section>

            {/* ── Categories showcase ── */}
            <section className="py-20 px-4 max-w-7xl mx-auto" aria-labelledby="categories-heading">
                <h2 id="categories-heading" className="section-title text-center mb-2">הקטגוריות שלנו</h2>
                <div className="section-divider mx-auto w-32" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {(categories ?? defaultCategories).map((cat) => (
                        <Link
                            key={cat.slug}
                            to={`/catalog/${cat.slug}`}
                            className="card group p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-200"
                            aria-label={`קטגוריה: ${cat.name_he}`}
                        >
                            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform" aria-hidden="true">
                                {categoryEmoji[cat.slug] ?? '🥩'}
                            </span>
                            <span className="text-lg font-bold text-white">{cat.name_he}</span>
                            <span className="text-xs text-white/50 mt-1">{cat.name_en}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Why HaAtzil ── */}
            <section className="py-16 bg-brand-dark-gray/50 border-y border-white/5" aria-labelledby="why-heading">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 id="why-heading" className="section-title text-center mb-2">למה האציל?</h2>
                    <div className="section-divider mx-auto w-24" />
                    <div className="grid md:grid-cols-3 gap-8 mt-8">
                        {perks.map((p) => (
                            <div key={p.title} className="text-center group">
                                <div className="w-16 h-16 bg-brand-red/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-red/20 transition-colors" aria-hidden="true">
                                    <span className="text-3xl">{p.icon}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                                <p className="text-white/60 text-sm leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Footer with flags ── */}
            <footer className="bg-brand-dark-gray border-t border-white/10" role="contentinfo">
                <FlagStrip />
                <div className="text-center pb-6 px-4">
                    <p className="text-white/30 text-xs">
                        ©️ {new Date().getFullYear()} האציל – כל הזכויות שמורות |{' '}
                        <Link to="/privacy" className="hover:text-brand-red transition-colors">מדיניות פרטיות</Link>
                    </p>
                </div>
            </footer>
        </div>
    );
}

const defaultCategories = [
    { slug: 'beef', name_he: 'בקר', name_en: 'Beef' },
    { slug: 'lamb', name_he: 'כבש וטלה', name_en: 'Lamb' },
    { slug: 'poultry', name_he: 'עוף והודו', name_en: 'Poultry' },
    { slug: 'prepared', name_he: 'מוכן לבישול', name_en: 'Prepared' },
    { slug: 'kosher-special', name_he: 'מהדרין', name_en: 'Kosher Specials' },
];

const categoryEmoji: Record<string, string> = {
    beef: '🥩', lamb: '🫀', poultry: '🍗', prepared: '🍖', 'kosher-special': '✡️',
};

const perks = [
    { icon: '🔪', title: 'בשר טרי יומיומי', desc: 'הבשר מגיע ישיר מהספק – טרי בכל יום ופרמיום' },
    { icon: '✡️', title: 'כשרות מהדרין', desc: 'כל המוצרים בהשגחת בד"ץ מהדרין עיר שמש' },
    { icon: '🧑‍🍳', title: 'ניסיון של 20 שנה', desc: 'משנת 2005 – אנחנו מכירים בשר, ואתם מרגישים את זה' },
];
