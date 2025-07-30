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
    // HACKATHONS & COMPETITIONS
    // =============================================================================
    {
        title: "HackDavis 2025: Code for Good",
        date: new Date('2025-08-15T09:00:00.000Z'),
        time: "9:00 AM - 11:59 PM",
        location: "Activities & Recreation Center (ARC)",
        description: "UC Davis's premier hackathon focused on social good and environmental sustainability. Build solutions that make a positive impact on our community and planet. All skill levels welcome!",
        imageUrl: "/assets/events/hackdavis-2025.jpg",
        isActive: true
    },
    {
        title: "AI Challenge: Smart Campus Solutions",
        date: new Date('2025-08-08T10:00:00.000Z'),
        time: "10:00 AM - 6:00 PM",
        location: "Kemper Hall",
        description: "Design AI-powered solutions to improve campus life. Categories include energy efficiency, transportation, and student services. Prizes up to $5,000!",
        imageUrl: "/assets/events/ai-challenge.jpg",
        isActive: true
    },
    {
        title: "Cybersecurity CTF Competition",
        date: new Date('2025-08-28T06:00:00.000Z'),
        time: "6:00 PM - 11:59 PM",
        location: "Giedt Hall Computer Labs",
        description: "Test your hacking skills in our Capture the Flag competition. Teams will solve cybersecurity challenges in web security, cryptography, and forensics.",
        imageUrl: "/assets/events/ctf-competition.jpg",
        isActive: true
    },

    // =============================================================================
    // CAREER FAIRS & NETWORKING
    // =============================================================================
    {
        title: "Tech Career Fair 2025",
        date: new Date('2025-08-20T10:00:00.000Z'),
        time: "10:00 AM - 4:00 PM",
        location: "UC Center Ballroom",
        description: "Meet with representatives from Google, Apple, Microsoft, Meta, and 50+ other tech companies. Bring your resume and be ready to interview on the spot!",
        imageUrl: "/assets/events/tech-career-fair.jpg",
        isActive: true
    },
    {
        title: "Startup Pitch Night",
        date: new Date('2025-08-15T06:30:00.000Z'),
        time: "6:30 PM - 9:00 PM",
        location: "Mondavi Center",
        description: "Watch UC Davis students pitch their startup ideas to real investors. Network with entrepreneurs and learn about the startup ecosystem in California.",
        imageUrl: "/assets/events/startup-pitch.jpg",
        isActive: true
    },
    {
        title: "Women in Tech Networking Event",
        date: new Date('2025-08-22T05:00:00.000Z'),
        time: "5:00 PM - 8:00 PM",
        location: "Engineering Student Startup Center",
        description: "Connect with female leaders in tech from UC Davis alumni working at major tech companies. Food, networking, and career advice included!",
        imageUrl: "/assets/events/women-in-tech.jpg",
        isActive: true
    },

    // =============================================================================
    // WORKSHOPS & LEARNING
    // =============================================================================
    {
        title: "Introduction to Machine Learning",
        date: new Date('2025-08-10T02:00:00.000Z'),
        time: "2:00 PM - 5:00 PM",
        location: "Shields Library Tech Hub",
        description: "Hands-on workshop covering ML fundamentals with Python and scikit-learn. No prior experience required. Laptops provided or bring your own.",
        imageUrl: "/assets/events/ml-workshop.jpg",
        isActive: true
    },
    {
        title: "React.js Bootcamp",
        date: new Date('2025-08-25T06:00:00.000Z'),
        time: "6:00 PM - 9:00 PM",
        location: "Kemper Hall 1131",
        description: "Build your first React application from scratch. Learn components, hooks, and state management while creating a real project you can add to your portfolio.",
        imageUrl: "/assets/events/react-bootcamp.jpg",
        isActive: true
    },
    {
        title: "Cloud Computing with AWS",
        date: new Date('2025-08-01T01:00:00.000Z'),
        time: "1:00 PM - 4:00 PM",
        location: "Giedt Hall 1001",
        description: "Learn to deploy applications on Amazon Web Services. Covers EC2, S3, Lambda, and basic DevOps practices. AWS credits provided for hands-on practice.",
        imageUrl: "/assets/events/aws-workshop.jpg",
        isActive: true
    },

    // =============================================================================
    // RESEARCH & INNOVATION
    // =============================================================================
    {
        title: "AI Research Expo 2025",
        date: new Date('2025-08-10T01:00:00.000Z'),
        time: "1:00 PM - 6:00 PM",
        location: "Engineering Building III Atrium",
        description: "Showcase of cutting-edge AI research from UC Davis faculty and graduate students. Poster sessions, demos, and opportunities to join research labs.",
        imageUrl: "/assets/events/ai-research-expo.jpg",
        isActive: true
    },
    {
        title: "Quantum Computing Seminar",
        date: new Date('2025-08-18T03:00:00.000Z'),
        time: "3:00 PM - 5:00 PM",
        location: "Physics Building Lecture Hall",
        description: "Learn about the future of computing with quantum systems. Featuring speakers from IBM Quantum and UC Davis Physics Department.",
        imageUrl: "/assets/events/quantum-seminar.jpg",
        isActive: true
    },
    {
        title: "Biotech Innovation Showcase",
        date: new Date('2025-08-25T11:00:00.000Z'),
        time: "11:00 AM - 3:00 PM",
        location: "Genome Center",
        description: "Discover how technology is revolutionizing healthcare and agriculture. See demos of CRISPR, bioinformatics tools, and biomedical devices.",
        imageUrl: "/assets/events/biotech-showcase.jpg",
        isActive: true
    },

    // =============================================================================
    // SOCIAL & COMMUNITY
    // =============================================================================
    {
        title: "Game Dev Showcase",
        date: new Date('2025-08-12T07:00:00.000Z'),
        time: "7:00 PM - 9:00 PM",
        location: "Memorial Union Game Room",
        description: "Play games created by UC Davis students! Vote for your favorites and meet the developers. Pizza and prizes included.",
        imageUrl: "/assets/events/game-dev-showcase.jpg",
        isActive: true
    },
    {
        title: "Tech Talk: The Future of VR",
        date: new Date('2025-08-22T04:00:00.000Z'),
        time: "4:00 PM - 6:00 PM",
        location: "Hart Hall 1150",
        description: "Special guest speaker from Meta Reality Labs discusses the latest in virtual and augmented reality technology. VR demos available after the talk.",
        imageUrl: "/assets/events/vr-tech-talk.jpg",
        isActive: true
    },
    {
        title: "Open Source Contribution Day",
        date: new Date('2025-08-05T10:00:00.000Z'),
        time: "10:00 AM - 4:00 PM",
        location: "Shields Library Collaboration Rooms",
        description: "Make your first open source contribution! Mentors will help you find projects, set up development environments, and submit your first pull request.",
        imageUrl: "/assets/events/open-source-day.jpg",
        isActive: true
    },

    // =============================================================================
    // GUEST SPEAKERS & INDUSTRY EVENTS
    // =============================================================================
    {
        title: "Industry Panel: Life at Big Tech",
        date: new Date('2025-08-14T06:00:00.000Z'),
        time: "6:00 PM - 8:00 PM",
        location: "Wellman Hall 202",
        description: "UC Davis alumni from Google, Apple, Microsoft, and Amazon share their experiences and advice for landing your first tech job.",
        imageUrl: "/assets/events/industry-panel.jpg",
        isActive: true
    },
    {
        title: "Entrepreneur Spotlight: From Dorm to IPO",
        date: new Date('2025-08-12T07:00:00.000Z'),
        time: "7:00 PM - 8:30 PM",
        location: "Mondavi Center Studio Theatre",
        description: "Hear from UC Davis alum who founded a successful tech startup. Learn about the journey from student project to public company.",
        imageUrl: "/assets/events/entrepreneur-spotlight.jpg",
        isActive: true
    },

    // =============================================================================
    // RECURRING/ONGOING EVENTS
    // =============================================================================
    {
        title: "Weekly Coding Meetup",
        date: new Date('2025-08-07T07:00:00.000Z'),
        time: "7:00 PM - 9:00 PM",
        location: "Kemper Hall Study Lounge",
        description: "Casual coding session where students work on personal projects, share knowledge, and help each other debug. All programming languages welcome!",
        imageUrl: "/assets/events/coding-meetup.jpg",
        isActive: true
    },
    {
        title: "Tech Resume Review Workshop",
        date: new Date('2025-08-13T05:00:00.000Z'),
        time: "5:00 PM - 7:00 PM",
        location: "Career Center",
        description: "Get your tech resume reviewed by industry professionals and UC Davis career counselors. Bring printed copies and be ready for constructive feedback.",
        imageUrl: "/assets/events/resume-workshop.jpg",
        isActive: true
    },
    {
        title: "Algorithm Study Group",
        date: new Date('2025-08-11T06:30:00.000Z'),
        time: "6:30 PM - 8:30 PM",
        location: "Shields Library Group Study Room",
        description: "Prepare for technical interviews by solving algorithm problems together. We'll cover data structures, dynamic programming, and system design.",
        imageUrl: "/assets/events/algorithm-study.jpg",
        isActive: true
    }
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