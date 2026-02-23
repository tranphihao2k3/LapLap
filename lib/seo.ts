/**
 * lib/seo.ts
 * ─────────────────────────────────────────────────────────
 * Thư viện SEO dùng chung cho toàn bộ website LapLap Cần Thơ.
 * Sử dụng cùng với Next.js Metadata API + next-seo JSON-LD.
 */

export const SITE_URL = 'https://laplapcantho.store';
export const SITE_NAME = 'LapLap - Laptop Cần Thơ';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// ─── JSON-LD: Tổ chức / LocalBusiness ────────────────────────────────────────
export function buildOrganizationJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': ['Organization', 'LocalBusiness', 'ComputerStore'],
        '@id': `${SITE_URL}/#organization`,
        name: 'LapLap - Laptop Cần Thơ',
        url: SITE_URL,
        logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/favicon.ico`,
        },
        image: DEFAULT_OG_IMAGE,
        description:
            'LapLap - Chuyên mua bán laptop tại Cần Thơ. Laptop mới, laptop cũ chính hãng, giá tốt nhất. Giao hàng tận nơi, bảo hành uy tín.',
        telephone: '+84-978648720', // Cập nhật SĐT thực tế
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Cần Thơ', // Cập nhật địa chỉ thực tế
            addressLocality: 'Cần Thơ',
            addressRegion: 'Cần Thơ',
            postalCode: '900000',
            addressCountry: 'VN',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 10.0452,
            longitude: 105.7469,
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                    'Monday', 'Tuesday', 'Wednesday',
                    'Thursday', 'Friday', 'Saturday', 'Sunday',
                ],
                opens: '09:00',
                closes: '19:00',
            },
        ],
        sameAs: [
            'https://www.facebook.com/profile.php?id=61582947329036', // Cập nhật link Facebook thực tế
        ],
        priceRange: '₫₫',
        currenciesAccepted: 'VND',
        paymentAccepted: 'Cash, Bank Transfer',
        areaServed: {
            '@type': 'City',
            name: 'Cần Thơ',
        },
    };
}

// ─── JSON-LD: Website ─────────────────────────────────────────────────────────
export function buildWebSiteJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description:
            'LapLap - Chuyên laptop tại Cần Thơ. Mua bán, sửa chữa, nâng cấp laptop.',
        inLanguage: 'vi',
        publisher: {
            '@id': `${SITE_URL}/#organization`,
        },
        // Kích hoạt Search Box trên Google
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_URL}/laptops?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
}

// ─── JSON-LD: Site Navigation ───────────────────────────────────────────────
export function buildSiteNavigationJsonLd() {
    const navItems = [
        { name: 'Laptop', url: `${SITE_URL}/laptops` },
        { name: 'Sửa chữa', url: `${SITE_URL}/sua-chua-laptop` },
        { name: 'Thu cũ đổi mới', url: `${SITE_URL}/thu-cu-doi-moi` },
        { name: 'Giới thiệu', url: `${SITE_URL}/gioi-thieu` },
        { name: 'Tin tức', url: `${SITE_URL}/blog` },
        { name: 'Tra cứu bảo hành', url: `${SITE_URL}/tra-cuu-bao-hanh` },
    ];

    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: navItems.map((item, index) => ({
            '@type': 'SiteNavigationElement',
            position: index + 1,
            name: item.name,
            url: item.url,
        })),
    };
}

// ─── JSON-LD: Breadcrumb ──────────────────────────────────────────────────────
export function buildBreadcrumbJsonLd(
    items: { name: string; url: string }[]
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
        })),
    };
}

// ─── JSON-LD: Product ─────────────────────────────────────────────────────────
export function buildProductJsonLd(product: {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image?: string;
    images?: string[];
    slug: string;
    _id: string;
    specs?: { cpu?: string; ram?: string; ssd?: string; display?: string };
    brandId?: { name?: string };
    condition?: string;
}) {
    const imageUrl =
        product.image ||
        (product.images && product.images[0]) ||
        DEFAULT_OG_IMAGE;
    const absoluteImage = imageUrl.startsWith('http')
        ? imageUrl
        : `${SITE_URL}${imageUrl}`;

    const soldPrice = product.price;
    const listPrice = product.originalPrice || product.price;

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: absoluteImage,
        sku: product._id,
        brand: {
            '@type': 'Brand',
            name: product.brandId?.name || 'Laptop',
        },
        offers: {
            '@type': 'Offer',
            url: `${SITE_URL}/laptops/${product.slug || product._id}`,
            priceCurrency: 'VND',
            price: soldPrice,
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0],
            availability: 'https://schema.org/InStock',
            itemCondition:
                product.condition === 'new'
                    ? 'https://schema.org/NewCondition'
                    : 'https://schema.org/UsedCondition',
            seller: {
                '@type': 'Organization',
                name: SITE_NAME,
            },
            ...(product.originalPrice && product.originalPrice > product.price
                ? {
                    priceSpecification: {
                        '@type': 'UnitPriceSpecification',
                        price: listPrice,
                        priceCurrency: 'VND',
                    },
                }
                : {}),
        },
        ...(product.specs
            ? {
                additionalProperty: [
                    product.specs.cpu && {
                        '@type': 'PropertyValue',
                        name: 'CPU',
                        value: product.specs.cpu,
                    },
                    product.specs.ram && {
                        '@type': 'PropertyValue',
                        name: 'RAM',
                        value: product.specs.ram,
                    },
                    product.specs.ssd && {
                        '@type': 'PropertyValue',
                        name: 'SSD',
                        value: product.specs.ssd,
                    },
                    product.specs.display && {
                        '@type': 'PropertyValue',
                        name: 'Màn hình',
                        value: product.specs.display,
                    },
                ].filter(Boolean),
            }
            : {}),
    };
}

// ─── JSON-LD: BlogPosting ─────────────────────────────────────────────────────
export function buildBlogPostingJsonLd(blog: {
    title: string;
    excerpt: string;
    content?: string;
    featuredImage?: string;
    author?: string;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    tags?: string[];
    slug: string;
}) {
    const imageUrl = blog.featuredImage || DEFAULT_OG_IMAGE;

    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${SITE_URL}/blog/${blog.slug}`,
        headline: blog.title,
        description: blog.excerpt,
        image: imageUrl,
        datePublished: blog.publishedAt || blog.createdAt,
        dateModified: blog.updatedAt,
        author: {
            '@type': 'Person',
            name: blog.author || 'LapLap Team',
        },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/favicon.ico`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/blog/${blog.slug}`,
        },
        keywords: blog.tags?.join(', '),
        inLanguage: 'vi',
        url: `${SITE_URL}/blog/${blog.slug}`,
    };
}

// ─── JSON-LD: FAQ Page ────────────────────────────────────────────────────────
export function buildFaqJsonLd(
    questions: { question: string; answer: string }[]
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map((q) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: q.answer,
            },
        })),
    };
}

// ─── JSON-LD: Service ─────────────────────────────────────────────────────────
export function buildServiceJsonLd(service: {
    name: string;
    description: string;
    url: string;
    priceRange?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.name,
        description: service.description,
        url: `${SITE_URL}${service.url}`,
        provider: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
        },
        areaServed: {
            '@type': 'City',
            name: 'Cần Thơ',
        },
        ...(service.priceRange ? { priceRange: service.priceRange } : {}),
    };
}

// ─── Metadata builder cho page thông thường ───────────────────────────────────
export function buildPageMetadata({
    title,
    description,
    path,
    image,
    keywords,
    noindex = false,
}: {
    title: string;
    description: string;
    path: string;
    image?: string;
    keywords?: string[];
    noindex?: boolean;
}) {
    const url = `${SITE_URL}${path}`;
    const ogImage = image || DEFAULT_OG_IMAGE;

    return {
        title,
        description,
        ...(keywords ? { keywords } : {}),
        alternates: {
            canonical: url,
        },
        robots: noindex
            ? { index: false, follow: false }
            : {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-snippet': -1,
                    'max-image-preview': 'large' as const,
                },
            },
        openGraph: {
            title,
            description,
            url,
            siteName: SITE_NAME,
            locale: 'vi_VN',
            type: 'website' as const,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image' as const,
            title,
            description,
            images: [ogImage],
        },
    };
}
