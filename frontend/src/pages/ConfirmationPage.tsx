import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useOrderStore } from '../store/authStore';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function ConfirmationPage() {
    const { t, i18n } = useTranslation();
    const order = useOrderStore((s) => s.lastOrder);
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const content = printRef.current;
        if (!content) return;
        const win = window.open('', '_blank');
        if (!win) return;
        win.document.write(`
      <html lang="${i18n.language}" dir="${i18n.language === 'he' ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8"/>
        <title>${t('confirmation.pickup_slip')} – ${order?.order_number}</title>
        <style>
          body { font-family: 'Heebo', Arial, sans-serif; direction: ${i18n.language === 'he' ? 'rtl' : 'ltr'}; padding: 24px; color: #000; }
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
            <div className="min-h-screen bg-transparent flex flex-col items-center justify-center gap-6">
                <p className="text-[#666]">{t('confirmation.not_found')}</p>
                <Link to="/" className="btn-primary">{t('confirmation.back_to_home')}</Link>
            </div>
        );
    }

    const pickupDate = order.slot_date
        ? new Date(order.slot_date + 'T00:00:00').toLocaleDateString(i18n.language === 'he' ? 'he-IL' : 'en-US', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })
        : '';

    return (
        <div className="min-h-screen bg-transparent py-10 px-4">
            <div className="max-w-xl mx-auto animate-slide-up">
                {/* Success banner */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 text-4xl" aria-hidden="true">
                        ✅
                    </div>
                    <h1 className="text-3xl font-black text-[#111] mb-2">{t('confirmation.title')}</h1>
                    <p className="text-[#555]">{t('confirmation.subtitle')}</p>
                </div>

                {/* Printable slip */}
                <div ref={printRef} className="card p-6 mb-6">
                    <div className="text-center mb-4">
                        <p className="text-xs text-[#555] uppercase tracking-widest">{t('confirmation.brand_slogan')}</p>
                        <p className="text-xs text-[#888]">{t('confirmation.brand_desc')}</p>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-brand-red to-transparent mb-4" />

                    <div className="space-y-3 mb-4">
                        <InfoRow label={t('confirmation.order_number')} value={order.order_number} highlight />
                        <InfoRow label={t('confirmation.name')} value={order.customer_name} />
                        <InfoRow label={t('confirmation.phone')} value={order.customer_phone} />
                        <InfoRow label={t('confirmation.pickup_date')} value={pickupDate} />
                        <InfoRow label={t('confirmation.pickup_time')} value={order.slot_time?.slice(0, 5) ?? ''} />
                        {order.notes && <InfoRow label={t('confirmation.notes')} value={order.notes} />}
                    </div>

                    <div className="h-px bg-black/10 mb-4" />

                    {/* Items */}
                    <div className="space-y-2 mb-4">
                        <p className="text-xs text-[#666] uppercase tracking-wider mb-2">{t('confirmation.order_details')}</p>
                        {(order.items ?? []).map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                                <span className="text-[#333]">
                                    {i18n.language === 'he' ? (item as any).name_he || item.name_en : item.name_en} {item.weight_g ? `(${item.weight_g}g)` : ''} × {item.quantity}
                                </span>
                                <span className="text-[#111] font-semibold">₪{Number(item.subtotal_nis).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-black/10 mb-4" />
                    <div className="flex items-center justify-between">
                        <span className="text-[#111] font-bold text-lg">{t('confirmation.total_to_pay')}</span>
                        <span className="text-2xl font-black text-brand-red">₪{Number(order.total_nis).toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-[#888] mt-2 text-center">{t('confirmation.payment_info')}</p>

                    <div className="h-px bg-gradient-to-r from-transparent via-brand-red to-transparent mt-4" />
                    <p className="text-center text-xs text-[#888] mt-3">{t('confirmation.contact_info')}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={handlePrint} className="btn-secondary flex-1 justify-center no-print">
                        🖨️ {t('confirmation.print')}
                    </button>
                    <Link to="/" className="btn-primary flex-1 justify-center no-print">
                        ← {t('confirmation.back_to_home')}
                    </Link>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="flex items-center justify-between py-1.5 border-b border-black/5">
            <span className="text-[#666] text-sm">{label}</span>
            <span className={`text-sm font-bold ${highlight ? 'text-brand-red text-base' : 'text-[#111]'}`}>{value}</span>
        </div>
    );
}
