import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, Users, CalendarDays, Clock,
  Palmtree, UserCircle, Wallet, FileText, Crown,
  Briefcase, Building2, GraduationCap, TrendingUp,
  MessageSquare, Receipt, BarChart3, ShieldCheck,
  ChevronDown, ChevronRight, Settings, LogOut
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/",
    color: "text-orange-500",
    bg: "bg-orange-50",
    subItems: [
      { label: "Dashboard 1", path: "/" },
      { label: "Dashboard 2", path: "/dashboard-2" },
      { label: "Employee Dashboard", path: "/employee-dashboard" },
    ],
  },
  {
    icon: FolderKanban,
    label: "Projects",
    path: "/projects",
    color: "text-orange-500",
    bg: "bg-orange-50",
    subItems: [
      { label: "All Projects", path: "/projects" },
      { label: "Add Project", path: "/projects/add" },
      { label: "Edit Project", path: "/projects/edit" },
      { label: "Estimates", path: "/projects/estimates" },
      { label: "Project Details", path: "/projects/details" },
      { label: "Project Timeline", path: "/projects/timeline" },
      { label: "Project Tasks", path: "/projects/tasks" },
      { label: "Project Members", path: "/projects/members" },
      { label: "Project Files", path: "/projects/files" },
      { label: "Project Budget", path: "/projects/budget" },
      { label: "Project Risks & Issues", path: "/projects/risks" },
    ],
  },
  { icon: Users, label: "Employees", path: "/employees", color: "text-purple-500", bg: "bg-purple-50" },
  { icon: CalendarDays, label: "Leave Management", path: "/leave", color: "text-green-500", bg: "bg-green-50" },
  { icon: Clock, label: "Attendance", path: "/attendance", color: "text-teal-500", bg: "bg-teal-50" },
  { icon: Palmtree, label: "Holidays", path: "/leave", color: "text-yellow-500", bg: "bg-yellow-50" },
  { icon: UserCircle, label: "Clients", path: "/projects", color: "text-indigo-500", bg: "bg-indigo-50" },
  { icon: Wallet, label: "Payroll", path: "/budget", color: "text-pink-500", bg: "bg-pink-50" },
  { icon: FileText, label: "Documents", path: "/documents", color: "text-blue-400", bg: "bg-blue-50" },
  { icon: Crown, label: "Leaders", path: "/employees", color: "text-emerald-500", bg: "bg-emerald-50" },
  { icon: Briefcase, label: "Jobs", path: "/tasks", color: "text-orange-400", bg: "bg-orange-50" },
  { icon: Building2, label: "Departments", path: "/estimates", color: "text-violet-500", bg: "bg-violet-50" },
  { icon: GraduationCap, label: "Training", path: "/activity", color: "text-cyan-500", bg: "bg-cyan-50" },
  { icon: TrendingUp, label: "Performance", path: "/risks", color: "text-red-500", bg: "bg-red-50" },
  { icon: MessageSquare, label: "Communication", path: "/communication", color: "text-sky-500", bg: "bg-sky-50" },
  { icon: Receipt, label: "Accounts", path: "/accounts", color: "text-lime-600", bg: "bg-lime-50" },
  { icon: BarChart3, label: "Reports", path: "/reports", color: "text-amber-500", bg: "bg-amber-50" },
  { icon: ShieldCheck, label: "Administration", path: "/administration", color: "text-slate-600", bg: "bg-slate-50" },
];

export const AppSidebar = () => {
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>("Dashboard");
  const { sidebarColor } = useTheme();
  const dark = sidebarColor === "dark";

  const isActive = (item: typeof navItems[0]) => {
    if (item.subItems) {
      return item.subItems.some(sub => location.pathname === sub.path);
    }
    return location.pathname === item.path || location.pathname.startsWith(item.path + "/");
  };

  const activeAccent = "text-[hsl(var(--primary))]";
  const activeBg = dark ? "bg-white/10" : "bg-[hsl(var(--accent))]";

  return (
    <aside className={`h-screen w-[250px] flex flex-col border-r shrink-0 transition-colors duration-300 ${
      dark
        ? "bg-gray-900 border-gray-800"
        : "bg-white border-gray-100"
    }`}>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-5 h-16 border-b shrink-0 ${dark ? "border-gray-800" : "border-gray-100"}`}>
        <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
          <span className="text-white font-bold text-sm">W</span>
        </div>
        <span className={`text-[15px] font-bold ${dark ? "text-white" : "text-gray-800"}`}>WebNxt</span>
      </div>

      {/* User Profile */}
      <div className={`flex flex-col items-center py-5 border-b ${dark ? "border-gray-800" : "border-gray-100"}`}>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.7)] flex items-center justify-center text-white text-xl font-bold mb-2">
          SJ
        </div>
        <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-800"}`}>Shriyash Jagtap</p>
        <p className={`text-[11px] ${dark ? "text-gray-500" : "text-gray-400"}`}>Admin</p>
      </div>

      {/* Nav Label */}
      <div className="px-5 pt-4 pb-1">
        <p className={`text-[10px] uppercase tracking-widest font-semibold ${dark ? "text-gray-600" : "text-gray-400"}`}>Main</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item);
          const expanded = expandedItem === item.label;
          const hasSubItems = item.subItems && item.subItems.length > 0;

          const itemBase = `flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer`;
          const itemActive = `${activeBg} ${activeAccent}`;
          const itemInactive = dark
            ? "text-gray-400 hover:bg-white/5 hover:text-gray-200"
            : "text-[hsl(220,9%,46%)] hover:bg-gray-50 hover:text-[hsl(224,30%,18%)]";

          return (
            <div key={item.label}>
              {hasSubItems ? (
                <button
                  onClick={() => setExpandedItem(expanded ? null : item.label)}
                  className={`${itemBase} w-full ${active ? itemActive : itemInactive}`}
                >
                  <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? activeAccent : dark ? "text-gray-500" : item.color}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {expanded ? (
                    <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  )}
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={`${itemBase} ${active ? itemActive : itemInactive}`}
                >
                  <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? activeAccent : dark ? "text-gray-500" : item.color}`} />
                  <span>{item.label}</span>
                  {item.label === "Employees" || item.label === "Leave Management" || item.label === "Clients" ? (
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 ml-auto" />
                  ) : null}
                </Link>
              )}

              {hasSubItems && expanded && (
                <div className="ml-8 mt-0.5 space-y-0.5">
                  {item.subItems!.map((sub) => {
                    const subActive = location.pathname === sub.path;
                    return (
                      <Link
                        key={sub.label}
                        to={sub.path}
                        className={`block px-3 py-1.5 text-[12px] rounded-md transition-colors ${
                          subActive
                            ? `${activeAccent} font-medium`
                            : dark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`p-3 border-t space-y-0.5 ${dark ? "border-gray-800" : "border-gray-100"}`}>
        <Link to="/settings" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer ${
          dark ? "text-gray-400 hover:bg-white/5 hover:text-gray-200" : "text-[hsl(220,9%,46%)] hover:bg-gray-50 hover:text-[hsl(224,30%,18%)]"
        }`}>
          <Settings className={`w-[18px] h-[18px] shrink-0 ${dark ? "text-gray-500" : "text-gray-400"}`} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
};
