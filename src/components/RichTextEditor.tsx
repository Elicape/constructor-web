import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import PlaceholderExtension from "@tiptap/extension-placeholder";
import UnderlineExtension from "@tiptap/extension-underline";
import FloatingToolbar from "./FloatingToolbar";
import { useEffect } from "react";
import { useProjectStore } from "../store/projectStore";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  singleLine?: boolean;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Escribe aquí...",
  className = "",
  singleLine = false,
}: RichTextEditorProps) {
  const isPreview = useProjectStore((s) => s.editor.isPreviewMode);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: singleLine ? false : { levels: [1, 2, 3, 4] },
        bulletList: singleLine ? false : {},
        orderedList: singleLine ? false : {},
        blockquote: singleLine ? false : {},
        code: singleLine ? false : {},
        horizontalRule: false,
      }),
      UnderlineExtension,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-editor-accent underline cursor-pointer" },
      }),
      ImageExtension.configure({ inline: false }),
      PlaceholderExtension.configure({ placeholder }),
    ],
    content,
    editable: !isPreview,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-invert max-w-none focus:outline-none min-h-[1em] ${
          singleLine ? "[&_p]:m-0" : ""
        }`,
        spellCheck: "false",
        autocorrect: "off",
      },
      handleKeyDown: (_view: unknown, event: KeyboardEvent) => {
        if (singleLine && event.key === "Enter") {
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(!isPreview);
      if (content !== editor.getHTML()) {
        editor.commands.setContent(content, false);
      }
    }
  }, [content, editor, isPreview]);

  if (!editor) return null;

  return (
    <div className={`relative ${className}`}>
      {editor && !isPreview && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 150, placement: "top" }}
          className="z-[9999]"
        >
          <FloatingToolbar editor={editor} />
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
