import { Language, Node, Parser } from "web-tree-sitter";
import type { Parser as IParser } from "./base";
import {
  collectNodes,
  findEnclosingNode,
  initTreeSitter,
  wasmPath,
} from "./treeSitter";
import { Param, ParsedSymbol } from "../core/types";

const SYMBOL_TYPES = [
  "function_declaration",
  "method_definition",
  "arrow_function",
  "function",
];

export class TypeScriptParser implements IParser {
  readonly languages = [
    "javascript",
    "typescript",
    "typescriptreact",
    "javascriptreact",
  ];
  private parsers = new Map<string, Parser>();

  async init(): Promise<void> {
    if (this.parsers.size > 0) return;

    await initTreeSitter();

    const tsLanguage = await Language.load(
      wasmPath("tree-sitter-typescript.wasm"),
    );
    const tsParser = new Parser();
    tsParser.setLanguage(tsLanguage);
    this.parsers.set("typescript", tsParser);
    this.parsers.set("typescriptreact", tsParser);

    const jsLanguage = await Language.load(
      wasmPath("tree-sitter-javascript.wasm"),
    );
    const jsParser = new Parser();
    jsParser.setLanguage(jsLanguage);
    this.parsers.set("javascript", jsParser);
    this.parsers.set("javascriptreact", jsParser);
  }

  parseSymbolAtLine(
    source: string,
    line: number,
    languageId?: string,
  ): ParsedSymbol | null {
    const parser = this.parsers.get(languageId ?? "typescript");
    if (!parser) return null;

    const tree = parser.parse(source);
    if (!tree) return null;
    const node = findEnclosingNode(tree.rootNode, line, SYMBOL_TYPES);
    if (!node) return null;

    return extractSymbol(node, source);
  }

  parseAllSymbols(source: string, languageId?: string): ParsedSymbol[] {
    const parser = this.parsers.get(languageId ?? "typescript");
    if (!parser) return [];

    const tree = parser.parse(source);
    if (!tree) return [];

    return collectNodes(tree.rootNode, SYMBOL_TYPES).map((n) =>
      extractSymbol(n, source),
    );
  }
}

function extractSymbol(node: Node, source: string): ParsedSymbol {
  const kind = node.type === "method_definition" ? "method" : "function";
  const name = resolveName(node);
  const params = extractParams(node);
  const returnType = extractReturnType(node);

  const startLine = node.startPosition.row;
  const sourceLine = source.split("\n")[startLine] ?? "";
  const indentation = sourceLine.match(/^(\s*)/)?.[1] ?? "";

  return {
    kind,
    name,
    params,
    returnType,
    startLine,
    indentation,
  };
}

function resolveName(node: Node): string {
  const nodeName = node.childForFieldName("name");
  if (nodeName) return nodeName.text;

  // Arrow function assigned to a variable (e.g. `const foo = () => {}`)
  if (
    node.type === "arrow_function" &&
    node.parent?.type === "variable_declarator"
  ) {
    return node.parent.childForFieldName("name")?.text ?? "";
  }

  return "";
}

function extractParams(node: Node): Param[] {
  const paramsNode = node.childForFieldName("parameters");
  if (!paramsNode) return [];

  const params: Param[] = [];
  for (const child of paramsNode.namedChildren) {
    const param = extractParam(child);
    if (param) {
      params.push(param);
    }
  }

  return params;
}

function extractParam(node: Node): Param | null {
  switch (node.type) {
    case "required_parameter":
    case "optional_parameter": {
      const name = node.childForFieldName("pattern")?.text ?? node.text;
      const typeAnnotation = node.childForFieldName("type");
      const type = typeAnnotation?.namedChildren[0]?.text;
      const value = node.childForFieldName("value")?.text;

      return { name, type, defaultValue: value };
    }

    case "rest_parameter": {
      const name = node.childForFieldName("pattern")?.text ?? node.text;
      const typeAnnotation = node.childForFieldName("type");
      const type = typeAnnotation?.namedChildren[0]?.text;

      return { name: `...${name}`, type };
    }

    case "identifier":
      return { name: node.text };

    case "assignment_pattern": {
      const name = node.childForFieldName("left")?.text ?? node.text;
      const value = node.childForFieldName("right")?.text;
      return { name, defaultValue: value };
    }

    default:
      return null;
  }
}

function extractReturnType(node: Node): string | undefined {
  const returnTypeNode = node.childForFieldName("return_type");
  if (!returnTypeNode) return undefined;

  return returnTypeNode.namedChildren[0]?.text;
}
