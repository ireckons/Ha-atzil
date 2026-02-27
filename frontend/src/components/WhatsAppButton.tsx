import { useEffect, useState } from 'react';
import { useCartStore } from '../store/cartStore';

export default function WhatsAppButton() {
    const { items } = useCartStore();
    const [isVisible, setIsVisible] = useState(false);

    // Show button when cart has items
    useEffect(() => {
        setIsVisible(items.length > 0);
    }, [items]);

    if (!isVisible) return null;

    const STORE_PHONE_NUMBER = "97246226677"; // Default fallback since none was provided
    const STORE_NAME = "האציל";

    const generateWhatsAppLink = () => {
        let text = `שלום ${STORE_NAME}, אני מעוניין להזמין:\n\n`;

        items.forEach(item => {
            const weightText = item.selectedWeight ? ` (${item.selectedWeight.label})` : '';
            text += `- ${item.quantity}x ${item.product.name_en}${weightText}\n`;
        });

        text += `\nתודה!`;
        return `https://wa.me/${STORE_PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
    };

    return (
        <a
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 flex items-center justify-center group"
            aria-label="Order on WhatsApp"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7 fill-white/10"
            >
                <path d="M7 6l13 13M19.29 19.33a2.05 2.05 0 01-2.92.17l-3.3-3.3a2 2 0 011.66-3.23l2.88 2.88a10 10 0 10-14 14l3.1-3.1a2 2 0 01-1.6 3.03H3A12 12 0 1119.29 19.332v-.002z" />
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>

            {/* Tooltip on hover (desktop only) */}
            <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden md:block pointer-events-none">
                Order via WhatsApp
            </span>

            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-brand-black">
                {items.length}
            </span>
        </a>
    );
}
