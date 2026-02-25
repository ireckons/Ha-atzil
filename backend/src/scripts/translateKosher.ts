import 'dotenv/config';
import { query } from '../db/client';

async function translateKosher() {
    console.log('🔄 Translating Kosher certificates in the database...');

    try {
        await query(`
            UPDATE products 
            SET kosher_cert_text = 'Badatz Mehadrin Beit Shemesh'
            WHERE kosher_cert_text = 'בד"ץ מהדרין עיר שמש'
        `);

        await query(`
            UPDATE products 
            SET kosher_cert_text = 'Badatz Mehadrin Beit Shemesh - Mehadrin min HaMehadrin'
            WHERE kosher_cert_text = 'בד"ץ מהדרין עיר שמש – מהדרין מן המהדרין'
        `);

        // Update the seed.sql text for any future resets just in case
        console.log('✅ Translation applied to database products.');
    } catch (err) {
        console.error('❌ Failed to translate references:', err);
    }
    process.exit(0);
}

translateKosher();
