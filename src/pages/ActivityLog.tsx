import { Activity, FolderKanban, ListTodo, Users, Clock, FileText, IndianRupee } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ActivityItem {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  icon: LucideIcon;
  iconColor: string;
}

const activities: ActivityItem[] = [
  { id: "1", action: 'John Doe created project "AI Analytics"', user: "JD", timestamp: "2 minutes ago", icon: FolderKanban, iconColor: "bg-primary/10 text-primary" },
  { id: "2", action: "Alice M. completed task \"Design landing page mockup\"", user: "AM", timestamp: "15 minutes ago", icon: ListTodo, iconColor: "bg-success/10 text-success" },
  { id: "3", action: "Bob K. punched in for the day", user: "BK", timestamp: "1 hour ago", icon: Clock, iconColor: "bg-info/10 text-info" },
  { id: "4", action: "Carol S. uploaded \"API Documentation.docx\"", user: "CS", timestamp: "2 hours ago", icon: FileText, iconColor: "bg-warning/10 text-warning" },
  { id: "5", action: "Dave L. approved budget transaction ₹4,15,000", user: "DL", timestamp: "3 hours ago", icon: IndianRupee, iconColor: "bg-success/10 text-success" },
  { id: "6", action: "Eve R. added new team member Frank T.", user: "ER", timestamp: "4 hours ago", icon: Users, iconColor: "bg-primary/10 text-primary" },
  { id: "7", action: "Grace H. marked risk \"SSL expiry\" as Closed", user: "GH", timestamp: "5 hours ago", icon: Activity, iconColor: "bg-muted text-muted-foreground" },
  { id: "8", action: "John Doe updated project \"Website Redesign\" progress to 65%", user: "JD", timestamp: "Yesterday", icon: FolderKanban, iconColor: "bg-primary/10 text-primary" },
];

const ActivityLog = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Activity Log</h1>
        <p className="page-subtitle">Recent activity across the platform</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <div className="space-y-0">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4 relative">
              {/* Timeline line */}
              {index < activities.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-0 w-px bg-border" />
              )}
              <div className={`p-2 rounded-lg ${activity.iconColor} shrink-0 z-10`}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="pb-6 flex-1">
                <p className="text-sm text-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
