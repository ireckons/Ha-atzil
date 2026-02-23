import { create } from 'zustand';
import type { Order } from '../api/client';

interface AuthStore {
    token: string | null;
    isAdmin: boolean;
    setAuth: (token: string, isAdmin: boolean) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    token: localStorage.getItem('haatzil_token'),
    isAdmin: localStorage.getItem('haatzil_admin') === 'true',
    setAuth: (token, isAdmin) => {
        localStorage.setItem('haatzil_token', token);
        localStorage.setItem('haatzil_admin', String(isAdmin));
        set({ token, isAdmin });
    },
    clearAuth: () => {
        localStorage.removeItem('haatzil_token');
        localStorage.removeItem('haatzil_admin');
        set({ token: null, isAdmin: false });
    },
}));

interface OrderStore {
    lastOrder: Order | null;
    setLastOrder: (order: Order) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
    lastOrder: null,
    setLastOrder: (order) => set({ lastOrder: order }),
}));
