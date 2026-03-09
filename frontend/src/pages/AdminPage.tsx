import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { productApi, categoryApi, type Product, type Category } from '../api/client';
import { useAuthStore } from '../store/authStore';

export default function AdminPage() {
    const navigate = useNavigate();
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const token = useAuthStore((s) => s.token);
    const qc = useQueryClient();
    const [tab, setTab] = useState<'items' | 'categories'>('items');
    const sseRef = useRef<EventSource | null>(null);

    // SSE for live product updates
    useEffect(() => {
        const API = import.meta.env.VITE_API_URL ?? '';
        const es = new EventSource(`${API}/api/orders/stream?token=${token}`);
        sseRef.current = es;
        es.addEventListener('product_created', () => qc.invalidateQueries({ queryKey: ['admin-products'] }));
        es.addEventListener('product_updated', () => qc.invalidateQueries({ queryKey: ['admin-products'] }));
        es.addEventListener('product_deleted', () => qc.invalidateQueries({ queryKey: ['admin-products'] }));
        return () => { es.close(); };
    }, [token, qc]);

    const handleLogout = () => { clearAuth(); toast.success('התנתקת בהצלחה'); navigate('/'); };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
            {/* Admin Navbar */}
            <header className="bg-white border-b border-black/10 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <img src="/logo-haatzil.jpeg" alt="האציל Logo" className="h-8 object-contain mix-blend-multiply" />
                    <div>
                        <span className="text-xs text-[#666] mr-2">פאנל ניהול</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setTab('items')} className={`px-6 py-3 rounded-xl text-base font-semibold transition-all ${tab === 'items' ? 'bg-brand-red text-white shadow-md' : 'text-[#555] hover:bg-black/5'}`} aria-pressed={tab === 'items'}>
                        🥩 מוצרים
                    </button>
                    <button onClick={() => setTab('categories')} className={`px-6 py-3 rounded-xl text-base font-semibold transition-all ${tab === 'categories' ? 'bg-brand-red text-white shadow-md' : 'text-[#555] hover:bg-black/5'}`} aria-pressed={tab === 'categories'}>
                        📁 קטגוריות
                    </button>
                    <button onClick={handleLogout} className="btn-ghost border-black/10 hover:border-black/20 text-sm" aria-label="Logout">התנתק</button>
                </div>
            </header>

            <main className="flex-1 p-4 lg:p-6 overflow-auto">
                {tab === 'items' && <ItemsPanel />}
                {tab === 'categories' && <CategoriesPanel />}
            </main>
        </div>
    );
}

// ─────────────────────────────────────
// Categories Panel
// ─────────────────────────────────────
function CategoriesPanel() {
    const qc = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);

    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryApi.list,
    });

    const [localCategories, setLocalCategories] = useState<Category[]>([]);
    const [draggedId, setDraggedId] = useState<string | null>(null);

    useEffect(() => {
        if (categories) {
            setLocalCategories([...categories].sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99)));
        }
    }, [categories]);

    const handleDrop = async (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedId || draggedId === targetId) return;

        const oldIdx = localCategories.findIndex(c => c.id === draggedId);
        const newIdx = localCategories.findIndex(c => c.id === targetId);
        if (oldIdx === -1 || newIdx === -1) return;

        const items = [...localCategories];
        const [moved] = items.splice(oldIdx, 1);
        items.splice(newIdx, 0, moved);

        const updated = items.map((item, i) => ({ ...item, sort_order: i }));
        setLocalCategories(updated);
        setDraggedId(null);

        try {
            await Promise.all(updated.map(cat => categoryApi.update(cat.id, { ...cat, sort_order: cat.sort_order })));
            qc.invalidateQueries({ queryKey: ['categories'] });
            toast.success('סדר התצוגה עודכן');
        } catch (err) {
            toast.error('שגיאה בעדכון סדר התצוגה');
        }
    };

    const deleteMutation = useMutation({
        mutationFn: (id: string) => categoryApi.delete(id),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); toast.success('קטגוריה נמחקה!'); },
        onError: (err: any) => toast.error(err.response?.data?.details?.[0]?.message || err.response?.data?.error || 'שגיאה במחיקת הקטגוריה'),
    });

    const toggleFeaturedMutation = useMutation({
        mutationFn: (cat: Category) => categoryApi.update(cat.id, { ...cat, is_featured: !cat.is_featured }),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); toast.success('הגדרות תצוגה שונו!'); },
        onError: (err: any) => toast.error(err.response?.data?.details?.[0]?.message || err.response?.data?.error || 'שגיאה בעדכון הקטגוריה'),
    });

    return (
        <div>
            <div className="flex flex-wrap items-center gap-3 mb-6 max-w-4xl">
                <h2 className="section-title text-xl mb-0">ניהול קטגוריות</h2>
                <div className="flex-1" />
                <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary py-2 text-sm">+ הוספת קטגוריה</button>
            </div>

            {showForm && (
                <CategoryFormModal
                    category={editing}
                    onClose={() => { setShowForm(false); setEditing(null); }}
                    onSaved={() => { qc.invalidateQueries({ queryKey: ['categories'] }); setShowForm(false); setEditing(null); }}
                />
            )}

            {isLoading ? (
                <div className="space-y-3 max-w-4xl mx-auto">
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-black/5 animate-pulse" />)}
                </div>
            ) : (
                <div className="space-y-2 max-w-4xl mx-auto" role="list">
                    {localCategories.map((cat: Category) => (
                        <div 
                            key={cat.id} 
                            role="listitem" 
                            draggable
                            onDragStart={() => setDraggedId(cat.id)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, cat.id)}
                            className={`card p-4 flex flex-wrap items-center gap-3 border border-black/5 shadow-sm cursor-grab active:cursor-grabbing hover:bg-black/5 transition-colors ${draggedId === cat.id ? 'opacity-40 scale-[0.98]' : ''}`}
                        >
                            <div className="text-2xl cursor-grab opacity-50 hover:opacity-100" title="גרור כדי לסדר">
                                ☰
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-[#111] truncate">
                                        {cat.name_he} | {cat.name_en}
                                    </span>
                                </div>
                                <p className="text-[#666] text-xs font-medium">מיקום: {cat.sort_order}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={() => toggleFeaturedMutation.mutate(cat)}
                                    title={cat.is_featured ? "מוצג בדף הבית (לחץ להסרה)" : "לא מופיע בדף הבית (לחץ להוספה)"}
                                    className="text-2xl px-2 hover:scale-110 transition-transform focus:outline-none drop-shadow-sm"
                                >
                                    {cat.is_featured ? '⭐' : '☆'}
                                </button>
                                <button onClick={() => { setEditing(cat); setShowForm(true); }} className="btn-ghost border border-black/10 hover:border-black/20 text-sm py-2 px-3 min-h-[44px] bg-white">✏️</button>
                                <button onClick={() => { if (confirm(`למחוק את הקטגוריה וכל מוצריה "${cat.name_he}"?`)) deleteMutation.mutate(cat.id); }}
                                    className="text-red-600/70 hover:text-red-600 transition-colors p-2 rounded min-h-[44px] min-w-[44px] flex items-center justify-center bg-white border border-black/10"
                                >🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function CategoryFormModal({ category, onClose, onSaved }: {
    category: Category | null; onClose: () => void; onSaved: () => void;
}) {
    const isEdit = !!category;
    const [form, setForm] = useState({
        slug: category?.slug ?? '',
        name_he: category?.name_he ?? '',
        name_en: category?.name_en ?? '',
        sort_order: category?.sort_order ?? 99,
        is_featured: category?.is_featured ?? false,
        icon_emoji: category?.icon_emoji ?? '🍽️',
    });

    const saveMutation = useMutation({
        mutationFn: () => {
            const payload = { ...form, slug: form.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') };
            return isEdit ? categoryApi.update(category!.id, payload) : categoryApi.create(payload);
        },
        onSuccess: () => { toast.success(isEdit ? 'עודכן בהצלחה' : 'הקטגוריה נוצרה!'); onSaved(); },
        onError: (err: any) => toast.error(err.response?.data?.details?.[0]?.message || err.response?.data?.error || 'שגיאה בשמירת הקטגוריה'),
    });

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#F8F9FA] border border-black/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[#111]">{isEdit ? 'עריכת קטגוריה' : 'קטגוריה חדשה'}</h3>
                    <button onClick={onClose} className="text-[#666] hover:text-[#111] transition-colors text-xl">✕</button>
                </div>
                <div className="space-y-4">
                    <FormRow label="שם (עברית) *" value={form.name_he} onChange={(v) => setForm((f) => ({ ...f, name_he: v }))} />
                    <FormRow label="שם (אנגלית) *" value={form.name_en} onChange={(v) => setForm((f) => ({ ...f, name_en: v }))} dir="ltr" />
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-[#111]">אייקון (בחר מהרשימה)</label>
                        <div className="flex flex-wrap gap-2 p-3 bg-white border border-black/10 rounded-lg max-h-40 overflow-y-auto">
                            {['🥩', '🍖', '🍗', '🐟', '🍔', '🍟', '🌭', '🥪', '🥙', '🧆', '🌯', '🥘', '🍲', '🥗', '🥤', '🧃', '🍷', '🥂', '🍺', '🍻', '🧊', '🧂', '🥫', '🍽️', '🍴', '🥄', '🔪'].map(emoji => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, icon_emoji: emoji }))}
                                    className={`w-10 h-10 text-xl flex items-center justify-center rounded-md hover:bg-black/5 transition-colors ${form.icon_emoji === emoji ? 'bg-[#B21B21] text-white shadow-md' : ''}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Toggle label="הצג בדף הבית (Featured)" checked={form.is_featured} onChange={(v) => setForm((f) => ({ ...f, is_featured: v }))} />
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="btn-ghost flex-1 justify-center border border-black/10 bg-white">ביטול</button>
                    <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="btn-primary flex-1 justify-center">
                        {saveMutation.isPending ? 'שומר…' : 'שמור'}
                    </button>
                </div>
            </div>
        </div>
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
        queryFn: categoryApi.list,
    });

    const [localProducts, setLocalProducts] = useState<Product[]>([]);
    const [draggedId, setDraggedId] = useState<string | null>(null);

    useEffect(() => {
        if (products) {
            setLocalProducts([...products].sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99)));
        }
    }, [products]);

    const handleDrop = async (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedId || draggedId === targetId) return;

        const oldIdx = localProducts.findIndex(p => p.id === draggedId);
        const newIdx = localProducts.findIndex(p => p.id === targetId);
        if (oldIdx === -1 || newIdx === -1) return;

        const items = [...localProducts];
        const [moved] = items.splice(oldIdx, 1);
        items.splice(newIdx, 0, moved);

        const updated = items.map((item, i) => ({ ...item, sort_order: i }));
        setLocalProducts(updated);
        setDraggedId(null);

        try {
            await Promise.all(updated.map(p => productApi.update(p.id, { ...p, sort_order: p.sort_order })));
            qc.invalidateQueries({ queryKey: ['admin-products'] });
            toast.success('סדר התצוגה עודכן');
        } catch (err) {
            toast.error('שגיאה בעדכון סדר התצוגה');
        }
    };

    const deleteMutation = useMutation({
        mutationFn: (id: string) => productApi.delete(id),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); toast.success('מוצר נמחק!'); },
        onError: (err: any) => toast.error(err.response?.data?.details?.[0]?.message || err.response?.data?.error || 'שגיאה במחיקת המוצר'),
    });

    const toggleMutation = useMutation({
        mutationFn: ({ id, v }: { id: string; v: boolean }) => productApi.toggleAvailability(id, v),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
        onError: (err: any) => toast.error(err.response?.data?.details?.[0]?.message || err.response?.data?.error || 'שגיאה בעדכון זמינות'),
    });

    const exportCsv = async () => {
        const blob = await productApi.exportCsv();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'products.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div className="flex flex-wrap items-center gap-3 mb-6 max-w-4xl mx-auto">
                <h2 className="section-title text-xl mb-0">ניהול פריטים</h2>
                <div className="flex-1" />
                <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary py-2 text-sm px-6 shadow-md">+ הוספת מוצר</button>
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
                <div className="space-y-3 max-w-4xl mx-auto">
                    {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-black/5 animate-pulse" />)}
                </div>
            ) : (
                <div className="space-y-2 max-w-4xl mx-auto" role="list">
                    {localProducts.map((product: Product) => (
                        <div 
                            key={product.id} 
                            role="listitem" 
                            draggable
                            onDragStart={() => setDraggedId(product.id)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, product.id)}
                            className={`card p-4 flex flex-wrap items-center gap-3 border border-black/5 shadow-sm hover:bg-black/5 transition-colors cursor-grab active:cursor-grabbing ${!product.is_available ? 'opacity-60' : ''} ${draggedId === product.id ? 'opacity-40 scale-[0.98]' : ''}`}
                        >
                            <div className="text-2xl cursor-grab opacity-50 hover:opacity-100" title="גרור כדי לסדר">
                                ☰
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-[#EAEAEA] flex-shrink-0 overflow-hidden border border-black/5">
                                {product.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg text-black/10" aria-hidden="true">🥩</div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-[#111] truncate">{product.name_en}</span>
                                </div>
                                <p className="text-[#666] text-xs font-medium">{product.category_name_en} · ₪{product.price_nis} / {product.unit === 'kg' ? 'kg' : 'unit'}</p>
                            </div>

                            {/* Availability toggle */}
                            <button
                                onClick={() => toggleMutation.mutate({ id: product.id, v: !product.is_available })}
                                className={`text-xs px-3 py-1.5 rounded-full border font-bold transition-all min-h-[36px] ${product.is_available ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-[#F8F9FA] text-[#888] border-black/10'}`}
                                aria-label={product.is_available ? 'Disable product' : 'Enable product'}
                            >
                                {product.is_available ? '✓ במלאי' : 'אזל במלאי'}
                            </button>

                            <div className="flex gap-2">
                                <button onClick={() => { setEditing(product); setShowForm(true); }} className="btn-ghost border border-black/10 hover:border-black/20 text-sm py-2 px-3 min-h-[44px] bg-white" aria-label={`Edit ${product.name_he || product.name_en}`}>✏️</button>
                                <button onClick={() => { if (confirm(`למחוק את "${product.name_he || product.name_en}"?`)) deleteMutation.mutate(product.id); }}
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [form, setForm] = useState({
        category_id: product?.category_id ?? String(categories[0]?.id ?? '1'),
        name_he: product?.name_he ?? '',
        name_en: product?.name_en ?? '',
        description_he: product?.description_he ?? '',
        description_en: product?.description_en ?? '',
        price_nis: product?.price_nis ?? 0,
        unit: product?.unit ?? 'kg',
        is_available: product?.is_available ?? true,
        is_kosher: product?.is_kosher ?? true,
        image_url: product?.image_url ?? '',
    });

    const saveMutation = useMutation({
        mutationFn: () => {
            const payload = { 
                ...form, 
                price_nis: Number(form.price_nis) || 0,
                category_id: Number(form.category_id) || 1
            };
            return isEdit
                ? productApi.update(product!.id, { ...payload, weight_options: Array.isArray(product?.weight_options) ? product.weight_options : [] })
                : productApi.create({ ...payload, weight_options: [] });
        },
        onSuccess: () => { toast.success(isEdit ? 'עודכן בהצלחה' : 'המוצר נוצר בהצלחה!'); onSaved(); },
        onError: (err: any) => toast.error(err.response?.data?.details?.[0]?.message || err.response?.data?.error || 'שגיאה בשמירת המוצר'),
    });

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="bg-[#F8F9FA] border border-black/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h3 id="modal-title" className="text-xl font-bold text-[#111]">{isEdit ? 'עריכת מוצר' : 'הוספת מוצר חדש'}</h3>
                    <button onClick={onClose} className="text-[#666] hover:text-[#111] transition-colors text-xl" aria-label="Close">✕</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#444] mb-1">קטגוריה</label>
                        <select value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))} className="input bg-white border-black/10 text-[#111]">
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.name_en} / {c.name_he}</option>)}
                        </select>
                    </div>
                    <FormRow label="שם (עברית) *" value={form.name_he} onChange={(v) => setForm((f) => ({ ...f, name_he: v }))} />
                    <FormRow label="שם (אנגלית) *" value={form.name_en} onChange={(v) => setForm((f) => ({ ...f, name_en: v }))} dir="ltr" />
                    <FormRow label="תיאור (עברית)" value={form.description_he} onChange={(v) => setForm((f) => ({ ...f, description_he: v }))} textarea />
                    <FormRow label="מחיר ב₪ *" type="number" value={form.price_nis || form.price_nis === 0 ? String(form.price_nis) : ''} onChange={(v) => setForm((f) => ({ ...f, price_nis: v === '' ? 0 : parseFloat(v) }))} dir="ltr" />
                    <div>
                        <label className="block text-sm font-medium text-[#444] mb-1">יחידת מידה</label>
                        <select value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value as any }))} className="input bg-white border-black/10 text-[#111]">
                            <option value="kg">ק״ג (kg)</option>
                            <option value="100g">100 גרם (100g)</option>
                            <option value="g">גרם (g)</option>
                            <option value="liter">ליטר (liter)</option>
                            <option value="unit">יחידה (unit)</option>
                            <option value="portion">מנה (portion)</option>
                        </select>
                    </div>
                    <div className="space-y-2 mt-4">
                        <label className="block text-sm font-medium text-[#444]">תמונה</label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-black/10 shadow-sm flex-shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-red bg-white">
                                {form.image_url ? (
                                    <>
                                        <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white text-xs font-semibold">לחץ להחלפה</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-black/5 flex flex-col items-center justify-center text-[#666] hover:bg-black/10 transition-colors">
                                        <span className="text-2xl mb-1">📷</span>
                                        <span className="text-[10px] font-medium leading-none text-center px-1">לחץ להעלאת תמונה</span>
                                    </div>
                                )}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    try {
                                        toast.loading('מעלה תמונה...', { id: 'img-upload' });
                                        const { api } = await import('../api/client');
                                        const fd = new FormData(); fd.append('image', file);
                                        const { data } = await api.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
                                        setForm(f => ({ ...f, image_url: data.url }));
                                        toast.success('תמונה הועלתה בהצלחה', { id: 'img-upload' });
                                    } catch (err: any) {
                                        console.error(err);
                                        toast.error(err.response?.data?.error || 'שגיאה בהעלאת התמונה', { id: 'img-upload' });
                                    }
                                }}
                            />
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                <button type="button" onClick={() => setShowImagePicker(true)} className="btn-primary h-11 text-sm px-5 shadow-sm bg-[#FE2B20] text-white hover:bg-[#E02015] flex items-center justify-center gap-2 transition-colors">
                                    ☁️ בחר תמונה מהענן
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <Toggle label="זמין במלאי" checked={form.is_available} onChange={(v) => setForm((f) => ({ ...f, is_available: v }))} />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="btn-ghost flex-1 justify-center border border-black/10 bg-white">ביטול</button>
                    <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="btn-primary flex-1 justify-center">
                        {saveMutation.isPending ? 'שומר…' : 'שמור'}
                    </button>
                </div>
            </div>

            {showImagePicker && (
                <ImagePickerModal 
                    onClose={() => setShowImagePicker(false)} 
                    onSelect={(url) => { setForm(f => ({ ...f, image_url: url })); setShowImagePicker(false); toast.success('תמונה נבחרה בהצלחה'); }} 
                />
            )}
        </div>
    );
}

function ImagePickerModal({ onClose, onSelect }: { onClose: () => void, onSelect: (url: string) => void }) {
    const { data, isLoading } = useQuery({
        queryKey: ['gcs-images'],
        queryFn: () => productApi.listImages(),
    });

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#F8F9FA] border border-black/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-black/5">
                    <h3 className="text-lg font-bold text-[#111]">בחירת תמונה מהענן</h3>
                    <button onClick={onClose} className="text-[#666] hover:text-[#111] transition-colors text-xl">✕</button>
                </div>
                <div className="p-4 flex-1 overflow-y-auto min-h-[300px]">
                    {isLoading ? (
                        <div className="flex justify-center p-12"><div className="animate-spin text-4xl opacity-50">⏳</div></div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {data?.images.map((url: string) => (
                                <button key={url} onClick={() => onSelect(url)} className="aspect-square rounded-xl overflow-hidden border border-black/10 hover:border-brand-red hover:shadow-md transition-all relative group bg-white focus:outline-none focus:ring-2 focus:ring-brand-red">
                                    <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </button>
                            ))}
                            {(!data?.images || data.images.length === 0) && (
                                <div className="col-span-full py-12 text-center text-[#666]">לא נמצאו תמונות בענן</div>
                            )}
                        </div>
                    )}
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
