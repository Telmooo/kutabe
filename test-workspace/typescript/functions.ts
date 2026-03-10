// TypeScript Functions - Kutabe Testing Workspace
//
// Usage:
//   - Place cursor inside any undocumented function
//   - Press Ctrl+Alt+D (Cmd+Alt+D on macOS)  OR
//   - Click "✎ Generate Docstring" in the CodeLens hint  OR
//   - Right-click → "Kutabe: Generate Docstring"
//
// To switch doc comment style, edit .vscode/settings.json:
//   "kutabe.typescript.style": "jsdoc"   (options: jsdoc | tsdoc)
//
// Note: TypeScript shares the same style setting as JavaScript.

// ---------------------------------------------------------------------------
// 1. Simple typed function
// ---------------------------------------------------------------------------

function greet(name: string): string {
  return `Hello, ${name}!`;
}

// ---------------------------------------------------------------------------
// 2. Optional parameters
// ---------------------------------------------------------------------------

function formatDate(date: Date, locale?: string, format?: string): string {
  return date.toLocaleDateString(locale);
}

// ---------------------------------------------------------------------------
// 3. Default parameter values
// ---------------------------------------------------------------------------

function repeat(
  text: string,
  times: number = 3,
  separator: string = ", ",
): string {
  return Array(times).fill(text).join(separator);
}

// ---------------------------------------------------------------------------
// 4. Generic function
// ---------------------------------------------------------------------------

function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

function groupBy<T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  return items.reduce(
    (acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
}

// ---------------------------------------------------------------------------
// 5. Async function
// ---------------------------------------------------------------------------

async function fetchJson<T>(url: string, timeout: number = 5000): Promise<T> {
  const response = await fetch(url);
  return response.json();
}

async function retryUntil<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000,
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}

// ---------------------------------------------------------------------------
// 6. Arrow function assigned to const
// ---------------------------------------------------------------------------

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const debounce = <T extends (...args: unknown[]) => void>(
  fn: T,
  waitMs: number,
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), waitMs);
  };
};

// ---------------------------------------------------------------------------
// 7. Function with union / intersection types
// ---------------------------------------------------------------------------

function coerce(value: string | number | boolean): string {
  return String(value);
}

function mergeOptions<A extends object, B extends object>(
  base: A,
  override: B,
): A & B {
  return { ...base, ...override };
}

// ---------------------------------------------------------------------------
// 8. Already-documented function (extension should SKIP this one)
// ---------------------------------------------------------------------------

/**
 * Divide two numbers.
 *
 * @param numerator - The dividend.
 * @param denominator - The divisor.
 * @returns The quotient.
 * @throws {Error} If denominator is zero.
 */
function divide(numerator: number, denominator: number): number {
  if (denominator === 0) throw new Error("Division by zero");
  return numerator / denominator;
}
