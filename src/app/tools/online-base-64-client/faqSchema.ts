export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Base64 encoding?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Base64 encoding is a method of converting binary data into ASCII text format using 64 different characters (A-Z, a-z, 0-9, +, /). It is commonly used to encode images, files, or binary data for transmission over text-based protocols.",
      },
    },
    {
      "@type": "Question",
      name: "Is this Base64 encoder free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, this Base64 encoder and decoder is completely free to use with no subscription, no hidden charges, and no account required.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data safe when using this Base64 tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all encoding and decoding happens locally in your browser. Your data never leaves your device and is not sent to any server, ensuring complete privacy and security.",
      },
    },
    {
      "@type": "Question",
      name: "Can I encode files to Base64?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can upload any file (images, PDFs, documents, etc.) and convert it to Base64 format. The tool supports files of various sizes and formats.",
      },
    },
    {
      "@type": "Question",
      name: "Can I decode Base64 back to the original file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can paste Base64 encoded data and decode it back to its original format. For files, you can download the decoded result.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between Base64 encode and decode?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Encoding converts text or files into Base64 format, while decoding converts Base64 strings back to their original text or binary format.",
      },
    },
    {
      "@type": "Question",
      name: "Can I encode images to Base64?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can upload images (JPG, PNG, GIF, WebP, etc.) and convert them to Base64 data URLs, which can be embedded directly in HTML or CSS.",
      },
    },
    {
      "@type": "Question",
      name: "Does Base64 encoding compress data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, Base64 encoding does not compress data. In fact, it increases the data size by approximately 33% because it converts binary data to text format.",
      },
    },
    {
      "@type": "Question",
      name: "Can I copy the Base64 output to clipboard?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, there is a one-click copy button that copies the entire Base64 encoded or decoded output to your clipboard instantly.",
      },
    },
    {
      "@type": "Question",
      name: "What file types can I encode to Base64?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can encode any file type including images (JPG, PNG, GIF, SVG), documents (PDF, DOCX), text files, audio, video, and more.",
      },
    },
    {
      "@type": "Question",
      name: "Does the tool work offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, once the page is loaded you can continue encoding and decoding without an internet connection since all processing happens locally in your browser.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this on mobile devices?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the Base64 tool is fully responsive and works seamlessly on Android and iOS browsers, tablets, and desktop devices.",
      },
    },
    {
      "@type": "Question",
      name: "What is the maximum file size I can encode?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool can handle files up to several megabytes, but very large files may take longer to process depending on your browser and device performance.",
      },
    },
    {
      "@type": "Question",
      name: "Why do developers use Base64 encoding?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Developers use Base64 to embed images in HTML/CSS, send binary data in JSON or XML, encode data in URLs, store binary data in databases, and transmit files over text-based protocols.",
      },
    },
    {
      "@type": "Question",
      name: "Can I decode a Base64 data URL?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can paste a complete Base64 data URL (like data:image/png;base64,...) and the tool will decode it back to the original file.",
      },
    },
    {
      "@type": "Question",
      name: "Is Base64 encoding the same as encryption?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, Base64 encoding is not encryption. It is simply an encoding scheme to represent binary data as text. Anyone can decode Base64 without a key, so it provides no security.",
      },
    },
    {
      "@type": "Question",
      name: "Can I encode UTF-8 text to Base64?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the tool properly handles UTF-8 encoded text including special characters, emojis, and non-Latin alphabets like Arabic, Chinese, Hindi, and Cyrillic.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work with all browsers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the Base64 tool works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera on both desktop and mobile platforms.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download the decoded file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, after decoding Base64 data that represents a file, you can download it back to your device with the original file format and extension.",
      },
    },
    {
      "@type": "Question",
      name: "What is a Base64 data URL?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A Base64 data URL is a complete URI that includes the MIME type and Base64 encoded data, formatted as data:[MIME-type];base64,[encoded-data]. It allows embedding files directly in HTML or CSS.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this for API authentication tokens?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Base64 encoding is commonly used to encode API keys, authentication tokens, and credentials for HTTP Basic Authentication headers.",
      },
    },
    {
      "@type": "Question",
      name: "Does the tool validate Base64 format?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, when decoding, the tool validates whether the input is valid Base64 format and displays an error message if the format is incorrect.",
      },
    },
    {
      "@type": "Question",
      name: "Can I encode multiple files at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Currently, the tool processes one file at a time. For multiple files, you need to encode each file separately.",
      },
    },
    {
      "@type": "Question",
      name: "What happens to line breaks in Base64 output?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool outputs Base64 as a continuous string without line breaks by default, which is the standard format for web use and data transmission.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this to embed images in emails?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can encode images to Base64 data URLs and embed them directly in HTML emails, though be aware that some email clients may not support this method.",
      },
    },
  ],
};

export default faqSchema;