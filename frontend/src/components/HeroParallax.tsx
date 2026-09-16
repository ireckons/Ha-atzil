import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HeroParallax() {
    const { t } = useTranslation();
    return (
        <section className="relative w-full overflow-hidden bg-[#1A1A1A] min-h-[500px] h-[500px]">
            {/* ── Background Banners ── */}
            <div className="absolute inset-0 z-0 pointer-events-none flex flex-col">
                {/* Upper banner */}
                {/* Upper banner — mobile uses dedicated SVG, desktop uses original */}
                <img
                    src="/images/parallax/mobile-preview banner1.svg"
                    alt=""
                    className="md:hidden w-full h-1/2 object-contain object-top"
                />
                <img
                    src="/images/parallax/banner1.svg"
                    alt=""
                    className="hidden md:block w-full h-1/2 object-cover object-top"
                />
                {/* Lower banner */}
                <img
                    src="/images/parallax/banner2.svg"
                    alt=""
                    className="w-full h-1/2 object-cover object-bottom"
                />
            </div>

            {/* ── Main Layout Container ── */}
            <div className="absolute inset-0 flex items-center justify-center">

                {/* 
                  The exact sizing wrapper. 
                  h-[300px] perfectly matches our 2000x300 SVG viewBox 
                  so SVG coordinate Y=1 is exactly 1 screen pixel!
                */}
                <div className="relative w-full h-[300px] z-10 flex flex-col items-center overflow-hidden">

                    {/* The complex red border SVG overlay mapping exactly to the poster's rigid bracket shapes */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" preserveAspectRatio="xMidYMid slice" viewBox="0 0 2000 300">
                        {/* 
                            Black fill for the badge, masking the background pattern cleanly inside the curve lines.
                            Top curve rises to y=10 with straight ramp segments.
                            The bottom section extends strictly down to y=300 to block the pattern below the bottom line entirely!
                        */}
                        <path d="
                                 M 0 70 
                                 L 730 70 
                                 L 760 50 
                                 L 830 50 
                                 L 870 10 
                                 L 1130 10 
                                 L 1170 50 
                                 L 1240 50 
                                 L 1270 70 
                                 L 2000 70 
                                 L 2000 300 
                                 L 0 300 Z" fill="#1A1A1A" />

                        {/* Top Red Line (geometric stair-step bump upwards) */}
                        <path d="
                                 M 0 70 
                                 L 730 70 
                                 L 760 50 
                                 L 830 50 
                                 C 850 30, 860 10, 870 10 
                                 L 1130 10 
                                 C 1140 10, 1150 30, 1170 50 
                                 L 1240 50 
                                 L 1270 70 
                                 L 2000 70" stroke="#B21B21" strokeWidth="5" fill="none" strokeLinejoin="round" />

                        {/* Bottom Red Line (geometric stair-step bump downwards) */}
                        <path d="
                                 M 0 230 
                                 L 730 230 
                                 L 760 250 
                                 L 830 250 
                                 C 850 270, 860 290, 870 290 
                                 L 1130 290 
                                 C 1140 290, 1150 270, 1170 250 
                                 L 1240 250 
                                 L 1270 230 
                                 L 2000 230" stroke="#B21B21" strokeWidth="5" fill="none" strokeLinejoin="round" />
                    </svg>

                    {/* Foreground Content Wrapper (Absolute pixel placements within the 300px height) */}
                    <div className="absolute w-full max-w-[1200px] h-[300px] z-20 mx-auto">

                        {/* Main "Ha-atzil" Logo */}
                        <div className="absolute top-[2px] w-full flex justify-center z-20 pointer-events-none px-4 md:px-0">
                            <img
                                src="/logo-haatzil.webp"
                                alt="האציל Logo"
                                className="w-full max-w-[320px] md:max-w-none h-[210px] md:h-[250px] object-contain mix-blend-lighten opacity-95 contrast-125 scale-[1.375]"
                            />
                        </div>

                        {/* ── Hebrew Text Placements (Always Hebrew, Right side for Mehadrin) ── */}

                        {/* Right Text */}
                        <div dir="rtl" className="absolute top-[185px] right-0 md:right-[150px] w-full md:w-[300px] hidden md:block text-white/90 font-hebrew text-[22px] font-bold tracking-widest text-right z-20">
                            {t('hero.hero_right', { lng: 'he' })}
                        </div>

                        {/* Left Text */}
                        <div dir="rtl" className="absolute top-[185px] left-0 md:left-[150px] w-full md:w-[300px] hidden md:block text-white/90 font-hebrew text-[22px] font-bold tracking-widest text-left z-20">
                            {t('hero.hero_left', { lng: 'he' })}
                        </div>

                        {/* Mobile Text (combined) */}
                        <div dir="rtl" className="absolute top-[242px] right-0 w-full md:hidden text-white/90 font-hebrew text-[15px] font-bold tracking-widest text-center z-20">
                            {t('hero.mehadrin', { lng: 'he' })}
                        </div>

                        {/* Center Red Text (Subtitle) */}
                        <div dir="rtl" className="absolute top-[218px] md:top-[255px] left-1/2 -translate-x-1/2 w-full md:w-[300px] text-[#B21B21] font-hebrew font-bold text-[13px] md:text-[15px] tracking-wide text-center z-20 whitespace-nowrap">
                            {t('hero.subtitle', { lng: 'he' })}
                        </div>

                    </div>
                </div>

                {/* Explore Catalog Button */}
                <div className="absolute bottom-10 z-30 w-full flex justify-center" dir="rtl">
                    <Link to="/catalog" className="px-8 py-3 bg-[#B21B21] text-white text-sm font-bold tracking-[0.1em] hover:bg-[#8a1318] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 rounded border border-transparent hover:border-white/20">
                        {t('hero.explore_catalog', { lng: 'he' })}
                    </Link>
                </div>

            </div>
        </section>
    );
}
