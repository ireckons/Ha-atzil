// Flag SVGs as inline data URIs for flag strip component
export const Flags = {
    USA: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" role="img" aria-label="דגל ארצות הברית">
            <rect width="60" height="40" fill="#B22234" />
            <rect y="3" width="60" height="3" fill="#fff" />
            <rect y="9" width="60" height="3" fill="#fff" />
            <rect y="15" width="60" height="3" fill="#fff" />
            <rect y="21" width="60" height="3" fill="#fff" />
            <rect y="27" width="60" height="3" fill="#fff" />
            <rect y="33" width="60" height="3" fill="#fff" />
            <rect width="24" height="21" fill="#3C3B6E" />
            {/* Stars simplified */}
            {[...Array(9)].map((_, i) => (
                <circle key={i} cx={3 + (i % 5) * 4.5} cy={2.5 + Math.floor(i / 5) * 3.5} r="0.8" fill="#fff" />
            ))}
        </svg>
    ),
    Morocco: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" role="img" aria-label="דגל מרוקו">
            <rect width="60" height="40" fill="#C1272D" />
            <polygon points="30,12 32.5,20 40,20 34,24.5 36.5,32.5 30,28 23.5,32.5 26,24.5 20,20 27.5,20"
                fill="none" stroke="#006233" strokeWidth="1.5" />
        </svg>
    ),
    France: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" role="img" aria-label="דגל צרפת">
            <rect width="20" height="40" fill="#002395" />
            <rect x="20" width="20" height="40" fill="#fff" />
            <rect x="40" width="20" height="40" fill="#ED2939" />
        </svg>
    ),
    Israel: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" role="img" aria-label="דגל ישראל">
            <rect width="60" height="40" fill="#fff" />
            <rect y="7" width="60" height="7" fill="#0038b8" />
            <rect y="26" width="60" height="7" fill="#0038b8" />
            {/* Star of David */}
            <polygon points="30,14 34,21 26,21" fill="none" stroke="#0038b8" strokeWidth="1.5" />
            <polygon points="30,26 34,19 26,19" fill="none" stroke="#0038b8" strokeWidth="1.5" />
        </svg>
    ),
};

export default function FlagStrip() {
    return (
        <div className="border-t border-white/10 py-6 mt-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <p className="text-xs text-white/50 mb-4 tracking-widest uppercase">הדגלים המוצגים בחנות</p>
                <div className="flex items-center justify-center gap-6 flex-wrap">
                    {Object.entries(Flags).map(([name, flag]) => (
                        <div key={name} className="flex flex-col items-center gap-1 group">
                            <div className="w-14 h-9 rounded overflow-hidden shadow-lg ring-1 ring-white/10 group-hover:ring-brand-red/50 transition-all">
                                {flag}
                            </div>
                            <span className="text-xs text-white/40 group-hover:text-white/70 transition-colors">{name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
