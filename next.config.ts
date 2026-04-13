/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── URL rewrites (proxying to FinVault) ───────────────────
  // No changes made to this section
  async rewrites() {
    return [
      {
        // /finance-calculators → FinVault home
        source: '/finance-calculators',
        destination: 'https://finance-calculator-nine-sandy.vercel.app/',
      },
      {
        // /finance-calculators/gst → /gst on FinVault
        source: '/finance-calculators/:path*',
        destination: 'https://finance-calculator-nine-sandy.vercel.app/:path*',
      },
    ];
  },

  // ── Redirects ─────────────────────────────────────────────
  // Redirect non-www → www for canonical domain consistency.
  // This works together with the `host` in robots.ts to ensure
  // Google always indexes www.forgecodehub.com, never forgecodehub.com
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'forgecodehub.com' }],
        destination: 'https://www.forgecodehub.com/:path*',
        permanent: true, // 301 — tells Google this is the canonical URL permanently
      },
    ];
  },
};

export default nextConfig;