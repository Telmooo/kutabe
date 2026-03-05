export type DocstringStyle =
  | "google"
  | "numpy"
  | "sphinx"
  | "jsdoc"
  | "tsdoc"
  | "rustdoc";

export type SymbolKind = "function" | "method" | "class";

export interface Param {
  name: string;
  type?: string;
  defaultValue?: string;
}

export interface ParsedSymbol {
  kind: SymbolKind;
  name: string;
  params: Param[];
  returnType?: string;
  /** Zero-based line number where the symbol starts */
  startLine: number;
  /** Leading whitespace of the symbol's line */
  indentation: string;
}
