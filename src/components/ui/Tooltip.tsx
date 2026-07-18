import type { ReactNode } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  return (
    <div className="group relative inline-flex">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-editor-secondary text-editor-text text-xs rounded-lg border border-editor-border shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999] max-w-[250px] text-center">
        {text}
      </div>
    </div>
  );
}
