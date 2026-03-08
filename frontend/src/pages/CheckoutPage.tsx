import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { slotApi, orderApi, type PickupSlot } from '../api/client';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/authStore';
import { format } from 'date-fns';
import { enUS, he } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

export default function CheckoutPage() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { items, total, clearCart } = useCartStore();
    const setLastOrder = useOrderStore((s) => s.setLastOrder);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedSlot, setSelectedSlot] = useState<string | undefined>();
    const { data: slots, isLoading: slotsLoading } = useQuery({
        queryKey: ['pickup-slots'],
        queryFn: async () => {
            const data = await slotApi.list();
            console.log("Fetched slots:", data);
            return data;
        },
        refetchOnMount: 'always',
        staleTime: 0,
    });

    const mutation = useMutation({
        mutationFn: orderApi.create,
        onSuccess: (order: any) => {
            setLastOrder(order);
            clearCart();
            navigate('/confirmation');
        },
        onError: (err: unknown) => {
            const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? t('checkout.submit_error');
            toast.error(msg);
        },
    });

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlot) { toast.error(t('checkout.err_no_slot')); return; }
        if (!name.trim()) { toast.error(t('checkout.err_no_name')); return; }
        if (!phone.trim()) { toast.error(t('checkout.err_no_phone')); return; }

        mutation.mutate({
            customer_name: name.trim(),
            customer_phone: phone.trim(),
            customer_email: email.trim() || undefined,
            pickup_slot_id: selectedSlot,
            notes: notes.trim() || undefined,
            items: items.map((item) => ({
                product_id: item.product.id,
                quantity: item.quantity,
                weight_g: item.selectedWeight?.grams,
            })),
        });
    };

    return (
        <div className="min-h-screen bg-transparent py-8 px-4 relative pt-16 md:pt-8">
            {/* Mobile Back Button (Top Left) */}
            <div className="absolute top-0 left-0 z-10 md:hidden bg-white/80 backdrop-blur-sm p-2 w-full border-b border-black/5">
                <button onClick={() => window.history.back()} className="flex items-center gap-2 text-black/70 hover:text-black transition-colors cursor-pointer w-fit px-2 py-1 bg-black/5 rounded-full border border-black/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M19 12H5" />
                        <path d="M12 19l-7-7 7-7" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider pr-2">{t('cart.back')}</span>
                </button>
            </div>

            <div className="max-w-2xl mx-auto">
                <h1 className="section-title mb-2">{t('checkout.title')}</h1>
                <div className="section-divider w-24" />

                {/* Pickup-only notice */}
                <div className="mb-6 p-4 rounded-xl bg-brand-red/10 border border-brand-red/30 flex items-start gap-3" role="note">
                    <span className="text-brand-red text-xl flex-shrink-0" aria-hidden="true">ℹ️</span>
                    <p className="text-brand-red/90 text-sm font-medium">
                        <strong>{t('checkout.pickup_only')}</strong><br />
                        {t('checkout.pickup_desc')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* Customer details */}
                    <fieldset className="card p-6">
                        <legend className="text-lg font-bold text-[#111] mb-4">{t('checkout.personal_details')}</legend>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-[#444] mb-1">{t('checkout.full_name')}</label>
                                <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe" className="input bg-[#F8F9FA] border-black/10 placeholder-black/30" autoComplete="name" />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-[#444] mb-1">{t('checkout.phone')}</label>
                                <input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                                    placeholder="052-0000000" className="input bg-[#F8F9FA] border-black/10 placeholder-black/30" autoComplete="tel" dir="ltr" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#444] mb-1">{t('checkout.email')}</label>
                                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com" className="input bg-[#F8F9FA] border-black/10 placeholder-black/30" autoComplete="email" dir="ltr" />
                            </div>
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-[#444] mb-1">{t('checkout.notes')}</label>
                                <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                                    placeholder={t('checkout.notes_placeholder')} className="input bg-[#F8F9FA] border-black/10 placeholder-black/30 resize-none" />
                            </div>
                        </div>
                    </fieldset>

                    {/* Pickup slot */}
                    <fieldset className="card p-6">
                        <legend className="text-lg font-bold text-[#111] mb-4">{t('checkout.pickup_time')}</legend>
                        {slotsLoading ? (
                            <div className="space-y-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-12 rounded-lg bg-black/5 animate-pulse" />
                                ))}
                            </div>
                        ) : !slots || slots.length === 0 ? (
                            <p className="text-[#666] text-sm">{t('checkout.no_slots')}</p>
                        ) : (
                            <div className="space-y-2 max-h-72 overflow-y-auto pr-2" role="radiogroup" aria-label="Select pickup time">
                                {groupSlotsByDate(slots, i18n.language).map(({ date, slots: daySlots }) => (
                                    <div key={date}>
                                        <p className="text-xs text-[#666] font-bold mb-1 mt-3 uppercase tracking-wider">{date}</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {daySlots.map((slot: PickupSlot) => (
                                                <button
                                                    key={slot.id}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={selectedSlot === slot.id}
                                                    onClick={() => setSelectedSlot(slot.id)}
                                                    className={`p-3 rounded-lg text-sm font-medium border transition-all text-center ${selectedSlot === slot.id
                                                        ? 'bg-brand-red border-brand-red text-white shadow-md shadow-brand-red/20'
                                                        : 'border-black/10 bg-[#F8F9FA] text-[#444] hover:border-brand-red/50 hover:text-[#111]'
                                                        }`}
                                                >
                                                    <div className="font-bold">{slot.slot_time.slice(0, 5)}</div>
                                                    <div className="text-xs opacity-70">{slot.available_count} {t('checkout.left')}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </fieldset>

                    {/* Order summary */}
                    <div className="card p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[#444] font-bold">{t('checkout.order_total')}</span>
                            <span className="text-2xl font-black text-brand-red">₪{total().toFixed(2)}</span>
                        </div>
                        <p className="text-[#666] text-xs mt-1">{t('checkout.payment_desc')}</p>
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="btn-primary w-full justify-center text-lg py-4"
                    >
                        {mutation.isPending ? t('checkout.submitting') : t('checkout.place_order')}
                    </button>
                </form>
            </div>
        </div>
    );
}

function groupSlotsByDate(slots: PickupSlot[], currentLang: string) {
    const map: Record<string, PickupSlot[]> = {};
    slots.forEach((slot) => {
        if (!map[slot.slot_date]) map[slot.slot_date] = [];
        map[slot.slot_date].push(slot);
    });
    return Object.entries(map).map(([date, slots]) => ({
        date: format(new Date(date + 'T00:00:00'), 'EEEE, MMMM d', { locale: currentLang === 'he' ? he : enUS }),
        slots,
    }));
}
