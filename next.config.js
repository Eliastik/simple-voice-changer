/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";
require("dotenv").config({ path: `.env.${isDev ? "dev" : "prod"}` });

const withPWA = require("next-pwa")({
    dest: "public",
    sw: "service-worker.js",
    disable: isDev,
    scope: process.env.NEXT_PUBLIC_BASE_PATH,
    exclude: [
        ({ asset }) => {
            if (
                asset.name.startsWith("server/") ||
        asset.name.startsWith("../../public/worklets/") ||
        asset.name.startsWith("../../public/workers/") ||
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
    publicExcludes: ["!static/sounds/impulse_response_*"]
});

const nextConfig = withPWA({
    output: "export",
    transpilePackages: ["@eliastik/simple-sound-studio-lib", "@eliastik/simple-sound-studio-components"],
    basePath: process.env.NEXT_PUBLIC_BASE_PATH
});

module.exports = nextConfig;
