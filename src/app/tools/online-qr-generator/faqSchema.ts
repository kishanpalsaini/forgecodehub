const qrFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a QR code?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A QR code (Quick Response code) is a two-dimensional barcode that can store various types of data including URLs, text, contact information, WiFi credentials, and more. It can be scanned using smartphone cameras."
      }
    },
    {
      "@type": "Question",
      "name": "How do I generate a QR code?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simply select the data type (URL, text, WiFi, vCard, etc.), enter your information, customize the appearance if desired, and click 'Generate QR Code'. You can then download it in PNG, SVG, or JPG format."
      }
    },
    {
      "@type": "Question",
      "name": "What file formats are supported?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can download QR codes in PNG, SVG, and JPG formats. SVG is recommended for scalability and print use."
      }
    },
    {
      "@type": "Question",
      "name": "Is the QR code generator free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our QR code generator is completely free to use with no signup required and no watermarks."
      }
    }
  ]
};

export default qrFaqSchema;