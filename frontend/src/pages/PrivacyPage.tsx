import { useTranslation } from 'react-i18next';

export default function PrivacyPage() {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-[#F8F9FA] py-10 px-4 pt-24 md:pt-32">
            <div className="max-w-2xl mx-auto animate-fade-in">
                <h1 className="section-title mb-2">{t('privacy.title')}</h1>
                <div className="section-divider w-24" />

                <div className="prose max-w-none space-y-6 text-[#555] text-sm leading-relaxed">
                    <p>
                        {t('privacy.intro_prefix')}<strong className="text-[#111]">HaAtzil</strong>{t('privacy.intro_suffix')}
                    </p>

                    <section aria-labelledby="data-heading">
                        <h2 id="data-heading" className="text-lg font-bold text-[#111] mb-2">{t('privacy.info_heading')}</h2>
                        <p>{t('privacy.info_p1')}</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>{t('privacy.info_li1')}</li>
                            <li>{t('privacy.info_li2')}</li>
                            <li>{t('privacy.info_li3')}</li>
                            <li>{t('privacy.info_li4')}</li>
                        </ul>
                        <p className="mt-2">
                            {t('privacy.info_p2a')}<strong className="text-[#111]">{t('privacy.info_p2_not')}</strong>{t('privacy.info_p2b')}
                        </p>
                    </section>

                    <section aria-labelledby="usage-heading">
                        <h2 id="usage-heading" className="text-lg font-bold text-[#111] mb-2">{t('privacy.use_heading')}</h2>
                        <p>{t('privacy.use_p')}</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>{t('privacy.use_li1')}</li>
                            <li>{t('privacy.use_li2')}</li>
                            <li>{t('privacy.use_li3')}</li>
                        </ul>
                    </section>

                    <section aria-labelledby="retention-heading">
                        <h2 id="retention-heading" className="text-lg font-bold text-[#111] mb-2">{t('privacy.retain_heading')}</h2>
                        <p>
                            {t('privacy.retain_p1')}<strong className="text-[#111]">{t('privacy.retain_strong')}</strong>{t('privacy.retain_p2')}
                        </p>
                    </section>

                    <section aria-labelledby="rights-heading">
                        <h2 id="rights-heading" className="text-lg font-bold text-[#111] mb-2">{t('privacy.rights_heading')}</h2>
                        <p>
                            {t('privacy.rights_p1')}<a href="tel:04-6226677" className="text-brand-red hover:underline" dir="ltr">04-6226677</a>
                            {t('privacy.rights_p2')}
                        </p>
                    </section>

                    <section aria-labelledby="contact-heading">
                        <h2 id="contact-heading" className="text-lg font-bold text-[#111] mb-2">{t('privacy.contact_heading')}</h2>
                        <address className="not-italic space-y-1">
                            <p>HaAtzil</p>
                            <p>Palmach 77, Safed</p>
                            <p><a href="tel:04-6226677" className="text-brand-red hover:underline" dir="ltr">04-6226677</a></p>
                        </address>
                    </section>

                    <p className="text-[#666] text-xs border-t border-black/10 pt-4">
                        {t('privacy.last_updated')}
                    </p>
                </div>
            </div>
        </div>
    );
}
