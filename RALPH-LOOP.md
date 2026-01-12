# Ralph Loop - Ultramiks Automation Implementation

**Purpose:** Autonomously implement the remaining 33 Gemini automation endpoints

---

## Success Criteria

Ralph Loop will iterate until ALL criteria are met:

✅ **All 34 automations implemented** (1 done + 33 remaining)  
✅ **All unit tests passing**  
✅ **Coverage >80%**  
✅ **All endpoints return 200** (not 501)

---

## Automation Endpoints to Implement

**Template:** `src/automations/deep-research.js` ✅

**Remaining 33:**

### Content Generation (6)
1. generate-image.js - Imagen 3 (1000/day)
2. generate-video.js - Veo 3.1 (50/day)
3. photo-to-video.js - Animate photos (50/day)
4. edit-image.js - Edit with NL instructions (100/day)
5. whisk.js - Image remixing (100/day)

### Gmail (6)
6. gmail-summarize.js
7. gmail-draft-reply.js
8. gmail-extract.js
9. gmail-categorize.js
10. gmail-find-attachments.js
11. gmail-thread-analysis.js

### Drive (4)
12. drive-search.js
13. drive-analyze.js
14. drive-summarize.js
15. drive-organize.js

### Calendar (2)
16. calendar-events.js
17. calendar-schedule.js

### Maps (2)
18. maps-directions.js
19. maps-places.js

### YouTube (2)
20. youtube-search.js
21. youtube-summarize.js

### Travel (3)
22. search-hotels.js
23. search-shopping.js

### Development (2)
24. execute-code.js - Python sandbox
25. analyze-file.js - PDF/image analysis

### Productivity (5)
26. notebooklm.js
27. multimodal-chat.js - Text + image
28. analyze-document.js
29. keep-notes.js
30. workspace-query.js
31. deep-think.js - Extended reasoning (10/day)
32. search-flights.js
33. gmail-search.js

---

## How Ralph Loop Works

```bash
# Each iteration:
1. Count implemented automations (files in src/automations/)
2. Run unit tests
3. Check coverage
4. If criteria NOT met:
   - Call AI agent with current state
   - AI implements next automation
   - Commit to Git
   - Repeat
5. If ALL criteria met:
   - Commit final state
   - Exit success
```

---

## Running Ralph Loop

### Manual Mode (Recommended for first run)

```bash
cd /Users/gregmiller/workspace/repos/ultramiks
chmod +x scripts/ralph-loop.sh
./scripts/ralph-loop.sh
```

Each iteration pauses for review. Press Enter to continue.

### Autonomous Mode

Remove the `read` command from script for fully autonomous execution.

---

## Implementation Pattern

Each automation follows this pattern:

```javascript
// src/automations/TOOL-NAME.js
const browserManager = require('../browser/manager');

class ToolNameAutomation {
  async execute(params) {
    // 1. Ensure browser running
    if (!browserManager.isRunning()) {
      await browserManager.launch();
    }

    // 2. Navigate to Gemini
    await browserManager.navigate('https://gemini.google.com');

    // 3. Wait for interface
    await browserManager.waitFor('textarea[placeholder*="Enter a prompt"]');

    // 4. Construct prompt
    const prompt = `...`; // Tool-specific

    // 5. Type with human behavior
    await browserManager.typeText('textarea...', prompt);

    // 6. Submit
    await browserManager.click('button[aria-label="Send message"]');

    // 7. Wait and parse response
    await browserManager.sleep(5000);
    const html = await browserManager.getHTML();

    // 8. Return result
    return {
      result: parsedResult,
      quota_remaining: await this.getQuota()
    };
  }

  async getQuota() {
    // TODO: Query PostgreSQL
    return 999;
  }
}

module.exports = new ToolNameAutomation();
```

---

## Adding Tests

For each automation, add tests to `tests/unit/`:

```javascript
describe('ToolName Automation', () => {
  test('executes successfully in test mode', async () => {
    const result = await automation.execute({...});
    expect(result).toHaveProperty('result');
    expect(result).toHaveProperty('quota_remaining');
  });
});
```

---

## Progress Tracking

Ralph Loop commits after each iteration:
- Git history shows progress
- Easy to rollback if needed
- External state (not in LLM context)

---

## Expected Timeline

**Optimistic:** 10-15 iterations (1-2 days)  
**Realistic:** 20-30 iterations (2-3 days)  
**Conservative:** 30-50 iterations (3-5 days)

Each iteration:
- Implement 1-3 automations
- Write tests
- Commit to Git
- Verify success criteria

---

## Monitoring

Check progress:
```bash
# Count implemented
ls -1 src/automations/*.js | wc -l

# Run tests
npm run test:unit

# Check Git log
git log --oneline | grep "Ralph Loop"
```

---

**Ready to start Ralph Loop!** ♪♫
