/** @type {import('next').NextConfig} */
const CopyPlugin = require("copy-webpack-plugin");
const withPWA = require("next-pwa")({
  dest: "public",
  sw: "service-worker.js",
  disable: process.env.NODE_ENV === "development"
});

const nextConfig = withPWA({
  output: "export",
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "node_modules/@soundtouchjs/audio-worklet/dist/soundtouch-worklet.js",
            to: "public/worklets",
          },
        ],
      })
    );

    return config;
  },
});

module.exports = nextConfig;