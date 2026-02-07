const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually read .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
let uri = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.*)/);
    if (match && match[1]) {
        uri = match[1].trim();
    }
} catch (error) {
    console.error('Error reading .env.local:', error.message);
    process.exit(1);
}

if (!uri) {
    console.error('MONGODB_URI not found in .env.local');
    process.exit(1);
}

console.log('Attempting to connect with URI:', uri.replace(/:([^@]+)@/, ':****@')); // Hide password in logs

async function testConnection() {
    try {
        await mongoose.connect(uri);
        console.log('✅ MongoDB connected successfully!');
        // List collections to be sure
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Connection failed:', error);
    }
}

testConnection();
