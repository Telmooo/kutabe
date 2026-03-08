import assert from "assert";
import path from "path";
import { TypeScriptRenderer } from "../../../src/renderers/typescript";
import { ParsedSymbol } from "../../../src/core/types";

const ROOT = path.resolve(__dirname, "../../../..");
const renderer = new TypeScriptRenderer(ROOT);

const fn: ParsedSymbol = {
  kind: "function",
  name: "add",
  params: [
    { name: "x", type: "number" },
    { name: "y", type: "number" },
  ],
  returnType: "number",
  startLine: 0,
  indentation: "",
};

suite("TypeScript Renderer", () => {
  test("renders jsdoc style", () => {
    const out = renderer.render(fn, "jsdoc");
    assert.ok(out.includes("/**"));
    assert.ok(out.includes("*/"));
    assert.ok(out.includes("@param {number} x"));
    assert.ok(out.includes("@returns"));
  });

  test("renders tsdoc style (no brace types)", () => {
    const out = renderer.render(fn, "tsdoc");
    assert.ok(out.includes("/**"));
    assert.ok(out.includes("@param x"));
    assert.ok(!out.includes("{number}"));
    assert.ok(out.includes("@returns"));
  });

  test("applies indentation from symbol", () => {
    const indented: ParsedSymbol = { ...fn, indentation: "  " };
    const out = renderer.render(indented, "jsdoc");
    for (const line of out.split("\n")) {
      if (line.trim() !== "") {
        assert.ok(line.startsWith("  "), `expected indent: "${line}"`);
      }
    }
  });
});
