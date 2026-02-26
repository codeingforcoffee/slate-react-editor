import { useCallback } from "react";
import { Editor, Transforms, Element, Path } from "slate";
import { useSlate } from "slate-react";
import type React from "react";
import { toggleMark, isHotkey } from "../../../utils/editor-utils";
import { MARK_HOTKEYS } from "../../../constants";

/**
 * Returns the keyboard event handler for the editor.
 *
 * Handles:
 * - Ctrl/Cmd+B/I/U/` → toggle marks
 * - Tab in code-line → insert 2 spaces
 * - Shift+Enter in code-block → exit code block (insert paragraph after)
 */
export function useKeyDown() {
  const editor = useSlate();

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // ─── Mark Hotkeys ─────────────────────────────────────────────────────
      for (const [hotkey, mark] of Object.entries(MARK_HOTKEYS)) {
        if (isHotkey(hotkey, event)) {
          event.preventDefault();
          toggleMark(editor, mark as "bold" | "italic" | "underline" | "code");
          return;
        }
      }

      const { selection } = editor;
      if (!selection) return;

      // Check if we're in a code-line
      const [codeLineEntry] = Array.from(
        Editor.nodes(editor, {
          match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === "code-line",
        })
      );

      if (!codeLineEntry) return;

      const [, _codeLinePath] = codeLineEntry;

      // ─── Tab → insert 2 spaces ─────────────────────────────────────────────
      if (event.key === "Tab") {
        event.preventDefault();
        Editor.insertText(editor, "  ");
        return;
      }

      // ─── Shift+Enter → exit code block ────────────────────────────────────
      if (event.key === "Enter" && event.shiftKey) {
        event.preventDefault();

        // Find the code-block ancestor
        const [codeBlockEntry] = Array.from(
          Editor.nodes(editor, {
            match: (n) =>
              !Editor.isEditor(n) && Element.isElement(n) && n.type === "code-block",
          })
        );

        if (!codeBlockEntry) return;

        const [, codeBlockPath] = codeBlockEntry;

        // Insert a paragraph after the code block
        const afterPath = Path.next(codeBlockPath);
        Transforms.insertNodes(
          editor,
          { type: "paragraph", children: [{ text: "" }] },
          { at: afterPath }
        );

        // Move selection to the new paragraph
        Transforms.select(editor, {
          anchor: { path: [...afterPath, 0], offset: 0 },
          focus: { path: [...afterPath, 0], offset: 0 },
        });

        return;
      }
    },
    [editor]
  );

  return onKeyDown;
}
