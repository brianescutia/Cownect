// =============================================================================
// UPDATED CLUB SEED DATA - Real UC Davis Tech Clubs
// =============================================================================
// This replaces your seedClubs.js with comprehensive real club data

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Club = require('./models/Club');

dotenv.config();

// =============================================================================
// REAL UC DAVIS CLUB DATA - From your Google Sheet research
// =============================================================================

const clubData = [
    {
        name: "#include",
        description: "A student-led organization focused on promoting diversity and inclusion in computing through mentorship, workshops, and community events.",
        tags: ["diversity", "webdev", "mentorship", "programming"],
        category: "Software",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/include/logo/01JVQTV8FKBWV72CV6JXC5RR6D.png",
        memberCount: 45,
        websiteUrl: "https://includedavis.com/",
        instagramUrl: "https://www.instagram.com/includedavis/",
        contactEmail: "includeatdavis@gmail.com",
        meetingInfo: {
            frequency: "Weekly",
            day: "Thursday",
            time: "6:00 PM - 8:00 PM",
            location: "Kemper Hall 1131"
        },
        focusAreas: ["Web Development", "UI/UX Design", "Mentorship", "Diversity in Tech"],
        officers: [
            { position: "President", name: "Austin Shih", email: "ashih@ucdavis.edu" },
            { position: "Co-President", name: "Sechan Kim", email: "scnkim@ucdavis.edu" }
        ]
    },
    {
        name: "AI Student Collective",
        description: "A student-led organization focused on promoting diversity and inclusion in computing through mentorship, workshops, and community events.",
        tags: ["ai", "ml", "python", "research"],
        category: "Technology",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/aistudentcollective/logo/01JVQTJ8NSSAKD84YNAEMTJVPY.png",
        memberCount: 38,
        websiteUrl: "https://humansforai.com/aisc-davis",
        instagramUrl: "https://www.instagram.com/aiscdavis/",
        contactEmail: "aiscdavis@humansforai.com",
        meetingInfo: {
            frequency: "Bi-weekly",
            day: "Tuesday",
            time: "7:00 PM - 9:00 PM",
            location: "Giedt Hall 1001"
        },
        focusAreas: ["Machine Learning", "AI Research", "Industry Networking", "Product Competitions"],
        officers: [
            { position: "Senior Vice President", name: "Curtis Chen", email: "curchen@ucdavis.edu" }
        ]
    },
    {
        name: "Aggie Sports Analytics",
        description: "Analyzes sports data using statistics and coding to uncover insights; ideal for students interested in data science, sports, and performance metrics.",
        tags: ["analytics", "data", "sports", "statistics"],
        category: "Data Science",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/aggiesportsanalytics/logo/01JVQVDCBWM2P6KSJCNQFJW5CW.png",
        memberCount: 22,
        websiteUrl: "https://aggiesportsanalytics.com/",
        instagramUrl: "https://www.instagram.com/aggiesportsanalytics/",
        contactEmail: "team@aggiesportsanalytics.com",
        meetingInfo: {
            frequency: "Weekly",
            day: "Wednesday",
            time: "6:30 PM - 8:30 PM",
            location: "Mathematical Sciences Building"
        },
        focusAreas: ["Data Analysis", "Sports Statistics", "Visualization", "Predictive Modeling"],
        officers: [
            { position: "President", name: "Andrew Hale", email: "azhale@ucdavis.edu" },
            { position: "Vice President", name: "Jason Yang", email: "jzzyang@ucdavis.edu" }
        ]
    },
    {
        name: "AggieWorks",
        description: "UC Davis' premier interdisciplinary engineering and software development team that builds real-world products in collaboration with companies and research groups.",
        tags: ["hardware", "software", "product", "engineering"],
        category: "Technology",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/aggieworks/logo/01JVQTEG716WKSBDF0EJ3N2HKX.png",
        memberCount: 31,
        websiteUrl: "https://aggieworks.org/",
        instagramUrl: "https://www.instagram.com/ucd.aggieworks/",
        contactEmail: "hello@aggieworks.org",
        meetingInfo: {
            frequency: "Weekly",
            day: "Thursday",
            time: "7:00 PM - 9:00 PM",
            location: "Engineering Building III"
        },
        focusAreas: ["Product Development", "Full-Stack Development", "UI/UX Design", "Product Management"],
        officers: [
            { position: "President", name: "Samar Varma", email: "samvarma@ucdavis.edu" },
            { position: "VP of Operations", name: "Karen Liang", email: "kayliang@ucdavis.edu" }
        ]
    },
    {
        name: "BAJA SAE",
        description: "Designs and builds off-road vehicles from scratch to compete in national engineering competitions; a great hands-on club for mechanical and design engineering.",
        tags: ["engineering", "automotive", "design", "competition"],
        category: "Engineering",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/bajasae/logo/01JVQV3PMQKE7HMQW7Q06QCZ0K.png",
        memberCount: 67,
        websiteUrl: "https://ucdbajasae.org/",
        contactEmail: "davisbajainformation@gmail.com",
        meetingInfo: {
            frequency: "Weekly",
            day: "Saturday",
            time: "10:00 AM - 4:00 PM",
            location: "Engineering Student Startup Center"
        },
        focusAreas: ["Vehicle Design", "Manufacturing", "Welding", "Competition Prep"],
        officers: [
            { position: "President", name: "Jack Kimble", email: "jkimble@ucdavis.edu" }
        ]
    },
    {
        name: "Club of Future Female Engineers",
        description: "Empowers and supports women in engineering through networking, mentoring, and career-building events in a collaborative and welcoming environment.",
        tags: ["diversity", "mentorship", "engineering", "networking"],
        category: "Engineering",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/cluboffuturefemengineers/logo/01JVQSTV7XKMKCND24B1CBND1R.jpeg",
        memberCount: 28,
        websiteUrl: "https://coffeeucd.wixsite.com/coffeeucd/about-1",
        instagramUrl: "https://www.instagram.com/coffee_ucd/",
        contactEmail: "nvallamkondu@ucdavis.edu",
        meetingInfo: {
            frequency: "Bi-weekly",
            day: "Wednesday",
            time: "6:00 PM - 7:30 PM",
            location: "Kemper Hall 1003"
        },
        focusAreas: ["Academic Support", "Career Development", "Community Building", "Mentorship"],
        officers: [
            { position: "President", name: "Nayana Vallamkondu", email: "nvallamkondu@ucdavis.edu" },
            { position: "External Affairs", name: "Fatima Shaik", email: "fzshaik@ucdavis.edu" }
        ]
    },
    {
        name: "CodeLab",
        description: "A coding-focused club that hosts workshops, coding challenges, and peer-led sessions to help students improve their programming skills and build projects.",
        tags: ["software", "webdev", "mobile", "collaboration"],
        category: "Software",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/codelab/logo/01JVQTKM7H8T6X9VRZH4WDKRZY.png",
        memberCount: 42,
        websiteUrl: "https://www.codelabdavis.com/",
        instagramUrl: "https://www.instagram.com/codelabdavis/",
        contactEmail: "codelabdavis@gmail.com",
        meetingInfo: {
            frequency: "Weekly",
            day: "Monday",
            time: "7:00 PM - 9:00 PM",
            location: "Shields Library Tech Hub"
        },
        focusAreas: ["Web Development", "Mobile Apps", "UI/UX Design", "Project Management"],
        officers: [
            { position: "President", name: "Mohnish Gopi", email: "mgopi@ucdavis.edu" }
        ]
    },
    {
        name: "Cognitive Science Student Association",
        description: "Brings together students interested in cognitive science, AI, neuroscience, linguistics, and philosophy through discussions, talks, and research opportunities.",
        tags: ["ai", "neuroscience", "research", "philosophy"],
        category: "Technology",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/cognitivesciencestudentassociation/logo/01JVQTG5FEKCG40GG6CTWPTQGN.jpeg",
        memberCount: 35,
        websiteUrl: "https://linktr.ee/cssaatucdavis",
        instagramUrl: "https://www.instagram.com/cssaatucdavis/",
        contactEmail: "cssaatucdavis@gmail.com",
        meetingInfo: {
            frequency: "Bi-weekly",
            day: "Friday",
            time: "5:00 PM - 6:30 PM",
            location: "Hart Hall 1150"
        },
        focusAreas: ["Cognitive Research", "AI Applications", "Career Exploration", "Academic Support"],
        officers: [
            { position: "President", name: "Saniya Kotwal", email: "sgkotwal@ucdavis.edu" }
        ]
    },
    {
        name: "ColorStack",
        description: "A national organization with a UC Davis chapter focused on increasing the number of Black and Latinx students in computing through career prep and community support.",
        tags: ["diversity", "programming", "mentorship", "career"],
        category: "Technology",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/colorstack/logo/01JVQTJMA0DY89R14DZZVP6CBC.jpeg",
        memberCount: 29,
        websiteUrl: "https://linktr.ee/colorstack_ucd",
        instagramUrl: "https://www.instagram.com/colorstack_ucd/",
        contactEmail: "colorstack.ucd@gmail.com",
        meetingInfo: {
            frequency: "Weekly",
            day: "Tuesday",
            time: "6:30 PM - 8:00 PM",
            location: "Kemper Hall 1003"
        },
        focusAreas: ["Career Development", "Technical Skills", "Community Building", "Professional Development"],
        officers: [
            { position: "President", name: "Sarah Vasquez", email: "savasquez@ucdavis.edu" },
            { position: "Vice President", name: "Kevin Torres", email: "ktorressilva@ucdavis.edu" }
        ]
    },
    {
        name: "Computer Science Tutoring Club",
        description: "Provides free peer tutoring for ECS courses and helps students strengthen their understanding of core computer science concepts in a supportive environment.",
        tags: ["tutoring", "programming", "academic", "support"],
        category: "Software",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/computersciencetutoringclub/logo/01JVQSV4T9N4VTC3KF4NA13EP4.png",
        memberCount: 55,
        websiteUrl: "https://tutoring.cs.ucdavis.edu/",
        instagramUrl: "https://www.instagram.com/cstutoringatucd/",
        contactEmail: "cstutoring@ucdavis.edu",
        meetingInfo: {
            frequency: "Daily",
            day: "Monday-Friday",
            time: "Various Hours",
            location: "Kemper Hall Tutoring Center"
        },
        focusAreas: ["Course Tutoring", "Career Workshops", "Interview Prep", "Academic Support"],
        officers: [
            { position: "President", name: "Devansh Katiyar", email: "dkatiyar@ucdavis.edu" },
            { position: "VP of Logistics", name: "Vibhav Darsha", email: "vkdarsha@ucdavis.edu" }
        ]
    },
    {
        name: "Cyber Security Club at UC Davis",
        description: "Dedicated to learning about cybersecurity through workshops, Capture the Flag (CTF) competitions, and ethical hacking events.",
        tags: ["cybersecurity", "hacking", "security", "ctf"],
        category: "Technology",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/cybersecurityclubatucdavis/logo/01JVQT6PPGW013WGV5JQH595WF.png",
        memberCount: 35,
        websiteUrl: "https://daviscybersec.org/",
        instagramUrl: "https://www.instagram.com/daviscybersec/",
        contactEmail: "cyber-security-club-request@ucdavis.edu",
        meetingInfo: {
            frequency: "Weekly",
            day: "Thursday",
            time: "7:00 PM - 9:00 PM",
            location: "Giedt Hall 1001"
        },
        focusAreas: ["Ethical Hacking", "CTF Competitions", "Security Research", "Industry Networking"],
        officers: [
            { position: "President", name: "Ethan Ng", email: "eyng@ucdavis.edu" },
            { position: "Vice President", name: "Akhil Guntur", email: "asguntur@ucdavis.edu" }
        ]
    },
    {
        name: "Cyclone RoboSub",
        description: "A student-run robotics team that designs, builds, and programs autonomous underwater vehicles (AUVs) to compete in the international RoboSub competition.",
        tags: ["robotics", "automation", "programming", "competition"],
        category: "Hardware",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/cyclonerobosub/logo/01JVQSTHD9QJZD0C2PYJSQ50SY.png",
        memberCount: 42,
        websiteUrl: "https://cyclone-robosub.github.io/",
        instagramUrl: "https://www.instagram.com/cyclone_robosub/",
        contactEmail: "crs.aggies@gmail.com",
        meetingInfo: {
            frequency: "Weekly",
            day: "Saturday",
            time: "12:00 PM - 5:00 PM",
            location: "Engineering Student Startup Center"
        },
        focusAreas: ["Underwater Robotics", "Autonomous Systems", "Competition Prep", "Engineering Design"],
        officers: [
            { position: "President", name: "Peter Webster", email: "pwebster@ucdavis.edu" },
            { position: "Co-President", name: "Jason Pieck", email: "jdpieck@ucdavis.edu" }
        ]
    },
    {
        name: "Davis Data Driven Change",
        description: "Focuses on using data science and analytics to address social and community challenges through interdisciplinary projects and outreach.",
        tags: ["datascience", "social", "research", "community"],
        category: "Data Science",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/davisdatadrivenchange(d3c)/logo/01JVQT63Z6FZVJ36WRKW33BNTT.png",
        memberCount: 28,
        instagramUrl: "https://www.instagram.com/d3cdavis/",
        contactEmail: "d3cdavis@gmail.com",
        meetingInfo: {
            frequency: "Bi-weekly",
            day: "Sunday",
            time: "4:00 PM - 6:00 PM",
            location: "Shields Library Study Rooms"
        },
        focusAreas: ["Social Impact Projects", "Data Analysis", "Community Research", "Interdisciplinary Collaboration"],
        officers: [
            { position: "President", name: "Parsa Bazargani", email: "prbazargani@ucdavis.edu" },
            { position: "Events Lead", name: "Milli Molinari", email: "mimolinari@ucdavis.edu" }
        ]
    },
    {
        name: "Davis Data Science Club",
        description: "Connects students interested in data science through hands-on projects, workshops, and collaborations with industry professionals and faculty.",
        tags: ["datascience", "python", "visualization", "statistics"],
        category: "Data Science",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/davisdatascienceclub/logo/01JVQTWEV1HTQ0DQGY1BJVMW82.png",
        memberCount: 51,
        websiteUrl: "https://davisdsc.com/",
        instagramUrl: "https://www.instagram.com/data.ucd/",
        contactEmail: "team@davisdsc.com",
        meetingInfo: {
            frequency: "Weekly",
            day: "Wednesday",
            time: "7:00 PM - 8:30 PM",
            location: "Mathematical Sciences Building"
        },
        focusAreas: ["Machine Learning", "Data Visualization", "Industry Speakers", "Project Portfolio"],
        officers: [
            { position: "President", name: "Apoorva Hooda", email: "ahooda@ucdavis.edu" },
            { position: "Vice President", name: "Maya Nordin", email: "mnordin@ucdavis.edu" }
        ]
    },
    {
        name: "Davis Filmmaking Society",
        description: "Provides a creative space for students passionate about film to collaborate on scripts, shoots, and editing while building a strong portfolio.",
        tags: ["film", "creative", "media", "collaboration"],
        category: "Design",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/davisfilmmakingsociety/logo/01JVQSP5JQ1DK9D7GRFVJFK2J0.png",
        memberCount: 33,
        websiteUrl: "https://davisfilmmakingsoc.wixsite.com/my-site/n",
        instagramUrl: "https://www.instagram.com/davisfilmmakingsociety/",
        contactEmail: "davisfilmmakingsociety@gmail.com",
        meetingInfo: {
            frequency: "Weekly",
            day: "Friday",
            time: "6:00 PM - 8:00 PM",
            location: "Art Building Media Lab"
        },
        focusAreas: ["Film Production", "Screenwriting", "Video Editing", "Creative Collaboration"],
        officers: [
            { position: "President", name: "Jacob Cotero", email: "jtcotero@ucdavis.edu" },
            { position: "Outreach Chair", name: "William Egry", email: "wjegry@ucdavis.edu" }
        ]
    },
    {
        name: "Davis Robotics Club",
        description: "Welcomes students from all engineering backgrounds to design, build, and program robots for fun, learning, and competitions.",
        tags: ["robotics", "programming", "engineering", "competition"],
        category: "Hardware",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/davisroboticsclub/logo/01JVQTRFMKPY1MVTTKGWWFW1J5.png",
        memberCount: 38,
        websiteUrl: "https://aggielife.ucdavis.edu/roboticsclub/home/",
        instagramUrl: "https://www.instagram.com/davisrobotics/",
        contactEmail: "davisroboticsclub@gmail.com",
        meetingInfo: {
            frequency: "Weekly",
            day: "Thursday",
            time: "6:00 PM - 8:00 PM",
            location: "Engineering Building II"
        },
        focusAreas: ["Robot Design", "Programming", "Competition Robotics", "Hands-on Learning"],
        officers: [
            { position: "President", name: "Thomas Watson", email: "tjwatson@ucdavis.edu" }
        ]
    },
    {
        name: "Game Development and Arts Club",
        description: "Brings together artists, programmers, and storytellers to collaborate on creating original video games and interactive digital experiences.",
        tags: ["gamedev", "unity", "programming", "graphics"],
        category: "Software",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/gamedevelopment&artsclub/logo/01JVQTBP5QEDJRFZ8ADKPSJ8MG.png",
        memberCount: 29,
        websiteUrl: "https://linktr.ee/gdacdavis",
        instagramUrl: "https://www.instagram.com/gdacdavis/",
        contactEmail: "gdacdavis@gmail.com",
        meetingInfo: {
            frequency: "Weekly",
            day: "Tuesday",
            time: "7:00 PM - 9:00 PM",
            location: "Kemper Hall Computer Lab"
        },
        focusAreas: ["Game Development", "Digital Art", "Interactive Design", "Team Collaboration"],
        officers: [
            { position: "President", name: "Lucas", email: "gdacpresident@ucdavis.edu" }
        ]
    },
    {
        name: "Girls Who Code at UC Davis",
        description: "Empowers women and non-binary students in tech through coding workshops, mentorship, and a supportive community focused on closing the gender gap in CS.",
        tags: ["diversity", "programming", "mentorship", "hackathon"],
        category: "Technology",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/girlswhocodeatucdavis/logo/01JVQT3NJD1BQ0NZQPBZ9X3WY2.jpeg",
        memberCount: 45,
        websiteUrl: "https://linktr.ee/gwcdavis",
        instagramUrl: "https://www.instagram.com/gwcdavis/",
        contactEmail: "ucdavisgwc@gmail.com",
        meetingInfo: {
            frequency: "Weekly",
            day: "Wednesday",
            time: "6:30 PM - 8:00 PM",
            location: "Kemper Hall 1131"
        },
        focusAreas: ["Coding Workshops", "Career Development", "Hackathons", "Community Building"],
        officers: [
            { position: "President", name: "Meghan Cohen", email: "mcohen@ucdavis.edu" },
            { position: "VP External Affairs", name: "Divleen Lota", email: "dklota@ucdavis.edu" }
        ]
    },
    {
        name: "Google Developer Student Club",
        description: "A Google-supported club that builds real-world projects, hosts developer workshops, and helps students grow in software development and product thinking.",
        tags: ["google", "webdev", "mobile", "cloud"],
        category: "Technology",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/googledeveloperstudentclub/logo/01JVQTC50RE87ZS8QG971KQ1F4.png",
        memberCount: 52,
        websiteUrl: "https://gdscucdavis.com/",
        instagramUrl: "https://www.instagram.com/gdsc_ucdavis/",
        contactEmail: "melango@ucdavis.edu",
        meetingInfo: {
            frequency: "Weekly",
            day: "Monday",
            time: "7:00 PM - 9:00 PM",
            location: "Kemper Hall 1003"
        },
        focusAreas: ["Web Development", "Mobile Apps", "Cloud Computing", "Open Source"],
        officers: [
            { position: "President", name: "Manoj Elango", email: "melango@ucdavis.edu" },
            { position: "VP of Operations", name: "Saanika Gupta", email: "saanika.gupta@gmail.com" }
        ]
    },
    {
        name: "HackDavis",
        description: "UC Davis's premier collegiate hackathon, where students build software or hardware projects in 24 hours to tackle social and environmental challenges.",
        tags: ["hackathon", "social", "innovation", "competition"],
        category: "Technology",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/hackdavis/logo/01JVQSS38XXHZJYKQR48EHZRJ5.png",
        memberCount: 30,
        websiteUrl: "https://hackdavis.io/",
        instagramUrl: "https://www.instagram.com/hackdavis/",
        contactEmail: "team@hackdavis.io",
        meetingInfo: {
            frequency: "Weekly",
            day: "Sunday",
            time: "2:00 PM - 4:00 PM",
            location: "Alumni Center"
        },
        focusAreas: ["Event Planning", "Hackathon Organization", "Social Impact", "Technology Innovation"],
        officers: [
            { position: "President", name: "Jay Jain", email: "anjjain@ucdavis.edu" },
            { position: "Co-President", name: "Michelle Zhu", email: "mizhu@ucdavis.edu" }
        ]
    },
    {
        name: "Women in Computer Science",
        description: "Supports women and gender minorities in computer science through mentorship, career events, coding workshops, and a strong peer community.",
        tags: ["diversity", "programming", "mentorship", "career"],
        category: "Technology",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/womenincomputerscience/logo/01JVQT439C2QTFM5XZZH3XYHQ5.png",
        memberCount: 48,
        websiteUrl: "https://wics.engineering.ucdavis.edu/",
        instagramUrl: "https://www.instagram.com/wicsdavis/",
        contactEmail: "wicsdavis@gmail.com",
        meetingInfo: {
            frequency: "Bi-weekly",
            day: "Thursday",
            time: "6:00 PM - 7:30 PM",
            location: "Kemper Hall 1131"
        },
        focusAreas: ["Career Development", "Technical Workshops", "Mentorship", "Community Support"],
        officers: [
            { position: "President", name: "Maithreyi Narayanan", email: "mnarayan@ucdavis.edu" },
            { position: "Co-President", name: "Sri Lakshmi Panda", email: "slpanda@ucdavis.edu" }
        ]
    },
    {
        name: "Design Interactive",
        description: "A club for students passionate about UX/UI design, human-computer interaction, and product design. Offers hands-on design challenges, Figma workshops, and portfolio help.",
        tags: ["design", "ux", "ui", "figma", "prototyping"],
        category: "Design",
        logoUrl: "https://pub-1030958593964b819d564f7f21715215.r2.dev/designinteractive/logo/01JVQSWY96TCDNP38XEJ7TJ8HR.png",
        memberCount: 33,
        websiteUrl: "https://www.davisdi.org/",
        instagramUrl: "https://www.instagram.com/davisdesigninteractive/",
        contactEmail: "davisdesigninteractive@gmail.com",
        meetingInfo: {
            frequency: "Weekly",
            day: "Tuesday",
            time: "6:30 PM - 8:00 PM",
            location: "Art Building Design Studio"
        },
        focusAreas: ["UX/UI Design", "Human-Computer Interaction", "Design Thinking", "Portfolio Development"],
        officers: [
            { position: "President", name: "Viv Nguyen", email: "vypnguyen@ucdavis.edu" },
            { position: "Co-President", name: "Samantha Mah", email: "stmah@ucdavis.edu" }
        ]
    }
];

// =============================================================================
// SEED FUNCTION
// =============================================================================

async function seedClubs() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB Atlas');

        // 🗑️ CLEAR EXISTING CLUBS
        console.log('🗑️ Clearing existing clubs...');
        await Club.deleteMany({});
        console.log('✅ Existing clubs cleared');

        // 📊 INSERT NEW CLUB DATA
        console.log('📊 Inserting real UC Davis club data...');
        const insertedClubs = await Club.insertMany(clubData);
        console.log(`✅ Successfully inserted ${insertedClubs.length} clubs`);

        // 📋 DISPLAY INSERTED CLUBS
        console.log('\n📋 Inserted Real UC Davis Clubs:');
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

        console.log('\n🎉 Real UC Davis club data loaded successfully!');
        console.log('🚀 Your club cards now show actual Davis organizations!');

    } catch (error) {
        console.error('💥 Error seeding database:', error);
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
    console.log('🌱 Starting real UC Davis club data seeding...');
    seedClubs();
}

module.exports = { clubData, seedClubs };