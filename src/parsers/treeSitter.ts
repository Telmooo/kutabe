import * as path from "path";
import { Node, Parser } from "web-tree-sitter";

// When bundled by esbuild (platform: node), __dirname resolves to the output
// directory (dist/). WASM files are copied there by the build step.
const WASM_DIR = path.join(__dirname, "wasm");

let initPromise: Promise<void> | null = null;

export function initTreeSitter(): Promise<void> {
  if (!initPromise) {
    initPromise = Parser.init({
      locateFile(scriptName: string) {
        return path.join(WASM_DIR, scriptName);
      },
    });
  }

  return initPromise;
}

export function wasmPath(grammarFile: string): string {
  return path.join(WASM_DIR, grammarFile);
}

export function collectNodes(root: Node, targetTypes: string[]): Node[] {
  const results: Node[] = [];
  const walk = (node: Node): void => {
    if (targetTypes.includes(node.type)) {
      results.push(node);
    }
    for (const child of node.namedChildren) {
      walk(child);
    }
  };
  walk(root);
  return results;
}

export function findEnclosingNode(
  root: Node,
  line: number,
  targetTypes: string[],
): Node | null {
  // Use a large column to land on actual code, not leading whitespace.
  // This ensures indented symbols (e.g. methods inside class/impl) are found.
  let node: Node | null = root.descendantForPosition({
    row: line,
    column: 256,
  });

  while (node) {
    if (targetTypes.includes(node.type)) {
      return node;
    }

    node = node.parent;
  }

  return null;
}
