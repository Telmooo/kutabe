import type { Renderer } from "./base";
import type { DocstringStyle, ParsedSymbol } from "../core/types";
import { renderTemplate } from "../core/templateEngine";

export class PythonRenderer implements Renderer {
  readonly styles: DocstringStyle[] = ["google", "numpy", "sphinx"];

  constructor(private readonly extensionRoot: string) {}

  render(symbol: ParsedSymbol, style: DocstringStyle): string {
    return renderTemplate(this.extensionRoot, style, symbol);
  }
}
