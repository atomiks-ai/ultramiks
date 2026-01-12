const browserManager = require('../browser/manager');
class MapsPlacesAutomation {
  async execute({ query, location }) {
    if (!browserManager.isRunning()) await browserManager.launch();
    await browserManager.navigate('https://gemini.google.com');
    await browserManager.waitFor('textarea[placeholder*="Enter a prompt"]', 15000);
    const prompt = location ? `Find ${query} near ${location}` : `Find places: ${query}`;
    await browserManager.typeText('textarea[placeholder*="Enter a prompt"]', prompt);
    await browserManager.click('button[aria-label="Send message"]');
    await browserManager.sleep(5000);
    return { places: [] };
  }
}
module.exports = new MapsPlacesAutomation();
