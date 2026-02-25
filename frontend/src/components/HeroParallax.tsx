export default function HeroParallax() {
    return (
        <section className="relative w-full overflow-hidden bg-[#0c0c0c] min-h-[500px] h-[500px]">
            {/* ── Background Pattern ── */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        {/* Perfect replica of the poster's dense icon grid */}
                        <pattern id="butcherPattern" x="0" y="0" width="400" height="200" patternUnits="userSpaceOnUse">
                            {/* Row 1 */}
                            <g transform="translate(0, 10)">
                                <image href="/images/parallax/olive.svg" x="20" y="30" width="25" height="25" opacity="0.6" />
                                <image href="/images/parallax/bull-head.svg" x="90" y="60" width="70" height="50" opacity="0.85" />
                                <image href="/images/parallax/grill.svg" x="210" y="20" width="35" height="35" opacity="0.6" />
                                <image href="/images/parallax/bull-head.svg" x="290" y="60" width="70" height="50" opacity="0.85" />
                            </g>
                            {/* Row 2 */}
                            <g transform="translate(0, 110)">
                                <image href="/images/parallax/wine-glass.svg" x="50" y="20" width="30" height="30" opacity="0.6" />
                                <image href="/images/parallax/bull-head.svg" x="-20" y="60" width="70" height="50" opacity="0.85" />
                                <image href="/images/parallax/bull-head.svg" x="190" y="60" width="70" height="50" opacity="0.85" />
                                <image href="/images/parallax/steak.svg" x="120" y="10" width="40" height="40" opacity="0.6" />
                                <image href="/images/parallax/bull-head.svg" x="390" y="60" width="70" height="50" opacity="0.85" />
                                <image href="/images/parallax/sausage.svg" x="290" y="20" width="45" height="45" opacity="0.6" />
                            </g>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#butcherPattern)" />
                </svg>
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
                                 L 0 300 Z" fill="#141414" />

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
                                 L 2000 70" stroke="#E31C23" strokeWidth="5" fill="none" strokeLinejoin="round" />

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
                                 L 2000 230" stroke="#E31C23" strokeWidth="5" fill="none" strokeLinejoin="round" />
                    </svg>

                    {/* Foreground Content Wrapper (Absolute pixel placements within the 300px height) */}
                    <div className="absolute w-full max-w-[1200px] h-[300px] z-20 mx-auto">

                        {/* Bull Logo - centered and intersecting the top flat red plateau */}
                        <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 flex justify-center z-30">
                            <img src="/bull-silhouette.svg" alt="Bull Logo" className="w-[60px]" />
                        </div>

                        {/* Since 2005 - inside the top bump, just below the plateau */}
                        <div className="absolute top-[35px] w-full flex items-center justify-center gap-2 z-20">
                            <svg width="35" height="4" viewBox="0 0 40 4" fill="none"><path d="M40,2 L0,2" stroke="#fff" opacity="0.8" strokeWidth="1" /></svg>
                            <span className="text-[#E31C23] font-serif italic text-[12px] tracking-wider font-bold">since 2005</span>
                            <svg width="35" height="4" viewBox="0 0 40 4" fill="none"><path d="M0,2 L40,2" opacity="0.8" stroke="#fff" strokeWidth="1" /></svg>
                        </div>

                        {/* Main "Ha-atzil" Logo - huge, stretched, perfectly centered inside the dark space */}
                        <div className="absolute top-[80px] w-full flex justify-center z-20">
                            <h1 className="text-white text-[120px] font-bold leading-none tracking-tight block"
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    transform: 'scaleY(1.3)',
                                    textShadow: '0 4px 10px rgba(0,0,0,0.5)'
                                }}>
                                האציל
                            </h1>
                        </div>

                        {/* ── Hebrew Text Placements (Exactly matching the poster's RTL layout & bump depths) ── */}

                        {/* Right Text (Address) - sits safely above the y=230 straight line */}
                        <div className="absolute top-[195px] right-[40px] md:right-[150px] w-[300px] text-white font-sans text-[12px] md:text-[14px] font-bold tracking-[0.1em] text-right z-20">
                            הפלמ"ח 77 צפת // 04-6226677
                        </div>

                        {/* Center Red Text (Subtitle) - rests DEEP inside the bottom bump plateau (y=290 bounds) */}
                        <div className="absolute top-[255px] left-1/2 -translate-x-1/2 w-[300px] text-[#E31C23] font-hebrew font-bold text-[14px] md:text-[15px] tracking-wide text-center z-20 whitespace-nowrap">
                            בשרים שמכבדים אירוח
                        </div>

                        {/* Left Text (Mehadrin) - sits safely above the y=230 straight line */}
                        <div className="absolute top-[190px] left-[40px] md:left-[150px] w-[300px] text-white font-hebrew text-[20px] md:text-[24px] font-bold tracking-widest text-left z-20">
                            למהדרין
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
