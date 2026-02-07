const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually read .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
let srvUri = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.*)/);
    if (match && match[1]) {
        srvUri = match[1].trim();
    }
} catch (error) {
    console.error('Error reading .env.local:', error.message);
    process.exit(1);
}

if (!srvUri) {
    console.error('MONGODB_URI not found in .env.local');
    process.exit(1);
}

// Parse user/pass from SRV URI
// mongodb+srv://user:pass@host/...
const regex = /mongodb\+srv:\/\/([^:]+):([^@]+)@/;
const match = srvUri.match(regex);
if (!match) {
    console.error('Could not parse user/password from URI');
    process.exit(1);
}
const user = match[1];
const password = match[2];

// Construct standard URI
const hosts = [
    'ac-qseydyj-shard-00-00.7ws2qot.mongodb.net:27017',
    'ac-qseydyj-shard-00-01.7ws2qot.mongodb.net:27017',
    'ac-qseydyj-shard-00-02.7ws2qot.mongodb.net:27017'
];
const replicaSet = 'atlas-m7d8yv-shard-0';
const authSource = 'admin';
const appName = 'LapLap'; // Optional

const standardUri = `mongodb://${user}:${password}@${hosts.join(',')}?replicaSet=${replicaSet}&ssl=true&authSource=${authSource}&appName=${appName}`;

console.log('Attempting to connect with Standard URI:', standardUri.replace(/:([^@]+)@/, ':****@'));

async function testConnection() {
    try {
        await mongoose.connect(standardUri);
        console.log('✅ MongoDB connected successfully with Standard URI!');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Connection failed with Standard URI:', error);
    }
}

testConnection();
