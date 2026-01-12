# Ultramiks - Gemini Ultra Browser Automation

**Browser automation service for Google Gemini Ultra** - Exposes 34 Gemini features as HTTP endpoints for Atomiks integration.

## Architecture

```
n8n workflows → Atomiks (auth/routing) → Ultramiks (browser automation) → PostgreSQL
```

## Features

- ✅ **8-layer anti-detection** (Puppeteer stealth, human simulation, timing randomization)
- ✅ **Quota management** (PostgreSQL tracking: 200/day deep research, 1000/day images)
- ✅ **Session persistence** (SOPS-encrypted browser sessions)
- ✅ **Circuit breaker** (Auto-pause on bot detection)
- ✅ **34 Gemini tools** (Deep Research, Image Gen, Gmail, Drive, Travel, etc.)

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL (with atomiks database)
- Chromium

### Local Development

```bash
cd services/ultramiks

# Install dependencies
npm install

# Run tests
npm run test:unit

# Start server (test mode with mocked browser)
npm run dev

# Health check
curl http://localhost:8201/health
```

### Production Deployment

```bash
# Build Docker image
docker build -t ultramiks:latest .

# Run container
docker run -d \
  -p 8201:8201 \
  -e POSTGRESQL_URL=postgresql://atomiks:password@postgres:5432/atomiks \
  -e SESSION_SOPS_KEY_PATH=/secrets/ultramiks-session.enc \
  --name ultramiks \
  ultramiks:latest

# Check health
docker logs ultramiks
curl http://localhost:8201/health
```

## API Endpoints

### Health Check
```bash
GET /health
Response: {"status":"ok","service":"ultramiks","browser":"ready","timestamp":"..."}
```

### Deep Research
```bash
POST /deep-research
Headers: X-API-KEY: <your-key> (via Atomiks)
Body: {"query":"AI research trends","depth":"comprehensive"}
Response: {"report":"...","sources":[...],"quota_remaining":199}
```

## PostgreSQL Schema

Run migration to create tables:
```bash
psql -U atomiks -d atomiks -f migrations/001_ultramiks_schema.sql
```

Tables:
- `ultramiks_quotas` - Daily usage limits per tool
- `ultramiks_sessions` - Encrypted browser sessions
- `ultramiks_request_logs` - Audit trail

## Testing

### Unit Tests (Run in CI)
```bash
npm run test:unit  # Mocked browser, 70%+ coverage required
```

### Integration Tests (Manual only)
```bash
npm run test:integration  # Real browser, local only
```

## Anti-Detection Layers

1. **Stealth Plugin** - `puppeteer-extra-plugin-stealth`
2. **Human Behavior** - Mouse movements, typing with delays
3. **Timing Randomization** - 1-5 second jitter between actions
4. **Session Consistency** - Same fingerprint for 24 hours
5. **Rate Limiting** - Max 30 requests/hour
6. **Network Fingerprinting** - Custom headers, realistic user agent
7. **Cookie Management** - SOPS-encrypted session persistence
8. **Detection Monitoring** - Alerts on CAPTCHA or unusual traffic

## Configuration

Create `.env` from template:
```bash
cp config/.env.example .env
```

Variables:
- `PORT` - Server port (default: 8201)
- `POSTGRESQL_URL` - PostgreSQL connection string
- `HEADLESS` - Run browser in headless mode (default: true)
- `SESSION_SOPS_KEY_PATH` - Path to SOPS-encrypted session data

## Woodpecker CI/CD

Pipeline runs on push to `main`:
1. Unit tests with mocked browser
2. Docker build and push to GHCR
3. Deploy to helicarrier via SSH
4. Run PostgreSQL migrations
5. Health check validation

## Monitoring (n8n)

Workflows to create:
- **Health Check** - Every 5min, alert on failure
- **Quota Tracking** - Hourly, alert at 80%
- **Session Monitoring** - Every 6hrs, alert before expiry
- **Daily Backup** - 2am pg_dump

## Development

```bash
# Watch mode
npm run dev

# Lint
npm run lint
npm run lint:fix

# Coverage report
npm run test:unit
open coverage/lcov-report/index.html
```

## License

LicenseRef-Sustainable-Use

---

**Built by Rocky** ♪♫ with TDD methodology
