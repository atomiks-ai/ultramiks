const browserManager = require('../browser/manager');
class MapsDirectionsAutomation {
  async execute({ origin, destination }) {
    if (!browserManager.isRunning()) await browserManager.launch();
    await browser Manager.navigate('https://gemini.google.com');
    await browserManager.waitFor('textarea[placeholder*="Enter a prompt"]', 15000);
    await browserManager.typeText('textarea[placeholder*="Enter a prompt"]', `Get directions from ${origin} to ${destination}`);
    await browserManager.click('button[aria-label="Send message"]');
    await browserManager.sleep(5000);
    return { directions: [], duration: null };
  }
}
module.exports = new MapsDirectionsAutomation();
