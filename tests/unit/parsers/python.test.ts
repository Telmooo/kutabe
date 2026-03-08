import assert from "assert";
import { PythonParser } from "../../../src/parsers/python";

const parser = new PythonParser();

suite("Python Parser", () => {
  suiteSetup(async () => {
    await parser.init();
  });

  test("parses a simple function with type hints", () => {
    const source = `def greet(name: str, greeting: str = "Hello") -> str:
    return f"{greeting}, {name}!"
`;
    const result = parser.parseSymbolAtLine(source, 0);
    assert.ok(result);
    assert.strictEqual(result.kind, "function");
    assert.strictEqual(result.name, "greet");
    assert.strictEqual(result.returnType, "str");
    assert.strictEqual(result.params.length, 2);
    assert.deepStrictEqual(result.params[0], { name: "name", type: "str" });
    assert.strictEqual(result.params[1]!.name, "greeting");
    assert.strictEqual(result.params[1]!.type, "str");
    assert.strictEqual(result.params[1]!.defaultValue, '"Hello"');
  });

  test("parses a function without type hints", () => {
    const source = `def add(a, b):
    return a + b
`;
    const result = parser.parseSymbolAtLine(source, 0);
    assert.ok(result);
    assert.strictEqual(result.name, "add");
    assert.strictEqual(result.returnType, undefined);
    assert.strictEqual(result.params.length, 2);
    assert.deepStrictEqual(result.params[0], { name: "a" });
    assert.deepStrictEqual(result.params[1], { name: "b" });
  });

  test("strips self from method params", () => {
    const source = `class Foo:
    def bar(self, x: int) -> int:
        return x
`;
    const result = parser.parseSymbolAtLine(source, 1);
    assert.ok(result);
    assert.strictEqual(result.kind, "method");
    assert.strictEqual(result.name, "bar");
    assert.strictEqual(result.params.length, 1);
    assert.strictEqual(result.params[0]!.name, "x");
  });

  test("strips cls from classmethod params", () => {
    const source = `class Foo:
    @classmethod
    def create(cls, value: str) -> "Foo":
        return Foo()
`;
    const result = parser.parseSymbolAtLine(source, 2);
    assert.ok(result);
    assert.strictEqual(result.params.length, 1);
    assert.strictEqual(result.params[0]!.name, "value");
  });

  test("parses a class definition", () => {
    const source = `class Calculator:
    pass
`;
    const result = parser.parseSymbolAtLine(source, 0);
    assert.ok(result);
    assert.strictEqual(result.kind, "class");
    assert.strictEqual(result.name, "Calculator");
    assert.strictEqual(result.params.length, 0);
    assert.strictEqual(result.returnType, undefined);
  });

  test("resolves symbol when cursor is inside the body", () => {
    const source = `def compute(x: int) -> int:
    result = x * 2
    return result
`;
    const result = parser.parseSymbolAtLine(source, 1);
    assert.ok(result);
    assert.strictEqual(result.name, "compute");
  });

  test("captures indentation for nested functions", () => {
    const source = `class Foo:
    def bar(self) -> None:
        pass
`;
    const result = parser.parseSymbolAtLine(source, 1);
    assert.ok(result);
    assert.strictEqual(result.indentation, "    ");
  });

  test("returns null for non-symbol lines", () => {
    const source = `x = 42
print(x)
`;
    const result = parser.parseSymbolAtLine(source, 0);
    assert.strictEqual(result, null);
  });
});
