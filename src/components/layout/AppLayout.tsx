import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { useTheme } from "@/context/ThemeContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { layout } = useTheme();
  const isDark = layout === "dark";

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-[#f5f6fa]"}`}>
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader />
        <main className={`flex-1 overflow-y-auto p-5 transition-colors duration-300 ${isDark ? "bg-gray-900" : ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
