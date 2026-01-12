const browserManager = require('../browser/manager');
class SearchShoppingAutomation {
    async execute({ query }) {
        if (!browserManager.isRunning()) await browserManager.launch();
        await browserManager.navigate('https://gemini.google.com');
        await browserManager.waitFor('textarea[placeholder*="Enter a prompt"]', 15000);
        await browserManager.typeText('textarea[placeholder*="Enter a prompt"]', `Shop for: ${query}`);
        await browserManager.click('button[aria-label="Send message"]');
        await browserManager.sleep(5000);
        return { products: [] };
    }
}
module.exports = new SearchShoppingAutomation();
