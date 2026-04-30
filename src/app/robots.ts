import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            // ── Google & Bing — full access to all public pages ──
            {
                userAgent: [
                    "Googlebot",
                    "Googlebot-Image",
                    "Googlebot-Video",
                    "AdsBot-Google",
                    "Bingbot",
                    "BingPreview",
                ],
                allow: "/",
                disallow: [
                    "/api/",
                    "/_next/",
                    "/admin/",
                    "/404",
                    "/500",
                ],
            },

            // ── All other crawlers ────────────────────────────────
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",
                    "/_next/",
                    "/admin/",
                    "/404",
                    "/500",
                ],
            },

            // ── AI browsing bots — allow (can drive referral traffic) ──
            // These power user-facing AI products that cite sources
            {
                userAgent: [
                    "GPTBot",           // OpenAI — can cite your tools in ChatGPT
                    "ChatGPT-User",     // OpenAI ChatGPT browsing
                    "anthropic-ai",     // Anthropic
                    "Claude-Web",       // Anthropic Claude
                    "PerplexityBot",    // Perplexity AI — cites sources, high referral value
                    "YouBot",           // You.com search
                    "cohere-ai",        // Cohere
                ],
                allow: "/",
                disallow: [
                    "/api/",
                    "/_next/",
                    "/admin/",
                ],
            },

            // ── Pure AI training crawlers — block (no benefit to you) ──
            {
                userAgent: [
                    "CCBot",            // Common Crawl — used for AI training only
                    "Omgilibot",        // No user-facing product
                    "FacebookBot",      // Meta AI training
                    "Bytespider",       // ByteDance — aggressive scraper, no referral benefit
                ],
                disallow: "/",
            },

            // ── Block bad / spam bots ─────────────────────────────
            {
                userAgent: [
                    "AhrefsBot",
                    "SemrushBot",
                    "MJ12bot",
                    "DotBot",
                    "BLEXBot",
                    "PetalBot",
                ],
                disallow: "/",
            },
        ],

        sitemap: "https://www.forgecodehub.com/sitemap.xml",
    };
}