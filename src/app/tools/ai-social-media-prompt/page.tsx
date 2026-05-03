// app/tools/ai-social-media-prompt/page.tsx

import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import HeroSection from "@/app/components/tools/ai-social-media-prompt/HeroSection";
import SocialMediaPromptGenerator from "@/app/components/tools/ai-social-media-prompt/SocialMediaPromptGenerator";
import SocialMediaPromptGeneratorContent from "@/app/components/tools/ai-social-media-prompt/SocialMediaPromptGeneratorContent";
import RelatedTools from "@/app/components/RelatedTools";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { SOCIAL_MEDIA_PROMPT_FAQS } from "@/lib/faqs/socialMediaPromptFaqs";

// --- Metadata ----------------------------------------------------------------

export const metadata: Metadata = {
    title: "Free Social Media Prompt Generator - Instagram, LinkedIn, Facebook | ForgeCodeHub",
    description:
        "Generate AI-ready prompts for Instagram, LinkedIn, Facebook, X, YouTube & Threads. " +
        "Pick your platform, tone, and goal — get a copy-paste prompt instantly. Free, no signup.",
    keywords: [
        "social media prompt generator",
        "instagram prompt generator",
        "linkedin post prompt",
        "facebook caption generator",
        "AI social media prompts",
        "chatgpt social media prompt",
        "free prompt generator",
        "social media content generator",
        "instagram caption prompt",
        "linkedin content prompt",
        "AI prompt for social media",
        "social media post generator",
        "youtube description generator",
        "threads post generator",
        "twitter post generator free",
    ],
    openGraph: {
        title: "Free Social Media Prompt Generator - Instagram, LinkedIn, Facebook & More",
        description:
            "Generate ready-to-use AI prompts for any social platform. Choose tone, goal, hashtags — " +
            "copy and paste into ChatGPT or Claude to get your post instantly.",
        url: "https://www.forgecodehub.com/tools/ai-social-media-prompt",
        type: "website",
        siteName: "ForgeCodeHub",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Social Media Prompt Generator",
        description:
            "Generate AI prompts for Instagram, LinkedIn, Facebook & more. Free, instant, no signup.",
    },
    alternates: {
        canonical: "https://www.forgecodehub.com/tools/ai-social-media-prompt",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

// --- JSON-LD schemas ---------------------------------------------------------

const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Social Media Prompt Generator",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://www.forgecodehub.com/tools/ai-social-media-prompt",
    description:
        "Free tool that generates AI-ready prompts for Instagram, LinkedIn, Facebook, X/Twitter, YouTube, and Threads.",
    featureList: [
        "Instagram prompt generation",
        "LinkedIn post prompt",
        "Facebook caption prompt",
        "X / Twitter prompt",
        "YouTube description prompt",
        "Threads prompt generation",
        "Custom tone and goal settings",
        "Hashtag and emoji configuration",
        "One-click copy",
    ],
    author: {
        "@type": "Organization",
        name: "ForgeCodeHub",
        url: "https://www.forgecodehub.com",
    },
};

const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Generate an AI Social Media Prompt",
    description: "Use the ForgeCodeHub Social Media Prompt Generator to create platform-optimised AI prompts in seconds.",
    totalTime: "PT1M",
    tool: { "@type": "HowToTool", name: "Social Media Prompt Generator" },
    step: [
        { "@type": "HowToStep", position: 1, name: "Choose your platform", text: "Select from Instagram, LinkedIn, Facebook, X/Twitter, YouTube, or Threads." },
        { "@type": "HowToStep", position: 2, name: "Select a post type", text: "Choose the exact format - Feed Post, Reel, Article, Poll, Thread, and more." },
        { "@type": "HowToStep", position: 3, name: "Describe your topic", text: "Enter a short description of what your post is about." },
        { "@type": "HowToStep", position: 4, name: "Set tone, goal and audience", text: "Choose your preferred tone and post goal." },
        { "@type": "HowToStep", position: 5, name: "Configure hashtags and emojis", text: "Decide how many hashtags and emojis to include." },
        { "@type": "HowToStep", position: 6, name: "Generate, copy, and paste", text: "Click Generate Prompt, copy the result, and paste into ChatGPT, Claude, or Gemini." },
    ],
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SOCIAL_MEDIA_PROMPT_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.forgecodehub.com" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "https://www.forgecodehub.com/tools" },
        { "@type": "ListItem", position: 3, name: "Social Media Prompt Generator", item: "https://www.forgecodehub.com/tools/ai-social-media-prompt" },
    ],
};

// --- Page --------------------------------------------------------------------

export default function SocialMediaPromptGeneratorPage() {
    return (
        <>
            {/* JSON-LD schemas */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <Navbar />

            {/* Full-height hero — tool is below the fold */}
            <HeroSection toolSectionId="prompt-tool" />

            {/* Tool — scroll anchor target */}
            <div id="prompt-tool" style={{ scrollMarginTop: "80px" }}>
                <Suspense fallback={<LoadingSpinner text="Loading Prompt Generator..." />}>
                    <SocialMediaPromptGenerator />
                </Suspense>
            </div>

            {/* Related tools zone — distinct background directly below tool */}
            <div
                style={{
                    background: "#1c1c2e",
                    borderTop: "2px solid rgba(232,105,42,0.35)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    padding: "3.5rem 1.5rem",
                }}
            >
                <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
                    <div style={{ marginBottom: "1.75rem" }}>
                        <p
                            style={{
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "#E8692A",
                                margin: "0 0 0.4rem",
                            }}
                        >
                            More from ForgeCodeHub
                        </p>
                        <h2
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: 800,
                                color: "#f0f0f8",
                                margin: 0,
                                letterSpacing: "-0.01em",
                            }}
                        >
                            More Tools You&apos;ll Love
                        </h2>
                    </div>
                    <RelatedTools
                        currentPath="/tools/ai-social-media-prompt"
                        category="media"
                    />
                </div>
            </div>

            {/* SEO rich-content sections */}
            <SocialMediaPromptGeneratorContent />

            {/* FAQ */}
            <div style={{ background: "#252537", padding: "0 24px 80px", display: "flex" }}>
                <ToolFaq
                    faqs={SOCIAL_MEDIA_PROMPT_FAQS}
                    title="Frequently Asked Questions"
                    subtitle="Everything you need to know about the Social Media Prompt Generator"
                />
            </div>
        </>
    );
}