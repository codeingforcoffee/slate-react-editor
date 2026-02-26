import { Editor, Transforms, Element, Path, Range } from "slate";
import type { CustomElement, CodeBlockElement, CodeLineElement } from "../types/editor";
import { DEFAULT_LANGUAGE } from "../constants";

// ─── Mark Helpers ─────────────────────────────────────────────────────────────

type MarkKey = "bold" | "italic" | "underline" | "strikethrough" | "code";

export function isMarkActive(editor: Editor, format: MarkKey): boolean {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

export function toggleMark(editor: Editor, format: MarkKey): void {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

// ─── Block Helpers ────────────────────────────────────────────────────────────

type BlockType = CustomElement["type"];

export function isBlockActive(
  editor: Editor,
  format: BlockType,
  field: string = "type"
): boolean {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && (n as Record<string, unknown>)[field] === format,
    })
  );

  return !!match;
}

export function toggleBlock(editor: Editor, format: BlockType): void {
  // Code blocks are handled separately
  if (format === "code-block") {
    insertCodeBlock(editor);
    return;
  }

  const isActive = isBlockActive(editor, format);

  Transforms.setNodes<CustomElement>(
    editor,
    { type: isActive ? "paragraph" : format } as Partial<CustomElement>,
    {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && Editor.isBlock(editor, n),
    }
  );
}

// ─── Code Block Helpers ───────────────────────────────────────────────────────

export function insertCodeBlock(editor: Editor): void {
  const { selection } = editor;
  if (!selection) return;

  // Check if already inside a code block
  const [existingCodeBlock] = Array.from(
    Editor.nodes(editor, {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === "code-block",
    })
  );

  if (existingCodeBlock) return;

  // Get the selected text to preserve as code content
  const selectedText = Editor.string(editor, selection);
  const lines = selectedText ? selectedText.split("\n") : [""];

  const codeLines: CodeLineElement[] = lines.map((line) => ({
    type: "code-line",
    children: [{ text: line }],
  }));

  const codeBlock: CodeBlockElement = {
    type: "code-block",
    language: DEFAULT_LANGUAGE,
    children: codeLines,
  };

  if (Range.isExpanded(selection)) {
    Transforms.delete(editor);
  }

  Transforms.insertNodes(editor, codeBlock);

  // Move cursor to first line of code block
  const [insertedBlock] = Array.from(
    Editor.nodes(editor, {
      match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === "code-block",
    })
  );

  if (insertedBlock) {
    const [, blockPath] = insertedBlock;
    const firstLinePath = [...blockPath, 0, 0] as Path;
    Transforms.select(editor, {
      anchor: { path: firstLinePath, offset: 0 },
      focus: { path: firstLinePath, offset: 0 },
    });
  }
}

// ─── Hotkey Utility ───────────────────────────────────────────────────────────

/**
 * Check if the keyboard event matches a hotkey string like "mod+b".
 * "mod" = Cmd on macOS, Ctrl elsewhere.
 */
export function isHotkey(hotkey: string, event: React.KeyboardEvent): boolean {
  const parts = hotkey.toLowerCase().split("+");
  const key = parts[parts.length - 1];
  const hasMod = parts.includes("mod");
  const hasShift = parts.includes("shift");
  const hasAlt = parts.includes("alt");

  const isMod = event.ctrlKey || event.metaKey;

  return (
    (!hasMod || isMod) &&
    (!hasShift || event.shiftKey) &&
    (!hasAlt || event.altKey) &&
    event.key.toLowerCase() === key
  );
}

// Import React for the isHotkey utility
import type React from "react";
