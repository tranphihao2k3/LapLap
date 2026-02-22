/**
 * Script kiểm tra dữ liệu screen, hz, resolution hiện tại
 * Chạy: node check-screen-data.js
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://tranphihao2k3_db_user:dCqDRiSGNE6nATXY@ac-qseydyj-shard-00-00.7ws2qot.mongodb.net:27017,ac-qseydyj-shard-00-01.7ws2qot.mongodb.net:27017,ac-qseydyj-shard-00-02.7ws2qot.mongodb.net:27017/?replicaSet=atlas-m7d8yv-shard-0&ssl=true&authSource=admin&appName=LapLap';

async function main() {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db();
    const products = await db.collection('products').find({}).toArray();

    console.log('=== SCREEN DATA ===\n');
    products.forEach(p => {
        console.log(`[${p.name}]`);
        console.log(`  screen: "${p.specs?.screen || ''}"`);
        console.log(`  hz:     "${p.specs?.hz || ''}"`);
        console.log(`  res:    "${p.specs?.resolution || ''}"`);
    });

    await client.close();
}
main();
