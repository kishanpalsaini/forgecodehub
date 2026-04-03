import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: "https://www.forgecodehub.com", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
        { url: "https://www.forgecodehub.com/calculators", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
        { url: "https://www.forgecodehub.com/calculators/emi", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: "https://www.forgecodehub.com/calculators/gst", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: "https://www.forgecodehub.com/calculators/sip", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: "https://www.forgecodehub.com/calculators/tax", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: "https://www.forgecodehub.com/calculators/loan", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: "https://www.forgecodehub.com/calculators/retirement", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: "https://www.forgecodehub.com/calculators/networth", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: "https://www.forgecodehub.com/calculators/goal", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: "https://www.forgecodehub.com/reel-scheduler", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ];
}