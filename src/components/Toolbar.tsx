import { useProjectStore } from "../store/projectStore";
import { saveProject } from "../utils/fileSystem";
import Tooltip from "./ui/Tooltip";
import {
  Plus, Settings, Save, Download, Eye, Undo2, Redo2, FolderOpen, FilePlus,
} from "lucide-react";

const isTauri = typeof window !== "undefined" && "__TAURI__" in window;

export default function Toolbar() {
  const store = useProjectStore();

  return null;
}
