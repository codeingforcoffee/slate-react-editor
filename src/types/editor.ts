import { BaseEditor, BaseRange, Range, Element } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

// ─── Text / Leaf Types ─────────────────────────────────────────────────────────

export type FormattedText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  /** Set by the Prism decorator — e.g. "keyword", "string", "comment" */
  prism_token?: string;
};

// ─── Element Types ─────────────────────────────────────────────────────────────

export type ParagraphElement = {
  type: "paragraph";
  children: FormattedText[];
};

export type HeadingLevel = 1 | 2 | 3;

export type HeadingElement = {
  type: "heading";
  level: HeadingLevel;
  children: FormattedText[];
};

export type BlockQuoteElement = {
  type: "block-quote";
  children: FormattedText[];
};

export type CodeLineElement = {
  type: "code-line";
  children: FormattedText[];
};

export type CodeBlockElement = {
  type: "code-block";
  language: string;
  children: CodeLineElement[];
};

export type CustomElement =
  | ParagraphElement
  | HeadingElement
  | BlockQuoteElement
  | CodeBlockElement
  | CodeLineElement;

export type CustomText = FormattedText;

// ─── Slate Module Augmentation ────────────────────────────────────────────────

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
    Range: BaseRange & { prism_token?: string };
  }
}

// ─── Decorator Range Type ─────────────────────────────────────────────────────

export type DecoratorRange = Range & { prism_token: string };

// ─── Type Guards ──────────────────────────────────────────────────────────────

export function isCodeBlockElement(node: unknown): node is CodeBlockElement {
  return Element.isElement(node) && (node as CustomElement).type === "code-block";
}

export function isCodeLineElement(node: unknown): node is CodeLineElement {
  return Element.isElement(node) && (node as CustomElement).type === "code-line";
}

export function isParagraphElement(node: unknown): node is ParagraphElement {
  return Element.isElement(node) && (node as CustomElement).type === "paragraph";
}

// ─── Flat Token (for syntax highlighting) ────────────────────────────────────

export type FlatToken = {
  text: string;
  token: string;
};
