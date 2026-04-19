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

// Revalidate every 60 seconds so new posts appear without redeploying
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

export default async function BlogPage() {
    const posts = await getAllPosts();

    const featured = posts[0] ?? null;
    const rest = posts.slice(1);

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroBadge}>The Blog</div>
                <h1 className={styles.heroTitle}>Guides & tutorials</h1>
                <p className={styles.heroSub}>
                    Simple explanations for every tool — from EMI calculators to JSON
                    formatters. Learn how to use free tools for finance, productivity, and
                    development.
                </p>
            </section>

            {/* Featured Post */}
            {featured && (
                <section className={styles.featuredWrap}>
                    <div className={styles.featuredLabel}>Latest post</div>
                    <Link
                        href={`/blog/${featured.slug}`}
                        className={styles.featuredCard}
                    >
                        {/* Cover image if available */}
                        {featured.cover_image && (
                            <img
                                src={featured.cover_image}
                                alt={featured.title}
                                style={{
                                    width: "100%",
                                    height: "220px",
                                    objectFit: "cover",
                                    borderRadius: "12px",
                                    marginBottom: "16px",
                                }}
                            />
                        )}
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
                            <span className={styles.metaText}>{featured.read_time}</span>
                            <span className={styles.metaText}>
                                {new Date(featured.published_at).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                        <h2 className={styles.featuredTitle}>{featured.title}</h2>
                        <p className={styles.featuredDesc}>
                            {featured.excerpt ?? featured.seo_description ?? ""}
                        </p>
                        <span className={styles.readMore}>Read article →</span>
                    </Link>
                </section>
            )}

            {/* All Posts Grid */}
            {rest.length > 0 && (
                <section className={styles.gridSection}>
                    <div className={styles.gridLabel}>All posts</div>
                    <div className={styles.grid}>
                        {rest.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className={styles.postCard}
                            >
                                {post.cover_image && (
                                    <img
                                        src={post.cover_image}
                                        alt={post.title}
                                        style={{
                                            width: "100%",
                                            height: "140px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            marginBottom: "12px",
                                        }}
                                    />
                                )}
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
                                <h2 className={styles.postTitle}>{post.title}</h2>
                                <p className={styles.postDesc}>
                                    {post.excerpt ?? post.seo_description ?? ""}
                                </p>
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

            {/* Empty state */}
            {posts.length === 0 && (
                <section style={{ textAlign: "center", padding: "80px 20px", color: "#9ca3af" }}>
                    <p style={{ fontSize: "16px" }}>No posts published yet. Check back soon!</p>
                </section>
            )}
        </main>
    );
}
