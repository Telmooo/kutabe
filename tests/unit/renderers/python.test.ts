import assert from "assert";
import path from "path";
import { PythonRenderer } from "../../../src/renderers/python";
import { ParsedSymbol } from "../../../src/core/types";

const ROOT = path.resolve(__dirname, "../../../..");
const renderer = new PythonRenderer(ROOT);

const fn: ParsedSymbol = {
  kind: "function",
  name: "greet",
  params: [
    { name: "name", type: "str" },
    { name: "greeting", type: "str", defaultValue: '"Hello"' },
  ],
  returnType: "str",
  startLine: 0,
  indentation: "",
};

suite("Python Renderer", () => {
  test("renders google style", () => {
    const out = renderer.render(fn, "google");
    assert.ok(out.includes('"""'));
    assert.ok(out.includes("Args:"));
    assert.ok(out.includes("name (str)"));
    assert.ok(out.includes("Returns:"));
  });

  test("renders numpy style", () => {
    const out = renderer.render(fn, "numpy");
    assert.ok(out.includes('"""'));
    assert.ok(out.includes("Parameters"));
    assert.ok(out.includes("name : str"));
    assert.ok(out.includes("Returns"));
  });

  test("renders sphinx style", () => {
    const out = renderer.render(fn, "sphinx");
    assert.ok(out.includes('"""'));
    assert.ok(out.includes(":param name:"));
    assert.ok(out.includes(":type name: str"));
    assert.ok(out.includes(":rtype: str"));
  });

  test("applies indentation from symbol", () => {
    const indented: ParsedSymbol = { ...fn, indentation: "    " };
    const out = renderer.render(indented, "google");
    for (const line of out.split("\n")) {
      if (line.trim() !== "") {
        assert.ok(line.startsWith("    "), `expected indent: "${line}"`);
      }
    }
  });
});
