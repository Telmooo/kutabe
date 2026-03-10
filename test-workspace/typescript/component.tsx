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
// TSX file - verifies that the extension activates for "typescriptreact" language mode.
//
// Note: TypeScript shares the same style setting as JavaScript.

import React, { useState, useCallback, useEffect } from "react";

// ---------------------------------------------------------------------------
// Types / interfaces
// ---------------------------------------------------------------------------

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

interface CounterProps {
  initialCount?: number;
  min?: number;
  max?: number;
  onCountChange?: (count: number) => void;
}

interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
}

// ---------------------------------------------------------------------------
// 1. Simple functional component
// ---------------------------------------------------------------------------

function Button({
  label,
  onClick,
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// 2. Component with state and callbacks
// ---------------------------------------------------------------------------

function Counter({
  initialCount = 0,
  min = 0,
  max = 100,
  onCountChange,
}: CounterProps) {
  const [count, setCount] = useState(initialCount);

  const increment = useCallback(() => {
    setCount((prev) => {
      const next = Math.min(prev + 1, max);
      onCountChange?.(next);
      return next;
    });
  }, [max, onCountChange]);

  const decrement = useCallback(() => {
    setCount((prev) => {
      const next = Math.max(prev - 1, min);
      onCountChange?.(next);
      return next;
    });
  }, [min, onCountChange]);

  const reset = useCallback(() => {
    setCount(initialCount);
    onCountChange?.(initialCount);
  }, [initialCount, onCountChange]);

  return (
    <div className="counter">
      <Button label="-" onClick={decrement} disabled={count <= min} />
      <span>{count}</span>
      <Button label="+" onClick={increment} disabled={count >= max} />
      <Button label="Reset" onClick={reset} variant="secondary" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Generic component
// ---------------------------------------------------------------------------

function List<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = "No items",
}: ListProps<T>) {
  if (items.length === 0) return <p>{emptyMessage}</p>;
  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// 4. Arrow function component
// ---------------------------------------------------------------------------

const Badge = ({ text, color = "blue" }: { text: string; color?: string }) => (
  <span style={{ color }} className="badge">
    {text}
  </span>
);

// ---------------------------------------------------------------------------
// 5. Hook-style helper functions inside a component
// ---------------------------------------------------------------------------

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

// ---------------------------------------------------------------------------
// 6. Event handler helpers
// ---------------------------------------------------------------------------

function handleKeyDown(
  event: React.KeyboardEvent,
  onEnter: () => void,
  onEscape?: () => void,
) {
  if (event.key === "Enter") onEnter();
  else if (event.key === "Escape") onEscape?.();
}

function stopPropagation(event: React.SyntheticEvent): void {
  event.stopPropagation();
}

export { Button, Counter, List, Badge, useWindowSize };
