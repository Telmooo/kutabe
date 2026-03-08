const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");
const copyWasmOnly = process.argv.includes("--copy-wasm-only");

const WASM_SOURCES = [
  "node_modules/web-tree-sitter/web-tree-sitter.wasm",
  "node_modules/tree-sitter-python/tree-sitter-python.wasm",
  "node_modules/tree-sitter-javascript/tree-sitter-javascript.wasm",
  "node_modules/tree-sitter-typescript/tree-sitter-typescript.wasm",
  "node_modules/tree-sitter-rust/tree-sitter-rust.wasm",
];

function copyWasmFiles() {
  const outDir = path.join(__dirname, "dist", "wasm");
  fs.mkdirSync(outDir, { recursive: true });
  for (const src of WASM_SOURCES) {
    const fullSrc = path.join(__dirname, src);
    if (!fs.existsSync(fullSrc)) {
      console.warn(`⚠ WASM file not found: ${src}`);
      continue;
    }
    const dest = path.join(outDir, path.basename(src));
    fs.copyFileSync(fullSrc, dest);
  }
  console.log("[wasm] copied to dist/wasm/");
}

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: "esbuild-problem-matcher",

  setup(build) {
    build.onStart(() => {
      console.log("[watch] build started");
    });
    build.onEnd((result) => {
      result.errors.forEach(({ text, location }) => {
        console.error(`✘ [ERROR] ${text}`);
        console.error(
          `    ${location.file}:${location.line}:${location.column}:`,
        );
      });
      console.log("[watch] build finished");
    });
  },
};

async function main() {
  copyWasmFiles();
  if (copyWasmOnly) {
    return;
  }
  const ctx = await esbuild.context({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    format: "cjs",
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: "node",
    outfile: "dist/extension.js",
    external: ["vscode"],
    logLevel: "silent",
    plugins: [
      /* add to the end of plugins array */
      esbuildProblemMatcherPlugin,
    ],
  });
  if (watch) {
    await ctx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
