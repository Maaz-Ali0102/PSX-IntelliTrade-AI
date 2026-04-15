import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

function Login() {
    // State = Component ka data store karta hai
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Navigate = Page change karne ke liye
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Page reload mat karo
        setLoading(true);
        setError('');
        
        try {
            // Backend ko login request bhejo
            const response = await loginUser({ username, password });
            
            if (response.data.success) {
                // User info save karo browser mein
                localStorage.setItem('username', username);
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('isLoggedIn', 'true');
                
                // Dashboard pe jao
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid username or password!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Logo/Title */}
                <div style={styles.header}>
                    <h1 style={styles.title}>📈 PSX IntelliTrade AI</h1>
                    <p style={styles.subtitle}>Intelligent Stock Portfolio System</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p style={styles.error}>{error}</p>
                    )}

                    {/* Login Button */}
                    <button 
                        type="submit" 
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Demo Credentials */}
                <div style={styles.demo}>
                    <p style={styles.demoTitle}>Demo Credentials:</p>
                    <p>Admin: admin / admin123</p>
                    <p>Investor: ali_investor / ali123</p>
                </div>
            </div>
        </div>
    );
}

// Styles
const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        width: '400px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 45px rgba(0,0,0,0.3)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    title: {
        color: '#00d4ff',
        fontSize: '24px',
        margin: '0 0 8px 0',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: '14px',
        margin: 0,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: '14px',
    },
    input: {
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(255,255,255,0.05)',
        color: 'white',
        fontSize: '16px',
        outline: 'none',
    },
    button: {
        padding: '14px',
        borderRadius: '10px',
        border: 'none',
        background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '10px',
    },
    error: {
        color: '#ff6b6b',
        textAlign: 'center',
        fontSize: '14px',
    },
    demo: {
        marginTop: '20px',
        padding: '15px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '10px',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '13px',
        textAlign: 'center',
    },
    demoTitle: {
        color: '#00d4ff',
        marginBottom: '5px',
        fontWeight: 'bold',
    }
};

export default Login;