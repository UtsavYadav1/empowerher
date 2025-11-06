# EmpowerHer

A role-based Next.js platform to empower women and girls with education, business tools, and social impact.

## Goal
Empower girls and women through:
- Learning (schemes, workshops, courses)
- Entrepreneurship (product listings, orders, analytics)
- Community (forums, events)
- Field operations (offline agent, IVR, mock payments)

## Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS + Framer Motion
- Recharts
- Prisma ORM + SQLite
- Mock APIs (App Router route handlers)
- Local Storage + IndexedDB (localForage) for offline
- Jest + ts-jest for tests

## Run locally
```bash
npm install
npx prisma migrate dev --name init
npm run dev
```
Local: http://localhost:3000

## Seed data
We seed with mock users, products, schemes, workshops, and orders.
```bash
npm run prisma:seed
```
Data source: `data/seed.json` and `prisma/seed.ts`.

## Demo walkthrough
1. Register / Login
   - Go to `/register` then `/login`.
   - A session token is stored client-side (mock auth).
2. Choose Role
   - Navigate to `/role-select` and select Girl, Woman, Customer, Admin, or FieldAgent.
3. Girl Dashboard
   - Explore schemes, events, forum, and generate a sample certificate.
   - Apply to a scholarship via `/api/mock/schemes` (mock POST).
4. Woman Dashboard
   - List a product in the seller flow, view orders/analytics, watch tutorials.
5. Customer
   - Browse `/customer/products`, add to cart, checkout at `/customer/checkout`.
   - Choose payment: UPI / COD / Cash to Agent (mock API, 50/50 success).
6. Admin
   - Review stats, manage entities (mock), and approve sellers.

## Deployment (Vercel)
1. Commit and push to a GitHub repository.
2. In Vercel, click "New Project" → "Import Git Repository" and select this repo.
3. Ensure `vercel.json` is present (Next.js auto-detected).
4. Environment Variables (Settings → Environment Variables):
   - `DATABASE_URL="file:./dev.db"`
5. Deploy.
6. Post-deploy (Prisma in Serverless/Edge): set Post-Deployment Command in Vercel to:
   ```bash
   npx prisma migrate deploy && npx prisma db seed
   ```
   Or run once from Vercel shell.
7. Your preview URL will be provided by Vercel after the build (e.g., `https://<project>-<hash>.vercel.app`).

Preview locally instead:
```bash
npm run dev  # http://localhost:3000
```

## Replace mocks with real backend later
- Auth: replace `app/api/auth/*` to use real user service + secure cookies/JWT.
- Users: replace `app/api/users/*` with real CRUD.
- Products/Schemes/Workshops: replace `app/api/mock/*` routes with your real APIs.
- Orders/Payments: integrate a gateway (Razorpay/Stripe) and real order service.
- IVR: update `app/api/mock/ivr/route.ts` to call Twilio/Exotel and configure webhooks.
- Offline sync: point `/api/mock/users` to real backend; add conflict resolution.

## Scripts
```bash
npm run dev       # start local server
npm run build     # production build
npm start         # start production
npm test          # run tests
npm run prisma:seed
```

## Testing (Jest)
- Unit tests for API handlers live in `tests/`.
- Uses `ts-jest` to run TypeScript tests under Node environment.

---

### Notes
- This project uses mock authentication and in-memory sessions for demo purposes.
- Do not use as-is for production auth or payments.

