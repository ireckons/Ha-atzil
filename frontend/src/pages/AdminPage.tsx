import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { productApi, orderApi, type Product, type Order, type Category } from '../api/client';
import { useAuthStore } from '../store/authStore';

type AdminTab = 'orders' | 'items';
type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'collected' | 'cancelled';

const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: 'Pending', confirmed: 'Confirmed', ready: 'Ready', collected: 'Collected', cancelled: 'Cancelled',
};
const STATUS_COLORS: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100/80 text-yellow-800 border-yellow-200',
    confirmed: 'bg-blue-100/80 text-blue-800 border-blue-200',
    ready: 'bg-emerald-100/80 text-emerald-800 border-emerald-200',
    collected: 'bg-black/5 text-black/50 border-black/10',
    cancelled: 'bg-red-100/80 text-red-800 border-red-200',
};

export default function AdminPage() {
    const navigate = useNavigate();
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const token = useAuthStore((s) => s.token);
    const qc = useQueryClient();
    const [tab, setTab] = useState<AdminTab>('orders');
    const [orderSearch, setOrderSearch] = useState('');
    const [orderStatus, setOrderStatus] = useState<string>('');
    const sseRef = useRef<EventSource | null>(null);

    // SSE for live order updates
    useEffect(() => {
        const API = import.meta.env.VITE_API_URL ?? '';
        const es = new EventSource(`${API}/api/orders/stream?token=${token}`);
        sseRef.current = es;
        es.addEventListener('order_created', () => qc.invalidateQueries({ queryKey: ['admin-orders'] }));
        es.addEventListener('order_status_changed', () => qc.invalidateQueries({ queryKey: ['admin-orders'] }));
        es.addEventListener('product_created', () => qc.invalidateQueries({ queryKey: ['admin-products'] }));
        es.addEventListener('product_updated', () => qc.invalidateQueries({ queryKey: ['admin-products'] }));
        es.addEventListener('product_deleted', () => qc.invalidateQueries({ queryKey: ['admin-products'] }));
        return () => { es.close(); };
    }, [token, qc]);

    const handleLogout = () => { clearAuth(); toast.success('Logged out'); navigate('/admin/login'); };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
            {/* Admin Navbar */}
            <header className="bg-white border-b border-black/10 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <img src="/logo-haatzil.jpeg" alt="האציל Logo" className="h-8 object-contain mix-blend-multiply" />
                    <div>
                        <span className="text-xs text-[#666] mr-2">Admin Dashboard</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'orders' ? 'bg-brand-red text-white' : 'text-[#555] hover:bg-black/5'}`} aria-pressed={tab === 'orders'}>
                        📦 Orders
                    </button>
                    <button onClick={() => setTab('items')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'items' ? 'bg-brand-red text-white' : 'text-[#555] hover:bg-black/5'}`} aria-pressed={tab === 'items'}>
                        🥩 Items
                    </button>
                    <button onClick={handleLogout} className="btn-ghost border-black/10 hover:border-black/20 text-sm" aria-label="Logout">Logout</button>
                </div>
            </header>

            <main className="flex-1 p-4 lg:p-6 overflow-auto">
                {tab === 'orders' && (
                    <OrdersPanel search={orderSearch} setSearch={setOrderSearch} status={orderStatus} setStatus={setOrderStatus} />
                )}
                {tab === 'items' && <ItemsPanel />}
            </main>
        </div>
    );
}

// ─────────────────────────────────────
// Orders Panel
// ─────────────────────────────────────
function OrdersPanel({ search, setSearch, status, setStatus }: {
    search: string; setSearch: (v: string) => void;
    status: string; setStatus: (v: string) => void;
}) {
    const qc = useQueryClient();
    const { data: orders, isLoading } = useQuery({
        queryKey: ['admin-orders', search, status],
        queryFn: () => orderApi.list({ search: search || undefined, status: status || undefined }),
        refetchInterval: 15000,
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, s }: { id: string; s: OrderStatus }) => orderApi.updateStatus(id, s),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-orders'] }); toast.success('Status updated'); },
        onError: () => toast.error('Error updating status'),
    });

    return (
        <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <h2 className="section-title text-xl mb-0">Orders</h2>
                <div className="flex-1 relative min-w-[200px]">
                    <input type="search" placeholder="Search by name or phone…" value={search} onChange={(e) => setSearch(e.target.value)}
                        className="input py-2 pr-4 text-sm w-full" aria-label="Search orders" />
                </div>
                <select value={status} onChange={(e) => setStatus(e.target.value)}
                    className="input py-2 text-sm w-auto" aria-label="Filter by status">
                    <option value="">All statuses</option>
                    {Object.entries(STATUS_LABELS).map(([s, l]) => <option key={s} value={s}>{l}</option>)}
                </select>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" aria-hidden="true" />
                    <span className="text-xs text-[#666]">Live updates</span>
                </div>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 rounded-xl bg-black/5 animate-pulse" />)}
                </div>
            ) : !orders?.length ? (
                <div className="text-center py-20 text-[#666]">No orders to display</div>
            ) : (
                <div className="space-y-3" role="list" aria-label="Order list">
                    {orders.map((order: Order) => (
                        <div key={order.id} role="listitem" className="card p-4 lg:p-5 animate-fade-in border border-black/5 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="font-mono text-brand-red font-bold text-sm">{order.order_number}</span>
                                        <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border font-medium ${STATUS_COLORS[order.status]}`}>
                                            {STATUS_LABELS[order.status]}
                                        </span>
                                    </div>
                                    <p className="font-bold text-[#111] text-lg leading-tight">{order.customer_name}</p>
                                    <p className="text-[#666] text-sm">{order.customer_phone}</p>
                                </div>
                                <div className="text-end">
                                    <p className="text-[#666] text-xs font-medium">{order.slot_date}</p>
                                    <p className="text-[#111] font-bold text-lg">{order.slot_time?.slice(0, 5)}</p>
                                    <p className="text-brand-red font-black text-xl">₪{Number(order.total_nis).toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Order items summary */}
                            {order.items?.filter(Boolean).length > 0 && (
                                <div className="bg-[#F8F9FA] rounded-lg p-3 mb-3 text-xs text-[#555] space-y-1">
                                    {order.items.filter(Boolean).map((item) => (
                                        <div key={item.id} className="flex justify-between font-medium">
                                            <span>{item.name_en} {item.weight_g ? `(${item.weight_g}g)` : ''} × {item.quantity}</span>
                                            <span>₪{Number(item.subtotal_nis).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                                {order.status === 'pending' && (
                                    <QuickBtn label="✅ Confirm" onClick={() => statusMutation.mutate({ id: order.id, s: 'confirmed' })} color="blue" />
                                )}
                                {(order.status === 'pending' || order.status === 'confirmed') && (
                                    <QuickBtn label="🔔 Ready" onClick={() => statusMutation.mutate({ id: order.id, s: 'ready' })} color="green" />
                                )}
                                {order.status === 'ready' && (
                                    <QuickBtn label="📦 Collected" onClick={() => statusMutation.mutate({ id: order.id, s: 'collected' })} color="gray" />
                                )}
                                {order.status !== 'cancelled' && order.status !== 'collected' && (
                                    <QuickBtn label="✕ Cancel" onClick={() => statusMutation.mutate({ id: order.id, s: 'cancelled' })} color="red" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function QuickBtn({ label, onClick, color }: { label: string; onClick: () => void; color: string }) {
    const colors: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
        green: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
        gray: 'bg-[#F8F9FA] text-[#666] border-black/10 hover:bg-black/5',
        red: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    };
    return (
        <button onClick={onClick} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all active:scale-95 min-h-[44px] ${colors[color]}`}>
            {label}
        </button>
    );
}

// ─────────────────────────────────────
// Items Panel
// ─────────────────────────────────────
function ItemsPanel() {
    const qc = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: products, isLoading } = useQuery({
        queryKey: ['admin-products'],
        queryFn: () => productApi.list(),
    });
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: productApi.categories,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => productApi.delete(id),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); toast.success('Product deleted'); },
        onError: () => toast.error('Error deleting product'),
    });

    const toggleMutation = useMutation({
        mutationFn: ({ id, v }: { id: string; v: boolean }) => productApi.toggleAvailability(id, v),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
    });

    const exportCsv = async () => {
        const blob = await productApi.exportCsv();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'products.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <h2 className="section-title text-xl mb-0">Manage Items</h2>
                <div className="flex-1" />
                <button onClick={exportCsv} className="btn-ghost border border-black/10 hover:border-black/20 text-sm py-2 bg-white">📥 Export CSV</button>
                <label className="btn-ghost border border-black/10 hover:border-black/20 text-sm py-2 cursor-pointer bg-white">
                    📤 Import CSV
                    <input ref={fileInputRef} type="file" accept=".csv" className="hidden"
                        onChange={async (e) => {
                            const file = e.target.files?.[0]; if (!file) return;
                            const fd = new FormData(); fd.append('file', file);
                            try {
                                const { api } = await import('../api/client');
                                const res = await api.post('/products/import/csv', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                                toast.success(`Imported ${res.data.imported} products`);
                                qc.invalidateQueries({ queryKey: ['admin-products'] });
                            } catch { toast.error('Error importing CSV'); }
                        }} />
                </label>
                <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary py-2 text-sm">+ New Product</button>
            </div>

            {/* Product form modal */}
            {showForm && (
                <ProductFormModal
                    product={editing}
                    categories={categories ?? []}
                    onClose={() => { setShowForm(false); setEditing(null); }}
                    onSaved={() => { qc.invalidateQueries({ queryKey: ['admin-products'] }); setShowForm(false); setEditing(null); }}
                />
            )}

            {isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-black/5 animate-pulse" />)}
                </div>
            ) : (
                <div className="space-y-2" role="list">
                    {(products ?? []).map((product: Product) => (
                        <div key={product.id} role="listitem" className={`card p-4 flex flex-wrap items-center gap-3 border border-black/5 shadow-sm ${!product.is_available ? 'opacity-60' : ''}`}>
                            <div className="w-10 h-10 rounded-lg bg-[#EAEAEA] flex-shrink-0 overflow-hidden border border-black/5">
                                {product.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg text-black/10" aria-hidden="true">🥩</div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-[#111] truncate">{product.name_en}</span>
                                    {product.is_kosher && <span className="badge-kosher text-[10px] px-1.5 py-0.5">✡️</span>}
                                </div>
                                <p className="text-[#666] text-xs font-medium">{product.category_name_en} · ₪{product.price_nis} / {product.unit === 'kg' ? 'kg' : 'unit'}</p>
                            </div>

                            {/* Availability toggle */}
                            <button
                                onClick={() => toggleMutation.mutate({ id: product.id, v: !product.is_available })}
                                className={`text-xs px-3 py-1.5 rounded-full border font-bold transition-all min-h-[36px] ${product.is_available ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-[#F8F9FA] text-[#888] border-black/10'}`}
                                aria-label={product.is_available ? 'Disable product' : 'Enable product'}
                            >
                                {product.is_available ? '✓ Available' : 'Unavailable'}
                            </button>

                            <div className="flex gap-2">
                                <button onClick={() => { setEditing(product); setShowForm(true); }} className="btn-ghost border border-black/10 hover:border-black/20 text-sm py-2 px-3 min-h-[44px] bg-white" aria-label={`Edit ${product.name_en}`}>✏️</button>
                                <button onClick={() => { if (confirm(`Delete "${product.name_en}"?`)) deleteMutation.mutate(product.id); }}
                                    className="text-red-600/70 hover:text-red-600 transition-colors p-2 rounded min-h-[44px] min-w-[44px] flex items-center justify-center bg-white border border-black/10"
                                    aria-label={`Delete ${product.name_en}`}>🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────
// Product Form Modal
// ─────────────────────────────────────
function ProductFormModal({ product, categories, onClose, onSaved }: {
    product: Product | null; categories: Category[];
    onClose: () => void; onSaved: () => void;
}) {
    const isEdit = !!product;
    const [form, setForm] = useState({
        category_id: product?.category_id ?? categories[0]?.id ?? 1,
        name_he: product?.name_he ?? '',
        name_en: product?.name_en ?? '',
        description_he: product?.description_he ?? '',
        description_en: product?.description_en ?? '',
        price_nis: product?.price_nis ?? 0,
        unit: product?.unit ?? 'kg',
        is_available: product?.is_available ?? true,
        is_kosher: product?.is_kosher ?? true,
        kosher_cert_text: product?.kosher_cert_text ?? '',
        image_url: product?.image_url ?? '',
    });

    const saveMutation = useMutation({
        mutationFn: () => isEdit
            ? productApi.update(product!.id, { ...form, weight_options: product?.weight_options ?? [] })
            : productApi.create({ ...form, weight_options: [] }),
        onSuccess: () => { toast.success(isEdit ? 'Product updated' : 'Product created'); onSaved(); },
        onError: () => toast.error('Error saving'),
    });

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="bg-[#F8F9FA] border border-black/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h3 id="modal-title" className="text-xl font-bold text-[#111]">{isEdit ? 'Edit Product' : 'New Product'}</h3>
                    <button onClick={onClose} className="text-[#666] hover:text-[#111] transition-colors text-xl" aria-label="Close">✕</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#444] mb-1">Category</label>
                        <select value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: Number(e.target.value) }))} className="input bg-white border-black/10 text-[#111]">
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
                        </select>
                    </div>
                    <FormRow label="Name (Hebrew) *" value={form.name_he} onChange={(v) => setForm((f) => ({ ...f, name_he: v }))} />
                    <FormRow label="Name (English) *" value={form.name_en} onChange={(v) => setForm((f) => ({ ...f, name_en: v }))} dir="ltr" />
                    <FormRow label="Description (Hebrew)" value={form.description_he} onChange={(v) => setForm((f) => ({ ...f, description_he: v }))} textarea />
                    <FormRow label="Price ₪ *" type="number" value={String(form.price_nis)} onChange={(v) => setForm((f) => ({ ...f, price_nis: parseFloat(v) }))} dir="ltr" />
                    <div>
                        <label className="block text-sm font-medium text-[#444] mb-1">Unit</label>
                        <select value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value as 'kg' | 'unit' | 'portion' }))} className="input bg-white border-black/10 text-[#111]">
                            <option value="kg">kg</option><option value="unit">unit</option><option value="portion">portion</option>
                        </select>
                    </div>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <FormRow label="Image URL" value={form.image_url} onChange={(v) => setForm((f) => ({ ...f, image_url: v }))} dir="ltr" />
                        </div>
                        <div className="pb-1">
                            <label className="btn-secondary h-11 text-sm cursor-pointer whitespace-nowrap">
                                📤 Upload
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        try {
                                            toast.loading('Uploading image...', { id: 'img-upload' });
                                            const { url } = await productApi.uploadImage(file);
                                            setForm(f => ({ ...f, image_url: url }));
                                            toast.success('Image uploaded', { id: 'img-upload' });
                                        } catch (err) {
                                            console.error(err);
                                            toast.error('Failed to upload image', { id: 'img-upload' });
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                    <FormRow label="Kosher Certificate" value={form.kosher_cert_text} onChange={(v) => setForm((f) => ({ ...f, kosher_cert_text: v }))} />
                    <div className="flex gap-6">
                        <Toggle label="Available" checked={form.is_available} onChange={(v) => setForm((f) => ({ ...f, is_available: v }))} />
                        <Toggle label="Kosher" checked={form.is_kosher} onChange={(v) => setForm((f) => ({ ...f, is_kosher: v }))} />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="btn-ghost flex-1 justify-center border border-black/10 bg-white">Cancel</button>
                    <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="btn-primary flex-1 justify-center">
                        {saveMutation.isPending ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function FormRow({ label, value, onChange, type = 'text', dir, textarea }: {
    label: string; value: string; onChange: (v: string) => void;
    type?: string; dir?: string; textarea?: boolean;
}) {
    const props = { value, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value), className: 'input bg-white border-black/10 text-[#111]', dir };
    return (
        <div>
            <label className="block text-sm font-medium text-[#444] mb-1">{label}</label>
            {textarea ? <textarea {...props} rows={3} className="input bg-white border-black/10 text-[#111] resize-none" /> : <input type={type} {...props} />}
        </div>
    );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer">
            <div className={`w-10 h-6 rounded-full transition-colors border ${checked ? 'bg-brand-red border-brand-red' : 'bg-[#EAEAEA] border-black/10'}`}
                onClick={() => onChange(!checked)} role="checkbox" aria-checked={checked} tabIndex={0}
                onKeyDown={(e) => e.key === ' ' && onChange(!checked)}>
                <div className={`w-5 h-5 bg-white rounded-full shadow m-0.5 transition-transform ${checked ? 'translate-x-0' : '-translate-x-4'}`} />
            </div>
            <span className="text-sm font-medium text-[#444]">{label}</span>
        </label>
    );
}
