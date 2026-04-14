import { notFound } from "next/navigation";
import Link from "next/link";
// import { blogPosts } from "../../../data/blog";
import { blogPosts } from "../../data/blog";
import styles from "./post.module.css";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} — ForgeCodeHub`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://forgecodehub.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  Finance: "#f97316",
  Developer: "#0ea5e9",
  Media: "#8b5cf6",
  Productivity: "#10b981",
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = blogPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 2);

  return (
    <main className={styles.page}>
      <article className={styles.article}>

        {/* Back */}
        <Link href="/blog" className={styles.back}>← All posts</Link>

        {/* Meta */}
        <div className={styles.meta}>
          <span
            className={styles.categoryBadge}
            style={{ color: CATEGORY_COLORS[post.category], background: CATEGORY_COLORS[post.category] + "18" }}
          >
            {post.category}
          </span>
          <span className={styles.metaText}>{post.readTime}</span>
          <span className={styles.metaText}>
            {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>

        {/* Title */}
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.description}>{post.description}</p>

        {/* Tool CTA */}
        {post.toolLink && post.toolName && (
          <div className={styles.toolCta}>
            <div>
              <div className={styles.toolCtaLabel}>Try it free</div>
              <div className={styles.toolCtaTitle}>Use our free {post.toolName}</div>
              <p className={styles.toolCtaDesc}>No signup. No ads. Instant results in your browser.</p>
            </div>
            <Link href={post.toolLink} className={styles.toolCtaBtn}>
              Open {post.toolName} →
            </Link>
          </div>
        )}

        <hr className={styles.hr} />

        {/* Content */}
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <hr className={styles.hr} />

        {/* Bottom CTA */}
        {post.toolLink && post.toolName && (
          <div className={styles.bottomCta}>
            <p>Ready to try it yourself?</p>
            <Link href={post.toolLink} className={styles.btnOrange}>
              Open {post.toolName} — it&apos;s free →
            </Link>
          </div>
        )}

      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className={styles.related}>
          <div className={styles.relatedLabel}>Related posts</div>
          <div className={styles.relatedGrid}>
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className={styles.relatedCard}>
                <span
                  className={styles.categoryBadge}
                  style={{ color: CATEGORY_COLORS[p.category], background: CATEGORY_COLORS[p.category] + "18" }}
                >
                  {p.category}
                </span>
                <h3 className={styles.relatedTitle}>{p.title}</h3>
                <span className={styles.readMore}>Read →</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}