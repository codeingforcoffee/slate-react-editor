import { Editor, Transforms, Element, Node, Path, Text } from "slate";
import type { CustomElement, CodeBlockElement, CodeLineElement } from "../types/editor";

/**
 * Slate plugin that adds code-block specific behaviour:
 * - normalizeNode: keeps code-block/code-line structure consistent
 * - insertBreak: inserts a new code-line instead of a paragraph
 * - deleteBackward: unwraps code block when deleting from empty first line
 */
export function withCodeBlock(editor: Editor): Editor {
  const { normalizeNode, insertBreak, deleteBackward } = editor;

  // ─── normalizeNode ──────────────────────────────────────────────────────────

  editor.normalizeNode = ([node, path]) => {
    // Ensure all children of code-block are code-line nodes
    if (Element.isElement(node) && node.type === "code-block") {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Element.isElement(child) && child.type !== "code-line") {
          Transforms.setNodes<CustomElement>(editor, { type: "code-line" }, { at: childPath });
          return;
        }
        // If child is a text node (shouldn't happen), wrap it
        if (Text.isText(child)) {
          Transforms.wrapNodes(
            editor,
            { type: "code-line", children: [] } as CodeLineElement,
            { at: childPath }
          );
          return;
        }
      }

      // code-block must have at least one code-line
      if ((node as CodeBlockElement).children.length === 0) {
        Transforms.insertNodes(
          editor,
          { type: "code-line", children: [{ text: "" }] } as CodeLineElement,
          { at: [...path, 0] }
        );
        return;
      }
    }

    // Ensure code-line lives inside code-block
    if (Element.isElement(node) && node.type === "code-line") {
      const [parent] = Editor.parent(editor, path);
      if (Element.isElement(parent) && parent.type !== "code-block") {
        // Lift the code-line content out as a paragraph
        Transforms.setNodes<CustomElement>(editor, { type: "paragraph" }, { at: path });
        return;
      }
    }

    normalizeNode([node, path]);
  };

  // ─── insertBreak ────────────────────────────────────────────────────────────

  editor.insertBreak = () => {
    const { selection } = editor;
    if (!selection) {
      insertBreak();
      return;
    }

    const [codeLineEntry] = Array.from(
      Editor.nodes(editor, {
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === "code-line",
      })
    );

    if (!codeLineEntry) {
      insertBreak();
      return;
    }

    const [, codeLinePath] = codeLineEntry;

    // Insert a new code-line after the current one, splitting at cursor
    Editor.withoutNormalizing(editor, () => {
      // Split text at cursor point
      Transforms.splitNodes(editor, {
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === "code-line",
        always: true,
      });
    });

    // After split, move to start of new line
    const nextPath = Path.next(codeLinePath);
    if (editor.selection) {
      Transforms.select(editor, {
        anchor: { path: [...nextPath, 0], offset: 0 },
        focus: { path: [...nextPath, 0], offset: 0 },
      });
    }
  };

  // ─── deleteBackward ─────────────────────────────────────────────────────────

  editor.deleteBackward = (unit) => {
    const { selection } = editor;
    if (!selection) {
      deleteBackward(unit);
      return;
    }

    const [codeLineEntry] = Array.from(
      Editor.nodes(editor, {
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === "code-line",
      })
    );

    if (!codeLineEntry) {
      deleteBackward(unit);
      return;
    }

    const [codeLine, codeLinePath] = codeLineEntry;
    const isAtStart =
      selection.anchor.offset === 0 && Path.equals(selection.anchor.path, [...codeLinePath, 0]);

    if (!isAtStart) {
      deleteBackward(unit);
      return;
    }

    const isFirstLine = codeLinePath[codeLinePath.length - 1] === 0;

    if (isFirstLine) {
      // At start of first code-line: check if empty — if so, remove code block
      const lineText = Node.string(codeLine);
      if (lineText === "") {
        const [codeBlockEntry] = Array.from(
          Editor.nodes(editor, {
            match: (n) =>
              !Editor.isEditor(n) && Element.isElement(n) && n.type === "code-block",
          })
        );

        if (codeBlockEntry) {
          const [codeBlock, codeBlockPath] = codeBlockEntry;
          const block = codeBlock as CodeBlockElement;

          if (block.children.length === 1) {
            // Only one empty line: remove the whole code block and insert paragraph
            Transforms.removeNodes(editor, { at: codeBlockPath });
            Transforms.insertNodes(
              editor,
              { type: "paragraph", children: [{ text: "" }] },
              { at: codeBlockPath }
            );
            Transforms.select(editor, {
              anchor: { path: [...codeBlockPath, 0], offset: 0 },
              focus: { path: [...codeBlockPath, 0], offset: 0 },
            });
          } else {
            // Remove just the first empty line
            Transforms.removeNodes(editor, { at: codeLinePath });
          }
          return;
        }
      }
    } else {
      // Not first line, at start: merge with previous code-line
      const prevLinePath = Path.previous(codeLinePath);
      const prevLine = Node.get(editor, prevLinePath);
      const prevLineText = Node.string(prevLine);
      const prevLineTextLength = prevLineText.length;

      Transforms.mergeNodes(editor, { at: codeLinePath });

      // Place cursor at join point
      Transforms.select(editor, {
        anchor: { path: [...prevLinePath, 0], offset: prevLineTextLength },
        focus: { path: [...prevLinePath, 0], offset: prevLineTextLength },
      });
      return;
    }

    deleteBackward(unit);
  };

  return editor;
}
