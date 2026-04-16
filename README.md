<div align="center">

# PSX IntelliTrade AI

### Intelligent Stock Portfolio & Market Analytics System for Pakistan Stock Exchange

[![Oracle](https://img.shields.io/badge/Oracle-21c_XE-F80000?logo=oracle&logoColor=white)](https://www.oracle.com/database/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## Table of Contents
- [1. Overview](#1-overview)
- [2. Live Demo](#2-live-demo)
- [3. Features](#3-features)
- [4. Tech Stack](#4-tech-stack)
- [5. System Architecture](#5-system-architecture)
- [6. Database Design](#6-database-design)
- [7. PL/SQL Components](#7-plsql-components)
- [8. Analytics and Formulas](#8-analytics-and-formulas)
- [9. API Endpoints](#9-api-endpoints)
- [10. Installation and Setup](#10-installation-and-setup)
- [11. Default Credentials](#11-default-credentials)
- [12. Project Structure](#12-project-structure)
- [13. Key Concepts Demonstrated](#13-key-concepts-demonstrated)
- [14. Contributing](#14-contributing)
- [15. License](#15-license)

---

## 1. Overview
PSX IntelliTrade AI is a full-stack trading intelligence platform designed around Pakistan Stock Exchange workflows. It combines a modern React frontend, a Node.js and Express backend, and an Oracle 21c XE database with PL/SQL-driven business logic.

This project was built to demonstrate how advanced database capabilities can power real-world fintech features while still providing a clean, responsive, role-based web experience.

### Why it was built
- To bridge the gap between raw market data and actionable investment insights.
- To demonstrate production-style Oracle SQL and PL/SQL usage in a portfolio-grade project.
- To provide an end-to-end reference system for authentication, portfolio management, analytics, and administration.

### Problems it solves
- Fragmented stock analysis and portfolio tracking.
- Lack of integrated risk scoring, gainers/losers, and sector-level intelligence.
- Manual holdings reconciliation and weak validation in trade flows.
- Missing operational admin controls for user lifecycle and alert management.

### Who can use it
- Investors: to manage portfolios, buy/sell stocks, monitor P and L, and track alerts.
- Admins: to monitor system health, manage users and roles, and generate market alerts.

---

## 2. Live Demo
Local development URLs:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

To publish a live demo, deploy the frontend on Vercel/Netlify and backend on Render/Azure/AWS with Oracle connectivity.

---

## 3. Features

### Authentication and Security
- User registration with password hashing (RAWTOHEX).
- Secure login via Oracle PL/SQL function.
- Role-based access control (ADMIN and INVESTOR).
- Protected routes in frontend.
- Account activation and deactivation.

### Stock Market
- 20 PSX listed companies across 6 sectors.
- 21,900 rows of simulated 365-day price history.
- Real-time stock price display.
- Stock search and sector filtering.
- Individual stock detail with 7D, 30D, 90D, 365D charts.
- Stock comparison for up to 3 stocks.

### Portfolio Management
- Multiple portfolios per user.
- Buy and sell with validation:
  - Cannot sell more than owned.
  - Price cannot be zero.
  - Quantity cannot be zero.
- Auto holdings update via Oracle trigger.
- Duplicate portfolio name prevention.
- Portfolio summary cards (Total Value, P and L, Risk).
- Portfolio growth chart for last 30 days.

### Analytics and Intelligence
- Volatility-based risk scoring using STDDEV.
- Top gainers and losers ranking using RANK.
- Sector performance analysis.
- Price spike and drop alerts for changes above 5 percent.
- Market summary dashboard.

### Admin Panel
- System statistics.
- User management (activate and deactivate).
- Role management.
- Generate market alerts.
- All transactions overview.

### Transaction History
- Complete buy and sell history per user.
- Filter by BUY and SELL.
- Total transaction count.

### Alerts System
- Dedicated alerts page.
- Filter by PRICE SPIKE and PRICE DROP.
- Mark alerts as read.
- Unread count badge.

---

## 4. Tech Stack

### Frontend
- React 18
- React Router DOM
- Recharts
- Axios

### Backend
- Node.js
- Express.js

### Database
- Oracle Database 21c XE

### Tools
- Oracle SQL Developer
- Visual Studio Code

---

## 5. System Architecture
PSX IntelliTrade AI follows a 3-tier architecture:

```text
React Frontend (Port 3000)
        <-> HTTP / REST APIs <->
Node.js + Express Backend (Port 5000)
        <-> OracleDB Driver <->
Oracle Database 21c XE (Port 1521)
```

### Architecture Notes
- Frontend handles role-based UI, charts, table filters, and route protection.
- Backend enforces trade validation, API orchestration, and database communication.
- Oracle layer handles transactional consistency and analytics through views, procedures, functions, and triggers.

---

## 6. Database Design

### Tables (7)
1. COMPANIES - PSX listed companies  
   Columns: company_id, symbol, company_name, sector, listed_date, is_active

2. STOCK_PRICES - Daily price history  
   Columns: price_id, company_id, price_date, open_price, high_price, low_price, close_price, volume

3. USERS - System users  
   Columns: user_id, username, email, password_hash, role, created_at, is_active

4. PORTFOLIOS - User portfolios  
   Columns: portfolio_id, user_id, portfolio_name, created_at, total_invested

5. HOLDINGS - Current stock holdings  
   Columns: holding_id, portfolio_id, company_id, quantity, avg_buy_price, total_invested

6. TRANSACTIONS - Buy and sell history  
   Columns: transaction_id, portfolio_id, company_id, trans_type, quantity, price, total_amount, trans_date

7. ALERTS - Market alerts  
   Columns: alert_id, company_id, alert_type, message, created_at, is_read

### Views (3)
1. PORTFOLIO_ANALYTICS
- Calculates portfolio value, P and L, P and L percent.
- Uses RANK to fetch latest stock price.

2. STOCK_RISK
- Calculates volatility using STDDEV.
- Assigns HIGH RISK, MEDIUM RISK, LOW RISK levels.

3. TOP_GAINERS_LOSERS
- Compares today versus yesterday prices.
- Uses RANK for gainers and losers.
- Calculates percentage change.

### Database Updates
1. portfolio_analytics VIEW updated:
- Added CASE WHEN to prevent division by zero.
- When total_invested = 0, P and L percent = 0.

2. generate_alerts PROCEDURE updated:
- Added duplicate prevention.
- Checks whether today's alerts already exist.
- If yes, skips generation.
- Prevents duplicate same-day alerts.

3. TRG_UPDATE_HOLDINGS TRIGGER:
- After SELL, if quantity becomes 0.
- Backend DELETE removes holding.
- Keeps holdings table clean.

4. Trade Validation (Backend):
- Cannot sell more shares than owned.
- Price cannot be 0.
- Quantity cannot be 0.
- Returns proper error messages.

---

## 7. PL/SQL Components

### Stored Procedures (2)
1. REGISTER_USER(username, email, password, role)
- Hashes password using RAWTOHEX(UTL_RAW.CAST_TO_RAW()).
- Inserts user in USERS table.
- Handles duplicate username and email exceptions.

2. GENERATE_ALERTS()
- Checks if alerts are already generated today.
- Reads TOP_GAINERS_LOSERS view.
- Inserts PRICE SPIKE alerts where change greater than +5 percent.
- Inserts PRICE DROP alerts where change less than -5 percent.
- Prevents duplicate daily alerts.

### Function (1)
1. PSX_LOGIN(username, password) RETURN VARCHAR2
- Verifies hashed password.
- Returns SUCCESS:ROLE or ERROR:message.
- Checks user is active with is_active = 1.

### Trigger (1)
1. TRG_UPDATE_HOLDINGS (AFTER INSERT ON TRANSACTIONS)
- BUY path:
  - Creates new holding or updates existing.
  - Recalculates average buy price.
  - Updates total invested.
- SELL path:
  - Reduces quantity.
  - Updates total invested proportionally.

### Sequences (7)
- seq_company_id
- seq_price_id
- seq_user_id
- seq_portfolio_id
- seq_holding_id
- seq_transaction_id
- seq_alert_id

---

## 8. Analytics and Formulas

### Risk Score
- Risk = STDDEV(close_price) over 365 days
- HIGH RISK when STDDEV > 15
- MEDIUM RISK when STDDEV > 8
- LOW RISK when STDDEV <= 8

### Portfolio Value
- Current Value = Quantity * Current Price

### Profit and Loss
- P and L = Current Value - Total Invested
- P and L percent = (P and L / Total Invested) * 100

### Average Buy Price
- Avg Price = Total Invested / Total Quantity

### Price Change
- Change percent = (Today Price - Yesterday Price) / Yesterday Price * 100

### Alert Trigger
- PRICE SPIKE when Change percent > +5 percent
- PRICE DROP when Change percent < -5 percent

---

## 9. API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/user/:username | Get user details |

### Stocks
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/stocks | Get all stocks with current price |
| GET | /api/stocks/:symbol/detail | Get stock detail |
| GET | /api/stocks/:symbol/history | Get price history |
| GET | /api/stocks/gainers | Top 5 gainers |
| GET | /api/stocks/losers | Top 5 losers |
| GET | /api/stocks/risk | All risk scores |

### Portfolio
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/portfolio/create | Create portfolio |
| GET | /api/portfolio/:user_id | Get user portfolios |
| GET | /api/portfolio/:portfolio_id/holdings | Get holdings |
| GET | /api/portfolio/:portfolio_id/summary | Portfolio summary |
| GET | /api/portfolio/:portfolio_id/risk | Portfolio risk |
| GET | /api/portfolio/:portfolio_id/growth | Growth chart data |
| GET | /api/portfolio/:user_id/transactions | Transaction history |
| POST | /api/portfolio/buy | Buy stock (with validation) |
| POST | /api/portfolio/sell | Sell stock (with validation) |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/analytics/market | Market summary |
| GET | /api/analytics/sectors | Sector performance |
| GET | /api/analytics/alerts | All alerts |
| PUT | /api/analytics/alerts/:id/read | Mark alert read |
| GET | /api/analytics/risk/:portfolio_id | Portfolio risk |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/admin/stats | System statistics |
| GET | /api/admin/users | All users |
| GET | /api/admin/transactions | All transactions |
| POST | /api/admin/generate-alerts | Generate alerts |
| PUT | /api/admin/users/:id/role | Change user role |
| PUT | /api/admin/users/:id/deactivate | Deactivate user |
| PUT | /api/admin/users/:id/activate | Activate user |

---

## 10. Installation and Setup

### Prerequisites
- Oracle Database 21c XE
- Node.js v18+
- Oracle SQL Developer

### Step 1 - Oracle Setup
```sql
ALTER SESSION SET CONTAINER = XEPDB1;
CREATE USER psx_user IDENTIFIED BY psx123;
GRANT ALL PRIVILEGES TO psx_user;
```

### Step 2 - SQL Developer Connection
- Connection Name: PSX_Project
- Username: psx_user
- Password: psx123
- Hostname: localhost
- Port: 1521
- Service Name: XEPDB1

### Step 3 - Run SQL files in order
```text
database/01_tables.sql
database/02_sequences.sql
database/03_seed_data.sql
database/04_auth_procedures.sql
database/05_triggers.sql
database/06_analytics.sql
database/07_alerts.sql
```

### Step 4 - Backend
```bash
cd backend
npm install
```

Create `.env` in backend folder:
```env
DB_USER=psx_user
DB_PASSWORD=psx123
DB_HOST=localhost
DB_PORT=1521
DB_SERVICE=XEPDB1
PORT=5000
```

Run backend:
```bash
node server.js
```

### Step 5 - Frontend
```bash
cd frontend
npm install
npm start
```

---

## 11. Default Credentials

| Username | Password | Role |
|---|---|---|
| admin | admin123 | ADMIN |
| ali_investor | ali123 | INVESTOR |
| sara_investor | sara123 | INVESTOR |

---

## 12. Project Structure
```text
PSX IntelliTrade AI/
├── README.md
├── backend/
│   ├── db.js
│   ├── package.json
│   ├── server.js
│   └── routes/
│       ├── analytics.js
│       ├── auth.js
│       ├── portfolio.js
│       └── stocks.js
├── database/
│   ├── 01_tables.sql
│   ├── 02_sequences.sql
│   ├── 03_seed_data.sql
│   ├── 04_auth_procedures.sql
│   ├── 05_triggers.sql
│   ├── 06_analytics.sql
│   └── 07_alerts.sql
└── frontend/
    ├── package.json
    ├── README.md
    ├── public/
    │   ├── index.html
    │   ├── manifest.json
    │   └── robots.txt
    └── src/
        ├── App.css
        ├── App.js
        ├── App.test.js
        ├── index.css
        ├── index.js
        ├── reportWebVitals.js
        ├── setupTests.js
        ├── components/
        ├── pages/
        │   ├── Admin.js
        │   ├── Alerts.js
        │   ├── Analytics.js
        │   ├── Dashboard.js
        │   ├── Login.js
        │   ├── Portfolio.js
        │   ├── Register.js
        │   ├── Stocks.js
        │   └── Transactions.js
        └── services/
            └── api.js
```

---

## 13. Key Concepts Demonstrated
- Advanced Oracle SQL and PL/SQL
- Triggers for automation
- Views for complex calculations
- Stored procedures for business logic
- Analytic functions (RANK, STDDEV, AVG, LAG)
- RESTful API design
- React component architecture
- JWT-less session management
- Role-based access control

---

## 14. Contributing
Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit clear and focused changes.
4. Add tests or validation notes where possible.
5. Open a pull request with a concise description.

---

## 15. License
This project is licensed under the MIT License. See the LICENSE file for details.
