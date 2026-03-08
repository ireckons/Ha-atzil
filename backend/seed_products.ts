import axios from 'axios';
import { LOCAL_PRODUCTS } from '../frontend/src/data/products';

async function seed() {
    console.log(`Seeding ${LOCAL_PRODUCTS.length} products...`);
    for (const p of LOCAL_PRODUCTS) {
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
