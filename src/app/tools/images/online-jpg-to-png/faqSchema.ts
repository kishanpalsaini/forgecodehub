export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does converting JPG to PNG lose quality?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, converting JPG to PNG does not lose additional quality. PNG is a lossless format, so once converted, no further quality degradation occurs. However, the original JPG compression artifacts remain permanently in the PNG.",
      },
    },
    {
      "@type": "Question",
      name: "Is this JPG to PNG converter free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, this JPG to PNG converter is completely free to use with no subscription, no hidden charges, and no account required.",
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
      name: "Why is the PNG file larger than the JPG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PNG uses lossless compression while JPG uses lossy compression. Lossless PNG stores every pixel exactly as it is, resulting in a larger file size compared to the compressed JPG.",
      },
    },
    {
      "@type": "Question",
      name: "Does PNG support transparency?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, PNG supports full alpha channel transparency, making it ideal for logos, icons, and graphics that need transparent backgrounds or semi-transparent elements.",
      },
    },
    {
      "@type": "Question",
      name: "When should I use PNG instead of JPG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use PNG for images requiring transparency, logos, icons, graphics with text, images needing lossless quality, or when you need to edit and re-save without quality loss.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert multiple JPG images at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Currently, the tool converts one image at a time. For batch conversion, you would need to convert each JPG file individually.",
      },
    },
    {
      "@type": "Question",
      name: "What is the maximum file size I can convert?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool can handle images of various sizes, but very large files may take longer to process depending on your browser and device performance. Most typical photos convert instantly.",
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
      name: "Does conversion reduce image dimensions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, the converter maintains the original image dimensions. The width and height in pixels remain exactly the same after conversion from JPG to PNG.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert JPEG to PNG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, JPEG and JPG are the same format with different file extensions. This tool accepts both .jpg and .jpeg files and converts them to PNG.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work with all browsers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the JPG to PNG converter works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera on both desktop and mobile platforms.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download the converted PNG file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, after conversion you can download the PNG file directly to your device with a single click.",
      },
    },
    {
      "@type": "Question",
      name: "Will converting to PNG improve image quality?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, converting JPG to PNG will not improve quality because the JPG compression has already discarded information. PNG simply stores the compressed JPG data without further loss.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert a JPG with EXIF data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool converts the visual image data. EXIF metadata like camera settings, location, and date may not be preserved in the output PNG file.",
      },
    },
    {
      "@type": "Question",
      name: "Why would I convert JPG to PNG for web use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Convert to PNG when you need transparency for logos or icons, require lossless quality for graphics with text, or plan to further edit the image without additional quality loss.",
      },
    },
    {
      "@type": "Question",
      name: "Does PNG support all colors that JPG does?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, PNG supports 24-bit true color (16.7 million colors) and can represent all the colors that JPG can, plus an additional alpha channel for transparency.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert a JPG screenshot to PNG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, JPG screenshots convert perfectly to PNG format, which is actually better suited for screenshots due to lossless compression of text and UI elements.",
      },
    },
    {
      "@type": "Question",
      name: "Is PNG better than JPG for printing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends. PNG preserves quality better for graphics and text, but for photographs JPG is often preferred due to smaller file sizes. Professional printing may use TIFF or RAW formats.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert PNG back to JPG later?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can convert PNG back to JPG anytime, but the original JPG compression artifacts will remain, and converting to JPG again will introduce additional lossy compression.",
      },
    },
    {
      "@type": "Question",
      name: "Does the converter preserve image resolution?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the pixel dimensions and DPI/PPI resolution are maintained during conversion. A 1920x1080 JPG becomes a 1920x1080 PNG with identical resolution.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use converted PNG images in Photoshop or GIMP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the output PNG files are standard format and fully compatible with all image editing software including Photoshop, GIMP, Affinity Photo, and others.",
      },
    },
    {
      "@type": "Question",
      name: "Will the PNG have a transparent background?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, JPG does not support transparency, so the converted PNG will have the same solid background as the original JPG. To create transparency, you need to manually remove the background using an editor.",
      },
    },
    {
      "@type": "Question",
      name: "Is PNG suitable for website images?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, PNG is excellent for logos, icons, graphics with transparency, and images with text. However, for large photographs, JPG or WebP may be better due to smaller file sizes.",
      },
    },
  ],
};

export default faqSchema;