const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What is a social media prompt generator?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "A social media prompt generator creates detailed AI instructions (prompts) tailored to a specific platform, tone, and goal. You paste the generated prompt into ChatGPT, Claude, or Gemini to instantly get a ready-to-post caption or content.",
            },
        },
        {
            "@type": "Question",
            name: "Is this tool free to use?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, completely free. No sign-up, no API key, and no usage limits. The prompt generator runs entirely in your browser.",
            },
        },
        {
            "@type": "Question",
            name: "Which platforms does this tool support?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "The tool supports Instagram, LinkedIn, Facebook, X (Twitter), YouTube, and Threads. Each platform has its own post types, character limits, and best practices baked in.",
            },
        },
        {
            "@type": "Question",
            name: "How do I use the generated prompt?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Once you generate the prompt, copy it and paste it directly into any AI tool like ChatGPT, Claude, or Google Gemini. The AI will return a fully written, platform-optimised social media post.",
            },
        },
        {
            "@type": "Question",
            name: "Does this tool use AI itself?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "No. The prompt generator uses a smart template engine — it combines your inputs (platform, tone, goal, topic) into a structured prompt. No AI API is used, which means it's fast, private, and always free.",
            },
        },
        {
            "@type": "Question",
            name: "Can I use it for my business or clients?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Absolutely. There are no restrictions on commercial use. You can use it for your own brand, client accounts, or agency workflows.",
            },
        },
        {
            "@type": "Question",
            name: "What makes a good social media prompt?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "A good prompt specifies the platform, post type, tone, goal, target audience, and any specific CTA or hashtag requirements. The more context you provide, the better the AI output will be — this tool handles all of that for you automatically.",
            },
        },
    ],
};

export default faqSchema;