import assert from "assert";
import path from "path";
import { RustParser } from "../../../src/parsers/rust";

const ROOT = path.resolve(__dirname, "../../../..");
const parser = new RustParser();

suite("RustParser", () => {
  suiteSetup(async () => {
    await parser.init(ROOT);
  });

  test("parses a free function with params and return type", () => {
    const source = `fn add(x: i32, y: i32) -> i32 {
    x + y
}
`;
    const result = parser.parseSymbolAtLine(source, 0);
    assert.ok(result);
    assert.strictEqual(result.kind, "function");
    assert.strictEqual(result.name, "add");
    assert.strictEqual(result.returnType, "i32");
    assert.strictEqual(result.params.length, 2);
    assert.deepStrictEqual(result.params[0], { name: "x", type: "i32" });
    assert.deepStrictEqual(result.params[1], { name: "y", type: "i32" });
  });

  test("strips &self from impl method params", () => {
    const source = `impl Calculator {
    fn add(&self, other: f64) -> f64 {
        self.value + other
    }
}
`;
    const result = parser.parseSymbolAtLine(source, 1);
    assert.ok(result);
    assert.strictEqual(result.kind, "method");
    assert.strictEqual(result.name, "add");
    assert.strictEqual(result.params.length, 1);
    assert.strictEqual(result.params[0]!.name, "other");
    assert.strictEqual(result.params[0]!.type, "f64");
  });

  test("strips &mut self from impl method params", () => {
    const source = `impl Counter {
    fn increment(&mut self, amount: u32) {
        self.count += amount;
    }
}
`;
    const result = parser.parseSymbolAtLine(source, 1);
    assert.ok(result);
    assert.strictEqual(result.kind, "method");
    assert.strictEqual(result.params.length, 1);
    assert.strictEqual(result.params[0]!.name, "amount");
  });

  test("parses an associated function (no self)", () => {
    const source = `impl Calculator {
    fn new(value: f64) -> Self {
        Self { value }
    }
}
`;
    const result = parser.parseSymbolAtLine(source, 1);
    assert.ok(result);
    assert.strictEqual(result.kind, "method");
    assert.strictEqual(result.name, "new");
    assert.strictEqual(result.params.length, 1);
    assert.strictEqual(result.params[0]!.name, "value");
  });

  test("parses a function with no return type", () => {
    const source = `fn log(message: &str) {
    println!("{}", message);
}
`;
    const result = parser.parseSymbolAtLine(source, 0);
    assert.ok(result);
    assert.strictEqual(result.name, "log");
    assert.strictEqual(result.returnType, undefined);
  });

  test("captures indentation for impl methods", () => {
    const source = `impl Foo {
    fn bar(&self) -> bool {
        true
    }
}
`;
    const result = parser.parseSymbolAtLine(source, 1);
    assert.ok(result);
    assert.strictEqual(result.indentation, "    ");
  });

  test("resolves symbol when cursor is inside the body", () => {
    const source = `fn compute(x: i32) -> i32 {
    let result = x * 2;
    result
}
`;
    const result = parser.parseSymbolAtLine(source, 1);
    assert.ok(result);
    assert.strictEqual(result.name, "compute");
  });

  test("returns null for non-symbol lines", () => {
    const source = `let x = 42;
`;
    const result = parser.parseSymbolAtLine(source, 0);
    assert.strictEqual(result, null);
  });
});
