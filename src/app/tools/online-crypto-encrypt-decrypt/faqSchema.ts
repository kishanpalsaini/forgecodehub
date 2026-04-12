export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is AES encryption?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AES (Advanced Encryption Standard) is a symmetric encryption algorithm widely used to secure data. It encrypts and decrypts data using the same secret key, making it fast and highly secure.",
      },
    },
    {
      "@type": "Question",
      name: "Is this AES encryption tool free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, this tool is completely free with no sign-up, no subscription, and no hidden charges.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data sent to any server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All encryption and decryption happens entirely in your browser using JavaScript. Your text and keys never leave your device.",
      },
    },
    {
      "@type": "Question",
      name: "What mode does this tool use for AES encryption?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This tool uses AES in CBC (Cipher Block Chaining) mode with PKCS7 padding via the CryptoJS library, which is a widely adopted and secure configuration.",
      },
    },
    {
      "@type": "Question",
      name: "What is the output format of the encrypted text?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The encrypted output is a Base64-encoded string, which is safe to store in databases, transmit over networks, and use in URLs.",
      },
    },
    {
      "@type": "Question",
      name: "Can I decrypt text encrypted by other AES tools?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, as long as the other tool uses the same AES mode (CBC), padding (PKCS7), and the same secret key, you can decrypt the output here.",
      },
    },
    {
      "@type": "Question",
      name: "What makes a strong encryption key?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A strong key should be long (16, 24, or 32 characters for AES-128, AES-192, or AES-256), random, and contain a mix of letters, numbers, and symbols.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I use the wrong key to decrypt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you use an incorrect key, the decryption will either fail and return an error, or produce garbled, unreadable output.",
      },
    },
    {
      "@type": "Question",
      name: "Does this tool support AES-128, AES-192, and AES-256?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. CryptoJS automatically selects the AES variant based on your key length — 16 characters for AES-128, 24 for AES-192, and 32 for AES-256.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this tool to encrypt JSON data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Paste your JSON string into the input field, provide a key, and encrypt it. The output will be a Base64-encoded encrypted version of your JSON.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Once the page is loaded, the encryption and decryption functions work entirely client-side without any internet connection.",
      },
    },
    {
      "@type": "Question",
      name: "Does this tool work on mobile devices?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the tool is fully responsive and works on Android and iOS browsers as well as on tablets and desktops.",
      },
    },
  ],
};

export default faqSchema;