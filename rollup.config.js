import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import cleanup from "rollup-plugin-cleanup";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import glob from "glob";

const workletFiles = glob.sync(path.join(__dirname, "src/app/lib/filters/worklets/*.worklet.ts"));

const config = workletFiles.map((input) => ({
    input,
    output: [
        {
            file: `public/worklets/${path.basename(input, ".ts")}.js`,
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
}));

export default config;
