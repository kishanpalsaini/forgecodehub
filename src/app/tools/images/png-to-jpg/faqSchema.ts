export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Will converting PNG to JPG lose quality?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, some quality loss occurs because JPG uses lossy compression that discards image data. Using the 'High' quality setting minimizes visible differences from the original PNG.",
      },
    },
    {
      "@type": "Question",
      name: "Is this PNG to JPG converter free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, this PNG to JPG converter is completely free to use with no subscription, no hidden charges, and no account required.",
      },
    },
    {
      "@type": "Question",
      name: "Are my images uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, all image conversion happens locally in your browser using the Canvas API. Your images never leave your device and are not sent to any server, ensuring complete privacy.",
      },
    },
    {
      "@type": "Question",
      name: "What happens to transparent areas in PNG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PNG transparency is automatically replaced with a white background because JPG does not support alpha channels or transparency. All transparent pixels become white.",
      },
    },
    {
      "@type": "Question",
      name: "How much smaller will the JPG file be?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Photographs typically shrink 60-80% in file size. Simple graphics with large flat-color areas may not compress as much, but still result in significant size reduction.",
      },
    },
    {
      "@type": "Question",
      name: "What quality setting should I use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "High quality (95%) is recommended for photographs you intend to print or display at large sizes. Medium (75%) is balanced for web use. Low (50%) is best when file size is the top priority.",
      },
    },
    {
      "@type": "Question",
      name: "When should I convert PNG to JPG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Convert PNG to JPG when you need smaller file sizes for web use, email attachments, or storage, especially for photographs where minor quality loss is acceptable.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert multiple PNG images at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Currently, the tool converts one image at a time. For batch conversion, you would need to convert each PNG file individually.",
      },
    },
    {
      "@type": "Question",
      name: "Does the tool work offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, once the page is loaded you can continue converting images without an internet connection since all processing happens locally in your browser.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this on mobile devices?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the converter is fully responsive and works seamlessly on Android and iOS browsers, tablets, and desktop devices.",
      },
    },
    {
      "@type": "Question",
      name: "Does conversion change image dimensions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, the converter maintains the original image dimensions. The width and height in pixels remain exactly the same after conversion from PNG to JPG.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert PNG screenshots to JPG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, but JPG may not be ideal for screenshots containing text or UI elements. PNG is better suited for screenshots due to lossless compression, but JPG works if file size is critical.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work with all browsers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the PNG to JPG converter works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera on both desktop and mobile platforms.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download the converted JPG file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, after conversion you can download the JPG file directly to your device with a single click.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert back to PNG after converting to JPG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, but each lossy conversion cycle introduces more compression artifacts. Always keep the original PNG file whenever possible to avoid cumulative quality loss.",
      },
    },
    {
      "@type": "Question",
      name: "What is the maximum file size I can convert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool can handle images of various sizes, but very large files may take longer to process depending on your browser and device performance. Most typical images convert instantly.",
      },
    },
    {
      "@type": "Question",
      name: "Is JPG better than PNG for website images?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends. JPG is better for photographs due to smaller file sizes. PNG is better for logos, icons, graphics with transparency, or images with text requiring sharp edges.",
      },
    },
    {
      "@type": "Question",
      name: "Does JPG support as many colors as PNG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, JPG supports 24-bit true color (16.7 million colors), the same as PNG. However, JPG uses lossy compression that may slightly alter colors during compression.",
      },
    },
    {
      "@type": "Question",
      name: "Can I choose the background color for transparent areas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The current tool uses white as the default background. Some advanced converters allow choosing custom background colors for transparent PNG areas.",
      },
    },
    {
      "@type": "Question",
      name: "Will converting to JPG reduce image sharpness?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JPG compression can introduce slight softening, especially around sharp edges and text. Using high quality settings minimizes this effect but does not eliminate it entirely.",
      },
    },
    {
      "@type": "Question",
      name: "Is JPG suitable for logos and icons?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, PNG or SVG are better for logos and icons. JPG compression creates artifacts around text and sharp edges, and does not support transparency needed for versatile logo use.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use converted JPG images in Photoshop?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the output JPG files are standard format and fully compatible with all image editing software including Photoshop, GIMP, Affinity Photo, and others.",
      },
    },
    {
      "@type": "Question",
      name: "Does the converter preserve EXIF data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool converts the visual image data. EXIF metadata may not be fully preserved. If you need to retain camera data, location, or timestamps, use specialized tools.",
      },
    },
    {
      "@type": "Question",
      name: "Why do some colors look different after conversion?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JPG uses lossy compression that approximates colors to reduce file size. Subtle gradients and near-identical colors may shift slightly. Using high quality settings reduces this effect.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert PNG illustrations or drawings to JPG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, but JPG may introduce compression artifacts in flat-color areas and sharp edges. For illustrations and vector-style graphics, PNG or SVG formats are generally preferable.",
      },
    },
  ],
};

export default faqSchema;