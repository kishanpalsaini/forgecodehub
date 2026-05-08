import Link from "next/link";
import styles from "./blog.module.css";
import type { Metadata } from "next";
import { getAllPosts } from "../.../../../lib/supabase-blog";
import { Pagination } from "../components/Pagination";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

const POSTS_PER_PAGE = 9;

const CATEGORY_COLORS: Record<string, string> = {
    Finance: "#f97316",
    Developer: "#0ea5e9",
    Media: "#8b5cf6",
    Productivity: "#10b981",
    General: "#6366f1",
    Tools: "#0ea5e9",
};

function getCategoryColor(category: string) {
    return CATEGORY_COLORS[category] ?? "#6366f1";
}

function getCategories(posts: Awaited<ReturnType<typeof getAllPosts>>) {
    const cats = Array.from(new Set(posts.map((p) => p.category)));
    return ["All", ...cats];
}

interface BlogPageProps {
    searchParams: Promise<{ page?: string; query?: string }> | { page?: string; query?: string };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const params = await Promise.resolve(searchParams);
    const rawPage = params?.page;
    const query = (params?.query ?? "").toLowerCase().trim();
    const currentPage = Math.max(1, parseInt(rawPage ?? "1", 10));

    const posts = await getAllPosts();

    // ── Filter posts by search query ──────────────────────────
    const filteredPosts = query
        ? posts.filter(
              (p) =>
                  p.title.toLowerCase().includes(query) ||
                  p.excerpt?.toLowerCase().includes(query) ||
                  p.category.toLowerCase().includes(query) ||
                  p.seo_description?.toLowerCase().includes(query)
          )
        : posts;
    // ─────────────────────────────────────────────────────────

    const featured = query ? null : (filteredPosts[0] ?? null);
    const allRestPosts = query ? filteredPosts : filteredPosts.slice(1);
    const totalRestPosts = allRestPosts.length;
    const totalPages = Math.max(1, Math.ceil(totalRestPosts / POSTS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);

    const startIndex = (safePage - 1) * POSTS_PER_PAGE;
    const rest = allRestPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    const categories = getCategories(posts); // always from full posts list

    return (
        <main className={styles.page}>

            {/* ── Hero ── */}
            <section className={styles.hero}>
                <div className={styles.heroBadge}>The Blog</div>
                <h1 className={styles.heroTitle}>Guides & tutorials</h1>
                <p className={styles.heroSub}>
                    Simple explanations for every tool — from EMI calculators to JSON
                    formatters. Learn how to use free tools for finance, productivity,
                    and development.
                </p>

                {/* ── Search bar ── */}
                <form action="/blog" method="GET" className={styles.searchForm}>
                    <input
                        type="text"
                        name="query"
                        defaultValue={query}
                        placeholder="Search posts..."
                        className={styles.searchInput}
                        autoComplete="off"
                    />
                    <button type="submit" className={styles.searchBtn}>
                        Search
                    </button>
                </form>

                {/* ── Search result count ── */}
                {query && (
                    <p className={styles.searchResultInfo}>
                        {filteredPosts.length === 0
                            ? `No results for "${query}"`
                            : `${filteredPosts.length} result${filteredPosts.length !== 1 ? "s" : ""} for "${query}"`}
                    </p>
                )}

                <div className={styles.filterRow}>
                    {categories.map((cat) => (
                        <span
                            key={cat}
                            className={`${styles.filterPill} ${cat === "All" ? styles.filterPillActive : ""}`}
                            style={
                                cat !== "All" && cat in CATEGORY_COLORS
                                    ? ({ "--cat-color": getCategoryColor(cat) } as React.CSSProperties)
                                    : undefined
                            }
                        >
                            {cat}
                        </span>
                    ))}
                </div>
            </section>

            {/* ── Featured post — only on page 1, not during search ── */}
            {featured && safePage === 1 && (
                <section className={styles.featuredWrap}>
                    <div className={styles.sectionLabel}>
                        <span className={styles.sectionLabelDot} />
                        Latest post
                    </div>

                    <Link href={`/blog/${featured.slug}`} className={styles.featuredCard}>
                        <div className={styles.featuredInner}>
                            {featured.cover_image && (
                                <div className={styles.featuredCoverWrap}>
                                    <img src={featured.cover_image} alt={featured.title} className={styles.featuredCover} />
                                </div>
                            )}
                            <div className={styles.featuredContent}>
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
                                            day: "numeric", month: "long", year: "numeric",
                                        })}
                                    </span>
                                </div>
                                <h2 className={styles.featuredTitle}>{featured.title}</h2>
                                <p className={styles.featuredDesc}>
                                    {featured.excerpt ?? featured.seo_description ?? ""}
                                </p>
                                <div className={styles.featuredFooter}>
                                    <div className={styles.authorMini}>
                                        <div className={styles.authorAvatar}>F</div>
                                        <span className={styles.authorName}>ForgeCodeHub</span>
                                    </div>
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
                    <div className={styles.sectionLabel}>
                        <span className={styles.sectionLabelDot} style={{ background: "rgba(255,255,255,0.2)" }} />
                        {query ? `Results` : `All posts`}
                        <span className={styles.postCount}>{totalRestPosts}</span>
                    </div>

                    <div className={styles.grid}>
                        {rest.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.postCard}>
                                {post.cover_image && (
                                    <div className={styles.cardCoverWrap}>
                                        <img src={post.cover_image} alt={post.title} className={styles.cardCover} />
                                    </div>
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
                                            day: "numeric", month: "short", year: "numeric",
                                        })}
                                    </span>
                                    <span className={styles.readMore}>Read →</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* ── Pagination ── */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={safePage}
                            totalPages={totalPages}
                            basePath={query ? `/blog?query=${encodeURIComponent(query)}` : "/blog"}
                        />
                    )}
                </section>
            )}

            {/* ── Empty state ── */}
            {posts.length === 0 && (
                <section className={styles.emptyState}>
                    <div className={styles.emptyIcon}>✦</div>
                    <p className={styles.emptyTitle}>No posts published yet</p>
                    <p className={styles.emptyDesc}>Check back soon — guides are on the way.</p>
                </section>
            )}

            {/* ── No search results state ── */}
            {query && filteredPosts.length === 0 && (
                <section className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🔍</div>
                    <p className={styles.emptyTitle}>No results found</p>
                    <p className={styles.emptyDesc}>
                        Try a different keyword, or{" "}
                        <Link href="/blog" className={styles.clearSearch}>
                            clear the search
                        </Link>
                        .
                    </p>
                </section>
            )}

            {/* ── Subscribe strip ── */}
            <section className={styles.subscribeStrip}>
                <div className={styles.subscribeInner}>
                    <div>
                        <p className={styles.subscribeTitle}>Stay in the loop</p>
                        <p className={styles.subscribeSub}>New tools and guides, straight to your inbox.</p>
                    </div>
                    <Link href="/" className={styles.subscribeBtn}>
                        Explore free tools →
                    </Link>
                </div>
            </section>

        </main>
    );
}