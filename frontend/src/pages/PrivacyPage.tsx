export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-brand-black py-10 px-4">
            <div className="max-w-2xl mx-auto animate-fade-in">
                <h1 className="section-title mb-2">Privacy Policy</h1>
                <div className="section-divider w-24" />

                <div className="prose prose-invert max-w-none space-y-6 text-white/70 text-sm leading-relaxed">
                    <p>
                        We at <strong className="text-white">HaAtzil</strong> respect your privacy.
                        This document explains what information we collect and how we use it.
                    </p>

                    <section aria-labelledby="data-heading">
                        <h2 id="data-heading" className="text-lg font-bold text-white mb-2">Information We Collect</h2>
                        <p>When placing an order, we collect:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Full Name</li>
                            <li>Phone Number</li>
                            <li>Email Address (optional)</li>
                            <li>Order details and pickup time</li>
                        </ul>
                        <p className="mt-2">
                            We do <strong className="text-white">not</strong> collect credit card information - payment is processed physically in the store.
                        </p>
                    </section>

                    <section aria-labelledby="usage-heading">
                        <h2 id="usage-heading" className="text-lg font-bold text-white mb-2">Use of Information</h2>
                        <p>The information is used solely for:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Processing and confirming the order</li>
                            <li>Contacting you if necessary</li>
                            <li>Managing the pickup queue</li>
                        </ul>
                    </section>

                    <section aria-labelledby="retention-heading">
                        <h2 id="retention-heading" className="text-lg font-bold text-white mb-2">Data Retention</h2>
                        <p>
                            We keep order information for <strong className="text-white">up to 90 days</strong> after pickup,
                            for customer service and business management purposes. After that, the information is deleted.
                        </p>
                    </section>

                    <section aria-labelledby="rights-heading">
                        <h2 id="rights-heading" className="text-lg font-bold text-white mb-2">Your Rights</h2>
                        <p>
                            You have the right to request access, correction, or deletion of your personal information.
                            To contact us: <a href="tel:04-6226677" className="text-brand-red hover:underline">04-6226677</a> or
                            by visiting the store.
                        </p>
                    </section>

                    <section aria-labelledby="contact-heading">
                        <h2 id="contact-heading" className="text-lg font-bold text-white mb-2">Contact Us</h2>
                        <address className="not-italic space-y-1">
                            <p>HaAtzil</p>
                            <p>Palmach 77, Safed</p>
                            <p><a href="tel:04-6226677" className="text-brand-red hover:underline">04-6226677</a></p>
                        </address>
                    </section>

                    <p className="text-white/30 text-xs border-t border-white/10 pt-4">
                        Last updated: February 2025
                    </p>
                </div>
            </div>
        </div>
    );
}
