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
  type?: string | undefined;
  defaultValue?: string | undefined;
}

export interface ParsedSymbol {
  kind: SymbolKind;
  name: string;
  params: Param[];
  returnType?: string | undefined;
  /** Zero-based line number where the symbol starts */
  startLine: number;
  /** Leading whitespace of the symbol's line */
  indentation: string;
}
