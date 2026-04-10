import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const estimates = [
  { id: "EST-001", client: "Acme Corp", project: "Website Redesign", amount: 25000, status: "Accepted", date: "Apr 01", validUntil: "Apr 30" },
  { id: "EST-002", client: "TechStart Inc.", project: "Mobile App Development", amount: 50000, status: "Sent", date: "Apr 05", validUntil: "May 05" },
  { id: "EST-003", client: "Global Finance", project: "CRM Integration", amount: 15000, status: "Declined", date: "Mar 20", validUntil: "Apr 20" },
  { id: "EST-004", client: "HealthPlus", project: "Data Analytics Platform", amount: 35000, status: "Sent", date: "Apr 07", validUntil: "May 07" },
];

const statusColors: Record<string, string> = {
  Sent: "bg-info/10 text-info border-info/20",
  Accepted: "bg-success/10 text-success border-success/20",
  Declined: "bg-destructive/10 text-destructive border-destructive/20",
};

const Estimates = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Estimates</h1>
          <p className="page-subtitle">Manage client estimates and proposals</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Create Estimate</Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">ID</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Client</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Project</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Amount</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Date</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Valid Until</th>
            </tr>
          </thead>
          <tbody>
            {estimates.map((est) => (
              <tr key={est.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer">
                <td className="py-3 px-4 text-sm font-medium text-primary">{est.id}</td>
                <td className="py-3 px-4 text-sm font-medium text-foreground">{est.client}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{est.project}</td>
                <td className="py-3 px-4 text-sm font-semibold text-foreground">₹{(est.amount * 83).toLocaleString("en-IN")}</td>
                <td className="py-3 px-4"><Badge variant="outline" className={statusColors[est.status]}>{est.status}</Badge></td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{est.date}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{est.validUntil}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Estimates;
