import type { ParsedSymbol } from "../core/types";

export interface Parser {
  readonly languages: string[];

  init(): Promise<void>;

  parseSymbolAtLine(source: string, line: number): ParsedSymbol | null;
}
