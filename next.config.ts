import type { NextConfig } from "next";
import { SERVER_ENVIRONMENT } from "./environments/server.environment";

const nextConfig: NextConfig = {
  /* config options here */
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "**",
  //     },
  //     {
  //       protocol: "http",
  //       hostname: "**",
  //     },
  //   ],
  // },
  // allowedDevOrigins: ["*"],
  env: {
    ...SERVER_ENVIRONMENT,
  },
  async rewrites() {
    return [
      {
        source: `/uploads/:path*`,
        destination: `${SERVER_ENVIRONMENT.NEXT_PUBLIC_SITE_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
