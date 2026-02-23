import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../store/cartStore';
import type { Product } from '../api/client';

const mockProduct: Product = {
    id: 'prod-001',
    category_id: 1,
    category_name_he: 'בקר',
    category_name_en: 'Beef',
    category_slug: 'beef',
    name_he: 'אנטריקוט',
    name_en: 'Ribeye',
    price_nis: 189,
    weight_options: [{ label: '500g', grams: 500 }],
    unit: 'kg',
    is_available: true,
    is_kosher: true,
};

describe('Cart Store', () => {
    beforeEach(() => {
        useCartStore.getState().clearCart();
    });

    it('starts empty', () => {
        expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('adds an item', () => {
        useCartStore.getState().addItem(mockProduct, 2, { label: '500g', grams: 500 });
        expect(useCartStore.getState().items).toHaveLength(1);
        expect(useCartStore.getState().items[0].quantity).toBe(2);
    });

    it('increments quantity for same item + weight', () => {
        useCartStore.getState().addItem(mockProduct, 1, { label: '500g', grams: 500 });
        useCartStore.getState().addItem(mockProduct, 3, { label: '500g', grams: 500 });
        expect(useCartStore.getState().items).toHaveLength(1);
        expect(useCartStore.getState().items[0].quantity).toBe(4);
    });

    it('treats different weights as different items', () => {
        useCartStore.getState().addItem(mockProduct, 1, { label: '500g', grams: 500 });
        useCartStore.getState().addItem(mockProduct, 1, { label: '1kg', grams: 1000 });
        expect(useCartStore.getState().items).toHaveLength(2);
    });

    it('calculates total with weight factor', () => {
        useCartStore.getState().addItem(mockProduct, 1, { label: '500g', grams: 500 });
        // 189 ₪/kg × 0.5kg × 1 = 94.5
        expect(useCartStore.getState().total()).toBeCloseTo(94.5);
    });

    it('removes an item', () => {
        useCartStore.getState().addItem(mockProduct, 1, { label: '500g', grams: 500 });
        useCartStore.getState().removeItem(mockProduct.id, '500g');
        expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('updates quantity and removes when 0', () => {
        useCartStore.getState().addItem(mockProduct, 2, { label: '500g', grams: 500 });
        useCartStore.getState().updateQuantity(mockProduct.id, '500g', 0);
        expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('counts items correctly', () => {
        useCartStore.getState().addItem(mockProduct, 3, { label: '500g', grams: 500 });
        expect(useCartStore.getState().count()).toBe(3);
    });
});
