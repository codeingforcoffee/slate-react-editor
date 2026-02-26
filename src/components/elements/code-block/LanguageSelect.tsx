import React, { useCallback } from "react";
import { ReactEditor, useSlateStatic } from "slate-react";
import { Transforms } from "slate";
import type { CodeBlockElement } from "../../../types/editor";
import { SUPPORTED_LANGUAGES } from "../../../constants";

interface LanguageSelectProps {
  element: CodeBlockElement;
}

/**
 * A <select> dropdown for choosing the language of a code block.
 * Updates the element's `language` field via Slate transforms.
 */
export function LanguageSelect({ element }: LanguageSelectProps) {
  const editor = useSlateStatic();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes<CodeBlockElement>(editor, { language: event.target.value }, { at: path });
    },
    [editor, element]
  );

  return (
    <select
      className="sre-language-select"
      value={element.language}
      onChange={handleChange}
      // Prevent the select from stealing editor focus
      onMouseDown={(e) => e.stopPropagation()}
      contentEditable={false}
    >
      {SUPPORTED_LANGUAGES.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
