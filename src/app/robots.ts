import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            // ── Google & Bing — full access to all public pages ──
            {
                userAgent: ["Googlebot", "Bingbot"],
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
        host: "https://www.forgecodehub.com",
    };
}