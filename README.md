<div dir="rtl">

# 🔪 האציל – HaAtzil Butcher Shop

**Full-stack production-ready web application for האציל kosher butcher shop, Safed.**

> *since 2005 · בשרים שמכבדים אירוח*

</div>

## Quick Start (Docker Compose)

```bash
git clone https://github.com/your-org/haatzil.git
cd haatzil

# 1. Copy and fill in environment variables
cp .env.example .env

# 2. Start all services (DB + backend + frontend)
docker compose up --build

# Open in browser:
# Customer site → http://localhost:5173
# Admin panel   → http://localhost:5173/admin
# API health    → http://localhost:4000/health
```

Default admin credentials (see `.env.example`):
- **Email**: `admin@haatzil.co.il`
- **Password**: `Admin1234!`

---

## Environment Variables

Copy `.env.example` → `.env` at the repo root. Key variables:

| Variable | Description | Required |
|---|---|---|
| `POSTGRES_PASSWORD` | PostgreSQL password | ✅ |
| `JWT_SECRET` | ≥32 character random string | ✅ |
| `POSTGRES_DB` | Database name (default: `haatzil`) | ✅ |
| `ADMIN_EMAIL` | Admin login email | ✅ |
| `ADMIN_PASSWORD` | Admin login password | ✅ |
| `VITE_API_URL` | Backend URL (frontend build time) | ✅ |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | Email (optional, for order confirmation) | ❌ |

---

## Running Locally (without Docker)

### Prerequisites
- Node.js ≥ 20
- PostgreSQL ≥ 14

### 1. Install dependencies
```bash
npm install   # root workspace – installs all packages
```

### 2. Database setup
```bash
# Create DB and user
psql -U postgres -c "CREATE DATABASE haatzil;"
psql -U postgres -c "CREATE USER haatzil_user WITH PASSWORD 'devpassword';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE haatzil TO haatzil_user;"

# Run migrations
cd backend && cp .env.example .env   # fill in DB credentials
npm run migrate

# Seed data (21 products in Hebrew + English, 5 categories, pickup slots)
npm run seed
```

### 3. Run backend
```bash
cd backend
npm run dev   # starts on port 4000 with hot reload
```

### 4. Run frontend
```bash
cd frontend
npm run dev   # starts on port 5173 with Vite
```

---

## Seed Commands

```bash
# From repo root
npm run migrate    # creates schema
npm run seed       # inserts categories, products, slots, admin user

# Or directly
cd backend
npm run migrate
npm run seed
```

---

## Running Tests

```bash
# Backend unit tests (Jest)
cd backend && npm test

# Frontend unit tests (Vitest)
cd frontend && npm test

# E2E tests – requires running stack (docker compose up)
cd frontend && npx playwright install --with-deps chromium
cd frontend && npm run test:e2e

# Typecheck all
npm run typecheck   # runs in both workspaces
```

---

## Monorepo Structure

```
haatzil/
├── frontend/          React + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── pages/     HomePage, CatalogPage, ProductPage, CartPage,
│   │   │              CheckoutPage, ConfirmationPage, PrivacyPage,
│   │   │              AdminLoginPage, AdminPage
│   │   ├── components/ Navbar, ProductCard, FlagStrip, ...
│   │   ├── store/     Zustand: cartStore, authStore
│   │   ├── api/       Axios client with typed API functions
│   │   └── i18n.ts    Hebrew/English string map
│   ├── e2e/           Playwright E2E tests
│   └── public/        SVG assets (bull-silhouette.svg, favicon.svg)
│
├── backend/           Node.js + Express + TypeScript + PostgreSQL
│   ├── src/
│   │   ├── routes/    auth.ts, products.ts, orders.ts, pickupSlots.ts
│   │   ├── middleware/ auth.ts (JWT), validate.ts (Zod), rateLimit.ts
│   │   ├── services/  sse.ts (real-time admin updates)
│   │   ├── db/        schema.sql, seed.sql, migrate.ts, seedRunner.ts
│   │   └── tests/     products.test.ts, orders.test.ts
│   ├── openapi.yaml   OpenAPI 3.0 spec for all endpoints
│   └── Dockerfile
│
├── qa-db-bridge/      Isolated QA database connection (never points to prod)
│   └── index.ts
│
├── docker-compose.yml  PostgreSQL + backend + frontend
├── .github/workflows/  CI pipeline (lint, typecheck, test, build, E2E)
└── .env.example
```

---

## Deployment

### Frontend → Vercel

1. Import repo to Vercel
2. Set framework: **Vite**
3. Root directory: `frontend`
4. Environment variables:
   ```
   VITE_API_URL=https://api.haatzil.co.il
   ```
5. Deploy → Vercel handles the build automatically

### Backend → Render / Azure

**Render:**
```
Service type: Web Service
Root directory: backend
Build command: npm ci && npm run build
Start command: node dist/index.js
Environment variables: (all from .env.example)
```

**Azure App Service:**
```bash
az webapp create --name haatzil-api --plan haatzil-plan --runtime "NODE:20-lts"
az webapp config appsettings set --name haatzil-api --settings @backend/.env
az webapp deployment source config-zip --src backend-dist.zip
```

**Database:** Use **Supabase**, **Render PostgreSQL**, or **Azure Database for PostgreSQL**.

---

## API Documentation

- OpenAPI spec: [`backend/openapi.yaml`](./backend/openapi.yaml)
- Import into **Postman**: File → Import → select `backend/openapi.yaml`
- Or use **Swagger UI**: `npx swagger-ui-watcher backend/openapi.yaml`

---

## Manual Verification Checklist

1. **Place an order**
   - [ ] Open `http://localhost:5173`
   - [ ] Browse catalog → click a product → select weight → Add to Cart
   - [ ] Go to Cart → verify total is correct
   - [ ] Proceed to Checkout → fill name + phone → select pickup slot
   - [ ] Submit → see Confirmation page with order number
   - [ ] Print pickup slip (browser print dialog)

2. **Confirm in Admin**
   - [ ] Open `http://localhost:5173/admin/login`
   - [ ] Login with admin credentials
   - [ ] See order appear in real-time in Orders panel (SSE)
   - [ ] Click "אשר" (Confirm) on the order
   - [ ] Click "מוכן לאיסוף" (Ready) on the order

3. **Mark collected**
   - [ ] Click "נאסף" (Collected) on the order
   - [ ] Verify status changes to "נאסף"

4. **Admin items**
   - [ ] Switch to פריטים (Items) panel
   - [ ] Create a new product with כשר toggle ON
   - [ ] Toggle availability off → verify it disappears from catalog
   - [ ] Export products CSV → open in Excel

5. **Pickup-only enforcement**
   - [ ] Verify no delivery option anywhere in checkout flow
   - [ ] Verify "קיים איסוף עצמי בלבד" notice is visible

---

## Architecture Notes

- **Auth**: Stateless JWT (no sessions). Token stored in `localStorage`.
- **Real-time**: Server-Sent Events (SSE) at `GET /api/orders/stream`. Admin panel auto-reconnects.
- **Capacity enforcement**: Pickup slots use `FOR UPDATE` row lock + transaction to prevent overbooking.
- **Audit log**: Every order status change is recorded in `audit_log` with old/new values and who made the change.
- **RTL**: `dir="rtl"` on `<html>`, Heebo font, Tailwind RTL classes (`pe-`, `ps-`, `me-`, `ms-`).
- **Rate limiting**: 10 orders/hour/IP (`orderLimiter`), 20 auth attempts/15min, 200 general/15min.