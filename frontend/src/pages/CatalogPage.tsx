import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productApi, categoryApi, type Product, type Category } from '../api/client';
import ProductCard from '../components/ProductCard';
import { useTranslation } from 'react-i18next';

export default function CatalogPage() {
    const { t, i18n } = useTranslation();
    const { category: urlCategory } = useParams<{ category: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeCategory, setActiveCategory] = useState(urlCategory ?? '');
    const [search, setSearch] = useState(searchParams.get('q') || '');

    // Sync search state with URL parameters
    useEffect(() => {
        const q = searchParams.get('q');
        if (q !== null) {
            setSearch(q);
        }
    }, [searchParams]);

    // Update URL when search changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);

        if (val) {
            setSearchParams({ q: val });
        } else {
            searchParams.delete('q');
            setSearchParams(searchParams);
        }
    };

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryApi.list,
    });

    const { data: products, isLoading, isError } = useQuery({
        queryKey: ['products', activeCategory],
        queryFn: () => productApi.list({ category: activeCategory || undefined, available: true }),
    });

    const filtered = (products ?? []).filter((p: Product) => {
        if (!search) return true;
        const searchLower = search.toLowerCase();
        return (p.name_he && p.name_he.includes(search)) ||
            (p.name_en && p.name_en.toLowerCase().includes(searchLower));
    });

    const displayCategories: (Category | { slug: string, name_en: string, name_he: string, icon_emoji: string })[] = [
        { slug: '', name_he: 'הכל', name_en: 'All', icon_emoji: '🍽️' },
        ...(categories || []).sort((a: Category, b: Category) => a.sort_order - b.sort_order)
    ];

    return (
        <div className="min-h-screen py-8 px-4" style={{ background: '#1A1A1A', fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
            <div className="max-w-7xl mx-auto">
                {/* Page header */}
                <div className="mb-8">
                    <h1 className="text-white font-black text-3xl md:text-4xl uppercase tracking-widest mb-2">{t('catalog.title')}</h1>
                    <div className="w-16 h-[3px] mb-4" style={{ background: '#B21B21' }} />
                    <p className="text-white/50 text-sm">{t('catalog.subtitle')}</p>
                </div>

                {/* Search */}
                <div className="mb-6 relative">
                    <input
                        type="search"
                        placeholder={t('catalog.search_placeholder')}
                        value={search}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-3 pl-10 rounded-lg outline-none text-sm font-medium text-white placeholder-white/30 border border-white/10 bg-white/8 focus:border-[#B21B21] focus:ring-1 focus:ring-[#B21B21] transition-all"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                        aria-label="Search products"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" aria-hidden="true">🔍</span>
                </div>

                {/* Category filter (Mobile Pills) */}
                <div className="flex gap-4 overflow-x-auto pb-4 mb-6 no-scrollbar snap-x px-1" role="tablist" aria-label="Categories">
                    {displayCategories.map((cat: any) => (
                        <button
                            key={cat.slug}
                            role="tab"
                            aria-selected={activeCategory === cat.slug}
                            onClick={() => {
                                setActiveCategory(cat.slug);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`flex flex-col items-center justify-center gap-2 min-w-[76px] snap-center transition-all ${
                                activeCategory === cat.slug ? 'scale-105 opacity-100' : 'opacity-60 hover:opacity-100'
                            }`}
                        >
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-md border-2 ${
                                activeCategory === cat.slug
                                    ? 'bg-[#B21B21] text-white border-[#B21B21] shadow-[#B21B21]/40'
                                    : 'bg-white/10 text-white border-white/10 hover:border-white/25'
                            }`}>
                                {cat.icon_emoji || '🍽️'}
                            </div>
                            <span className={`text-[11px] font-bold text-center tracking-wide ${
                                activeCategory === cat.slug ? 'text-[#B21B21]' : 'text-white/60'
                            }`}>
                                {i18n.language === 'he' ? (cat.name_he || cat.name_en) : cat.name_en}
                            </span>
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
                        <p className="text-brand-white/50 text-lg">{t('catalog.error_loading')}</p>
                    </div>
                )}
                {!isLoading && !isError && (
                    <>
                        {filtered.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-brand-white/50 text-lg">{t('catalog.no_products')}</p>
                                <Link to="/catalog" className="btn-ghost mt-4" onClick={() => { setSearch(''); searchParams.delete('q'); setSearchParams(searchParams); }}>{t('catalog.clear_search')}</Link>
                            </div>
                        ) : (
                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in"
                                aria-label={`${filtered.length} products`}
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
