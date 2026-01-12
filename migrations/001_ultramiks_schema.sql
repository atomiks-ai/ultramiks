-- Ultramiks PostgreSQL Schema Migration
-- Run this migration to add ultramiks tables to existing atomiks database

-- Quotas table: Track daily usage limits per tool
CREATE TABLE IF NOT EXISTS ultramiks_quotas (
    id SERIAL PRIMARY KEY,
    tool_name VARCHAR(100) NOT NULL UNIQUE,
    daily_limit INTEGER NOT NULL,
    current_usage INTEGER DEFAULT 0,
    reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table: Store encrypted browser session data
CREATE TABLE IF NOT EXISTS ultramiks_sessions (
    id SERIAL PRIMARY KEY,
    session_data_encrypted TEXT NOT NULL,  -- SOPS encrypted JSON
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Request logs: Audit trail for automation requests
CREATE TABLE IF NOT EXISTS ultramiks_request_logs (
    id SERIAL PRIMARY KEY,
    tool_name VARCHAR(100) NOT NULL,
    request_params JSONB,
    response_data JSONB,
    status VARCHAR(50) NOT NULL,  -- 'success', 'failed', 'quota_exceeded'
    error_message TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quotas_tool_date ON ultramiks_quotas(tool_name, reset_date);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON ultramiks_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON ultramiks_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_request_logs_tool ON ultramiks_request_logs(tool_name);
CREATE INDEX IF NOT EXISTS idx_request_logs_created ON ultramiks_request_logs(created_at);

-- Seed initial quota data for 34 Gemini tools
INSERT INTO ultramiks_quotas (tool_name, daily_limit, reset_date) VALUES
    ('gemini-deep-research', 200, CURRENT_DATE),
    ('gemini-deep-think', 10, CURRENT_DATE),
    ('gemini-generate-image', 1000, CURRENT_DATE),
    ('gemini-generate-video', 50, CURRENT_DATE),
    ('gemini-photo-to-video', 50, CURRENT_DATE),
    ('gemini-edit-image', 100, CURRENT_DATE),
    ('gemini-whisk', 100, CURRENT_DATE)
ON CONFLICT (tool_name) DO NOTHING;

-- Function to reset daily quotas (call this daily via n8n)
CREATE OR REPLACE FUNCTION reset_daily_quotas()
RETURNS INTEGER AS $$
DECLARE
    rows_updated INTEGER;
BEGIN
    UPDATE ultramiks_quotas
    SET current_usage = 0,
        reset_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE reset_date < CURRENT_DATE;
    
    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    RETURN rows_updated;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (assuming atomiks user exists)
GRANT SELECT, INSERT, UPDATE, DELETE ON ultramiks_quotas TO atomiks;
GRANT SELECT, INSERT, UPDATE, DELETE ON ultramiks_sessions TO atomiks;
GRANT SELECT, INSERT ON ultramiks_request_logs TO atomiks;
GRANT USAGE, SELECT ON SEQUENCE ultramiks_quotas_id_seq TO atomiks;
GRANT USAGE, SELECT ON SEQUENCE ultramiks_sessions_id_seq TO atomiks;
GRANT USAGE, SELECT ON SEQUENCE ultramiks_request_logs_id_seq TO atomiks;
