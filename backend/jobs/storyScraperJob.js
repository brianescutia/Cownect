const cron = require('node-cron');
const instagramStoryService = require('../services/instagramStoryService');

// Run every hour at minute 0
// Format: minute hour day month dayOfWeek
const schedule = '0 * * * *'; // Every hour

function startStoryScraperJob() {
    console.log('⏰ Story scraper job scheduled: Every hour');

    cron.schedule(schedule, async () => {
        console.log(`\n⏰ [${new Date().toLocaleString()}] Running scheduled story check...`);

        try {
            await instagramStoryService.processStories();
        } catch (error) {
            console.error('❌ Error in scheduled job:', error);
        }
    });

    // Also run immediately on startup
    console.log('🚀 Running initial story check...');
    instagramStoryService.processStories();
}

module.exports = { startStoryScraperJob };