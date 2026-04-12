export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is CSS minification?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CSS minification is the process of removing unnecessary characters from CSS code such as whitespace, comments, line breaks, and redundant semicolons without changing its functionality. This reduces file size and improves website loading speed.",
      },
    },
    {
      "@type": "Question",
      name: "Is this CSS minifier free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, this CSS minifier is completely free to use with no subscription, no hidden charges, and no account required.",
      },
    },
    {
      "@type": "Question",
      name: "Is my CSS code safe and private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all CSS minification happens locally in your browser. Your code never leaves your device and is not sent to any server, ensuring complete privacy and security.",
      },
    },
    {
      "@type": "Question",
      name: "Why should I minify CSS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Minifying CSS reduces file size by 20-40%, which decreases bandwidth usage, speeds up page loading times, improves website performance, and enhances user experience and SEO rankings.",
      },
    },
    {
      "@type": "Question",
      name: "Does minifying CSS break my code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, minification only removes unnecessary whitespace and formatting. It preserves the functionality and does not change how the CSS is applied to your HTML elements.",
      },
    },
    {
      "@type": "Question",
      name: "Can I upload a CSS file to minify?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can upload CSS files from your computer. The tool will read, minify, and display the result instantly, ready for download or copy.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download the minified CSS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can download the minified CSS as a .css file directly to your device with a single click.",
      },
    },
    {
      "@type": "Question",
      name: "Can I copy the minified CSS to clipboard?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, there is a one-click copy button that copies the entire minified CSS output to your clipboard instantly for easy pasting.",
      },
    },
    {
      "@type": "Question",
      name: "Does the tool support CSS3 and modern CSS features?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the minifier fully supports CSS3 features including flexbox, grid, animations, transitions, custom properties (CSS variables), and all modern CSS syntax.",
      },
    },
    {
      "@type": "Question",
      name: "Can I minify CSS with vendor prefixes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the minifier preserves vendor prefixes like -webkit-, -moz-, -ms-, and -o- while removing unnecessary whitespace around them.",
      },
    },
    {
      "@type": "Question",
      name: "Does it remove CSS comments?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the minifier removes all CSS comments including single-line and multi-line comments to reduce file size, unless they are special comments like copyright notices.",
      },
    },
    {
      "@type": "Question",
      name: "Can I beautify or format minified CSS back?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "While this tool focuses on minification, many code editors and online CSS beautifiers can reformat minified CSS back to a readable format with proper indentation.",
      },
    },
    {
      "@type": "Question",
      name: "Does the tool work offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, once the page is loaded you can continue minifying CSS without an internet connection since all processing happens locally in your browser.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this on mobile devices?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the CSS minifier is fully responsive and works seamlessly on Android and iOS browsers, tablets, and desktop devices.",
      },
    },
    {
      "@type": "Question",
      name: "How much can minification reduce CSS file size?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Minification typically reduces CSS file size by 20-40%, depending on how much whitespace, comments, and formatting your original code contains.",
      },
    },
    {
      "@type": "Question",
      name: "Does it validate CSS syntax?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The minifier performs basic validation and will display an error if there are major syntax issues. However, for comprehensive validation, use a dedicated CSS validator.",
      },
    },
    {
      "@type": "Question",
      name: "Can I minify inline CSS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can paste CSS from style tags or inline styles and minify them. The output can then be used in your HTML or external stylesheets.",
      },
    },
    {
      "@type": "Question",
      name: "Does it support @media queries and @keyframes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the minifier correctly handles @media queries, @keyframes, @font-face, @import, and all other CSS at-rules while preserving their functionality.",
      },
    },
    {
      "@type": "Question",
      name: "Should I use minified CSS in development?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, use formatted CSS during development for readability and debugging. Minify CSS only for production deployment to improve performance.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work with all browsers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the CSS minifier works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera on both desktop and mobile platforms.",
      },
    },
    {
      "@type": "Question",
      name: "Can I minify multiple CSS files at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Currently, the tool processes one file or code block at a time. For multiple files, you need to minify each separately or combine them first.",
      },
    },
    {
      "@type": "Question",
      name: "Does minification affect CSS specificity or cascade order?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, minification only removes whitespace and formatting. It does not change selector specificity, cascade order, or the way CSS rules are applied.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this for SCSS or SASS files?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, this tool is for standard CSS only. You must first compile SCSS/SASS to CSS using a preprocessor, then minify the resulting CSS output.",
      },
    },
    {
      "@type": "Question",
      name: "Will minifying CSS improve my website SEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, indirectly. Minified CSS reduces page load time, which is a ranking factor for Google. Faster websites provide better user experience and rank higher in search results.",
      },
    },
    {
      "@type": "Question",
      name: "Can I minify CSS used in WordPress themes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can copy CSS from your WordPress theme files, minify it, and replace the original. However, many WordPress caching plugins already provide CSS minification.",
      },
    },
  ],
};

export default faqSchema;