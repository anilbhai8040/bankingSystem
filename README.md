# 🛡️ Nova Crest Bank - Full Stack MERN Digital Banking System

A modern, high-performance **MERN Stack (MongoDB, Express, React, Node.js)** digital banking platform featuring dark glassmorphic UI aesthetics, 3D interactive canvas backgrounds, real-time transaction processing, virtual debit cards, fixed deposits, and gold loans.

---

## 📂 Project Structure

```
BankingSystem/
├── .gitignore               # Comprehensive Git ignore rules (node_modules, builds, secrets)
├── package.json             # Root monorepo script configuration
├── README.md                # Project quickstart guide
├── client/                  # React 19 + Vite Frontend
│   ├── public/              # Static assets & SVG Nova Crest emblem
│   ├── src/
│   │   ├── components/      # Navbar, Footer, 3D Canvas Background
│   │   ├── context/         # AuthContext & global state
│   │   ├── pages/           # Dashboard, Deposit, Withdraw, FD, GoldLoan, Cards, etc.
│   │   ├── index.css        # Glassmorphic CSS design system
│   │   └── App.jsx          # React Router v7 routes
│   └── package.json
└── server/                  # Express + Node Backend
    ├── uploads/             # KYC document uploads (with .gitkeep)
    ├── src/
    │   ├── config/          # MongoDB connection (with MongoMemoryServer fallback) & seed data
    │   ├── controllers/     # Business logic for auth, accounts, transactions, loans, cards
    │   ├── middleware/      # JWT verification & Multer file uploads
    │   ├── models/          # Mongoose Schemas (User, Account, Transaction, FD, GoldLoan, VirtualCard)
    │   └── routes/          # Express REST API routes
    ├── index.js             # Server entry point (Port 5000)
    └── package.json
```

---

## ⚡ Quick Start (Single Command)

To run **both** the Express backend (`http://localhost:5000`) and the React frontend (`http://localhost:5173`) concurrently:

```bash
npm start
```
*or*
```bash
npm run dev
```

---

## 🔑 Demo User Credentials

Use these credentials to log in to the portal:
- **Username**: `admin`
- **Password**: `admin123`
- **Sample Savings Account**: `1002003001` *(Balance: ₹1,25,000.00)*
- **Minimum Opening Deposit**: `₹500.00`
