/**
 * Browser Manager
 * Manages Puppeteer browser lifecycle with anti-detection
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Layer 1: Stealth plugin
puppeteer.use(StealthPlugin());

class BrowserManager {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    /**
     * Launch browser with anti-detection configuration
     * Layers 2-6: Launch args, fingerprinting, session consistency
     */
    async launch() {
        if (this.browser) {
            console.log('Browser already running');
            return;
        }

        const isHeadless = process.env.HEADLESS !== 'false';

        this.browser = await puppeteer.launch({
            headless: isHeadless ? 'new' : false, // Use new headless mode
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                // Layer 6: Network fingerprinting
                '--disable-features=IsolateOrigins,site-per-process',
                '--disable-blink-features=AutomationControlled',
            ],
            defaultViewport: {
                width: 1920,
                height: 1080,
            },
        });

        this.page = await this.browser.newPage();

        // Layer 4: Session consistency - Set consistent user agent
        await this.page.setUserAgent(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );

        // Layer 7: Cookie management (will be loaded from SOPS)
        // TODO: Load session cookies from PostgreSQL/SOPS

        console.log('✅ Browser launched with anti-detection');
    }

    /**
     * Navigate to URL with human-like behavior
     * Layer 3: Timing randomization
     */
    async navigate(url) {
        if (!this.page) {
            throw new Error('Browser not launched');
        }

        // Random delay before navigation (1-3 seconds)
        const delay = 1000 + Math.random() * 2000;
        await this.sleep(delay);

        await this.page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: parseInt(process.env.BROWSER_TIMEOUT) || 30000,
        });

        console.log(`📍 Navigated to ${url}`);
    }

    /**
     * Type text with human-like behavior
     * Layer 2: Human behavior simulation
     */
    async typeText(selector, text) {
        if (!this.page) {
            throw new Error('Browser not launched');
        }

        await this.page.waitForSelector(selector, { timeout: 10000 });

        // Random typing speed (50-150ms per character)
        for (const char of text) {
            await this.page.type(selector, char, {
                delay: 50 + Math.random() * 100,
            });
        }

        console.log(`⌨️  Typed text into ${selector}`);
    }

    /**
     * Click element with human-like behavior
     * Layer 2: Human behavior simulation
     */
    async click(selector) {
        if (!this.page) {
            throw new Error('Browser not launched');
        }

        await this.page.waitForSelector(selector, { timeout: 10000 });

        // Random delay before click (100-500ms)
        const delay = 100 + Math.random() * 400;
        await this.sleep(delay);

        await this.page.click(selector);

        console.log(`🖱️  Clicked ${selector}`);
    }

    /**
     * Wait for selector
     */
    async waitFor(selector, timeout = 10000) {
        if (!this.page) {
            throw new Error('Browser not launched');
        }

        await this.page.waitForSelector(selector, { timeout });
        console.log(`⏳ Waited for ${selector}`);
    }

    /**
     * Evaluate JavaScript in page
     */
    async evaluate(fn, ...args) {
        if (!this.page) {
            throw new Error('Browser not launched');
        }

        return await this.page.evaluate(fn, ...args);
    }

    /**
     * Take screenshot
     */
    async screenshot(path) {
        if (!this.page) {
            throw new Error('Browser not launched');
        }

        await this.page.screenshot({ path, fullPage: true });
        console.log(`📸 Screenshot saved to ${path}`);
    }

    /**
     * Get current page HTML
     */
    async getHTML() {
        if (!this.page) {
            throw new Error('Browser not launched');
        }

        return await this.page.content();
    }

    /**
     * Close browser
     */
    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
            console.log('🔒 Browser closed');
        }
    }

    /**
     * Check if browser is running
     */
    isRunning() {
        return this.browser !== null;
    }

    /**
     * Sleep helper
     */
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

// Export singleton instance
module.exports = new BrowserManager();
