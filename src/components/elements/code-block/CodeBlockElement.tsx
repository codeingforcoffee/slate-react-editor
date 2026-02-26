import type { RenderElementProps } from "slate-react";
import type { CodeBlockElement as CodeBlockElementType } from "../../../types/editor";
import { LanguageSelect } from "./LanguageSelect";

interface CodeBlockElementProps extends RenderElementProps {
  element: CodeBlockElementType;
}

/**
 * Renders a code block with a language selector header and
 * a <pre><code> body for the Slate children.
 */
export function CodeBlockElement({ attributes, children, element }: CodeBlockElementProps) {
  return (
    <div {...attributes} className="sre-code-block">
      <div className="sre-code-block-header" contentEditable={false}>
        <span className="sre-code-block-label">Code</span>
        <LanguageSelect element={element} />
      </div>
      <pre className="sre-code-block-pre">
        <code className="sre-code-block-code">{children}</code>
      </pre>
    </div>
  );
}
