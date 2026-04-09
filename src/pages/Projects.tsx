import { useState } from "react";
import { Plus, LayoutGrid, List, MoreHorizontal, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type ProjectStatus = "New" | "Running" | "On Hold" | "Finished";

interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  lead: string;
  members: number;
  deadline: string;
  budget: string;
}

const projects: Project[] = [
  { id: "1", name: "Website Redesign", description: "Complete overhaul of the company website", status: "Running", progress: 65, lead: "Alice M.", members: 5, deadline: "Apr 30, 2026", budget: "$25,000" },
  { id: "2", name: "Mobile App v2.0", description: "Native mobile app with new features", status: "Running", progress: 40, lead: "Bob K.", members: 8, deadline: "May 15, 2026", budget: "$50,000" },
  { id: "3", name: "CRM Integration", description: "Integrate CRM with existing systems", status: "On Hold", progress: 20, lead: "Carol S.", members: 3, deadline: "Jun 01, 2026", budget: "$15,000" },
  { id: "4", name: "Data Migration", description: "Migrate legacy data to new infrastructure", status: "New", progress: 0, lead: "Dave L.", members: 4, deadline: "May 20, 2026", budget: "$10,000" },
  { id: "5", name: "AI Analytics", description: "ML-powered analytics dashboard", status: "New", progress: 0, lead: "Eve R.", members: 6, deadline: "Jul 10, 2026", budget: "$35,000" },
  { id: "6", name: "Security Audit", description: "Complete security assessment and fixes", status: "Finished", progress: 100, lead: "Frank T.", members: 2, deadline: "Mar 15, 2026", budget: "$8,000" },
  { id: "7", name: "API Gateway", description: "Unified API gateway for microservices", status: "Running", progress: 75, lead: "Grace H.", members: 4, deadline: "Apr 20, 2026", budget: "$18,000" },
  { id: "8", name: "Design System", description: "Component library and design tokens", status: "Finished", progress: 100, lead: "Hank W.", members: 3, deadline: "Mar 28, 2026", budget: "$12,000" },
];

const statusColors: Record<ProjectStatus, string> = {
  New: "bg-info/10 text-info border-info/20",
  Running: "bg-success/10 text-success border-success/20",
  "On Hold": "bg-warning/10 text-warning border-warning/20",
  Finished: "bg-muted text-muted-foreground border-border",
};

const kanbanColumns: ProjectStatus[] = ["New", "Running", "On Hold", "Finished"];

const Projects = () => {
  const [view, setView] = useState<"kanban" | "list">("kanban");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Projects</h1>
          <p className="page-subtitle">{projects.length} projects total</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setView("kanban")}
              className={`p-1.5 rounded-md transition-colors ${view === "kanban" ? "bg-card shadow-sm" : ""}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-card shadow-sm" : ""}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" /> New Project
          </Button>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map((status) => {
            const columnProjects = projects.filter((p) => p.status === status);
            return (
              <div key={status} className="kanban-column flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{status}</h3>
                    <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                      {columnProjects.length}
                    </span>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {columnProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <h4 className="text-sm font-medium text-foreground mb-1">{project.name}</h4>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-1.5" />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{project.deadline}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{project.members}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Project</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Progress</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Lead</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Deadline</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Budget</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer">
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-foreground">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{project.description}</p>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className={statusColors[project.status]}>{project.status}</Badge>
                  </td>
                  <td className="py-3 px-4 w-36">
                    <div className="flex items-center gap-2">
                      <Progress value={project.progress} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground w-8">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{project.lead}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{project.deadline}</td>
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{project.budget}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Projects;
