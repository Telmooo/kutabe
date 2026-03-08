import * as vscode from "vscode";
import { LanguageRegistry } from "../core/registry";
import { getStyleForLanguage } from "../config/settings";

function resolveInsertion(
  document: vscode.TextDocument,
  symbolStartLine: number,
  rendered: string,
): { position: vscode.Position; text: string } {
  const languageId = document.languageId;

  if (languageId === "python") {
    let signatureEndLine = symbolStartLine;
    for (let i = symbolStartLine; i < document.lineCount; i++) {
      if (document.lineAt(i).text.trimEnd().endsWith(":")) {
        signatureEndLine = i;
        break;
      }
    }
    const position = new vscode.Position(signatureEndLine + 1, 0);
    return { position, text: rendered + "\n" };
  }

  const position = new vscode.Position(symbolStartLine, 0);
  return { position, text: rendered + "\n" };
}

export async function generateDocstring(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const { document, selection } = editor;
  const languageId = document.languageId;
  const registry = LanguageRegistry.getInstance();

  const parser = registry.getParser(languageId);
  if (!parser) {
    vscode.window.showWarningMessage(
      `Kutabe: no parser available for language "${languageId}".`,
    );
    return;
  }

  const renderer = registry.getRenderer(languageId);
  if (!renderer) {
    vscode.window.showWarningMessage(
      `Kutabe: no renderer available for language "${languageId}".`,
    );
    return;
  }

  const source = document.getText();
  const line = selection.active.line;
  const symbol = parser.parseSymbolAtLine(source, line);

  if (!symbol) {
    vscode.window.showInformationMessage(
      "Kutabe: no function or class found at the cursor.",
    );
    return;
  }

  const style = getStyleForLanguage(languageId);
  const rendered = renderer.render(symbol, style);
  const { position, text } = resolveInsertion(
    document,
    symbol.startLine,
    rendered,
  );

  const edit = new vscode.WorkspaceEdit();
  edit.insert(document.uri, position, text);
  await vscode.workspace.applyEdit(edit);
}
