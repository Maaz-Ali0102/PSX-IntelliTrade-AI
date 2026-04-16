import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMarketSummary, getSectorPerformance, getRiskScores, getTopGainers, getTopLosers } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

function Analytics() {
    const [marketData, setMarketData] = useState(null);
    const [sectors, setSectors] = useState([]);
    const [risks, setRisks] = useState([]);
    const [gainers, setGainers] = useState([]);
    const [losers, setLosers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [market, sectorRes, riskRes, gainerRes, loserRes] = await Promise.all([
                getMarketSummary(),
                getSectorPerformance(),
                getRiskScores(),
                getTopGainers(),
                getTopLosers()
            ]);

            setMarketData(market.data.data);
            setSectors(sectorRes.data.data);
            setRisks(riskRes.data.data);
            setGainers(gainerRes.data.data);
            setLosers(loserRes.data.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Pie chart colors
    const COLORS = ['#00d4ff', '#00ff88', '#ff6b6b', '#ffd700', '#ff9500'];

    if (loading) return (
        <div style={styles.loading}>
            <h2 style={{ color: '#00d4ff' }}>Loading Analytics... 📊</h2>
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
                    <button onClick={() => navigate('/analytics')} style={{...styles.navBtn, background: 'rgba(0,212,255,0.2)'}}>Analytics</button>
                    {role === 'ADMIN' && (
                        <button onClick={() => navigate('/admin')} style={styles.navBtn}>Admin Panel</button>
                    )}
                </div>
                <button onClick={() => { localStorage.clear(); navigate('/'); }} style={styles.logoutBtn}>Logout</button>
            </nav>

            <div style={styles.content}>
                <h2 style={styles.title}>Market Analytics 📊</h2>

                {/* Market Summary Cards */}
                {marketData && (
                    <div style={styles.cards}>
                        <div style={styles.card}>
                            <p style={styles.cardLabel}>Total Stocks</p>
                            <h2 style={styles.cardValue}>{marketData.TOTAL_STOCKS}</h2>
                        </div>
                        <div style={{...styles.card, borderColor: '#00ff88'}}>
                            <p style={styles.cardLabel}>Gainers</p>
                            <h2 style={{...styles.cardValue, color: '#00ff88'}}>{marketData.GAINERS}</h2>
                        </div>
                        <div style={{...styles.card, borderColor: '#ff6b6b'}}>
                            <p style={styles.cardLabel}>Losers</p>
                            <h2 style={{...styles.cardValue, color: '#ff6b6b'}}>{marketData.LOSERS}</h2>
                        </div>
                        <div style={styles.card}>
                            <p style={styles.cardLabel}>Max Gain Today</p>
                            <h2 style={{...styles.cardValue, color: '#00ff88'}}>{marketData.MAX_GAIN}%</h2>
                        </div>
                        <div style={styles.card}>
                            <p style={styles.cardLabel}>Max Loss Today</p>
                            <h2 style={{...styles.cardValue, color: '#ff6b6b'}}>{marketData.MAX_LOSS}%</h2>
                        </div>
                    </div>
                )}

                <div style={styles.grid}>
                    {/* Sector Performance Bar Chart */}
                    <div style={styles.chartCard}>
                        <h3 style={styles.chartTitle}>Sector Performance</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={sectors}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="SECTOR" stroke="rgba(255,255,255,0.4)" tick={{fontSize: 11}} />
                                <YAxis stroke="rgba(255,255,255,0.4)" tick={{fontSize: 11}} />
                                <Tooltip
                                    contentStyle={{background: '#1a1a2e', border: '1px solid #00d4ff'}}
                                    labelStyle={{color: '#00d4ff'}}
                                />
                                <Bar dataKey="AVG_CHANGE" fill="#00d4ff" radius={[5,5,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Risk Distribution Pie Chart */}
                    <div style={styles.chartCard}>
                        <h3 style={styles.chartTitle}>Risk Distribution</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'High Risk', value: risks.filter(r => r.RISK_LEVEL === 'HIGH RISK').length },
                                        { name: 'Medium Risk', value: risks.filter(r => r.RISK_LEVEL === 'MEDIUM RISK').length },
                                        { name: 'Low Risk', value: risks.filter(r => r.RISK_LEVEL === 'LOW RISK').length },
                                    ]}
                                    cx="50%"
                                    cy="45%"
                                    outerRadius={70}
                                    dataKey="value"
                                >
                                    {COLORS.map((color, i) => (
                                        <Cell key={i} fill={color} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '12px' }} />
                                <Tooltip contentStyle={{background: '#1a1a2e', border: '1px solid #00d4ff'}} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Gainers Chart */}
                    <div style={styles.chartCard}>
                        <h3 style={styles.chartTitle}>🚀 Top Gainers Today</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={gainers}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="SYMBOL" stroke="rgba(255,255,255,0.4)" />
                                <YAxis stroke="rgba(255,255,255,0.4)" />
                                <Tooltip contentStyle={{background: '#1a1a2e', border: '1px solid #00ff88'}} />
                                <Bar dataKey="PCT_CHANGE" fill="#00ff88" radius={[5,5,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Losers Chart */}
                    <div style={styles.chartCard}>
                        <h3 style={styles.chartTitle}>📉 Top Losers Today</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={losers}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="SYMBOL" stroke="rgba(255,255,255,0.4)" />
                                <YAxis stroke="rgba(255,255,255,0.4)" />
                                <Tooltip contentStyle={{background: '#1a1a2e', border: '1px solid #ff6b6b'}} />
                                <Bar dataKey="PCT_CHANGE" fill="#ff6b6b" radius={[5,5,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Table */}
                <div style={styles.tableCard}>
                    <h3 style={styles.chartTitle}>Stock Risk Analysis (STDDEV Volatility)</h3>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Symbol</th>
                                <th style={styles.th}>Company</th>
                                <th style={styles.th}>Sector</th>
                                <th style={styles.th}>Volatility</th>
                                <th style={styles.th}>Avg Price</th>
                                <th style={styles.th}>Risk Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {risks.map((r, i) => (
                                <tr key={i}>
                                    <td style={styles.td}>
                                        <span style={styles.symbol}>{r.SYMBOL}</span>
                                    </td>
                                    <td style={styles.td}>{r.COMPANY_NAME}</td>
                                    <td style={styles.td}>{r.SECTOR}</td>
                                    <td style={styles.td}>{r.VOLATILITY}</td>
                                    <td style={styles.td}>₨{r.AVG_PRICE}</td>
                                    <td style={styles.td}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            background: r.RISK_LEVEL === 'HIGH RISK'
                                                ? 'rgba(255,107,107,0.2)'
                                                : r.RISK_LEVEL === 'MEDIUM RISK'
                                                ? 'rgba(255,215,0,0.2)'
                                                : 'rgba(0,255,136,0.2)',
                                            color: r.RISK_LEVEL === 'HIGH RISK'
                                                ? '#ff6b6b'
                                                : r.RISK_LEVEL === 'MEDIUM RISK'
                                                ? '#ffd700'
                                                : '#00ff88'
                                        }}>
                                            {r.RISK_LEVEL}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
    title: { color: 'white', marginBottom: '20px' },
    cards: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', marginBottom: '30px' },
    card: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '15px', padding: '20px', textAlign: 'center' },
    cardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '0 0 10px 0' },
    cardValue: { color: '#00d4ff', fontSize: '28px', margin: 0 },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' },
    chartCard: { background: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' },
    chartTitle: { color: '#00d4ff', marginBottom: '15px' },
    tableCard: { background: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { color: 'rgba(255,255,255,0.6)', padding: '12px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '13px' },
    td: { padding: '12px', color: 'white', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    symbol: { background: 'rgba(0,212,255,0.2)', color: '#00d4ff', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' },
};

export default Analytics;