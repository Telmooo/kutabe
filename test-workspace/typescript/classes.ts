// TypeScript Classes - Kutabe Testing Workspace
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
// 1. Simple class with constructor and methods
// ---------------------------------------------------------------------------

class Vector2D {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

  add(other: Vector2D): Vector2D {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }

  scale(factor: number): Vector2D {
    return new Vector2D(this.x * factor, this.y * factor);
  }

  magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  normalize(): Vector2D {
    const mag = this.magnitude();
    return mag === 0 ? new Vector2D(0, 0) : this.scale(1 / mag);
  }

  dot(other: Vector2D): number {
    return this.x * other.x + this.y * other.y;
  }
}

// ---------------------------------------------------------------------------
// 2. Class with public/private/protected members
// ---------------------------------------------------------------------------

class EventEmitter<T> {
  private listeners: Map<string, Array<(data: T) => void>> = new Map();

  on(event: string, listener: (data: T) => void): this {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(listener);
    return this;
  }

  off(event: string, listener: (data: T) => void): this {
    const list = this.listeners.get(event);
    if (list) {
      const idx = list.indexOf(listener);
      if (idx !== -1) list.splice(idx, 1);
    }
    return this;
  }

  emit(event: string, data: T): void {
    this.listeners.get(event)?.forEach((fn) => fn(data));
  }

  listenerCount(event: string): number {
    return this.listeners.get(event)?.length ?? 0;
  }
}

// ---------------------------------------------------------------------------
// 3. Static methods
// ---------------------------------------------------------------------------

class IdGenerator {
  private static counter = 0;

  static next(): number {
    return ++IdGenerator.counter;
  }

  static reset(): void {
    IdGenerator.counter = 0;
  }

  static current(): number {
    return IdGenerator.counter;
  }
}

// ---------------------------------------------------------------------------
// 4. Getters and setters
// ---------------------------------------------------------------------------

class Temperature {
  private _celsius: number;

  constructor(celsius: number) {
    this._celsius = celsius;
  }

  get fahrenheit(): number {
    return (this._celsius * 9) / 5 + 32;
  }

  set fahrenheit(value: number) {
    this._celsius = ((value - 32) * 5) / 9;
  }

  get kelvin(): number {
    return this._celsius + 273.15;
  }

  set kelvin(value: number) {
    this._celsius = value - 273.15;
  }

  get celsius(): number {
    return this._celsius;
  }

  set celsius(value: number) {
    if (value < -273.15) throw new RangeError("Below absolute zero");
    this._celsius = value;
  }
}

// ---------------------------------------------------------------------------
// 5. Generic class
// ---------------------------------------------------------------------------

class LRUCache<K, V> {
  private cache: Map<K, V> = new Map();

  constructor(private readonly capacity: number) {}

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  get size(): number {
    return this.cache.size;
  }
}

// ---------------------------------------------------------------------------
// 6. Inheritance
// ---------------------------------------------------------------------------

abstract class Animal {
  constructor(public readonly name: string) {}

  abstract speak(): string;

  describe(): string {
    return `${this.name} says "${this.speak()}"`;
  }
}

class Dog extends Animal {
  constructor(
    name: string,
    public readonly breed: string,
  ) {
    super(name);
  }

  speak(): string {
    return "Woof!";
  }

  fetch(item: string): string {
    return `${this.name} fetches the ${item}`;
  }
}
