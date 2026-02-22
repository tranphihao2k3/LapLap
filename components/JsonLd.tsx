/**
 * components/JsonLd.tsx
 * ─────────────────────────────────────────────────────────
 * Server Component: inject JSON-LD structured data trực tiếp vào HTML.
 * Google Crawler đọc được ngay mà không cần JavaScript.
 *
 * Sử dụng:
 *   import JsonLd from '@/components/JsonLd';
 *   import { buildProductJsonLd } from '@/lib/seo';
 *
 *   <JsonLd data={buildProductJsonLd(product)} />
 */

interface JsonLdProps {
    /** JSON-LD object từ các builder trong lib/seo.ts */
    data: Record<string, unknown> | Record<string, unknown>[];
    /** Optional ID để nhận dạng script tag */
    id?: string;
}

// Server Component - không cần 'use client'
export default function JsonLd({ data, id }: JsonLdProps) {
    return (
        <script
            id={id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
