import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useOrderStore } from '../store/authStore';
import { format } from 'date-fns';

export default function ConfirmationPage() {
    const order = useOrderStore((s) => s.lastOrder);
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const content = printRef.current;
        if (!content) return;
        const win = window.open('', '_blank');
        if (!win) return;
        win.document.write(`
      <html lang="he" dir="rtl">
      <head>
        <meta charset="UTF-8"/>
        <title>תלוש איסוף – ${order?.order_number}</title>
        <style>
          body { font-family: 'Heebo', Arial, sans-serif; direction: rtl; padding: 24px; color: #000; }
          h1 { font-size: 28px; margin-bottom: 4px; }
          .divider { border-top: 2px solid #C8102E; margin: 12px 0; }
          .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #ccc; }
          .label { color: #555; font-size: 13px; }
          .value { font-weight: bold; }
          .total { font-size: 20px; font-weight: 900; color: #C8102E; margin-top: 16px; }
          .footer { margin-top: 24px; text-align: center; font-size: 12px; color: #888; }
        </style>
      </head>
      <body>${content.innerHTML}</body>
      </html>
    `);
        win.document.close();
        win.print();
    };

    if (!order) {
        return (
            <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center gap-6">
                <p className="text-white/50">לא נמצאה הזמנה</p>
                <Link to="/" className="btn-primary">חזרה לדף הבית</Link>
            </div>
        );
    }

    const pickupDate = order.slot_date
        ? new Date(order.slot_date + 'T00:00:00').toLocaleDateString('he-IL', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })
        : '';

    return (
        <div className="min-h-screen bg-brand-black py-10 px-4">
            <div className="max-w-xl mx-auto animate-slide-up">
                {/* Success banner */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 rounded-full bg-emerald-900/30 border-2 border-emerald-500/50 flex items-center justify-center mx-auto mb-4 text-4xl" aria-hidden="true">
                        ✅
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">ההזמנה התקבלה!</h1>
                    <p className="text-white/60">נשמח לראותך בזמן האיסוף</p>
                </div>

                {/* Printable slip */}
                <div ref={printRef} className="card p-6 mb-6">
                    <div className="text-center mb-4">
                        <p className="text-xs text-white/40 uppercase tracking-widest">האציל – since 2005</p>
                        <p className="text-xs text-white/30">בשרים שמכבדים אירוח · הפלמ"ח 77, צפת</p>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-brand-red to-transparent mb-4" />

                    <div className="space-y-3 mb-4">
                        <InfoRow label="מספר הזמנה" value={order.order_number} highlight />
                        <InfoRow label="שם" value={order.customer_name} />
                        <InfoRow label="טלפון" value={order.customer_phone} />
                        <InfoRow label="תאריך איסוף" value={pickupDate} />
                        <InfoRow label="שעת איסוף" value={order.slot_time?.slice(0, 5) ?? ''} />
                        {order.notes && <InfoRow label="הערות" value={order.notes} />}
                    </div>

                    <div className="h-px bg-white/10 mb-4" />

                    {/* Items */}
                    <div className="space-y-2 mb-4">
                        <p className="text-xs text-white/40 uppercase tracking-wider mb-2">פרטי ההזמנה</p>
                        {(order.items ?? []).map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                                <span className="text-white/80">
                                    {item.name_he} {item.weight_g ? `(${item.weight_g}g)` : ''} × {item.quantity}
                                </span>
                                <span className="text-white font-semibold">₪{Number(item.subtotal_nis).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-white/10 mb-4" />
                    <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-lg">סה"כ לתשלום</span>
                        <span className="text-2xl font-black text-brand-red">₪{Number(order.total_nis).toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-white/30 mt-2 text-center">תשלום במזומן/כרטיס בחנות בעת האיסוף</p>

                    <div className="h-px bg-gradient-to-r from-transparent via-brand-red to-transparent mt-4" />
                    <p className="text-center text-xs text-white/30 mt-3">הפלמ"ח 77, צפת · 04-6226677</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={handlePrint} className="btn-secondary flex-1 justify-center no-print">
                        🖨️ הדפס תלוש
                    </button>
                    <Link to="/" className="btn-primary flex-1 justify-center no-print">
                        ← חזרה לדף הבית
                    </Link>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="flex items-center justify-between py-1.5 border-b border-white/5">
            <span className="text-white/50 text-sm">{label}</span>
            <span className={`text-sm font-bold ${highlight ? 'text-brand-red text-base' : 'text-white'}`}>{value}</span>
        </div>
    );
}
