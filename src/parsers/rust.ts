import { Language, Node, Parser } from "web-tree-sitter";
import type { Parser as IParser } from "./base";
import {
  collectNodes,
  findEnclosingNode,
  initTreeSitter,
  wasmPath,
} from "./treeSitter";
import { Param, ParsedSymbol } from "../core/types";

const SYMBOL_TYPES = ["function_item", "function_signature_item"];
const SELF_PARAMS = new Set(["self", "&self", "&mut self"]);

export class RustParser implements IParser {
  readonly languages = ["rust"];
  private parser: Parser | null = null;

  async init(): Promise<void> {
    if (this.parser) return;

    await initTreeSitter();
    const language = await Language.load(wasmPath("tree-sitter-rust.wasm"));
    this.parser = new Parser();
    this.parser.setLanguage(language);
  }

  parseSymbolAtLine(source: string, line: number): ParsedSymbol | null {
    if (!this.parser) return null;

    const tree = this.parser.parse(source);
    if (!tree) return null;
    const node = findEnclosingNode(tree.rootNode, line, SYMBOL_TYPES);
    if (!node) return null;
    return extractSymbol(node);
  }

  parseAllSymbols(source: string): ParsedSymbol[] {
    if (!this.parser) return [];

    const tree = this.parser.parse(source);
    if (!tree) return [];

    return collectNodes(tree.rootNode, SYMBOL_TYPES).map(extractSymbol);
  }
}

function extractSymbol(node: Node): ParsedSymbol {
  const name = node.childForFieldName("name")?.text ?? "";
  const isMethod = hasImplParent(node);
  const params = extractParams(node);
  const returnType = node.childForFieldName("return_type")?.text;

  const startLine = node.startPosition.row;
  const indentation = " ".repeat(node.startPosition.column);

  return {
    kind: isMethod ? "method" : "function",
    name,
    params,
    returnType,
    startLine,
    indentation,
  };
}

function hasImplParent(node: Node): boolean {
  let current = node.parent;
  while (current) {
    if (current.type === "impl_item") return true;
    current = current.parent;
  }
  return false;
}

function extractParams(node: Node): Param[] {
  const paramsNode = node.childForFieldName("parameters");
  if (!paramsNode) return [];

  const params: Param[] = [];
  for (const child of paramsNode.namedChildren) {
    if (child.type === "self_parameter") continue;
    if (SELF_PARAMS.has(child.text)) continue;

    if (child.type === "parameter") {
      const name = child.childForFieldName("pattern")?.text ?? "";
      const type = child.childForFieldName("type")?.text;
      params.push({ name, type });
    }
  }

  return params;
}
