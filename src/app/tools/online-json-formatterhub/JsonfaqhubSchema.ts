export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a JSON formatter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A JSON formatter is a tool that takes raw or minified JSON data and formats it with proper indentation, line breaks, and spacing to make it human-readable and easier to understand.",
      },
    },
    {
      "@type": "Question",
      name: "Is this JSON formatter free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, this JSON formatter is completely free to use with no subscription, no hidden charges, and no account required.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to install anything to use this JSON formatter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, this is a web-based JSON formatter that runs entirely in your browser. No installation, download, or software is required.",
      },
    },
    {
      "@type": "Question",
      name: "Does the JSON formatter validate my JSON?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the formatter automatically validates your JSON syntax and displays clear error messages if there are any issues like missing commas, brackets, or quotes.",
      },
    },
    {
      "@type": "Question",
      name: "Can I minify JSON using this tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can both format and minify JSON. The minify option removes all unnecessary whitespace and line breaks to create the most compact version of your JSON.",
      },
    },
    {
      "@type": "Question",
      name: "Is my JSON data safe and private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all JSON processing happens locally in your browser. Your data never leaves your device and is not sent to any server, ensuring complete privacy and security.",
      },
    },
    {
      "@type": "Question",
      name: "Can I upload a JSON file to format it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can upload JSON files from your computer. The tool will read the file, format it, and display the result instantly.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download the formatted JSON?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can download the formatted or minified JSON as a .json file directly to your device with a single click.",
      },
    },
    {
      "@type": "Question",
      name: "Does the JSON formatter support large JSON files?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the formatter can handle large JSON files efficiently. However, extremely large files may take a few seconds to process depending on your browser and device performance.",
      },
    },
    {
      "@type": "Question",
      name: "Can I copy the formatted JSON to clipboard?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, there is a one-click copy button that copies the entire formatted or minified JSON to your clipboard instantly for easy pasting elsewhere.",
      },
    },
    {
      "@type": "Question",
      name: "What indentation levels are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can choose between 2-space or 4-space indentation to format your JSON according to your coding standards or personal preference.",
      },
    },
    {
      "@type": "Question",
      name: "Does the formatter work offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, once the page is loaded you can continue formatting JSON without an internet connection since all processing happens locally in your browser.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this JSON formatter on mobile devices?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the JSON formatter is fully responsive and works seamlessly on Android and iOS browsers, tablets, and desktop devices.",
      },
    },
    {
      "@type": "Question",
      name: "Does it support syntax highlighting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the formatted JSON is displayed with syntax highlighting that color-codes keys, values, strings, numbers, and brackets for better readability.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if my JSON has syntax errors?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The formatter will detect syntax errors and display a clear error message indicating what went wrong and where, helping you fix the issue quickly.",
      },
    },
    {
      "@type": "Question",
      name: "Can I format nested JSON objects?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the formatter handles deeply nested JSON objects and arrays, properly indenting each level to show the hierarchical structure clearly.",
      },
    },
    {
      "@type": "Question",
      name: "Does it support JSON with special characters or Unicode?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the formatter fully supports Unicode characters, emojis, and special characters in JSON strings, preserving them correctly in the output.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this to format API responses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, it is perfect for formatting API responses, configuration files, log data, or any JSON output from APIs, databases, or development tools.",
      },
    },
    {
      "@type": "Question",
      name: "Does the formatter preserve the order of JSON keys?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the formatter preserves the original order of keys in your JSON object as they appear in the input.",
      },
    },
    {
      "@type": "Question",
      name: "Can I clear the input and output with one click?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, there is a clear button that removes all input and output content instantly, allowing you to start fresh with new JSON data.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work with all browsers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the JSON formatter works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera on both desktop and mobile platforms.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this for JSONLines or NDJSON format?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The formatter is designed for standard JSON format. For JSONLines or NDJSON (newline-delimited JSON), you would need to format each line separately.",
      },
    },
    {
      "@type": "Question",
      name: "Does it support JSON5 or relaxed JSON syntax?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, this formatter strictly validates against standard JSON specification. JSON5 features like trailing commas, comments, or unquoted keys are not supported.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this to compare two JSON objects?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This tool focuses on formatting and validation. For comparing JSON objects, you would need a dedicated JSON diff tool.",
      },
    },
    {
      "@type": "Question",
      name: "How is this different from JSON.stringify()?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This formatter provides a user-friendly interface with validation, error detection, syntax highlighting, and download options, while JSON.stringify() is a JavaScript method that requires coding knowledge.",
      },
    },
  ],
};

export default faqSchema;