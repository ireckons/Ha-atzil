export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-brand-black py-10 px-4">
            <div className="max-w-2xl mx-auto animate-fade-in">
                <h1 className="section-title mb-2">מדיניות פרטיות</h1>
                <div className="section-divider w-24" />

                <div className="prose prose-invert max-w-none space-y-6 text-white/70 text-sm leading-relaxed">
                    <p>
                        אנחנו ב<strong className="text-white">האציל</strong> מכבדים את פרטיותכם.
                        מסמך זה מסביר אילו מידע אנו אוספים וכיצד אנו משתמשים בו.
                    </p>

                    <section aria-labelledby="data-heading">
                        <h2 id="data-heading" className="text-lg font-bold text-white mb-2">מידע שאנו אוספים</h2>
                        <p>בעת ביצוע הזמנה, אנו אוספים:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>שם מלא</li>
                            <li>מספר טלפון</li>
                            <li>כתובת אימייל (אופציונלי)</li>
                            <li>פרטי ההזמנה ומועד האיסוף</li>
                        </ul>
                        <p className="mt-2">
                            אנו <strong className="text-white">לא</strong> אוספים מידע על כרטיסי אשראי – התשלום מתבצע פיזית בחנות.
                        </p>
                    </section>

                    <section aria-labelledby="usage-heading">
                        <h2 id="usage-heading" className="text-lg font-bold text-white mb-2">שימוש במידע</h2>
                        <p>המידע משמש אך ורק לצורך:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>עיבוד ואישור ההזמנה</li>
                            <li>יצירת קשר במקרה הצורך</li>
                            <li>ניהול תור האיסוף</li>
                        </ul>
                    </section>

                    <section aria-labelledby="retention-heading">
                        <h2 id="retention-heading" className="text-lg font-bold text-white mb-2">שמירת מידע</h2>
                        <p>
                            אנו שומרים מידע על הזמנות <strong className="text-white">עד 90 יום</strong> לאחר האיסוף,
                            לצרכי שירות לקוחות וניהול עסקי. לאחר מכן המידע נמחק.
                        </p>
                    </section>

                    <section aria-labelledby="rights-heading">
                        <h2 id="rights-heading" className="text-lg font-bold text-white mb-2">זכויותיכם</h2>
                        <p>
                            יש לכם זכות לבקש גישה, תיקון או מחיקה של המידע האישי שלכם.
                            לפנייה: <a href="tel:04-6226677" className="text-brand-red hover:underline">04-6226677</a> או
                            בביקור בחנות.
                        </p>
                    </section>

                    <section aria-labelledby="contact-heading">
                        <h2 id="contact-heading" className="text-lg font-bold text-white mb-2">צור קשר</h2>
                        <address className="not-italic space-y-1">
                            <p>האציל</p>
                            <p>הפלמ"ח 77, צפת</p>
                            <p><a href="tel:04-6226677" className="text-brand-red hover:underline">04-6226677</a></p>
                        </address>
                    </section>

                    <p className="text-white/30 text-xs border-t border-white/10 pt-4">
                        עדכון אחרון: פברואר 2025
                    </p>
                </div>
            </div>
        </div>
    );
}
