import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./post.module.css";
import type { Metadata } from "next";
import { ToolEmbed } from "@/app/components/tools/ToolRegistry";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  incrementViews,
} from "../../../lib/supabase-blog";

export const revalidate = 60;

// Pre-generate known slugs at build time for performance
export async function generateStaticParams() {
  const posts = await getAllPosts();
  debugger;
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.seo_title ?? post.title} — ForgeCodeHub`,
    description: post.seo_description ?? post.excerpt ?? "",
    openGraph: {
      title: post.seo_title ?? post.title,
      description: post.seo_description ?? post.excerpt ?? "",
      url: `https://forgecodehub.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.published_at,
      ...(post.cover_image ? { images: [post.cover_image] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo_title ?? post.title,
      description: post.seo_description ?? post.excerpt ?? "",
    },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  Finance: "#f97316",
  Developer: "#0ea5e9",
  Media: "#8b5cf6",
  Productivity: "#10b981",
  General: "#6366f1",
};

function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? "#6366f1";
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // Increment view count (fire and forget)
  incrementViews(post.id);

  const related = await getRelatedPosts(post.category, slug);

  return (
    <main className={styles.page}>
      <article className={styles.article}>

        {/* Back */}
        <Link href="/blog" className={styles.back}>
          ← All posts
        </Link>

        {/* Cover image */}
        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            style={{
              width: "100%",
              height: "280px",
              objectFit: "cover",
              borderRadius: "16px",
              marginBottom: "24px",
            }}
          />
        )}

        {/* Meta */}
        <div className={styles.meta}>
          <span
            className={styles.categoryBadge}
            style={{
              color: getCategoryColor(post.category),
              background: getCategoryColor(post.category) + "18",
            }}
          >
            {post.category}
          </span>
          <span className={styles.metaText}>{post.read_time}</span>
          <span className={styles.metaText}>
            {new Date(post.published_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className={styles.metaText}>
            {post.views.toLocaleString()} views
          </span>
        </div>

        {/* Title */}
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.description}>
          {post.excerpt ?? post.seo_description ?? ""}
        </p>

        {/* Tool CTA — shows if tool_link and tool_name are filled */}
        {post.tool_link && post.tool_name && (
          <div className={styles.toolCta}>
            <div>
              <div className={styles.toolCtaLabel}>Try it free</div>
              <div className={styles.toolCtaTitle}>
                Use our free {post.tool_name}
              </div>
              <p className={styles.toolCtaDesc}>
                No signup. No ads. Instant results in your browser.
              </p>
            </div>
            <Link href={post.tool_link} className={styles.toolCtaBtn}>
              Open {post.tool_name} →
            </Link>
          </div>
        )}

        <hr className={styles.hr} />

        {/* ✅ ADD THIS — renders the actual tool embedded in post */}
        <ToolEmbed toolLink={post.tool_link} toolName={post.tool_name} />

        {/* Post content from TipTap editor (HTML) */}
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
        />

        <hr className={styles.hr} />

        {/* Bottom CTA */}
        {post.tool_link && post.tool_name && (
          <div className={styles.bottomCta}>
            <p>Ready to try it yourself?</p>
            <Link href={post.tool_link} className={styles.btnOrange}>
              Open {post.tool_name} — it&apos;s free →
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
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className={styles.relatedCard}
              >
                {p.cover_image && (
                  <img
                    src={p.cover_image}
                    alt={p.title}
                    style={{
                      width: "100%",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                )}
                <span
                  className={styles.categoryBadge}
                  style={{
                    color: getCategoryColor(p.category),
                    background: getCategoryColor(p.category) + "18",
                  }}
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




// I want this page should look like a professional blog page 
// user should not face to difficulty to read the content
// do better colur, background color, font-family and the layout
// and toolEmbed component should be in full width so it visible full and user can use esaliy

// so work on user experience and whatever you can do better for that do it