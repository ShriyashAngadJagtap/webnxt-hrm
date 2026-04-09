import { useState } from "react";
import { Settings, X, Check, Sun, Moon, Monitor } from "lucide-react";
import { useTheme, type ColorTheme, type LayoutMode, type SidebarColor } from "@/context/ThemeContext";

const colorOptions: { id: ColorTheme; color: string; label: string }[] = [
  { id: "default", color: "bg-gray-700", label: "Default" },
  { id: "blue", color: "bg-blue-600", label: "Blue" },
  { id: "orange", color: "bg-orange-500", label: "Orange" },
  { id: "teal", color: "bg-teal-500", label: "Teal" },
  { id: "green", color: "bg-emerald-500", label: "Green" },
  { id: "sky", color: "bg-sky-500", label: "Sky" },
];

export const ThemePanel = () => {
  const [open, setOpen] = useState(false);
  const { layout, sidebarColor, colorTheme, setLayout, setSidebarColor, setColorTheme } = useTheme();

  return (
    <>
      {/* Floating Gear Button */}
      <button onClick={() => setOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[300] w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-l-xl shadow-lg flex items-center justify-center transition-all hover:w-12">
        <Settings className="w-5 h-5 animate-spin" style={{ animationDuration: "4s" }} />
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[350] bg-black/30 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)} />
      )}

      {/* Panel */}
      <div className={`fixed top-0 right-0 z-[400] h-full w-[280px] bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">Theme Settings</h3>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-4.5 h-4.5 text-gray-500" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-7 overflow-y-auto h-[calc(100%-60px)]">
          {/* Select Layout */}
          <div>
            <h4 className="text-[13px] font-bold text-gray-900 dark:text-white mb-3">Select Layout</h4>
            <div className="grid grid-cols-2 gap-3">
              <LayoutOption mode="light" active={layout === "light"} onClick={() => setLayout("light")} />
              <LayoutOption mode="dark" active={layout === "dark"} onClick={() => setLayout("dark")} />
            </div>
          </div>

          {/* Sidebar Menu Color */}
          <div>
            <h4 className="text-[13px] font-bold text-gray-900 dark:text-white mb-3">Sidebar Menu Color</h4>
            <div className="flex items-center gap-2">
              <SidebarOption mode="light" active={sidebarColor === "light"} onClick={() => setSidebarColor("light")} />
              <SidebarOption mode="dark" active={sidebarColor === "dark"} onClick={() => setSidebarColor("dark")} />
            </div>
          </div>

          {/* Color Theme */}
          <div>
            <h4 className="text-[13px] font-bold text-gray-900 dark:text-white mb-3">Color Theme</h4>
            <div className="flex items-center gap-3 flex-wrap">
              {colorOptions.map(opt => (
                <button key={opt.id} onClick={() => setColorTheme(opt.id)}
                  title={opt.label}
                  className={`w-9 h-9 rounded-full ${opt.color} flex items-center justify-center transition-all ${
                    colorTheme === opt.id ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"
                  }`}>
                  {colorTheme === opt.id && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Info */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Current Config</p>
            <div className="space-y-1.5 text-[12px] font-medium text-gray-700 dark:text-gray-300">
              <p>Layout: <span className="font-bold capitalize">{layout}</span></p>
              <p>Sidebar: <span className="font-bold capitalize">{sidebarColor}</span></p>
              <p>Theme: <span className="font-bold capitalize">{colorTheme}</span></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ── Layout Option Card ── */
const LayoutOption = ({ mode, active, onClick }: { mode: LayoutMode; active: boolean; onClick: () => void }) => (
  <button onClick={onClick}
    className={`rounded-xl border-2 p-2 transition-all ${
      active ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
    }`}>
    <div className={`w-full h-16 rounded-lg flex items-center justify-center ${
      mode === "light" ? "bg-gray-100" : "bg-gray-800"
    }`}>
      {mode === "light" ? (
        <Sun className="w-6 h-6 text-amber-500" />
      ) : (
        <Moon className="w-6 h-6 text-indigo-400" />
      )}
    </div>
    <p className={`text-[12px] font-bold mt-2 text-center capitalize ${active ? "text-blue-600" : "text-gray-600 dark:text-gray-400"}`}>{mode}</p>
  </button>
);

/* ── Sidebar Color Toggle ── */
const SidebarOption = ({ mode, active, onClick }: { mode: SidebarColor; active: boolean; onClick: () => void }) => (
  <button onClick={onClick}
    className={`px-5 py-2.5 rounded-full text-[12px] font-bold transition-all flex items-center gap-2 ${
      active
        ? "bg-blue-600 text-white shadow-md"
        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`}>
    {active && <Check className="w-3.5 h-3.5" />}
    {mode === "light" ? "Light" : "Dark"}
  </button>
);
