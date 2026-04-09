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
import Leave from "./pages/Leave";
import Employees from "./pages/Employees";
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
                <Route path="/leave" element={<Leave />} />
                <Route path="/employees" element={<Employees />} />
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
