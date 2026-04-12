export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is HTML minification?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HTML minification is the process of removing unnecessary characters from HTML code such as whitespace, comments, line breaks, and optional tags without changing its functionality. This reduces file size and improves website loading speed.",
      },
    },
    {
      "@type": "Question",
      name: "Is this HTML minifier free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, this HTML minifier is completely free to use with no subscription, no hidden charges, and no account required.",
      },
    },
    {
      "@type": "Question",
      name: "Is my HTML code safe and private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all HTML minification happens locally in your browser. Your code never leaves your device and is not sent to any server, ensuring complete privacy and security.",
      },
    },
    {
      "@type": "Question",
      name: "Why should I minify HTML?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Minifying HTML reduces file size by 10-30%, which decreases bandwidth usage, speeds up page loading times, improves website performance, enhances user experience, and can positively impact SEO rankings.",
      },
    },
    {
      "@type": "Question",
      name: "Does minifying HTML break my code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, minification only removes unnecessary whitespace, comments, and formatting. It preserves the structure and functionality of your HTML without breaking anything.",
      },
    },
    {
      "@type": "Question",
      name: "Can I upload an HTML file to minify?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can upload HTML files from your computer. The tool will read, minify, and display the result instantly, ready for download or copy.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download the minified HTML?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can download the minified HTML as a .html file directly to your device with a single click.",
      },
    },
    {
      "@type": "Question",
      name: "Can I copy the minified HTML to clipboard?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, there is a one-click copy button that copies the entire minified HTML output to your clipboard instantly for easy pasting elsewhere.",
      },
    },
    {
      "@type": "Question",
      name: "Does the tool support HTML5?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the minifier fully supports HTML5 elements, attributes, semantic tags, and all modern HTML features while preserving their functionality.",
      },
    },
    {
      "@type": "Question",
      name: "Does it remove HTML comments?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the minifier removes all HTML comments to reduce file size, unless they are special comments like conditional comments for Internet Explorer.",
      },
    },
    {
      "@type": "Question",
      name: "Can I minify HTML with inline CSS and JavaScript?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the minifier handles HTML files that contain inline CSS in style tags and inline JavaScript in script tags, minifying the HTML structure while preserving the embedded code.",
      },
    },
    {
      "@type": "Question",
      name: "Does it preserve whitespace in pre and code tags?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the minifier preserves whitespace inside pre, code, textarea, and script tags where spacing is functionally important.",
      },
    },
    {
      "@type": "Question",
      name: "Can I beautify or format minified HTML back?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "While this tool focuses on minification, many code editors and online HTML beautifiers can reformat minified HTML back to a readable format with proper indentation.",
      },
    },
    {
      "@type": "Question",
      name: "Does the tool work offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, once the page is loaded you can continue minifying HTML without an internet connection since all processing happens locally in your browser.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this on mobile devices?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the HTML minifier is fully responsive and works seamlessly on Android and iOS browsers, tablets, and desktop devices.",
      },
    },
    {
      "@type": "Question",
      name: "How much can minification reduce HTML file size?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Minification typically reduces HTML file size by 10-30%, depending on how much whitespace, comments, and formatting your original code contains.",
      },
    },
    {
      "@type": "Question",
      name: "Does it validate HTML syntax?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The minifier performs basic processing but does not comprehensively validate HTML. For full validation, use the W3C HTML validator.",
      },
    },
    {
      "@type": "Question",
      name: "Should I use minified HTML in development?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, use formatted HTML during development for readability, debugging, and maintenance. Minify HTML only for production deployment to improve performance.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work with all browsers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the HTML minifier works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera on both desktop and mobile platforms.",
      },
    },
    {
      "@type": "Question",
      name: "Can I minify email HTML templates?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, but be cautious. Some email clients are sensitive to HTML formatting. Test thoroughly after minification to ensure the email renders correctly.",
      },
    },
    {
      "@type": "Question",
      name: "Does minification remove optional closing tags?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Some advanced minifiers remove optional closing tags like </li>, </p>, </body>. This tool focuses on safe minification without removing structurally optional elements.",
      },
    },
    {
      "@type": "Question",
      name: "Will minifying HTML improve my website SEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, indirectly. Minified HTML reduces page load time, which is a Google ranking factor. Faster websites provide better user experience and rank higher in search results.",
      },
    },
    {
      "@type": "Question",
      name: "Can I minify React or Vue component HTML?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This tool is for standard HTML. React JSX and Vue templates should be minified as part of your build process using bundlers like Webpack, Vite, or Parcel.",
      },
    },
    {
      "@type": "Question",
      name: "Does it handle SVG code inside HTML?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the minifier processes SVG tags embedded in HTML and removes unnecessary whitespace while preserving the SVG structure and functionality.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this for WordPress pages?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can minify the HTML output of WordPress pages. However, many WordPress caching and optimization plugins already provide automatic HTML minification.",
      },
    },
  ],
};

export default faqSchema;