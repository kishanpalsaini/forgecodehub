// // src/app/blog/[slug]/page.tsx  — Server Component
// // import { tool } from "@/data/tool";
// import { tools, type Tool, type Guide } from "../../data/tools";
// import { notFound } from "next/navigation";


// // data/tool.ts (or wherever your types are)

// export interface Guide {
//   slug: string;
//   title: string;
//   metaDesc?: string;
//   whatIs?: string;
//   formula?: string;
//   formulaVars?: { var: string; meaning: string }[];
//   useCases?: string[];
//   faqs?: { q: string; a: string }[];
// }

// export interface Tool {
//   name: string;
//   path: string;
//   guide?: Guide; // ← optional, so tool without guide won't error
//   // ...other fields
// }

// export const tool: Tool[] = [ ...tools ];

// export async function generateStaticParams() {
//   return tool
//     .filter((t) => t?.guide)
//     .map((t) => ({ slug: t.guide?.slug }));
// }

// export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = await params;
//   const tool = tool.find((t) => t.guide?.slug === slug);
//   if (!tool?.guide) return {};
//   return {
//     title: tool.guide.title,
//     description: tool.guide.metaDesc,
//   };
// }

// export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = await params;
//   const tool = tool.find((t) => t.guide?.slug === slug);
//   if (!tool || !tool.guide) notFound();

//   const g = tool.guide; // Now TypeScript knows g is Guide, not undefined

//   return (
//     <article className="container" style={{ maxWidth: 760, padding: "8rem 2rem 4rem" }}>
//       <div className="section-label">Guide</div>
//       <h1 className="section-title" style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)" }}>
//         {g.title}
//       </h1>

//       {g.whatIs && (
//         <>
//           <h2>What is {tool.name}?</h2>
//           <p>{g.whatIs}</p>
//         </>
//       )}

//       {g.formula && (
//         <>
//           <h2>The Formula</h2>
//           <pre><code>{g.formula}</code></pre>
//           {g.formulaVars && g.formulaVars.length > 0 && (
//             <ul>
//               {g.formulaVars.map((v) => (
//                 <li key={v.var}><strong>{v.var}</strong> — {v.meaning}</li>
//               ))}
//             </ul>
//           )}
//         </>
//       )}

//       {g.useCases && g.useCases.length > 0 && (
//         <>
//           <h2>Common use cases</h2>
//           <ul>
//             {g.useCases.map((u) => <li key={u}>{u}</li>)}
//           </ul>
//         </>
//       )}

//       <div style={{ margin: "2rem 0", padding: "1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>
//         <p className="section-label">Try it now</p>
//         <p>Use our free <strong>{tool.name}</strong> to calculate instantly — no signup needed.</p>
//         <a href={tool.path} className="btn-primary">Open {tool.name} →</a>
//       </div>

//       {g.faqs && g.faqs.length > 0 && g.faqs.map((faq) => (
//         <div key={faq.q}>
//           <h3>{faq.q}</h3>
//           <p>{faq.a}</p>
//         </div>
//       ))}
//     </article>
//   );
// }