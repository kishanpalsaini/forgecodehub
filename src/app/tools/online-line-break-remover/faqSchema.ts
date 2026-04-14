export const lineBreakRemoverFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a line break remover?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A line break remover is a tool that removes all newline characters (\\n) and carriage returns (\\r) from text, converting multi-line text into a single continuous line. It also removes extra spaces that may result from the line break removal."
      }
    },
    {
      "@type": "Question",
      "name": "When should I use a line break remover?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use a line break remover when you need to: convert multi-paragraph text into a single line, clean up text copied from PDFs or emails, prepare text for specific formatting requirements, or remove unwanted line breaks from imported data."
      }
    },
    {
      "@type": "Question",
      "name": "Does it preserve spaces between words?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! The tool replaces line breaks with spaces and then removes any extra spaces, ensuring words remain properly separated with single spaces. Your text stays readable and well-formatted."
      }
    },
    {
      "@type": "Question",
      "name": "Can I reverse the process and add line breaks back?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "While this tool removes line breaks, you can manually add them back by pressing Enter where needed. There's no automatic way to restore the original line break positions after removal."
      }
    },
    {
      "@type": "Question",
      "name": "Is this tool useful for coding?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, it can be useful for converting multi-line code into single-line format, such as for inline CSS, JavaScript one-liners, or SQL queries. However, be careful as line breaks can be syntactically important in many programming languages."
      }
    }
  ]
};