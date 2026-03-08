import assert from "assert";
import path from "path";
import { RustRenderer } from "../../../src/renderers/rust";
import { ParsedSymbol } from "../../../src/core/types";

const ROOT = path.resolve(__dirname, "../../../..");
const renderer = new RustRenderer(ROOT);

const fn: ParsedSymbol = {
  kind: "function",
  name: "add",
  params: [
    { name: "x", type: "i32" },
    { name: "y", type: "i32" },
  ],
  returnType: "i32",
  startLine: 0,
  indentation: "",
};

suite("Rust Renderer", () => {
  test("renders rustdoc style", () => {
    const out = renderer.render(fn, "rustdoc");
    assert.ok(out.includes("///"));
    assert.ok(out.includes("# Arguments"));
    assert.ok(out.includes("`x`"));
    assert.ok(out.includes("[`i32`]"));
    assert.ok(out.includes("# Returns"));
  });

  test("omits sections when no params or return", () => {
    const simple: ParsedSymbol = {
      kind: "function",
      name: "noop",
      params: [],
      startLine: 0,
      indentation: "",
    };
    const out = renderer.render(simple, "rustdoc");
    assert.ok(out.includes("///"));
    assert.ok(!out.includes("# Arguments"));
    assert.ok(!out.includes("# Returns"));
  });

  test("applies indentation from symbol", () => {
    const indented: ParsedSymbol = { ...fn, indentation: "    " };
    const out = renderer.render(indented, "rustdoc");
    for (const line of out.split("\n")) {
      if (line.trim() !== "") {
        assert.ok(line.startsWith("    "), `expected indent: "${line}"`);
      }
    }
  });
});
