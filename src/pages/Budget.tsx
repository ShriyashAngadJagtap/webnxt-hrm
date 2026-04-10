import { IndianRupee, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/StatCard";

const transactions = [
  { id: "1", description: "Design software licenses", category: "Software", amount: 199200, status: "Approved", date: "Apr 07", project: "Website Redesign" },
  { id: "2", description: "Cloud hosting Q2", category: "Infrastructure", amount: 415000, status: "Pending", date: "Apr 06", project: "All Projects" },
  { id: "3", description: "Contractor payment", category: "Personnel", amount: 705500, status: "Approved", date: "Apr 05", project: "Mobile App v2.0" },
  { id: "4", description: "Marketing materials", category: "Marketing", amount: 99600, status: "Rejected", date: "Apr 04", project: "Website Redesign" },
  { id: "5", description: "QA testing tools", category: "Software", amount: 66400, status: "Approved", date: "Apr 03", project: "Security Audit" },
  { id: "6", description: "Training budget", category: "HR", amount: 249000, status: "Pending", date: "Apr 02", project: "All Projects" },
];

const statusColors: Record<string, string> = {
  Approved: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const fmtINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const Budget = () => {
  const totalBudget = 1_66_00_000;
  const usedBudget = 1_05_82_500;
  const remainingBudget = totalBudget - usedBudget;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Budget Management</h1>
          <p className="page-subtitle">Track spending and manage budgets</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Transaction</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={IndianRupee} title="Total Budget" value={fmtINR(totalBudget)} />
        <StatCard icon={TrendingDown} title="Used" value={fmtINR(usedBudget)} change={`${((usedBudget / totalBudget) * 100).toFixed(1)}% utilized`} changeType="neutral" />
        <StatCard icon={TrendingUp} title="Remaining" value={fmtINR(remainingBudget)} change={`${((remainingBudget / totalBudget) * 100).toFixed(1)}% available`} changeType="positive" />
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Budget Utilization</span>
          <span className="text-sm text-muted-foreground">{((usedBudget / totalBudget) * 100).toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(usedBudget / totalBudget) * 100}%` }} />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Description</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Category</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Project</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Amount</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4 text-sm font-medium text-foreground">{t.description}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{t.category}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{t.project}</td>
                <td className="py-3 px-4 text-sm font-semibold text-foreground">{fmtINR(t.amount)}</td>
                <td className="py-3 px-4"><Badge variant="outline" className={statusColors[t.status]}>{t.status}</Badge></td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Budget;
