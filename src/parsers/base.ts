import type { ParsedSymbol } from "../core/types";

export interface Parser {
  readonly languages: string[];

  init(extensionRoot: string): Promise<void>;

  parseSymbolAtLine(source: string, line: number): ParsedSymbol | null;
}
