export const characterCounterFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does the character counter work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The character counter analyzes your text in real-time and provides detailed statistics including total characters, letters (A-Z, a-z), numbers (0-9), spaces, special characters, uppercase letters, and lowercase letters. Simply type or paste your text to see instant results."
      }
    },
    {
      "@type": "Question",
      "name": "What counts as a special character?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Special characters include punctuation marks, symbols, and any character that is not a letter, number, or space. Examples include: !, @, #, $, %, &, *, (, ), -, _, =, +, etc."
      }
    },
    {
      "@type": "Question",
      "name": "Is the character counter accurate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Our character counter is 100% accurate and counts every character type precisely. It uses advanced algorithms to distinguish between letters, numbers, spaces, and special characters."
      }
    },
    {
      "@type": "Question",
      "name": "Can I count characters in multiple languages?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely! The character counter works with all languages including English, Spanish, French, German, Chinese, Japanese, Arabic, and more. It accurately counts Unicode characters from any language."
      }
    },
    {
      "@type": "Question",
      "name": "What's the difference between characters and characters without spaces?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Total characters includes everything (letters, numbers, spaces, symbols). Characters without spaces excludes all whitespace, giving you a count of only visible characters. Both metrics are useful for different purposes."
      }
    }
  ]
};