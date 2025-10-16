const axios = require('axios');
const OpenAI = require('openai');
const Event = require('../models/eventModel');

class InstagramStoryService {
    constructor() {
        this.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
        this.accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        this.processedStories = new Set(); // Track processed stories
    }

    // Fetch your Instagram stories
    async fetchStories() {
        try {
            console.log('🔑 Debug - Access Token (first 30 chars):', this.accessToken?.substring(0, 30) + '...');
            console.log('🔑 Debug - Account ID:', this.accountId);
            console.log('📸 Fetching Instagram stories...');

            const url = `https://graph.facebook.com/v24.0/${this.accountId}/stories`;
            console.log('🌐 Debug - Full URL:', url);

            const response = await axios.get(url, {
                params: {
                    fields: 'id,media_type,media_url,timestamp,permalink',
                    access_token: this.accessToken
                }
            });

            const stories = response.data.data || [];
            console.log(`✅ Found ${stories.length} stories`);
            return stories;

        } catch (error) {
            console.error('❌ Error fetching stories:', error.response?.data || error.message);
            throw error;
        }
    }

    // Download story image as base64
    async downloadImage(mediaUrl) {
        try {
            const response = await axios.get(mediaUrl, {
                responseType: 'arraybuffer'
            });

            return Buffer.from(response.data, 'binary').toString('base64');
        } catch (error) {
            console.error('❌ Error downloading image:', error.message);
            throw error;
        }
    }

    async compressImage(imageBase64) {
        // For now, just return as-is
        // In production, you'd want to resize the image
        // But base64 from Instagram should already be reasonable size
        return imageBase64;
    }

    // Extract event details using OpenAI Vision
    async extractEventDetails(imageBase64) {
        try {
            console.log('🤖 Analyzing story with AI...');

            // Add timeout wrapper
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('AI analysis timeout after 30 seconds')), 30000);
            });

            const analysisPromise = this.openai.chat.completions.create({
                model: "gpt-4o", // ✅ Make sure you're using gpt-4o, not gpt-4-vision-preview
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `Analyze this Instagram story image and extract event information. 

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "isEvent": true/false,
  "title": "event title",
  "description": "event description",
  "date": "YYYY-MM-DD",
  "time": "HH:MM AM/PM",
  "location": "location name",
  "club": "organizing club/group",
  "confidence": 0.0-1.0
}

CRITICAL DATE HANDLING RULES:
- Current date: ${new Date().toLocaleDateString('en-US')}
- Flyers rarely show year - ALWAYS use 2025 for all dates
- If you see "Oct 22" or "October 22", format as "2025-10-22"
- If you see "Jan 15", format as "2025-01-15"

OTHER RULES:
- If NOT an event, set isEvent to false
- Only extract visible information
- If field not found, use null
- Time in 12-hour format with AM/PM

CONFIDENCE:
- 1.0 = All details clear
- 0.8-0.9 = Most details clear
- 0.6-0.7 = Some details unclear
- Below 0.6 = Too unclear`
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${imageBase64}`,
                                    detail: "high" // ✅ Add this for better analysis
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 500,
                temperature: 0.3 // ✅ Lower temperature for more consistent output
            });

            // Race between API call and timeout
            const response = await Promise.race([analysisPromise, timeoutPromise]);

            const content = response.choices[0].message.content.trim();

            // Remove markdown code blocks if present
            const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            const eventData = JSON.parse(cleanContent);
            console.log('✅ Event data extracted:', eventData);

            return eventData;

        } catch (error) {
            if (error.message.includes('timeout')) {
                console.error('⏱️ AI analysis timed out after 30 seconds');
            } else {
                console.error('❌ Error extracting event details:', error.message);
            }

            // Return non-event if analysis fails
            return {
                isEvent: false,
                confidence: 0,
                error: error.message
            };
        }
    }

    // Fix dates that came back as "YYYY-MM-DD" format
    fixEventDate(eventData) {
        if (!eventData.date) return eventData;

        // If date starts with "YYYY", replace with current year
        if (eventData.date.startsWith('YYYY')) {
            const currentYear = new Date().getFullYear();
            eventData.date = eventData.date.replace('YYYY', currentYear.toString());
            console.log(`🔧 Fixed date: ${eventData.date}`);
        }

        return eventData;
    }

    // Save event to database
    // Save event to database
    // Save event to database
    async saveEvent(eventData, storyUrl) {
        try {
            // Parse the date properly for comparison
            const eventDate = new Date(eventData.date);
            const startOfDay = new Date(eventDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(eventDate.setHours(23, 59, 59, 999));

            // Check if event already exists (improved duplicate detection)
            const existingEvent = await Event.findOne({
                title: { $regex: new RegExp(`^${eventData.title.trim()}$`, 'i') }, // Case-insensitive
                date: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            });

            if (existingEvent) {
                console.log('⚠️ Event already exists, skipping...');
                console.log(`   Existing event ID: ${existingEvent._id}`);
                return null;
            }

            // Get or create a system user for auto-imported events
            const User = require('../models/User');
            let systemUser = await User.findOne({ email: 'system@ucdavis.edu' });

            if (!systemUser) {
                console.log('📝 Creating system user for auto-imported events...');
                systemUser = new User({
                    email: 'system@ucdavis.edu',
                    name: 'Instagram Auto-Import',
                    password: 'not-used',
                    isVerified: true
                });
                await systemUser.save();
                console.log('✅ System user created');
            }

            // Create new event
            const newEvent = new Event({
                title: eventData.title.trim(),
                description: eventData.description || 'No description provided',
                date: eventData.date,
                time: eventData.time,
                location: eventData.location || 'TBA',
                club: eventData.club || 'Unknown',
                imageUrl: storyUrl,
                source: 'instagram_story',
                createdBy: systemUser._id,
                confidence: eventData.confidence,
                status: 'published',
                isActive: true
            });

            await newEvent.save();
            console.log('✅ Event saved to database!');
            console.log(`📅 Event: "${newEvent.title}" on ${newEvent.date}`);
            return newEvent;

        } catch (error) {
            console.error('❌ Error saving event:', error.message);
            throw error;
        }
    }
    // Main process: Check stories and extract events
    async processStories() {
        try {
            console.log('\n🚀 Starting Instagram story processing...\n');

            // Fetch stories
            const stories = await this.fetchStories();

            if (stories.length === 0) {
                console.log('ℹ️ No stories found');
                return;
            }

            // Process each story
            for (const story of stories) {
                // Skip if already processed
                if (this.processedStories.has(story.id)) {
                    console.log(`⏭️ Story ${story.id} already processed, skipping...`);
                    continue;
                }

                console.log(`\n📱 Processing story: ${story.id}`);

                // Only process images for now
                if (story.media_type !== 'IMAGE') {
                    console.log('⏭️ Skipping non-image story');
                    this.processedStories.add(story.id);
                    continue;
                }

                // Download image
                const imageBase64 = await this.downloadImage(story.media_url);

                // Extract event details with AI
                let eventData = await this.extractEventDetails(imageBase64);
                eventData = this.fixEventDate(eventData);



                // Check if it's actually an event
                if (!eventData.isEvent || eventData.confidence < 0.6) {
                    console.log('⏭️ Not an event or low confidence, skipping...');
                    this.processedStories.add(story.id);
                    continue;
                }

                // Save event to database
                await this.saveEvent(eventData, story.permalink);

                // Mark as processed
                this.processedStories.add(story.id);

                // Wait a bit between requests to avoid rate limits
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            console.log('\n✅ Story processing complete!\n');

        } catch (error) {
            console.error('❌ Error in processStories:', error.message);
        }
    }
}

module.exports = new InstagramStoryService();