// =============================================================================
// ENHANCED EVENTS SEED DATA - With Featured and Regular Events
// Save as: backend/seedEvents.js
// Run with: node backend/seedEvents.js
// =============================================================================

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/eventModel');
const User = require('./models/User');

dotenv.config();

// =============================================================================
// COMPREHENSIVE EVENTS DATA
// =============================================================================

const eventsData = [
    // =============================================================================
    // FEATURED EVENTS (Top 3 Priority)
    // =============================================================================
    {
        title: "UC Davis Fall Virtual Career Fair",
        date: new Date('2025-10-10T19:00:00.000Z'),
        time: "11:00 AM - 3:00 PM",
        location: "Virtual on Handshake",
        description: "Students, employers are looking to hire you! Meet representatives hiring for internship and full-time positions.",
        imageUrl: "https://s3.amazonaws.com/handshake.production/app/public/assets/career_fairs/57620/original/Fall_Virtual_Career_Fair-3.png?1750871617",
        category: "Career Fair",
        featured: true,
        featuredPriority: 1,
        tags: ["career", "networking", "jobs", "internships"],
        maxAttendees: null,
        registrationRequired: true,
        registrationUrl: "https://ucdavis.joinhandshake.com",
        isActive: true
    },
    {
        title: "HackDavis 2025",
        date: new Date('2025-09-16T17:00:00.000Z'),
        time: "9:00 AM - 9:00 PM",
        location: "Memorial Union",
        description: "UC Davis's premier hackathon focused on social good! Build innovative projects, win prizes, and network with top tech companies.",
        imageUrl: "https://hackdavis.io/assets/hackdavis-banner.jpg",
        category: "Hackathon",
        featured: true,
        featuredPriority: 2,
        tags: ["hackathon", "coding", "competition", "prizes"],
        maxAttendees: 500,
        registrationRequired: true,
        registrationUrl: "https://hackdavis.io",
        isActive: true
    },
    {
        title: "AI for Food Product Development Symposium",
        date: new Date('2025-10-13T16:00:00.000Z'),
        time: "8:00 AM - 8:00 PM",
        location: "UC Davis Conference Center",
        description: "Explore how AI is transforming food product design, development, and commercialization with industry leaders.",
        imageUrl: "https://aifs.ucdavis.edu/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Ffhus3ye6%2Fproduction%2F3c86b5bdafb9965f1390f3ef1ae57d7da0b57a25-1024x539.png&w=2048&q=75",
        category: "Research",
        featured: true,
        featuredPriority: 3,
        tags: ["AI", "research", "food-tech", "innovation"],
        maxAttendees: 200,
        registrationRequired: true,
        isActive: true
    },

    // =============================================================================
    // FEBRUARY 2025 EVENTS (Regular Calendar Events)
    // =============================================================================
    {
        title: "React Workshop for Beginners",
        date: new Date('2025-09-20T02:00:00.000Z'),
        time: "6:00 PM - 8:00 PM",
        location: "Kemper Hall 1131",
        description: "Learn React fundamentals, build your first component, and understand modern web development practices.",
        category: "Workshop",
        tags: ["react", "web-dev", "beginner", "frontend"],
        maxAttendees: 50,
        registrationRequired: true,
        isActive: true
    },
    {
        title: "Google Tech Talk: System Design",
        date: new Date('2025-09-20T02:30:00.000Z'),
        time: "6:30 PM - 8:00 PM",
        location: "Giedt Hall 1003",
        description: "Google engineers discuss large-scale system design principles and interview preparation strategies.",
        category: "Tech Talk",
        tags: ["google", "system-design", "careers"],
        maxAttendees: 200,
        isActive: true
    },
    {
        title: "Data Science Club Meeting",
        date: new Date('2025-09-20T02:00:00.000Z'),
        time: "6:00 PM - 7:30 PM",
        location: "Academic Surge 1100",
        description: "Weekly meeting to discuss ML projects, kaggle competitions, and upcoming workshops.",
        category: "Social",
        tags: ["data-science", "ML", "networking"],
        isActive: true
    },
    {
        title: "AWS Cloud Workshop",
        date: new Date('2025-10-19T01:00:00.000Z'),
        time: "5:00 PM - 7:00 PM",
        location: "Shields Library 163",
        description: "Hands-on workshop covering AWS basics, EC2, S3, and deploying your first cloud application.",
        category: "Workshop",
        tags: ["AWS", "cloud", "devops"],
        maxAttendees: 40,
        registrationRequired: true,
        isActive: true
    },
    {
        title: "Women in Tech Networking Night",
        date: new Date('2025-10-19T03:00:00.000Z'),
        time: "7:00 PM - 9:00 PM",
        location: "Alumni Center",
        description: "Connect with women leaders in tech, share experiences, and build your professional network.",
        category: "Networking",
        tags: ["women-in-tech", "networking", "diversity"],
        maxAttendees: 100,
        isActive: true
    },
    {
        title: "Startup Pitch Competition",
        date: new Date('2025-10-20T02:00:00.000Z'),
        time: "6:00 PM - 9:00 PM",
        location: "Graduate School of Management",
        description: "Watch student startups pitch their ideas to VCs and angel investors. $10K in prizes!",
        category: "Competition",
        tags: ["startup", "entrepreneurship", "pitch"],
        isActive: true
    },
    {
        title: "Python for Data Analysis",
        date: new Date('2025-10-20T02:00:00.000Z'),
        time: "6:00 PM - 8:00 PM",
        location: "TLC 2215",
        description: "Learn pandas, numpy, and matplotlib for data analysis and visualization.",
        category: "Workshop",
        tags: ["python", "data-analysis", "pandas"],
        maxAttendees: 60,
        registrationRequired: true,
        isActive: true
    },
    {
        title: "Cybersecurity CTF Practice",
        date: new Date('2025-10-20T03:00:00.000Z'),
        time: "7:00 PM - 10:00 PM",
        location: "Kemper Hall 1065",
        description: "Practice capture-the-flag challenges and prepare for upcoming competitions.",
        category: "Competition",
        tags: ["cybersecurity", "CTF", "hacking"],
        isActive: true
    },
    {
        title: "Microsoft Azure Fundamentals",
        date: new Date('2025-10-20T02:00:00.000Z'),
        time: "6:00 PM - 8:00 PM",
        location: "Hunt Hall 100",
        description: "Introduction to Azure cloud services and preparing for AZ-900 certification.",
        category: "Workshop",
        tags: ["azure", "cloud", "microsoft"],
        maxAttendees: 80,
        isActive: true
    },
    {
        title: "AI/ML Research Symposium",
        date: new Date('2025-11-22T00:00:00.000Z'),
        time: "4:00 PM - 7:00 PM",
        location: "Conference Center",
        description: "Graduate students present their latest AI/ML research. Poster session and networking included.",
        category: "Research",
        tags: ["AI", "ML", "research", "graduate"],
        isActive: true
    },
    {
        title: "Mobile App Development with Flutter",
        date: new Date('2025-11-24T02:00:00.000Z'),
        time: "6:00 PM - 8:00 PM",
        location: "Kemper Hall 1131",
        description: "Build cross-platform mobile apps with Flutter and Dart.",
        category: "Workshop",
        tags: ["mobile", "flutter", "app-dev"],
        maxAttendees: 45,
        registrationRequired: true,
        isActive: true
    },
    {
        title: "Tech Interview Prep Session",
        date: new Date('2025-11-25T02:30:00.000Z'),
        time: "6:30 PM - 8:30 PM",
        location: "Shields Library 163",
        description: "Practice coding interviews, system design, and behavioral questions with peers.",
        category: "Workshop",
        tags: ["interview", "careers", "leetcode"],
        isActive: true
    },
    {
        title: "Blockchain & Web3 Introduction",
        date: new Date('2025-11-26T03:00:00.000Z'),
        time: "7:00 PM - 9:00 PM",
        location: "Giedt Hall 1003",
        description: "Understanding blockchain technology, smart contracts, and the Web3 ecosystem.",
        category: "Tech Talk",
        tags: ["blockchain", "web3", "crypto"],
        maxAttendees: 150,
        isActive: true
    },
    {
        title: "Open Source Contribution Workshop",
        date: new Date('2025-11-27T02:00:00.000Z'),
        time: "6:00 PM - 8:00 PM",
        location: "TLC 2215",
        description: "Learn how to contribute to open source projects on GitHub. Make your first PR!",
        category: "Workshop",
        tags: ["open-source", "github", "collaboration"],
        maxAttendees: 40,
        isActive: true
    },

    // =============================================================================
    // MARCH 2025 EVENTS
    // =============================================================================
    {
        title: "Spring Tech Career Fair",
        date: new Date('2025-11-05T19:00:00.000Z'),
        time: "11:00 AM - 3:00 PM",
        location: "ARC Pavilion",
        description: "Connect with 100+ companies recruiting for summer internships and full-time positions.",
        category: "Career Fair",
        tags: ["career", "internships", "networking"],
        maxAttendees: null,
        registrationRequired: true,
        isActive: true
    },
    {
        title: "Game Development Showcase",
        date: new Date('2025-12-08T02:00:00.000Z'),
        time: "6:00 PM - 9:00 PM",
        location: "Memorial Union",
        description: "Play games created by UC Davis students and vote for your favorites!",
        category: "Social",
        tags: ["gamedev", "showcase", "unity"],
        isActive: true
    },
    {
        title: "Docker & Kubernetes Workshop",
        date: new Date('2025-12-10T01:00:00.000Z'),
        time: "5:00 PM - 7:00 PM",
        location: "Kemper Hall 1065",
        description: "Learn containerization with Docker and orchestration with Kubernetes.",
        category: "Workshop",
        tags: ["docker", "kubernetes", "devops"],
        maxAttendees: 35,
        registrationRequired: true,
        isActive: true
    },
    {
        title: "Women in STEM Conference",
        date: new Date('2025-12-12T16:00:00.000Z'),
        time: "8:00 AM - 5:00 PM",
        location: "Conference Center",
        description: "Full-day conference featuring keynotes, panels, and workshops for women in STEM.",
        category: "Conference",
        tags: ["women-in-stem", "diversity", "conference"],
        maxAttendees: 300,
        registrationRequired: true,
        registrationUrl: "https://womeninstem.ucdavis.edu",
        isActive: true
    },
    {
        title: "Aggie Hacks Mini",
        date: new Date('2025-12-15T01:00:00.000Z'),
        time: "5:00 PM - 11:00 PM",
        location: "TLC 3203",
        description: "6-hour mini hackathon focused on solving campus problems.",
        category: "Hackathon",
        tags: ["hackathon", "mini", "campus"],
        maxAttendees: 100,
        registrationRequired: true,
        isActive: true
    }
];

// =============================================================================
// SEED FUNCTION
// =============================================================================

async function seedEvents() {
    try {
        console.log('🌱 Starting enhanced events data seeding...');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing events (optional - comment out to keep existing)
        console.log('🗑️ Clearing existing events...');
        await Event.deleteMany({});

        // Get or create a system user
        let systemUser = await User.findOne({ email: { $regex: /@ucdavis\.edu$/i } });

        if (!systemUser) {
            console.log('👤 Creating system user...');
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
            attendees: [],
            status: 'published'
        }));

        // Insert events
        console.log('📅 Inserting events...');
        const insertedEvents = await Event.insertMany(eventsWithCreator);

        // Display summary
        console.log('\n📊 EVENTS SUMMARY:');
        console.log(`✅ Total events inserted: ${insertedEvents.length}`);

        const featured = insertedEvents.filter(e => e.featured);
        console.log(`⭐ Featured events: ${featured.length}`);
        featured.forEach(e => {
            console.log(`   ${e.featuredPriority}. ${e.title} - ${e.date.toLocaleDateString()}`);
        });

        // Group by month
        const eventsByMonth = {};
        insertedEvents.forEach(event => {
            const month = event.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
            if (!eventsByMonth[month]) {
                eventsByMonth[month] = [];
            }
            eventsByMonth[month].push(event);
        });

        console.log('\n📅 EVENTS BY MONTH:');
        Object.keys(eventsByMonth).sort().forEach(month => {
            console.log(`\n${month}: ${eventsByMonth[month].length} events`);
            eventsByMonth[month]
                .sort((a, b) => a.date - b.date)
                .forEach(event => {
                    const date = event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const featured = event.featured ? '⭐' : '  ';
                    console.log(`  ${featured} ${date}: ${event.title}`);
                });
        });

        // Count by category
        const categories = {};
        insertedEvents.forEach(event => {
            categories[event.category] = (categories[event.category] || 0) + 1;
        });

        console.log('\n📂 EVENTS BY CATEGORY:');
        Object.entries(categories).forEach(([category, count]) => {
            console.log(`  ${category}: ${count} events`);
        });

        console.log('\n✅ Events seeding completed successfully!');
        console.log('🎉 Your events page now has:');
        console.log(`   - ${featured.length} featured events`);
        console.log(`   - ${insertedEvents.length - featured.length} regular calendar events`);
        console.log(`   - Events spanning multiple months`);

    } catch (error) {
        console.error('💥 Error seeding events:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

// =============================================================================
// RUN SEED SCRIPT
// =============================================================================

if (require.main === module) {
    seedEvents();
}

module.exports = { eventsData, seedEvents };