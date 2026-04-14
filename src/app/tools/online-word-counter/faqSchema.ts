export const wordCounterFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How accurate is the word counter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our word counter is 100% accurate and uses advanced algorithms to count words, characters, sentences, and paragraphs. It handles all types of text including special characters, numbers, and multiple languages."
      }
    },
    {
      "@type": "Question",
      "name": "Does the word counter work offline?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Once the page is loaded, the word counter works entirely in your browser without needing an internet connection. Your text is never sent to our servers."
      }
    },
    {
      "@type": "Question",
      "name": "What is the reading time based on?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Reading time is calculated based on an average reading speed of 200 words per minute, which is the standard for adult readers."
      }
    }
  ]
};