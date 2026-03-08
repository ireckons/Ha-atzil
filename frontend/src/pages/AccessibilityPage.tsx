import { useTranslation } from 'react-i18next';

export default function AccessibilityPage() {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-[#F8F9FA] py-10 px-4 pt-24 md:pt-32">
            <div className="max-w-2xl mx-auto animate-fade-in">
                <h1 className="section-title mb-2">{t('access.title')}</h1>
                <div className="section-divider w-24" />

                <div className="prose max-w-none space-y-6 text-[#555] text-sm leading-relaxed">
                    <p>
                        {t('access.intro_prefix')}<strong className="text-[#111]">HaAtzil</strong>{t('access.intro_suffix')}
                    </p>

                    <section>
                        <h2 className="text-lg font-bold text-[#111] mb-2">{t('access.h_web')}</h2>
                        <p>{t('access.p_web')}</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#111] mb-2">{t('access.h_store')}</h2>
                        <p>{t('access.p_store')}</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#111] mb-2">{t('access.h_contact')}</h2>
                        <p>{t('access.p_contact_prefix')}<a href="tel:04-6226677" className="text-brand-red hover:underline" dir="ltr">04-6226677</a>{t('access.p_contact_suffix')}</p>
                    </section>

                    <p className="text-[#666] text-xs border-t border-black/10 pt-4">
                        {t('access.last_updated')}
                    </p>
                </div>
            </div>
        </div>
    );
}
