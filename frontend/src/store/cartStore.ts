import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, WeightOption } from '../api/client';

export interface CartItem {
    product: Product;
    quantity: number;
    selectedWeight?: WeightOption;
}

interface CartStore {
    items: CartItem[];
    addItem: (product: Product, quantity: number, selectedWeight?: WeightOption) => void;
    updateQuantity: (productId: string, weightLabel: string | undefined, quantity: number) => void;
    removeItem: (productId: string, weightLabel: string | undefined) => void;
    clearCart: () => void;
    total: () => number;
    count: () => number;
}

function itemKey(productId: string, weightLabel?: string): string {
    return `${productId}:${weightLabel ?? 'unit'}`;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product, quantity, selectedWeight) => {
                const key = itemKey(product.id, selectedWeight?.label);
                set((state) => {
                    const existing = state.items.find(
                        (i) => itemKey(i.product.id, i.selectedWeight?.label) === key
                    );
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                itemKey(i.product.id, i.selectedWeight?.label) === key
                                    ? { ...i, quantity: i.quantity + quantity }
                                    : i
                            ),
                        };
                    }
                    return { items: [...state.items, { product, quantity, selectedWeight }] };
                });
            },
            updateQuantity: (productId, weightLabel, quantity) => {
                const key = itemKey(productId, weightLabel);
                if (quantity <= 0) {
                    set((state) => ({
                        items: state.items.filter(
                            (i) => itemKey(i.product.id, i.selectedWeight?.label) !== key
                        ),
                    }));
                } else {
                    set((state) => ({
                        items: state.items.map((i) =>
                            itemKey(i.product.id, i.selectedWeight?.label) === key ? { ...i, quantity } : i
                        ),
                    }));
                }
            },
            removeItem: (productId, weightLabel) => {
                const key = itemKey(productId, weightLabel);
                set((state) => ({
                    items: state.items.filter(
                        (i) => itemKey(i.product.id, i.selectedWeight?.label) !== key
                    ),
                }));
            },
            clearCart: () => set({ items: [] }),
            total: () => {
                return get().items.reduce((sum, item) => {
                    const weightFactor = item.selectedWeight ? item.selectedWeight.grams / 1000 : 1;
                    return sum + item.product.price_nis * item.quantity * weightFactor;
                }, 0);
            },
            count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
        }),
        { name: 'haatzil-cart' }
    )
);
