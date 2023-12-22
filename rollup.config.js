import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import cleanup from "rollup-plugin-cleanup";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

const config = [
    {
        input: path.join(__dirname, "src/app/lib/filters/worklets/BitCrusher.worklet.ts"),
        output: [
            {
                file: "public/worklets/BitCrusher.worklet.js",
                format: "esm",
                sourcemap: false,
                exports: "named",
            },
        ],
        plugins: [
            resolve({
                browser: true,
            }),
            typescript(),
            terser(),
            cleanup(),
        ],
    },
    {
        input: path.join(__dirname, "src/app/lib/filters/worklets/Limiter.worklet.ts"),
        output: [
            {
                file: "public/worklets/Limiter.worklet.js",
                format: "esm",
                sourcemap: false,
                exports: "named",
            },
        ],
        plugins: [
            resolve({
                browser: true,
            }),
            typescript(),
            terser(),
            cleanup(),
        ],
    },
    {
        input: path.join(__dirname, "src/app/lib/filters/worklets/Soundtouch.worklet.ts"),
        output: [
            {
                file: "public/worklets/Soundtouch.worklet.js",
                format: "esm",
                sourcemap: false,
                exports: "named",
            },
        ],
        plugins: [
            resolve({
                browser: true,
            }),
            typescript(),
            terser(),
            cleanup(),
        ],
    },
];

export default config;
