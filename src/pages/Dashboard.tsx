import { useState } from "react";
import {
  Clock, TrendingDown, GraduationCap, MoreVertical, Eye, FileDown,
  Pencil, CalendarPlus, History, Download, FileEdit, Trash2, IndianRupee, Users,
  ArrowDown, ArrowUp, Minus, FileText
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart
} from "recharts";

/* ─── Data ────────────────────────────────────────────────────── */

const departmentData = [
  { name: "HR", value: 15, color: "#3b82f6", pct: "5.9%" },
  { name: "Engineering", value: 78, color: "#22c55e", pct: "30.5%" },
  { name: "Marketing", value: 42, color: "#f59e0b", pct: "16.4%" },
  { name: "Finance", value: 30, color: "#ef4444", pct: "11.7%" },
  { name: "Operations", value: 65, color: "#8b5cf6", pct: "25.4%" },
  { name: "Others", value: 26, color: "#06b6d4", pct: "10.2%" },
];

const weeklyAttendance = [
  { day: "Mon", Present: 280, Absent: 15, Late: 10 },
  { day: "Tue", Present: 260, Absent: 20, Late: 15 },
  { day: "Wed", Present: 300, Absent: 10, Late: 8 },
  { day: "Thu", Present: 270, Absent: 18, Late: 12 },
  { day: "Fri", Present: 250, Absent: 22, Late: 18 },
];

const departmentBars = [
  { name: "Engineering", count: 42, color: "#3b82f6" },
  { name: "Sales", count: 36, color: "#22c55e" },
  { name: "Marketing", count: 25, color: "#f59e0b" },
  { name: "Finance", count: 20, color: "#ef4444" },
  { name: "HR", count: 14, color: "#8b5cf6" },
  { name: "Operations", count: 19, color: "#06b6d4" },
];

const leaveUsers = [
  { name: "John Doe", role: "Senior Developer", dept: "Engineering", initials: "JD", color: "bg-blue-500" },
  { name: "Jane Smith", role: "Product Manager", dept: "Marketing", initials: "JS", color: "bg-green-500" },
  { name: "Mike Johnson", role: "HR Specialist", dept: "Human Resources", initials: "MJ", color: "bg-purple-500" },
];

const leaveData = [
  { label: "Annual Leave", used: 5, total: 20, daysLeft: "15 days left", badgeColor: "bg-blue-50 text-blue-500", color: "bg-blue-500" },
  { label: "Sick Leave", used: 2, total: 10, daysLeft: "8 days left", badgeColor: "bg-orange-50 text-orange-500", color: "bg-red-500" },
  { label: "Personal Leave", used: 1, total: 5, daysLeft: "4 days left", badgeColor: "bg-orange-50 text-orange-500", color: "bg-purple-500" },
];

const recentActivities = [
  {
    title: "Attendance Irregularity",
    status: "pending",
    statusColor: "bg-orange-100 text-orange-600",
    description: "Late arrival reported for the third time this month",
    user: "Sarah Williams",
    time: "3 days ago",
    dotColor: "bg-red-500",
  },
  {
    title: "Payroll Processing Complete",
    status: "completed",
    statusColor: "bg-green-100 text-green-600",
    description: "Monthly payroll has been processed and approved",
    user: "David Brown",
    time: "5 days ago",
    dotColor: "bg-blue-500",
  },
  {
    title: "Training Program Completed",
    status: "completed",
    statusColor: "bg-green-100 text-green-600",
    description: "Successfully completed the leadership training program",
    user: "Jane Smith",
    time: "7 days ago",
    dotColor: "bg-green-500",
  },
];

const projectSurveyData = [
  { month: "2023", "Project A": 30, "Project B": 20, "Project C": 25 },
  { month: "Feb'23", "Project A": 35, "Project B": 28, "Project C": 22 },
  { month: "Mar'23", "Project A": 45, "Project B": 32, "Project C": 30 },
  { month: "Apr'23", "Project A": 40, "Project B": 35, "Project C": 28 },
  { month: "May'23", "Project A": 50, "Project B": 30, "Project C": 35 },
  { month: "Jun'23", "Project A": 55, "Project B": 40, "Project C": 32 },
  { month: "Jul'23", "Project A": 48, "Project B": 38, "Project C": 40 },
  { month: "Aug'23", "Project A": 52, "Project B": 42, "Project C": 35 },
  { month: "Sep'23", "Project A": 45, "Project B": 35, "Project C": 30 },
  { month: "Oct'23", "Project A": 55, "Project B": 45, "Project C": 38 },
  { month: "Nov'23", "Project A": 50, "Project B": 40, "Project C": 42 },
];

const invoices = [
  { no: "#IN7865", client: "John Doe", dueDate: "12/05/2016", status: "Paid", total: "₹41,500" },
  { no: "#IN7866", client: "Sarah Smith", dueDate: "01/15/2017", status: "Pending", total: "₹99,600" },
  { no: "#IN7867", client: "Mike Wilson", dueDate: "02/20/2017", status: "Paid", total: "₹62,250" },
  { no: "#IN7868", client: "Emily Davis", dueDate: "03/10/2017", status: "Overdue", total: "₹1,74,300" },
];

const dailyBillData = [
  { day: "Mon", amount: 100 },
  { day: "Tue", amount: 130 },
  { day: "Wed", amount: 90 },
  { day: "Thu", amount: 150 },
  { day: "Fri", amount: 120 },
  { day: "Sat", amount: 80 },
  { day: "Sun", amount: 110 },
];

const projects = [
  { name: "Project A", team: ["bg-blue-500", "bg-pink-500", "bg-green-500"], leader: "John Doe", priority: "Medium", openTask: 19, completedTask: 10, status: "Pending" },
  { name: "Project B", team: ["bg-purple-500", "bg-orange-500"], leader: "Sarah Smith", priority: "Low", openTask: 25, completedTask: 18, status: "In Progress" },
  { name: "Project C", team: ["bg-cyan-500", "bg-red-500"], leader: "Olivia Brown", priority: "High", openTask: 30, completedTask: 25, status: "Completed" },
  { name: "Project D", team: ["bg-yellow-500", "bg-blue-500", "bg-pink-500"], leader: "David Martinez", priority: "Low", openTask: 15, completedTask: 10, status: "Pending" },
  { name: "Project E", team: ["bg-green-500", "bg-purple-500", "bg-orange-500"], leader: "Ethan Green", priority: "Medium", openTask: 40, completedTask: 30, status: "Completed" },
  { name: "Project F", team: ["bg-red-500", "bg-cyan-500"], leader: "Jack Robinson", priority: "High", openTask: 12, completedTask: 10, status: "In Progress" },
  { name: "Project G", team: ["bg-blue-500", "bg-yellow-500", "bg-green-500"], leader: "Ava Scott", priority: "Low", openTask: 22, completedTask: 14, status: "Completed" },
];

/* ─── Component ───────────────────────────────────────────────── */

const Dashboard = () => {
  const [selectedLeaveUser, setSelectedLeaveUser] = useState(0);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Top KPI Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KPICard
          icon={<Clock className="w-5 h-5" />}
          iconBg="bg-green-50 text-green-500"
          title="Average Time to Hire"
          value="18"
          unit="days"
          subtitle="vs last month"
          badge="+2.5%"
          badgeColor="bg-green-50 text-green-600"
          sparkColor="#22c55e"
        />
        <KPICard
          icon={<TrendingDown className="w-5 h-5" />}
          iconBg="bg-red-50 text-red-500"
          title="Employee Turnover Rate"
          value="4.2"
          unit="%"
          subtitle="vs last quarter"
          badge="-0.8%"
          badgeColor="bg-red-50 text-red-500"
          sparkColor="#ef4444"
          highlighted
        />
        <KPICard
          icon={<GraduationCap className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-500"
          title="Training Completion Rate"
          value="87"
          unit="%"
          subtitle="vs last quarter"
          badge="+4.3%"
          badgeColor="bg-green-50 text-green-600"
          sparkColor="#3b82f6"
        />
      </div>

      {/* ── Middle Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Employee Summary */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">Employee Summary</h2>
            <button className="p-1 rounded hover:bg-gray-100"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="space-y-4 min-w-[160px]">
              <StatBubble value={256} label="Total Employees" color="bg-green-500" />
              <StatBubble value={235} label="Active Employees" color="bg-blue-500" />
              <StatBubble value={21} label="Contractors" color="bg-pink-500" />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Department Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={departmentData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" stroke="none">
                    {departmentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value: number, name: string) => [`${value} employees`, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
                {departmentData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 mt-5 pt-4 border-t border-gray-100">
            {departmentData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <span className="text-gray-800 font-semibold">{d.value} <span className="text-gray-400 font-normal">{d.pct}</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Attendance Overview</h2>
          <p className="text-[12px] text-gray-500 font-medium mb-2">Today's Attendance</p>
          <div className="grid grid-cols-4 gap-2 mb-5">
            <AttendanceCard value={215} label="Present" pct="84.5%" bg="bg-green-500" />
            <AttendanceCard value={12} label="Absent" pct="4.7%" bg="bg-red-500" />
            <AttendanceCard value={8} label="Late" pct="3.1%" bg="bg-yellow-500" />
            <AttendanceCard value={21} label="On Leave" pct="4.5%" bg="bg-blue-500" />
          </div>
          <p className="text-[12px] text-gray-500 font-medium mb-2">Weekly Attendance</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyAttendance} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Present" fill="#22c55e" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="Absent" fill="#ef4444" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="Late" fill="#f59e0b" radius={[3, 3, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-2 mt-4">
            <button className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
              <Eye className="w-3.5 h-3.5" />
              View Full Attendance History
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
              <FileDown className="w-3.5 h-3.5" />
              Generate Attendance Report
            </button>
          </div>
        </div>
      </div>

      {/* ── HR Summary + Leave Balance Row ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* HR Dashboard Summary */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">HR Dashboard Summary</h2>
            <button className="p-1 rounded hover:bg-gray-100"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="space-y-5 min-w-[200px]">
              <div>
                <p className="text-3xl font-bold text-gray-800">156</p>
                <p className="text-sm font-semibold text-green-500">Total Employees</p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">
                  Current active employees across all departments with complete profiles and documentation.
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">92%</p>
                <p className="text-sm font-semibold text-orange-500">Employee Satisfaction</p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">
                  Based on the latest quarterly employee satisfaction survey results.
                </p>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-700 text-center mb-4">Department Distribution</h3>
              <div className="space-y-3">
                {departmentBars.map((dept) => (
                  <div key={dept.name} className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-500 w-20 text-right shrink-0">{dept.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(dept.count / 42) * 100}%`, backgroundColor: dept.color }} />
                    </div>
                    <span className="text-[12px] font-semibold text-gray-700 w-6 text-right">{dept.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Leave Balance */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Leave Balance</h2>
          <div className="flex gap-2 mb-5 flex-wrap">
            {leaveUsers.map((user, i) => (
              <button
                key={user.name}
                onClick={() => setSelectedLeaveUser(i)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                  selectedLeaveUser === i ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                <span className={`w-5 h-5 rounded-full ${selectedLeaveUser === i ? "bg-white/20" : user.color} flex items-center justify-center text-[9px] text-white font-bold`}>
                  {user.initials}
                </span>
                {user.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-12 h-12 rounded-full ${leaveUsers[selectedLeaveUser].color} flex items-center justify-center text-white font-bold text-sm`}>
              {leaveUsers[selectedLeaveUser].initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{leaveUsers[selectedLeaveUser].name}</p>
              <p className="text-[11px] text-gray-400">{leaveUsers[selectedLeaveUser].role}</p>
              <p className="text-[11px] text-gray-400">{leaveUsers[selectedLeaveUser].dept}</p>
            </div>
          </div>

          {/* Leave rows with days-left badges */}
          <div className="space-y-3.5">
            {leaveData.map((leave) => (
              <div key={leave.label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${leave.color}`} />
                    <span className="text-[12px] font-medium text-gray-700">{leave.label}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${leave.badgeColor}`}>
                    {leave.daysLeft}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className={`h-full rounded-full ${leave.color}`} style={{ width: `${(leave.used / leave.total) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-400 w-20 text-right">{leave.used} used &nbsp; {leave.total} total</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
            <button className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
              <CalendarPlus className="w-3.5 h-3.5" />
              Apply Leave
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
              <History className="w-3.5 h-3.5" />
              Leave History
            </button>
          </div>
        </div>
      </div>

      {/* ── Recent Activities + Right Cards Row ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Recent Activities */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-[15px] font-semibold text-gray-800">Recent Activities</h2>
              <p className="text-[11px] text-gray-400">Latest HR activities and notifications</p>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded hover:bg-gray-100"><Pencil className="w-3.5 h-3.5 text-gray-400" /></button>
              <button className="p-1.5 rounded hover:bg-gray-100"><MoreVertical className="w-3.5 h-3.5 text-gray-400" /></button>
            </div>
          </div>

          <div className="mt-4 space-y-0">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex gap-4">
                {/* Timeline line + dot */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${activity.dotColor} shrink-0 mt-1`} />
                  {i < recentActivities.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1" />}
                </div>
                {/* Content */}
                <div className="pb-5 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-semibold text-gray-800">{activity.title}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${activity.statusColor}`}>
                      {activity.status}
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-500">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-gray-500">{activity.user.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <span className="text-[11px] text-gray-500">{activity.user}</span>
                    <span className="text-[11px] text-gray-400 ml-auto">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600 transition-colors">
              View All Activities
            </button>
          </div>
        </div>

        {/* Right column: Earning, New Clients, Download Reports */}
        <div className="lg:col-span-2 space-y-5">
          {/* Earning + New Clients */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
                <IndianRupee className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-[11px] text-gray-400 mb-0.5">Earning</p>
              <p className="text-xl font-bold text-gray-800">₹16,70,375</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-[11px] text-gray-400 mb-0.5">New Clients</p>
              <p className="text-xl font-bold text-gray-800">129</p>
            </div>
          </div>

          {/* Download Reports */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <FileDown className="w-8 h-8 text-orange-400" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-gray-800">Download Reports</h3>
                <p className="text-[12px] text-gray-400 mt-0.5">Download employee salary reports.</p>
                <button className="text-[12px] font-semibold text-orange-500 hover:text-orange-600 mt-1.5 flex items-center gap-1 transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Project Survey Row ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Project Survey */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">Project Survey</h2>
            <button className="p-1 rounded hover:bg-gray-100"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={projectSurveyData}>
              <defs>
                <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="Project A" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradA)" />
              <Area type="monotone" dataKey="Project B" stroke="#f59e0b" strokeWidth={2} fill="url(#gradB)" />
              <Area type="monotone" dataKey="Project C" stroke="#ec4899" strokeWidth={2} fill="url(#gradC)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Average Daily Bill */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">Average Daily Bill</h2>
            <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600">View All</button>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-1">129 Dollar <span className="text-[12px] font-normal text-gray-400">(Average)</span></p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dailyBillData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={20}>
                {dailyBillData.map((_, i) => (
                  <Cell key={i} fill={i === 3 ? "#3b82f6" : "#e2e8f0"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Projects Table ───────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-gray-800">Projects</h2>
          <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Project Name</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Employee Team</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Team Leaders</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Open Task</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Completed Task</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Documents</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj.name} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-3 text-[13px] font-medium text-gray-800">{proj.name}</td>
                  <td className="py-3 px-3">
                    <div className="flex -space-x-2">
                      {proj.team.map((color, i) => (
                        <div key={i} className={`w-7 h-7 rounded-full ${color} border-2 border-white flex items-center justify-center`}>
                          <span className="text-[8px] text-white font-bold">👤</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[13px] text-gray-600">{proj.leader}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      {proj.priority === "High" && <ArrowUp className="w-3.5 h-3.5 text-red-500" />}
                      {proj.priority === "Medium" && <Minus className="w-3.5 h-3.5 text-gray-400" />}
                      {proj.priority === "Low" && <ArrowDown className="w-3.5 h-3.5 text-green-500" />}
                      <span className={`text-[12px] font-medium ${
                        proj.priority === "High" ? "text-red-500" :
                        proj.priority === "Low" ? "text-green-500" : "text-gray-500"
                      }`}>{proj.priority}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[13px] text-gray-600">{proj.openTask}</td>
                  <td className="py-3 px-3 text-[13px] text-gray-600">{proj.completedTask}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      proj.status === "Completed" ? "bg-green-100 text-green-600" :
                      proj.status === "In Progress" ? "bg-blue-100 text-blue-600" :
                      "bg-orange-100 text-orange-600"
                    }`}>{proj.status}</span>
                  </td>
                  <td className="py-3 px-3">
                    <button className="p-1.5 rounded-md hover:bg-blue-50 text-blue-400 transition-colors">
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 rounded-md hover:bg-blue-50 text-blue-500 transition-colors">
                        <FileEdit className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Invoices Table ────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-gray-800">Invoices</h2>
          <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Invoice No</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Client Name</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.no} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-3 text-[13px] font-medium text-gray-800">{inv.no}</td>
                  <td className="py-3 px-3 text-[13px] text-gray-600">{inv.client}</td>
                  <td className="py-3 px-3 text-[13px] text-gray-500">📅 {inv.dueDate}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      inv.status === "Paid" ? "bg-green-100 text-green-600" :
                      inv.status === "Pending" ? "bg-yellow-100 text-yellow-600" :
                      "bg-red-100 text-red-600"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[13px] font-semibold text-gray-800">{inv.total}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-md hover:bg-blue-50 text-blue-500 transition-colors">
                        <FileEdit className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ─── Sub-components ──────────────────────────────────────────── */

function KPICard({ icon, iconBg, title, value, unit, subtitle, badge, badgeColor, sparkColor, highlighted }: {
  icon: React.ReactNode; iconBg: string; title: string; value: string; unit: string;
  subtitle: string; badge: string; badgeColor: string; sparkColor: string; highlighted?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-5 shadow-sm transition-shadow hover:shadow-md ${
      highlighted ? "bg-orange-50 border-orange-200" : "bg-white border-gray-100"
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
            {icon}
          </div>
          <div>
            <p className="text-[12px] text-gray-500">{title}</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-gray-800">{value}</span>
              <span className="text-sm text-gray-500">{unit}</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
      </div>
      <div className="mt-3 h-8 flex items-end gap-[2px]">
        {[40, 55, 35, 60, 45, 70, 50, 65, 55, 75, 60, 80].map((h, i) => (
          <div key={i} className="flex-1 rounded-t-sm opacity-60" style={{ height: `${h}%`, backgroundColor: sparkColor }} />
        ))}
      </div>
    </div>
  );
}

function StatBubble({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
        <span className="text-white text-[10px] font-bold">👤</span>
      </div>
      <div>
        <p className="text-xl font-bold text-gray-800">{value}</p>
        <p className="text-[11px] text-gray-400">{label}</p>
      </div>
    </div>
  );
}

function AttendanceCard({ value, label, pct, bg }: { value: number; label: string; pct: string; bg: string }) {
  return (
    <div className={`${bg} rounded-lg p-3 text-center text-white`}>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[10px] font-medium opacity-90">{label}</p>
      <p className="text-[10px] opacity-75">{pct}</p>
    </div>
  );
}

export default Dashboard;
