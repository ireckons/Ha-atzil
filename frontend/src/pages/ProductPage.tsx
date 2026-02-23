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
        <div className="min-h-screen bg-brand-black flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-brand-dark-gray border-t-brand-red rounded-full animate-spin" />
        </div>
    );

    if (isError || !product) return (
        <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center gap-4">
            <p className="text-white/50">המוצר לא נמצא</p>
            <Link to="/catalog" className="btn-primary">חזרה לתפריט</Link>
        </div>
    );

    const handleAddToCart = () => {
        const weightOptions = Array.isArray(product.weight_options) ? product.weight_options : (typeof product.weight_options === 'string' ? JSON.parse(product.weight_options || '[]') : []);
        if (product.unit === 'kg' && weightOptions.length > 0 && !selectedWeight) {
            toast.error('יש לבחור משקל');
            return;
        }
        addItem(product, qty, selectedWeight);
        toast.success(`${product.name_he} נוסף לעגלה`, { icon: '🛒' });
    };

    const parsedPrice = Number(product.price_nis) || 0;
    const unitPrice = product.unit === 'kg' && selectedWeight
        ? (parsedPrice * selectedWeight.grams / 1000)
        : parsedPrice;

    const weightOptions = Array.isArray(product.weight_options) ? product.weight_options : (typeof product.weight_options === 'string' ? JSON.parse(product.weight_options || '[]') : []);

    return (
        <div className="min-h-screen bg-brand-black py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Breadcrumb */}
                <nav aria-label="ניווט ארעי" className="mb-6">
                    <ol className="flex items-center gap-2 text-sm text-white/40">
                        <li><Link to="/" className="hover:text-brand-red transition-colors">בית</Link></li>
                        <li aria-hidden="true">·</li>
                        <li><Link to="/catalog" className="hover:text-brand-red transition-colors">תפריט</Link></li>
                        <li aria-hidden="true">·</li>
                        <li className="text-white/70" aria-current="page">{product.name_he}</li>
                    </ol>
                </nav>

                <div className="grid md:grid-cols-2 gap-10 animate-fade-in">
                    {/* Image */}
                    <div className="aspect-square bg-gradient-to-br from-brand-dark-gray to-black rounded-2xl overflow-hidden border border-white/10">
                        {product.image_url ? (
                            <img src={product.image_url} alt={product.name_he} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-9xl opacity-20" aria-hidden="true">🥩</div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                        <div className="flex items-start gap-3 mb-2">
                            {product.is_kosher && <span className="badge-kosher mt-1">✡️ כשר</span>}
                            <span className="text-white/40 text-sm">{product.category_name_he}</span>
                        </div>

                        <h1 className="text-4xl font-black text-white mb-1">{product.name_he}</h1>
                        <p className="text-white/50 text-lg mb-4">{product.name_en}</p>

                        {product.kosher_cert_text && (
                            <p className="text-xs text-emerald-400/80 mb-4 p-2 rounded bg-emerald-900/20 border border-emerald-700/30">
                                🏷️ {product.kosher_cert_text}
                            </p>
                        )}

                        {product.description_he && (
                            <p className="text-white/70 text-base leading-relaxed mb-6">{product.description_he}</p>
                        )}

                        {/* Weight options */}
                        {weightOptions.length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm text-white/60 mb-2 font-medium">בחר משקל</p>
                                <div className="flex flex-wrap gap-2" role="group" aria-label="אפשרויות משקל">
                                    {weightOptions.map((w: any) => (
                                        <button
                                            key={w.label}
                                            onClick={() => setSelectedWeight(w)}
                                            aria-pressed={selectedWeight?.label === w.label}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${selectedWeight?.label === w.label
                                                ? 'bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/30'
                                                : 'border-white/20 text-white/70 hover:border-brand-red/60 hover:text-white'
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
                            <span className="text-sm text-white/60 font-medium">כמות</span>
                            <div className="flex items-center rounded-lg overflow-hidden border border-white/20" role="group" aria-label="בחר כמות">
                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/15 text-white text-lg font-bold transition-colors" aria-label="הפחת כמות">−</button>
                                <span className="w-12 text-center text-white font-bold" aria-live="polite">{qty}</span>
                                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/15 text-white text-lg font-bold transition-colors" aria-label="הוסף כמות">+</button>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black text-brand-red">₪{unitPrice.toFixed(2)}</span>
                                <span className="text-white/40 text-sm mb-1">
                                    {product.unit === 'kg' ? (selectedWeight ? `(${selectedWeight.label})` : '/ ק"ג') : '/ יחידה'}
                                </span>
                            </div>
                            {product.unit === 'kg' && !selectedWeight && (
                                <p className="text-white/30 text-xs mt-1">המחיר המוצג הוא לק"ג – יעודכן לפי הבחירה</p>
                            )}
                        </div>

                        {!product.is_available ? (
                            <div className="btn-primary opacity-50 cursor-not-allowed justify-center">לא זמין כרגע</div>
                        ) : (
                            <button onClick={handleAddToCart} className="btn-primary w-full text-lg py-4 justify-center">
                                🛒 הוסף לעגלה
                            </button>
                        )}
                        <Link to="/catalog" className="btn-ghost mt-3 justify-center text-sm">← חזרה לתפריט</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
