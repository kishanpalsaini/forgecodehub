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

export async function generateStaticParams() {
  const posts = await getAllPosts();
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

  incrementViews(post.id);

  const related = await getRelatedPosts(post.category, slug);

  const publishedDate = new Date(post.published_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.pageRoot}>

      {/* ── ZONE 1: Light — header, meta, title, CTA pill ── */}
      <div className={styles.lightZone}>
        <div className={styles.prose}>

          {/* Breadcrumb — static labels, dynamic category */}
          <nav className={styles.breadcrumb}>
            <Link href="/" className={styles.bcLink}>Home</Link>
            <span className={styles.bcSep}>/</span>
            <Link href="/blog" className={styles.bcLink}>Blog</Link>
            <span className={styles.bcSep}>/</span>
            <span className={styles.bcCurrent}>{post.category}</span>
          </nav>

          {/* Cover image — dynamic */}
          {post.cover_image && (
            <div className={styles.coverWrap}>
              <img
                src={post.cover_image}
                alt={post.title}
                className={styles.cover}
              />
            </div>
          )}

          {/* Meta — all dynamic */}
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
            <span className={styles.metaDot} />
            <span className={styles.metaText}>{post.read_time}</span>
            <span className={styles.metaDot} />
            <span className={styles.metaText}>{publishedDate}</span>
            <span className={styles.metaDot} />
            <span className={styles.metaText}>{post.views.toLocaleString()} views</span>
          </div>

          {/* Title — dynamic */}
          <h1 className={styles.title}>{post.title}</h1>

          {/* Excerpt — dynamic */}
          <p className={styles.description}>
            {post.excerpt ?? post.seo_description ?? ""}
          </p>

          {/* Author — "ForgeCodeHub" static, date dynamic */}
          <div className={styles.authorRow}>
            <div className={styles.authorAvatar}>F</div>
            <div>
              <span className={styles.authorName}>ForgeCodeHub</span>
              <span className={styles.authorDate}>{publishedDate}</span>
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Tool CTA pill — static labels, dynamic tool_name */}
          {post.tool_link && post.tool_name && (
            <div className={styles.toolCta}>
              <div className={styles.toolCtaLeft}>
                <span className={styles.toolCtaTag}>Free tool</span>
                <span className={styles.toolCtaText}>
                  Try our {post.tool_name} — no signup needed
                </span>
              </div>
              <Link href={post.tool_link} className={styles.toolCtaBtn}>
                Open →
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* ── ZONE 2: Dark — full-width tool embed ── */}
      {post.tool_link && post.tool_name && (
        <div className={styles.embedZone}>
          <div className={styles.embedTopbar}>
            <span className={styles.embedLabel}>
              <span className={styles.liveDot} />
              Try it right here — {post.tool_name}
            </span>
            <span className={styles.embedBadge}>Free {post.tool_name}</span>
          </div>
          <div className={styles.embedBody}>
            <ToolEmbed toolLink={post.tool_link} toolName={post.tool_name} />
          </div>
        </div>
      )}

      {/* ── ZONE 3: Light — article prose content ── */}
      <div className={styles.lightZone}>
        <div className={styles.prose}>

          {/* Dynamic HTML from TipTap / Supabase */}
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
          />

          <hr className={styles.divider} />

          {/* Bottom CTA — static text, dynamic tool_name + link */}
          {post.tool_link && post.tool_name && (
            <div className={styles.bottomCta}>
              <p className={styles.bottomCtaTitle}>
                Start using it — free, right now
              </p>
              <p className={styles.bottomCtaDesc}>
                No account. No download. No ads. Open it and go.
              </p>
              <Link href={post.tool_link} className={styles.bottomCtaBtn}>
                Open {post.tool_name} →
              </Link>
            </div>
          )}

          {/* Related Posts — dynamic */}
          {related.length > 0 && (
            <div className={styles.related}>
              <p className={styles.relatedLabel}>More from ForgeCodeHub</p>
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
                        className={styles.relatedCover}
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
                    <span className={styles.readMore}>Read article →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}