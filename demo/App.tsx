import { useState, useCallback } from "react";
import { Descendant } from "slate";
import { SlateEditor } from "../src/index";

const INITIAL_VALUE: Descendant[] = [
  {
    type: "paragraph",
    children: [
      { text: "Welcome to " },
      { text: "slate-react-editor", bold: true },
      { text: "! A rich-text editor with code block support." },
    ],
  },
  {
    type: "heading",
    level: 2,
    children: [{ text: "Features" }],
  },
  {
    type: "paragraph",
    children: [
      { text: "Use the toolbar or keyboard shortcuts to format text. Try " },
      { text: "Ctrl+B", code: true },
      { text: " for bold, " },
      { text: "Ctrl+I", code: true },
      { text: " for italic, or " },
      { text: "Ctrl+`", code: true },
      { text: " for inline code." },
    ],
  },
  {
    type: "block-quote",
    children: [{ text: "Block quotes are supported too!" }],
  },
  {
    type: "code-block",
    language: "typescript",
    children: [
      {
        type: "code-line",
        children: [{ text: "function greet(name: string): string {" }],
      },
      {
        type: "code-line",
        children: [{ text: '  return `Hello, ${name}!`;' }],
      },
      {
        type: "code-line",
        children: [{ text: "}" }],
      },
      {
        type: "code-line",
        children: [{ text: "" }],
      },
      {
        type: "code-line",
        children: [{ text: 'console.log(greet("world"));' }],
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      { text: "Press " },
      { text: "Shift+Enter", code: true },
      { text: " inside a code block to exit it. Press " },
      { text: "Tab", code: true },
      { text: " to indent with 2 spaces." },
    ],
  },
];

export function App() {
  const [value, setValue] = useState<Descendant[]>(INITIAL_VALUE);

  const handleChange = useCallback((newValue: Descendant[]) => {
    setValue(newValue);
  }, []);

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: "0 20px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, color: "#111827" }}>
        slate-react-editor
      </h1>
      <p style={{ color: "#6b7280", marginBottom: 24, fontSize: 14 }}>
        A production-quality rich-text editor with code block support
      </p>

      <SlateEditor
        initialValue={INITIAL_VALUE}
        onChange={handleChange}
      />

      <details style={{ marginTop: 32 }}>
        <summary
          style={{ cursor: "pointer", color: "#6b7280", fontSize: 13, userSelect: "none" }}
        >
          Editor state (JSON)
        </summary>
        <pre
          style={{
            marginTop: 8,
            padding: 12,
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            fontSize: 12,
            overflowX: "auto",
            color: "#374151",
          }}
        >
          {JSON.stringify(value, null, 2)}
        </pre>
      </details>
    </div>
  );
}
