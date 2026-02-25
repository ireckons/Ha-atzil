import os

BASE = r"C:\Users\neha8\Desktop\Ha-atzil\frontend\public\images\products"

products = [
    # (filepath, label, emoji_code, price, color_dark, color_accent)
    ("beef/ribeye.jpg",        "Ribeye Steak",      "&#x1F969;", "&#x20AA;189/kg",  "#1a0005", "#8B0000"),
    ("beef/tenderloin.jpg",    "Beef Tenderloin",   "&#x1F969;", "&#x20AA;229/kg",  "#1a0005", "#8B0000"),
    ("beef/chuck_roast.jpg",   "Chuck Roast",       "&#x1FAD5;", "&#x20AA;89/kg",   "#1a0005", "#8B0000"),
    ("beef/chuck_eye.jpg",     "Chuck Eye Roll",    "&#x1F969;", "&#x20AA;119/kg",  "#1a0005", "#8B0000"),
    ("beef/liver.jpg",         "Beef Liver",        "&#x1FAC0;", "&#x20AA;59/kg",   "#1a0005", "#8B0000"),
    ("lamb/lamb_chops.jpg",    "Lamb Chops",        "&#x1F356;", "&#x20AA;149/kg",  "#0d0a00", "#7B4F00"),
    ("lamb/lamb_kebab.jpg",    "Lamb Kebab",        "&#x1F362;", "&#x20AA;79/kg",   "#0d0a00", "#7B4F00"),
    ("lamb/lamb_shoulder.jpg", "Lamb Shoulder",     "&#x1F356;", "&#x20AA;199/kg",  "#0d0a00", "#7B4F00"),
    ("lamb/lamb_leg.jpg",      "Lamb Leg",          "&#x1F356;", "&#x20AA;169/kg",  "#0d0a00", "#7B4F00"),
    ("poultry/chicken_schnitzel.jpg", "Chicken Schnitzel", "&#x1F357;", "&#x20AA;56/kg",  "#0a0800", "#856404"),
    ("poultry/turkey_shawarma.jpg",   "Turkey Shawarma",   "&#x1F32F;", "&#x20AA;69/kg",  "#0a0800", "#856404"),
    ("poultry/whole_chicken.jpg",     "Whole Chicken",     "&#x1F357;", "&#x20AA;48/unit","#0a0800", "#856404"),
    ("poultry/chicken_legs.jpg",      "Chicken Legs",      "&#x1F357;", "&#x20AA;39/kg",  "#0a0800", "#856404"),
    ("poultry/turkey_breast.jpg",     "Turkey Breast",     "&#x1F357;", "&#x20AA;59/kg",  "#0a0800", "#856404"),
    ("prepared/beef_patties.jpg",     "Beef Patties",      "&#x1F354;", "&#x20AA;72/kg",  "#050505", "#4A0010"),
    ("prepared/marinated_ribeye.jpg", "Marinated Ribeye",  "&#x1F969;", "&#x20AA;199/kg", "#050505", "#4A0010"),
    ("prepared/beef_sausages.jpg",    "Beef Sausages",     "&#x1F32D;", "&#x20AA;64/kg",  "#050505", "#4A0010"),
    ("prepared/bone_broth.jpg",       "Bone Broth Kit",    "&#x1F372;", "&#x20AA;45/kg",  "#050505", "#4A0010"),
    ("kosher-special/mehadrin_beef.jpg",  "Mehadrin Beef",   "&#x2721;&#xFE0F;", "&#x20AA;249/kg",  "#020010", "#2D0070"),
    ("kosher-special/mehadrin_lamb.jpg",  "Mehadrin Lamb",   "&#x2721;&#xFE0F;", "&#x20AA;899/unit","#020010", "#2D0070"),
    ("kosher-special/whole_turkey.jpg",   "Holiday Turkey",  "&#x2721;&#xFE0F;", "&#x20AA;289/unit","#020010", "#2D0070"),
]

for rel_path, label, emoji_code, price, color1, color2 in products:
    out_path = os.path.join(BASE, rel_path.replace("/", os.sep))
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="{color2}" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="{color1}"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="45%">
      <stop offset="0%" stop-color="#C8102E" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#C8102E" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur1">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
  </defs>
  <rect width="600" height="600" fill="url(#bg)"/>
  <rect width="600" height="600" fill="url(#glow)"/>
  <!-- Decorative grid lines -->
  <g stroke="rgba(255,255,255,0.04)" stroke-width="1">
    <line x1="150" y1="0" x2="150" y2="600"/><line x1="300" y1="0" x2="300" y2="600"/><line x1="450" y1="0" x2="450" y2="600"/>
    <line x1="0" y1="150" x2="600" y2="150"/><line x1="0" y1="300" x2="600" y2="300"/><line x1="0" y1="450" x2="600" y2="450"/>
  </g>
  <!-- Glow blob -->
  <ellipse cx="300" cy="230" rx="140" ry="120" fill="#C8102E" opacity="0.08" filter="url(#blur1)"/>
  <!-- Outer circle ring -->
  <circle cx="300" cy="250" r="130" fill="rgba(0,0,0,0.5)" stroke="#C8102E" stroke-width="2" stroke-opacity="0.5"/>
  <circle cx="300" cy="250" r="122" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
  <!-- Product emoji (unicode reference) -->
  <text x="300" y="295" text-anchor="middle" font-size="88" font-family="Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif">{emoji_code}</text>
  <!-- Divider -->
  <line x1="70" y1="395" x2="530" y2="395" stroke="#C8102E" stroke-width="1.5" stroke-opacity="0.65"/>
  <!-- Product name -->
  <text x="300" y="435" text-anchor="middle" font-size="30" font-weight="700" font-family="Segoe UI, Arial, sans-serif" fill="white" letter-spacing="0.5">{label}</text>
  <!-- Price -->
  <text x="300" y="472" text-anchor="middle" font-size="22" font-family="Segoe UI, Arial, sans-serif" fill="#C8102E" font-weight="600">{price}</text>
  <!-- Kosher badge background -->
  <rect x="195" y="498" width="210" height="32" rx="16" fill="rgba(0,80,0,0.35)" stroke="rgba(74,222,128,0.5)" stroke-width="1.2"/>
  <text x="300" y="519" text-anchor="middle" font-size="14" font-family="Segoe UI, Arial, sans-serif" fill="#4ADE80" font-weight="600" letter-spacing="1.5">GLATT KOSHER</text>
  <!-- Corner decorations -->
  <rect x="20" y="20" width="30" height="2" fill="#C8102E" opacity="0.5"/>
  <rect x="20" y="20" width="2" height="30" fill="#C8102E" opacity="0.5"/>
  <rect x="550" y="20" width="30" height="2" fill="#C8102E" opacity="0.5"/>
  <rect x="578" y="20" width="2" height="30" fill="#C8102E" opacity="0.5"/>
  <rect x="20" y="578" width="30" height="2" fill="#C8102E" opacity="0.5"/>
  <rect x="20" y="550" width="2" height="30" fill="#C8102E" opacity="0.5"/>
  <rect x="550" y="578" width="30" height="2" fill="#C8102E" opacity="0.5"/>
  <rect x="578" y="550" width="2" height="30" fill="#C8102E" opacity="0.5"/>
</svg>'''

    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(svg)
    print(f"Created: {rel_path}")

print(f"\nDone! {len(products)} product images created.")
