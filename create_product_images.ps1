
$base = "C:\Users\neha8\Desktop\Ha-atzil\frontend\public\images\products"

$products = @(
  @{ path="beef\ribeye.jpg";          emoji="🥩"; name="Ribeye Steak";          price="₪189/kg"; color1="#1a0005"; color2="#8B0000" },
  @{ path="beef\tenderloin.jpg";      emoji="🥩"; name="Beef Tenderloin";        price="₪229/kg"; color1="#1a0005"; color2="#8B0000" },
  @{ path="beef\chuck_roast.jpg";     emoji="🫕"; name="Chuck Roast";            price="₪89/kg";  color1="#1a0005"; color2="#8B0000" },
  @{ path="beef\chuck_eye.jpg";       emoji="🥩"; name="Chuck Eye Roll";         price="₪119/kg"; color1="#1a0005"; color2="#8B0000" },
  @{ path="beef\liver.jpg";           emoji="🫀"; name="Beef Liver";             price="₪59/kg";  color1="#1a0005"; color2="#8B0000" },
  @{ path="lamb\lamb_chops.jpg";      emoji="🍖"; name="Lamb Chops";             price="₪149/kg"; color1="#0d0a00"; color2="#7B4F00" },
  @{ path="lamb\lamb_kebab.jpg";      emoji="🍢"; name="Lamb Kebab";             price="₪79/kg";  color1="#0d0a00"; color2="#7B4F00" },
  @{ path="lamb\lamb_shoulder.jpg";   emoji="🍖"; name="Lamb Shoulder";          price="₪199/kg"; color1="#0d0a00"; color2="#7B4F00" },
  @{ path="lamb\lamb_leg.jpg";        emoji="🍖"; name="Lamb Leg";               price="₪169/kg"; color1="#0d0a00"; color2="#7B4F00" },
  @{ path="poultry\chicken_schnitzel.jpg"; emoji="🍗"; name="Chicken Schnitzel"; price="₪56/kg";  color1="#0a0800"; color2="#856404" },
  @{ path="poultry\turkey_shawarma.jpg";   emoji="🌯"; name="Turkey Shawarma";   price="₪69/kg";  color1="#0a0800"; color2="#856404" },
  @{ path="poultry\whole_chicken.jpg";     emoji="🍗"; name="Whole Chicken";     price="₪48/unit";color1="#0a0800"; color2="#856404" },
  @{ path="poultry\chicken_legs.jpg";      emoji="🍗"; name="Chicken Legs";      price="₪39/kg";  color1="#0a0800"; color2="#856404" },
  @{ path="poultry\turkey_breast.jpg";     emoji="🍗"; name="Turkey Breast";     price="₪59/kg";  color1="#0a0800"; color2="#856404" },
  @{ path="prepared\beef_patties.jpg";     emoji="🍔"; name="Beef Patties";      price="₪72/kg";  color1="#050505"; color2="#4A0010" },
  @{ path="prepared\marinated_ribeye.jpg"; emoji="🥩"; name="Marinated Ribeye";  price="₪199/kg"; color1="#050505"; color2="#4A0010" },
  @{ path="prepared\beef_sausages.jpg";    emoji="🌭"; name="Beef Sausages";     price="₪64/kg";  color1="#050505"; color2="#4A0010" },
  @{ path="prepared\bone_broth.jpg";       emoji="🍲"; name="Bone Broth Kit";    price="₪45/kg";  color1="#050505"; color2="#4A0010" },
  @{ path="kosher-special\mehadrin_beef.jpg";  emoji="✡️"; name="Mehadrin Beef"; price="₪249/kg"; color1="#020010"; color2="#2D0070" },
  @{ path="kosher-special\mehadrin_lamb.jpg";  emoji="✡️"; name="Mehadrin Lamb"; price="₪899/unit";color1="#020010"; color2="#2D0070" },
  @{ path="kosher-special\whole_turkey.jpg";   emoji="✡️"; name="Holiday Turkey";price="₪289/unit";color1="#020010"; color2="#2D0070" }
)

foreach ($p in $products) {
    $outPath = Join-Path $base $p.path
    $c1 = $p.color1
    $c2 = $p.color2
    $name = $p.name
    $emoji = $p.emoji
    $price = $p.price

    $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="$c2" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="$c1"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="40%">
      <stop offset="0%" stop-color="#C8102E" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#C8102E" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- Background -->
  <rect width="600" height="600" fill="url(#bg)"/>
  <rect width="600" height="600" fill="url(#glow)"/>
  <!-- Subtle grid texture -->
  <line x1="150" y1="0" x2="150" y2="600" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <line x1="300" y1="0" x2="300" y2="600" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <line x1="450" y1="0" x2="450" y2="600" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <line x1="0" y1="300" x2="600" y2="300" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <line x1="0" y1="450" x2="600" y2="450" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <!-- Center circle -->
  <circle cx="300" cy="265" r="115" fill="rgba(0,0,0,0.4)" stroke="#C8102E" stroke-width="2" stroke-opacity="0.6"/>
  <circle cx="300" cy="265" r="108" fill="rgba(0,0,0,0.2)" stroke="rgba(200,16,46,0.2)" stroke-width="1"/>
  <!-- Emoji -->
  <text x="300" y="305" text-anchor="middle" font-size="90" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif">$emoji</text>
  <!-- Red separator line -->
  <line x1="80" y1="400" x2="520" y2="400" stroke="#C8102E" stroke-width="1.5" stroke-opacity="0.7"/>
  <!-- Product Name -->
  <text x="300" y="440" text-anchor="middle" font-size="28" font-weight="bold" font-family="'Segoe UI', Arial, sans-serif" fill="white" letter-spacing="1">$name</text>
  <!-- Price -->
  <text x="300" y="475" text-anchor="middle" font-size="20" font-family="'Segoe UI', Arial, sans-serif" fill="#C8102E" font-weight="600">$price</text>
  <!-- Kosher badge -->
  <rect x="220" y="500" width="160" height="28" rx="14" fill="rgba(0,100,0,0.3)" stroke="rgba(74,222,128,0.4)" stroke-width="1"/>
  <text x="300" y="519" text-anchor="middle" font-size="13" font-family="'Segoe UI', Arial, sans-serif" fill="#4ADE80" letter-spacing="1">✡ GLATT KOSHER</text>
</svg>
"@
    [System.IO.File]::WriteAllText($outPath, $svg, [System.Text.Encoding]::UTF8)
    Write-Host "Created: $outPath"
}
Write-Host "Done! All $($products.Count) product images created."
