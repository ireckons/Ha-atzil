export default function TermsPage() {
    return (
        <div className="min-h-screen bg-brand-black py-10 px-4 pt-24 md:pt-32">
            <div className="max-w-2xl mx-auto animate-fade-in">
                <h1 className="section-title mb-2">Terms and Conditions</h1>
                <div className="section-divider w-24" />

                <div className="prose prose-invert max-w-none space-y-6 text-white/70 text-sm leading-relaxed">
                    <p>
                        Welcome to <strong className="text-white">HaAtzil</strong>.
                        These terms and conditions govern your use of our website and services.
                    </p>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">General</h2>
                        <p>By using this website, you agree to these terms. We reserve the right to update or modify these terms at any time.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">Orders & Products</h2>
                        <p>All products are subject to availability. Prices may change without notice. We reserve the right to refuse or cancel any order for any reason. Images are for illustration purposes only.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">Pick-up Only</h2>
                        <p>We currently only support pick-up orders. Delivery is not available. Please ensure you can pick up your order during our business hours.</p>
                    </section>

                    <p className="text-white/30 text-xs border-t border-white/10 pt-4">
                        Last updated: February 2026
                    </p>
                </div>
            </div>
        </div>
    );
}
