import { MetadataRoute } from "next";
// replaced DB models with API clients
// import { connectDB } from "@/lib/mongodb";
// import { Blog } from "@/models/Blog";
// import { Product } from "@/models/Product";
// import { Category } from "@/models/Category";
// import { Brand } from "@/models/Brand";
import { getBlogs } from '@/lib/api/admin';
import { getProducts, getCategories } from '@/lib/api/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://laplapcantho.store";

    // Fetch all published blogs
    let blogEntries: MetadataRoute.Sitemap = [];
    try {
        const res = await getBlogs();
        if (res.success && res.data) {
            blogEntries = res.data.map((blog: any) => ({
                url: `${baseUrl}/blog/${blog.slug}`,
                lastModified: new Date(blog.updatedAt || new Date()),
                changeFrequency: "weekly" as const,
                priority: 0.7,
            }));
        }
    } catch (error) {
        console.error("Error fetching blogs for sitemap:", error);
    }

    // Fetch all active products via API
    let productEntries: MetadataRoute.Sitemap = [];
    try {
        const res = await getProducts({ page: 1, limit: 1000 });
        if (res.success && res.data) {
            productEntries = res.data
                .filter((p: any) => p.status === "active" && p.slug)
                .map((product: any) => ({
                    url: `${baseUrl}/laptops/${product.slug}`,
                    lastModified: new Date(product.updatedAt || product.createdAt || new Date()),
                    changeFrequency: "weekly" as const,
                    priority: 0.8,
                }));
        }
    } catch (error) {
        console.error("Error fetching products for sitemap:", error);
    }

    // Fetch categories via API
    let categoryEntries: MetadataRoute.Sitemap = [];
    try {
        const res = await getCategories();
        if (res.success && res.data) {
            categoryEntries = res.data
                .filter((c: any) => c.slug)
                .map((category: any) => ({
                    url: `${baseUrl}/laptops?category=${category.slug}`,
                    lastModified: new Date((category as any).updatedAt || (category as any).createdAt || new Date()),
                    changeFrequency: "weekly" as const,
                    priority: 0.7,
                }));
        }
    } catch (error) {
        console.error("Error fetching categories for sitemap:", error);
    }

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/laptops`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/test`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/sua-chua-laptop`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/thu-cu-doi-moi`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/cai-dat-phan-mem`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/ve-sinh-laptop`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/nang-cap`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/linh-kien-phu-kien`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/chinh-sach-bao-hanh`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/gioi-thieu`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
        ...categoryEntries,
        ...productEntries,
        ...blogEntries,
    ];
}

