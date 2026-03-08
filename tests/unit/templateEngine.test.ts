import path from "path";
import { renderTemplate } from "../../src/core/templateEngine";
import { ParsedSymbol } from "../../src/core/types";
import assert from "assert";

const ROOT = path.resolve(__dirname, "../../..");

const fn: ParsedSymbol = {
  kind: "function",
  name: "calculate",
  params: [
    { name: "x", type: "int" },
    { name: "y", type: "float", defaultValue: "1.0" },
  ],
  returnType: "float",
  startLine: 0,
  indentation: "",
};

const noParamsNoReturn: ParsedSymbol = {
  kind: "function",
  name: "do_something",
  params: [],
  returnType: "None",
  startLine: 0,
  indentation: "",
};

const indented: ParsedSymbol = {
  kind: "method",
  name: "process",
  params: [{ name: "data", type: "str" }],
  returnType: "bool",
  startLine: 4,
  indentation: "    ",
};

suite("Template Engine", () => {
  test("python(google) - with params and return type", () => {
    const templateRender = renderTemplate(ROOT, "google", fn);
    assert.ok(templateRender.includes('"""'), "should have triple-quotes");
    assert.ok(templateRender.includes("Args:"), "should have Args section");
    assert.ok(templateRender.includes("x (int)"), "should include typed param");
    assert.ok(
      templateRender.includes("Returns:"),
      "should have Returns section",
    );
    assert.ok(templateRender.includes("float:"), "should include return type");
  });

  test("python(google) - no params, no return", () => {
    const templateRender = renderTemplate(ROOT, "google", noParamsNoReturn);
    assert.ok(!templateRender.includes("Args:"), "should omit Args section");
    assert.ok(
      !templateRender.includes("Returns:"),
      "should omit Returns section",
    );
  });

  test("python(numpy) - params and return type", () => {
    const templateRender = renderTemplate(ROOT, "numpy", fn);
    assert.ok(templateRender.includes('"""'), "should have triple-quotes");
    assert.ok(
      templateRender.includes("Parameters"),
      "should have Parameters section",
    );
    assert.ok(templateRender.includes("x : int"), "should include typed param");
    assert.ok(
      templateRender.includes("Returns"),
      "should have Returns section",
    );
  });

  test("python(sphinx) - params and return type", () => {
    const templateRender = renderTemplate(ROOT, "sphinx", fn);
    assert.ok(templateRender.includes(":param x:"), "should have :param:");
    assert.ok(templateRender.includes(":type x: int"), "should have :type:");
    assert.ok(templateRender.includes(":returns:"), "should have :returns:");
    assert.ok(templateRender.includes(":rtype: float"), "should have :rtype:");
  });

  test("jsdoc - params and return type", () => {
    const templateRender = renderTemplate(ROOT, "jsdoc", fn);
    assert.ok(templateRender.includes("/**"), "should open with /**");
    assert.ok(
      templateRender.includes("@param {int} x"),
      "should have typed @param",
    );
    assert.ok(templateRender.includes("@returns"), "should have @returns");
    assert.ok(templateRender.includes("*/"), "should close with */");
  });

  test("tsdoc - params (no types)", () => {
    const templateRender = renderTemplate(ROOT, "tsdoc", fn);
    assert.ok(
      templateRender.includes("@param x"),
      "should have @param without type",
    );
    assert.ok(
      !templateRender.includes("{int}"),
      "tsdoc should not include brace types",
    );
  });

  test("rustdoc - params and return type", () => {
    const templateRender = renderTemplate(ROOT, "rustdoc", fn);
    assert.ok(templateRender.includes("///"), "should use /// comments");
    assert.ok(
      templateRender.includes("# Arguments"),
      "should have Arguments section",
    );
    assert.ok(
      templateRender.includes("`x`"),
      "should include param name in backticks",
    );
    assert.ok(
      templateRender.includes("# Returns"),
      "should have Returns section",
    );
  });

  test("indentation is applied to every line", () => {
    const templateRender = renderTemplate(ROOT, "google", indented);
    for (const line of templateRender.split("\n")) {
      if (line.trim() !== "") {
        assert.ok(
          line.startsWith("    "),
          `line should start with 4 spaces: "${line}"`,
        );
      }
    }
  });
});
