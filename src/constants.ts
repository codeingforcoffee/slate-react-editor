// ─── Supported Languages for Code Blocks ──────────────────────────────────────

export const SUPPORTED_LANGUAGES: { label: string; value: string }[] = [
  { label: "Plain Text", value: "plaintext" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "JSX", value: "jsx" },
  { label: "TSX", value: "tsx" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "JSON", value: "json" },
  { label: "Markdown", value: "markdown" },
  { label: "Python", value: "python" },
  { label: "Rust", value: "rust" },
  { label: "Go", value: "go" },
  { label: "Java", value: "java" },
  { label: "C", value: "c" },
  { label: "C++", value: "cpp" },
  { label: "C#", value: "csharp" },
  { label: "Ruby", value: "ruby" },
  { label: "PHP", value: "php" },
  { label: "SQL", value: "sql" },
  { label: "Bash", value: "bash" },
  { label: "YAML", value: "yaml" },
  { label: "TOML", value: "toml" },
];

// ─── Mark Hotkeys ─────────────────────────────────────────────────────────────

export const MARK_HOTKEYS: Record<string, string> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

// ─── Default Language ─────────────────────────────────────────────────────────

export const DEFAULT_LANGUAGE = "javascript";
