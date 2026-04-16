const express = require('express');
const router = express.Router();
const { getConnection } = require('../db');

// ================================
// CREATE PORTFOLIO
// POST /api/portfolio/create
// ================================
router.post('/create', async (req, res) => {
    // Frontend se user_id aur portfolio name aayega
    const { user_id, portfolio_name } = req.body;
    const normalizedPortfolioName = (portfolio_name || '').trim().replace(/\s+/g, ' ');
    
    let connection;
    try {
        connection = await getConnection();

        if (!normalizedPortfolioName) {
            return res.status(400).json({
                success: false,
                message: 'Portfolio name is required'
            });
        }

        const existingPortfolio = await connection.execute(
            `SELECT COUNT(*) AS portfolio_count
             FROM portfolios
             WHERE user_id = :user_id
             AND UPPER(TRIM(REGEXP_REPLACE(portfolio_name, '\\s+', ' '))) = UPPER(:portfolio_name)`,
            { user_id, portfolio_name: normalizedPortfolioName },
            { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
        );

        const portfolioCountRow = existingPortfolio.rows[0] || {};
        const portfolioCount = portfolioCountRow.PORTFOLIO_COUNT || portfolioCountRow.portfolio_count || 0;

        if (portfolioCount > 0) {
            return res.status(409).json({
                success: false,
                message: 'Portfolio name already exists for this user'
            });
        }
        
        await connection.execute(
            `INSERT INTO portfolios (user_id, portfolio_name)
             VALUES (:user_id, :portfolio_name)`,
            { user_id, portfolio_name: normalizedPortfolioName },
            { autoCommit: true }
        );
        
        res.json({ 
            success: true, 
            message: 'Portfolio created!' 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    } finally {
        if (connection) await connection.close();
    }
});

// ================================
// GET USER PORTFOLIOS
// GET /api/portfolio/:user_id
// ================================
router.get('/:user_id', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        
        // User ke sare portfolios lao
        const result = await connection.execute(
            `SELECT portfolio_id, portfolio_name, 
                    created_at, total_invested
             FROM portfolios
             WHERE user_id = :user_id
             ORDER BY created_at DESC, portfolio_id DESC`,
            { user_id: req.params.user_id },
            { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
        );
        
        res.json({ 
            success: true, 
            data: result.rows 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    } finally {
        if (connection) await connection.close();
    }
});

// ================================
// GET PORTFOLIO HOLDINGS + P&L
// GET /api/portfolio/:portfolio_id/holdings
// ================================
router.get('/:portfolio_id/holdings', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        
        // Portfolio analytics view se data lao
        // Yeh wahi view hai jo humne Oracle mein banaya tha!
        const result = await connection.execute(
            `SELECT symbol, company_name, quantity,
                    avg_buy_price, total_invested,
                    current_price, current_value,
                    profit_loss, pl_percentage
             FROM portfolio_analytics
             WHERE portfolio_id = :portfolio_id`,
            { portfolio_id: req.params.portfolio_id },
            { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
        );
        
        res.json({ 
            success: true, 
            data: result.rows 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    } finally {
        if (connection) await connection.close();
    }
});

// ================================
// BUY STOCK
// POST /api/portfolio/buy
// ================================
router.post('/buy', async (req, res) => {
    const { portfolio_id, company_id, quantity, price } = req.body;
    
    let connection;
    try {
        connection = await getConnection();
        
        // Transaction insert karo
        // Trigger automatically holdings update karega!
        await connection.execute(
            `INSERT INTO transactions 
             (portfolio_id, company_id, trans_type, quantity, price, total_amount)
             VALUES (:portfolio_id, :company_id, 'BUY', :quantity, :price, :total)`,
            { 
                portfolio_id, 
                company_id, 
                quantity, 
                price,
                total: quantity * price
            },
            { autoCommit: true }
        );
        
        res.json({ 
            success: true, 
            message: `Bought ${quantity} shares successfully!` 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    } finally {
        if (connection) await connection.close();
    }
});

// ================================
// SELL STOCK
// POST /api/portfolio/sell
// ================================
router.post('/sell', async (req, res) => {
    const { portfolio_id, company_id, quantity, price } = req.body;
    
    let connection;
    try {
        connection = await getConnection();
        
        await connection.execute(
            `INSERT INTO transactions 
             (portfolio_id, company_id, trans_type, quantity, price, total_amount)
             VALUES (:portfolio_id, :company_id, 'SELL', :quantity, :price, :total)`,
            { 
                portfolio_id, 
                company_id, 
                quantity, 
                price,
                total: quantity * price
            },
            { autoCommit: false }
        );

        await connection.execute(
            `DELETE FROM holdings
             WHERE portfolio_id = :pid
             AND company_id = :cid
             AND quantity <= 0`,
            {
                pid: portfolio_id,
                cid: company_id
            },
            { autoCommit: false }
        );

        await connection.commit();
        
        res.json({ 
            success: true, 
            message: `Sold ${quantity} shares successfully!` 
        });

    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                // Ignore rollback errors, original error will be returned.
            }
        }
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    } finally {
        if (connection) await connection.close();
    }
});

module.exports = router;