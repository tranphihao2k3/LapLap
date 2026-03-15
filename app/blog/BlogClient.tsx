"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { Calendar, User, Eye, ArrowRight, Rss } from "lucide-react";
import { motion } from "framer-motion";
import TechLoader from "@/components/ui/TechLoader";
import { getBlogs } from "@/lib/api/admin";

// ─────────────────────────────────────────────────────────
// GLOBAL STYLES & KEYFRAMES
// ─────────────────────────────────────────────────────────
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');

  @keyframes floatY {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-14px); }
  }
  @keyframes blobAnim {
    0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  }
`;

const shimmerAnim = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const PageWrapper = styled.div`
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #f5f7fa;
  color: #1a1a2e;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
`;

// ─────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────
const HeroSection = styled.section`
  position: relative;
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #05091f 0%, #091840 35%, #0b2158 65%, #0d2d70 100%);
  overflow: hidden;
  padding: 100px 20px 80px;
`;

const HeroBlob = styled.div<{ $top?: string; $bottom?: string; $left?: string; $right?: string; $size: number; $color: string; }>`
  position: absolute;
  top: ${p => p.$top ?? "auto"};
  bottom: ${p => p.$bottom ?? "auto"};
  left: ${p => p.$left ?? "auto"};
  right: ${p => p.$right ?? "auto"};
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  background: ${p => p.$color};
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  filter: blur(80px);
  opacity: 0.3;
  animation: blobAnim 9s ease-in-out infinite;
`;

const GridBg = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
  background-size: 60px 60px;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  text-align: center;
`;

const LiveBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 210, 255, 0.1);
  border: 1px solid rgba(0, 210, 255, 0.3);
  border-radius: 999px;
  padding: 8px 20px;
  margin-bottom: 24px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #00d2ff;
  text-transform: uppercase;
`;

const TitleSpan = styled.span`
  background: linear-gradient(270deg, #00d2ff, #3a7bd5, #00d2ff);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmerAnim} 4s ease infinite;
`;

const HeroTitle = styled.h1`
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -1.5px;
  color: #ffffff;
  margin-bottom: 24px;
`;

const HeroDesc = styled.p`
  font-size: 17px;
  line-height: 1.8;
  color: rgba(180, 210, 255, 0.85);
  max-width: 600px;
  margin: 0 auto;
`;

const HeroWave = styled.div`
  position: absolute;
  bottom: -1px; left: 0; right: 0;
`;

// ─────────────────────────────────────────────────────────
// CONTENT STYLES
// ─────────────────────────────────────────────────────────
const Container = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 60px 24px;
  position: relative;
  z-index: 10;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 50px;
`;

const TagButton = styled.button<{ $active?: boolean }>`
  padding: 10px 24px;
  border-radius: 99px;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.25s;
  cursor: pointer;
  background: ${p => p.$active ? "linear-gradient(135deg, #1e5fff, #0a38d0)" : "rgba(255,255,255,0.7)"};
  color: ${p => p.$active ? "#fff" : "#1a1a2e"};
  border: 1px solid ${p => p.$active ? "transparent" : "rgba(0,0,0,0.08)"};
  box-shadow: ${p => p.$active ? "0 8px 24px rgba(30,95,255,0.3)" : "0 2px 10px rgba(0,0,0,0.02)"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${p => p.$active ? "0 12px 32px rgba(30,95,255,0.4)" : "0 4px 14px rgba(0,0,0,0.05)"};
    background: ${p => p.$active ? "linear-gradient(135deg, #1e5fff, #0a38d0)" : "#fff"};
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); gap: 24px; }
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const BlogCard = styled(motion.div)`
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.08);
  }
`;

const BlogImageWrap = styled.div`
  width: 100%;
  height: 220px;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${BlogCard}:hover & img {
    transform: scale(1.05);
  }
`;

const BlogCategoryLabel = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  color: #fff;
  padding: 6px 14px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const BlogContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 12px;
  
  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const BlogTitle = styled.h2`
  font-size: 19px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.4;
  margin-bottom: 12px;
  transition: color 0.2s;

  ${BlogCard}:hover & {
    color: #1e5fff;
  }
`;

const BlogExcerpt = styled.p`
  font-size: 14.5px;
  line-height: 1.6;
  color: #64748b;
  margin-bottom: 24px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReadMore = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #1e5fff;
  margin-top: auto;
  
  svg {
    transition: transform 0.2s;
  }

  ${BlogCard}:hover & svg {
    transform: translateX(4px);
  }
`;

interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage: string;
    author: string;
    tags: string[];
    viewCount: number;
    publishedAt: string;
    createdAt: string;
}

const FI_UP = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
};

export default function BlogClient() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState<string>('');

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await getBlogs();
                if (res.success && res.data) {
                    setBlogs(res.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const allTags = Array.from(new Set(blogs.flatMap(blog => blog.tags)));
    const filteredBlogs = selectedTag ? blogs.filter(b => b.tags.includes(selectedTag)) : blogs;

    if (loading) return <TechLoader />;

    return (
        <PageWrapper>
            <GlobalStyle />
            <HeroSection>
                <HeroBlob $top="-20%" $right="-5%" $size={400} $color="rgba(0,140,255,0.4)" />
                <HeroBlob $bottom="-20%" $left="-10%" $size={500} $color="rgba(26,50,200,0.5)" />
                <GridBg />
                
                <HeroContent>
                    <motion.div initial="hidden" animate="visible" variants={FI_UP}>
                        <LiveBadge>
                            <Rss size={14} /> Blog & Tin Tức
                        </LiveBadge>
                        <HeroTitle>
                            Khám Phá <TitleSpan>Thế Giới Công Nghệ</TitleSpan> Cùng LapLap
                        </HeroTitle>
                        <HeroDesc>
                            Cập nhật tin tức hot nhất, đánh giá laptop chi tiết, cùng lộ trình thủ thuật công nghệ hữu ích mỗi ngày.
                        </HeroDesc>
                    </motion.div>
                </HeroContent>

                <HeroWave>
                    <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                        <path d="M0,36 C480,72 960,0 1440,36 L1440,72 L0,72 Z" fill="#f5f7fa" />
                    </svg>
                </HeroWave>
            </HeroSection>

            <Container>
                {allTags.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <TagList>
                            <TagButton onClick={() => setSelectedTag('')} $active={selectedTag === ''}>
                                Tất cả
                            </TagButton>
                            {allTags.map(tag => (
                                <TagButton key={tag} onClick={() => setSelectedTag(tag)} $active={selectedTag === tag}>
                                    {tag}
                                </TagButton>
                            ))}
                        </TagList>
                    </motion.div>
                )}

                <BlogGrid>
                    {filteredBlogs.map((blog, i) => (
                        <Link href={`/blog/${blog.slug}`} key={blog._id} passHref legacyBehavior>
                            <BlogCard
                                as="a"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                            >
                                <BlogImageWrap>
                                    <img src={blog.featuredImage || "https://bizweb.dktcdn.net/thumb/grande/100/512/769/products/alienware-x16-r2-3.jpg?v=1716871837957"} alt={blog.title} />
                                    {blog.tags?.[0] && <BlogCategoryLabel>{blog.tags[0]}</BlogCategoryLabel>}
                                </BlogImageWrap>
                                
                                <BlogContent>
                                    <BlogMeta>
                                        <span><Calendar size={14} /> {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                                        <span><User size={14} /> {blog.author || "Admin"}</span>
                                    </BlogMeta>
                                    <BlogTitle>{blog.title}</BlogTitle>
                                    <BlogExcerpt>{blog.excerpt}</BlogExcerpt>
                                    <ReadMore>
                                        Đọc tiếp <ArrowRight size={16} />
                                    </ReadMore>
                                </BlogContent>
                            </BlogCard>
                        </Link>
                    ))}
                </BlogGrid>
                
                {filteredBlogs.length === 0 && (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
                        <p style={{ fontSize: 18, fontWeight: 500 }}>Không tìm thấy bài viết nào.</p>
                    </div>
                )}
            </Container>
        </PageWrapper>
    );
}
