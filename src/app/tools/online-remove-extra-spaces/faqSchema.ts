export const removeSpacesFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I remove extra spaces from text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simply paste your text into the tool and it will automatically show two options: 1) Remove Extra Spaces - eliminates multiple consecutive spaces while keeping single spaces between words, and 2) Remove All Spaces - removes every space from your text. Click the copy button to use the cleaned text."
      }
    },
    {
      "@type": "Question",
      "name": "What's the difference between 'Remove Extra Spaces' and 'Remove All Spaces'?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Remove Extra Spaces keeps single spaces between words but removes multiple consecutive spaces, making text properly formatted. Remove All Spaces eliminates every space character, creating continuous text with no spaces at all."
      }
    },
    {
      "@type": "Question",
      "name": "Why do I have extra spaces in my text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Extra spaces often occur when copying text from PDFs, websites, emails, or formatted documents. Different formatting systems can add multiple spaces, tabs, or other whitespace characters that need to be cleaned up."
      }
    },
    {
      "@type": "Question",
      "name": "Does the tool remove tabs and newlines?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Remove Extra Spaces option replaces tabs and multiple spaces with single spaces. For removing line breaks specifically, use our Line Break Remover tool which is designed for that purpose."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use this for cleaning up code?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! This tool is useful for cleaning up code snippets, HTML, CSS, or any text where formatting needs to be standardized. However, be careful with code as spacing can be syntactically important in some languages."
      }
    }
  ]
};