import { useProjectStore } from "../store/projectStore";

export default function PreviewExitBar() {
  const { setPreviewMode } = useProjectStore();

  return (
    <div className="fixed top-0 left-0 right-0 z-[20000] bg-black/80 backdrop-blur-md text-white flex items-center justify-center h-10 gap-4">
      <span className="text-sm">Vista Previa - Presiona <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-xs">ESC</kbd> o <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-xs">F5</kbd> para salir</span>
      <button
        onClick={() => setPreviewMode(false)}
        className="px-4 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
      >
        Salir de Vista Previa
      </button>
    </div>
  );
}
