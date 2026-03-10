// JavaScript Classes - Kutabe Testing Workspace
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
// 1. Simple class
// ---------------------------------------------------------------------------

class Queue {
  constructor() {
    this._items = [];
  }

  enqueue(item) {
    this._items.push(item);
  }

  dequeue() {
    return this._items.shift();
  }

  peek() {
    return this._items[0];
  }

  get size() {
    return this._items.length;
  }

  get isEmpty() {
    return this._items.length === 0;
  }

  clear() {
    this._items = [];
  }
}

// ---------------------------------------------------------------------------
// 2. Class with static methods
// ---------------------------------------------------------------------------

class MathUtils {
  static add(a, b) {
    return a + b;
  }

  static subtract(a, b) {
    return a - b;
  }

  static clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  static lerp(start, end, t) {
    return start + t * (end - start);
  }

  static randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }
}

// ---------------------------------------------------------------------------
// 3. Inheritance
// ---------------------------------------------------------------------------

class Shape {
  constructor(color = "black") {
    this.color = color;
  }

  area() {
    throw new Error("area() must be implemented");
  }

  perimeter() {
    throw new Error("perimeter() must be implemented");
  }

  describe() {
    return `${this.color} shape, area=${this.area().toFixed(2)}`;
  }
}

class Circle extends Shape {
  constructor(radius, color = "black") {
    super(color);
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius ** 2;
  }

  perimeter() {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(width, height, color = "black") {
    super(color);
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }

  perimeter() {
    return 2 * (this.width + this.height);
  }

  get aspectRatio() {
    return this.width / this.height;
  }
}

// ---------------------------------------------------------------------------
// 4. Already-documented class (extension should SKIP these)
// ---------------------------------------------------------------------------

/**
 * A simple key-value store with expiry.
 */
class ExpiringCache {
  /**
   * Create a new ExpiringCache.
   *
   * @param {number} ttlMs - Default time-to-live in milliseconds.
   */
  constructor(ttlMs = 60_000) {
    this._store = new Map();
    this._ttl = ttlMs;
  }

  /**
   * Store a value with optional custom TTL.
   *
   * @param {string} key - Cache key.
   * @param {*} value - Value to store.
   * @param {number} [ttlMs] - Custom TTL in milliseconds.
   */
  set(key, value, ttlMs) {
    const expiry = Date.now() + (ttlMs ?? this._ttl);
    this._store.set(key, { value, expiry });
  }

  /**
   * Retrieve a value if it has not expired.
   *
   * @param {string} key - Cache key.
   * @returns {*} The stored value, or undefined if missing or expired.
   */
  get(key) {
    const entry = this._store.get(key);
    if (!entry || Date.now() > entry.expiry) {
      this._store.delete(key);
      return undefined;
    }
    return entry.value;
  }
}
