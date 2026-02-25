import { Link } from 'react-router-dom';
import type { Product } from '../api/client';

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    return (
        <Link
            to={`/product/${product.id}`}
            className="woo-card group flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red"
            aria-label={`${product.name_en} – ₪${product.price_nis}`}
        >
            {/* ── Image block ── */}
            <div className="relative overflow-hidden bg-[#111] aspect-square">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name_en}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-white/10" aria-hidden="true">
                        🥩
                    </div>
                )}

                {/* Hover overlay – subtle darkening */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                {/* Badges – top left */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.is_kosher && (
                        <span className="badge-kosher text-[10px] px-2 py-0.5">✡️ Kosher</span>
                    )}
                    {!product.is_available && (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold bg-black/75 text-white/70 rounded border border-white/15">
                            Out of stock
                        </span>
                    )}
                </div>

                {/* "View" pill on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-brand-red text-white text-xs font-bold tracking-widest uppercase px-5 py-2 rounded shadow-lg shadow-black/50">
                        View Product
                    </span>
                </div>
            </div>

            {/* ── Info block ── */}
            <div className="woo-card-body flex flex-col flex-1 p-4 gap-2">

                {/* Category label */}
                {product.category_name_en && (
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-red/80">
                        {product.category_name_en}
                    </span>
                )}

                {/* Product name */}
                <h3 className="font-bold text-white text-base leading-snug group-hover:text-brand-red transition-colors duration-200 line-clamp-2">
                    {product.name_en}
                </h3>

                {/* Short description */}
                {product.description_en && (
                    <p className="text-white/45 text-xs leading-relaxed line-clamp-2 flex-1">
                        {product.description_en}
                    </p>
                )}

                {/* Price + CTA row */}
                <div className="pt-3 border-t border-white/8 flex items-center justify-between gap-2 mt-auto">
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-white">₪{product.price_nis}</span>
                        <span className="text-white/35 text-[10px] font-medium">
                            {product.unit === 'kg' ? '/ kg' : '/ item'}
                        </span>
                    </div>

                    {/* Add-to-cart button style (navigates to product page) */}
                    <span className="woo-btn-add shrink-0">
                        Add to Cart
                    </span>
                </div>
            </div>
        </Link>
    );
}
