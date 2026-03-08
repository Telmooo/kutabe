import * as vscode from "vscode";
import * as assert from "assert";

const EXTENSION_ID = "undefined_publisher.kutabe";

async function activateExtension(): Promise<void> {
  const ext = vscode.extensions.getExtension(EXTENSION_ID);
  if (ext && !ext.isActive) {
    await ext.activate();
  }
}

async function openDocument(
  content: string,
  languageId: string,
): Promise<vscode.TextDocument> {
  const doc = await vscode.workspace.openTextDocument({
    content,
    language: languageId,
  });
  await vscode.window.showTextDocument(doc);
  return doc;
}

function setCursor(line: number, character = 0): void {
  const editor = vscode.window.activeTextEditor!;
  const pos = new vscode.Position(line, character);
  editor.selection = new vscode.Selection(pos, pos);
}

async function runCommand(): Promise<void> {
  await vscode.commands.executeCommand("kutabe.generateDocstring");
}

suite("Integration: generateDocstring", () => {
  suiteSetup(async () => {
    // Open a Python file to trigger onLanguage:python activation.
    await openDocument("def activate(): pass", "python");
    await activateExtension();
  });

  suiteTeardown(async () => {
    await vscode.commands.executeCommand("workbench.action.closeAllEditors");
  });

  suite("Python (Google style)", () => {
    test("inserts docstring after def line for a function with params", async () => {
      const source = [
        "def greet(name: str, greeting: str = 'Hello') -> str:",
        "    return f'{greeting}, {name}!'",
      ].join("\n");

      const doc = await openDocument(source, "python");
      setCursor(0);
      await runCommand();

      const text = doc.getText();
      assert.ok(text.includes('"""'), "should contain triple-quote docstring");
      assert.ok(text.includes("Args:"), "should include Args section");
      assert.ok(text.includes("name (str):"), "should list name param");
      assert.ok(text.includes("greeting (str):"), "should list greeting param");
      assert.ok(text.includes("Returns:"), "should include Returns section");
      assert.ok(text.includes("str:"), "should include return type");

      // Docstring must be inserted between the def line and the body
      const lines = text.split("\n");
      const defLine = lines.findIndex((l) => l.startsWith("def greet"));
      const docLine = lines.findIndex((l) => l.includes('"""'));
      assert.ok(
        docLine > defLine,
        `docstring (line ${docLine}) should appear after def (line ${defLine})`,
      );
    });

    test("inserts docstring for a function with no params or return", async () => {
      const source = ["def do_nothing():", "    pass"].join("\n");

      const doc = await openDocument(source, "python");
      setCursor(0);
      await runCommand();

      const text = doc.getText();
      assert.ok(text.includes('"""'), "should have docstring");
      assert.ok(!text.includes("Args:"), "should not have Args section");
      assert.ok(!text.includes("Returns:"), "should not have Returns section");
    });

    test("inserts docstring for a class", async () => {
      const source = ["class MyClass:", "    pass"].join("\n");

      const doc = await openDocument(source, "python");
      setCursor(0);
      await runCommand();

      const text = doc.getText();
      assert.ok(text.includes('"""'), "should have docstring");
    });

    test("resolves to enclosing function when cursor is inside body", async () => {
      const source = [
        "def compute(x: int) -> int:",
        "    result = x * 2",
        "    return result",
      ].join("\n");

      const doc = await openDocument(source, "python");
      setCursor(1); // inside body
      await runCommand();

      const text = doc.getText();
      assert.ok(text.includes('"""'), "should insert docstring");
    });

    test("shows info message when no symbol is found at cursor", async () => {
      const source = ["x = 42", "print(x)"].join("\n");

      await openDocument(source, "python");
      setCursor(0);

      // The command should not throw; it shows an info message internally.
      await assert.doesNotReject(runCommand);
    });
  });

  suite("TypeScript (JSDoc style)", () => {
    test("inserts JSDoc above a function declaration", async () => {
      const source = [
        "function add(a: number, b: number): number {",
        "    return a + b;",
        "}",
      ].join("\n");

      const doc = await openDocument(source, "typescript");
      setCursor(0);
      await runCommand();

      const text = doc.getText();
      assert.ok(text.includes("/**"), "should open JSDoc block");
      assert.ok(text.includes("*/"), "should close JSDoc block");
      assert.ok(text.includes("@param"), "should have @param tags");
      assert.ok(text.includes("@returns"), "should have @returns tag");

      // JSDoc must be inserted above the function line
      const lines = text.split("\n");
      const fnLine = lines.findIndex((l) => l.startsWith("function add"));
      const jsDocLine = lines.findIndex((l) => l.includes("/**"));
      assert.ok(
        jsDocLine < fnLine,
        `JSDoc (line ${jsDocLine}) should appear before function (line ${fnLine})`,
      );
    });

    test("inserts JSDoc above an arrow function", async () => {
      const source = [
        "const multiply = (x: number, y: number): number =>",
        "    x * y;",
      ].join("\n");

      const doc = await openDocument(source, "typescript");
      setCursor(0);
      await runCommand();

      const text = doc.getText();
      assert.ok(text.includes("/**"), "should have JSDoc block");
    });

    test("inserts JSDoc above a function without params", async () => {
      const source = [
        "function initialize(): void {",
        "    setup();",
        "}",
      ].join("\n");

      const doc = await openDocument(source, "typescript");
      setCursor(0);
      await runCommand();

      const text = doc.getText();
      assert.ok(text.includes("/**"), "should have JSDoc");
      assert.ok(
        !text.includes("@param"),
        "should not have @param for no-param function",
      );
    });
  });

  suite("Rust (rustdoc style)", () => {
    test("inserts rustdoc above a free function", async () => {
      const source = ["fn add(a: i32, b: i32) -> i32 {", "    a + b", "}"].join(
        "\n",
      );

      const doc = await openDocument(source, "rust");
      setCursor(0);
      await runCommand();

      const text = doc.getText();
      assert.ok(text.includes("/// "), "should have rustdoc lines");
      assert.ok(text.includes("# Arguments"), "should have Arguments section");
      assert.ok(text.includes("# Returns"), "should have Returns section");

      // Rustdoc must be inserted above the fn line
      const lines = text.split("\n");
      const fnLine = lines.findIndex((l) => l.startsWith("fn add"));
      const docLine = lines.findIndex((l) => l.startsWith("///"));
      assert.ok(
        docLine < fnLine,
        `rustdoc (line ${docLine}) should appear before fn (line ${fnLine})`,
      );
    });

    test("inserts rustdoc for a function with no return type", async () => {
      const source = [
        "fn log(msg: &str) {",
        '    println!("{}", msg);',
        "}",
      ].join("\n");

      const doc = await openDocument(source, "rust");
      setCursor(0);
      await runCommand();

      const text = doc.getText();
      assert.ok(text.includes("/// "), "should have rustdoc");
      assert.ok(
        !text.includes("# Returns"),
        "should not have Returns for () return",
      );
    });
  });
});
