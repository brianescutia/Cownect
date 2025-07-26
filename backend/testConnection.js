// Save this as backend/testConnection.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testConnection() {
    try {
        console.log('🔍 Testing MongoDB connection...');
        console.log('Connection string:', process.env.MONGO_URI ? 'Found ✅' : 'Missing ❌');

        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI not found in .env file');
            process.exit(1);
        }

        // Connect to MongoDB
        console.log('🌐 Connecting to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGO_URI);

        console.log('✅ Successfully connected to MongoDB Atlas!');
        console.log('📊 Database name:', mongoose.connection.name);
        console.log('🔗 Host:', mongoose.connection.host);

        // Test a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📁 Available collections:', collections.map(c => c.name));

        // Close connection
        await mongoose.connection.close();
        console.log('🔌 Connection closed successfully');

    } catch (error) {
        console.error('💥 Connection failed:', error.message);

        if (error.message.includes('authentication failed')) {
            console.error('🔐 Check your username and password in the connection string');
        } else if (error.message.includes('network')) {
            console.error('🌐 Check your internet connection and MongoDB Atlas settings');
        }

        process.exit(1);
    }
}

// Run the test
testConnection();