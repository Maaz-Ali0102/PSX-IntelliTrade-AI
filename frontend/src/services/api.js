import axios from 'axios';

// Backend ka base URL
const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// ================================
// AUTH APIs
// ================================
export const loginUser = (data) => 
    API.post('/auth/login', data);

export const registerUser = (data) => 
    API.post('/auth/register', data);

// ================================
// STOCKS APIs
// ================================
export const getAllStocks = () => 
    API.get('/stocks');

export const getStockHistory = (symbol) => 
    API.get(`/stocks/${symbol}/history`);

export const getTopGainers = () => 
    API.get('/stocks/gainers');

export const getTopLosers = () => 
    API.get('/stocks/losers');

export const getRiskScores = () => 
    API.get('/stocks/risk');

// ================================
// PORTFOLIO APIs
// ================================
export const getUserPortfolios = (userId) => 
    API.get(`/portfolio/${userId}`);

export const createPortfolio = (data) => 
    API.post('/portfolio/create', data);

export const getPortfolioHoldings = (portfolioId) => 
    API.get(`/portfolio/${portfolioId}/holdings`);

export const buyStock = (data) => 
    API.post('/portfolio/buy', data);

export const sellStock = (data) => 
    API.post('/portfolio/sell', data);

// ================================
// ANALYTICS APIs
// ================================
export const getMarketSummary = () => 
    API.get('/analytics/market');

export const getSectorPerformance = () => 
    API.get('/analytics/sectors');

export const getAlerts = () => 
    API.get('/analytics/alerts');

export const getPortfolioRisk = (portfolioId) => 
    API.get(`/analytics/risk/${portfolioId}`);