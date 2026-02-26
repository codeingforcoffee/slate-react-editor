import { useCallback } from "react";
import { Node, Text } from "slate";
import { useSlate } from "slate-react";
import Prism from "prismjs";

// Load language grammars
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-python";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-yaml";

import { getTokensForLines } from "../../../utils/normalize-tokens";
import type { DecoratorRange, CustomElement } from "../../../types/editor";
import type { NodeEntry } from "slate";

/**
 * Returns the Slate decorate function for Prism syntax highlighting.
 *
 * Only processes `code-line` nodes. It walks up to find the parent `code-block`
 * to get the full code text (needed for accurate multi-line tokenization),
 * then maps each token back to the corresponding text node ranges.
 */
export function useDecorate() {
  const editor = useSlate();

  const decorate = useCallback(
    ([node, path]: NodeEntry): DecoratorRange[] => {
      // Only decorate code-line nodes
      if (!Text.isText(node)) {
        // We need to handle code-line elements
        return [];
      }

      // Check if this text node is inside a code-line
      if (path.length < 2) return [];

      const codeLinePath = path.slice(0, -1);
      const codeLineNode = Node.get(editor, codeLinePath);

      if (
        !codeLineNode ||
        typeof codeLineNode !== "object" ||
        !("type" in codeLineNode) ||
        (codeLineNode as CustomElement).type !== "code-line"
      ) {
        return [];
      }

      // Walk up to find the code-block parent
      if (codeLinePath.length < 1) return [];
      const codeBlockPath = codeLinePath.slice(0, -1);

      let codeBlockNode: Node;
      try {
        codeBlockNode = Node.get(editor, codeBlockPath);
      } catch {
        return [];
      }

      if (
        !codeBlockNode ||
        typeof codeBlockNode !== "object" ||
        !("type" in codeBlockNode) ||
        (codeBlockNode as CustomElement).type !== "code-block"
      ) {
        return [];
      }

      const codeBlock = codeBlockNode as CustomElement & { type: "code-block"; language: string };

      // Build full code text from all code-lines
      const lines: string[] = [];
      for (const [lineNode] of Node.children(editor, codeBlockPath)) {
        lines.push(Node.string(lineNode));
      }
      const fullCode = lines.join("\n");

      // Get the Prism grammar for the selected language
      const language = codeBlock.language;
      const grammar =
        language && language !== "plaintext" ? Prism.languages[language] : null;

      if (!grammar) return [];

      // Tokenize the full code
      const tokens = Prism.tokenize(fullCode, grammar);

      // Split tokens into per-line arrays
      const tokenLines = getTokensForLines(tokens);

      // Find which line index this code-line is
      const lineIndex = codeLinePath[codeLinePath.length - 1];

      const lineTokens = tokenLines[lineIndex];
      if (!lineTokens || lineTokens.length === 0) return [];

      // Map tokens to Slate ranges on this text node
      const ranges: DecoratorRange[] = [];
      let offset = 0;

      for (const { text, token } of lineTokens) {
        if (token === "plain") {
          offset += text.length;
          continue;
        }

        const start = offset;
        const end = offset + text.length;

        ranges.push({
          anchor: { path, offset: start },
          focus: { path, offset: end },
          prism_token: token,
        } as DecoratorRange);

        offset = end;
      }

      return ranges;
    },
    [editor]
  );

  return decorate;
}
