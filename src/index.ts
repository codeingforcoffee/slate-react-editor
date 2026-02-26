// ─── Styles ───────────────────────────────────────────────────────────────────
import "./styles/editor.css";
import "./styles/prism-theme.css";

// ─── Main Component ──────────────────────────────────────────────────────────
export { SlateEditor } from "./components/editor/SlateEditor";
export type { SlateEditorProps } from "./components/editor/SlateEditor";

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  FormattedText,
  ParagraphElement,
  HeadingElement,
  HeadingLevel,
  BlockQuoteElement,
  CodeBlockElement,
  CodeLineElement,
  CustomElement,
  CustomText,
  DecoratorRange,
  FlatToken,
} from "./types/editor";

export {
  isCodeBlockElement,
  isCodeLineElement,
  isParagraphElement,
} from "./types/editor";

// ─── Constants ───────────────────────────────────────────────────────────────
export { SUPPORTED_LANGUAGES, MARK_HOTKEYS, DEFAULT_LANGUAGE } from "./constants";

// ─── Utils ────────────────────────────────────────────────────────────────────
export {
  isMarkActive,
  toggleMark,
  isBlockActive,
  toggleBlock,
  insertCodeBlock,
  isHotkey,
} from "./utils/editor-utils";

// ─── Plugin ───────────────────────────────────────────────────────────────────
export { withCodeBlock } from "./plugins/with-code-block";

// ─── Components (for extensibility) ──────────────────────────────────────────
export { Element } from "./components/elements/Element";
export { Leaf } from "./components/elements/Leaf";
export { Toolbar } from "./components/toolbar/Toolbar";
export { MarkButton } from "./components/toolbar/MarkButton";
export { BlockButton } from "./components/toolbar/BlockButton";
