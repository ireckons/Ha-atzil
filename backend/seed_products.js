const fs = require('fs');
const axios = require('axios');

async function seed() {
    console.log('Reading frontend local products...');
    const content = fs.readFileSync('../frontend/src/data/products.ts', 'utf-8');
    
    // Quick regex to extract the JSON array
    const match = content.match(/export const LOCAL_PRODUCTS: Product\[\] = (\[[\s\S]*?\]);\n\/\/ ──/m);
    
    if (!match) {
        console.error("Could not parse products!");
        return;
    }
    
    const productsArrayStr = match[1].replace(/'/g, '"').replace(/(\w+):/g, '"$1":');
    
    // We actually only need the JS object, so let's parse using Function instead of strict JSON 
    const products = new Function("return " + match[1])();
    
    console.log(`Seeding ${products.length} products...`);
    for (const p of products) {
        try {
            await axios.post('http://localhost:8080/api/products', p);
            console.log(`Seeded ${p.name_en}`);
        } catch (e) {
            console.error(`Failed to seed ${p.name_en}:`, e?.response?.data || e.message);
        }
    }
    console.log('Done!');
}

seed();
