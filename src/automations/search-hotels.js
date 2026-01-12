const browserManager = require('../browser/manager');
class SearchHotelsAutomation {
    async execute({ location, dates }) {
        if (!browserManager.isRunning()) await browserManager.launch();
        await browserManager.navigate('https://gemini.google.com');
        await browserManager.waitFor('textarea[placeholder*="Enter a prompt"]', 15000);
        await browserManager.typeText('textarea[placeholder*="Enter a prompt"]', `Find hotels in ${location} for ${dates}`);
        await browserManager.click('button[aria-label="Send message"]');
        await browserManager.sleep(5000);
        return { hotels: [] };
    }
}
module.exports = new SearchHotelsAutomation();
