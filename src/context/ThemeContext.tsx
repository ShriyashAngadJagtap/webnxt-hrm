import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type LayoutMode = "light" | "dark";
export type SidebarColor = "light" | "dark";
export type ColorTheme = "default" | "blue" | "orange" | "teal" | "green" | "sky";

interface ThemeState {
  layout: LayoutMode;
  sidebarColor: SidebarColor;
  colorTheme: ColorTheme;
  setLayout: (v: LayoutMode) => void;
  setSidebarColor: (v: SidebarColor) => void;
  setColorTheme: (v: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeState | null>(null);

const STORAGE_KEY = "webnxt-theme";

const colorThemeMap: Record<ColorTheme, { primary: string; accent: string; ring: string }> = {
  default: { primary: "25 95% 53%", accent: "25 100% 96%", ring: "25 95% 53%" },
  blue: { primary: "217 91% 60%", accent: "217 100% 96%", ring: "217 91% 60%" },
  orange: { primary: "33 100% 50%", accent: "33 100% 96%", ring: "33 100% 50%" },
  teal: { primary: "174 72% 46%", accent: "174 100% 96%", ring: "174 72% 46%" },
  green: { primary: "152 69% 45%", accent: "152 100% 96%", ring: "152 69% 45%" },
  sky: { primary: "199 89% 48%", accent: "199 100% 96%", ring: "199 89% 48%" },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [layout, setLayout] = useState<LayoutMode>("light");
  const [sidebarColor, setSidebarColor] = useState<SidebarColor>("light");
  const [colorTheme, setColorTheme] = useState<ColorTheme>("default");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.layout) setLayout(parsed.layout);
        if (parsed.sidebarColor) setSidebarColor(parsed.sidebarColor);
        if (parsed.colorTheme) setColorTheme(parsed.colorTheme);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ layout, sidebarColor, colorTheme }));

    const root = document.documentElement;
    if (layout === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    const colors = colorThemeMap[colorTheme];
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--accent-foreground", colors.primary);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--ring", colors.ring);
    root.style.setProperty("--sidebar-primary", colors.primary);
    root.style.setProperty("--sidebar-accent", colors.accent);
    root.style.setProperty("--sidebar-accent-foreground", colors.primary);
    root.style.setProperty("--sidebar-ring", colors.ring);
  }, [layout, sidebarColor, colorTheme]);

  return (
    <ThemeContext.Provider value={{ layout, sidebarColor, colorTheme, setLayout, setSidebarColor, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
