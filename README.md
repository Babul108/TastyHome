<div align="center">
  <img src="client/public/logo.svg" alt="TastyHome Logo" width="80" height="80"/>
  <h1>🏠 TastyHome</h1>
  <p><strong>Full-Stack Food Delivery Platform</strong></p>
  <p>Order delicious food from your favourite restaurants — delivered fast to your door.</p>
</div>

---

## ✨ Features

- 🔐 **Authentication** — JWT-based login/signup, OTP verification, forgot/reset password
- 🍽️ **14 Food Categories** — Breakfast, Lunch, Dinner, Biryani, Pizza, Burger, Chinese, South Indian, North Indian, Street Food, Snacks, Diet, Desserts, Beverages
- 🛒 **Smart Cart** — Single-restaurant enforcement, coupon support, real-time total calculation
- 💳 **UPI Payments** — QR code generation, UPI deep links, COD support
- 📍 **Live Order Tracking** — Real-time delivery tracking via Socket.IO + Leaflet map
- 🤖 **AI Chatbot** — Predefined responses for order help, payments, refunds, tracking
- 👨‍💼 **Admin Dashboard** — Full CRUD for restaurants, menu, orders, coupons, notifications, tickets, reports
- 🚴 **Delivery Panel** — Online/offline toggle, assigned orders, earnings, live location updates
- 🌙 **Dark Mode** — Full dark mode support via ThemeContext
- 🔔 **Notifications** — Real-time notifications with badge counts

## 🛠️ Tech Stack

### Frontend
- **React 18** + Vite
- **Tailwind CSS** — Mobile-first responsive design
- **Redux Toolkit** — State management
- **React Router v6** — Client-side routing
- **Socket.IO Client** — Real-time updates
- **React-Leaflet** — Interactive maps
- **Framer Motion** — Animations

### Backend
- **Node.js** + Express.js
- **MongoDB** + Mongoose
- **Socket.IO** — Real-time bidirectional events
- **JWT** + bcryptjs — Authentication & security
- **Multer** — File uploads
- **Nodemailer** — Email delivery
- **QRCode** — UPI QR code generation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Setup

```bash
git clone https://github.com/Babul108/TastyHome.git
cd TastyHome
cp .env.example .env
# Edit .env with your credentials
```

### 2. Start Backend

```bash
cd server
npm install
npm run seed   # Seed sample data
npm run dev
```

### 3. Start Frontend

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173

## 🧪 Sample Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@tastyhome.com | admin123 |
| User | user@tastyhome.com | user123 |
| Delivery | delivery1@tastyhome.com | delivery123 |

## 🎟️ Sample Coupons

| Code | Discount | Min Order |
|------|----------|-----------|
| WELCOME20 | 20% off | ₹200 |
| FREEDEL | ₹40 off (free delivery) | ₹100 |
| TASTY50 | 50% off (max ₹100) | ₹300 |
| SAVE10 | 10% off | ₹150 |
| NEWUSER | 30% off | ₹250 |

## 📁 Project Structure

```
TastyHome/
├── client/           # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store & slices
│   │   ├── context/      # Socket & Theme contexts
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API service functions
│   │   └── utils/        # Helpers & constants
│   └── public/       # Static assets
└── server/           # Node.js + Express backend
    ├── config/       # DB & Socket.IO config
    ├── controllers/  # Route handlers
    ├── middleware/   # Auth, upload, error handlers
    ├── models/       # Mongoose schemas
    ├── routes/       # Express routers
    ├── seeds/        # Database seed scripts
    └── utils/        # Token, email, chatbot helpers
```

## 🌐 API Endpoints

All endpoints prefixed with `/api`:

| Resource | Endpoints |
|----------|-----------|
| Auth | `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/forgot-password` |
| Restaurants | `GET /restaurants`, `GET /restaurants/:id`, `GET /restaurants/search` |
| Menu | `GET /menu/restaurant/:id`, `GET /menu/category/:category` |
| Orders | `POST /orders`, `GET /orders/my-orders`, `PUT /orders/:id/status` |
| Payments | `POST /payments/generate-upi`, `POST /payments/verify` |
| Delivery | `GET /delivery/orders`, `PUT /delivery/order/:id/status` |
| Admin | `GET /admin/dashboard`, `GET /admin/users`, `GET /admin/orders` |

## 📄 License

MIT © 2024 TastyHome 
