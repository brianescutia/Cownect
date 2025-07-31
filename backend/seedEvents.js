// =============================================================================
// EVENTS SEED DATA - Sample Tech Events for UC Davis
// Save as: backend/seedEvents.js
// Run with: node backend/seedEvents.js
// =============================================================================

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/eventModel');
const User = require('./models/User');

dotenv.config();

// =============================================================================
// SAMPLE EVENTS DATA
// =============================================================================

const eventsData = [
    // =============================================================================
    // YOUR 3 FEATURED EVENTS
    // =============================================================================
    {
        title: "UC Davis Fall Virtual Career Fair",
        date: new Date('2025-09-10T18:00:00.000Z'), // Fixed timezone (11 AM PST = 6 PM UTC)
        time: "11:00 AM - 3:00 PM",
        location: "Virtual on Handshake",
        description: "Students, employers are looking to hire you! Where you can meet representatives who are hiring a wide variety of internship and full-time positions.",
        imageUrl: "https://s3.amazonaws.com/handshake.production/app/public/assets/career_fairs/57620/original/Fall_Virtual_Career_Fair-3.png?1750871617", // Working URL
        category: "Career Fair",
        featured: true,
        featuredPriority: 1,
        isActive: true
    },
    {
        title: "UC Davis Fall Career Fair",
        date: new Date('2025-10-15T18:00:00.000Z'), // Fixed timezone
        time: "11:00 AM - 3:00 PM",
        location: "University Credit Union Center",
        description: "Where you can meet representatives from companies who are hiring a wide variety of internship and full-time positions available immediately and into Summer 2026.",
        imageUrl: "https://s3.amazonaws.com/handshake.production/app/public/assets/career_fairs/59101/original/Fall_Career_Fair.png?1750443169", // Working URL
        category: "Career Fair",
        featured: true,          // Mark as featured
        featuredPriority: 2,     // Second priority
        isActive: true
    },
    {
        title: "AI for Food Product Development Symposium",
        date: new Date('2025-10-13T15:00:00.000Z'), // Fixed timezone (8 AM PST = 3 PM UTC)
        time: "8:00 AM - 8:00 PM",
        location: "University of California, Davis",
        description: "Symposium will bring together a curated group of researchers, industry professionals, government representatives, and technology innovators to explore how AI is transforming the way food products are designed, developed, and commercialized.",
        imageUrl: "https://aifs.ucdavis.edu/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Ffhus3ye6%2Fproduction%2F3c86b5bdafb9965f1390f3ef1ae57d7da0b57a25-1024x539.png&w=2048&q=75", // AI-themed image
        category: "Research",
        featured: true,          // Mark as featured
        featuredPriority: 3,     // Third priority
        isActive: true
    },

    // =============================================================================
    // EXISTING EVENTS (Calendar only - not featured)
    // ============================================================================
];
// =============================================================================
// SEED FUNCTION
// =============================================================================

async function seedEvents() {
    try {
        console.log('🌱 Starting events data seeding...');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log(' Connected to MongoDB');

        // Clear existing events
        console.log(' Clearing existing events...');
        await Event.deleteMany({});

        // Get a sample user to use as creator (or create a system user)
        let systemUser = await User.findOne({ email: { $regex: /@ucdavis\.edu$/i } });

        if (!systemUser) {
            console.log(' No UC Davis user found, creating system user...');
            systemUser = new User({
                email: 'events@ucdavis.edu',
                password: 'systemuser123',
                isVerified: true
            });
            await systemUser.save();
        }

        // Add creator to each event
        const eventsWithCreator = eventsData.map(event => ({
            ...event,
            createdBy: systemUser._id,
            attendees: [] // Start with empty attendees
        }));

        // Insert events
        console.log(' Inserting sample events...');
        const insertedEvents = await Event.insertMany(eventsWithCreator);

        console.log(` Successfully inserted ${insertedEvents.length} events`);

        // Display events by category
        console.log('\n Events by Month:');

        const eventsByMonth = {};
        insertedEvents.forEach(event => {
            const month = event.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
            if (!eventsByMonth[month]) {
                eventsByMonth[month] = [];
            }
            eventsByMonth[month].push(event);
        });

        Object.keys(eventsByMonth).sort().forEach(month => {
            console.log(`\n${month} (${eventsByMonth[month].length} events):`);
            eventsByMonth[month]
                .sort((a, b) => a.date - b.date)
                .forEach(event => {
                    const dateStr = event.date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    });
                    console.log(`  ${dateStr}: ${event.title}`);
                });
        });

        console.log('\n Event Categories:');
        const categories = {
            'Hackathons & Competitions': insertedEvents.filter(e =>
                e.title.toLowerCase().includes('hack') ||
                e.title.toLowerCase().includes('competition') ||
                e.title.toLowerCase().includes('challenge')
            ).length,
            'Career & Networking': insertedEvents.filter(e =>
                e.title.toLowerCase().includes('career') ||
                e.title.toLowerCase().includes('networking') ||
                e.title.toLowerCase().includes('pitch')
            ).length,
            'Workshops & Learning': insertedEvents.filter(e =>
                e.title.toLowerCase().includes('workshop') ||
                e.title.toLowerCase().includes('bootcamp') ||
                e.title.toLowerCase().includes('intro')
            ).length,
            'Research & Innovation': insertedEvents.filter(e =>
                e.title.toLowerCase().includes('research') ||
                e.title.toLowerCase().includes('expo') ||
                e.title.toLowerCase().includes('innovation')
            ).length,
            'Social & Community': insertedEvents.filter(e =>
                e.title.toLowerCase().includes('showcase') ||
                e.title.toLowerCase().includes('meetup') ||
                e.title.toLowerCase().includes('social')
            ).length
        };

        Object.entries(categories).forEach(([category, count]) => {
            console.log(`  ${category}: ${count} events`);
        });

        console.log('\n Events seeding completed successfully!');
        console.log(' Your events page is ready with realistic UC Davis tech events!');

    } catch (error) {
        console.error(' Error seeding events:', error);
    } finally {
        await mongoose.connection.close();
        console.log(' Database connection closed');
        process.exit(0);
    }
}

// =============================================================================
// RUN SEED SCRIPT
// =============================================================================

if (require.main === module) {
    console.log(' Starting events data seeding...');
    seedEvents();
}

module.exports = { eventsData, seedEvents };

// =============================================================================
// USAGE INSTRUCTIONS:
// =============================================================================
//
// 1. Save this file as backend/seedEvents.js
// 2. Run: node backend/seedEvents.js
// 3. This will populate your database with realistic tech events
// 4. Update your app.js to uncomment the event routes with the enhanced versions above
// 5. Add the events.html page to your frontend/pages/ directory
// 6. Add the events.css to your frontend/styles/ directory
// 7. Add the events-page.js to your frontend/scripts/ directory
// 8. Update your navbar to include the events link
//
// Your events page will then have:
// - Top 3 featured events with beautiful cards
// - Interactive calendar with event indicators
// - Event carousel when clicking dates
// - Google Calendar integration
// - Join/bookmark functionality
//
// =============================================================================