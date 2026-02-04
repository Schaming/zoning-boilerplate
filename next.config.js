import { withPayload } from '@payloadcms/next/withPayload';

import redirects from './redirects.js';

const NEXT_PUBLIC_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : '');

const PUBLIC_ASSET_BASE_URL = process.env.PUBLIC_ASSET_BASE_URL || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'denqgjkbvtaecqkbixjj.storage.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.storage.supabase.co',
      },
      ...[NEXT_PUBLIC_SERVER_URL, PUBLIC_ASSET_BASE_URL]
        .filter(Boolean)
        .map((item) => {
          try {
            const url = new URL(item)
            return {
              hostname: url.hostname,
              protocol: url.protocol.replace(':', ''),
              ...(url.port ? { port: url.port } : {}),
              pathname: '/**',
            }
          } catch (_e) {
            return null
          }
        })
        .filter(Boolean),
    ],
    formats: ['image/avif', 'image/webp'],
  },
  webpack: webpackConfig => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    };

    return webpackConfig;
  },
  reactStrictMode: true,
  redirects,
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
