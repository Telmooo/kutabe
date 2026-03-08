<div align="center">
    <p><img src="assets/icon.svg" alt="kutabe" /></p>
    <span><i>A VSCode extension to automatically generate documentation</i></span>
</div>

## What it does?

Kutabe generates docstring and doc comments for functions and classes directly in the editor.

It supports Python, TypeScript, JavaScript, and Rust out of the box.

## Features

- **Keyboard Shortcut** - place cursor inside any function or class, press `Ctrl+Alt+D` (`⌘⌥D` on
  macOS), and the docstring is inserted automatically.
- **CodeLens** - a `✎ Generate Docstring` lens appears above every undocumented symbol.
- **Context menu** - right-click in the editor and choose _Kutabe: Generate Docstring_.
- **Multiple styles** - Google, NumPy, and Sphinx for Python; JSDoc and TSDoc for
  TypeScript/JavaScript; Rustdoc for Rust.
- **Type-aware** - parameter types and return types are extracted from the source code (type
  hints, TypeScript annotations, Rust signatures) and included in the generated doc.

## Supported Languages

| Language                | Styles                                |
| :---------------------- | :------------------------------------ |
| Python                  | `google` (default), `numpy`, `sphinx` |
| TypeScript / JavaScript | `jsdoc` (default), `tsdoc`            |
| Rust                    | `rustdoc`                             |

## Usage

1. Open a file in a supported language.
2. Place the cursor anywhere inside a function or class.
3. Press `Ctrl+Alt+D` (or `⌘⌥D` on macOS), or:
   - Click the `✎ Generate Docstring` CodeLens above the symbol.
   - Right-click &rarr; _Kutabe: Generate Docstring_.

**Python example** (Google style):

```python
def greet(name: str, greeting: str = "Hello") -> str:
    """Summary.

    Args:
        name (str): Description.
        greeting (str): Description.

    Returns:
        str: Description.
    """
    return f"{greeting}, {name}!"
```

**TypeScript example** (JSDoc style):

```typescript
/**
 * Summary.
 *
 * @param {number} a - Description.
 * @param {number} b - Description.
 *
 * @returns {number} Description.
 */
function add(a: number, b: number): number {
  return a + b;
}
```

**Rust example** (Rustdoc style):

```rust
/// Summary.
///
/// # Arguments
///
/// * `a` ([`i32`]) - Description.
/// * `b` ([`i32`]) - Description.
///
/// # Returns
///
/// [`i32`] - Description.
fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

## Configuration

Settings are available under _File &rarr; Preferences &rarr; Settings &rarr; Kutabe_.

| Setting                   | Default   | Options                     | Description                                 |
| ------------------------- | --------- | --------------------------- | ------------------------------------------- |
| `kutabe.python.style`     | `google`  | `google`, `numpy`, `sphinx` | Docstring style for Python                  |
| `kutabe.typescript.style` | `jsdoc`   | `jsdoc`, `tsdoc`            | Doc comment style for TypeScript/JavaScript |
| `kutabe.rust.style`       | `rustdoc` | `rustdoc`                   | Doc comment style for Rust                  |

## License

Kutabe is released under the [MIT License](https://opensource.org/license/MIT).
