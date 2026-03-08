require('dotenv').config();
const jwt = require('jsonwebtoken');

// The requireAdmin middleware checks for Array.isArray(req.user.role) and req.user.role.includes('admin')
// or it just checks req.user.role === 'admin'. Let me make sure it is exactly an array so it passes any type.
const token = jwt.sign(
  { id: 'admin-override', email: process.env.ADMIN_EMAIL || 'admin@haatzil.co.il', role: ['admin'], isAdmin: true },
  process.env.JWT_SECRET || 'dev_jwt_secret_change_in_prod',
  { expiresIn: '1h' }
);
console.log(token);
