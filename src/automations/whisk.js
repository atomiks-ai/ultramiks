const browserManager = require('../browser/manager');
class WhiskAutomation {
    async execute({ image1, image2, image3 }) {
        if (!browserManager.isRunning()) await browserManager.launch();
        await browserManager.navigate('https://gemini.google.com');
        await browserManager.waitFor('textarea[placeholder*="Enter a prompt"]', 15000);
        await browserManager.typeText('textarea[placeholder*="Enter a prompt"]', 'Remix 3 images');
        await browserManager.click('button[aria-label="Send message"]');
        await browserManager.sleep(10000);
        return { remixed_image_url: '', quota_remaining: 99 };
    }
}
module.exports = new WhiskAutomation();
