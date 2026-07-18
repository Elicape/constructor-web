import { useProjectStore } from "../../store/projectStore";
import { CheckCircle, XCircle, Info } from "lucide-react";

export default function ToastContainer() {
  const toasts = useProjectStore((s) => s.toasts);

  return (
    <div className="fixed top-4 right-4 z-[50000] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-slide-up ${
            t.type === "success"
              ? "bg-editor-success text-white"
              : t.type === "error"
              ? "bg-editor-danger text-white"
              : "bg-editor-tertiary text-editor-text border border-editor-border"
          }`}
        >
          {t.type === "success" && <CheckCircle size={16} />}
          {t.type === "error" && <XCircle size={16} />}
          {t.type === "info" && <Info size={16} />}
          {t.message}
        </div>
      ))}
    </div>
  );
}
