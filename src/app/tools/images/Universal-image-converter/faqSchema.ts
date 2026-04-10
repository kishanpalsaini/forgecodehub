export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What image formats can I convert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can convert between JPG, PNG, WebP, GIF, BMP, TIFF, SVG, ICO, HEIC, and AVIF formats. The tool supports 10+ image formats with bidirectional conversion capabilities.",
      },
    },
    {
      "@type": "Question",
      name: "Is this universal image converter free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, this universal image converter is completely free to use with no subscription, no hidden charges, and no account required.",
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
      name: "Can I convert SVG to PNG or JPG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, SVG vector images are rendered to canvas and then converted to raster formats like PNG or JPG at their original dimensions.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert PNG or JPG to SVG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, but the output is an embedded SVG (raster image wrapped in SVG tags), not a true vector. For true vector conversion with path tracing, use specialized software like Adobe Illustrator or Inkscape.",
      },
    },
    {
      "@type": "Question",
      name: "What happens to transparency when converting formats?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Formats like PNG, WebP, GIF, AVIF, and SVG support transparency. When converting to JPG, BMP, or TIFF, transparent areas are automatically replaced with a white background.",
      },
    },
    {
      "@type": "Question",
      name: "Can I rotate or flip images?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the tool includes rotate and flip functionality. You can rotate by 90°, 180°, or any custom angle, and flip images horizontally or vertically.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert images to PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can convert up to 20 images into a single PDF document. Each image becomes one page, with options for page size (A4, Letter, A3) and orientation (portrait/landscape).",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between lossy and lossless formats?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Lossy formats (JPG, WebP, AVIF) compress images by discarding data, reducing file size but losing some quality. Lossless formats (PNG, GIF, BMP, TIFF) preserve all image data without quality loss but result in larger files.",
      },
    },
    {
      "@type": "Question",
      name: "Can I adjust the quality when converting?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, for lossy formats (JPG, WebP, AVIF) you can choose between low, medium, and high quality settings to balance file size and image quality.",
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
      name: "What is WebP and why should I use it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WebP is a modern image format developed by Google that provides superior compression (25-35% smaller than JPG) while maintaining quality. It supports both lossy and lossless compression plus transparency.",
      },
    },
    {
      "@type": "Question",
      name: "What is AVIF and is it better than WebP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AVIF is a cutting-edge format offering better compression than WebP and JPG. However, browser support is newer (Chrome 85+, Firefox 93+, Safari 16+), while WebP has wider compatibility.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert HEIC photos from iPhone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the tool accepts HEIC format (iPhone's default photo format) and can convert it to more widely compatible formats like JPG or PNG.",
      },
    },
    {
      "@type": "Question",
      name: "Does conversion change image dimensions or resolution?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, the converter maintains the original image dimensions and resolution. Width and height in pixels remain exactly the same unless you use the rotate feature.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert multiple images at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Currently, single image conversion processes one at a time. The PDF converter accepts up to 20 images to create a multi-page PDF document.",
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
      name: "Does it work with all browsers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the universal converter works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. However, some newer formats like AVIF and HEIC may have limited support in older browsers.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download the converted image?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, after conversion you can download the image in the new format directly to your device with a single click.",
      },
    },
    {
      "@type": "Question",
      name: "Which format is best for website images?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WebP or AVIF are best for modern websites due to superior compression. JPG is good for photographs with wide compatibility. PNG is ideal for logos, icons, and images needing transparency.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert animated GIFs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool converts the first frame of animated GIFs to other formats. For preserving animation, keep the original GIF or convert to video formats like MP4 using specialized tools.",
      },
    },
    {
      "@type": "Question",
      name: "What is ICO format used for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ICO format is used for website favicons, Windows program icons, and desktop shortcuts. It can contain multiple image sizes in one file for different display contexts.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert images for printing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can convert to TIFF or high-quality PNG for printing. Professional printing may prefer TIFF, while PNG works well for most standard printing needs.",
      },
    },
    {
      "@type": "Question",
      name: "Will converting formats improve image quality?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, converting formats cannot improve quality beyond the original. Converting from lossy to lossless (JPG to PNG) prevents further loss but cannot recover already discarded data.",
      },
    },
  ],
};

export default faqSchema;