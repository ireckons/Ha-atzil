import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productApi, type Product } from '../api/client';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
    { slug: '', label: 'הכל' },
    { slug: 'beef', label: 'בקר' },
    { slug: 'lamb', label: 'כבש וטלה' },
    { slug: 'poultry', label: 'עוף והודו' },
    { slug: 'prepared', label: 'מוכן לבישול' },
    { slug: 'kosher-special', label: 'מיוחדי כשרות' },
];

export default function CatalogPage() {
    const { category: urlCategory } = useParams<{ category: string }>();
    const [activeCategory, setActiveCategory] = useState(urlCategory ?? '');
    const [search, setSearch] = useState('');

    const { data: products, isLoading, isError } = useQuery({
        queryKey: ['products', activeCategory],
        queryFn: () => productApi.list({ category: activeCategory || undefined, available: true }),
    });

    const filtered = (products ?? []).filter((p: Product) =>
        !search ||
        p.name_he.includes(search) ||
        p.name_en.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-brand-black py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Page header */}
                <div className="mb-8">
                    <h1 className="section-title">תפריט הבשרים</h1>
                    <div className="section-divider w-24" />
                    <p className="text-white/60 text-sm">בשרים כשרים מהדרין · טריים יומיומי</p>
                </div>

                {/* Search */}
                <div className="mb-6 relative">
                    <input
                        type="search"
                        placeholder="חיפוש מוצר…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input pe-10"
                        aria-label="חיפוש מוצרים"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2 text-white/30" aria-hidden="true">🔍</span>
                </div>

                {/* Category filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar" role="tablist" aria-label="קטגוריות">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.slug}
                            role="tab"
                            aria-selected={activeCategory === cat.slug}
                            onClick={() => setActiveCategory(cat.slug)}
                            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all flex-shrink-0 ${activeCategory === cat.slug
                                    ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30'
                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Product grid */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="card h-72 animate-pulse bg-brand-dark-gray" />
                        ))}
                    </div>
                )}
                {isError && (
                    <div className="text-center py-20">
                        <p className="text-white/50 text-lg">שגיאה בטעינת המוצרים. נסה שוב.</p>
                    </div>
                )}
                {!isLoading && !isError && (
                    <>
                        {filtered.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-white/50 text-lg">לא נמצאו מוצרים</p>
                                <Link to="/catalog" className="btn-ghost mt-4" onClick={() => setSearch('')}>נקה חיפוש</Link>
                            </div>
                        ) : (
                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in"
                                aria-label={`${filtered.length} מוצרים`}
                            >
                                {filtered.map((product: Product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
