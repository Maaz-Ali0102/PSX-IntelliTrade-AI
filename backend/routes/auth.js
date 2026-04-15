const express = require('express');
const router = express.Router();
const { getConnection } = require('../db');

// ================================
// REGISTER — Naya user banao
// POST /api/auth/register
// ================================
router.post('/register', async (req, res) => {
    // Frontend se yeh data aayega
    const { username, email, password, role } = req.body;
    
    let connection;
    try {
        // Oracle se connect karo
        connection = await getConnection();
        
        // Register procedure call karo
        // Jo humne Oracle mein banaya tha!
        await connection.execute(
            `BEGIN register_user(:username, :email, :password, :role); END;`,
            { 
                username: username, 
                email: email, 
                password: password,
                role: role || 'INVESTOR'
            }
        );
        
        res.json({ 
            success: true, 
            message: 'User registered successfully!' 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    } finally {
        // Connection hamesha close karo
        if (connection) await connection.close();
    }
});

// ================================
// LOGIN — User login karo
// POST /api/auth/login
// ================================
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    let connection;
    try {
        connection = await getConnection();
        
        // PSX_LOGIN function call karo
        // Jo humne Oracle mein banaya tha!
        const result = await connection.execute(
            `SELECT psx_login(:username, :password) AS result FROM DUAL`,
            { username: username, password: password }
        );
        
        const loginResult = result.rows[0][0];
        
        // Result check karo
        if (loginResult.startsWith('SUCCESS')) {
            const role = loginResult.split(':')[1];
            res.json({ 
                success: true, 
                role: role,
                username: username,
                message: 'Login successful!' 
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    } finally {
        if (connection) await connection.close();
    }
});

module.exports = router;