import { Plus, AlertTriangle, Shield, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const risks = [
  { id: "1", description: "Third-party API deprecation may break integrations", type: "Risk", impact: "High", probability: "Medium", status: "Open", owner: "Alice M.", project: "CRM Integration" },
  { id: "2", description: "Login page not loading on Safari mobile", type: "Issue", impact: "High", probability: "-", status: "Open", owner: "Bob K.", project: "Mobile App v2.0" },
  { id: "3", description: "Budget overrun possible due to scope changes", type: "Risk", impact: "Medium", probability: "High", status: "Open", owner: "Carol S.", project: "Website Redesign" },
  { id: "4", description: "Missing data validation on import endpoint", type: "Issue", impact: "Medium", probability: "-", status: "Mitigated", owner: "Dave L.", project: "Data Migration" },
  { id: "5", description: "Key developer departure risk", type: "Risk", impact: "High", probability: "Low", status: "Open", owner: "Eve R.", project: "API Gateway" },
  { id: "6", description: "SSL certificate expiry in 30 days", type: "Issue", impact: "High", probability: "-", status: "Closed", owner: "Frank T.", project: "Security Audit" },
];

const impactColors: Record<string, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Low: "bg-muted text-muted-foreground border-border",
};

const statusColors: Record<string, string> = {
  Open: "bg-destructive/10 text-destructive border-destructive/20",
  Mitigated: "bg-warning/10 text-warning border-warning/20",
  Closed: "bg-success/10 text-success border-success/20",
};

const typeIcons: Record<string, typeof AlertTriangle> = {
  Risk: Shield,
  Issue: Bug,
};

const Risks = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Risks & Issues</h1>
          <p className="page-subtitle">Track and manage project risks and issues</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Entry</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-muted-foreground">Open</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{risks.filter(r => r.status === "Open").length}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-warning" />
            <span className="text-sm text-muted-foreground">Mitigated</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{risks.filter(r => r.status === "Mitigated").length}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-success" />
            <span className="text-sm text-muted-foreground">Closed</span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{risks.filter(r => r.status === "Closed").length}</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Type</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Description</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Impact</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Probability</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Owner</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Project</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((risk) => {
              const TypeIcon = typeIcons[risk.type];
              return (
                <tr key={risk.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <TypeIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{risk.type}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground max-w-xs truncate">{risk.description}</td>
                  <td className="py-3 px-4"><Badge variant="outline" className={impactColors[risk.impact]}>{risk.impact}</Badge></td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{risk.probability}</td>
                  <td className="py-3 px-4"><Badge variant="outline" className={statusColors[risk.status]}>{risk.status}</Badge></td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{risk.owner}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{risk.project}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Risks;
