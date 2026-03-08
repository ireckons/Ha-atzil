require('dotenv').config();
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: 'admin-override', isAdmin: true },
  process.env.JWT_SECRET || 'dev_jwt_secret_change_in_prod',
  { expiresIn: '1h' }
);

console.log("Token generated, calling API...");
fetch('http://localhost:4000/api/upload/migrate-local-images', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token }
}).then(res => res.json())
  .then(data => console.log("Migration Result:", data))
  .catch(err => console.error(err));
