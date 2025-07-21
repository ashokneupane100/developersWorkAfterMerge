/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["@heroicons/react", "lucide-react"],
  },

  // Optimize images
  images: {
    unoptimized: true,
    domains: [
      "edprxvdtxhpeoxztcmon.supabase.co",
      "img.clerk.com",
      "onlinehome.com.np",
    ],
    // Add image optimization
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },

  // Optimize webpack configuration
  webpack: (config, { dev, isServer }) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    config.output = {
      ...config.output,
      chunkLoadTimeout: 60000,
    };

    // Add module resolution fallbacks
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Handle potential undefined module issues
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Optimize bundle splitting
    if (!isServer && !dev) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            enforce: true,
          },
        },
      };
    }

    return config;
  },

  // Add compression
  compress: true,

  // Optimize bundle analyzer
  ...(process.env.ANALYZE === "true" && {
    webpack: (config) => {
      const { BundleAnalyzerPlugin } = require("@next/bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: false,
        })
      );
      return config;
    },
  }),
};

export default nextConfig;
