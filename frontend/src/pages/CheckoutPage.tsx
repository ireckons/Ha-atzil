import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { slotApi, orderApi, type PickupSlot } from '../api/client';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/authStore';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { items, total, clearCart } = useCartStore();
    const setLastOrder = useOrderStore((s) => s.setLastOrder);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedSlot, setSelectedSlot] = useState<string>('');

    const { data: slots, isLoading: slotsLoading } = useQuery({
        queryKey: ['pickup-slots'],
        queryFn: () => slotApi.list(),
    });

    const mutation = useMutation({
        mutationFn: orderApi.create,
        onSuccess: (order) => {
            setLastOrder(order);
            clearCart();
            navigate('/confirmation');
        },
        onError: (err: unknown) => {
            const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'שגיאה בשליחת ההזמנה';
            toast.error(msg);
        },
    });

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlot) { toast.error('יש לבחור מועד איסוף'); return; }
        if (!name.trim()) { toast.error('יש להזין שם מלא'); return; }
        if (!phone.trim()) { toast.error('יש להזין מספר טלפון'); return; }

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
        <div className="min-h-screen bg-brand-black py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="section-title mb-2">פרטי איסוף</h1>
                <div className="section-divider w-24" />

                {/* Pickup-only notice */}
                <div className="mb-6 p-4 rounded-xl bg-brand-red/10 border border-brand-red/30 flex items-start gap-3" role="note">
                    <span className="text-brand-red text-xl flex-shrink-0" aria-hidden="true">ℹ️</span>
                    <p className="text-brand-red/90 text-sm font-medium">
                        <strong>קיים איסוף עצמי בלבד – אין משלוח.</strong><br />
                        הבשר יהיה מוכן לאיסוף בחנות בהפלמ"ח 77, צפת.
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* Customer details */}
                    <fieldset className="card p-6">
                        <legend className="text-lg font-bold text-white mb-4">פרטים אישיים</legend>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1">שם מלא *</label>
                                <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                    placeholder="ישראל ישראלי" className="input" autoComplete="name" />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-white/70 mb-1">טלפון *</label>
                                <input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                                    placeholder="052-0000000" className="input" autoComplete="tel" dir="ltr" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">אימייל (אופציונלי)</label>
                                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com" className="input" autoComplete="email" dir="ltr" />
                            </div>
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-white/70 mb-1">הערות</label>
                                <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                                    placeholder="בקשות מיוחדות, פירוט נתחים וכד'..." className="input resize-none" />
                            </div>
                        </div>
                    </fieldset>

                    {/* Pickup slot */}
                    <fieldset className="card p-6">
                        <legend className="text-lg font-bold text-white mb-4">מועד איסוף *</legend>
                        {slotsLoading ? (
                            <div className="space-y-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />
                                ))}
                            </div>
                        ) : !slots || slots.length === 0 ? (
                            <p className="text-white/50 text-sm">אין מועדי איסוף זמינים בימים הקרובים. אנא צור קשר עם החנות.</p>
                        ) : (
                            <div className="space-y-2 max-h-72 overflow-y-auto" role="radiogroup" aria-label="בחר מועד איסוף">
                                {groupSlotsByDate(slots).map(({ date, slots: daySlots }) => (
                                    <div key={date}>
                                        <p className="text-xs text-white/40 mb-1 mt-3 uppercase tracking-wider">{date}</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {daySlots.map((slot: PickupSlot) => (
                                                <button
                                                    key={slot.id}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={selectedSlot === slot.id}
                                                    onClick={() => setSelectedSlot(slot.id)}
                                                    className={`p-3 rounded-lg text-sm font-medium border transition-all text-center ${selectedSlot === slot.id
                                                            ? 'bg-brand-red border-brand-red text-white'
                                                            : 'border-white/20 text-white/70 hover:border-brand-red/50 hover:text-white'
                                                        }`}
                                                >
                                                    <div className="font-bold">{slot.slot_time.slice(0, 5)}</div>
                                                    <div className="text-xs opacity-70">נותרו {slot.available_count}</div>
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
                            <span className="text-white/70">סה"כ הזמנה</span>
                            <span className="text-2xl font-black text-brand-red">₪{total().toFixed(2)}</span>
                        </div>
                        <p className="text-white/30 text-xs mt-1">תשלום נעשה בחנות בעת האיסוף</p>
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="btn-primary w-full justify-center text-lg py-4"
                    >
                        {mutation.isPending ? 'שולח הזמנה…' : '✅ שלח הזמנה'}
                    </button>
                </form>
            </div>
        </div>
    );
}

function groupSlotsByDate(slots: PickupSlot[]) {
    const map: Record<string, PickupSlot[]> = {};
    slots.forEach((slot) => {
        if (!map[slot.slot_date]) map[slot.slot_date] = [];
        map[slot.slot_date].push(slot);
    });
    return Object.entries(map).map(([date, slots]) => ({
        date: format(new Date(date + 'T00:00:00'), 'EEEE, d בMMMM', { locale: he }),
        slots,
    }));
}
