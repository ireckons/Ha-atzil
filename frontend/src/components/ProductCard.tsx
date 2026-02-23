import { Link } from 'react-router-dom';
import type { Product } from '../api/client';

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    return (
        <Link
            to={`/product/${product.id}`}
            className="card group flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red"
            aria-label={`${product.name_he} – ₪${product.price_nis}`}
        >
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-brand-dark-gray to-black overflow-hidden">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name_he}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl opacity-30" aria-hidden="true">
                        🥩
                    </div>
                )}
                {/* Badges */}
                <div className="absolute top-2 start-2 flex flex-col gap-1">
                    {product.is_kosher && (
                        <span className="badge-kosher">✡️ כשר</span>
                    )}
                    {!product.is_available && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-black/80 text-white/60 rounded-full border border-white/20">
                            לא זמין
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex-1">
                    <h3 className="font-bold text-white text-lg leading-snug group-hover:text-brand-red transition-colors">
                        {product.name_he}
                    </h3>
                    <p className="text-white/50 text-sm mt-0.5">{product.name_en}</p>
                    {product.description_he && (
                        <p className="text-white/50 text-xs mt-2 line-clamp-2">{product.description_he}</p>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-black text-brand-red">₪{product.price_nis}</span>
                        <span className="text-white/40 text-xs me-1">
                            {product.unit === 'kg' ? '/ ק"ג' : '/ יחידה'}
                        </span>
                    </div>
                    <span className="text-xs text-brand-red group-hover:text-white transition-colors font-medium">
                        לפרטים ←
                    </span>
                </div>
            </div>
        </Link>
    );
}
