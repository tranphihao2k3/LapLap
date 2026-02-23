import { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Brand } from "@/models/Brand";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://laplapcantho.store";

    // Fetch all published blogs
    let blogEntries: MetadataRoute.Sitemap = [];
    try {
        await connectDB();
        const blogs = await Blog.find({ status: "published" })
            .select("slug updatedAt")
            .lean();

        blogEntries = blogs.map((blog) => ({
            url: `${baseUrl}/blog/${blog.slug}`,
            lastModified: new Date(blog.updatedAt),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error("Error fetching blogs for sitemap:", error);
    }

    // Fetch all active products
    let productEntries: MetadataRoute.Sitemap = [];
    try {
        await connectDB();
        const products = await Product.find({ status: "active" })
            .select("slug updatedAt")
            .lean();

        productEntries = products
            .filter((p) => p.slug) // Only include products with slug
            .map((product) => ({
                url: `${baseUrl}/laptops/${product._id}`,
                lastModified: new Date(product.updatedAt),
                changeFrequency: "weekly" as const,
                priority: 0.8,
            }));
    } catch (error) {
        console.error("Error fetching products for sitemap:", error);
    }

    // Fetch categories
    let categoryEntries: MetadataRoute.Sitemap = [];
    try {
        await connectDB();
        const categories = await Category.find()
            .select("slug updatedAt")
            .lean();

        categoryEntries = categories
            .filter((c) => c.slug)
            .map((category) => ({
                url: `${baseUrl}/laptops?category=${category.slug}`,
                lastModified: new Date(category.updatedAt),
                changeFrequency: "weekly" as const,
                priority: 0.7,
            }));
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

