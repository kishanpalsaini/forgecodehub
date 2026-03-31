

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: "https://www.forgecodehub.com/sitemap.xml",
    };
}


// **After deploying**, go to Google Search Console and submit your sitemap:
// ```
// https://www.forgecodehub.com/sitemap.xml