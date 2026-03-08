require('dotenv').config();
const { Storage } = require('@google-cloud/storage');

const envCreds = process.env.GCS_CREDENTIALS;
if (!envCreds) {
    console.log("No credentials found in process.env");
    process.exit(1);
}

try {
    const creds = JSON.parse(envCreds);
    if (creds.private_key) {
        console.log("Original private_key length:", creds.private_key.length);
        console.log("Contains literal '\\n' substring?", creds.private_key.includes('\\n'));
        console.log("Contains actual newline?", creds.private_key.includes('\n'));
        
        creds.private_key = creds.private_key.replace(/\\n/g, '\n');
        
        console.log("Contains actual newline after replace?", creds.private_key.includes('\n'));
    }
    
    const storage = new Storage({ credentials: creds });
    storage.getBuckets().then(([buckets]) => {
        console.log("Buckets:", buckets.map(b => b.name));
    }).catch(err => {
        console.error("Storage error:", err.message);
    });
} catch(e) {
    console.error("JSON parse error:", e.message);
}
