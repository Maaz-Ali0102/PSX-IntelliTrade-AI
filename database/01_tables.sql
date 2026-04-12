-- =============================================
-- PSX IntelliTrade AI
-- 01_tables.sql - Database Tables
-- =============================================

-- 1. COMPANIES TABLE
CREATE TABLE companies (
    company_id      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    symbol          VARCHAR2(10) NOT NULL UNIQUE,
    company_name    VARCHAR2(100) NOT NULL,
    sector          VARCHAR2(50) NOT NULL,
    listed_date     DATE,
    is_active       NUMBER(1) DEFAULT 1
);

-- 2. STOCK PRICES TABLE
CREATE TABLE stock_prices (
    price_id        NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_id      NUMBER NOT NULL,
    price_date      DATE NOT NULL,
    open_price      NUMBER(10,2),
    high_price      NUMBER(10,2),
    low_price       NUMBER(10,2),
    close_price     NUMBER(10,2),
    volume          NUMBER,
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- 3. USERS TABLE
CREATE TABLE users (
    user_id         NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username        VARCHAR2(50) NOT NULL UNIQUE,
    email           VARCHAR2(100) NOT NULL UNIQUE,
    password_hash   VARCHAR2(200) NOT NULL,
    role            VARCHAR2(10) DEFAULT 'INVESTOR',
    created_at      DATE DEFAULT SYSDATE,
    is_active       NUMBER(1) DEFAULT 1
);

-- 4. PORTFOLIOS TABLE
CREATE TABLE portfolios (
    portfolio_id    NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id         NUMBER NOT NULL,
    portfolio_name  VARCHAR2(100) NOT NULL,
    created_at      DATE DEFAULT SYSDATE,
    total_invested  NUMBER(15,2) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 5. HOLDINGS TABLE
CREATE TABLE holdings (
    holding_id      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    portfolio_id    NUMBER NOT NULL,
    company_id      NUMBER NOT NULL,
    quantity        NUMBER DEFAULT 0,
    avg_buy_price   NUMBER(10,2) DEFAULT 0,
    total_invested  NUMBER(15,2) DEFAULT 0,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(portfolio_id),
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- 6. TRANSACTIONS TABLE
CREATE TABLE transactions (
    transaction_id  NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    portfolio_id    NUMBER NOT NULL,
    company_id      NUMBER NOT NULL,
    trans_type      VARCHAR2(4) NOT NULL,
    quantity        NUMBER NOT NULL,
    price           NUMBER(10,2) NOT NULL,
    total_amount    NUMBER(15,2) NOT NULL,
    trans_date      DATE DEFAULT SYSDATE,
    FOREIGN KEY (portfolio_id) REFERENCES portfolios(portfolio_id),
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- 7. ALERTS TABLE
CREATE TABLE alerts (
    alert_id        NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_id      NUMBER NOT NULL,
    alert_type      VARCHAR2(20) NOT NULL,
    message         VARCHAR2(200) NOT NULL,
    created_at      DATE DEFAULT SYSDATE,
    is_read         NUMBER(1) DEFAULT 0,
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);