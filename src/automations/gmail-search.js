/** Gmail Search */
const browserManager = require('../browser/manager');

class GmailSearchAutomation {
    async execute({ query, max_results = 10 }) {
        try {
            if (!browserManager.isRunning()) await browserManager.launch();
            await browserManager.navigate('https://gemini.google.com');
            await browserManager.waitFor('textarea[placeholder*="Enter a prompt"]', 15000);

            const prompt = `Search my Gmail for: ${query}. Show top ${max_results} results`;
            await browserManager.typeText('textarea[placeholder*="Enter a prompt"]', prompt);
            await browserManager.click('button[aria-label="Send message"]');
            await browserManager.sleep(5000);

            return { messages: [], count: 0 };
        } catch (error) {
            throw new Error(`Gmail search failed: ${error.message}`);
        }
    }
}

module.exports = new GmailSearchAutomation();
