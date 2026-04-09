import { Plus, Search, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const employees = [
  { id: "1", name: "John Doe", email: "john@workflow.com", role: "Admin", department: "Engineering", projects: 3, initials: "JD", status: "Active" },
  { id: "2", name: "Alice Mitchell", email: "alice@workflow.com", role: "Project Manager", department: "Engineering", projects: 4, initials: "AM", status: "Active" },
  { id: "3", name: "Bob Klein", email: "bob@workflow.com", role: "Employee", department: "Design", projects: 2, initials: "BK", status: "Active" },
  { id: "4", name: "Carol Smith", email: "carol@workflow.com", role: "Employee", department: "Engineering", projects: 1, initials: "CS", status: "Active" },
  { id: "5", name: "Dave Lee", email: "dave@workflow.com", role: "Employee", department: "QA", projects: 2, initials: "DL", status: "On Leave" },
  { id: "6", name: "Eve Rodriguez", email: "eve@workflow.com", role: "Project Manager", department: "Product", projects: 3, initials: "ER", status: "Active" },
];

const roleColors: Record<string, string> = {
  Admin: "bg-primary/10 text-primary border-primary/20",
  "Project Manager": "bg-info/10 text-info border-info/20",
  Employee: "bg-muted text-muted-foreground border-border",
};

const Employees = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Employees</h1>
          <p className="page-subtitle">{employees.length} team members</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Employee</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <Avatar className="w-11 h-11">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                  {emp.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">{emp.name}</p>
                  <span className={`w-2 h-2 rounded-full ${emp.status === "Active" ? "bg-success" : "bg-warning"}`} />
                </div>
                <p className="text-xs text-muted-foreground">{emp.department}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{emp.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={roleColors[emp.role]}>{emp.role}</Badge>
                <span className="text-xs text-muted-foreground">{emp.projects} projects</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employees;
