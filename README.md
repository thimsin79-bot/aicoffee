# ☕ Ai Coffee Shop

Artisanal specialty coffee storefront with a **live REST API, JSON-file database, and admin control center** — built with **zero external dependencies** (pure Node.js `http`/`fs`/`path` + vanilla front-end).

> Freshly brewed specialty coffee, crafted with passion.

The codebase is split into a `backend/` directory (API server + JSON database) and a `frontend/` directory (static pages, styles and scripts).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [REST API Reference](#rest-api-reference)
- [Data Model](#data-model)
- [Front-End Architecture](#front-end-architecture)
- [localStorage Keys](#localstorage-keys)
- [Default Accounts](#default-accounts)
- [Notes & Limitations](#notes--limitations)

---

## Features

### Storefront
- **Menu catalog** with category tabs (Hot / Cold / Food), photos, emoji icons and live pricing
- **Drink customization** — size options, milk/syrup extras, dynamic custom add-ins, quantity stepper, live price recalculation
- **Cart** with quantity +/- controls, remove, subtotal, 8% tax and live totals
- **Checkout** with delivery method, payment method and order summary
- **Order confirmation** receipt page (printable) and **My Orders** history
- **Customer profile** with order statistics and account editing
- **Feedback** page with 5-star rating widget and public feedback history
- **Auth** — sign up / sign in (API-backed with offline fallback)

### Admin
- **Admin Dashboard** (`Admin.html`) — KPI tiles (orders, revenue, products sold, feedback, complaints), recent orders table, feedback moderation, responsive site preview modal, quick "add product" modal with base64 image upload
- **Admin Control Center** (`AdminControl.html`) — 4-tab CRUD over shop profile, menu catalog, photo gallery and file attachments

### Platform
- **REST API + JSON file database** — no database engine, no npm install
- **Offline-first graceful degradation** — every API call falls back to `localStorage` transparently when the server is unreachable
- **5 color themes** — Ocean Blue, Warm Amber, Forest Emerald, Royal Violet, Sunset Rose (`data-theme` attribute)
- **4 languages** — English, Khmer, French, Chinese (full i18n engine with `data-i18n` attributes)
- **Responsive** — mobile hamburger navigation, fluid `clamp()` layouts
- **Cross-tab sync** — cart, theme and language propagate via the `storage` event

---

## Tech Stack

| Layer | Technology |
|---|---|
| Server | Node.js `http` module (no Express) — `backend/server.js` |
| Database | Flat JSON files in `backend/data/` |
| Front-end | Vanilla HTML5, CSS3 (custom properties), ES6+ JavaScript — `frontend/` |
| APIs | REST + `fetch`, CORS enabled (`Access-Control-Allow-Origin: *`) |
| Dependencies | **None** — `package.json` has no `dependencies` |
| Tooling | None required |

---

## Quick Start

**Requirements:** Node.js 12+ installed. No `npm install` needed.

```bash
# Start the server (defaults to port 3000)
npm start
# or
node backend/server.js
```

On boot you should see:

```
=================================================
☕ Ai Coffee Shop Server is running!
🌐 Local Storefront: http://localhost:3000
📊 Admin Dashboard: http://localhost:3000/Admin.html
⚙️ REST API Root:   http://localhost:3000/api/health
📁 Static root:     D:\Coffe Shop\frontend
🗄️  Database dir:    D:\Coffe Shop\backend\data
=================================================
```

### URLs

| Purpose | URL |
|---|---|
| Storefront | http://localhost:3000/ (redirects to `Home.html`) |
| Admin Dashboard | http://localhost:3000/Admin.html |
| Admin Control Center | http://localhost:3000/AdminControl.html |
| API health check | http://localhost:3000/api/health |

### Custom port

```bash
PORT=8080 node backend/server.js        # macOS / Linux
$env:PORT=8080; node backend/server.js  # Windows PowerShell
```

### Offline mode

The site also works by simply opening `frontend/index.html` directly from disk (`file://`) — pages then detect the `file:` protocol and target `http://localhost:3000/api` opportunistically, falling back to pure `localStorage` when the server isn't running.

---

## Project Structure

```
.
├── package.json           # Root manifest -> entry point backend/server.js
├── README.md
├── .gitignore
│
├── backend/               # ── SERVER SIDE ──────────────────────────
│   ├── server.js          #   REST API + static file server (zero deps)
│   └── data/              #   JSON "database" (auto-created if missing)
│       ├── menu.json      #     17 seeded products
│       ├── orders.json
│       ├── feedback.json
│       ├── users.json
│       └── shop.json      #     Shop profile / settings
│
└── frontend/              # ── CLIENT SIDE ─────────────────────────
    ├── index.html         #   Entry point -> redirects to Home.html
    │
    ├── Home.html          #   Landing page
    ├── Menu.html          #   Full catalog with category tabs
    ├── Product.html       #   Drink customization + add-to-cart
    ├── Cart.html          #   Cart review
    ├── Checkout.html      #   Checkout form
    ├── Order.html         #   Order confirmation / receipt
    ├── Orders.html        #   Order history
    ├── Profile.html       #   Customer profile & stats
    ├── Feedback.html      #   Feedback form & history
    ├── SignIn.html        #   Sign in
    ├── SignUp.html        #   Register
    ├── Admin.html         #   Admin dashboard
    ├── AdminControl.html  #   Admin control center (CRUD)
    │
    ├── css/
    │   ├── style.css      #   Global styles + 5 theme variable blocks
    │   ├── home.css, menu.css, product.css, cart.css, checkout.css
    │   ├── orders.css, profile.css, feedback.css, auth.css
    │   └── admin.css, admin-control.css
    │
    └── js/
        ├── api.js         #   CoffeeAPI adapter (REST + localStorage fallback)
        ├── main.js        #   Shared chrome: themes, i18n, nav, cart badge, admin dock
        ├── home.js, menu.js, product.js, cart.js, checkout.js
        ├── order.js, orders.js, profile.js, feedback.js, auth.js
        └── admin.js, admin-control.js
```

### How the server resolves paths

`backend/server.js` derives everything from `__dirname`, so the layout is location-independent:

| Constant | Resolves to | Used for |
|---|---|---|
| `BACKEND_DIR` | `<root>/backend` | — |
| `ROOT_DIR` | `<root>` | — |
| `FRONTEND_DIR` | `<root>/frontend` | Static file serving |
| `DATA_DIR` | `<root>/backend/data` | JSON database |

Only `/api/*` routes and requests outside `frontend/` reach the filesystem; the `/` route maps to `frontend/Home.html`, and extensionless paths get `.html` appended automatically.

---

## Pages

| Page | Script | Description |
|---|---|---|
| `index.html` | — | Redirects to `Home.html` |
| `Home.html` | `home.js` | Hero, coffee cards, brew process, about, contact form |
| `Menu.html` | `menu.js` | Catalog with Hot/Cold/Food tabs |
| `Product.html` | `product.js` | Size/extras/qty customization, add to cart, add-new-product modal |
| `Cart.html` | `cart.js` | Cart items, quantity controls, totals |
| `Checkout.html` | `checkout.js` | Delivery + payment + place order |
| `Order.html` | `order.js` | Receipt for the most recent order |
| `Orders.html` | `orders.js` | Order history list |
| `Profile.html` | `profile.js` | Account details, order stats, sign out |
| `Feedback.html` | `feedback.js` | Star-rated feedback form + history |
| `SignIn.html` / `SignUp.html` | `auth.js` | Authentication forms |
| `Admin.html` | `admin.js` | KPIs, orders table, feedback moderation, preview, add product |
| `AdminControl.html` | `admin-control.js` | Shop profile, menu CRUD, gallery, file attachments |

Every page loads scripts in this order: `api.js` → `main.js` → page script.

---

## REST API Reference

Base URL: `http://localhost:3000/api`

All responses are JSON. CORS is open (`*`) and `OPTIONS` preflight is handled.

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service status, version, timestamp |

```json
{ "status": "ok", "service": "Ai Coffee Shop REST API", "version": "1.0.0", "timestamp": "..." }
```

### Menu

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/menu` | List all catalog items |
| `POST` | `/api/menu` | Create or **upsert by name** (case-insensitive) |
| `DELETE` | `/api/menu/:name` | Delete an item by name (URL-encoded) |

`POST /api/menu` body — `name` and `price` are required:

```json
{
  "name": "Cappuccino",
  "price": 3.50,
  "category": "hot",
  "icon": "☕",
  "desc": "Espresso with steamed milk and microfoam.",
  "photo": "https://..."
}
```

Defaults applied server-side: `price` → `3.50`, `category` → `hot`, `icon` → `☕`.
Returns `200` on upsert. `400` if `name`/`price` missing.

### Orders

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/orders` | List all orders (newest first) |
| `POST` | `/api/orders` | Create an order → `201` |
| `PATCH` / `PUT` | `/api/orders/:number` | Update `status` |

```json
{
  "number": "89203",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1 555-0111",
  "address": "1 Main St",
  "delivery": "standard",
  "payment": "card",
  "items": [{ "name": "Latte", "price": 3.80, "qty": 2, "size": "Large", "extras": ["Oat Milk"] }],
  "subtotal": 7.60, "shipping": 1.99, "tax": 0.61, "total": 10.20,
  "status": "processing"
}
```

`number` is auto-generated (5-digit) when omitted. `status` defaults to `processing`.
`PATCH /api/orders/:number` with `{ "status": "completed" }`; `404` if the number is unknown.

### Feedback

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/feedback` | List all feedback (newest first) |
| `POST` | `/api/feedback` | Submit feedback → `201` (`message` required) |
| `DELETE` | `/api/feedback/:id` | Delete feedback by numeric `id` |

```json
{ "name": "Alex", "email": "alex@example.com", "type": "Praise", "rating": 5, "message": "Cold brew is great!" }
```

Defaults: `name` → `Anonymous Guest`, `type` → `Praise`, `rating` → `5`.

### Shop Info

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/shop-info` | Get shop profile |
| `POST` / `PUT` | `/api/shop-info` | Replace the shop profile wholesale |

```json
{
  "name": "Ai Coffee Shop",
  "tagline": "Freshly brewed specialty coffee, crafted with passion.",
  "email": "hello@aicoffeeshop.com",
  "phone": "+1 555-0123",
  "address": "123 Coffee Street, Cityville",
  "hours": "7:00 AM — 9:00 PM",
  "about": "At Ai Coffee Shop, we believe great coffee brings people together..."
}
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register → `201`. `400` if email exists or fields missing |
| `POST` | `/api/auth/signin` | Login → `200`. `401` on bad credentials |

The `password` field is stripped from all responses (destructured out before returning).

### Error format

```json
{ "error": "Name and price are required" }
```

Status codes: `200`, `201`, `204` (preflight), `400`, `401`, `404`, `403`, `500`.

---

## Data Model

Stored in `backend/data/*.json`, read/written synchronously via `readDb()` / `writeDb()` helpers in `backend/server.js`.

**`menu.json`**
```json
[{ "name": "Espresso", "price": 2.50, "category": "hot", "icon": "☕", "desc": "...", "photo": "https://..." }]
```
`category` ∈ `hot` | `cold` | `food`. Seeded with 17 items.

**`orders.json`**
```json
[{ "number": "89201", "name": "...", "items": [...], "subtotal": 0, "shipping": 0, "tax": 0, "total": 0, "status": "processing", "createdAt": "ISO-8601" }]
```

**`feedback.json`**
```json
[{ "id": 1, "name": "...", "email": "...", "type": "Praise", "rating": 5, "message": "...", "createdAt": "ISO-8601" }]
```
`type` ∈ `Praise` | `Suggestion` | `Complaint`.

**`users.json`**
```json
[{ "id": 1, "name": "...", "email": "...", "password": "plaintext", "role": "customer", "phone": "...", "address": "..." }]
```

**`shop.json`** — single object with `name`, `tagline`, `email`, `phone`, `address`, `hours`, `about`.

---

## Front-End Architecture

### `CoffeeAPI` adapter (`js/api.js`)

The only data-access layer. On load it pings `/api/health` with a 1200 ms `AbortController` timeout and sets `CoffeeAPI.isOnline`.

- **Online** → every method hits the REST API and mirrors results into `localStorage` for instant reads.
- **Offline** (or `file://`) → each method transparently falls back to `localStorage` only. No errors surface to the user.

```js
// Available globally on every page
await CoffeeAPI.getMenu();            // also: saveMenuItem, deleteMenuItem
await CoffeeAPI.getOrders();          // also: createOrder, updateOrderStatus
await CoffeeAPI.getFeedback();        // also: submitFeedback, deleteFeedback
await CoffeeAPI.getShopInfo();        // also: saveShopInfo
await CoffeeAPI.signUp(data);         // also: signIn, getUser, signOut
```

The API base URL is resolved at load: `file:` protocol → `http://localhost:3000/api`, otherwise → `/api`.

### `js/main.js` — shared chrome

Exposes `window.updateCartBadge`, `window.setTheme`, `window.setLanguage`, `window.getActiveTheme`, `window.getActiveLanguage`, `window.COFFEE_TRANSLATIONS`.

- **Theming** — 5 accent themes set via `document.documentElement.dataset.theme`, persisted to `localStorage`, applied before first paint (no FOUC). Emits `coffee_theme_changed`.
- **i18n** — ~90 translation keys per language for English, Khmer, French and Chinese. Applied through `data-i18n` (text content) and `data-i18n-ph` (placeholders). Standard nav links are auto-tagged from their `href`. Emits `coffee_lang_changed`.
- **UI injection** — theme popover and language dropdown into `.site-header .header-actions`; mirrors inside the mobile drawer.
- **Cart badge** — `window.updateCartBadge()` sums item quantities and paints `.cart-badge-count` / `.badge-counter`.
- **Mobile navigation** — hamburger drawer, backdrop, scroll lock, `Escape` to close.
- **Admin dock** — a floating "👑 Admin Active" bar with Dashboard / Control Center links, injected on all public pages when `coffee_admin_mode === 'true'`.
- **Cross-tab sync** — `storage` listener keeps cart, theme and language consistent across browser tabs.

### Custom events

| Event | Dispatched by | Consumed by |
|---|---|---|
| `coffee_api_status` | `api.js` | — |
| `coffee_theme_changed` | `main.js` | — |
| `coffee_lang_changed` | `main.js` | — |
| `coffee_menu_updated` | `api.js` | `menu.js` |
| `coffee_orders_updated` | `api.js` | `orders.js` |

### Image uploads

Product, dashboard and control-center image uploads are compressed in-browser via `<canvas>` (resize to ~600 px, re-encoded as JPEG at quality `0.75–0.82`) and stored as base64 data URLs — for gallery uploads at 800 px. Uploaded files therefore travel inside JSON request bodies, so `server.js` accepts bodies up to **15 MB**.

---

## localStorage Keys

| Key | Purpose |
|---|---|
| `cart` | Cart lines — `{ name, icon, photo, size, extras[], unitPrice, qty, lineTotal }` |
| `menuItems` | Menu cache / offline fallback |
| `orders` | Order cache / offline fallback |
| `lastOrder` | Most recent order, used by `Order.html` receipt |
| `feedback` | Feedback cache / offline fallback |
| `shopInfo` | Shop profile cache |
| `gallery` | Gallery photos (Admin Control Center) |
| `fileList` | File attachments (Admin Control Center) |
| `user` | Authenticated user used by the auth/profile pages |
| `loggedIn` | `true` while signed in |
| `coffee_shop_user` | User object written by `CoffeeAPI` |
| `coffee_shop_theme` | Active theme id |
| `coffee_shop_lang` | Active language code |
| `coffee_admin_mode` | `true` while the admin dock is active |

To reset the app to its seeded state, clear the site's localStorage and restart the server (`backend/data/*.json` is restored by `git checkout`).

---

## Default Accounts

Seeded in `backend/data/users.json`:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@aicoffeeshop.com` | `admin123` |
| Customer | `customer@example.com` | `password123` |

Opening `Admin.html` sets `coffee_admin_mode = 'true'`, which reveals the floating admin dock on all public pages. Dismiss it with the `×` button.

---

## Notes & Limitations

This is a demo/teaching-grade full-stack app. Be aware of the following before using it anywhere real:

- **Passwords are stored in plaintext** in `backend/data/users.json` — no hashing, salting or sessions.
- **The API is entirely unauthenticated and CORS-wide open** — any origin can read and mutate all data, including `/api/users` contents via the auth routes. There are no role checks on admin operations.
- **Passwords ship in the repository** as seed data (see [Default Accounts](#default-accounts)).
- **The database is plain JSON on disk** — every read/write is a full-file synchronous read/rewrite with no locking, so concurrent writes can lose data and it does not scale beyond a single process.
- **No input sanitization**: item names, descriptions and photo URLs are interpolated into `innerHTML`, so the stored data is a trusted XSS surface.
- **Order status is display-only in the UI.** `PATCH /api/orders/:number` exists on the server but has no admin control yet; `admin.js` and `orders.js` derive a placeholder status from the order number length when the API is offline.
- **Gallery and file attachments are browser-only** — they live in `localStorage` and are never synced to the server.
- **`AdminControl.html` writes the shop profile to `localStorage` only** — it does not call `CoffeeAPI.saveShopInfo()`, so changes made there do not reach `backend/data/shop.json`.
- **No test suite, linter or build step** is configured.
- Images are loaded from Unsplash and require an internet connection.

---

## License

MIT

---

☕ Built with pure Node.js and vanilla JavaScript.
