import * as vscode from "vscode";
import { LanguageRegistry } from "../core/registry";

const SUPPORTED_LANGUAGES = new Set([
  "python",
  "typescript",
  "typescriptreact",
  "javascript",
  "javascriptreact",
  "rust",
]);

function hasDocstringAbove(
  document: vscode.TextDocument,
  line: number,
): boolean {
  if (line === 0) return false;
  const above = document.lineAt(line - 1).text.trim();
  return (
    above.startsWith("*/") || // end of /** */ block
    above.startsWith("///") || // Rust docstring line
    above.startsWith('"""') || // Python docstring
    above.startsWith("'''")
  );
}

function hasPythonDocstring(
  document: vscode.TextDocument,
  symbolLine: number,
): boolean {
  for (
    let i = symbolLine;
    i < Math.min(symbolLine + 20, document.lineCount);
    i++
  ) {
    const text = document.lineAt(i).text;
    if (text.trimEnd().endsWith(":")) {
      for (let j = i + 1; j < Math.min(i + 3, document.lineCount); j++) {
        const inner = document.lineAt(j).text.trim();
        if (inner.length === 0) continue;
        return inner.startsWith('"""') || inner.startsWith("'''");
      }
      return false;
    }
  }
  return false;
}

export class KutabeCodeLensProvider implements vscode.CodeLensProvider {
  private readonly onDidChangeCodeLensesEmitter =
    new vscode.EventEmitter<void>();
  readonly onDidChangeCodeLenses = this.onDidChangeCodeLensesEmitter.event;

  refresh(): void {
    this.onDidChangeCodeLensesEmitter.fire();
  }

  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    if (!SUPPORTED_LANGUAGES.has(document.languageId)) return [];

    const registry = LanguageRegistry.getInstance();
    const parser = registry.getParser(document.languageId);
    if (!parser) return [];

    const source = document.getText();
    const symbols = parser.parseAllSymbols(source);
    const isPython = document.languageId === "python";

    return symbols
      .filter((symbol) => {
        if (isPython) {
          return !hasPythonDocstring(document, symbol.startLine);
        }

        return !hasDocstringAbove(document, symbol.startLine);
      })
      .map((symbol) => {
        const range = new vscode.Range(
          symbol.startLine,
          0,
          symbol.startLine,
          0,
        );
        return new vscode.CodeLens(range, {
          title: "$(pencil) Generate Docstring",
          command: "kutabe.generateDocstring",
          tooltip: `Generate docstring for ${symbol.kind} "${symbol.name}"`,
          arguments: [symbol.startLine],
        });
      });
  }
}
