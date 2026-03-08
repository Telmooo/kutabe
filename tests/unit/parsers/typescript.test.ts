import assert from "assert";
import path from "path";
import { TypeScriptParser } from "../../../src/parsers/typescript";

const ROOT = path.resolve(__dirname, "../../../..");
const parser = new TypeScriptParser();

suite("TypeScript Parser", () => {
  suiteSetup(async () => {
    await parser.init(ROOT);
  });

  test("parses a function declaration with types", () => {
    const source = `function add(x: number, y: number): number {
  return x + y;
}
`;
    const result = parser.parseSymbolAtLine(source, 0, "typescript");
    assert.ok(result);
    assert.strictEqual(result.kind, "function");
    assert.strictEqual(result.name, "add");
    assert.strictEqual(result.returnType, "number");
    assert.strictEqual(result.params.length, 2);
    assert.strictEqual(result.params[0]!.name, "x");
    assert.strictEqual(result.params[0]!.type, "number");
    assert.strictEqual(result.params[1]!.name, "y");
    assert.strictEqual(result.params[1]!.type, "number");
  });

  test("parses an arrow function assigned to const", () => {
    const source = `const greet = (name: string, greeting: string = "Hello"): string => {
  return \`\${greeting}, \${name}!\`;
};
`;
    const result = parser.parseSymbolAtLine(source, 0, "typescript");
    assert.ok(result);
    assert.strictEqual(result.kind, "function");
    assert.strictEqual(result.name, "greet");
    assert.strictEqual(result.returnType, "string");
    assert.strictEqual(result.params.length, 2);
    assert.strictEqual(result.params[0]!.name, "name");
    assert.strictEqual(result.params[1]!.name, "greeting");
    assert.strictEqual(result.params[1]!.defaultValue, '"Hello"');
  });

  test("parses a class method", () => {
    const source = `class Calculator {
  multiply(a: number, b: number): number {
    return a * b;
  }
}
`;
    const result = parser.parseSymbolAtLine(source, 1, "typescript");
    assert.ok(result);
    assert.strictEqual(result.kind, "method");
    assert.strictEqual(result.name, "multiply");
    assert.strictEqual(result.params.length, 2);
  });

  test("parses a JavaScript function (no types)", () => {
    const source = `function add(x, y) {
  return x + y;
}
`;
    const result = parser.parseSymbolAtLine(source, 0, "javascript");
    assert.ok(result);
    assert.strictEqual(result.name, "add");
    assert.strictEqual(result.returnType, undefined);
    assert.strictEqual(result.params.length, 2);
    assert.strictEqual(result.params[0]!.type, undefined);
  });

  test("parses a JavaScript arrow function", () => {
    const source = `const greet = (name, greeting = "Hello") => {
  return greeting + ", " + name;
};
`;
    const result = parser.parseSymbolAtLine(source, 0, "javascript");
    assert.ok(result);
    assert.strictEqual(result.name, "greet");
    assert.strictEqual(result.params.length, 2);
    assert.strictEqual(result.params[1]!.defaultValue, '"Hello"');
  });

  test("captures indentation for methods", () => {
    const source = `class Foo {
  bar(x: number): void {
    console.log(x);
  }
}
`;
    const result = parser.parseSymbolAtLine(source, 1, "typescript");
    assert.ok(result);
    assert.strictEqual(result.indentation, "  ");
  });

  test("resolves symbol when cursor is inside the body", () => {
    const source = `function compute(x: number): number {
  const result = x * 2;
  return result;
}
`;
    const result = parser.parseSymbolAtLine(source, 1, "typescript");
    assert.ok(result);
    assert.strictEqual(result.name, "compute");
  });

  test("returns null for non-symbol lines", () => {
    const source = `const x = 42;
console.log(x);
`;
    const result = parser.parseSymbolAtLine(source, 0, "typescript");
    assert.strictEqual(result, null);
  });
});
