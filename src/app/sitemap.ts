// import { MetadataRoute } from "next";

// export default function sitemap(): MetadataRoute.Sitemap {
//     return [
//         { url: "https://www.forgecodehub.com", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
//         { url: "https://www.forgecodehub.com/calculators", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
//         { url: "https://www.forgecodehub.com/calculators/emi", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
//         { url: "https://www.forgecodehub.com/calculators/gst", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
//         { url: "https://www.forgecodehub.com/calculators/sip", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
//         { url: "https://www.forgecodehub.com/calculators/tax", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
//         { url: "https://www.forgecodehub.com/calculators/loan", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
//         { url: "https://www.forgecodehub.com/calculators/retirement", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
//         { url: "https://www.forgecodehub.com/calculators/networth", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
//         { url: "https://www.forgecodehub.com/calculators/goal", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
//         { url: "https://www.forgecodehub.com/reel-scheduler", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
//     ];
// }

import { MetadataRoute } from "next";
import { banksData } from "./data/banks";
// import statesData from "./data/states";
import { statesData } from "./data/states";
import sipAmounts from "./data/sip-amounts.json";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://www.forgecodehub.com";
    const now = new Date();

    // /calculators/emi/sbi, /calculators/emi/hdfc ...
    const bankPages: MetadataRoute.Sitemap = Object.keys(banksData)?.map((bank) => ({
        url: `${baseUrl}/calculators/emi/${bank}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    // /calculators/gst/maharashtra, /calculators/gst/delhi ...
    const statePages: MetadataRoute.Sitemap = Object.keys(statesData)?.map((state) => ({
        url: `${baseUrl}/calculators/gst/${state}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    // /calculators/sip/500, /calculators/sip/1000 ...
    const sipPages: MetadataRoute.Sitemap = sipAmounts?.map((amount: number) => ({
        url: `${baseUrl}/calculators/sip/${amount}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    return [
        // ── Core pages ──────────────────────────────────────
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 1,
        },
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

        // ── Calculator pages ─────────────────────────────────
        ...[
            "emi", "gst", "sip", "tax",
            "loan", "retirement", "networth", "goal", "fd",
        ].map((slug) => ({
            url: `${baseUrl}/calculators/${slug}`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.8,
        })),

        // ── Other tools ──────────────────────────────────────
        {
            url: `${baseUrl}/reel-scheduler`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.7,
        },

        // ── Programmatic pages ───────────────────────────────
        ...bankPages,
        ...statePages,
        ...sipPages,
    ];
}