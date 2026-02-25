import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center gap-6 px-4">
                <div className="text-8xl" aria-hidden="true">🛒</div>
                <h1 className="text-2xl font-bold text-white">Cart is empty</h1>
                <Link to="/catalog" className="btn-primary">← Continue shopping</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-black py-8 px-4">
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
                                <div className="w-16 h-16 rounded-lg bg-brand-dark-gray flex-shrink-0 overflow-hidden border border-white/10">
                                    {item.product.image_url ? (
                                        <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl" aria-hidden="true">🥩</div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white truncate">{item.product.name_en}</h3>
                                    <p className="text-white/40 text-sm">
                                        ₪{item.product.price_nis}
                                        {item.selectedWeight ? ` × ${item.selectedWeight.label}` : ' / unit'}
                                    </p>
                                </div>

                                {/* Quantity */}
                                <div className="flex items-center gap-2" role="group" aria-label={`Quantity ${item.product.name_en}`}>
                                    <button
                                        onClick={() => updateQuantity(item.product.id, item.selectedWeight?.label, item.quantity - 1)}
                                        className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg font-bold transition-colors"
                                        aria-label="Decrease"
                                    >−</button>
                                    <span className="w-8 text-center text-white font-bold" aria-live="polite">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.product.id, item.selectedWeight?.label, item.quantity + 1)}
                                        className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg font-bold transition-colors"
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
                                    className="text-white/30 hover:text-brand-red transition-colors p-1 rounded"
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
                        <span className="text-xl font-bold text-white">Total</span>
                        <span className="text-3xl font-black text-brand-red">₪{total().toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => { clearCart(); toast.success('Cart cleared'); }}
                            className="btn-ghost flex-1 justify-center border border-white/10"
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
