import { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://laplapcantho.vercel.app";

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
            url: `${baseUrl}/ve-sinh-laptop`,
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
        ...blogEntries,
    ];
}

