export const textSorterFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does the text sorter work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The text sorter arranges lines of text in alphabetical order. Paste your text with one item per line, choose A→Z (ascending) or Z→A (descending), and click the sort button. The tool instantly organizes your lines alphabetically."
      }
    },
    {
      "@type": "Question",
      "name": "Does it sort case-sensitively?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The sorting is case-insensitive by default, meaning 'Apple' and 'apple' are treated the same way. This provides more intuitive alphabetical ordering for most use cases."
      }
    },
    {
      "@type": "Question",
      "name": "Can I sort numbers with this tool?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! The tool can sort lines that start with numbers. However, it sorts them as text (1, 10, 2, 20) rather than numerically (1, 2, 10, 20). For numeric sorting, ensure numbers have leading zeros (01, 02, 10, 20)."
      }
    },
    {
      "@type": "Question",
      "name": "What can I use the text sorter for?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Common uses include: organizing name lists, sorting product lists, arranging menu items, ordering bibliography entries, organizing tasks or to-do lists, sorting email addresses, and arranging any data that needs alphabetical organization."
      }
    },
    {
      "@type": "Question",
      "name": "Does it remove empty lines?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, the text sorter automatically removes empty lines during the sorting process, giving you a clean, organized list without blank entries."
      }
    },
    {
      "@type": "Question",
      "name": "Can I sort by last name in a full name list?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The tool sorts by the first character of each line. To sort by last name, you would need to format your list with last names first (e.g., 'Smith, John' instead of 'John Smith')."
      }
    }
  ]
};