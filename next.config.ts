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
        source: `/storage/:path*`,
        destination: `${SERVER_ENVIRONMENT.NEXT_PUBLIC_SUPABASE_URL}/storage/:path*`,
      },
    ];
  },
};

export default nextConfig;
