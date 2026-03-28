// import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
// const nextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: '/calculators/:path*',
//         destination: 'https://finance-calculator-nine-sandy.vercel.app/:path*',
//       },
//     ];
//   },
// };

// export default nextConfig;


const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/calculators/:path*',
        destination: process.env.NODE_ENV === 'development'
          ? 'http://localhost:5173/:path*'   // ✅ Vite default port
          : 'https://finance-calculator-nine-sandy.vercel.app/:path*',
      },
    ];
  },
};

export default nextConfig;