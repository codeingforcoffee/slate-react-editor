import type { RenderLeafProps } from "slate-react";

/**
 * Renders a text leaf with optional marks (bold, italic, underline, etc.)
 * and Prism syntax highlighting tokens.
 */
export function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  let content = <>{children}</>;

  if (leaf.bold) {
    content = <strong>{content}</strong>;
  }

  if (leaf.italic) {
    content = <em>{content}</em>;
  }

  if (leaf.underline) {
    content = <u>{content}</u>;
  }

  if (leaf.strikethrough) {
    content = <s>{content}</s>;
  }

  if (leaf.code) {
    content = <code className="sre-inline-code">{content}</code>;
  }

  // Prism syntax highlighting token
  if (leaf.prism_token) {
    return (
      <span {...attributes} className={`token ${leaf.prism_token}`}>
        {content}
      </span>
    );
  }

  return <span {...attributes}>{content}</span>;
}
