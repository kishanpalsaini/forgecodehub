import Link from "next/link";
import { blogPosts } from "../data/blog";
import styles from "./blog.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog — ForgeCodeHub",
    description: "Guides, tips, and tutorials on finance calculators, developer tools, image converters and more. Free tools explained simply.",
    openGraph: {
        title: "Blog — ForgeCodeHub",
        description: "Guides, tips, and tutorials on finance calculators, developer tools, image converters and more.",
        url: "https://forgecodehub.com/blog",
    },
};

const CATEGORY_COLORS: Record<string, string> = {
    Finance: "#f97316",
    Developer: "#0ea5e9",
    Media: "#8b5cf6",
    Productivity: "#10b981",
};

export default function BlogPage() {
    const sorted = [...blogPosts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const featured = sorted[0];
    const rest = sorted.slice(1);

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroBadge}>The Blog</div>
                <h1 className={styles.heroTitle}>Guides & tutorials</h1>
                <p className={styles.heroSub}>
                    Simple explanations for every tool — from EMI calculators to JSON formatters.
                    Learn how to use free tools for finance, productivity, and development.
                </p>
            </section>

            {/* Featured Post */}
            {featured && (
                <section className={styles.featuredWrap}>
                    <div className={styles.featuredLabel}>Latest post</div>
                    <Link href={`/blog/${featured.slug}`} className={styles.featuredCard}>
                        <div className={styles.featuredMeta}>
                            <span
                                className={styles.categoryBadge}
                                style={{ color: CATEGORY_COLORS[featured.category], background: CATEGORY_COLORS[featured.category] + "18" }}
                            >
                                {featured.category}
                            </span>
                            <span className={styles.metaText}>{featured.readTime}</span>
                            <span className={styles.metaText}>
                                {new Date(featured.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                            </span>
                        </div>
                        <h2 className={styles.featuredTitle}>{featured.title}</h2>
                        <p className={styles.featuredDesc}>{featured.description}</p>
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
                            <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.postCard}>
                                <div className={styles.postMeta}>
                                    <span
                                        className={styles.categoryBadge}
                                        style={{ color: CATEGORY_COLORS[post.category], background: CATEGORY_COLORS[post.category] + "18" }}
                                    >
                                        {post.category}
                                    </span>
                                    <span className={styles.metaText}>{post.readTime}</span>
                                </div>
                                <h2 className={styles.postTitle}>{post.title}</h2>
                                <p className={styles.postDesc}>{post.description}</p>
                                <div className={styles.postFooter}>
                                    <span className={styles.metaText}>
                                        {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </span>
                                    <span className={styles.readMore}>Read →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}