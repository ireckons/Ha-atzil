import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { productApi, type WeightOption } from '../api/client';
import { useCartStore } from '../store/cartStore';

export default function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const [selectedWeight, setSelectedWeight] = useState<WeightOption | undefined>();
    const [qty, setQty] = useState(1);
    const addItem = useCartStore((s) => s.addItem);

    const { data: product, isLoading, isError } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productApi.get(id!),
        enabled: !!id,
    });

    if (isLoading) return (
        <div className="min-h-screen bg-transparent flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-black/10 border-t-brand-red rounded-full animate-spin" />
        </div>
    );

    if (isError || !product) return (
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center gap-4">
            <p className="text-black/50">Product not found</p>
            <Link to="/catalog" className="btn-primary">Back to Menu</Link>
        </div>
    );

    const handleAddToCart = () => {
        const weightOptions = Array.isArray(product.weight_options) ? product.weight_options : (typeof product.weight_options === 'string' ? JSON.parse(product.weight_options || '[]') : []);
        if (product.unit === 'kg' && weightOptions.length > 0 && !selectedWeight) {
            toast.error('Please select weight');
            return;
        }
        addItem(product, qty, selectedWeight);
        toast.success(`${product.name_en} added to cart`, { icon: '🛒' });
    };

    const parsedPrice = Number(product.price_nis) || 0;
    const unitPrice = product.unit === 'kg' && selectedWeight
        ? (parsedPrice * selectedWeight.grams / 1000)
        : parsedPrice;

    const weightOptions = Array.isArray(product.weight_options) ? product.weight_options : (typeof product.weight_options === 'string' ? JSON.parse(product.weight_options || '[]') : []);

    return (
        <div className="min-h-screen bg-transparent py-8 px-4">
            <div className="max-w-5xl mx-auto relative pt-12 md:pt-0">
                {/* Mobile Back Button (Top Left) */}
                <div className="absolute top-0 left-0 z-10 md:hidden bg-white/80 backdrop-blur-sm p-2 w-full border-b border-black/5">
                    <Link to="/catalog" className="flex items-center gap-2 text-black/70 hover:text-black transition-colors cursor-pointer w-fit px-2 py-1 bg-black/5 rounded-full border border-black/10">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M19 12H5" />
                            <path d="M12 19l-7-7 7-7" />
                        </svg>
                        <span className="text-xs font-bold uppercase tracking-wider pr-2">Back</span>
                    </Link>
                </div>

                {/* Desktop Breadcrumb */}
                <nav aria-label="Breadcrumb navigation" className="hidden md:flex mb-6">
                    <ol className="flex items-center gap-2 text-sm text-black/40">
                        <li><Link to="/" className="hover:text-brand-red transition-colors">Home</Link></li>
                        <li aria-hidden="true">·</li>
                        <li><Link to="/catalog" className="hover:text-brand-red transition-colors">Menu</Link></li>
                        <li aria-hidden="true">·</li>
                        <li className="text-black/70" aria-current="page">{product.name_en}</li>
                    </ol>
                </nav>

                <div className="grid md:grid-cols-2 gap-10 animate-fade-in mt-4 md:mt-0">
                    {/* Image */}
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden border border-black/5">
                        {product.image_url ? (
                            <img src={product.image_url} alt={product.name_en} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-9xl text-black/5" aria-hidden="true">🥩</div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                        <div className="flex items-start gap-3 mb-2">
                            {product.is_kosher && <span className="badge-kosher mt-1">✡️ Kosher</span>}
                            <span className="text-[#666] text-sm font-semibold">{product.category_name_en}</span>
                        </div>

                        <h1 className="text-4xl font-black text-[#111] mb-2">{product.name_en}</h1>

                        {product.kosher_cert_text && (
                            <p className="text-xs text-emerald-800 mb-4 p-2 rounded bg-emerald-100/50 border border-emerald-200">
                                🏷️ {product.kosher_cert_text}
                            </p>
                        )}

                        {product.description_en && (
                            <p className="text-[#444] text-base leading-relaxed mb-6">{product.description_en}</p>
                        )}

                        {/* Weight options */}
                        {weightOptions.length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm text-[#444] mb-2 font-medium">Select weight</p>
                                <div className="flex flex-wrap gap-2" role="group" aria-label="Weight options">
                                    {weightOptions.map((w: any) => (
                                        <button
                                            key={w.label}
                                            onClick={() => setSelectedWeight(w)}
                                            aria-pressed={selectedWeight?.label === w.label}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${selectedWeight?.label === w.label
                                                ? 'bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/30'
                                                : 'border-black/10 text-black/60 hover:border-brand-red/60 hover:text-[#111]'
                                                }`}
                                        >
                                            {w.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-sm text-[#444] font-medium">Quantity</span>
                            <div className="flex items-center rounded-lg overflow-hidden border border-black/10" role="group" aria-label="Select quantity">
                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center bg-black/5 hover:bg-black/10 text-[#111] text-lg font-bold transition-colors" aria-label="Decrease quantity">−</button>
                                <span className="w-12 text-center text-[#111] font-bold" aria-live="polite">{qty}</span>
                                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center bg-black/5 hover:bg-black/10 text-[#111] text-lg font-bold transition-colors" aria-label="Increase quantity">+</button>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="mb-6 p-4 rounded-xl bg-black/5 border border-black/5">
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black text-brand-red">₪{unitPrice.toFixed(2)}</span>
                                <span className="text-black/50 text-sm mb-1 font-medium">
                                    {product.unit === 'kg' ? (selectedWeight ? `(${selectedWeight.label})` : '/ kg') : '/ unit'}
                                </span>
                            </div>
                            {product.unit === 'kg' && !selectedWeight && (
                                <p className="text-black/40 text-xs mt-1 font-medium">Price shown is per kg – will be updated based on selection</p>
                            )}
                        </div>

                        {!product.is_available ? (
                            <div className="btn-primary opacity-50 cursor-not-allowed justify-center">Currently unavailable</div>
                        ) : (
                            <button onClick={handleAddToCart} className="btn-primary w-full text-lg py-4 justify-center">
                                🛒 Add to cart
                            </button>
                        )}
                        <Link to="/catalog" className="btn-ghost mt-3 justify-center text-sm">← Back to Menu</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
