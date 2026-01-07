# 🎰 GameHub Arcade & Casino

**A high-performance, provably fair crypto gambling and arcade platform built on Supabase.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-production--ready-green.svg)
![Stack](https://img.shields.io/badge/stack-Supabase_|_React_|_Vite-3ecf8e.svg)

## 📖 Overview

GameHub is a hybrid gaming platform that demonstrates a robust **"Thick Database, Thin Edge"** architecture. It features a strict separation between:

- **🦁 Casino Zone:** Authenticated, high-stakes crypto betting with real financial transactions, wallet management, and provably fair RNG.
- **🕹️ Arcade Zone:** Public, free-to-play mini-games with no authentication required.

The system relies on PostgreSQL for strict state management, locking, and financial integrity, while using Supabase Edge Functions for stateless, secure orchestration.

---

## 🏗️ Architecture

### "Thick Database, Thin Edge" Pattern
- **Database (PostgreSQL):** The Single Source of Truth. Handles all balance mutations, transaction logging, betting locks, and state transitions via ACID-compliant RPCs.
- **Edge Functions (Deno):** Stateless orchestration layer. Handles authentication, input validation (Zod), and external API calls (e.g., crypto pricing), but *never* modifies balances directly.
- **Frontend (React + Vite):** A modern, responsive UI with strict route guards separating the Casino and Arcade experiences.

### Key Components

| Component | Responsibility | Tech |
|-----------|----------------|------|
| **DB Layer** | Balance locking, Transaction logs, Provably Fair Seeds | PostgreSQL (Supabase) |
| **Edge Layer** | Betting logic, RNG calculation, Auth validation | Deno, TypeScript |
| **UI Layer** | Game rendering, Wallet UI, Animations | React, Tailwind, Framer Motion |

---

## ✨ Features

### 🏦 Casino Module (`/casino`)
- **Authentication:** Secure login/signup via Supabase Auth.
- **Wallet System:** Support for **BTC, ETH, USDT, SOL** and **DEMO** currencies.
- **Provably Fair:** HMAC-SHA256 based RNG locally verifiable by clients.
- **Realtime Modes:** Toggle seamlessly between `🎮 DEMO` and `💰 REAL` modes.
- **Games:** Plinko, Crash, Mines, Roulette, and more.

### 🎮 Arcade Module (`/arcade`)
- **No Login Required:** Instant play access.
- **Zero Risk:** No real money involvement.
- **Performance:** Optimized for speed and accessibility.

### 🛡️ Admin & Security
- **Role-Based Access:** Standard User, Admin, Finance Admin, Super Admin.
- **Emergency Controls:** "Kill Switch" to immediately halt all betting via Edge Function + Realtime Broadcast.
- **Withdrawal Workflow:** Dual-approval system for high-value withdrawals (> $5,000).

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Supabase Account & Project

### 1. Clone the Repository
```bash
git clone https://github.com/thealbinantony7/GamehubArcade.git
cd GamehubArcade
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 🌩️ Edge Functions

The betting engine is powered by critical server-side functions:

| Function | Endpoint | Purpose |
|----------|----------|---------|
| `place-bet` | `/v1/place-bet` | Validates balance, calculates RNG result, commits transaction. |
| `rotate-seed` | `/v1/rotate-seed` | Rotates server seed for Provably Fair auditing. |
| `withdrawal-request` | `/v1/withdrawal-request` | Initiates a crypto withdrawal. |
| `approve-withdrawal` | `/v1/approve-withdrawal` | Finance Admin approval logic. |
| `emergency-stop` | `/v1/emergency-stop` | **Super Admin only**. Halts all platform betting. |

---

## ⚠️ Disclaimer

This project is for **educational and portfolio purposes only**. It involves real-money gambling logic.
- Ensure you comply with local laws and regulations regarding online gambling before deploying for public use.
- The "Provably Fair" algorithm is standard, but no external audit has been performed. Use at your own risk.

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Built with ❤️ by **Albin Antony**
