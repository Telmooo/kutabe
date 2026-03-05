import type { DocstringStyle, ParsedSymbol } from "../core/types";

export interface Renderer {
  readonly styles: DocstringStyle[];

  render(symbol: ParsedSymbol, style: DocstringStyle): string;
}
