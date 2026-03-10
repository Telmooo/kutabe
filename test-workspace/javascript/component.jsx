// JavaScript React - Kutabe Testing Workspace
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
// JSX file - verifies that the extension activates for "javascriptreact" language mode.
//
// Note: JavaScript shares the same style setting as TypeScript.

import React, { useState, useCallback, useRef } from "react";

// ---------------------------------------------------------------------------
// 1. Functional component (function declaration)
// ---------------------------------------------------------------------------

function Button({ label, onClick, disabled = false, variant = "primary" }) {
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
// 2. Functional component with state
// ---------------------------------------------------------------------------

function Toggle({
  defaultOn = false,
  onLabel = "ON",
  offLabel = "OFF",
  onChange,
}) {
  const [on, setOn] = useState(defaultOn);

  const toggle = useCallback(() => {
    setOn((prev) => {
      const next = !prev;
      onChange?.(next);
      return next;
    });
  }, [onChange]);

  return (
    <button onClick={toggle} className={`toggle ${on ? "on" : "off"}`}>
      {on ? onLabel : offLabel}
    </button>
  );
}

// ---------------------------------------------------------------------------
// 3. Arrow function component
// ---------------------------------------------------------------------------

const Badge = ({ text, color = "blue" }) => (
  <span style={{ color }} className="badge">
    {text}
  </span>
);

const Spinner = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// 4. Controlled input component
// ---------------------------------------------------------------------------

function TextInput({ value, onChange, placeholder = "", maxLength, onEnter }) {
  const inputRef = useRef(null);

  function handleKeyDown(event) {
    if (event.key === "Enter") onEnter?.();
  }

  function handleChange(event) {
    onChange(event.target.value);
  }

  function focus() {
    inputRef.current?.focus();
  }

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      maxLength={maxLength}
    />
  );
}

// ---------------------------------------------------------------------------
// 5. Higher-order component
// ---------------------------------------------------------------------------

function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) return <Spinner />;
    return <WrappedComponent {...props} />;
  };
}

export { Button, Toggle, Badge, Spinner, TextInput, withLoading };
