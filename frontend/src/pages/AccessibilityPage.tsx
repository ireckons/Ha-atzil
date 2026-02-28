export default function AccessibilityPage() {
    return (
        <div className="min-h-screen bg-brand-black py-10 px-4 pt-24 md:pt-32">
            <div className="max-w-2xl mx-auto animate-fade-in">
                <h1 className="section-title mb-2">Accessibility</h1>
                <div className="section-divider w-24" />

                <div className="prose prose-invert max-w-none space-y-6 text-white/70 text-sm leading-relaxed">
                    <p>
                        At <strong className="text-white">HaAtzil</strong>, we are committed to providing an accessible experience for all our customers, both in-store and online.
                    </p>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">Website Accessibility</h2>
                        <p>We continuously work to improve the accessibility of our website to ensure it is inclusive for everyone. This includes using structured HTML, high contrast colors, and scalable fonts.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">Physical Store Accessibility</h2>
                        <p>Our store in Safed is accessible to wheelchair users, and our staff is always ready to assist any customer who requires help.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-white mb-2">Contact Us</h2>
                        <p>If you encounter any accessibility issues on our website or need assistance, please contact us at <a href="tel:04-6226677" className="text-brand-red hover:underline">04-6226677</a> and we will be happy to assist you.</p>
                    </section>

                    <p className="text-white/30 text-xs border-t border-white/10 pt-4">
                        Last updated: February 2026
                    </p>
                </div>
            </div>
        </div>
    );
}
