const barcodeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What barcode formats are supported?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We support CODE128, EAN13, EAN8, UPC, UPC-E, CODE39, ITF14, ITF, MSI, Pharmacode, and Codabar formats."
      }
    },
    {
      "@type": "Question",
      "name": "How do I generate a barcode?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Select your barcode format, enter the data according to format requirements, customize the appearance, and click 'Generate Barcode'. Download in PNG, SVG, or JPG format."
      }
    },
    {
      "@type": "Question",
      "name": "What's the difference between EAN13 and UPC?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "EAN13 is the European standard (13 digits) while UPC is primarily used in North America (12 digits). Both are used for retail product identification."
      }
    },
    {
      "@type": "Question",
      "name": "Is the barcode generator free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, completely free with no signup required and no limitations on downloads."
      }
    }
  ]
};

export default barcodeFaqSchema;