const browserManager = require('../browser/manager');
class YoutubeSummarizeAutomation {
    async execute({ video_url }) {
        if (!browserManager.isRunning()) await browserManager.launch();
        await browserManager.navigate('https://gemini.google.com');
        await browserManager.waitFor('textarea[placeholder*="Enter a prompt"]', 15000);
        await browserManager.typeText('textarea[placeholder*="Enter a prompt"]', `Summarize: ${video_url}`);
        await browserManager.click('button[aria-label="Send message"]');
        await browserManager.sleep(5000);
        return { summary: '' };
    }
}
module.exports = new YoutubeSummarizeAutomation();
