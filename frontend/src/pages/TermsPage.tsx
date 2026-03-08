import { useTranslation } from 'react-i18next';

export default function TermsPage() {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-[#F8F9FA] py-10 px-4 pt-24 md:pt-32">
            <div className="max-w-2xl mx-auto animate-fade-in">
                <h1 className="section-title mb-2">{t('terms.title')}</h1>
                <div className="section-divider w-24" />

                <div className="prose max-w-none space-y-6 text-[#555] text-sm leading-relaxed">
                    <p>
                        {t('terms.intro_prefix')}<strong className="text-[#111]">HaAtzil</strong>{t('terms.intro_suffix')}
                    </p>

                    <section>
                        <h2 className="text-lg font-bold text-[#111] mb-2">{t('terms.h_general')}</h2>
                        <p>{t('terms.p_general')}</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#111] mb-2">{t('terms.h_orders')}</h2>
                        <p>{t('terms.p_orders')}</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#111] mb-2">{t('terms.h_pickup')}</h2>
                        <p>{t('terms.p_pickup')}</p>
                    </section>

                    <p className="text-[#666] text-xs border-t border-black/10 pt-4">
                        {t('terms.last_updated')}
                    </p>
                </div>
            </div>
        </div>
    );
}
