// src/app/blog/[slug]/page.tsx  — Server Component
// import { tools } from "@/data/tools";
import { tools } from "../../data/tools"; // adjust path as needed
import { notFound } from "next/navigation";

// generates /blog/how-to-calculate-emi,
//           /blog/how-to-calculate-gst, etc. at build time
export async function generateStaticParams() {
  return tools
    .filter((t: any) => t?.guide)
    .map((t: any) => ({ slug: t.guide?.slug }));
}

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const tool = tools.find((t) => t.guide?.slug === slug);
  if (!tool) return {};
  return {
    title: tool.guide!.title,
    description: tool.guide!.metaDesc,
  };
}

export default async function GuidePage({ params }: any) {
  const { slug } = await params;
  const tool = tools.find((t) => t.guide?.slug === slug);
  if (!tool || !tool.guide) notFound();

  const g = tool.guide;

  return (
    <article className="container" style={{ maxWidth: 760, padding: "8rem 2rem 4rem" }}>

      <div className="section-label">Guide</div>
      <h1 className="section-title" style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)" }}>
        {g.title}
      </h1>

      <h2>What is {tool.name}?</h2>
      <p>{g.whatIs}</p>

      <h2>The Formula</h2>
      <pre><code>{g.formula}</code></pre>
      <ul>
        {g.formulaVars.map((v) => (
          <li key={v.var}><strong>{v.var}</strong> — {v.meaning}</li>
        ))}
      </ul>

      <h2>Common use cases</h2>
      <ul>
        {g.useCases.map((u) => <li key={u}>{u}</li>)}
      </ul>

      {/* Embedded live tool — the killer feature */}
      <div style={{ margin: "2rem 0", padding: "1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>
        <p className="section-label">Try it now</p>
        <p>Use our free <strong>{tool.name}</strong> to calculate instantly — no signup needed.</p>
        <a href={tool.path} className="btn-primary">
          Open {tool.name} →
        </a>
      </div>

      {/* FAQ section — auto from data */}
      {g.faqs.map((faq) => (
        <div key={faq.q}>
          <h3>{faq.q}</h3>
          <p>{faq.a}</p>
        </div>
      ))}

    </article>
  );
}
// ```

// **Result: 50 tools = 50 guide pages. You write zero MDX. You just fill in the `guide` object in `tools.ts` once per tool.**

// ---

// ## Tier 2 — One MDX template, multiple data variations

// For comparison posts like "SIP vs lump sum" you write **one MDX file** but pass different data into it:
// ```
// src/content/blog/
// ├── emi-guide.mdx        ← covers all EMI variants (home, car, personal)
// ├── sip-guide.mdx        ← covers all SIP scenarios
// ├── tax-guide.mdx        ← covers old vs new regime
// ├── gst-guide.mdx        ← covers all GST slabs
// ├── fd-rd-guide.mdx      ← covers FD + RD
// └── loan-eligibility.mdx ← covers FOIR, CIBIL