export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    category: "Finance" | "Developer" | "Media" | "Productivity";
    readTime: string;
    content: string; // HTML string
    toolLink?: string;
    toolName?: string;
}

export const blogPosts: BlogPost[] = [
    {
        slug: "how-to-calculate-emi-online",
        title: "How to Calculate EMI Online — Step by Step Guide",
        description: "Learn how to calculate your home loan, car loan, or personal loan EMI instantly using our free EMI calculator. No signup required.",
        date: "2025-04-10",
        category: "Finance",
        readTime: "4 min read",
        toolLink: "/tools/calculators/emi-calculator",
        toolName: "EMI Calculator",
        content: `
        <h2>What is EMI?</h2>
        <p>EMI (Equated Monthly Instalment) is the fixed amount you pay every month to repay a loan. It includes both the principal and the interest.</p>
  
        <h2>The EMI Formula</h2>
        <p>The standard formula for calculating EMI is:</p>
        <pre><code>EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)</code></pre>
        <p>Where:</p>
        <ul>
          <li><strong>P</strong> — Principal loan amount</li>
          <li><strong>r</strong> — Monthly interest rate (annual rate ÷ 12 ÷ 100)</li>
          <li><strong>n</strong> — Loan tenure in months</li>
        </ul>
  
        <h2>Example Calculation</h2>
        <p>For a ₹10,00,000 home loan at 8.5% per annum for 20 years:</p>
        <ul>
          <li>P = 10,00,000</li>
          <li>r = 8.5 / 12 / 100 = 0.00708</li>
          <li>n = 20 × 12 = 240 months</li>
          <li><strong>EMI ≈ ₹8,678/month</strong></li>
        </ul>
  
        <h2>Why Use an Online EMI Calculator?</h2>
        <p>Manual calculation is error-prone. Our free EMI calculator gives you instant results with a full amortization breakdown — no signup, no ads.</p>
      `,
    },
    {
        slug: "what-is-gst-and-how-to-calculate-it",
        title: "What is GST and How to Calculate it in India",
        description: "A complete guide to GST in India — what it is, GST slabs, and how to add or remove GST from any amount using our free calculator.",
        date: "2025-04-08",
        category: "Finance",
        readTime: "5 min read",
        toolLink: "/tools/calculators/gst-calculator",
        toolName: "GST Calculator",
        content: `
        <h2>What is GST?</h2>
        <p>GST (Goods and Services Tax) is a unified indirect tax levied on the supply of goods and services in India. It replaced multiple taxes like VAT, service tax, and excise duty.</p>
  
        <h2>GST Slabs in India</h2>
        <ul>
          <li><strong>0%</strong> — Essential items (milk, vegetables, books)</li>
          <li><strong>5%</strong> — Household necessities</li>
          <li><strong>12%</strong> — Processed foods, business class air travel</li>
          <li><strong>18%</strong> — Most services, electronics</li>
          <li><strong>28%</strong> — Luxury goods, automobiles</li>
        </ul>
  
        <h2>How to Add GST to an Amount</h2>
        <pre><code>Amount with GST = Original Amount × (1 + GST% / 100)</code></pre>
  
        <h2>How to Remove GST from an Amount</h2>
        <pre><code>Original Amount = Amount with GST / (1 + GST% / 100)</code></pre>
      `,
    },
];