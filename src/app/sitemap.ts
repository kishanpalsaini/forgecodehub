import { MetadataRoute } from "next";
import { banksData } from "./data/banks";
import { statesData } from "./data/states";
import sipAmounts from "./data/sip-amounts.json";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://www.forgecodehub.com";
    const now = new Date();

    // ── Programmatic: /calculators/emi/sbi, /calculators/emi/hdfc ...
    const bankPages: MetadataRoute.Sitemap = Object.keys(banksData)?.map((bank) => ({
        url: `${baseUrl}/calculators/emi/${bank}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    // ── Programmatic: /calculators/gst/maharashtra, /calculators/gst/delhi ...
    const statePages: MetadataRoute.Sitemap = Object.keys(statesData)?.map((state) => ({
        url: `${baseUrl}/calculators/gst/${state}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    // ── Programmatic: /calculators/sip/500, /calculators/sip/1000 ...
    const sipPages: MetadataRoute.Sitemap = sipAmounts?.map((amount: number) => ({
        url: `${baseUrl}/calculators/sip/${amount}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    return [
        // ════════════════════════════════════════════════════
        // CORE
        // ════════════════════════════════════════════════════
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 1,
        },

        // ════════════════════════════════════════════════════
        // FINANCE — calculator hub + individual calculators
        // ════════════════════════════════════════════════════
        {
            url: `${baseUrl}/calculators`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/calculators/banks`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.85,
        },
        ...[
            "emi", "gst", "sip", "tax",
            "loan", "retirement", "networth", "goal", "fd",
        ].map((slug) => ({
            url: `${baseUrl}/calculators/${slug}`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.8,
        })),

        // ════════════════════════════════════════════════════
        // PRODUCTIVITY TOOLS
        // ════════════════════════════════════════════════════
        ...[
            "/tools/online-notepad",
            "/tools/online-pomodoro-timer",
            "/tools/online-word-editor",
            "/tools/online-todo-list",
            "/tools/online-qr-generator",
            "/tools/online-barcode-generator",
            "/tools/online-text-writing-tools",
            "/tools/online-word-counter",
            "/tools/online-character-counter",
            "/tools/online-case-converter",
            "/tools/online-fancy-font-generator",
            "/tools/online-remove-extra-spaces",
            "/tools/online-line-break-remover",
            "/tools/online-text-sorter",
            "/tools/online-duplicate-remover",
            "/tools/online-text-to-emoji",
            "/tools/online-reverse-text-generator",
        ].map((path) => ({
            url: `${baseUrl}${path}`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.8,
        })),

        // ════════════════════════════════════════════════════
        // DEV TOOLS — encoders, minifiers, crypto
        // ════════════════════════════════════════════════════
        ...[
            "/tools/online-json-formatter",
            "/tools/online-base-64-client",
            "/tools/online-url-encoder-decoder",
            "/tools/online-html-minifier",
            "/tools/online-css-minifier",
            "/tools/online-crypto-encrypt-decrypt",
        ].map((path) => ({
            url: `${baseUrl}${path}`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.8,
        })),

        // ── JSON suite ────────────────────────────────────────
        ...[
            "/tools/json-formatterhub",
            "/tools/online-json-viewer",
            "/tools/online-json-diff",
            "/tools/online-json-validator",
            "/tools/online-json-to-csv",
            "/tools/online-json-path",
        ].map((path) => ({
            url: `${baseUrl}${path}`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.8,
        })),

        // ── Coming soon (lower priority) ──────────────────────
        ...[
            "/tools/pdf-converter",
            "/tools/color-picker",
        ].map((path) => ({
            url: `${baseUrl}${path}`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.5,
        })),

        // ════════════════════════════════════════════════════
        // MEDIA TOOLS — image converters
        // ════════════════════════════════════════════════════
        ...[
            "/tools/images/online-png-to-jpg",
            "/tools/images/online-jpg-to-png",
            "/tools/images/online-universal-image-converter",
        ].map((path) => ({
            url: `${baseUrl}${path}`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.8,
        })),

        // ── Coming soon ───────────────────────────────────────
        {
            url: `${baseUrl}/reel-scheduler`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.5,
        },

        // ════════════════════════════════════════════════════
        // LEGAL
        // ════════════════════════════════════════════════════
        ...["/privacy", "/terms", "/disclaimer"].map((path) => ({
            url: `${baseUrl}${path}`,
            lastModified: now,
            changeFrequency: "yearly" as const,
            priority: 0.3,
        })),

        // ════════════════════════════════════════════════════
        // PROGRAMMATIC — bank × EMI, state × GST, SIP amounts
        // ════════════════════════════════════════════════════
        ...bankPages,
        ...statePages,
        ...sipPages,
    ];
}