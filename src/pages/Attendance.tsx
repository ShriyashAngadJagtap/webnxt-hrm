import { useState, useEffect } from "react";
import { Clock, Play, Square, Coffee, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";

const attendanceHistory = [
  { date: "Apr 07", punchIn: "09:02 AM", punchOut: "06:15 PM", hours: "8h 13m", status: "Present", overtime: "13m" },
  { date: "Apr 06", punchIn: "08:55 AM", punchOut: "05:30 PM", hours: "7h 35m", status: "Present", overtime: "-" },
  { date: "Apr 05", punchIn: "-", punchOut: "-", hours: "-", status: "Leave", overtime: "-" },
  { date: "Apr 04", punchIn: "09:10 AM", punchOut: "07:00 PM", hours: "8h 50m", status: "Present", overtime: "50m" },
  { date: "Apr 03", punchIn: "09:00 AM", punchOut: "06:00 PM", hours: "8h 00m", status: "Present", overtime: "-" },
];

const Attendance = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePunch = () => {
    if (!isPunchedIn) {
      setPunchInTime(new Date());
      setIsPunchedIn(true);
    } else {
      setIsPunchedIn(false);
      setPunchInTime(null);
    }
  };

  const getWorkHours = () => {
    if (!punchInTime) return "0h 0m";
    const diff = currentTime.getTime() - punchInTime.getTime();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Attendance</h1>
        <p className="page-subtitle">Track your work hours and attendance</p>
      </div>

      {/* Live Clock Card */}
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <p className="text-5xl font-bold text-foreground tracking-tight tabular-nums">
          {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {currentTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        <div className="mt-6">
          <Button size="lg" onClick={handlePunch} variant={isPunchedIn ? "destructive" : "default"}>
            {isPunchedIn ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPunchedIn ? "Punch Out" : "Punch In"}
          </Button>
        </div>
        {isPunchedIn && (
          <p className="text-sm text-muted-foreground mt-3">
            Punched in at {punchInTime?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Clock} title="Today's Hours" value={getWorkHours()} />
        <StatCard icon={Coffee} title="Break Time" value="45m" />
        <StatCard icon={TrendingUp} title="Overtime (Week)" value="2h 15m" change="+30m" changeType="neutral" />
        <StatCard icon={Clock} title="Avg. Hours/Day" value="8h 12m" change="This month" changeType="neutral" />
      </div>

      {/* History */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Attendance History</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Date</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Punch In</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Punch Out</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Total Hours</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Overtime</th>
            </tr>
          </thead>
          <tbody>
            {attendanceHistory.map((row) => (
              <tr key={row.date} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4 text-sm font-medium text-foreground">{row.date}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{row.punchIn}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{row.punchOut}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{row.hours}</td>
                <td className="py-3 px-4">
                  <Badge variant="outline" className={row.status === "Present" ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}>
                    {row.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{row.overtime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
