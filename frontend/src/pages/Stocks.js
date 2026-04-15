import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllStocks, getStockHistory } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Stocks() {
    const [stocks, setStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            const response = await getAllStocks();
            setStocks(response.data.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStockClick = async (stock) => {
        setSelectedStock(stock);
        try {
            const response = await getStockHistory(stock.SYMBOL);
            // Chart ke liye data format karo
            const chartData = response.data.data.map(item => ({
                date: new Date(item.PRICE_DATE).toLocaleDateString(),
                price: item.CLOSE_PRICE
            }));
            setHistory(chartData);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Search filter
    const filteredStocks = stocks.filter(stock =>
        stock.SYMBOL.toLowerCase().includes(search.toLowerCase()) ||
        stock.COMPANY_NAME.toLowerCase().includes(search.toLowerCase()) ||
        stock.SECTOR.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div style={styles.loading}>
            <h2 style={{ color: '#00d4ff' }}>Loading Stocks... 📈</h2>
        </div>
    );

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <h1 style={styles.logo}>📈 PSX IntelliTrade AI</h1>
                <div style={styles.navLinks}>
                    <button onClick={() => navigate('/dashboard')} style={styles.navBtn}>Dashboard</button>
                    <button onClick={() => navigate('/stocks')} style={{...styles.navBtn, background: 'rgba(0,212,255,0.2)'}}>Stocks</button>
                    <button onClick={() => navigate('/portfolio')} style={styles.navBtn}>Portfolio</button>
                    <button onClick={() => navigate('/analytics')} style={styles.navBtn}>Analytics</button>
                </div>
                <button onClick={() => { localStorage.clear(); navigate('/'); }} style={styles.logoutBtn}>Logout</button>
            </nav>

            <div style={styles.content}>
                <h2 style={styles.title}>PSX Listed Stocks</h2>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="🔍 Search by symbol, company or sector..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.search}
                />

                <div style={styles.mainGrid}>
                    {/* Stocks Table */}
                    <div style={styles.tableCard}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Symbol</th>
                                    <th style={styles.th}>Company</th>
                                    <th style={styles.th}>Sector</th>
                                    <th style={styles.th}>Price</th>
                                    <th style={styles.th}>Volume</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStocks.map((stock, i) => (
                                    <tr
                                        key={i}
                                        onClick={() => handleStockClick(stock)}
                                        style={{
                                            ...styles.tr,
                                            background: selectedStock?.SYMBOL === stock.SYMBOL
                                                ? 'rgba(0,212,255,0.1)'
                                                : 'transparent'
                                        }}
                                    >
                                        <td style={styles.td}>
                                            <span style={styles.symbol}>{stock.SYMBOL}</span>
                                        </td>
                                        <td style={styles.td}>{stock.COMPANY_NAME}</td>
                                        <td style={styles.td}>
                                            <span style={styles.sector}>{stock.SECTOR}</span>
                                        </td>
                                        <td style={styles.td}>
                                            ₨{stock.CURRENT_PRICE}
                                        </td>
                                        <td style={styles.td}>
                                            {Number(stock.VOLUME).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Stock Detail + Chart */}
                    {selectedStock && (
                        <div style={styles.detailCard}>
                            <h3 style={styles.detailTitle}>
                                {selectedStock.SYMBOL} — {selectedStock.COMPANY_NAME}
                            </h3>

                            {/* Stock Info */}
                            <div style={styles.infoGrid}>
                                <div style={styles.infoItem}>
                                    <p style={styles.infoLabel}>Current Price</p>
                                    <p style={styles.infoValue}>₨{selectedStock.CURRENT_PRICE}</p>
                                </div>
                                <div style={styles.infoItem}>
                                    <p style={styles.infoLabel}>Open</p>
                                    <p style={styles.infoValue}>₨{selectedStock.OPEN_PRICE}</p>
                                </div>
                                <div style={styles.infoItem}>
                                    <p style={styles.infoLabel}>High</p>
                                    <p style={{...styles.infoValue, color: '#00ff88'}}>₨{selectedStock.HIGH_PRICE}</p>
                                </div>
                                <div style={styles.infoItem}>
                                    <p style={styles.infoLabel}>Low</p>
                                    <p style={{...styles.infoValue, color: '#ff6b6b'}}>₨{selectedStock.LOW_PRICE}</p>
                                </div>
                                <div style={styles.infoItem}>
                                    <p style={styles.infoLabel}>Sector</p>
                                    <p style={styles.infoValue}>{selectedStock.SECTOR}</p>
                                </div>
                                <div style={styles.infoItem}>
                                    <p style={styles.infoLabel}>Volume</p>
                                    <p style={styles.infoValue}>{Number(selectedStock.VOLUME).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Price Chart */}
                            <h4 style={styles.chartTitle}>30 Day Price History</h4>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" tick={{fontSize: 10}} />
                                    <YAxis stroke="rgba(255,255,255,0.4)" tick={{fontSize: 10}} />
                                    <Tooltip
                                        contentStyle={{background: '#1a1a2e', border: '1px solid #00d4ff'}}
                                        labelStyle={{color: '#00d4ff'}}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#00d4ff"
                                        dot={false}
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
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
    title: { color: 'white', marginBottom: '20px' },
    search: { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '16px', marginBottom: '20px', boxSizing: 'border-box' },
    mainGrid: { display: 'grid', gridTemplateColumns: selectedStock => selectedStock ? '1fr 1fr' : '1fr', gap: '20px' },
    tableCard: { background: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { color: 'rgba(255,255,255,0.6)', padding: '12px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '13px' },
    tr: { cursor: 'pointer', transition: 'background 0.2s' },
    td: { padding: '12px', color: 'white', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    symbol: { background: 'rgba(0,212,255,0.2)', color: '#00d4ff', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' },
    sector: { background: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: '20px', fontSize: '12px' },
    detailCard: { background: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '20px', border: '1px solid rgba(0,212,255,0.3)' },
    detailTitle: { color: '#00d4ff', marginBottom: '20px' },
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' },
    infoItem: { background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px', textAlign: 'center' },
    infoLabel: { color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '0 0 5px 0' },
    infoValue: { color: 'white', fontSize: '16px', fontWeight: 'bold', margin: 0 },
    chartTitle: { color: 'rgba(255,255,255,0.8)', marginBottom: '10px' },
};

export default Stocks;