/** Drive Search */
const browserManager = require('../browser/manager');

class DriveSearchAutomation {
    async execute({ query, file_type }) {
        try {
            if (!browserManager.isRunning()) await browserManager.launch();
            await browserManager.navigate('https://gemini.google.com');
            await browser Manager.waitFor('textarea[placeholder*="Enter a prompt"]', 15000);

            const prompt = file_type
                ? `Search my Google Drive for ${file_type} files: ${query}`
                : `Search my Google Drive for: ${query}`;

            await browserManager.typeText('textarea[placeholder*="Enter a prompt"]', prompt);
            await browserManager.click('button[aria-label="Send message"]');
            await browserManager.sleep(5000);

            return { files: [], count: 0 };
        } catch (error) {
            throw new Error(`Drive search failed: ${error.message}`);
        }
    }
}

module.exports = new DriveSearchAutomation();
