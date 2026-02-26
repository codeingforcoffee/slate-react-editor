import React, { useCallback } from "react";
import { useSlate } from "slate-react";
import { isMarkActive, toggleMark } from "../../utils/editor-utils";

type MarkKey = "bold" | "italic" | "underline" | "strikethrough" | "code";

interface MarkButtonProps {
  format: MarkKey;
  children: React.ReactNode;
  title?: string;
}

/**
 * A toolbar button that toggles a text mark (bold, italic, underline, etc.).
 */
export function MarkButton({ format, children, title }: MarkButtonProps) {
  const editor = useSlate();
  const active = isMarkActive(editor, format);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      toggleMark(editor, format);
    },
    [editor, format]
  );

  return (
    <button
      className={`sre-toolbar-btn${active ? " sre-toolbar-btn--active" : ""}`}
      onMouseDown={handleMouseDown}
      title={title}
      type="button"
      aria-pressed={active}
    >
      {children}
    </button>
  );
}
