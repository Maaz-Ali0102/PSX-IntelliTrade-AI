-- =============================================
-- PSX IntelliTrade AI
-- 07_alerts.sql
-- =============================================

CREATE OR REPLACE PROCEDURE generate_alerts AS
BEGIN
    INSERT INTO alerts (company_id, alert_type, message)
    SELECT company_id, 'PRICE DROP', 'Stock dropped more than 5% today!'
    FROM top_gainers_losers
    WHERE pct_change < -5;

    INSERT INTO alerts (company_id, alert_type, message)
    SELECT company_id, 'PRICE SPIKE', 'Stock gained more than 5% today!'
    FROM top_gainers_losers
    WHERE pct_change > 5;

    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Alerts generated!');
END;
/