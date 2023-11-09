/** @type {import('next').NextConfig} */
const CopyPlugin = require("copy-webpack-plugin");

const nextConfig = {
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
};

module.exports = nextConfig;