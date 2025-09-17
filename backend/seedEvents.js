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
        title: "Engineering Student Club Fair",
        date: new Date('2025-09-19T17:00:00.000Z'), // 10:00am PDT = 17:00 UTC
        time: "10:00am - 11:30am",
        location: "Bainer Lawn",
        description: "Come learn about all our amazing engineering clubs and how you can participate!",
        imageUrl: "https://engineering.ucdavis.edu/sites/g/files/dgvnsk2151/files/styles/sf_landscape_16x9/public/media/images/53221921897_11fecef2ff_k.jpg?h=a1e1a043&itok=TRWcF3XH",
        category: "Academic",
        featured: true,
        featuredPriority: 2,
        tags: ["hackathon", "coding", "competition", "prizes"],
        maxAttendees: 500,
        registrationRequired: true,
        registrationUrl: "",
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
    // SEPTEMBER 2025 EVENTS (Regular Calendar Events)
    // =============================================================================
    {
        title: "Engineering Student Club Fair",
        date: new Date('2025-09-19T17:00:00.000Z'), // 10:00am PDT = 17:00 UTC
        time: "10:00am - 11:30am",
        location: "Bainer Lawn",
        description: "Come learn about all our amazing engineering clubs and how you can participate!",
        category: "Academic", // or could be "Social"
        tags: ["networking"],
        isActive: true
    },
    {
        title: "Innovator Network: Medical Technology",
        date: new Date('2025-09-25T23:00:00.000Z'), // 4:00pm PDT = 23:00 UTC
        time: "4:00pm - 6:00pm",
        location: "Aggie Commons @ Aggie Square, 4480 2nd Avenue, Sacramento",
        description: "The Innovator Network is coming to Aggie Square in September! Hosted in partnership with the UC Davis Library, come join us for an event focusing on novel medical technologies and the startups that grew from them. Our broadcast panel of UC Davis innovators yet — including undergraduate founders, a professional researcher, two professors in the College of Engineering, and a doctor — will share their entrepreneurial stories.",
        category: "Professional", // or "Academic"
        tags: ["networking"],
        isActive: true
    },
    {
        title: "Press Play: Activision Blizzard King 2026 Internship Overview",
        date: new Date('2025-09-16T17:00:00.000Z'), // 10 AM PDT = 17:00 UTC
        time: "10 AM-11 AM PDT",
        location: "Virtual",
        description: "Our Summer 2026 Internships will be opening soon across Activision, Blizzard, and King and we'd love for you to come join us for some fun, educational chats about our program, and to see what we're offering this year! We'll be hosting 8 info sessions beginning August 19 thru September 18. In these hour-long sessions, we'll go over: A brief company overview, Internship opportunities, Requirements, What we, the recruiters, look for, And plenty of time for Q&A.",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "Press Play: Activision Blizzard King 2026 Internship Overview",
        date: new Date('2025-09-16T21:00:00.000Z'), // 2 PM PDT = 21:00 UTC
        time: "2 PM-3 PM PDT",
        location: "Virtual",
        description: "Our Summer 2026 Internships will be opening soon across Activision, Blizzard, and King and we'd love for you to come join us for some fun, educational chats about our program, and to see what we're offering this year!",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "Press Play: Activision Blizzard King 2026 Internship Overview",
        date: new Date('2025-09-17T17:00:00.000Z'), // 10 AM PDT = 17:00 UTC
        time: "10 AM-11 AM PDT",
        location: "Virtual",
        description: "Our Summer 2026 Internships will be opening soon across Activision, Blizzard, and King and we'd love for you to come join us for some fun, educational chats about our program, and to see what we're offering this year!",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "Press Play: Activision Blizzard King 2026 Internship Overview",
        date: new Date('2025-09-18T21:00:00.000Z'), // 2 PM PDT = 21:00 UTC
        time: "2 PM-3 PM PDT",
        location: "Virtual",
        description: "Our Summer 2026 Internships will be opening soon across Activision, Blizzard, and King and we'd love for you to come join us for some fun, educational chats about our program, and to see what we're offering this year!",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "Davisfest - First-Year - Career Center Information Table",
        date: new Date('2025-09-20T21:00:00.000Z'), // 2 PM PDT = 21:00 UTC
        time: "2 PM-5 PM PDT",
        location: "Quad, 1 Shields Ave, Davis, California 95616, United States",
        description: "New incoming first-year students - learn about what the Career Center has to offer, including student employment, health related experiences, Handshake, career fairs and so much more.",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "Epic Virtual Info Session & Resume Review: Focus on Community & Belonging PDT",
        date: new Date('2025-09-16T18:00:00.000Z'), // 11 AM PDT = 18:00 UTC
        time: "11 AM-12 PM PDT",
        location: "Virtual",
        description: "Epic is excited to invite you to our upcoming employer information session, where students from diverse backgrounds can explore a wide array of exciting career opportunities within our organization. We're also hosting a resume review workshop, led by one of Epic's recruiters! Get ready for some hot tips and insider tricks to make your resume shine. Epic is a healthcare software company headquartered in Madison, WI, with customers in all 50 states and around the world.",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "Networking on LinkedIn for Students & Grads",
        date: new Date('2025-09-18T19:00:00.000Z'), // 12 PM PDT = 19:00 UTC
        time: "12 PM-12:30 PM PDT",
        location: "Virtual",
        description: "Your network is one of your most valuable career tools—and LinkedIn is where it starts. Whether you're job searching, exploring career paths, or building connections in your field, this virtual workshop will show you how to make LinkedIn work for you. In this session, you'll learn: How to create a strong, student-friendly profile, What to post (and what not to), How to connect with alumni and professionals, Easy ways to grow your network and start conversations.",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "Optimizing your LinkedIn Profile",
        date: new Date('2025-09-18T20:00:00.000Z'), // 1 PM PDT = 20:00 UTC
        time: "1 PM-2 PM PDT",
        location: "Virtual",
        description: "Your LinkedIn profile is more than just an online resume—it's your personal brand, your network, and your first opportunity to turn into career opportunities. Join us for an interactive virtual session focused on optimizing your LinkedIn profile and making the most of the platform as a student or early-career professional. Whether you're just getting started or want to take your profile to the next level, this session will give you the tools to stand out.",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "Epic Virtual Info Session & Tech Talk: Focus on Community & Belonging",
        date: new Date('2025-09-23T18:00:00.000Z'), // 11 AM PDT = 18:00 UTC
        time: "11 AM-12 PM PDT",
        location: "Virtual",
        description: "Epic is thrilled to invite you to our upcoming employer information session! This event is a fantastic opportunity for students from all backgrounds to discover the diverse and exciting career paths available at Epic. You'll also have the chance to hear directly from our tech experts during a special tech talk. Epic is a healthcare software company headquartered in Madison, WI, with customers in all 50 states and even internationally. We design, build, and implement applications for everything from hospital scheduling to supporting medical specialties to hospital billing. About 78 percent of the US population is cared for by Epic software! By attending this session, you will have the opportunity to gain insights into our company's inclusive workforce that reflects the rich diversity of our global community.",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "Resume Reviews and Mock Interviews by Lenovo LEAD 2025 (Virtual Event)",
        date: new Date('2025-09-24T16:30:00.000Z'), // 9:30 AM PDT = 16:30 UTC
        time: "9:30 AM-9:30 AM PDT",
        location: "Virtual",
        description: "During Lenovo's 2025 Global Month of Service, Lenovo employees will organize resume reviews and mock interviews via virtual meeting tools. We welcome students and recent grads to sign up to learn and social with our employees from our Morrisville, NC; Chicago, IL; and San Jose, CA offices. This event is intended to provide an opportunity for university students and early career professionals who are interested in the technology industry to receive meaningful feedback on their resumes and interviewing skills. The participating Lenovo employees have experience in technical areas including research, sales, communications, operations, management, and interdisciplinary fields. Please note that this is NOT a recruiting event and there are no job opportunities available. Events include: Sept 24th @ 12:30 PM - 1:30 PM ET / 11:30 AM - 12:30 PM CT; Webinar on Resume Tips and Interview Skills from Lenovo HR; 1-on-1 Resume Review and Mock Interview during Sept 24th – Oct 11th at your own time within the timeframe in your interest field. Here at Lenovo, we are focused on delivering a smarter technology for all. We can't wait for you to join us for our event! If you have any question, you can contact Aung Hein Kyaw (aung@lenovo.com) and Hongjuan Chen (chen@lenovo.com).",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },

    // =============================================================================
    // OCTOBER 2025 EVENTS (Regular Calendar Events)
    // =============================================================================
    {
        title: "Workforce Development Program Showcase and Info Session",
        date: new Date('2025-10-08T23:00:00.000Z'), // 4:00pm PDT = 23:00 UTC
        time: "4:00pm - 6:00pm",
        location: "Kemper Hall Lobby",
        description: "We are excited to invite you to our Internship Opportunity Info Session and Workforce Development Showcase on Wednesday, October 8th from 4:00 PM to 6:00 PM at the Kemper Hall Lobby, UC Davis. Join us as 2025 summer interns, supported by the NSF ExLENT program, DoD AI Hub, and CITRIS, showcase the cutting-edge research they conducted in faculty labs and industry environments. In addition to the showcase, we'll host an info session covering internship opportunities and K-12 educational outreach.",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "#TeamHuman: Community Rooted AI Research with Dr. Timnit Gebru — Co-Sponsored by CILS and UC Davis AI Center in Engineering",
        date: new Date('2025-10-14T19:00:00.000Z'), // 12:00pm PDT = 19:00 UTC
        time: "12:00pm - 1:00pm",
        location: "King Hall, Room 1001",
        description: "In the last few years, the quest to build so-called Artificial General Intelligence (AGI), an undefined system which seemingly can do any task under any circumstance, has captured the public's imagination. Those whose mission has been to build this system, like the leaders of OpenAI, Anthropic, Deepmind and others, discuss the utopia that will purportedly come from building AGI, or the apocalypse that will be caused by it rendering humanity extinct. In this talk, Dr. Gebru discusses the history of the AGI movement, and its link to the 20th century eugenics movement, with those who 'christened' the term AGI having the goal of replacing humans with a superior race they call 'transhuman AGI.' She outlines the harms the quest to build AGI has caused, including labor exploitation, centralization of power and the safety issues associated with rushing an unchecked system.",
        category: "Academic",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "AI Innovation Showcase and Prem Jain Symposium",
        date: new Date('2025-10-16T20:30:00.000Z'), // 1:30pm PDT = 20:30 UTC
        time: "1:30pm - 6:30pm",
        location: "UC Davis Campus",
        description: "Join the UC Davis College of Engineering and our AI Center in Engineering for a program featuring industry, academia and student perspectives on innovative AI research and entrepreneurship at UC Davis.",
        category: "Academic",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "Sandia National Laboratories Information Session",
        date: new Date('2025-10-15T01:30:00.000Z'), // 6:30 PM PDT = 01:30 UTC next day
        time: "6:30 PM-7:30 PM PDT",
        location: "Teaching and Learning Complex, 1 Shields Ave, Davis, California 95616, United States",
        description: "Come learn more about working in National Security at Sandia National Labs! We'll give an overview of our organization, working at the Labs, and the various opportunities available for internships, Fellowships, Postdocs, and full-time roles!",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "Google on Campus @ UC Davis! Career Opportunities at Google",
        date: new Date('2025-10-03T02:00:00.000Z'), // 7 PM PDT = 02:00 UTC next day
        time: "7 PM-8:30 PM PDT",
        location: "Giedt Hall, 1 Shields Ave, Davis, California 95616, United States",
        description: "We are excited to visit the UC Davis campus this quarter to host an info session on career opportunities at Google. We're eager to share our experiences, discuss Google's culture, and highlight the impactful projects we're building. Whether you're studying computer science, business, or another field, we believe there's a place for your unique skills and passions at Google. This is your chance to meet our team, ask questions, and learn about diverse career paths, including internship programs.",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "Google on Campus @ UC Davis! Resume & Interview Tips & Tricks",
        date: new Date('2025-10-03T22:00:00.000Z'), // 3 PM PDT = 22:00 UTC
        time: "3 PM-4:30 PM PDT",
        location: "UC Davis Campus", // Location not fully specified in the image
        description: "We are excited to visit the UC Davis campus this quarter to host a workshop to improve your resume and interview skills. We're eager to share our experiences, discuss Google's culture, and highlight the impactful projects we're building. Whether you're studying computer science, business, or another field, we believe there's a place for your unique skills and passion at Google. This is your chance to meet our team, ask questions, and learn about diverse career paths, including internships.",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "Johnson & Johnson WiSTEM2D Presents - Backpacks to Briefcases",
        date: new Date('2025-10-08T15:00:00.000Z'), // 8 AM PDT = 15:00 UTC
        time: "8 AM-9:30 AM PDT",
        location: "Virtual",
        description: "In 2015, Johnson & Johnson launched WiSTEM2D – Winning in Science, Technology, Engineering, Math, Manufacturing, and Design (STEM2D) – initiative to promote learning and career opportunities in STEM2D disciplines. Led by a network of volunteers from across Johnson & Johnson and its local operating companies, this ambitious initiative seeks to promote learning across Youth, University and Professionals. Join us for an engaging session focused on preparing you for your professional journey. Hear from an experienced career and leadership coach who will share real-world strategies and tips to navigate today's workplace. Representatives from Talent Acquisition will also be on hand to answer your questions and offer insight into early career opportunities!",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "IBM USA College and University Student Tech Talk Wednesdays",
        date: new Date('2025-10-08T21:00:00.000Z'), // 2 PM PDT = 21:00 UTC
        time: "2 PM-3 PM PDT",
        location: "Virtual",
        description: "A fast paced 60 minutes with IBM Tech Talk College and University Student Wednesdays! Join industry leaders and students in this discussion with questions from students and connections to leaders that you have been requesting. In addition to hearing from an industry expert in a different topic each month, also hear from and begin networking with other students who have been participating in the programs for over a year now who are also answering the questions in the chat because to their experiences, internships, or jobs they are now in. The dialogue continues to expand with the student, industry pro academic experiences shared in the discussion. 1) IBM Midwest Academic Programs Manager walks students through enrollment and new base for today (10 Minutes) 2) IBM Recruiting Leader talks about new information on jobs in IBM (Internship and full-time positions) (10 Minutes) 3) Industry Tech talks from subject matter expert (25 Minutes) 4) Question and answer time (15 minutes) Looking forward to seeing you!",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "Radiology Technologist (RT) Career Opportunities Webinar",
        date: new Date('2025-10-14T16:00:00.000Z'), // 9 AM PDT = 16:00 UTC
        time: "9 AM-10 AM PDT",
        location: "Virtual",
        description: "Ready to take the next step in your career as a Radiologic Technologist? Join Guthrie for a virtual information session, where you'll learn about exciting opportunities to grow your career with one of the region's leading health care systems. During this interactive event, you will: Discover what it's like to work as a Radiologic Technologist at The Guthrie Clinic; Learn about our supportive work environment, training opportunities and career advancement pathways; Get an overview of our comprehensive benefits and current $50,000 sign-on for full-time medical imaging roles (Limited Time); Have the chance to ask questions during a live Q&A session.",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "From Intern to Data Scientist: Navigating a Career in Data at Nissan",
        date: new Date('2025-10-14T15:30:00.000Z'), // 8:30 AM PDT = 15:30 UTC
        time: "8:30 AM-9:15 AM PDT",
        location: "Virtual",
        description: "Ever wondered what it's like to turn an internship into a full-time role in data science? Join us for a virtual conversation with a Nissan team member who started as an intern and now works full-time in data science. Learn how they made the transition, what their day-to-day looks like, and how data drives innovation at Nissan. Plus, get the inside scoop on Nissan's internship program—including how to apply—and stick around for a live Q&A to ask your own questions about data careers, internships, and more.",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },
    {
        title: "From Intern to Data Scientist: Navigating a Career in Data at Nissan",
        date: new Date('2025-10-14T15:30:00.000Z'), // 8:30 AM PDT = 15:30 UTC
        time: "8:30 AM-9:15 AM PDT",
        location: "Virtual",
        description: "Ever wondered what it's like to turn an internship into a full-time role in data science? Join us for a virtual conversation with a Nissan team member who started as an intern and now works full-time in data science. Learn how they made the transition, what their day-to-day looks like, and how data drives innovation at Nissan. Plus, get the inside scoop on Nissan's internship program—including how to apply—and stick around for a live Q&A to ask your own questions about data careers, internships, and more.",
        category: "Professional",
        tags: ["networking"],
        isActive: true
    },

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