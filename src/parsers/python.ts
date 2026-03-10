import { Language, Node, Parser } from "web-tree-sitter";
import type { Parser as IParser } from "./base";
import {
  collectNodes,
  findEnclosingNode,
  initTreeSitter,
  wasmPath,
} from "./treeSitter";
import { Param, ParsedSymbol } from "../core/types";

const SYMBOL_TYPES = ["function_definition", "class_definition"];
const SKIP_PARAMS = new Set(["self", "cls"]);

export class PythonParser implements IParser {
  readonly languages = ["python"];
  private parser: Parser | null = null;

  async init(): Promise<void> {
    if (this.parser) return;

    await initTreeSitter();
    const language = await Language.load(wasmPath("tree-sitter-python.wasm"));
    this.parser = new Parser();
    this.parser.setLanguage(language);
  }

  parseSymbolAtLine(source: string, line: number): ParsedSymbol | null {
    if (!this.parser) return null;

    const tree = this.parser.parse(source);
    if (!tree) return null;
    const node = findEnclosingNode(tree.rootNode, line, SYMBOL_TYPES, source);
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
  const isClass = node.type === "class_definition";

  const params: Param[] = [];
  if (!isClass) {
    const paramsNode = node.childForFieldName("parameters");
    if (paramsNode) {
      for (const child of paramsNode.namedChildren) {
        const param = extractParameter(child);
        if (param && !SKIP_PARAMS.has(param.name)) {
          params.push(param);
        }
      }
    }
  }

  const returnType = isClass
    ? undefined
    : node.childForFieldName("return_type")?.text;
  const startLine = node.startPosition.row;
  const indentation = " ".repeat(node.startPosition.column + 4);

  return {
    kind: isClass
      ? "class"
      : hasAncestor(node, "class_definition")
        ? "method"
        : "function",
    name,
    params,
    returnType,
    startLine,
    indentation,
  };
}

function hasAncestor(node: Node, type: string): boolean {
  let current = node.parent;
  while (current) {
    if (current.type === type) return true;
    current = current.parent;
  }
  return false;
}

function extractParameter(node: Node): Param | null {
  switch (node.type) {
    case "identifier":
      return { name: node.text };

    case "typed_parameter": {
      const name = node.children[0]?.text ?? "";
      const type = node.childForFieldName("type")?.text;
      return { name, type };
    }

    case "default_parameter": {
      const name = node.childForFieldName("name")?.text ?? "";
      const value = node.childForFieldName("value")?.text;
      return { name, defaultValue: value };
    }

    case "typed_default_parameter": {
      const name = node.childForFieldName("name")?.text ?? "";
      const type = node.childForFieldName("type")?.text;
      const value = node.childForFieldName("value")?.text;
      return { name, type, defaultValue: value };
    }

    case "list_splat_pattern":
    case "dictionary_splat_pattern":
      return { name: `${node.text}` };

    default:
      return null;
  }
}
