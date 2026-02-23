import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export const api = axios.create({
    baseURL: `${API_BASE}/api`,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('haatzil_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Handle 401 by clearing token
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('haatzil_token');
            window.location.href = '/admin/login';
        }
        return Promise.reject(err);
    }
);

// ─────────────────────────────────────
// Types
// ─────────────────────────────────────
export interface WeightOption {
    label: string;
    grams: number;
}

export interface Product {
    id: string;
    category_id: number;
    category_name_he: string;
    category_name_en: string;
    category_slug: string;
    name_he: string;
    name_en: string;
    description_he?: string;
    description_en?: string;
    price_nis: number;
    weight_options: WeightOption[];
    unit: 'kg' | 'unit' | 'portion';
    is_available: boolean;
    is_kosher: boolean;
    kosher_cert_text?: string;
    image_url?: string;
}

export interface Category {
    id: number;
    slug: string;
    name_he: string;
    name_en: string;
    sort_order: number;
}

export interface PickupSlot {
    id: string;
    slot_date: string;
    slot_time: string;
    capacity: number;
    booked_count: number;
    available_count: number;
    is_active: boolean;
}

export interface OrderItem {
    id: string;
    name_he: string;
    name_en: string;
    quantity: number;
    weight_g?: number;
    price_nis: number;
    subtotal_nis: number;
}

export interface Order {
    id: string;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    pickup_slot_id: string;
    slot_date: string;
    slot_time: string;
    status: 'pending' | 'confirmed' | 'ready' | 'collected' | 'cancelled';
    notes?: string;
    total_nis: number;
    items: OrderItem[];
    created_at: string;
}

// ─────────────────────────────────────
// API calls
// ─────────────────────────────────────
export const productApi = {
    list: (params?: { category?: string; available?: boolean }) =>
        api.get<Product[]>('/products', { params }).then((r) => r.data),
    get: (id: string) => api.get<Product>(`/products/${id}`).then((r) => r.data),
    categories: () => api.get<Category[]>('/products/categories/all').then((r) => r.data),
    create: (data: Partial<Product>) => api.post<Product>('/products', data).then((r) => r.data),
    update: (id: string, data: Partial<Product>) => api.put<Product>(`/products/${id}`, data).then((r) => r.data),
    delete: (id: string) => api.delete(`/products/${id}`),
    toggleAvailability: (id: string, is_available: boolean) =>
        api.patch<Product>(`/products/${id}/availability`, { is_available }).then((r) => r.data),
    exportCsv: () => api.get('/products/export/csv', { responseType: 'blob' }).then((r) => r.data),
};

export const orderApi = {
    create: (data: {
        customer_name: string;
        customer_phone: string;
        customer_email?: string;
        pickup_slot_id: string;
        notes?: string;
        items: { product_id: string; quantity: number; weight_g?: number }[];
    }) => api.post<Order>('/orders', data).then((r) => r.data),
    get: (id: string) => api.get<Order>(`/orders/${id}`).then((r) => r.data),
    list: (params?: { status?: string; date?: string; search?: string; page?: number }) =>
        api.get<Order[]>('/orders', { params }).then((r) => r.data),
    updateStatus: (id: string, status: Order['status']) =>
        api.patch<Order>(`/orders/${id}/status`, { status }).then((r) => r.data),
    auditLog: (id: string) => api.get(`/orders/${id}/audit`).then((r) => r.data),
};

export const slotApi = {
    list: (params?: { from?: string; to?: string }) =>
        api.get<PickupSlot[]>('/pickup-slots', { params }).then((r) => r.data),
    listAdmin: (params?: { date?: string }) =>
        api.get<PickupSlot[]>('/pickup-slots/admin', { params }).then((r) => r.data),
    create: (data: Partial<PickupSlot>) => api.post<PickupSlot>('/pickup-slots', data).then((r) => r.data),
    update: (id: string, data: Partial<PickupSlot>) => api.put<PickupSlot>(`/pickup-slots/${id}`, data).then((r) => r.data),
};

export const authApi = {
    login: (email: string, password: string) =>
        api.post<{ token: string; isAdmin: boolean }>('/auth/login', { email, password }).then((r) => r.data),
    me: () => api.get('/auth/me').then((r) => r.data),
    logout: () => api.post('/auth/logout'),
};
