import { useState, useEffect } from "react";
import {
  Search, Clock, Users, UserCheck, UserX, AlertTriangle,
  Palmtree, ChevronLeft, Eye, LogIn, LogOut, Timer,
  Target, CheckCircle2, ClipboardList, FileText, X,
  CalendarDays, Coffee, TrendingUp, Briefcase, CircleDot
} from "lucide-react";

type AttendanceStatus = "Present" | "Absent" | "Late" | "On Leave" | "WFH";

interface TaskEntry {
  task: string;
  project: string;
  status: "Planned" | "In Progress" | "Completed" | "Blocked";
}

interface EmployeeAttendance {
  id: string;
  employeeName: string;
  department: string;
  role: string;
  status: AttendanceStatus;
  punchIn: string;
  punchOut: string;
  totalHours: string;
  breakTime: string;
  overtime: string;
  plannedTasks: TaskEntry[];
  completedTasks: TaskEntry[];
  punchInNote: string;
  punchOutNote: string;
}

const avatarColors: Record<string, string> = {
  "Shriyash Jagtap": "from-blue-500 to-indigo-600",
  "Jitesh Naidu": "from-emerald-500 to-teal-600",
  "Shubham Jadhav": "from-orange-500 to-amber-600",
  "John Doe": "from-violet-500 to-purple-600",
  "Sarah Smith": "from-pink-500 to-rose-500",
  "Robert Johnson": "from-cyan-500 to-blue-500",
  "Michael Brown": "from-amber-500 to-orange-500",
  "Emily Davis": "from-fuchsia-500 to-pink-600",
  "William Wilson": "from-sky-500 to-cyan-600",
  "Jessica Taylor": "from-rose-500 to-red-600",
  "David Anderson": "from-indigo-500 to-violet-600",
  "Linda Thomas": "from-teal-500 to-emerald-600",
  "James Jackson": "from-lime-500 to-green-600",
};
const getInitials = (n: string) => n.split(" ").map(w => w[0]).join("").toUpperCase();
const getColor = (n: string) => avatarColors[n] || "from-gray-400 to-gray-500";

const statusConfig: Record<AttendanceStatus, { bg: string; text: string; dot: string; icon: typeof CheckCircle2; cardBorder: string }> = {
  Present: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", icon: UserCheck, cardBorder: "border-emerald-200 hover:border-emerald-300" },
  Absent: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", icon: UserX, cardBorder: "border-red-200 hover:border-red-300" },
  Late: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", icon: AlertTriangle, cardBorder: "border-amber-200 hover:border-amber-300" },
  "On Leave": { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500", icon: Palmtree, cardBorder: "border-purple-200 hover:border-purple-300" },
  WFH: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", icon: Briefcase, cardBorder: "border-blue-200 hover:border-blue-300" },
};

const taskStatusColors: Record<string, string> = {
  Planned: "bg-blue-50 text-blue-700",
  "In Progress": "bg-amber-50 text-amber-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Blocked: "bg-red-50 text-red-700",
};

const departments = ["All", "Engineering", "Design", "Marketing", "HR", "Sales", "Finance"];

const todayAttendance: EmployeeAttendance[] = [
  {
    id: "ATT-001", employeeName: "Shriyash Jagtap", department: "Engineering", role: "Full Stack Developer",
    status: "Present", punchIn: "09:02 AM", punchOut: "06:30 PM", totalHours: "8h 28m", breakTime: "45m", overtime: "28m",
    punchInNote: "Starting with sprint review and then moving to the Leave Management module frontend.",
    punchOutNote: "Completed Leave Settings page, fixed 3 bugs in Leave Balance table, pushed all changes to main.",
    plannedTasks: [
      { task: "Complete Leave Settings page UI", project: "WebNxt HRM", status: "Completed" },
      { task: "Fix Leave Balance edit modal bug", project: "WebNxt HRM", status: "Completed" },
      { task: "Start Attendance module sidebar setup", project: "WebNxt HRM", status: "Completed" },
      { task: "Sprint review meeting at 10 AM", project: "WebNxt HRM", status: "Completed" },
    ],
    completedTasks: [
      { task: "Leave Settings page with validation and save", project: "WebNxt HRM", status: "Completed" },
      { task: "Leave Balance add button functionality", project: "WebNxt HRM", status: "Completed" },
      { task: "Attendance module — sidebar dropdown + 7 routes", project: "WebNxt HRM", status: "Completed" },
      { task: "Code review for Jitesh's API integration PR", project: "WebNxt HRM", status: "Completed" },
    ],
  },
  {
    id: "ATT-002", employeeName: "Jitesh Naidu", department: "Engineering", role: "Backend Developer",
    status: "Present", punchIn: "09:15 AM", punchOut: "06:00 PM", totalHours: "7h 45m", breakTime: "30m", overtime: "-",
    punchInNote: "Working on Supabase API endpoints for attendance tracking module.",
    punchOutNote: "Completed 4 API endpoints, pending testing for overtime calculation logic.",
    plannedTasks: [
      { task: "Build attendance API endpoints", project: "WebNxt HRM", status: "Completed" },
      { task: "Database schema for timesheets", project: "WebNxt HRM", status: "In Progress" },
      { task: "Unit tests for leave API", project: "WebNxt HRM", status: "Planned" },
    ],
    completedTasks: [
      { task: "4 REST endpoints for attendance CRUD", project: "WebNxt HRM", status: "Completed" },
      { task: "Database migration for attendance table", project: "WebNxt HRM", status: "Completed" },
    ],
  },
  {
    id: "ATT-003", employeeName: "Shubham Jadhav", department: "Design", role: "UI/UX Designer",
    status: "Late", punchIn: "10:30 AM", punchOut: "07:00 PM", totalHours: "7h 30m", breakTime: "1h", overtime: "-",
    punchInNote: "Arriving late due to doctor's appointment. Will work on attendance page mockups.",
    punchOutNote: "Finished mockups for Timesheets and Overtime pages, shared on Figma.",
    plannedTasks: [
      { task: "Design attendance module UI mockups", project: "WebNxt HRM", status: "Completed" },
      { task: "Create icon set for attendance statuses", project: "WebNxt HRM", status: "Completed" },
    ],
    completedTasks: [
      { task: "Timesheet page mockup on Figma", project: "WebNxt HRM", status: "Completed" },
      { task: "Overtime request flow wireframes", project: "WebNxt HRM", status: "Completed" },
      { task: "Updated design system with new badges", project: "WebNxt HRM", status: "Completed" },
    ],
  },
  {
    id: "ATT-004", employeeName: "John Doe", department: "Engineering", role: "Senior Developer",
    status: "Present", punchIn: "08:55 AM", punchOut: "05:45 PM", totalHours: "7h 50m", breakTime: "1h", overtime: "-",
    punchInNote: "Will focus on code refactoring and PR reviews today.",
    punchOutNote: "Reviewed 5 PRs, refactored authentication middleware, updated docs.",
    plannedTasks: [
      { task: "Refactor auth middleware", project: "WebNxt HRM", status: "Completed" },
      { task: "Review pending PRs (5)", project: "WebNxt HRM", status: "Completed" },
      { task: "Update API documentation", project: "WebNxt HRM", status: "In Progress" },
    ],
    completedTasks: [
      { task: "Auth middleware refactored", project: "WebNxt HRM", status: "Completed" },
      { task: "5 PRs reviewed and approved", project: "WebNxt HRM", status: "Completed" },
    ],
  },
  {
    id: "ATT-005", employeeName: "Sarah Smith", department: "Marketing", role: "Marketing Lead",
    status: "On Leave", punchIn: "-", punchOut: "-", totalHours: "-", breakTime: "-", overtime: "-",
    punchInNote: "", punchOutNote: "",
    plannedTasks: [], completedTasks: [],
  },
  {
    id: "ATT-006", employeeName: "Robert Johnson", department: "Engineering", role: "DevOps Engineer",
    status: "WFH", punchIn: "09:00 AM", punchOut: "", totalHours: "Working...", breakTime: "20m", overtime: "-",
    punchInNote: "Working from home today. Will handle server monitoring and CI/CD pipeline updates.",
    punchOutNote: "",
    plannedTasks: [
      { task: "Update CI/CD pipeline config", project: "WebNxt HRM", status: "In Progress" },
      { task: "Server monitoring dashboard setup", project: "Infrastructure", status: "Planned" },
      { task: "Fix staging environment issues", project: "WebNxt HRM", status: "Completed" },
    ],
    completedTasks: [
      { task: "Staging env SSL certificate renewed", project: "WebNxt HRM", status: "Completed" },
    ],
  },
  {
    id: "ATT-007", employeeName: "Michael Brown", department: "Sales", role: "Sales Manager",
    status: "Present", punchIn: "09:05 AM", punchOut: "06:15 PM", totalHours: "8h 10m", breakTime: "45m", overtime: "10m",
    punchInNote: "Client meetings scheduled for today. Will update CRM after meetings.",
    punchOutNote: "3 client meetings done, 2 leads converted, updated CRM entries.",
    plannedTasks: [
      { task: "Client meeting — Acme Corp", project: "Sales Q2", status: "Completed" },
      { task: "Client meeting — TechStart Inc", project: "Sales Q2", status: "Completed" },
      { task: "Update CRM with meeting notes", project: "Sales Q2", status: "Completed" },
    ],
    completedTasks: [
      { task: "3 client meetings conducted", project: "Sales Q2", status: "Completed" },
      { task: "2 new leads converted", project: "Sales Q2", status: "Completed" },
      { task: "CRM updated with all notes", project: "Sales Q2", status: "Completed" },
    ],
  },
  {
    id: "ATT-008", employeeName: "Emily Davis", department: "HR", role: "HR Manager",
    status: "Present", punchIn: "08:50 AM", punchOut: "05:30 PM", totalHours: "7h 40m", breakTime: "1h", overtime: "-",
    punchInNote: "Conducting interviews and processing new joinee documentation.",
    punchOutNote: "2 interviews conducted, 1 offer letter sent, updated employee records.",
    plannedTasks: [
      { task: "Interview — Frontend Dev candidate", project: "Hiring Q2", status: "Completed" },
      { task: "Interview — QA Engineer candidate", project: "Hiring Q2", status: "Completed" },
      { task: "Process Amit's joining documents", project: "HR Ops", status: "In Progress" },
    ],
    completedTasks: [
      { task: "2 interviews completed", project: "Hiring Q2", status: "Completed" },
      { task: "Offer letter sent to selected candidate", project: "Hiring Q2", status: "Completed" },
    ],
  },
  {
    id: "ATT-009", employeeName: "William Wilson", department: "Finance", role: "Accountant",
    status: "Absent", punchIn: "-", punchOut: "-", totalHours: "-", breakTime: "-", overtime: "-",
    punchInNote: "", punchOutNote: "",
    plannedTasks: [], completedTasks: [],
  },
  {
    id: "ATT-010", employeeName: "Jessica Taylor", department: "Design", role: "Graphic Designer",
    status: "Present", punchIn: "09:10 AM", punchOut: "06:00 PM", totalHours: "7h 50m", breakTime: "40m", overtime: "-",
    punchInNote: "Working on social media creatives and newsletter banner.",
    punchOutNote: "Completed 4 social media posts, newsletter banner, and 2 ad creatives.",
    plannedTasks: [
      { task: "Social media posts for April", project: "Marketing", status: "Completed" },
      { task: "Newsletter banner design", project: "Marketing", status: "Completed" },
    ],
    completedTasks: [
      { task: "4 social posts + 2 ad creatives", project: "Marketing", status: "Completed" },
      { task: "Newsletter header banner", project: "Marketing", status: "Completed" },
    ],
  },
  {
    id: "ATT-011", employeeName: "David Anderson", department: "Engineering", role: "QA Engineer",
    status: "Present", punchIn: "09:00 AM", punchOut: "06:10 PM", totalHours: "8h 10m", breakTime: "50m", overtime: "10m",
    punchInNote: "Running regression tests on Leave module and writing new test cases for Attendance.",
    punchOutNote: "Regression complete — 2 bugs found and reported. 8 new test cases written.",
    plannedTasks: [
      { task: "Regression test — Leave module", project: "WebNxt HRM", status: "Completed" },
      { task: "Write test cases for Attendance", project: "WebNxt HRM", status: "Completed" },
    ],
    completedTasks: [
      { task: "Full regression on Leave module (2 bugs found)", project: "WebNxt HRM", status: "Completed" },
      { task: "8 new test cases for Attendance module", project: "WebNxt HRM", status: "Completed" },
    ],
  },
  {
    id: "ATT-012", employeeName: "Linda Thomas", department: "Marketing", role: "Content Writer",
    status: "WFH", punchIn: "09:30 AM", punchOut: "", totalHours: "Working...", breakTime: "15m", overtime: "-",
    punchInNote: "WFH today — writing blog posts and case study content.",
    punchOutNote: "",
    plannedTasks: [
      { task: "Blog post — HRM Best Practices 2024", project: "Content", status: "In Progress" },
      { task: "Case study — Client success story", project: "Content", status: "Planned" },
    ],
    completedTasks: [],
  },
  {
    id: "ATT-013", employeeName: "James Jackson", department: "Sales", role: "Sales Executive",
    status: "Late", punchIn: "10:15 AM", punchOut: "07:30 PM", totalHours: "8h 15m", breakTime: "1h", overtime: "15m",
    punchInNote: "Late arrival due to traffic. Will follow up with pending leads.",
    punchOutNote: "Called 12 leads, scheduled 3 demos, updated pipeline in CRM.",
    plannedTasks: [
      { task: "Follow up with 15 pending leads", project: "Sales Q2", status: "In Progress" },
      { task: "Schedule product demos", project: "Sales Q2", status: "Completed" },
    ],
    completedTasks: [
      { task: "12 leads contacted, 3 demos scheduled", project: "Sales Q2", status: "Completed" },
      { task: "CRM pipeline updated", project: "Sales Q2", status: "Completed" },
    ],
  },
];

const Attendance = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filtered = todayAttendance.filter(e => {
    const ms = e.employeeName.toLowerCase().includes(search.toLowerCase());
    const dept = deptFilter === "All" || e.department === deptFilter;
    const st = statusFilter === "All" || e.status === statusFilter;
    return ms && dept && st;
  });

  const selectedEmp = selectedEmployee ? todayAttendance.find(e => e.employeeName === selectedEmployee) : null;

  const present = todayAttendance.filter(e => e.status === "Present").length;
  const absent = todayAttendance.filter(e => e.status === "Absent").length;
  const late = todayAttendance.filter(e => e.status === "Late").length;
  const onLeave = todayAttendance.filter(e => e.status === "On Leave").length;
  const wfh = todayAttendance.filter(e => e.status === "WFH").length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Today's Attendance</h1>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-extrabold text-gray-900 tabular-nums">
              {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </p>
            <p className="text-[11px] text-gray-500 font-medium">
              {currentTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard gradient="from-blue-500 to-indigo-600" icon={<Users className="w-5 h-5 text-white" />} label="Total Employees" value={String(todayAttendance.length)} sub="Workforce today" />
        <KpiCard gradient="from-emerald-500 to-teal-600" icon={<UserCheck className="w-5 h-5 text-white" />} label="Present" value={String(present)} sub={`${Math.round((present / todayAttendance.length) * 100)}% attendance`} />
        <KpiCard gradient="from-amber-500 to-orange-600" icon={<AlertTriangle className="w-5 h-5 text-white" />} label="Late" value={String(late)} sub="Arrived after 9:30" />
        <KpiCard gradient="from-red-500 to-rose-600" icon={<UserX className="w-5 h-5 text-white" />} label="Absent" value={String(absent)} sub="Not checked in" />
        <KpiCard gradient="from-purple-500 to-fuchsia-600" icon={<Palmtree className="w-5 h-5 text-white" />} label="On Leave / WFH" value={String(onLeave + wfh)} sub={`${onLeave} leave, ${wfh} remote`} />
      </div>

      {!selectedEmployee ? (
        <>
          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search employee..." className="pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl w-52 focus:outline-none focus:border-blue-400 text-gray-900 placeholder:text-gray-400" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {departments.map(dept => {
                const count = dept === "All" ? todayAttendance.length : todayAttendance.filter(e => e.department === dept).length;
                const active = deptFilter === dept;
                return (
                  <button key={dept} onClick={() => setDeptFilter(dept)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                      active ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                    }`}>
                    {dept} <span className={`ml-1 ${active ? "text-white/70" : "text-gray-400"}`}>({count})</span>
                  </button>
                );
              })}
            </div>
            {/* Status quick filters */}
            <div className="flex items-center gap-1.5 ml-auto">
              {(["All", "Present", "Late", "Absent", "On Leave", "WFH"] as const).map(st => {
                const active = statusFilter === st;
                const sc = st !== "All" ? statusConfig[st as AttendanceStatus] : null;
                return (
                  <button key={st} onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      active ? "bg-gray-800 text-white shadow-sm" : sc ? `${sc.bg} ${sc.text} hover:shadow-sm` : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    {st !== "All" && <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${active ? "bg-white" : sc?.dot}`} />}
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Employee Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(emp => {
              const sc = statusConfig[emp.status];
              const StatusIcon = sc.icon;
              const totalPlanned = emp.plannedTasks.length;
              const totalDone = emp.completedTasks.length;
              const isWorking = emp.punchIn !== "-" && !emp.punchOut;

              return (
                <div key={emp.id}
                  onClick={() => setSelectedEmployee(emp.employeeName)}
                  className={`group relative bg-white rounded-2xl border ${sc.cardBorder} hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden`}>

                  {/* Status strip */}
                  <div className={`h-1.5 bg-gradient-to-r ${
                    emp.status === "Present" ? "from-emerald-400 to-teal-500" :
                    emp.status === "Late" ? "from-amber-400 to-orange-500" :
                    emp.status === "Absent" ? "from-red-400 to-rose-500" :
                    emp.status === "On Leave" ? "from-purple-400 to-fuchsia-500" :
                    "from-blue-400 to-cyan-500"
                  }`} />

                  <div className="p-4">
                    {/* Header row */}
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColor(emp.employeeName)} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                          {getInitials(emp.employeeName)}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ${sc.dot} ring-2 ring-white`} />
                        {isWorking && <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ${sc.dot} ring-2 ring-white animate-ping`} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{emp.employeeName}</h3>
                        <p className="text-[10px] text-gray-500 font-medium">{emp.role}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold ${sc.bg} ${sc.text}`}>
                            <StatusIcon className="w-2.5 h-2.5" /> {emp.status}
                          </span>
                          <span className="text-[9px] text-gray-400 font-medium">{emp.department}</span>
                        </div>
                      </div>
                    </div>

                    {/* Punch times */}
                    {emp.punchIn !== "-" && (
                      <div className="flex items-center gap-3 mt-3 bg-gray-50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          <LogIn className="w-3 h-3 text-emerald-500" />
                          <span className="text-[10px] font-bold text-gray-700">{emp.punchIn}</span>
                        </div>
                        <div className="w-px h-3 bg-gray-300" />
                        <div className="flex items-center gap-1.5">
                          <LogOut className="w-3 h-3 text-red-500" />
                          <span className="text-[10px] font-bold text-gray-700">{emp.punchOut || "—"}</span>
                        </div>
                        <div className="w-px h-3 bg-gray-300" />
                        <div className="flex items-center gap-1.5">
                          <Timer className="w-3 h-3 text-blue-500" />
                          <span className={`text-[10px] font-bold ${isWorking ? "text-emerald-600" : "text-gray-700"}`}>{emp.totalHours}</span>
                        </div>
                      </div>
                    )}

                    {/* Task summary */}
                    {(totalPlanned > 0 || totalDone > 0) && (
                      <div className="flex items-center gap-3 mt-2.5">
                        {totalPlanned > 0 && (
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3 text-blue-500" />
                            <span className="text-[10px] text-gray-600"><strong className="text-gray-800">{totalPlanned}</strong> planned</span>
                          </div>
                        )}
                        {totalDone > 0 && (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span className="text-[10px] text-gray-600"><strong className="text-gray-800">{totalDone}</strong> done</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* View button */}
                    <button className="w-full mt-3 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] font-semibold shadow-sm shadow-blue-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-md">
                      <Eye className="w-3 h-3" /> View Details & Tasks
                    </button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16 text-gray-400 text-sm">No employees match the filter.</div>
            )}
          </div>
        </>
      ) : selectedEmp && (
        /* ═══════════════════════════════════════════
           Employee Detail View
           ═══════════════════════════════════════════ */
        <div className="space-y-5">
          <button onClick={() => setSelectedEmployee(null)} className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to All Employees
          </button>

          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl">
            <div className={`bg-gradient-to-r ${getColor(selectedEmp.employeeName)} px-7 py-6`}>
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
              <div className="absolute right-16 -bottom-6 w-20 h-20 rounded-full bg-white/5" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getColor(selectedEmp.employeeName)} flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-2 ring-white/30`}>
                    {getInitials(selectedEmp.employeeName)}
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl">{selectedEmp.employeeName}</h2>
                    <p className="text-white/60 text-[13px]">{selectedEmp.role} &bull; {selectedEmp.department}</p>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                      selectedEmp.status === "Present" ? "bg-emerald-400/20 text-emerald-100" :
                      selectedEmp.status === "Late" ? "bg-amber-400/20 text-amber-100" :
                      selectedEmp.status === "WFH" ? "bg-blue-400/20 text-blue-100" :
                      "bg-white/20 text-white/80"
                    }`}>
                      <CircleDot className="w-2.5 h-2.5" /> {selectedEmp.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatPill icon={<LogIn className="w-3.5 h-3.5 text-emerald-300" />} label="Punch In" value={selectedEmp.punchIn} />
                  <StatPill icon={<LogOut className="w-3.5 h-3.5 text-red-300" />} label="Punch Out" value={selectedEmp.punchOut || "—"} />
                  <StatPill icon={<Timer className="w-3.5 h-3.5 text-blue-300" />} label="Hours" value={selectedEmp.totalHours} />
                  <StatPill icon={<Coffee className="w-3.5 h-3.5 text-amber-300" />} label="Break" value={selectedEmp.breakTime} />
                  <StatPill icon={<TrendingUp className="w-3.5 h-3.5 text-purple-300" />} label="Overtime" value={selectedEmp.overtime} />
                </div>
              </div>
            </div>
          </div>

          {/* Punch In Note + Planned Tasks */}
          {selectedEmp.punchInNote && (
            <div className="bg-white rounded-2xl border border-emerald-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 flex items-center gap-2">
                <LogIn className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-[13px]">Punch In — What I'm Working On Today</span>
                <span className="ml-auto text-white/60 text-[11px]">Punched in at {selectedEmp.punchIn}</span>
              </div>
              <div className="p-5">
                <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <ClipboardList className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">Employee's Note</span>
                  </div>
                  <p className="text-[12px] text-gray-700 leading-relaxed">{selectedEmp.punchInNote}</p>
                </div>

                {selectedEmp.plannedTasks.length > 0 && (
                  <div>
                    <h4 className="text-[12px] font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-blue-500" /> Planned Tasks ({selectedEmp.plannedTasks.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedEmp.plannedTasks.map((task, i) => (
                        <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-100">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-gray-800 truncate">{task.task}</p>
                            <p className="text-[10px] text-gray-400">{task.project}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${taskStatusColors[task.status]}`}>{task.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Punch Out Note + Completed Tasks */}
          {selectedEmp.punchOutNote ? (
            <div className="bg-white rounded-2xl border border-blue-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-3 flex items-center gap-2">
                <LogOut className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-[13px]">Punch Out — What I Accomplished Today</span>
                <span className="ml-auto text-white/60 text-[11px]">Punched out at {selectedEmp.punchOut}</span>
              </div>
              <div className="p-5">
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[10px] font-bold text-blue-700 uppercase">End-of-Day Summary</span>
                  </div>
                  <p className="text-[12px] text-gray-700 leading-relaxed">{selectedEmp.punchOutNote}</p>
                </div>

                {selectedEmp.completedTasks.length > 0 && (
                  <div>
                    <h4 className="text-[12px] font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Completed Tasks ({selectedEmp.completedTasks.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedEmp.completedTasks.map((task, i) => (
                        <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-100">
                          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-gray-800 truncate">{task.task}</p>
                            <p className="text-[10px] text-gray-400">{task.project}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-emerald-700">{task.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : selectedEmp.punchIn !== "-" && !selectedEmp.punchOut && (
            <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-[13px]">Currently Working</span>
              </div>
              <div className="p-5 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[13px] text-gray-700 font-medium">
                  {selectedEmp.employeeName} is currently working. Punch-out summary will appear once they check out.
                </p>
              </div>
            </div>
          )}

          {/* Empty state for Absent / On Leave */}
          {selectedEmp.punchIn === "-" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                {selectedEmp.status === "On Leave" ? <Palmtree className="w-7 h-7 text-purple-400" /> : <UserX className="w-7 h-7 text-red-400" />}
              </div>
              <p className="text-[14px] font-bold text-gray-700 mb-1">{selectedEmp.status === "On Leave" ? "On Leave Today" : "Absent Today"}</p>
              <p className="text-[12px] text-gray-400">No attendance data available for today.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   KPI Card
   ═══════════════════════════════════════════ */
const KpiCard = ({ gradient, icon, label, value, sub }: {
  gradient: string; icon: React.ReactNode; label: string; value: string; sub: string;
}) => (
  <div className={`rounded-2xl bg-gradient-to-br ${gradient} px-5 py-5 text-white shadow-lg relative overflow-hidden`}>
    <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
    <div className="absolute -right-1 -bottom-6 w-16 h-16 rounded-full bg-white/5" />
    <div className="relative z-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold opacity-90">{label}</p>
          <p className="text-3xl font-extrabold mt-1">{value}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">{icon}</div>
      </div>
      <p className="text-[11px] opacity-75 mt-2">{sub}</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   Hero Stat Pill
   ═══════════════════════════════════════════ */
const StatPill = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-white/10 rounded-xl px-3 py-2 backdrop-blur-sm text-center min-w-[70px]">
    <div className="flex items-center justify-center gap-1 mb-0.5">{icon}</div>
    <p className="text-[14px] font-extrabold text-white">{value}</p>
    <p className="text-[9px] text-white/60 font-semibold">{label}</p>
  </div>
);

export default Attendance;
