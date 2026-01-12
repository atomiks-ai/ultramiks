/**
 * Ultramiks Entry Point
 * Starts the Express server
 */

require('dotenv').config({ path: './config/.env.example' });
const app = require('./server');

const PORT = process.env.PORT || 8201;

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
    const server = app.listen(PORT, () => {
        console.log(`🚀 Ultramiks running on port ${PORT}`);
        console.log(`📊 Health: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('SIGTERM received, shutting down gracefully...');
        server.close(() => {
            console.log('Server closed');
            process.exit(0);
        });
    });
}

module.exports = app;
