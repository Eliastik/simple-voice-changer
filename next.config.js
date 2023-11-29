/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";
require("dotenv").config({ path: `.env.${isDev ? "dev" : "prod"}` });
const CopyPlugin = require("copy-webpack-plugin");
const typescript = require("typescript");

const withPWA = require("next-pwa")({
    dest: "public",
    sw: "service-worker.js",
    disable: isDev,
    scope: process.env.BASE_PATH,
    exclude: [
        ({ asset, compilation }) => {
            if (
                asset.name.startsWith("server/") ||
        asset.name.startsWith("../public/worklets/") ||
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

const generateWorkletCopyConfig = (workletFileName) => ({
    from: `src/app/classes/filters/worklets/${workletFileName}.worklet.ts`,
    to: `../public/worklets/${workletFileName}.worklet.js`,
    context: "./",
    transform(content, from) {
        const compiled = typescript.transpileModule(content.toString(), {
            compilerOptions: {
                target: "es6",
                module: "es6",
            },
        });

        return compiled.outputText;
    },
});

const nextConfig = withPWA({
    output: "export",
    basePath: process.env.BASE_PATH,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.module.rules.push({
            test: /\.worklet.ts$/,
            loader: "ts-loader",
            exclude: /node_modules/,
        });

        // List of worklets to build
        const worklets = [
            "BitCrusher",
            "Limiter"
        ];

        config.plugins.push(
            new CopyPlugin({
                patterns: [
                    {
                        from: "node_modules/@eliastik/soundtouchjs-audio-worklet/dist/scheduled-soundtouch-worklet.js",
                        to: "../public/worklets",
                    },
                    ...worklets.map((worklet) => generateWorkletCopyConfig(worklet))
                ],
            })
        );

        return config;
    },
});

module.exports = nextConfig;