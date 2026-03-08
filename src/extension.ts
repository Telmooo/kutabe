import * as vscode from "vscode";
import { LanguageRegistry } from "./core/registry";
import { PythonParser } from "./parsers/python";
import { TypeScriptParser } from "./parsers/typescript";
import { RustParser } from "./parsers/rust";
import { PythonRenderer } from "./renderers/python";
import { TypeScriptRenderer } from "./renderers/typescript";
import { RustRenderer } from "./renderers/rust";
import { generateDocstring } from "./commands/generateDocstring";
import { KutabeCodeLensProvider } from "./providers/codeLensProvider";
import { KutabeCodeActionProvider } from "./providers/codeActionProvider";

const DOCUMENT_SELECTOR: vscode.DocumentSelector = [
  { language: "python" },
  { language: "typescript" },
  { language: "typescriptreact" },
  { language: "javascript" },
  { language: "javascriptreact" },
  { language: "rust" },
];

export async function activate(
  context: vscode.ExtensionContext,
): Promise<void> {
  const extensionRoot = context.extensionUri.fsPath;
  const registry = LanguageRegistry.getInstance();

  const pythonParser = new PythonParser();
  const tsParser = new TypeScriptParser();
  const rustParser = new RustParser();

  await Promise.all([pythonParser.init(), tsParser.init(), rustParser.init()]);

  registry.registerParser(pythonParser);
  registry.registerParser(tsParser);
  registry.registerParser(rustParser);

  const pythonRenderer = new PythonRenderer(extensionRoot);
  const tsRenderer = new TypeScriptRenderer(extensionRoot);
  const rustRenderer = new RustRenderer(extensionRoot);

  for (const lang of pythonParser.languages) {
    registry.registerRenderer(lang, pythonRenderer);
  }
  for (const lang of tsParser.languages) {
    registry.registerRenderer(lang, tsRenderer);
  }
  for (const lang of rustParser.languages) {
    registry.registerRenderer(lang, rustRenderer);
  }

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "kutabe.generateDocstring",
      generateDocstring,
    ),
  );

  const codeLensProvider = new KutabeCodeLensProvider();

  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      DOCUMENT_SELECTOR,
      codeLensProvider,
    ),
    vscode.languages.registerCodeActionsProvider(
      DOCUMENT_SELECTOR,
      new KutabeCodeActionProvider(),
      {
        providedCodeActionKinds:
          KutabeCodeActionProvider.providedCodeActionKinds,
      },
    ),
    vscode.workspace.onDidChangeTextDocument(() => codeLensProvider.refresh()),
  );
}

export function deactivate(): void {}
