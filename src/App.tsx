import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/ThemeContext";
import { ThemePanel } from "@/components/ThemePanel";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Dashboard2 from "./pages/Dashboard2";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Projects from "./pages/Projects";
import AddProject from "./pages/projects/AddProject";
import EditProject from "./pages/projects/EditProject";
import ProjectEstimates from "./pages/projects/ProjectEstimates";
import ProjectDetails from "./pages/projects/ProjectDetails";
import ProjectTimeline from "./pages/projects/ProjectTimeline";
import ProjectTasks from "./pages/projects/ProjectTasks";
import ProjectMembers from "./pages/projects/ProjectMembers";
import ProjectFiles from "./pages/projects/ProjectFiles";
import ProjectBudget from "./pages/projects/ProjectBudget";
import ProjectRisks from "./pages/projects/ProjectRisks";
import Tasks from "./pages/Tasks";
import Attendance from "./pages/Attendance";
import EmployeeAttendance from "./pages/attendance/EmployeeAttendance";
import AttendanceSheet from "./pages/attendance/AttendanceSheet";
import Timesheets from "./pages/attendance/Timesheets";
import OvertimeRequests from "./pages/attendance/OvertimeRequests";
import ShiftPlanning from "./pages/attendance/ShiftPlanning";
import RemoteWfh from "./pages/attendance/RemoteWfh";
import Leave from "./pages/Leave";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/employees/AddEmployee";
import EditEmployee from "./pages/employees/EditEmployee";
import EmployeeShift from "./pages/employees/EmployeeShift";
import EmployeeProfile from "./pages/employees/EmployeeProfile";
import EmployeeDocuments from "./pages/employees/EmployeeDocuments";
import EmployeeAssets from "./pages/employees/EmployeeAssets";
import EmployeePerformance from "./pages/employees/EmployeePerformance";
import EmployeeExit from "./pages/employees/EmployeeExit";
import LeaveBalance from "./pages/leave/LeaveBalance";
import LeaveTypes from "./pages/leave/LeaveTypes";
import LeaveSettings from "./pages/leave/LeaveSettings";
import Budget from "./pages/Budget";
import Estimates from "./pages/Estimates";
import Risks from "./pages/Risks";
import Documents from "./pages/Documents";
import ActivityLog from "./pages/ActivityLog";
import Communication from "./pages/Communication";
import Accounts from "./pages/Accounts";
import Reports from "./pages/Reports";
import Administration from "./pages/Administration";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemePanel />
        <Routes>
          <Route path="*" element={
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard-2" element={<Dashboard2 />} />
                <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/add" element={<AddProject />} />
                <Route path="/projects/edit" element={<EditProject />} />
                <Route path="/projects/estimates" element={<ProjectEstimates />} />
                <Route path="/projects/details" element={<ProjectDetails />} />
                <Route path="/projects/timeline" element={<ProjectTimeline />} />
                <Route path="/projects/tasks" element={<ProjectTasks />} />
                <Route path="/projects/members" element={<ProjectMembers />} />
                <Route path="/projects/files" element={<ProjectFiles />} />
                <Route path="/projects/budget" element={<ProjectBudget />} />
                <Route path="/projects/risks" element={<ProjectRisks />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/attendance/employee" element={<EmployeeAttendance />} />
                <Route path="/attendance/sheet" element={<AttendanceSheet />} />
                <Route path="/attendance/timesheets" element={<Timesheets />} />
                <Route path="/attendance/overtime" element={<OvertimeRequests />} />
                <Route path="/attendance/shift-planning" element={<ShiftPlanning />} />
                <Route path="/attendance/wfh" element={<RemoteWfh />} />
                <Route path="/leave" element={<Leave />} />
                <Route path="/leave/balance" element={<LeaveBalance />} />
                <Route path="/leave/types" element={<LeaveTypes />} />
                <Route path="/leave/settings" element={<LeaveSettings />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/employees/add" element={<AddEmployee />} />
                <Route path="/employees/edit" element={<EditEmployee />} />
                <Route path="/employees/shift" element={<EmployeeShift />} />
                <Route path="/employees/profile" element={<EmployeeProfile />} />
                <Route path="/employees/documents" element={<EmployeeDocuments />} />
                <Route path="/employees/assets" element={<EmployeeAssets />} />
                <Route path="/employees/performance" element={<EmployeePerformance />} />
                <Route path="/employees/exit" element={<EmployeeExit />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/estimates" element={<Estimates />} />
                <Route path="/risks" element={<Risks />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/activity" element={<ActivityLog />} />
                <Route path="/communication" element={<Communication />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/administration" element={<Administration />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
