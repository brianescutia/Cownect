// =============================================================================
// CLUB SEED DATA - Populate database with real UC Davis tech clubs
// =============================================================================
// This script adds initial club data to replace your static HTML cards
// Run once to populate the database, then clubs come from MongoDB

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Club = require('./models/Club');

dotenv.config();

// =============================================================================
// SAMPLE CLUB DATA - Based on your current HTML cards
// =============================================================================

const clubData = [
    {
        name: "#include",
        description: "Build real-world coding projects with fellow students.",
        tags: ["software", "webdev", "collaboration"],
        category: "Software",
        logoUrl: "/assets/include.png",
        memberCount: 45
    },
    {
        name: "AI Student Collective",
        description: "Dive into machine learning, NLP, and computer vision.",
        tags: ["ai", "ml", "python", "research"],
        category: "Technology",
        logoUrl: "/assets/aiStudentCollective.png",
        memberCount: 38
    },
    {
        name: "Aggie Sports Analytics",
        description: "Apply data science and analytics to sports performance.",
        tags: ["analytics", "data", "sports", "statistics"],
        category: "Data Science",
        logoUrl: "/assets/aggieSportsAnalytics.png",
        memberCount: 22
    },
    {
        name: "AggieWorks",
        description: "Hands-on with electronics, microcontrollers, and sensors.",
        tags: ["hardware", "arduino", "circuits", "embedded"],
        category: "Hardware",
        logoUrl: "/assets/aggieworks.png",
        memberCount: 31
    },
    {
        name: "BAJA SAE",
        description: "Design and build off-road racing vehicles for competition.",
        tags: ["engineering", "automotive", "design", "competition"],
        category: "Engineering",
        logoUrl: "/assets/bajaSae.png",
        memberCount: 67
    },
    {
        name: "Club of Future Female Engineers",
        description: "Empowering women in engineering through mentorship and projects.",
        tags: ["diversity", "mentorship", "engineering", "networking"],
        category: "Engineering",
        logoUrl: "/assets/clubOfFutureFemEngineers.jpeg",
        memberCount: 28
    },

    // 🔥 ADDITIONAL CLUBS - Make your database more realistic
    {
        name: "Davis Robotics",
        description: "Build autonomous robots for competitions and research projects.",
        tags: ["robotics", "automation", "programming", "competition"],
        category: "Technology",
        logoUrl: "/assets/default-club-logo.png",
        memberCount: 42
    },
    {
        name: "Cybersecurity Club",
        description: "Learn ethical hacking, penetration testing, and security best practices.",
        tags: ["cybersecurity", "hacking", "security", "ctf"],
        category: "Technology",
        logoUrl: "/assets/default-club-logo.png",
        memberCount: 35
    },
    {
        name: "Game Development Society",
        description: "Create indie games using Unity, Unreal Engine, and custom frameworks.",
        tags: ["gamedev", "unity", "programming", "graphics"],
        category: "Software",
        logoUrl: "/assets/default-club-logo.png",
        memberCount: 29
    },
    {
        name: "Data Science Association",
        description: "Explore machine learning, data visualization, and statistical analysis.",
        tags: ["datascience", "python", "visualization", "statistics"],
        category: "Data Science",
        logoUrl: "/assets/default-club-logo.png",
        memberCount: 51
    },
    {
        name: "UX/UI Design Collective",
        description: "Design user-centered interfaces and improve digital experiences.",
        tags: ["design", "ux", "ui", "figma", "prototyping"],
        category: "Design",
        logoUrl: "/assets/default-club-logo.png",
        memberCount: 33
    },
    {
        name: "Blockchain & Crypto Society",
        description: "Understand decentralized technologies and build Web3 applications.",
        tags: ["blockchain", "crypto", "web3", "ethereum"],
        category: "Technology",
        logoUrl: "/assets/default-club-logo.png",
        memberCount: 19
    }
];

// =============================================================================
// SEED FUNCTION
// =============================================================================

async function seedClubs() {
    try {
        // 🔗 CONNECT TO DATABASE
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB Atlas');

        // 🗑️ CLEAR EXISTING CLUBS (optional - removes old data)
        console.log('🗑️ Clearing existing clubs...');
        await Club.deleteMany({});
        console.log('✅ Existing clubs cleared');

        // 📊 INSERT NEW CLUB DATA
        console.log('📊 Inserting club data...');
        const insertedClubs = await Club.insertMany(clubData);
        console.log(`✅ Successfully inserted ${insertedClubs.length} clubs`);

        // 📋 DISPLAY INSERTED CLUBS
        console.log('\n📋 Inserted Clubs:');
        insertedClubs.forEach(club => {
            console.log(`  - ${club.name} (${club.tags.length} tags, ${club.memberCount} members)`);
        });

        // 📊 DISPLAY STATISTICS  
        const totalClubs = await Club.countDocuments();
        const activeClubs = await Club.countDocuments({ isActive: true });
        const categories = await Club.distinct('category');

        console.log('\n📊 Database Statistics:');
        console.log(`  Total Clubs: ${totalClubs}`);
        console.log(`  Active Clubs: ${activeClubs}`);
        console.log(`  Categories: ${categories.join(', ')}`);

        console.log('\n🎉 Database seeding completed successfully!');

    } catch (error) {
        console.error('💥 Error seeding database:', error);
    } finally {
        // 🔌 CLOSE DATABASE CONNECTION
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

// =============================================================================
// RUN SEED SCRIPT
// =============================================================================

// Check if script is run directly (not imported)
if (require.main === module) {
    console.log('🌱 Starting club database seeding...');
    seedClubs();
}

module.exports = { clubData, seedClubs };

// =============================================================================
// HOW TO USE THIS SCRIPT:
// =============================================================================
//
// 1. Save this as backend/seedClubs.js
// 2. Run: node backend/seedClubs.js
// 3. Check your MongoDB Atlas - you should see clubs in the database!
// 4. Your static HTML cards will be replaced with this dynamic data
//
// =============================================================================