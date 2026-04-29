"use client";

import { useRouter } from "next/navigation";
import styles from "./blog.module.css";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath: string;
}

function buildHref(basePath: string, page: number) {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | "...")[] = [];
    pages.push(1);
    if (current > 3) pages.push("...");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push("...");
    pages.push(total);

    return pages;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
    const router = useRouter();
    const pages = getPageNumbers(currentPage, totalPages);

    // Use router.push for hard navigation so the server component re-runs
    const navigate = (page: number) => {
        const url = buildHref(basePath, page);
        router.push(url);
        // Scroll to top of page after navigation
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <nav className={styles.pagination} aria-label="Blog pagination">

            {/* Prev */}
            <button
                className={`${styles.pageBtn} ${styles.pageBtnNav} ${currentPage <= 1 ? styles.pageBtnDisabled : ""}`}
                onClick={() => currentPage > 1 && navigate(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label="Previous page"
            >
                ← Prev
            </button>

            {/* Page numbers */}
            <div className={styles.pageNumbers}>
                {pages.map((p, i) =>
                    p === "..." ? (
                        <span key={`ellipsis-${i}`} className={styles.pageEllipsis}>
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            className={`${styles.pageBtn} ${p === currentPage ? styles.pageBtnActive : ""}`}
                            onClick={() => p !== currentPage && navigate(p)}
                            aria-current={p === currentPage ? "page" : undefined}
                            aria-label={`Page ${p}`}
                        >
                            {p}
                        </button>
                    )
                )}
            </div>

            {/* Next */}
            <button
                className={`${styles.pageBtn} ${styles.pageBtnNav} ${currentPage >= totalPages ? styles.pageBtnDisabled : ""}`}
                onClick={() => currentPage < totalPages && navigate(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label="Next page"
            >
                Next →
            </button>

        </nav>
    );
}