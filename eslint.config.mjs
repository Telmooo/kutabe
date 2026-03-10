import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig(
  // Eslint recommended
  eslint.configs.recommended,

  // Typescript recommended
  tseslint.configs.recommended,

  // Node.js CJS build scripts
  {
    files: ["esbuild.js"],
    languageOptions: {
      globals: {
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        process: "readonly",
        console: "readonly",
      },
      sourceType: "commonjs",
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // Global ignore
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".yarn/**",
      ".pnp.cjs",
      ".pnp.loader.mjs",
      "out/**",
      ".vscode-test/**",
      "test-workspace/**",
    ],
  },
);
