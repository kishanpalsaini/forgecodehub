import Link from "next/link";
import styles from "./blog.module.css";
import type { Metadata } from "next";
import { getAllPosts } from "../.../../../lib/supabase-blog";

export const metadata: Metadata = {
    title: "Blog — ForgeCodeHub",
    description:
        "Guides, tips, and tutorials on finance calculators, developer tools, image converters and more. Free tools explained simply.",
    openGraph: {
        title: "Blog — ForgeCodeHub",
        description:
            "Guides, tips, and tutorials on finance calculators, developer tools, image converters and more.",
        url: "https://forgecodehub.com/blog",
    },
};

export const revalidate = 60;

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

// Get unique categories from posts for the filter bar
function getCategories(posts: Awaited<ReturnType<typeof getAllPosts>>) {
    const cats = Array.from(new Set(posts.map((p) => p.category)));
    return ["All", ...cats];
}

export default async function BlogPage() {
    const posts = await getAllPosts();

    const featured = posts[0] ?? null;
    const rest = posts.slice(1);
    const categories = getCategories(posts);

    return (
        <main className={styles.page}>

            {/* ── Hero ── */}
            <section className={styles.hero}>
                {/* Static badge */}
                <div className={styles.heroBadge}>The Blog</div>
                <h1 className={styles.heroTitle}>Guides & tutorials</h1>
                {/* Static subtitle */}
                <p className={styles.heroSub}>
                    Simple explanations for every tool — from EMI calculators to JSON
                    formatters. Learn how to use free tools for finance, productivity,
                    and development.
                </p>

                {/* Category filter pills — dynamic from posts */}
                <div className={styles.filterRow}>
                    {categories.map((cat) => (
                        <span
                            key={cat}
                            className={`${styles.filterPill} ${cat === "All" ? styles.filterPillActive : ""}`}
                            style={
                                cat !== "All" && cat in CATEGORY_COLORS
                                    ? ({
                                        "--cat-color": getCategoryColor(cat),
                                    } as React.CSSProperties)
                                    : undefined
                            }
                        >
                            {cat}
                        </span>
                    ))}
                </div>
            </section>

            {/* ── Featured post ── */}
            {featured && (
                <section className={styles.featuredWrap}>
                    {/* Static label */}
                    <div className={styles.sectionLabel}>
                        <span className={styles.sectionLabelDot} />
                        Latest post
                    </div>

                    <Link href={`/blog/${featured.slug}`} className={styles.featuredCard}>
                        <div className={styles.featuredInner}>

                            {/* Cover — dynamic */}
                            {featured.cover_image && (
                                <div className={styles.featuredCoverWrap}>
                                    <img
                                        src={featured.cover_image}
                                        alt={featured.title}
                                        className={styles.featuredCover}
                                    />
                                </div>
                            )}

                            {/* Right side content */}
                            <div className={styles.featuredContent}>
                                {/* Meta — dynamic */}
                                <div className={styles.featuredMeta}>
                                    <span
                                        className={styles.categoryBadge}
                                        style={{
                                            color: getCategoryColor(featured.category),
                                            background: getCategoryColor(featured.category) + "18",
                                        }}
                                    >
                                        {featured.category}
                                    </span>
                                    <span className={styles.metaDot} />
                                    <span className={styles.metaText}>{featured.read_time}</span>
                                    <span className={styles.metaDot} />
                                    <span className={styles.metaText}>
                                        {new Date(featured.published_at).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>

                                {/* Title — dynamic */}
                                <h2 className={styles.featuredTitle}>{featured.title}</h2>

                                {/* Excerpt — dynamic */}
                                <p className={styles.featuredDesc}>
                                    {featured.excerpt ?? featured.seo_description ?? ""}
                                </p>

                                {/* Author + CTA row — "ForgeCodeHub" static, rest dynamic */}
                                <div className={styles.featuredFooter}>
                                    <div className={styles.authorMini}>
                                        <div className={styles.authorAvatar}>F</div>
                                        <span className={styles.authorName}>ForgeCodeHub</span>
                                    </div>
                                    {/* Static CTA */}
                                    <span className={styles.readMore}>Read article →</span>
                                </div>
                            </div>

                        </div>
                    </Link>
                </section>
            )}

            {/* ── All posts grid ── */}
            {rest.length > 0 && (
                <section className={styles.gridSection}>
                    {/* Static label, dynamic count */}
                    <div className={styles.sectionLabel}>
                        <span className={styles.sectionLabelDot} style={{ background: "rgba(255,255,255,0.2)" }} />
                        All posts
                        <span className={styles.postCount}>{rest.length}</span>
                    </div>

                    <div className={styles.grid}>
                        {rest.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className={styles.postCard}
                            >
                                {/* Cover — dynamic */}
                                {post.cover_image && (
                                    <div className={styles.cardCoverWrap}>
                                        <img
                                            src={post.cover_image}
                                            alt={post.title}
                                            className={styles.cardCover}
                                        />
                                    </div>
                                )}

                                {/* Meta — dynamic */}
                                <div className={styles.postMeta}>
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
                                </div>

                                {/* Title — dynamic */}
                                <h2 className={styles.postTitle}>{post.title}</h2>

                                {/* Excerpt — dynamic */}
                                <p className={styles.postDesc}>
                                    {post.excerpt ?? post.seo_description ?? ""}
                                </p>

                                {/* Footer — dynamic date, static "Read →" */}
                                <div className={styles.postFooter}>
                                    <span className={styles.metaText}>
                                        {new Date(post.published_at).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                    <span className={styles.readMore}>Read →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Empty state ── */}
            {posts.length === 0 && (
                <section className={styles.emptyState}>
                    <div className={styles.emptyIcon}>✦</div>
                    {/* Static text */}
                    <p className={styles.emptyTitle}>No posts published yet</p>
                    <p className={styles.emptyDesc}>Check back soon — guides are on the way.</p>
                </section>
            )}

            {/* ── Newsletter / subscribe strip — fully static ── */}
            <section className={styles.subscribeStrip}>
                <div className={styles.subscribeInner}>
                    <div>
                        <p className={styles.subscribeTitle}>Stay in the loop</p>
                        <p className={styles.subscribeSub}>
                            New tools and guides, straight to your inbox.
                        </p>
                    </div>
                    <Link href="/" className={styles.subscribeBtn}>
                        Explore free tools →
                    </Link>
                </div>
            </section>

        </main>
    );
}