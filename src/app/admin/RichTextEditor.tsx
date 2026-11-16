"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./RichTextEditor.module.css";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = "Write content here..." }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlValue, setHtmlValue] = useState(value);
  const isInternalChange = useRef(false);

  // Synchronize external value with contentEditable div when value changes externally
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      editorRef.current.innerHTML = value || "";
      setHtmlValue(value || "");
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      isInternalChange.current = true;
      setHtmlValue(content);
      onChange(content);
    }
  };

  const exec = (command: string, value: string | undefined = undefined) => {
    if (isHtmlMode) return;
    document.execCommand(command, false, value);
    handleInput();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleHeading = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "p") {
      exec("formatBlock", "<p>");
    } else if (val) {
      exec("formatBlock", `<${val}>`);
    }
  };

  const handleColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    exec("foreColor", e.target.value);
  };

  const handleFontSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    if (size) {
      exec("fontSize", size);
    }
  };

  const addLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      exec("createLink", url);
    }
  };

  const toggleHtmlMode = () => {
    if (isHtmlMode) {
      // Switching from HTML view to Visual view
      if (editorRef.current) {
        editorRef.current.innerHTML = htmlValue;
        onChange(htmlValue);
      }
    } else {
      // Switching from Visual view to HTML view
      if (editorRef.current) {
        setHtmlValue(editorRef.current.innerHTML);
      }
    }
    setIsHtmlMode(!isHtmlMode);
  };

  const handleRawHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value;
    setHtmlValue(newHtml);
    onChange(newHtml);
  };

  return (
    <div className={styles.editorContainer}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        {/* Style Selector */}
        <select onChange={handleHeading} className={styles.select} disabled={isHtmlMode} defaultValue="p" title="Paragraph Style">
          <option value="p">Normal Text</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>

        {/* Font Size */}
        <select onChange={handleFontSize} className={styles.select} disabled={isHtmlMode} defaultValue="3" title="Font Size">
          <option value="2">Small</option>
          <option value="3">Normal</option>
          <option value="4">Medium</option>
          <option value="5">Large</option>
          <option value="6">Extra Large</option>
        </select>

        <div className={styles.divider}></div>

        {/* Text Styles */}
        <button type="button" onClick={() => exec("bold")} className={styles.toolBtn} title="Bold (Ctrl+B)" disabled={isHtmlMode}>
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => exec("italic")} className={styles.toolBtn} title="Italic (Ctrl+I)" disabled={isHtmlMode}>
          <em>I</em>
        </button>
        <button type="button" onClick={() => exec("underline")} className={styles.toolBtn} title="Underline (Ctrl+U)" disabled={isHtmlMode}>
          <u>U</u>
        </button>
        <button type="button" onClick={() => exec("strikeThrough")} className={styles.toolBtn} title="Strikethrough" disabled={isHtmlMode}>
          <s>S</s>
        </button>

        <div className={styles.divider}></div>

        {/* Text Colors */}
        <label className={styles.colorPickerLabel} title="Text Color">
          <span className={styles.colorPickerIcon}>A</span>
          <input type="color" onChange={handleColor} className={styles.colorPicker} disabled={isHtmlMode} defaultValue="#1A3A3A" />
        </label>

        <div className={styles.divider}></div>

        {/* Alignment */}
        <button type="button" onClick={() => exec("justifyLeft")} className={styles.toolBtn} title="Align Left" disabled={isHtmlMode}>
          ≡ Left
        </button>
        <button type="button" onClick={() => exec("justifyCenter")} className={styles.toolBtn} title="Align Center" disabled={isHtmlMode}>
          ≡ Center
        </button>
        <button type="button" onClick={() => exec("justifyRight")} className={styles.toolBtn} title="Align Right" disabled={isHtmlMode}>
          ≡ Right
        </button>
        <button type="button" onClick={() => exec("justifyFull")} className={styles.toolBtn} title="Justify" disabled={isHtmlMode}>
          ≡ Justify
        </button>

        <div className={styles.divider}></div>

        {/* Lists */}
        <button type="button" onClick={() => exec("insertUnorderedList")} className={styles.toolBtn} title="Bullet List" disabled={isHtmlMode}>
          • List
        </button>
        <button type="button" onClick={() => exec("insertOrderedList")} className={styles.toolBtn} title="Numbered List" disabled={isHtmlMode}>
          1. List
        </button>

        <div className={styles.divider}></div>

        {/* Link & Block Quote */}
        <button type="button" onClick={addLink} className={styles.toolBtn} title="Insert Link" disabled={isHtmlMode}>
          🔗 Link
        </button>
        <button type="button" onClick={() => exec("formatBlock", "blockquote")} className={styles.toolBtn} title="Quote" disabled={isHtmlMode}>
          ❝ Quote
        </button>
        <button type="button" onClick={() => exec("insertHorizontalRule")} className={styles.toolBtn} title="Horizontal Line" disabled={isHtmlMode}>
          ― Line
        </button>
        <button type="button" onClick={() => exec("removeFormat")} className={styles.toolBtn} title="Clear Formatting" disabled={isHtmlMode}>
          ✕ Clear
        </button>

        <div className={styles.divider}></div>

        {/* HTML Toggle */}
        <button
          type="button"
          onClick={toggleHtmlMode}
          className={`${styles.toolBtn} ${isHtmlMode ? styles.activeTool : ""}`}
          title="Toggle HTML Source Code View"
        >
          &lt;&gt; HTML
        </button>
      </div>

      {/* Editor Content Area */}
      {isHtmlMode ? (
        <textarea
          value={htmlValue}
          onChange={handleRawHtmlChange}
          className={styles.htmlArea}
          rows={12}
          placeholder="Paste or edit HTML markup..."
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className={styles.visualEditor}
          data-placeholder={placeholder}
          suppressContentEditableWarning
        />
      )}
    </div>
  );
}
