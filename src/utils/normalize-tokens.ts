import Prism from "prismjs";
import type { FlatToken } from "../types/editor";

/**
 * Recursively flatten a Prism token tree into a list of { text, token } pairs.
 * Nested tokens inherit the outermost token type.
 */
function flattenToken(
  token: string | Prism.Token,
  tokenType: string = "plain"
): FlatToken[] {
  if (typeof token === "string") {
    return token ? [{ text: token, token: tokenType }] : [];
  }

  const type = token.type;
  const content = token.content;

  if (typeof content === "string") {
    return content ? [{ text: content, token: type }] : [];
  }

  if (Array.isArray(content)) {
    return content.flatMap((child) => flattenToken(child, type));
  }

  return flattenToken(content, type);
}

/**
 * Given an array of Prism tokens (the result of Prism.tokenize),
 * split them into per-line arrays of FlatTokens.
 *
 * Each entry in the returned array corresponds to one line of source code.
 */
export function getTokensForLines(
  tokens: (string | Prism.Token)[]
): FlatToken[][] {
  const lines: FlatToken[][] = [[]];

  for (const token of tokens) {
    const flat = flattenToken(token);

    for (const { text, token: type } of flat) {
      // Split on newlines — each newline starts a new line
      const parts = text.split("\n");

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (i > 0) {
          // Start a new line
          lines.push([]);
        }

        if (part) {
          lines[lines.length - 1].push({ text: part, token: type });
        }
      }
    }
  }

  return lines;
}
