import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            // ── Google & Bing — full access to all public pages ──
            {
                userAgent: ["Googlebot", "Bingbot"],
                allow: "/",
                disallow: [
                    "/api/",          // API routes — not indexable content
                    "/_next/",        // Next.js internals
                    "/admin/",        // Admin pages if you ever add them
                    "/*.json$",       // Raw JSON data files
                    "/404",           // Error pages
                    "/500",
                ],
            },

            // ── All other crawlers — same rules ──────────────────
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",
                    "/_next/",
                    "/admin/",
                    "/*.json$",
                    "/404",
                    "/500",
                ],
            },

            // ── Block AI training bots ────────────────────────────
            // These crawlers scrape content for AI model training,
            // not for search indexing. Block them to protect your content.
            {
                userAgent: [
                    "GPTBot",           // OpenAI
                    "ChatGPT-User",     // OpenAI ChatGPT browsing
                    "CCBot",            // Common Crawl (used for AI training)
                    "anthropic-ai",     // Anthropic
                    "Claude-Web",       // Anthropic Claude
                    "Omgilibot",        // AI training crawler
                    "FacebookBot",      // Meta AI training
                ],
                disallow: "/",
            },

            // ── Block bad / spam bots ─────────────────────────────
            {
                userAgent: [
                    "AhrefsBot",        // SEO scraper — aggressive crawler
                    "SemrushBot",       // SEO scraper
                    "MJ12bot",          // Majestic SEO scraper
                    "DotBot",           // Moz scraper
                    "BLEXBot",          // Scraper
                    "PetalBot",         // Huawei scraper
                ],
                disallow: "/",
            },
        ],

        // ── Sitemap location ──────────────────────────────────────
        sitemap: "https://www.forgecodehub.com/sitemap.xml",

        // ── Canonical host ────────────────────────────────────────
        // Tells crawlers the preferred domain (www vs non-www)
        host: "https://www.forgecodehub.com",
    };
}