# School Payments — Frontend (React + Vite + Tailwind)

A clean, responsive frontend for the **School Payments & Dashboard** project.
Builds a dashboard to view transactions, inspect by school, create/check payments and verify transaction status. This README gives you everything you need to run, test and deploy the frontend.

---

## Quick summary

* Tech: **React (Vite)**, **Tailwind CSS**, **Axios**, **React Router**
* Pages: `Dashboard` (all transactions), `SchoolTransactions` (by school), `CheckStatus` (check one ID), `CreatePayment` (initiate payment), `Login` / `Register`
* API: communicates with your backend via `VITE_API_BASE` (axios)
* Format: single-page app, mobile-responsive, accessible components

---

## Table of contents

1. Setup & install
2. Environment variables (`.env`)
3. Run (dev / build / preview)
4. Project structure (important files)
5. Pages & components overview
6. API endpoints used & examples (Postman / curl)
7. Deployment (Netlify / Vercel)
8. Troubleshooting & common fixes
9. Contributing & license

---

## 1) Setup & install (local)

Prerequisites:

* Node.js LTS (16+ recommended)
* npm (comes with Node) or pnpm/yarn
* A running backend (NestJS) with the expected endpoints

Steps:

```bash
# clone repo (if you haven't)
git clone https://github.com/<your-username>/school-payments-frontend.git
cd school-payments-frontend

# install packages
npm install

# start dev server
npm run dev

# build for production
npm run build

# preview production build
npm run preview
```

If `npm run dev` errors about `@vitejs/plugin-react`, run:

```bash
npm install @vitejs/plugin-react --save-dev
```

---

## 2) Environment variables

Create a `.env` (do **not** commit to Git). Example `.env` / `.env.example`:

```
VITE_API_BASE=http://localhost:3000        # backend base URL (add /api if backend uses global prefix)
VITE_CALLBACK_URL=http://localhost:5173/payment-callback
VITE_SCHOOL_ID=65b0e6293e9f76a9694d84b4   # optional default school id
```

Notes:

* Vite env vars must start with `VITE_`.
* If backend has a global prefix (`app.setGlobalPrefix('api')`), set `VITE_API_BASE=http://localhost:3000/api`.

---

## 3) Run & build

* Dev: `npm run dev` → open the Vite URL (typically `http://localhost:5173`)
* Build: `npm run build` → outputs `dist/`
* Preview: `npm run preview` → serves `dist/` locally

---

## 4) Project structure (important files)

```
src/
  api/
    api.js               # axios instance (baseURL from VITE_API_BASE)
  components/
    TransactionsTable.jsx
    Filters.jsx
    Pagination.jsx
    Header.jsx
    ...other small UI components
  context/
    AuthContext.jsx      # login/register + attach token to axios
  hooks/
    useDebounce.js
  pages/
    Dashboard.jsx        # transactions list + filters + pagination
    SchoolTransactions.jsx
    CheckStatus.jsx
    CreatePayment.jsx
    Login.jsx
    Register.jsx
  utils/
    normalize.js         # normalize transaction shapes from backend
  App.jsx
  main.jsx
tailwind.config.js
vite.config.js
package.json
```

---

## 5) Pages & UX summary

* **Dashboard**

  * Paginated list of transactions with sort & search.
  * Filters: status (success/pending/failed), school ID, date range.
  * Columns: Order ID, School ID, Gateway, Order Amt, Txn Amt, Status, Payment Time.

* **SchoolTransactions**

  * Input school ID or choose from dropdown and fetch transactions for that school.

* **CheckStatus**

  * Enter `custom_order_id` (order id / collect\_request\_id) and fetch the latest status.

* **CreatePayment (optional)**

  * Short form to create a collect request; submits to backend `/payments/create-payment`, receives payment URL and redirects user.

* **Auth pages**

  * Login & Register (optional). Auth token stored in `localStorage` and set on axios via `AuthContext`.

---

## 6) API endpoints (used by frontend) & examples

Set `VITE_API_BASE` to match your backend base.

### Auth

* `POST /auth/register`

  * Body: `{ "username": "alice", "password": "password123" }`
* `POST /auth/login`

  * Response: `{ "access_token": "..." }` → stored in `localStorage` and added to axios Authorization header.

### Payments

* `POST /payments/create-payment` (protected)

  * Body: `{ "amount": "100", "callback_url": "<frontend-callback-url>", "student_info": { ... } }`
  * Response: `{ payment_url: "...", collect_request_id: "..." }`
* `GET /payments/check/:collect_request_id` (protected) — optionally used by frontend.

### Transactions

* `GET /transactions?page=1&limit=10&sort=payment_time&order=desc&status=success&school_id=...&from=YYYY-MM-DD&to=YYYY-MM-DD&search=xxx`

  * Response: `{ data:[...], page, limit, total }`
* `GET /transactions/school/:schoolId`
* `GET /transactions/status/:custom_order_id`

### Webhook (backend)

* `POST /webhook` — gateway posts updates. This is backend-only; frontend does not call it.

---

### Example curl (login + fetch transactions)

```bash
# login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"password123"}'

# use token from response
curl -H "Authorization: Bearer <TOKEN>" "http://localhost:3000/transactions?page=1&limit=5"
```

---

## 7) Postman collection (quick test cases)

Create requests:

* Auth: Register, Login
* Transactions: GET `/transactions`, GET `/transactions/school/:id`, GET `/transactions/status/:id`
* Payments: POST `/payments/create-payment` (protected)
* Webhook: POST `/webhook` (simulate payload)

Suggested Postman environment variables:

```
baseUrl = http://localhost:3000
token = (set after login)
```

When calling protected endpoints, set `Authorization: Bearer {{token}}`.

---

## 8) Deployment (Netlify / Vercel / Cloud)

### Vercel

1. Connect GitHub repo to Vercel.
2. Set `Framework Preset` -> `Vite`.
3. Add Environment Variables in Vercel dashboard:

   * `VITE_API_BASE` -> [https://your-backend.example.com](https://your-backend.example.com) (or /api)
   * `VITE_CALLBACK_URL` -> [https://your-frontend.com/payment-callback](https://your-frontend.com/payment-callback)
4. Deploy.

### Netlify

1. Connect repo and set build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables as above.

---

## 9) Troubleshooting & common fixes

### School ID column shows `-` or `null`

* Likely cause: backend didn’t join `order_status` → `orders` (missing `collect_id`) or type mismatch string vs ObjectId.
* Quick checks:

  * Open backend `GET /transactions?page=1&limit=1` and inspect raw JSON — look for `school_id` in each item.
  * If `school_id` is `null`, either:

    1. `order_status` documents don’t store `collect_id` or `custom_order_id` in a matching way; backend lookup must be robust.
    2. Fix (backend): update aggregation lookup to try matching by either `collect_id` or `custom_order_id` and try string/ObjectId conversions (I can provide a drop-in pipeline).
* Frontend: The normalizer `src/utils/normalize.js` attempts many places to find school id (`row.school_id`, `order.school_id`, `order.school._id`). If backend returns nested fields, normalizer will pick them up.

### Vite / plugin errors

* If Vite complains about missing plugin: run `npm install @vitejs/plugin-react --save-dev`.

### CORS / API base mismatch

* If frontend cannot call backend, confirm `VITE_API_BASE` value and backend CORS settings (allow your frontend origin).

### Auth issues (404 for `/auth/register`)

* Ensure backend app prefix; some people set `app.setGlobalPrefix('api')`. If so use `VITE_API_BASE=http://localhost:3000/api`.

---

## 10) Development tips & recommended improvements

* Add a server-side endpoint to return a list of schools (ids + names) for dropdowns instead of deriving unique school IDs from returned transactions.
* Use WebSocket or Server-Sent Events to push transaction updates when webhooks are processed.
* Add better error UI (toasts) for network failures.
* Add unit tests for `normalizeTransaction` to assert mapping across different webhook/order shapes.

---

## 11) Contributing

* Fork repo → feature branch → PR
* Keep PRs small and focused (UI, API, or bugfix only)
* Linting & Prettier recommended; consider adding `husky` for pre-commit hooks.

---

## 12) License

Choose a license for your repo (MIT recommended). Example `LICENSE` contents (MIT). Add it to repo root.

---

## 13) Useful commands summary

```bash
npm install
npm run dev
npm run build
npm run preview
```

---