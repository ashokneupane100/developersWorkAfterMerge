/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: [
      'edprxvdtxhpeoxztcmon.supabase.co',
      'img.clerk.com',
      'onlinehome.com.np',
    ],
  },
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    
    config.output = {
      ...config.output,
      chunkLoadTimeout: 60000,
    };

    return config;
  },
};

export default nextConfig;