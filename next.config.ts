import type { NextConfig } from "next";
import { SERVER_ENVIRONMENT } from "./environments/server.environment";

const nextConfig: NextConfig = {
  experimental: {
    middlewareClientMaxBodySize: "50mb",
  },
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
