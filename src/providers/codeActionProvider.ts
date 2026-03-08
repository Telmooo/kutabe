import * as vscode from "vscode";
import { LanguageRegistry } from "../core/registry";

export class KutabeCodeActionProvider implements vscode.CodeActionProvider {
  static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
  ): vscode.CodeAction[] {
    const registry = LanguageRegistry.getInstance();
    const parser = registry.getParser(document.languageId);
    if (!parser) return [];

    const source = document.getText();
    const symbol = parser.parseSymbolAtLine(source, range.start.line);
    if (!symbol) return [];

    const action = new vscode.CodeAction(
      `Generate docstring for ${symbol.kind} "${symbol.name}"`,
      vscode.CodeActionKind.QuickFix,
    );
    action.command = {
      command: "kutabe.generateDocstring",
      title: "Generate Docstring",
    };
    action.isPreferred = true;

    return [action];
  }
}
