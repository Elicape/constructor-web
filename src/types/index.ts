export type SectionType =
  | "hero"
  | "text"
  | "text-image"
  | "tabs"
  | "accordion"
  | "cards"
  | "cta"
  | "spacer"
  | "video"
  | "gallery"
  | "header"
  | "footer"
  | "testimonials"
  | "counter"
  | "features"
  | "form"
  | "divider";

export interface Section {
  id: string;
  type: SectionType;
  visible: boolean;
  content: Record<string, unknown>;
}

export interface ThemeSettings {
  bgColor: string;
  accentColor: string;
  textColor: string;
  cardBgColor: string;
  borderColor: string;
  fontFamily: string;
  mode: "dark" | "light";
  customCSS: string;
}

export interface LayoutSettings {
  menuLayout: "horizontal" | "vertical-left" | "vertical-right" | "center";
  containerWidth: "narrow" | "normal" | "full";
  mobileControls: "expanded" | "collapsed" | "hidden";
}

export interface SEOSettings {
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  favicon: string;
  gaId: string;
}

export interface PageSettings {
  pageTitle: string;
  theme: ThemeSettings;
  layout: LayoutSettings;
  seo: SEOSettings;
}

export interface Project {
  version: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  settings: PageSettings;
  sections: Section[];
  assets: { images: Record<string, string> };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  sections: Section[];
  settings: PageSettings;
}

export interface RecentProject {
  name: string;
  path: string;
  updatedAt: string;
}

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface EditorState {
  isPreviewMode: boolean;
  selectedSectionId: string | null;
  showPageSettings: boolean;
  showExportDialog: boolean;
  showComponentLibrary: boolean;
  showSettings: boolean;
  clipboard: Section | null;
  undoStack: Section[][];
  redoStack: Section[][];
  zoom: number;
}
