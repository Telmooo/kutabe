import * as path from "path";
import { Node, Parser } from "web-tree-sitter";

const WASM_DIR = "dist/wasm";

let initPromise: Promise<void> | null = null;

export function initTreeSitter(extensionRoot: string): Promise<void> {
  if (!initPromise) {
    const wasmDir = path.join(extensionRoot, WASM_DIR);
    initPromise = Parser.init({
      locateFile(scriptName: string) {
        return path.join(wasmDir, scriptName);
      },
    });
  }

  return initPromise;
}

export function wasmPath(extensionRoot: string, grammarFile: string): string {
  return path.join(extensionRoot, WASM_DIR, grammarFile);
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
