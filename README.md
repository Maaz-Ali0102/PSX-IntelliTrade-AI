<div align="center">

  <h1>📈 PSX IntelliTrade AI</h1>

  <p>
    <strong>Intelligent Stock Portfolio & Market Analytics System</strong><br>
    <em>Built on Pakistan Stock Exchange (PSX) with Oracle Database 21c</em>
  </p>

  <p>
    Enterprise-grade portfolio management system with advanced analytics, <br>real-time alerts, and secure authentication for PSX traders & investors.
  </p>

  <div style="margin: 20px 0;">
    <a href="#-getting-started"><strong>Quick Start</strong></a>
    •
    <a href="#-features"><strong>Features</strong></a>
    •
    <a href="#-database-architecture"><strong>Architecture</strong></a>
    •
    <a href="#-contributing"><strong>Contribute</strong></a>
  </div>

  <br />

  <div>
    <img src="https://img.shields.io/badge/Oracle-F80000?style=for-the-badge&logo=oracle&logoColor=white" alt="Oracle" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/PL%2FSQL-FF6B6B?style=for-the-badge&logo=database&logoColor=white" alt="PL/SQL" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License: MIT" />
  </div>

</div>

---

## 📌 About the Project

PSX IntelliTrade AI is a **production-ready, enterprise-grade** stock portfolio management platform designed specifically for the Pakistan Stock Exchange. Built with Oracle Database 21c, Node.js, and React, it empowers traders and investors with intelligent analytics, real-time alerts, and comprehensive portfolio management tools.

> **Why This Project?**  
> This demonstrates advanced database design patterns, sophisticated PL/SQL optimization, secure authentication mechanisms, and full-stack application architecture suitable for modern fintech systems.

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 What's Included](#-whats-included)
- [🚀 Getting Started](#-getting-started)
- [📊 Database Architecture](#-database-architecture)
- [📁 Project Structure](#-project-structure)
- [👥 Default Accounts](#-default-accounts)
- [📸 Screenshots](#-screenshots)
- [🔧 System Configuration](#-system-configuration)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

---

## ✨ Features

### 🔐 **Security & Access Control**
- ✅ Secure user authentication with hashed passwords
- ✅ Role-based access control (RBAC) — Admin & Investor roles
- ✅ Session management with permission validation
- ✅ PL/SQL-based encrypted password storage

### 📊 **Portfolio Management**
- ✅ Multiple portfolio support per user
- ✅ Real-time portfolio valuation and updates
- ✅ Automatic holdings synchronization via database triggers
- ✅ Buy/Sell transaction recording with instant P&L calculation

### 📈 **Advanced Analytics Engine**
- ✅ **Profit & Loss Tracking** — Per-holding and portfolio-level gains/losses
- ✅ **Risk Scoring** — Volatility analysis using SQL `STDDEV()` function
- ✅ **Market Rankings** — Top gainers/losers via `RANK()` window function
- ✅ **Performance Metrics** — Period-over-period comparative analysis

### ⚠️ **Intelligent Alerting System**
- ✅ Real-time price spike detection
- ✅ Price drop monitoring and notifications
- ✅ Customizable alert thresholds per stock
- ✅ Event-driven architecture with trigger-based notifications

### 📉 **Market Intelligence**
- ✅ 365+ days of historical price data
- ✅ 21,900+ simulated trading records
- ✅ Daily OHLC (Open, High, Low, Close) data
- ✅ Trend analysis and performance benchmarking

---

## 🛠️ Tech Stack

| **Layer** | **Technology** | **Purpose** |
|-----------|----------------|-----------|
| **Database** | Oracle Database 21c XE | ACID-compliant, enterprise relational database |
| **Database Layer** | PL/SQL | Stored procedures, triggers, functions, analytics |
| **Backend Runtime** | Node.js 14+ | Asynchronous JavaScript runtime |
| **Backend Framework** | Express.js 4.x | RESTful API server |
| **Frontend Framework** | React 17+ | Dynamic user interface components |
| **Data Visualization** | Recharts | Professional chart library |
| **Authentication** | Session-based | Custom authentication layer |
| **Styling** | CSS3/Bootstrap | Responsive design |

---

## 📦 What's Included

### Database Layer
- ✔️ **20+ PSX-listed companies** with real-world stock data
- ✔️ **365-day** historical price records
- ✔️ **21,900+** simulated trading transactions
- ✔️ Complete PL/SQL architecture (procedures, triggers, functions)

### User Management
- ✔️ 3 pre-configured test accounts
- ✔️ Secure password hashing mechanism
- ✔️ Role-based access control system
- ✔️ Session tracking and validation

### Analytics Engine
- ✔️ Real-time P&L calculations
- ✔️ Volatility scoring via STDDEV
- ✔️ Ranking system via RANK function
- ✔️ Portfolio performance metrics

### Alert System
- ✔️ Price threshold monitoring
- ✔️ Spike/drop detection
- ✔️ Customizable notification rules
- ✔️ Event logging

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have installed:

- **Oracle Database 21c XE** — Download from [oracle.com](https://www.oracle.com/database/technologies/xe-downloads.html)
- **SQL Developer** — Oracle's IDE for database administration
- **Node.js 14+** — Backend runtime environment
- **npm** — Package manager for Node.js

### Step 1: Install Oracle Database 21c XE

1. Download Oracle Database 21c XE from the [official downloads page](https://www.oracle.com/database/technologies/xe-downloads.html)
2. Follow the installation wizard
3. Note the admin password during setup
4. Verify installation by opening SQL Developer

### Step 2: Create Database User

Open **SQL Developer** and execute the following commands:

```sql
-- Connect as SYSDBA first
ALTER SESSION SET CONTAINER = XEPDB1;
CREATE USER psx_user IDENTIFIED BY psx123;
GRANT ALL PRIVILEGES TO psx_user;
COMMIT;
```

> **Security Note:** For production, use a strong password instead of `psx123`.

### Step 3: Configure SQL Developer Connection

1. In SQL Developer, click **Connections** → **New Connection**
2. Enter these parameters:

| Parameter | Value |
|-----------|-------|
| **Connection Name** | PSX_Project |
| **Username** | psx_user |
| **Password** | psx123 |
| **Hostname** | localhost |
| **Port** | 1521 |
| **Service Name** | XEPDB1 |
| **Save Password** | ✓ Checked |

3. Click **Test** to verify the connection
4. Click **Save** and **Connect**

### Step 4: Initialize Database Schema

Execute the SQL scripts in **this exact order** inside your new connection:

```
1. database/01_tables.sql          → Core schema & table definitions
2. database/02_sequences.sql       → Auto-increment generators
3. database/03_seed_data.sql       → Sample companies & pricing data
4. database/04_auth_procedures.sql → Authentication functions
5. database/05_triggers.sql        → Portfolio automation triggers
6. database/06_analytics.sql       → Analytics views & functions
7. database/07_alerts.sql          → Alert system setup
```

**How to execute:**

1. Open each SQL file in SQL Developer
2. Press `Ctrl + Enter` to execute
3. Wait for confirmation message
4. Move to the next file

> ⚠️ **Important:** Executing out of order may cause dependency errors!

### Step 5: Verify Installation

Run this query to confirm successful setup:

```sql
SELECT 'Companies' tab_name, COUNT(*) cnt FROM companies
UNION ALL
SELECT 'Stock Prices', COUNT(*) FROM stock_prices
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Transactions', COUNT(*) FROM transactions;
```

You should see results showing all tables have data.

---

## 📊 Database Architecture

### Core Entity-Relationship Model

```
USERS
  ├── PORTFOLIOS
  │   ├── HOLDINGS
  │   │   └── STOCK_PRICES
  │   └── TRANSACTIONS
  │       └── COMPANIES
  └── ALERTS
      └── COMPANIES

COMPANIES
  └── STOCK_PRICES
```

### Database Modules Detailed

| Module | Entity | Records | Purpose |
|--------|--------|---------|---------|
| **Company Registry** | COMPANIES | 20+ | PSX-listed company data |
| **Market Data** | STOCK_PRICES | 21,900+ | Historical daily OHLC |
| **authentication** | USERS | 3+ | User accounts with roles |
| **Portfolio Module** | PORTFOLIOS | Variable | User investment collections |
| | HOLDINGS | Variable | Current stock positions |
| | TRANSACTIONS | Variable | Buy/Sell history |
| **Analytics** | MARKET_ANALYTICS | Real-time | Computed metrics |
| **Alerts** | ALERTS | Event-driven | Price monitoring |

### Key Tables

```sql
-- Core Structure Example
COMPANIES
├── ID (PK)
├── SYMBOL (UK)
├── NAME
└── ...

STOCK_PRICES
├── ID (PK)
├── COMPANY_ID (FK)
├── DATE
├── OPEN, HIGH, LOW, CLOSE
└── VOLUME

USERS
├── ID (PK)
├── USERNAME (UK)
├── PASSWORD_HASH
└── ROLE (ADMIN/INVESTOR)

PORTFOLIOS
├── ID (PK)
├── USER_ID (FK)
├── NAME
└── ...

TRANSACTIONS
├── ID (PK)
├── PORTFOLIO_ID (FK)
├── COMPANY_ID (FK)
├── TYPE (BUY/SELL)
├── QUANTITY, PRICE
└── TIMESTAMP
```

---

## 📁 Project Structure

```
PSX-IntelliTrade-AI/
│
├── 📂 database/
│   ├── 01_tables.sql              ← Schema definitions & constraints
│   ├── 02_sequences.sql           ← Auto-increment sequences
│   ├── 03_seed_data.sql           ← Companies & historical prices
│   ├── 04_auth_procedures.sql     ← Login & user management
│   ├── 05_triggers.sql            ← Auto-update triggers
│   ├── 06_analytics.sql           ← Views & analytical functions
│   └── 07_alerts.sql              ← Alert system & notifications
│
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── routes/                ← API endpoints
│   │   ├── controllers/           ← Business logic
│   │   ├── models/                ← Database models
│   │   └── middleware/            ← Authentication & validation
│   ├── server.js                  ← Entry point
│   ├── package.json               ← Dependencies
│   └── .env.example               ← Environment variables
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── components/            ← React components
│   │   ├── pages/                 ← Page components
│   │   ├── styles/                ← CSS files
│   │   └── App.jsx                ← Main app
│   ├── 📂 public/
│   │   └── index.html             ← HTML template
│   ├── package.json               ← Dependencies
│   └── .env.example               ← Environment variables
│
├── README.md                       ← This file
├── .gitignore                      ← Git ignore rules
├── LICENSE                         ← MIT License
└── package.json                    ← Root dependencies (optional)
```

---

## 👥 Default Accounts

The following test users are pre-configured in the database:

| Username | Password | Role | Department |
|----------|----------|------|-----------|
| `admin` | `admin123` | ADMIN | System Administration |
| `ali_investor` | `ali123` | INVESTOR | Individual Trader |
| `sara_investor` | `sara123` | INVESTOR | Individual Trader |

**Login Example:**
```
Username: ali_investor
Password: ali123
```

> ⚠️ **SECURITY WARNING**  
> These are development credentials only. **Change all passwords in production.**

---

##  📸 Screenshots

### Dashboard
```
[Coming Soon]
Portfolio Overview
├── Total Value: PKR 500,000
├── Holdings Count: 12
└── Today's Change: +2.5%

Charts
├── Portfolio Composition (Pie)
├── Price Trends (Line)
└── Performance Metrics (Bar)
```

### Alerts
```
[Coming Soon]
Active Alerts
├── ✓ KSE-100 up 3.2%
├── ✓ HBL down 1.5%
└── ✓ Transitioned to bullish
```

---

## 🔧 System Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend Configuration
NODE_ENV=development
PORT=5000
BACKEND_URL=http://localhost:5000

# Database Configuration
ORACLE_HOST=localhost
ORACLE_PORT=1521
ORACLE_DATABASE=XEPDB1
ORACLE_USER=psx_user
ORACLE_PASSWORD=psx123

# Frontend Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Session Configuration
SESSION_SECRET=your-secret-key-here
SESSION_TIMEOUT=3600

# Logging
LOG_LEVEL=debug
```

### Database Connection Pool

The backend uses a connection pool for performance:

```javascript
// Example: Backend connection setup
const oracledb = require('oracledb');

const pool = await oracledb.createPool({
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_DATABASE}`
});
```

---

## 🤝 Contributing

We welcome contributions! If you'd like to help improve PSX IntelliTrade AI:

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Make** your changes
4. **Test** thoroughly
5. **Commit** with clear messages (`git commit -m 'Add AmazingFeature'`)
6. **Push** to your branch (`git push origin feature/AmazingFeature`)
7. **Open** a Pull Request

### Development Guidelines

- Follow Oracle SQL best practices
- Write clear, documented PL/SQL code
- Include error handling
- Test all database changes
- Maintain backward compatibility
- Update documentation as needed

### Reporting Issues

Found a bug? Please create an issue with:
- Clear title
- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### You are free to:
- ✅ Use the code for personal and commercial projects
- ✅ Modify and distribute the code
- ✅ Use it for learning and educational purposes

### With the condition that:
- 📋 You include the original license and copyright notice

---

## 🙌 Acknowledgments

- **Oracle Database 21c** — Robust relational database engine
- **Pakistan Stock Exchange** — Market data and inspiration
- **Node.js & Express** — Backend runtime and framework
- **React & Recharts** — Frontend framework and visualization library
- **Open Source Community** — Tools and libraries that made this possible

---

<div align="center">

### Built with ❤️ for the PSX Trading Community

**Questions?** Open an issue or reach out to the community.

---

**Star ⭐ this repo if you found it helpful!**

</div>
