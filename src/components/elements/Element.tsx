import type { RenderElementProps } from "slate-react";
import type { CustomElement } from "../../types/editor";
import { CodeBlockElement } from "./code-block/CodeBlockElement";

/**
 * Dispatches element rendering to the appropriate component based on element type.
 */
export function Element({ attributes, children, element }: RenderElementProps) {
  const el = element as CustomElement;

  switch (el.type) {
    case "code-block":
      return (
        <CodeBlockElement attributes={attributes} element={el} children={children} />
      );

    case "code-line":
      return (
        <div {...attributes} className="sre-code-line">
          {children}
        </div>
      );

    case "heading":
      switch (el.level) {
        case 1:
          return (
            <h1 {...attributes} className="sre-heading sre-heading-1">
              {children}
            </h1>
          );
        case 2:
          return (
            <h2 {...attributes} className="sre-heading sre-heading-2">
              {children}
            </h2>
          );
        case 3:
          return (
            <h3 {...attributes} className="sre-heading sre-heading-3">
              {children}
            </h3>
          );
        default:
          return (
            <h2 {...attributes} className="sre-heading">
              {children}
            </h2>
          );
      }

    case "block-quote":
      return (
        <blockquote {...attributes} className="sre-blockquote">
          {children}
        </blockquote>
      );

    default:
      return (
        <p {...attributes} className="sre-paragraph">
          {children}
        </p>
      );
  }
}
