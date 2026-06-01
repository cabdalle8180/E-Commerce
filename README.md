# SomCart E-Commerce (Full Stack)

React + Vite frontend · Express + MongoDB backend · **Multer** for local product & profile images.

## Quick start

### Backend

```bash
cd backend
npm install
```

`backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/somcart
JWT_SECRET=your_secret_key_here
PORT=3000
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
npm run seed:admin   # admin / admin123
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## Features

### Shop (all users)
- Product catalog with search & categories
- Product detail, cart, checkout
- Order history on profile
- Wishlist (heart icon — login required)

### Profile
- Edit name, phone, address
- **Profile picture upload** (Multer → `uploads/avatars/`)
- Change password
- View orders with status & payment state

### Admin dashboard (`/admin`)
- **Add / edit / delete** products
- **Local product images** (Multer → `uploads/products/`)
- Toggle product active/hidden
- **Manage all orders** — update shipping status & payment status

---

## Image storage (Multer)

| Type | Folder | API |
|------|--------|-----|
| Product | `backend/uploads/products/` | `POST/PUT /api/products` field `image` |
| Avatar | `backend/uploads/avatars/` | `PUT /api/auth/profile-pic` field `profilePic` |

Served at `/uploads/...` — Vite proxies `/uploads` in dev.

---

## API reference

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/profile-pic` | Upload avatar (multipart) |
| PUT | `/api/auth/change-password` | Change password |

### Products
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin (multipart) |
| PUT | `/api/products/:id` | Admin (multipart, image optional) |
| DELETE | `/api/products/:id` | Admin |

### Orders
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/orders` | User |
| GET | `/api/orders/myorders` | User |
| GET | `/api/orders/admin/all` | Admin |
| PUT | `/api/orders/:id/status` | Admin |
| GET | `/api/orders/:id` | User (own) / Admin |

### Wishlist
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/wishlist` | User |
| POST | `/api/wishlist` | User `{ productId }` |
| DELETE | `/api/wishlist/:productId` | User |

---

## Routes (frontend)

| Path | Page |
|------|------|
| `/` | Home |
| `/product/:id` | Product detail |
| `/cart` | Cart |
| `/checkout` | Checkout |
| `/profile` | Account & orders |
| `/wishlist` | Wishlist |
| `/admin` | Admin (products + orders) |
| `/login` | Login |
| `/register` | Register |

---

## Admin workflow

1. `npm run seed:admin`
2. Login as **admin** / **admin123**
3. **Admin** → Products tab → add product with image
4. **Admin** → Orders tab → update status when orders arrive

## Customer workflow

1. Register / login
2. Browse → add to cart or wishlist
3. Checkout with shipping address
4. Track orders on **Profile**
