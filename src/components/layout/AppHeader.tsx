import { Bell, Search, ChevronDown, Maximize2, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

const pageTitles: Record<string, string> = {
  "/": "HR Dashboard",
  "/dashboard-2": "Dashboard 2",
  "/employee-dashboard": "Employee Dashboard",
  "/projects": "All Projects",
  "/projects/add": "Add Project",
  "/projects/edit": "Edit Project",
  "/projects/estimates": "Estimates",
  "/projects/details": "Project Details",
  "/projects/timeline": "Project Timeline",
  "/projects/tasks": "Project Tasks",
  "/projects/members": "Project Members",
  "/projects/files": "Project Files",
  "/projects/budget": "Project Budget",
  "/projects/risks": "Project Risks & Issues",
  "/tasks": "Tasks",
  "/attendance": "Attendance",
  "/leave": "Leave Management",
  "/employees": "All Employees",
  "/employees/add": "Add Employee",
  "/employees/edit": "Edit Employee",
  "/employees/shift": "Employee Shift",
  "/employees/profile": "Employee Profile",
  "/employees/documents": "Employee Documents",
  "/employees/assets": "Employee Assets",
  "/employees/performance": "Employee Performance",
  "/employees/exit": "Employee Exit / Offboarding",
  "/budget": "Payroll & Budget",
  "/estimates": "Estimates",
  "/risks": "Risks & Issues",
  "/documents": "Documents",
  "/activity": "Activity Log",
  "/communication": "Communication",
  "/accounts": "Accounts",
  "/reports": "Reports",
  "/administration": "Administration",
  "/settings": "Settings",
};

export const AppHeader = () => {
  const location = useLocation();
  const currentPage = pageTitles[location.pathname] || "Dashboard";
  const { layout } = useTheme();
  const isDark = layout === "dark";

  return (
    <header className={`h-14 border-b flex items-center justify-between px-6 shrink-0 transition-colors duration-300 ${
      isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
    }`}>
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button className={`p-1.5 rounded-md transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
          <Menu className="w-5 h-5" />
        </button>
        <h1 className={`text-[15px] font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>{currentPage}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Breadcrumb */}
        <div className={`hidden md:flex items-center gap-1.5 text-[12px] mr-4 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          <span>Home</span>
          <span>›</span>
          <span className={isDark ? "text-gray-300" : "text-gray-600"}>{currentPage}</span>
        </div>

        {/* Fullscreen */}
        <button className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-400"}`}>
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button className={`relative p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-400"}`}>
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors ml-1 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.7)] text-white text-xs font-semibold">
                SJ
              </AvatarFallback>
            </Avatar>
            <span className={`text-sm font-medium hidden md:inline ${isDark ? "text-gray-200" : "text-gray-700"}`}>Shriyash Jagtap</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
