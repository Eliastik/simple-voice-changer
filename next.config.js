/** @type {import('next').NextConfig} */
const CopyPlugin = require("copy-webpack-plugin");
const isDev = process.env.NODE_ENV === "development";
const withPWA = require("next-pwa")({
  dest: "public",
  sw: "service-worker.js",
  disable: isDev,
  exclude: [
    // add buildExcludes here
    ({ asset, compilation }) => {
      if (
        asset.name.startsWith("server/") ||
        asset.name.match(
          /^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/
        )
      ) {
        return true;
      }
      if (isDev && !asset.name.startsWith("static/runtime/")) {
        return true;
      }
      return false;
    },
  ],
});

const nextConfig = withPWA({
  output: "export",
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "node_modules/@soundtouchjs/audio-worklet/dist/soundtouch-worklet.js",
            to: "../public/worklets",
          },
        ],
      })
    );

    return config;
  },
});

module.exports = nextConfig;