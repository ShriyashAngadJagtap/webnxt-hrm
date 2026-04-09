import { useState } from "react";
import {
  Search, FileEdit, Trash2, Eye, ChevronLeft, ChevronRight, Plus,
  MessageSquare, Star, TrendingUp, Brain, Cake, Bell, Gift, Calendar
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";

/* ─── Data ────────────────────────────────────────────────────── */

const attritionData = [
  { dept: "Engineering", rate: 8.2 },
  { dept: "Sales", rate: 12.5 },
  { dept: "Marketing", rate: 7.8 },
  { dept: "HR", rate: 5.3 },
  { dept: "Finance", rate: 6.7 },
  { dept: "Operations", rate: 9.4 },
];

const projectStatus = [
  { name: "Project A", progress: 30, duration: "2 Months" },
  { name: "Project B", progress: 55, duration: "3 Months" },
  { name: "Project C", progress: 67, duration: "1 Month" },
  { name: "Project D", progress: 72, duration: "2 Months" },
  { name: "Project E", progress: 24, duration: "3 Months" },
  { name: "Project F", progress: 77, duration: "4 Months" },
];

const leaveRequests = [
  { employee: "John Smith", dept: "Engineering", type: "Annual Leave", dateRange: "Jul 15 - Jul 20", reason: "Family vacation", days: 6, status: "Approved" },
  { employee: "Emily Johnson", dept: "Marketing", type: "Sick Leave", dateRange: "Jul 13 - Jul 12", reason: "Medical appointment", days: 3, status: "Approved" },
  { employee: "Michael Brown", dept: "Sales", type: "Personal Leave", dateRange: "Jul 25 - Jul 25", reason: "Personal matters", days: 1, status: "Pending" },
  { employee: "Jessica Williams", dept: "HR", type: "Maternity Leave", dateRange: "Aug 1 - Oct 30", reason: "Maternity leave", days: 90, status: "Approved" },
  { employee: "David Miller", dept: "Finance", type: "Annual Leave", dateRange: "Jul 18 - Jul 22", reason: "Family event", days: 5, status: "Rejected" },
  { employee: "Sarah Davis", dept: "Engineering", type: "Sick Leave", dateRange: "Jul 13 - Jul 14", reason: "Not feeling well", days: 2, status: "Pending" },
  { employee: "Robert Wilson", dept: "Customer Support", type: "Annual Leave", dateRange: "Sep 5 - Sep 15", reason: "Vacation", days: 11, status: "Pending" },
  { employee: "Sophia Turner", dept: "Operations", type: "Annual Leave", dateRange: "Oct 2 - Oct 6", reason: "Traveling abroad", days: 5, status: "Approved" },
];

const countryClients = [
  { name: "India", value: 23, change: "+37%", changeColor: "text-green-500", color: "#8b5cf6" },
  { name: "USA", value: 32, change: "+12%", changeColor: "text-green-500", color: "#3b82f6" },
  { name: "Srilanka", value: 12, change: "-12%", changeColor: "text-red-500", color: "#f59e0b" },
  { name: "Australia", value: 32, change: "+3%", changeColor: "text-green-500", color: "#22c55e" },
];

const earningSources = [
  { name: "envato.com", pct: 1.7, color: "bg-green-500", barWidth: 85 },
  { name: "google.com", pct: 2.7, color: "bg-orange-500", barWidth: 70 },
  { name: "yahoo.com", pct: 23, color: "bg-blue-500", barWidth: 50 },
  { name: "store", pct: 10, color: "bg-red-500", barWidth: 35 },
  { name: "Others", pct: 13, color: "bg-gray-400", barWidth: 40 },
];

const weeklyAttData = [
  { day: "Mon", value: 92 },
  { day: "Tue", value: 95 },
  { day: "Wed", value: 88 },
  { day: "Thu", value: 96 },
  { day: "Fri", value: 90 },
  { day: "Sat", value: 45 },
  { day: "Sun", value: 0 },
];

const handoffNotes = [
  {
    author: "Nurse Johnson",
    time: "Today, 07:30 AM",
    message: "Patient in Room 201 complained of increased pain during night shift. Pain medication administered at 4:30 AM.",
    badge: "Urgent",
    badgeColor: "bg-red-100 text-red-600",
    avatarColor: "bg-red-500",
  },
  {
    author: "Dr. Chen",
    time: "Today, 07:45 AM",
    message: "Please monitor blood glucose levels for patient in Room 105 every 2 hours.",
    badge: "Important",
    badgeColor: "bg-blue-100 text-blue-600",
    avatarColor: "bg-blue-500",
  },
  {
    author: "Nurse Williams",
    time: "Yesterday, 09:15 PM",
    message: "Room 302 patient completed physical therapy session. Showed improvement in mobility.",
    badge: "Info",
    badgeColor: "bg-green-100 text-green-600",
    avatarColor: "bg-green-500",
  },
];

const genderData = [
  { name: "Male", value: 320, pct: "53.3%", color: "#3b82f6", icon: "♂" },
  { name: "Female", value: 270, pct: "45%", color: "#ef4444", icon: "♀" },
  { name: "Other", value: 10, pct: "1.7%", color: "#f59e0b", icon: "⚧" },
];

const deptGenderData = [
  { dept: "Engineering", male: 120, female: 45, other: 3, total: 168 },
  { dept: "Sales", male: 55, female: 65, other: 2, total: 122 },
  { dept: "Marketing", male: 30, female: 50, other: 1, total: 81 },
  { dept: "HR", male: 15, female: 35, other: 0, total: 50 },
  { dept: "Finance", male: 40, female: 30, other: 1, total: 71 },
];

const employeePerformance = [
  { month: "Jan", "Employee 1": 120, "Employee 2": 100, "Employee 3": 80 },
  { month: "Feb", "Employee 1": 200, "Employee 2": 250, "Employee 3": 130 },
  { month: "Mar", "Employee 1": 150, "Employee 2": 180, "Employee 3": 110 },
  { month: "Apr", "Employee 1": 180, "Employee 2": 160, "Employee 3": 140 },
  { month: "May", "Employee 1": 210, "Employee 2": 200, "Employee 3": 120 },
  { month: "Jun", "Employee 1": 190, "Employee 2": 220, "Employee 3": 150 },
  { month: "Jul", "Employee 1": 230, "Employee 2": 240, "Employee 3": 160 },
];

const topPerformers = [
  { rank: 1, name: "Emma Thompson", badge: "Mathematics", badgeColor: "bg-purple-100 text-purple-600", score: 96, change: "+5%", avatarColor: "bg-purple-500" },
  { rank: 2, name: "James Wilson", badge: "Science", badgeColor: "bg-green-100 text-green-600", score: 90, change: "+3%", avatarColor: "bg-green-500" },
];

const upcomingEvents = [
  { date: "Apr 9", label: "Today", labelColor: "text-red-500", name: "John Smith", dept: "Engineering" },
  { date: "Apr 14", label: "5 days", labelColor: "text-gray-400", name: "Michael Brown", dept: "Sales" },
  { date: "Apr 17", label: "8 days", labelColor: "text-gray-400", name: "David Miller", dept: "Finance" },
  { date: "Apr 21", label: "12 days", labelColor: "text-gray-400", name: "Robert Wilson", dept: "Customer Support" },
  { date: "Apr 11", label: "2 days", labelColor: "text-orange-500", name: "Laura Martinez", dept: "Legal" },
];

const leaveRequestsDetailed = [
  { id: "ID7865", name: "Jens Blincker", type: "Sick Leave", from: "05/22/2021", to: "05/27/2021", days: 6, status: "Approve" },
  { id: "ID9357", name: "Mark Harry", type: "Casual Leave", from: "06/12/2021", to: "06/15/2021", days: 4, status: "Reject" },
  { id: "ID3987", name: "Anthony Davie", type: "Marriage Leave", from: "02/02/2021", to: "02/12/2021", days: 6, status: "Pending" },
  { id: "ID2483", name: "David Perry", type: "Maternity leave", from: "01/10/2021", to: "03/10/2021", days: 90, status: "Approve" },
  { id: "ID2986", name: "John Doe", type: "Unpaid Leave", from: "03/20/2021", to: "05/22/2021", days: 3, status: "Reject" },
  { id: "ID1267", name: "Sarah Smith", type: "Sick Leave", from: "07/10/2021", to: "07/11/2021", days: 2, status: "Approve" },
];

/* ─── Component ───────────────────────────────────────────────── */

const ITEMS_PER_PAGE = 10;

const Dashboard2 = () => {
  const [leaveFilter, setLeaveFilter] = useState("");
  const [leavePage, setLeavePage] = useState(1);

  const filteredLeaves = leaveRequests.filter(
    (l) => l.employee.toLowerCase().includes(leaveFilter.toLowerCase()) ||
           l.type.toLowerCase().includes(leaveFilter.toLowerCase()) ||
           l.dept.toLowerCase().includes(leaveFilter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLeaves.length / ITEMS_PER_PAGE);
  const pagedLeaves = filteredLeaves.slice((leavePage - 1) * ITEMS_PER_PAGE, leavePage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Top KPI Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GradientCard title="New Projects" value="102" change="↑ 10% Since last month" gradient="from-green-400 to-green-600" barPct={65} />
        <GradientCard title="New Customers" value="154" change="↑ 4% Since last month" gradient="from-blue-400 to-indigo-600" barPct={72} />
        <GradientCard title="Inquiry" value="524" change="↑ 25% Since last month" gradient="from-orange-400 to-orange-600" barPct={80} />
        <GradientCard title="Earning" value="$2,453" change="↑ 6% Since last month" gradient="from-purple-500 to-purple-700" barPct={55} />
      </div>

      {/* ── Attrition + Project Status ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-[15px] font-semibold text-gray-800 mb-2">Employee Attrition Rate</h2>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div>
              <p className="text-3xl font-bold text-red-500">8.5%</p>
              <p className="text-[11px] text-gray-400">Overall Attrition Rate</p>
            </div>
            <div className="flex gap-3 ml-auto">
              <div className="px-4 py-2 rounded-lg border border-gray-200 text-center">
                <p className="text-[11px] text-gray-500">Industry Average:</p>
                <p className="text-[13px] font-semibold text-gray-700">10.2% <span className="text-green-500 text-[11px]">↑ 1.7%</span></p>
              </div>
              <div className="px-4 py-2 rounded-lg border border-gray-200 text-center">
                <p className="text-[11px] text-gray-500">Previous Year:</p>
                <p className="text-[13px] font-semibold text-gray-700">9.7% <span className="text-red-500 text-[11px]">↓ 1.2%</span></p>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attritionData} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="dept" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(value: number) => [`${value}%`, "Attrition"]} />
              <Bar dataKey="rate" fill="#f87171" radius={[4, 4, 0, 0]} barSize={40} label={{ position: "top", fontSize: 11, fill: "#64748b", formatter: (v: number) => `${v}%` }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Project Status</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-[11px] font-semibold text-gray-500">Projects</th>
                <th className="text-left py-2 text-[11px] font-semibold text-gray-500">Progress</th>
                <th className="text-left py-2 text-[11px] font-semibold text-gray-500">Duration</th>
              </tr>
            </thead>
            <tbody>
              {projectStatus.map((proj) => (
                <tr key={proj.name} className="border-b border-gray-50">
                  <td className="py-3 text-[13px] text-gray-700">{proj.name}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-gray-700 w-8">{proj.progress}%</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${proj.progress}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-[12px] text-gray-500">{proj.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Leave Requests + Country Clients + Earning Source ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Leave Requests Summary */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Leave Requests Summary</h2>

          <div className="grid grid-cols-4 gap-3 mb-4">
            <SummaryPill value={11} label="Total" borderColor="border-blue-400" textColor="text-blue-600" bgColor="bg-blue-50" />
            <SummaryPill value={4} label="Pending" borderColor="border-orange-400" textColor="text-orange-600" bgColor="bg-orange-50" />
            <SummaryPill value={5} label="Approved" borderColor="border-green-400" textColor="text-green-600" bgColor="bg-green-50" />
            <SummaryPill value={2} label="Rejected" borderColor="border-red-400" textColor="text-red-600" bgColor="bg-red-50" />
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filter requests..."
              value={leaveFilter}
              onChange={(e) => { setLeaveFilter(e.target.value); setLeavePage(1); }}
              className="w-full pl-9 pr-4 py-2 text-[13px] border border-gray-200 rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Leave Type</th>
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Days</th>
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedLeaves.map((req, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">
                          {req.employee.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-gray-800">{req.employee}</p>
                          <p className="text-[10px] text-gray-400">{req.dept}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-[13px] text-gray-600">{req.type}</td>
                    <td className="py-3 px-2">
                      <p className="text-[12px] text-gray-700">{req.dateRange}</p>
                      <p className="text-[10px] text-gray-400 italic">{req.reason}</p>
                    </td>
                    <td className="py-3 px-2 text-[13px] font-medium text-gray-700">{req.days}</td>
                    <td className="py-3 px-2">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        req.status === "Approved" ? "bg-green-100 text-green-600" :
                        req.status === "Pending" ? "bg-yellow-100 text-yellow-600" :
                        "bg-red-100 text-red-600"
                      }`}>{req.status}</span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-md hover:bg-blue-50 text-blue-500 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 rounded-md hover:bg-green-50 text-green-500 transition-colors"><FileEdit className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
            <span className="text-[12px] text-gray-500">Items per page:</span>
            <select className="text-[12px] border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-600">
              <option>10</option>
              <option>20</option>
            </select>
            <span className="text-[12px] text-gray-500">
              {(leavePage - 1) * ITEMS_PER_PAGE + 1} – {Math.min(leavePage * ITEMS_PER_PAGE, filteredLeaves.length)} of {filteredLeaves.length}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setLeavePage(Math.max(1, leavePage - 1))}
                disabled={leavePage === 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={() => setLeavePage(Math.min(totalPages, leavePage + 1))}
                disabled={leavePage === totalPages}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Country Clients + Earning Source */}
        <div className="lg:col-span-2 space-y-5">
          {/* Country Wise Clients */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-[15px] font-semibold text-gray-800 mb-6">Country Wise Clients</h2>
            <div className="flex justify-center">
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie data={countryClients} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" stroke="none" strokeWidth={0}>
                    {countryClients.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value: number, name: string) => [`${value} clients`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 divide-y divide-gray-100">
              {countryClients.map((c) => (
                <div key={c.name} className="flex items-center py-3.5 px-2 hover:bg-gray-50/50 rounded-lg transition-colors">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="text-[13px] font-medium text-gray-700 ml-3 flex-1">{c.name}</span>
                  <span className="text-[14px] font-bold text-gray-800 mr-3">{c.value}</span>
                  <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${
                    c.changeColor === "text-green-500" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                  }`}>{c.change}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Earning Source */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-[15px] font-semibold text-gray-800 mb-1">Earning Source</h2>
            <p className="text-2xl font-bold text-gray-800 mb-4">$90,808</p>
            <div className="space-y-3">
              {earningSources.map((src) => (
                <div key={src.name} className="flex items-center gap-3">
                  <span className="text-[12px] text-gray-600 w-24 shrink-0">{src.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div className={`h-full rounded-full ${src.color}`} style={{ width: `${src.barWidth}%` }} />
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    src.pct < 5 ? "bg-green-50 text-green-600" :
                    src.pct < 15 ? "bg-orange-50 text-orange-600" :
                    "bg-blue-50 text-blue-600"
                  }`}>{src.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Attendance Summary + Handoff Notes ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Attendance Summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[16px] font-bold text-gray-800">Attendance Summary</h2>
            <div className="text-right">
              <p className="text-[13px] font-semibold text-gray-700">April 9, 2026</p>
              <p className="text-[11px] text-gray-400">Tuesday</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-[12px] text-gray-500 font-medium mb-1">Monthly Attendance Rate</p>
            <p className="text-4xl font-bold text-green-500">95.2%</p>
          </div>

          <div>
            <p className="text-[12px] text-gray-500 font-medium mb-4">Weekly Attendance</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyAttData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1d5db" strokeOpacity={0.5} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} dy={8} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(value: number) => [`${value}%`, "Attendance"]} />
                <Bar dataKey="value" fill="#3b82f6" radius={[5, 5, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Handoff Notes */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">Handoff Notes</h2>
            <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              Add Note
            </button>
          </div>

          <div className="space-y-4">
            {handoffNotes.map((note, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                    <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                    <div className={`w-7 h-7 rounded-full ${note.avatarColor} flex items-center justify-center text-[9px] font-bold text-white`}>
                      {note.author.split(" ").map(n => n[0]).join("")}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[13px] font-semibold text-gray-800">{note.author}</p>
                      <span className="text-[11px] text-gray-400 shrink-0">{note.time}</span>
                    </div>
                    <p className="text-[12px] text-gray-500 leading-relaxed mb-2">{note.message}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${note.badgeColor}`}>
                      {note.badge}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Gender Diversity ─────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-semibold text-gray-800">Gender Diversity</h2>
          <span className="text-[12px] text-gray-400 flex items-center gap-1">👥 600 Employees</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mb-6">
          {/* Pie Chart */}
          <div className="shrink-0">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" outerRadius={90} dataKey="value" stroke="none">
                  {genderData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [`${value}`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {genderData.map((g) => (
                <span key={g.name} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1">
            <h3 className="text-[14px] font-semibold text-gray-800 mb-4">Gender Distribution</h3>
            <div className="flex flex-wrap gap-6 mb-5">
              {genderData.map((g) => (
                <div key={g.name} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: g.color }}>
                    {g.icon}
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">{g.name}</p>
                    <p className="text-[13px] font-semibold text-gray-800">{g.value} ({g.pct})</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-[11px] text-gray-400">Gender Ratio (M:F)</p>
                <p className="text-xl font-bold text-gray-800">32:27</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-[11px] text-gray-400">Diversity Score</p>
                <p className="text-xl font-bold text-green-500">84/100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Department Gender Distribution Table */}
        <h3 className="text-[14px] font-semibold text-gray-800 mb-3">Department Gender Distribution</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-2.5 px-3 text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Department</th>
                <th className="text-left py-2.5 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Male</th>
                <th className="text-left py-2.5 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Female</th>
                <th className="text-left py-2.5 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Other</th>
                <th className="text-left py-2.5 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {deptGenderData.map((row) => {
                const maxVal = Math.max(...deptGenderData.map(d => Math.max(d.male, d.female)));
                return (
                  <tr key={row.dept} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-3 text-[13px] font-medium text-gray-800">{row.dept}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-gray-700 w-8">{row.male}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden max-w-[150px]">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${(row.male / maxVal) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-gray-700 w-8">{row.female}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden max-w-[150px]">
                          <div className="h-full rounded-full bg-red-500" style={{ width: `${(row.female / maxVal) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-gray-700 w-8">{row.other}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden max-w-[150px]">
                          <div className="h-full rounded-full bg-yellow-500" style={{ width: `${(row.other / maxVal) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[13px] font-semibold text-gray-800">{row.total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Employee Performance + Upcoming Events ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Employee Performance */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">Employee Performance</h2>
            <div className="flex items-center gap-4 text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Employee 1</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Employee 2</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Employee 3</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={employeePerformance}>
              <defs>
                <linearGradient id="perfGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="perfGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="perfGrad3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, backgroundColor: "#1e293b", color: "#fff", border: "none" }} />
              <Area type="monotone" dataKey="Employee 1" stroke="#ec4899" strokeWidth={2} fill="url(#perfGrad1)" />
              <Area type="monotone" dataKey="Employee 2" stroke="#8b5cf6" strokeWidth={2} fill="url(#perfGrad2)" />
              <Area type="monotone" dataKey="Employee 3" stroke="#10b981" strokeWidth={2} fill="url(#perfGrad3)" />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-center text-[11px] text-gray-400 mt-1">Month</p>
        </div>

        {/* Upcoming Events */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Upcoming Events</h2>

          {/* Today's Events banner */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-white">
              <Gift className="w-4 h-4" />
              <span className="text-[12px] font-semibold">Today's Events</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <Cake className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-white">John Smith</p>
                <p className="text-[10px] text-white/70">Birthday</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mb-4 border-b border-gray-100">
            <button className="text-[12px] font-semibold text-gray-800 pb-2 border-b-2 border-orange-500 flex items-center gap-1">
              <Cake className="w-3.5 h-3.5" /> Birthdays <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            </button>
            <button className="text-[12px] font-medium text-gray-400 pb-2 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Anniversaries <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </button>
          </div>

          {/* Events list */}
          <div className="space-y-0">
            {upcomingEvents.map((evt, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50">
                <div className="w-12 text-center shrink-0">
                  <p className="text-[12px] font-semibold text-gray-700">{evt.date}</p>
                  <p className={`text-[10px] font-medium ${evt.labelColor}`}>{evt.label}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">
                  {evt.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-800">{evt.name}</p>
                  <p className="text-[10px] text-gray-400">{evt.dept}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 transition-colors"><MessageSquare className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 transition-colors"><Bell className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top Performing + Leave Requests Detailed ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Top Performing Employee */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">Top Performing Employee</h2>
            <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600">View All</button>
          </div>
          <div className="space-y-5">
            {topPerformers.map((emp) => (
              <div key={emp.rank} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full ${emp.rank === 1 ? "bg-yellow-400" : "bg-green-400"} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {emp.rank}
                </div>
                <div className={`w-10 h-10 rounded-full ${emp.avatarColor} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {emp.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-800">{emp.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${emp.badgeColor}`}>{emp.badge}</span>
                    <div className="flex items-center gap-1 text-gray-300">
                      <Star className="w-3 h-3" />
                      <TrendingUp className="w-3 h-3" />
                      <Brain className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] font-semibold text-green-500">↑ {emp.change}</span>
                  </div>
                </div>
                <div className="w-20 shrink-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-bold text-gray-700">{emp.score}%</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className={`h-full rounded-full ${emp.rank === 1 ? "bg-orange-500" : "bg-purple-500"}`} style={{ width: `${emp.score}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Requests Detailed Table */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">Leave Requests</h2>
            <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Employee Name</th>
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Leave Type</th>
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Leave From</th>
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Leave To</th>
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Days</th>
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequestsDetailed.map((req) => (
                  <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-2 text-[12px] text-gray-500">{req.id}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[9px] font-bold text-gray-500 shrink-0">
                          {req.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-[13px] text-gray-700">{req.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-[13px] text-gray-600">{req.type}</td>
                    <td className="py-3 px-2 text-[12px] text-gray-500">📅 {req.from}</td>
                    <td className="py-3 px-2 text-[12px] text-gray-500">📅 {req.to}</td>
                    <td className="py-3 px-2 text-[13px] font-medium text-gray-700">{req.days}</td>
                    <td className="py-3 px-2">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        req.status === "Approve" ? "bg-green-100 text-green-600" :
                        req.status === "Pending" ? "bg-yellow-100 text-yellow-600" :
                        "bg-red-100 text-red-600"
                      }`}>{req.status}</span>
                    </td>
                    <td className="py-3 px-2">
                      <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600 hover:underline transition-colors">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Sub-components ──────────────────────────────────────────── */

function GradientCard({ title, value, change, gradient, barPct }: {
  title: string; value: string; change: string; gradient: string; barPct: number;
}) {
  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-xl p-5 text-white shadow-sm`}>
      <p className="text-[12px] font-medium opacity-90">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <div className="w-full bg-white/20 rounded-full h-1.5 mt-3 mb-2">
        <div className="h-full bg-white/60 rounded-full" style={{ width: `${barPct}%` }} />
      </div>
      <p className="text-[11px] opacity-80">{change}</p>
    </div>
  );
}

function SummaryPill({ value, label, borderColor, textColor, bgColor }: {
  value: number; label: string; borderColor: string; textColor: string; bgColor: string;
}) {
  return (
    <div className={`${bgColor} border ${borderColor} rounded-xl py-3 text-center`}>
      <p className={`text-xl font-bold ${textColor}`}>{value}</p>
      <p className="text-[11px] text-gray-500">{label}</p>
    </div>
  );
}

export default Dashboard2;
