import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // ✅ Increased from default 1mb
      allowedOrigins: [
        'localhost:3000',
        '*.devtunnels.ms', // VS Code dev tunnels
        '*.ngrok.io',      // Ngrok
        '*.loca.lt',       // LocalTunnel
      ],
    },
  },
};

export default nextConfig;
