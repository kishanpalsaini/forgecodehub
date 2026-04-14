interface FAQItem {
  "@type": string;
  name: string;
  acceptedAnswer: {
    "@type": string;
    text: string;
  };
}

interface FAQSchema {
  "@context": string;
  "@type": string;
  mainEntity: FAQItem[];
}

const textToolsFaqSchema: FAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a word counter tool?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A word counter tool helps you count the number of words, characters, sentences, and paragraphs in your text. It's useful for writers, students, and professionals who need to meet specific word count requirements."
      }
    },
    {
      "@type": "Question",
      "name": "How do I convert text case online?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use our case converter tool to transform text between UPPERCASE, lowercase, Title Case, Sentence case, and aLtErNaTe CaSe. Simply paste your text and click the desired conversion button."
      }
    },
    {
      "@type": "Question",
      "name": "Can I generate fancy fonts for social media?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Our fancy font generator creates stylish Unicode text that works on Instagram, Twitter, Facebook, and other social platforms. Choose from bold, italic, script, bubble, and more styles."
      }
    },
    {
      "@type": "Question",
      "name": "How do I remove duplicate lines from text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use our duplicate line remover tool. Paste your text with each item on a separate line, and the tool will automatically remove all duplicate entries, keeping only unique lines."
      }
    },
    {
      "@type": "Question",
      "name": "Are these text tools free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! All our text and writing tools are completely free to use with no registration required. Your text is processed entirely in your browser for complete privacy."
      }
    }
  ]
};

export default textToolsFaqSchema;