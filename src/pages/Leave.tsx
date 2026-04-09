import { Plus, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/StatCard";

const leaveBalances = [
  { type: "Casual Leave", total: 12, used: 4, remaining: 8 },
  { type: "Sick Leave", total: 10, used: 2, remaining: 8 },
  { type: "Paid Leave", total: 15, used: 5, remaining: 10 },
];

const leaveRequests = [
  { id: "1", type: "Casual", from: "Apr 14", to: "Apr 15", days: 2, reason: "Personal work", status: "Pending", appliedOn: "Apr 08" },
  { id: "2", type: "Sick", from: "Apr 05", to: "Apr 05", days: 1, reason: "Not feeling well", status: "Approved", appliedOn: "Apr 04" },
  { id: "3", type: "Paid", from: "Mar 20", to: "Mar 24", days: 5, reason: "Family vacation", status: "Approved", appliedOn: "Mar 10" },
  { id: "4", type: "Casual", from: "Feb 14", to: "Feb 14", days: 1, reason: "Personal", status: "Rejected", appliedOn: "Feb 10" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-warning/10 text-warning border-warning/20",
  Approved: "bg-success/10 text-success border-success/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const Leave = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Leave Management</h1>
          <p className="page-subtitle">Manage your leave requests and balances</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Apply Leave</Button>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {leaveBalances.map((lb) => (
          <div key={lb.type} className="stat-card">
            <p className="text-sm text-muted-foreground font-medium">{lb.type}</p>
            <div className="flex items-end gap-1 mt-2">
              <span className="text-3xl font-bold text-foreground">{lb.remaining}</span>
              <span className="text-sm text-muted-foreground mb-1">/ {lb.total}</span>
            </div>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(lb.remaining / lb.total) * 100}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{lb.used} used</p>
          </div>
        ))}
      </div>

      {/* Requests */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Leave Requests</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Type</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">From</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">To</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Days</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Reason</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((req) => (
              <tr key={req.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4 text-sm font-medium text-foreground">{req.type}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{req.from}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{req.to}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{req.days}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{req.reason}</td>
                <td className="py-3 px-4"><Badge variant="outline" className={statusColors[req.status]}>{req.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leave;
