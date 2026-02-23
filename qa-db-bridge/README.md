# האציל – QA Database Bridge

## Purpose

This package provides an **isolated** connection to the QA/staging PostgreSQL database.
It is **completely separate** from the production database configuration in `backend/`.

## Isolation Rules

| | Production | QA DB Bridge |
|---|---|---|
| Config file | `backend/.env` | `qa-db-bridge/.env` |
| Database | `haatzil` (prod DB) | `haatzil_qa` (QA DB) |
| DB User | `haatzil_user` | `qa_user` |
| Purpose | Live customer orders | Testing only |

> **CAUTION**: Never point `qa-db-bridge/.env` at the production database.

## Setup

```bash
cd qa-db-bridge
cp .env.example .env
# Edit .env with QA database credentials

npm install
```

## Running

```bash
# Test QA DB connection and print summary
npm run connect
# → tsx index.ts

# Seed QA DB with test data
npm run seed-qa
```

## Creating the QA Database

```sql
CREATE DATABASE haatzil_qa;
CREATE USER qa_user WITH PASSWORD 'qa_password_change_me';
GRANT ALL PRIVILEGES ON DATABASE haatzil_qa TO qa_user;
```

Then run the schema:
```bash
psql -U qa_user -d haatzil_qa -f ../backend/src/db/schema.sql
psql -U qa_user -d haatzil_qa -f ../backend/src/db/seed.sql
```
