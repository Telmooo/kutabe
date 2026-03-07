import * as fs from "fs";
import * as path from "path";
import Handlebars from "handlebars";
import type { DocstringStyle, ParsedSymbol } from "./types";

type CompiledTemplate = Handlebars.TemplateDelegate;

const cache = new Map<string, CompiledTemplate>();

function registerHelpers(): void {
  // {{eq a b}} - equality check for use in {{#if (eq style "google")}}
  Handlebars.registerHelper("eq", (a: unknown, b: unknown) => a === b);
}

function loadTemplate(
  extensionRoot: string,
  style: DocstringStyle,
): CompiledTemplate {
  if (cache.has(style)) {
    return cache.get(style)!;
  }

  const [lang, name] = styleToPath(style);
  const filePath = path.join(extensionRoot, "templates", lang, `${name}.hbs`);
  const source = fs.readFileSync(filePath, "utf8");
  const compiled = Handlebars.compile(source, { noEscape: true });
  cache.set(style, compiled);
  return compiled;
}

function styleToPath(style: DocstringStyle): [string, string] {
  switch (style) {
    case "google":
    case "numpy":
    case "sphinx":
      return ["python", style];
    case "jsdoc":
    case "tsdoc":
      return ["typescript", style];
    case "rustdoc":
      return ["rust", style];
  }
}

export function renderTemplate(
  extensionRoot: string,
  style: DocstringStyle,
  symbol: ParsedSymbol,
): string {
  registerHelpers();
  const template = loadTemplate(extensionRoot, style);
  const context = buildContext(symbol);
  const rendered = template(context);
  return indentBlock(rendered.trimEnd(), symbol.indentation);
}

interface TemplateContext {
  name: string;
  kind: string;
  params: Array<{ name: string; type?: string | undefined; hasType: boolean }>;
  hasParams: boolean;
  returnType?: string | undefined;
  hasReturn: boolean;
}

function buildContext(symbol: ParsedSymbol): TemplateContext {
  const params = symbol.params.map((p) => ({
    name: p.name,
    type: p.type,
    hasType: !!p.type,
  }));

  return {
    name: symbol.name,
    kind: symbol.kind,
    params,
    hasParams: params.length > 0,
    returnType: symbol.returnType,
    hasReturn:
      !!symbol.returnType &&
      symbol.returnType !== "None" &&
      symbol.returnType !== "()",
  };
}

function indentBlock(text: string, indentation: string): string {
  return text
    .split("\n")
    .map((line) => (line.trim() === "" ? "" : indentation + line))
    .join("\n");
}
