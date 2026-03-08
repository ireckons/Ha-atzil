const fs = require('fs');
const key = JSON.parse(fs.readFileSync('project-bisale-02bab5eb1db0.json', 'utf8'));
const env = fs.readFileSync('/app/.env', 'utf8');

// The original value is already there, we just replace everything after GCS_CREDENTIALS=
const newEnv = env.replace(/^GCS_CREDENTIALS=.*$/m, 'GCS_CREDENTIALS=' + JSON.stringify(key));

fs.writeFileSync('/app/.env', newEnv);
console.log("Successfully fixed .env file GCS_CREDENTIALS");
