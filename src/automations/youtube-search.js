const browserManager = require('../browser/manager');
class YoutubeSearchAutomation {
  async execute({ query }) {
    if (!browserManager.isRunning()) await browserManager.launch();
    await browserManager.navigate('https://gemini.google.com');
    await browserManager.waitFor('textarea[placeholder*="Enter a prompt"]', 15000);
    await browserManager.typeText('textarea[placeholder*="Enter a prompt"]', `Search YouTube: ${query}`);
    await browserManager.click('button[aria-label="Send message"]');
    await browserManager.sleep(5000);
    return { videos: [] };
  }
}
module.exports = new YoutubeSearchAutomation();
