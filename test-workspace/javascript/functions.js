// JavaScript Functions - Kutabe Testing Workspace
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
// Note: JavaScript shares the same style setting as TypeScript.

// ---------------------------------------------------------------------------
// 1. Simple function declaration
// ---------------------------------------------------------------------------

function greet(name) {
  return `Hello, ${name}!`;
}

// ---------------------------------------------------------------------------
// 2. Function with default values
// ---------------------------------------------------------------------------

function createUser(name, role = "viewer", active = true) {
  return { name, role, active, createdAt: new Date() };
}

function formatNumber(value, decimals = 2, locale = "en-US") {
  return value.toLocaleString(locale, { minimumFractionDigits: decimals });
}

// ---------------------------------------------------------------------------
// 3. Arrow functions
// ---------------------------------------------------------------------------

const add = (a, b) => a + b;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, fn) => fn(v), x);

// ---------------------------------------------------------------------------
// 4. Async functions
// ---------------------------------------------------------------------------

async function loadConfig(path) {
  const response = await fetch(path);
  return response.json();
}

async function withRetry(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
    }
  }
}

// ---------------------------------------------------------------------------
// 5. Function expression
// ---------------------------------------------------------------------------

const debounce = function (fn, waitMs) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), waitMs);
  };
};

const memoize = function (fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

// ---------------------------------------------------------------------------
// 6. Already-documented function (extension should SKIP this one)
// ---------------------------------------------------------------------------

/**
 * Divide two numbers.
 *
 * @param {number} numerator - The dividend.
 * @param {number} denominator - The divisor.
 * @returns {number} The quotient.
 * @throws {Error} If denominator is zero.
 */
function divide(numerator, denominator) {
  if (denominator === 0) throw new Error("Division by zero");
  return numerator / denominator;
}

// ---------------------------------------------------------------------------
// 7. Rest parameters
// ---------------------------------------------------------------------------

function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}

function logMessage(level, ...parts) {
  const message = parts.join(" ");
  console.log(`[${level.toUpperCase()}] ${message}`);
}
