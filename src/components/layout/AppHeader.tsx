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
  "/employees": "Employees",
  "/budget": "Payroll & Budget",
  "/estimates": "Estimates",
  "/risks": "Risks & Issues",
  "/documents": "Documents",
  "/activity": "Activity Log",
  "/settings": "Settings",
};

export const AppHeader = () => {
  const location = useLocation();
  const currentPage = pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-[15px] font-semibold text-gray-800">{currentPage}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-1.5 text-[12px] text-gray-400 mr-4">
          <span>Home</span>
          <span>›</span>
          <span className="text-gray-600">{currentPage}</span>
        </div>

        {/* Fullscreen */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors ml-1">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs font-semibold">
                SJ
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700 hidden md:inline">Shriyash Jagtap</span>
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
