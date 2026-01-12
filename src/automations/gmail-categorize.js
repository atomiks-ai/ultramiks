const browserManager = require('../browser/manager');
class GmailCategorizeAutomation {
  async execute({ thread_ids }) {
    if (!browserManager.isRunning()) await browserManager.launch();
    await browserManager.navigate('https://gemini.google.com');
    await browserManager.waitFor('textarea[placeholder*="Enter a prompt"]', 15000);
    await browserManager.typeText('textarea[placeholder*="Enter a prompt"]', `Categorize these Gmail threads: ${thread_ids.join(',')}`);
    await browserManager.click('button[aria-label="Send message"]');
    await browserManager.sleep(5000);
    return { categories: {} };
  }
}
module.exports = new GmailCategorizeAutomation();
