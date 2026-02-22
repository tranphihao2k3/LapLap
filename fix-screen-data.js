/**
 * Script đồng bộ dữ liệu màn hình:
 * - Tách hz và resolution ra khỏi trường screen
 * - Chuẩn hoá screen chỉ còn kích thước (vd: 15.6", 14", 13.3")
 * - Điền hz và resolution vào các trường riêng
 *
 * Chạy: node fix-screen-data.js
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://tranphihao2k3_db_user:dCqDRiSGNE6nATXY@ac-qseydyj-shard-00-00.7ws2qot.mongodb.net:27017,ac-qseydyj-shard-00-01.7ws2qot.mongodb.net:27017,ac-qseydyj-shard-00-02.7ws2qot.mongodb.net:27017/?replicaSet=atlas-m7d8yv-shard-0&ssl=true&authSource=admin&appName=LapLap';

/**
 * Parse chuỗi screen tổng hợp => { screen, hz, resolution }
 */
function parseScreen(raw) {
    if (!raw) return { screen: '', hz: '', resolution: '' };

    const s = raw.trim();

    // --- Trích xuất Hz ---
    let hz = '';
    const hzMatch = s.match(/(\d{2,3})\s*[Hh]z/);
    if (hzMatch) hz = hzMatch[1] + 'Hz';
    else hz = '60Hz'; // mặc định nếu không có Hz thì là 60Hz

    // --- Trích xuất Resolution ---
    let resolution = '';

    if (/liquid\s*retina/i.test(s)) resolution = 'Liquid Retina';
    else if (/retina\s*3\.5k/i.test(s)) resolution = '3.5K';
    else if (/retina\s*3k/i.test(s)) resolution = '3K';
    else if (/retina\s*2\.5k/i.test(s)) resolution = '2.5K';
    else if (/retina\s*2k/i.test(s)) resolution = '2K';
    else if (/retina/i.test(s)) resolution = 'Retina';
    else if (/2[kK]5|2\.5[kK]/i.test(s)) resolution = '2.5K';
    else if (/4[kK]/i.test(s)) resolution = '4K';
    else if (/3[kK]/i.test(s)) resolution = '3K';
    else if (/2[kK]/i.test(s)) resolution = '2K';
    else if (/[Qq][Hh][Dd]|W[Qq][Hh][Dd]/i.test(s)) resolution = 'QHD';
    else if (/[Ff][Hh][Dd]\+|[Ff]ull\s*[Hh][Dd]\+/i.test(s)) resolution = 'FHD+';
    else if (/[Ff][Hh][Dd]|[Ff]ull\s*[Hh][Dd]|[Ff]ull[Hh][Dd]/i.test(s)) resolution = 'FHD';
    else if (/[Hh][Dd]/i.test(s)) resolution = 'HD';
    else resolution = 'FHD'; // mặc định

    // --- Chuẩn hoá kích thước màn hình ---
    // Lấy số inch từ chuỗi
    let screenSize = '';
    const sizeMatch = s.match(/(\d{1,2}(?:\.\d)?)\s*(?:inch|in|"|\'|')?/i);
    if (sizeMatch) {
        const num = parseFloat(sizeMatch[1]);
        // Chỉ lấy nếu trông có vẻ là kích thước màn hình (10–20 inch)
        if (num >= 10 && num <= 20) {
            screenSize = num + '"';
        }
    }

    return { screen: screenSize || s, hz, resolution };
}

async function main() {
    const client = new MongoClient(MONGODB_URI);

    try {
        console.log('🔌 Đang kết nối MongoDB...');
        await client.connect();
        console.log('✅ Kết nối thành công!\n');

        const db = client.db();
        const collection = db.collection('products');
        const products = await collection.find({}).toArray();

        console.log(`📦 Tìm thấy ${products.length} sản phẩm\n`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        let updatedCount = 0;

        for (const product of products) {
            const rawScreen = product.specs?.screen || '';
            const oldHz = product.specs?.hz || '';
            const oldRes = product.specs?.resolution || '';

            const { screen, hz, resolution } = parseScreen(rawScreen);

            // Chỉ update khi có thay đổi thực sự
            const needsUpdate =
                screen !== rawScreen ||
                hz !== oldHz ||
                resolution !== oldRes;

            if (needsUpdate) {
                await collection.updateOne(
                    { _id: product._id },
                    {
                        $set: {
                            'specs.screen': screen,
                            'specs.hz': hz,
                            'specs.resolution': resolution,
                        }
                    }
                );

                console.log(`✏️  ${product.name}`);
                console.log(`   screen:     "${rawScreen}" → "${screen}"`);
                console.log(`   hz:         "${oldHz}" → "${hz}"`);
                console.log(`   resolution: "${oldRes}" → "${resolution}"`);
                console.log('');
                updatedCount++;
            }
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Đã cập nhật: ${updatedCount} sản phẩm`);
        console.log(`⏭️  Bỏ qua: ${products.length - updatedCount} sản phẩm`);

    } catch (err) {
        console.error('❌ Lỗi:', err.message);
    } finally {
        await client.close();
        console.log('\n🔌 Đã đóng kết nối MongoDB');
    }
}

main();
