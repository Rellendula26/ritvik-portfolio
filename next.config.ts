import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // Dev file-watcher: skip 250MB+ of project videos (major cause of slow `next dev`)
  webpack: (config, { dev }) => {
    if (dev) {
      const ignored = [
        "**/node_modules/**",
        "**/public/projects/**/*.mp4",
        "**/public/projects/**/*.mov",
        "**/public/projects/**/*.MOV",
        "**/public/experiences/**/*.mp4",
        "**/public/experiences/**/*.mov",
        "**/public/experiences/**/*.MOV",
        "**/public/experiences/**/*.HEIC",
        "**/public/experiences/**/*.heic",
        "**/public/presentations/**",
      ];
      config.watchOptions = {
        ...config.watchOptions,
        ignored,
      };
    }
    return config;
  },
};

export default nextConfig;
