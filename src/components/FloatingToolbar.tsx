import { useCallback } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold, Italic, Underline, Strikethrough, Code, Link,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote,
} from "lucide-react";

interface FloatingToolbarProps {
  editor: Editor | null;
}

export default function FloatingToolbar({ editor }: FloatingToolbarProps) {
  const chain = useCallback(() => {
    if (!editor) return undefined;
    return editor.chain().focus();
  }, [editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = prompt("URL del enlace:");
    if (url) {
      chain()?.extendMarkRange("link")?.setLink({ href: url })?.run();
    }
  }, [editor, chain]);

  if (!editor) return null;

  const btn = (label: string, active: boolean, onClick: () => void, icon: React.ReactNode) => (
    <button
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${
        active ? "bg-editor-accent/20 text-editor-accent" : "text-editor-text-sec hover:text-editor-text hover:bg-editor-tertiary"
      }`}
      title={label}
    >
      {icon}
    </button>
  );

  const isH = (lvl: number) => editor.isActive("heading") && editor.getAttributes("heading").level === lvl;

  return (
    <div className="tiptap-floating-toolbar" onMouseDown={(e) => e.preventDefault()}>
      {btn("Negrita", editor.isActive("bold"), () => chain()?.toggleBold()?.run(), <Bold size={14} />)}
      {btn("Cursiva", editor.isActive("italic"), () => chain()?.toggleItalic()?.run(), <Italic size={14} />)}
      {btn("Subrayado", editor.isActive("underline"), () => chain()?.toggleUnderline()?.run(), <Underline size={14} />)}
      {btn("Tachado", editor.isActive("strike"), () => chain()?.toggleStrike()?.run(), <Strikethrough size={14} />)}
      {btn("Código", editor.isActive("code"), () => chain()?.toggleCode()?.run(), <Code size={14} />)}
      <div className="w-px h-5 bg-editor-border mx-0.5" />
      {btn("Título 1", isH(1), () => chain()?.toggleHeading({ level: 1 })?.run(), <Heading1 size={14} />)}
      {btn("Título 2", isH(2), () => chain()?.toggleHeading({ level: 2 })?.run(), <Heading2 size={14} />)}
      {btn("Título 3", isH(3), () => chain()?.toggleHeading({ level: 3 })?.run(), <Heading3 size={14} />)}
      <div className="w-px h-5 bg-editor-border mx-0.5" />
      {btn("Lista", editor.isActive("bulletList"), () => chain()?.toggleBulletList()?.run(), <List size={14} />)}
      {btn("Lista ordenada", editor.isActive("orderedList"), () => chain()?.toggleOrderedList()?.run(), <ListOrdered size={14} />)}
      {btn("Cita", editor.isActive("blockquote"), () => chain()?.toggleBlockquote()?.run(), <Quote size={14} />)}
      <div className="w-px h-5 bg-editor-border mx-0.5" />
      {btn("Enlace", editor.isActive("link"), addLink, <Link size={14} />)}
    </div>
  );
}
