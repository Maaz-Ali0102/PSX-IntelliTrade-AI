import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMarketSummary, getTopGainers, getTopLosers, getAlerts } from '../services/api';

function Dashboard() {
    const [marketData, setMarketData] = useState(null);
    const [gainers, setGainers] = useState([]);
    const [losers, setLosers] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    // Page load hone pe data fetch karo
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Sab APIs parallel mein call karo
            const [market, gainerRes, loserRes, alertRes] = await Promise.all([
                getMarketSummary(),
                getTopGainers(),
                getTopLosers(),
                getAlerts()
            ]);
            
            setMarketData(market.data.data);
            setGainers(gainerRes.data.data);
            setLosers(loserRes.data.data);
            setAlerts(alertRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (loading) return (
        <div style={styles.loading}>
            <h2 style={{color: '#00d4ff'}}>Loading PSX Data... 📈</h2>
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
                    <button onClick={() => navigate('/portfolio')} style={styles.navBtn}>Portfolio</button>
                    <button onClick={() => navigate('/transactions')} style={styles.navBtn}>Transactions</button>
                    <button onClick={() => navigate('/alerts')} style={styles.navBtn}>Alerts</button>
                    <button onClick={() => navigate('/analytics')} style={styles.navBtn}>Analytics</button>
                    {role === 'ADMIN' && (
                        <button onClick={() => navigate('/admin')} style={styles.navBtn}>Admin Panel</button>
                    )}
                </div>
                <div style={styles.userInfo}>
                    <span style={styles.username}>👤 {username}</span>
                    <span style={{ ...styles.role, color: role === 'ADMIN' ? '#ffd700' : '#00d4ff', background: role === 'ADMIN' ? 'rgba(255,215,0,0.2)' : 'rgba(0,212,255,0.2)' }}>{role}</span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </nav>

            {/* Main Content */}
            <div style={styles.content}>
                {/* Welcome */}
                <h2 style={styles.welcome}>Welcome back, {username}! 👋</h2>

                {/* Market Summary Cards */}
                {marketData && (
                    <div style={styles.cards}>
                        <div style={styles.card}>
                            <p style={styles.cardLabel}>Total Stocks</p>
                            <h2 style={styles.cardValue}>{marketData.TOTAL_STOCKS}</h2>
                        </div>
                        <div style={{...styles.card, borderColor: '#00ff88'}}>
                            <p style={styles.cardLabel}>Gainers Today</p>
                            <h2 style={{...styles.cardValue, color: '#00ff88'}}>{marketData.GAINERS}</h2>
                        </div>
                        <div style={{...styles.card, borderColor: '#ff6b6b'}}>
                            <p style={styles.cardLabel}>Losers Today</p>
                            <h2 style={{...styles.cardValue, color: '#ff6b6b'}}>{marketData.LOSERS}</h2>
                        </div>
                        <div style={styles.card}>
                            <p style={styles.cardLabel}>Avg Market Change</p>
                            <h2 style={{
                                ...styles.cardValue, 
                                color: marketData.AVG_CHANGE > 0 ? '#00ff88' : '#ff6b6b'
                            }}>
                                {marketData.AVG_CHANGE}%
                            </h2>
                        </div>
                    </div>
                )}

                {/* Gainers & Losers */}
                <div style={styles.tables}>
                    {/* Top Gainers */}
                    <div style={styles.tableCard}>
                        <h3 style={styles.tableTitle}>🚀 Top Gainers</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Symbol</th>
                                    <th style={styles.th}>Price</th>
                                    <th style={styles.th}>Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gainers.map((stock, i) => (
                                    <tr key={i}>
                                        <td style={styles.td}>{stock.SYMBOL}</td>
                                        <td style={styles.td}>₨{stock.TODAY_PRICE}</td>
                                        <td style={{...styles.td, color: '#00ff88'}}>
                                            +{stock.PCT_CHANGE}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Top Losers */}
                    <div style={styles.tableCard}>
                        <h3 style={styles.tableTitle}>📉 Top Losers</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Symbol</th>
                                    <th style={styles.th}>Price</th>
                                    <th style={styles.th}>Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                {losers.map((stock, i) => (
                                    <tr key={i}>
                                        <td style={styles.td}>{stock.SYMBOL}</td>
                                        <td style={styles.td}>₨{stock.TODAY_PRICE}</td>
                                        <td style={{...styles.td, color: '#ff6b6b'}}>
                                            {stock.PCT_CHANGE}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Alerts */}
                <div style={styles.alertsCard}>
                    <h3 style={styles.tableTitle}>🚨 Market Alerts</h3>
                    <div style={styles.alertsList}>
                        {alerts.slice(0, 5).map((alert, i) => (
                            <div key={i} style={{
                                ...styles.alertItem,
                                borderColor: alert.ALERT_TYPE === 'PRICE SPIKE' ? '#00ff88' : '#ff6b6b'
                            }}>
                                <span style={styles.alertSymbol}>{alert.SYMBOL}</span>
                                <span style={styles.alertType}>{alert.ALERT_TYPE}</span>
                                <span style={styles.alertMsg}>{alert.MESSAGE}</span>
                            </div>
                        ))}
                    </div>
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
    userInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
    username: { color: '#00d4ff' },
    role: { background: 'rgba(0,212,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', color: '#00d4ff' },
    logoutBtn: { background: '#ff6b6b', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
    content: { padding: '30px' },
    welcome: { color: 'white', marginBottom: '20px' },
    cards: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' },
    card: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '15px', padding: '20px', textAlign: 'center' },
    cardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '0 0 10px 0' },
    cardValue: { color: '#00d4ff', fontSize: '32px', margin: 0 },
    tables: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' },
    tableCard: { background: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' },
    tableTitle: { color: '#00d4ff', marginBottom: '15px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { color: 'rgba(255,255,255,0.6)', padding: '10px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '13px' },
    td: { padding: '10px', color: 'white', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    alertsCard: { background: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' },
    alertsList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    alertItem: { display: 'flex', gap: '15px', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid' },
    alertSymbol: { color: '#00d4ff', fontWeight: 'bold', minWidth: '60px' },
    alertType: { fontSize: '12px', padding: '3px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px' },
    alertMsg: { color: 'rgba(255,255,255,0.6)', fontSize: '13px' },
};

export default Dashboard;