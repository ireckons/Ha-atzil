import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-transparent flex flex-col items-center justify-center gap-6 px-4 relative pt-12 md:pt-0">
                {/* Mobile Back Button (Top Left) */}
                <div className="absolute top-0 left-0 z-10 md:hidden bg-white/80 backdrop-blur-sm p-2 w-full border-b border-black/5">
                    <button onClick={() => window.history.back()} className="flex items-center gap-2 text-black/70 hover:text-black transition-colors cursor-pointer w-fit px-2 py-1 bg-black/5 rounded-full border border-black/10">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M19 12H5" />
                            <path d="M12 19l-7-7 7-7" />
                        </svg>
                        <span className="text-xs font-bold uppercase tracking-wider pr-2">Back</span>
                    </button>
                </div>
                <div className="text-8xl text-black/5" aria-hidden="true">🛒</div>
                <h1 className="text-2xl font-bold text-[#111]">Cart is empty</h1>
                <Link to="/catalog" className="btn-primary">← Continue shopping</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent py-8 px-4 relative pt-16 md:pt-8">
            {/* Mobile Back Button (Top Left) */}
            <div className="absolute top-0 left-0 z-10 md:hidden bg-white/80 backdrop-blur-sm p-2 w-full border-b border-black/5">
                <button onClick={() => window.history.back()} className="flex items-center gap-2 text-black/70 hover:text-black transition-colors cursor-pointer w-fit px-2 py-1 bg-black/5 rounded-full border border-black/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M19 12H5" />
                        <path d="M12 19l-7-7 7-7" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider pr-2">Back</span>
                </button>
            </div>

            <div className="max-w-3xl mx-auto">
                <h1 className="section-title mb-2">Shopping Cart</h1>
                <div className="section-divider w-24" />

                <div className="space-y-3 mb-8" role="list" aria-label="Items in cart">
                    {items.map((item) => {
                        const key = `${item.product.id}:${item.selectedWeight?.label ?? 'unit'}`;
                        const weightFactor = item.selectedWeight ? item.selectedWeight.grams / 1000 : 1;
                        const lineTotal = item.product.price_nis * item.quantity * weightFactor;

                        return (
                            <div key={key} role="listitem" className="card p-4 flex items-center gap-4">
                                {/* Product image thumbnail */}
                                <div className="w-16 h-16 rounded-lg bg-[#EAEAEA] flex-shrink-0 overflow-hidden border border-black/10">
                                    {item.product.image_url ? (
                                        <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl text-black/5" aria-hidden="true">🥩</div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-[#111] truncate">{item.product.name_en}</h3>
                                    <p className="text-[#666] text-sm">
                                        ₪{item.product.price_nis}
                                        {item.selectedWeight ? ` × ${item.selectedWeight.label}` : ' / unit'}
                                    </p>
                                </div>

                                {/* Quantity */}
                                <div className="flex items-center gap-2" role="group" aria-label={`Quantity ${item.product.name_en}`}>
                                    <button
                                        onClick={() => updateQuantity(item.product.id, item.selectedWeight?.label, item.quantity - 1)}
                                        className="w-8 h-8 rounded bg-black/5 hover:bg-black/10 text-[#111] flex items-center justify-center text-lg font-bold transition-colors"
                                        aria-label="Decrease"
                                    >−</button>
                                    <span className="w-8 text-center text-[#111] font-bold" aria-live="polite">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.product.id, item.selectedWeight?.label, item.quantity + 1)}
                                        className="w-8 h-8 rounded bg-black/5 hover:bg-black/10 text-[#111] flex items-center justify-center text-lg font-bold transition-colors"
                                        aria-label="Increase"
                                    >+</button>
                                </div>

                                <div className="text-start w-20">
                                    <span className="text-brand-red font-bold">₪{lineTotal.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={() => {
                                        removeItem(item.product.id, item.selectedWeight?.label);
                                        toast.success('Item removed');
                                    }}
                                    className="text-black/30 hover:text-brand-red transition-colors p-1 rounded"
                                    aria-label={`Remove ${item.product.name_en}`}
                                >
                                    ✕
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Total + Actions */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-xl font-bold text-[#111]">Total</span>
                        <span className="text-3xl font-black text-brand-red">₪{total().toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => { clearCart(); toast.success('Cart cleared'); }}
                            className="btn-ghost flex-1 justify-center border border-black/10 hover:border-black/20"
                        >
                            Clear cart
                        </button>
                        <Link to="/catalog" className="btn-secondary flex-1 text-center justify-center">← Continue shopping</Link>
                        <Link to="/checkout" className="btn-primary flex-1 text-center justify-center">Proceed to checkout ←</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
