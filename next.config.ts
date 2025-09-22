import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.gbif.org" },
      { protocol: "https", hostname: "api.gbif.org" },
      { protocol: "https", hostname: "images.gbif.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "**.wikimedia.org" },
    ],
  },
};

export default nextConfig;
