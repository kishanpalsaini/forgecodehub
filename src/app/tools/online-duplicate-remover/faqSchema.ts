export const duplicateRemoverFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does the duplicate line remover work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The duplicate remover scans your text line by line and identifies any lines that appear more than once. It keeps only the first occurrence of each unique line and removes all duplicates. The tool shows you how many duplicates were found and removed."
      }
    },
    {
      "@type": "Question",
      "name": "Is the duplicate removal case-sensitive?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, the duplicate detection is case-sensitive by default. This means 'Apple' and 'apple' are treated as different lines. Both will be kept in the result unless they are exactly identical including capitalization."
      }
    },
    {
      "@type": "Question",
      "name": "What happens to the order of lines?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The tool preserves the original order of lines. When duplicates are found, the first occurrence is kept in its original position, and subsequent duplicates are removed. Your list maintains its original sequence."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use this for email lists?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely! This tool is perfect for cleaning up email lists. Paste your email addresses with one per line, and the tool will remove any duplicate email addresses, ensuring each recipient appears only once."
      }
    },
    {
      "@type": "Question",
      "name": "Does it work with large lists?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! The tool can handle lists with thousands of entries. Processing happens instantly in your browser, and there's no limit on the number of lines you can check for duplicates."
      }
    },
    {
      "@type": "Question",
      "name": "What are common uses for duplicate removal?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Common uses include: cleaning email lists, removing duplicate names from contact lists, deduplicating product SKUs, cleaning up data exports, removing repeated URLs, organizing task lists, and any scenario where unique entries are needed."
      }
    },
    {
      "@type": "Question",
      "name": "Does it count empty lines as duplicates?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The tool treats each empty line as identical, so if you have multiple blank lines, only one will be kept. This helps clean up your text formatting as well."
      }
    }
  ]
};