/**
 * Script sửa định dạng RAM và SSD trong MongoDB
 * Chuyển "16G" → "16GB", "512G" → "512GB", v.v.
 * 
 * Chạy: node fix-specs-format.js
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://tranphihao2k3_db_user:dCqDRiSGNE6nATXY@ac-qseydyj-shard-00-00.7ws2qot.mongodb.net:27017,ac-qseydyj-shard-00-01.7ws2qot.mongodb.net:27017,ac-qseydyj-shard-00-02.7ws2qot.mongodb.net:27017/?replicaSet=atlas-m7d8yv-shard-0&ssl=true&authSource=admin&appName=LapLap';

/**
 * Chuyển "16G" hoặc "16g" -> "16GB"
 * Không thay đổi nếu đã là "16GB"
 */
function fixStorageFormat(value) {
    if (!value || typeof value !== 'string') return value;
    // Nếu kết thúc bằng "G" (không phải "GB"), thêm "B"
    // Ví dụ: "8G" -> "8GB", "512G" -> "512GB"
    // Pattern: số + "G" (không theo sau bởi "B" hay "H")
    return value.replace(/(\d+G)(?!B|H)/gi, (match) => match.toUpperCase() + 'B');
}

async function main() {
    const client = new MongoClient(MONGODB_URI);

    try {
        console.log('🔌 Đang kết nối MongoDB...');
        await client.connect();
        console.log('✅ Kết nối thành công!\n');

        const db = client.db(); // dùng DB mặc định từ URI
        const collection = db.collection('products');

        // Lấy tất cả laptop
        const laptops = await collection.find({}).toArray();
        console.log(`📦 Tìm thấy ${laptops.length} laptop\n`);

        let updatedCount = 0;
        let skippedCount = 0;

        for (const laptop of laptops) {
            const oldRam = laptop.specs?.ram;
            const oldSsd = laptop.specs?.ssd;
            const oldGpu = laptop.specs?.gpu;

            const newRam = fixStorageFormat(oldRam);
            const newSsd = fixStorageFormat(oldSsd);
            const newGpu = fixStorageFormat(oldGpu);

            // Chỉ update nếu có thay đổi
            if (newRam !== oldRam || newSsd !== oldSsd || newGpu !== oldGpu) {
                await collection.updateOne(
                    { _id: laptop._id },
                    {
                        $set: {
                            'specs.ram': newRam,
                            'specs.ssd': newSsd,
                            'specs.gpu': newGpu,
                        }
                    }
                );

                console.log(`✏️  [${laptop.name}]`);
                if (newRam !== oldRam) console.log(`   RAM: "${oldRam}" → "${newRam}"`);
                if (newSsd !== oldSsd) console.log(`   SSD: "${oldSsd}" → "${newSsd}"`);
                if (newGpu !== oldGpu) console.log(`   GPU: "${oldGpu}" → "${newGpu}"`);

                updatedCount++;
            } else {
                skippedCount++;
            }
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Đã cập nhật: ${updatedCount} laptop`);
        console.log(`⏭️  Bỏ qua (đã đúng format): ${skippedCount} laptop`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (err) {
        console.error('❌ Lỗi:', err.message);
    } finally {
        await client.close();
        console.log('🔌 Đã đóng kết nối MongoDB');
    }
}

main();
