/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://laplapcantho.store',
    generateRobotsTxt: false, // Đã có robots.ts trong App Router, không cần generate lại
    generateIndexSitemap: true,
    sitemapSize: 5000,
    changefreq: 'weekly',
    priority: 0.7,
    exclude: [
        '/admin',
        '/admin/*',
        '/api/*',
        '/checkout',
        '/404',
        '/500',
        '/test/*', // Trang test nội bộ
    ],
    // Map priority cho từng đường dẫn
    transform: async (config, path) => {
        // Trang chủ - ưu tiên cao nhất
        if (path === '/') {
            return {
                loc: path,
                changefreq: 'daily',
                priority: 1.0,
                lastmod: new Date().toISOString(),
            };
        }

        // Trang laptops, blog - ưu tiên cao
        if (path === '/laptops' || path === '/blog') {
            return {
                loc: path,
                changefreq: 'daily',
                priority: 0.9,
                lastmod: new Date().toISOString(),
            };
        }

        // Trang dịch vụ
        if (
            path.startsWith('/sua-chua-laptop') ||
            path.startsWith('/ve-sinh-laptop') ||
            path.startsWith('/nang-cap') ||
            path.startsWith('/cai-dat-phan-mem') ||
            path.startsWith('/thu-cu-doi-moi') ||
            path.startsWith('/linh-kien-phu-kien') ||
            path.startsWith('/test')
        ) {
            return {
                loc: path,
                changefreq: 'monthly',
                priority: 0.8,
                lastmod: new Date().toISOString(),
            };
        }

        // Trang sản phẩm động
        if (path.startsWith('/laptops/')) {
            return {
                loc: path,
                changefreq: 'weekly',
                priority: 0.8,
                lastmod: new Date().toISOString(),
            };
        }

        // Trang blog bài viết
        if (path.startsWith('/blog/')) {
            return {
                loc: path,
                changefreq: 'weekly',
                priority: 0.7,
                lastmod: new Date().toISOString(),
            };
        }

        // Mặc định
        return {
            loc: path,
            changefreq: config.changefreq,
            priority: config.priority,
            lastmod: new Date().toISOString(),
        };
    },

    // Thêm sitemap phụ cho các URL động (products, blogs)
    additionalPaths: async (config) => {
        const result = [];

        // Bạn có thể fetch từ API để thêm URL động vào đây nếu cần
        // Ví dụ:
        // const products = await fetch('https://laplapcantho.store/api/products').then(r => r.json());
        // products.forEach(p => result.push(await config.transform(config, `/laptops/${p.slug}`)));

        return result;
    },
};
