import { Plus, Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const tasks = [
  { id: "1", title: "Design landing page mockup", project: "Website Redesign", assignee: "John Doe", priority: "High", status: "In Progress", progress: 60, dueDate: "Apr 15" },
  { id: "2", title: "API endpoint documentation", project: "CRM Integration", assignee: "Alice M.", priority: "Medium", status: "Todo", progress: 0, dueDate: "Apr 18" },
  { id: "3", title: "User testing round 2", project: "Mobile App v2.0", assignee: "Bob K.", priority: "High", status: "In Progress", progress: 30, dueDate: "Apr 12" },
  { id: "4", title: "Database schema review", project: "Data Migration", assignee: "Carol S.", priority: "Low", status: "Todo", progress: 0, dueDate: "Apr 25" },
  { id: "5", title: "Performance optimization", project: "Website Redesign", assignee: "Dave L.", priority: "Medium", status: "Done", progress: 100, dueDate: "Apr 10" },
  { id: "6", title: "Setup CI/CD pipeline", project: "API Gateway", assignee: "Grace H.", priority: "High", status: "In Progress", progress: 80, dueDate: "Apr 14" },
  { id: "7", title: "Write unit tests", project: "Mobile App v2.0", assignee: "Eve R.", priority: "Medium", status: "Todo", progress: 0, dueDate: "Apr 20" },
  { id: "8", title: "Security patch deployment", project: "Security Audit", assignee: "Frank T.", priority: "High", status: "Done", progress: 100, dueDate: "Apr 08" },
];

const priorityColors: Record<string, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Low: "bg-muted text-muted-foreground border-border",
};

const statusColors: Record<string, string> = {
  Todo: "bg-muted text-muted-foreground border-border",
  "In Progress": "bg-info/10 text-info border-info/20",
  Done: "bg-success/10 text-success border-success/20",
};

const Tasks = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Tasks</h1>
          <p className="page-subtitle">{tasks.length} tasks across all projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1" /> Filter</Button>
          <Button variant="outline" size="sm"><SortAsc className="w-4 h-4 mr-1" /> Sort</Button>
          <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Task</Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Task</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Project</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Assignee</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Progress</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Due</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer">
                <td className="py-3 px-4 text-sm font-medium text-foreground">{task.title}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{task.project}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{task.assignee}</td>
                <td className="py-3 px-4"><Badge variant="outline" className={priorityColors[task.priority]}>{task.priority}</Badge></td>
                <td className="py-3 px-4"><Badge variant="outline" className={statusColors[task.status]}>{task.status}</Badge></td>
                <td className="py-3 px-4 w-32">
                  <div className="flex items-center gap-2">
                    <Progress value={task.progress} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground w-8">{task.progress}%</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{task.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
