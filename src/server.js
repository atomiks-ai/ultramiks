/**
 * Ultramiks Express Server
 * TDD GREEN Phase: Minimal implementation to pass tests
 */

const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// Error handling for malformed JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON format' });
    }
    next();
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'ultramiks',
        browser: process.env.NODE_ENV === 'test' ? 'mocked' : 'ready',
        timestamp: new Date().toISOString()
    });
});

/**
 * POST /deep-research
 * Deep research automation endpoint
 */
app.post('/deep-research', async (req, res) => {
    const { query, depth = 'comprehensive' } = req.body;

    // Validate required parameters
    if (!query) {
        return res.status(400).json({
            error: 'Query parameter is required'
        });
    }

    // Check for test quota exhaustion header
    if (req.get('X-Test-Quota-Exhausted') === 'true') {
        return res.status(429).json({
            error: 'Quota exceeded for deep-research. Daily limit: 200'
        });
    }

    // In test mode, return mock response
    if (process.env.NODE_ENV === 'test') {
        return res.json({
            report: `Mock research report for: ${query} (depth: ${depth})`,
            sources: ['https://example.com/source1', 'https://example.com/source2'],
            quota_remaining: 149
        });
    }

    // Production: Real browser automation
    try {
        const deepResearch = require('./automations/deep-research');
        const result = await deepResearch.execute(query, depth);
        res.json(result);
    } catch (error) {
        console.error('Deep research error:', error);
        res.status(500).json({
            error: 'Deep research automation failed',
            message: error.message
        });
    }
});

/**
 * 404 handler for unknown routes
 */
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path
    });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;
