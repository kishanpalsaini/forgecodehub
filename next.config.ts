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
      // {
      //   source: '/calculators/:path*',
      //   // destination: 'http://localhost:5173/:path*',
      //   destination: 'https://finance-calculator-nine-sandy.vercel.app/:path*',
      // },
      {
        // /calculators → FinVault home
        source: '/finance-calculators',
        destination: 'https://finance-calculator-nine-sandy.vercel.app/',
      },
      {
        // /calculators/gst → /gst on FinVault
        source: '/finance-calculators/:path*',
        destination: 'https://finance-calculator-nine-sandy.vercel.app/:path*',
      },
    ];
  },
};

export default nextConfig;