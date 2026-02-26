import React, { useCallback } from "react";
import { useSlate } from "slate-react";
import { isBlockActive, toggleBlock } from "../../utils/editor-utils";
import type { CustomElement } from "../../types/editor";

type BlockType = CustomElement["type"];

interface BlockButtonProps {
  format: BlockType;
  children: React.ReactNode;
  title?: string;
}

/**
 * A toolbar button that toggles a block type (heading, blockquote, code-block, etc.).
 */
export function BlockButton({ format, children, title }: BlockButtonProps) {
  const editor = useSlate();
  const active = isBlockActive(editor, format);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      toggleBlock(editor, format);
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
