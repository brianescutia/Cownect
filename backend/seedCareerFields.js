// Save as: backend/seedCareerFields.js (replace your existing file)
// Run with: node backend/seedCareerFields.js

require('dotenv').config();
const mongoose = require('mongoose');
const { CareerField } = require('./models/nicheQuizModels');

// Import your existing career data
const { sophisticatedCareerFields } = require('./data/sophisticatedResearchBackedQuizData');

async function checkSchemaAndSeed() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check what enum values are allowed for category
        console.log('\n🔍 Checking database schema for valid categories...');
        const schema = CareerField.schema.paths.category;
        if (schema && schema.enumValues) {
            console.log('✅ Valid category enum values:', schema.enumValues);
        } else {
            console.log('ℹ️  No enum restriction found for category field');
        }

        console.log('\n🧹 Clearing existing career fields...');
        await CareerField.deleteMany({});

        console.log('🌱 Seeding career fields from your existing data...');

        // Map categories to match your database enum values
        const categoryMapping = {
            "Core Tech": "Engineering",
            "Data & Analytics": "Data",
            "Design": "Design",
            "Product": "Product",
            "Infrastructure": "Engineering",
            "Security": "Security",
            "Emerging Tech": "Engineering", // Changed from Technology
            "Hybrid Roles": "Product",     // Changed from Business  
            "Entrepreneurship": "Product"   // Changed from Business
        };

        // Show the mapping
        console.log('\n📋 Category mapping:');
        Object.entries(categoryMapping).forEach(([original, mapped]) => {
            console.log(`   ${original} → ${mapped}`);
        });

        // Format your existing data for the database
        const careerFieldsForDB = sophisticatedCareerFields.map(career => {
            const mappedCategory = categoryMapping[career.category] || "Engineering";
            console.log(`   Processing: ${career.name} (${career.category} → ${mappedCategory})`);

            return {
                name: career.name,
                category: mappedCategory,
                description: career.description,
                skillWeights: career.skillWeights,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };
        });

        console.log(`\n🌱 Attempting to create ${careerFieldsForDB.length} career fields...`);

        // Try to insert one by one to see which ones fail
        const createdFields = [];
        for (const field of careerFieldsForDB) {
            try {
                const created = await CareerField.create(field);
                createdFields.push(created);
                console.log(`   ✅ Created: ${field.name}`);
            } catch (error) {
                console.log(`   ❌ Failed: ${field.name} - ${error.message}`);
            }
        }

        console.log(`\n✅ Successfully seeded ${createdFields.length} career fields:`);
        createdFields.forEach(field => {
            console.log(`   - ${field.name} (${field.category})`);
        });

        console.log('\n🎯 Career field seeding complete!');

        // Test the data
        console.log('\n🧪 Testing a sample career field:');
        const sampleField = await CareerField.findOne({ name: 'Software Engineering' });
        if (sampleField) {
            console.log(`   Found: ${sampleField.name}`);
            console.log(`   Category: ${sampleField.category}`);
            console.log(`   Skills: Technical=${sampleField.skillWeights.technical}, Creative=${sampleField.skillWeights.creative}`);
        } else {
            console.log('   ⚠️  Software Engineering not found - checking what was created...');
            const allFields = await CareerField.find({}).select('name category');
            console.log('   Created fields:', allFields.map(f => `${f.name} (${f.category})`));
        }

        process.exit(0);

    } catch (error) {
        console.error('💥 Error seeding career fields:', error);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

// Run the seeder
checkSchemaAndSeed();