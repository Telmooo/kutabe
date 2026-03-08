import { workspace } from "vscode";
import type { DocstringStyle } from "../core/types";

const LANGUAGE_CONFIG: Record<
  string,
  { key: string; fallback: DocstringStyle }
> = {
  python: { key: "kutabe.python.style", fallback: "google" },
  typescript: { key: "kutabe.typescript.style", fallback: "jsdoc" },
  typescriptreact: { key: "kutabe.typescript.style", fallback: "jsdoc" },
  javascript: { key: "kutabe.typescript.style", fallback: "jsdoc" },
  javascriptreact: { key: "kutabe.typescript.style", fallback: "jsdoc" },
  rust: { key: "kutabe.rust.style", fallback: "rustdoc" },
};

export function getStyleForLanguage(languageId: string): DocstringStyle {
  const entry = LANGUAGE_CONFIG[languageId];
  if (!entry) return "google";

  return workspace
    .getConfiguration()
    .get<DocstringStyle>(entry.key, entry.fallback);
}
