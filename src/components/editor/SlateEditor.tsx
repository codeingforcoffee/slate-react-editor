import { useMemo, useCallback } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { withCodeBlock } from "../../plugins/with-code-block";
import { Element } from "../elements/Element";
import { Leaf } from "../elements/Leaf";
import { Toolbar } from "../toolbar/Toolbar";
import { MarkButton } from "../toolbar/MarkButton";
import { BlockButton } from "../toolbar/BlockButton";
import { useDecorate } from "./hooks/use-decorate";
import { useKeyDown } from "./hooks/use-key-down";

// ─── Default Initial Value ─────────────────────────────────────────────────────

const DEFAULT_INITIAL_VALUE: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "Start typing here..." }],
  },
];

// ─── Inner Editor (needs Slate context) ───────────────────────────────────────

function EditorInner() {
  const decorate = useDecorate();
  const onKeyDown = useKeyDown();

  const renderElement = useCallback(
    (props: Parameters<typeof Element>[0]) => <Element {...props} />,
    []
  );

  const renderLeaf = useCallback(
    (props: Parameters<typeof Leaf>[0]) => <Leaf {...props} />,
    []
  );

  return (
    <div className="sre-editor-wrapper">
      <Toolbar>
        <MarkButton format="bold" title="Bold (Ctrl+B)">
          <strong>B</strong>
        </MarkButton>
        <MarkButton format="italic" title="Italic (Ctrl+I)">
          <em>I</em>
        </MarkButton>
        <MarkButton format="underline" title="Underline (Ctrl+U)">
          <u>U</u>
        </MarkButton>
        <MarkButton format="strikethrough" title="Strikethrough">
          <s>S</s>
        </MarkButton>
        <MarkButton format="code" title="Inline Code (Ctrl+`)">
          <code>{"`"}</code>
        </MarkButton>
        <span className="sre-toolbar-divider" />
        <BlockButton format="heading" title="Heading 1">
          H1
        </BlockButton>
        <BlockButton format="block-quote" title="Block Quote">
          &ldquo;
        </BlockButton>
        <BlockButton format="code-block" title="Code Block">
          {"</>"}
        </BlockButton>
      </Toolbar>
      <Editable
        className="sre-editable"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        decorate={decorate}
        onKeyDown={onKeyDown}
        placeholder="Start typing..."
        spellCheck
        autoFocus
      />
    </div>
  );
}

// ─── Main Editor Component ────────────────────────────────────────────────────

export interface SlateEditorProps {
  /** Initial value for the editor. Defaults to a single empty paragraph. */
  initialValue?: Descendant[];
  /** Called whenever the editor value changes. */
  onChange?: (value: Descendant[]) => void;
  /** Additional class name for the outermost container. */
  className?: string;
}

/**
 * The main Slate React editor component with a toolbar, syntax highlighting,
 * and code block support.
 *
 * @example
 * ```tsx
 * import { SlateEditor } from "slate-react-editor";
 * import "slate-react-editor/style.css";
 *
 * function App() {
 *   return <SlateEditor onChange={(value) => console.log(value)} />;
 * }
 * ```
 */
export function SlateEditor({
  initialValue = DEFAULT_INITIAL_VALUE,
  onChange,
  className,
}: SlateEditorProps) {
  const editor = useMemo(
    () => withCodeBlock(withHistory(withReact(createEditor()))),
    []
  );

  const handleChange = useCallback(
    (value: Descendant[]) => {
      onChange?.(value);
    },
    [onChange]
  );

  return (
    <div className={`sre-container${className ? ` ${className}` : ""}`}>
      <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
        <EditorInner />
      </Slate>
    </div>
  );
}
