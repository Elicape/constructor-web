import { type ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}

export default function Modal({ open, onClose, title, children, wide }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        ref={ref}
        className={`bg-editor-secondary border border-editor-border rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto ${
          wide ? "max-w-3xl w-[95%]" : "max-w-lg w-[90%]"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-editor-border">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-editor-text-sec hover:text-editor-text p-1.5 rounded-lg hover:bg-editor-tertiary transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
