import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserPortfolios, getPortfolioHoldings, createPortfolio, buyStock, sellStock, getAllStocks } from '../services/api';

function Portfolio() {
    const [portfolios, setPortfolios] = useState([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const [holdings, setHoldings] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showTradeForm, setShowTradeForm] = useState(false);
    const [tradeType, setTradeType] = useState('BUY');
    const [newPortfolioName, setNewPortfolioName] = useState('');
    const [tradeData, setTradeData] = useState({ company_id: '', quantity: '', price: '' });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // LocalStorage se user_id lao
    const username = localStorage.getItem('username');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Pehle stocks lao phir portfolios
            const stocksRes = await getAllStocks();
            setStocks(stocksRes.data.data);

            // User ID dhundho username se
            // Hardcoded for now — backend mein fix karein ge
            const portfoliosRes = await getUserPortfolios(8);
            setPortfolios(portfoliosRes.data.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePortfolioClick = async (portfolio) => {
        setSelectedPortfolio(portfolio);
        try {
            const response = await getPortfolioHoldings(portfolio.PORTFOLIO_ID);
            setHoldings(response.data.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCreatePortfolio = async () => {
        try {
            await createPortfolio({
                user_id: 8,
                portfolio_name: newPortfolioName
            });
            setNewPortfolioName('');
            setShowCreateForm(false);
            fetchData();
            alert('Portfolio created!');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleTrade = async () => {
        try {
            const data = {
                portfolio_id: selectedPortfolio.PORTFOLIO_ID,
                company_id: tradeData.company_id,
                quantity: Number(tradeData.quantity),
                price: Number(tradeData.price)
            };

            if (tradeType === 'BUY') {
                await buyStock(data);
            } else {
                await sellStock(data);
            }

            setShowTradeForm(false);
            setTradeData({ company_id: '', quantity: '', price: '' });
            handlePortfolioClick(selectedPortfolio);
            alert(`${tradeType} successful!`);
        } catch (error) {
            console.error('Error:', error);
            alert('Trade failed!');
        }
    };

    if (loading) return (
        <div style={styles.loading}>
            <h2 style={{ color: '#00d4ff' }}>Loading Portfolio... 📊</h2>
        </div>
    );

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <h1 style={styles.logo}>📈 PSX IntelliTrade AI</h1>
                <div style={styles.navLinks}>
                    <button onClick={() => navigate('/dashboard')} style={styles.navBtn}>Dashboard</button>
                    <button onClick={() => navigate('/stocks')} style={styles.navBtn}>Stocks</button>
                    <button onClick={() => navigate('/portfolio')} style={{...styles.navBtn, background: 'rgba(0,212,255,0.2)'}}>Portfolio</button>
                    <button onClick={() => navigate('/analytics')} style={styles.navBtn}>Analytics</button>
                </div>
                <button onClick={() => { localStorage.clear(); navigate('/'); }} style={styles.logoutBtn}>Logout</button>
            </nav>

            <div style={styles.content}>
                <div style={styles.header}>
                    <h2 style={styles.title}>My Portfolios</h2>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        style={styles.createBtn}
                    >
                        + New Portfolio
                    </button>
                </div>

                {/* Create Portfolio Form */}
                {showCreateForm && (
                    <div style={styles.formCard}>
                        <h3 style={styles.formTitle}>Create New Portfolio</h3>
                        <div style={styles.formRow}>
                            <input
                                type="text"
                                placeholder="Portfolio name..."
                                value={newPortfolioName}
                                onChange={(e) => setNewPortfolioName(e.target.value)}
                                style={styles.input}
                            />
                            <button onClick={handleCreatePortfolio} style={styles.submitBtn}>
                                Create
                            </button>
                        </div>
                    </div>
                )}

                <div style={styles.mainGrid}>
                    {/* Portfolios List */}
                    <div style={styles.portfoliosList}>
                        <h3 style={styles.sectionTitle}>Your Portfolios</h3>
                        {portfolios.length === 0 ? (
                            <p style={styles.empty}>No portfolios yet — create one!</p>
                        ) : (
                            portfolios.map((p, i) => (
                                <div
                                    key={i}
                                    onClick={() => handlePortfolioClick(p)}
                                    style={{
                                        ...styles.portfolioItem,
                                        border: selectedPortfolio?.PORTFOLIO_ID === p.PORTFOLIO_ID
                                            ? '1px solid #00d4ff'
                                            : '1px solid rgba(255,255,255,0.1)'
                                    }}
                                >
                                    <h4 style={styles.portfolioName}>{p.PORTFOLIO_NAME}</h4>
                                    <p style={styles.portfolioDate}>
                                        Created: {new Date(p.CREATED_AT).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Holdings */}
                    {selectedPortfolio && (
                        <div style={styles.holdingsCard}>
                            <div style={styles.holdingsHeader}>
                                <h3 style={styles.sectionTitle}>
                                    {selectedPortfolio.PORTFOLIO_NAME} — Holdings
                                </h3>
                                <button
                                    onClick={() => setShowTradeForm(!showTradeForm)}
                                    style={styles.tradeBtn}
                                >
                                    Trade Stock
                                </button>
                            </div>

                            {/* Trade Form */}
                            {showTradeForm && (
                                <div style={styles.tradeForm}>
                                    <div style={styles.tradeTypeRow}>
                                        <button
                                            onClick={() => setTradeType('BUY')}
                                            style={{
                                                ...styles.typeBtn,
                                                background: tradeType === 'BUY' ? '#00ff88' : 'transparent',
                                                color: tradeType === 'BUY' ? '#000' : '#00ff88'
                                            }}
                                        >BUY</button>
                                        <button
                                            onClick={() => setTradeType('SELL')}
                                            style={{
                                                ...styles.typeBtn,
                                                background: tradeType === 'SELL' ? '#ff6b6b' : 'transparent',
                                                color: tradeType === 'SELL' ? '#000' : '#ff6b6b'
                                            }}
                                        >SELL</button>
                                    </div>
                                    <select
                                        value={tradeData.company_id}
                                        onChange={(e) => setTradeData({...tradeData, company_id: e.target.value})}
                                        style={styles.select}
                                    >
                                        <option value="">Select Stock</option>
                                        {stocks.map((s, i) => (
                                            <option key={i} value={s.COMPANY_ID}>
                                                {s.SYMBOL} — ₨{s.CURRENT_PRICE}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Quantity"
                                        value={tradeData.quantity}
                                        onChange={(e) => setTradeData({...tradeData, quantity: e.target.value})}
                                        style={styles.input}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price per share"
                                        value={tradeData.price}
                                        onChange={(e) => setTradeData({...tradeData, price: e.target.value})}
                                        style={styles.input}
                                    />
                                    <button onClick={handleTrade} style={styles.submitBtn}>
                                        Execute {tradeType}
                                    </button>
                                </div>
                            )}

                            {/* Holdings Table */}
                            {holdings.length === 0 ? (
                                <p style={styles.empty}>No holdings yet — buy some stocks!</p>
                            ) : (
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>Symbol</th>
                                            <th style={styles.th}>Qty</th>
                                            <th style={styles.th}>Avg Price</th>
                                            <th style={styles.th}>Current</th>
                                            <th style={styles.th}>P&L</th>
                                            <th style={styles.th}>P&L %</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {holdings.map((h, i) => (
                                            <tr key={i}>
                                                <td style={styles.td}>
                                                    <span style={styles.symbol}>{h.SYMBOL}</span>
                                                </td>
                                                <td style={styles.td}>{h.QUANTITY}</td>
                                                <td style={styles.td}>₨{h.AVG_BUY_PRICE}</td>
                                                <td style={styles.td}>₨{h.CURRENT_PRICE}</td>
                                                <td style={{
                                                    ...styles.td,
                                                    color: h.PROFIT_LOSS >= 0 ? '#00ff88' : '#ff6b6b'
                                                }}>
                                                    ₨{h.PROFIT_LOSS}
                                                </td>
                                                <td style={{
                                                    ...styles.td,
                                                    color: h.PL_PERCENTAGE >= 0 ? '#00ff88' : '#ff6b6b'
                                                }}>
                                                    {h.PL_PERCENTAGE}%
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#0a0a1a', color: 'white' },
    loading: { minHeight: '100vh', background: '#0a0a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    navbar: { background: 'rgba(255,255,255,0.05)', padding: '15px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' },
    logo: { color: '#00d4ff', margin: 0, fontSize: '20px' },
    navLinks: { display: 'flex', gap: '10px' },
    navBtn: { background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
    logoutBtn: { background: '#ff6b6b', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
    content: { padding: '30px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    title: { color: 'white', margin: 0 },
    createBtn: { background: 'linear-gradient(135deg, #00d4ff, #0099ff)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
    formCard: { background: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(0,212,255,0.3)' },
    formTitle: { color: '#00d4ff', marginBottom: '15px' },
    formRow: { display: 'flex', gap: '10px' },
    mainGrid: { display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' },
    portfoliosList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    sectionTitle: { color: '#00d4ff', marginBottom: '15px' },
    empty: { color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '20px' },
    portfolioItem: { background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px', cursor: 'pointer' },
    portfolioName: { color: 'white', margin: '0 0 5px 0' },
    portfolioDate: { color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: 0 },
    holdingsCard: { background: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' },
    holdingsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    tradeBtn: { background: 'linear-gradient(135deg, #00ff88, #00cc66)', border: 'none', color: '#000', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
    tradeForm: { background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
    tradeTypeRow: { display: 'flex', gap: '10px' },
    typeBtn: { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid', cursor: 'pointer', fontWeight: 'bold' },
    select: { padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px' },
    input: { padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px' },
    submitBtn: { padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #00d4ff, #0099ff)', color: 'white', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { color: 'rgba(255,255,255,0.6)', padding: '12px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '13px' },
    td: { padding: '12px', color: 'white', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    symbol: { background: 'rgba(0,212,255,0.2)', color: '#00d4ff', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' },
};

export default Portfolio;