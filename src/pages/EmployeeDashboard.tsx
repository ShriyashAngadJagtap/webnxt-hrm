import { useState } from "react";
import {
  Ticket, CheckCircle2, FolderKanban, CalendarDays, FileText, MoreVertical,
  Square, CheckSquare, ArrowUp, ArrowDown, Minus,
  ClipboardCheck, Truck, Smile, Code2, Bug, Award, ExternalLink
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar
} from "recharts";

/* ─── Data ────────────────────────────────────────────────────── */

const weeklyHours = [
  { day: "Monday", "Work Hours": 57, "Over Hours": 63 },
  { day: "Tuesday", "Work Hours": 18, "Over Hours": 71 },
  { day: "Wednesday", "Work Hours": 33, "Over Hours": 9 },
  { day: "Thursday", "Work Hours": 41, "Over Hours": 85 },
  { day: "Friday", "Work Hours": 63, "Over Hours": 67 },
  { day: "Saturday", "Work Hours": 18, "Over Hours": 61 },
];

const projectReview = [
  { name: "Project 1", value: 35, color: "#ec4899" },
  { name: "Project 2", value: 40, color: "#3b82f6" },
  { name: "Project 3", value: 25, color: "#22c55e" },
];

const myTeam = [
  { name: "Mr. Jay Soni", role: "Manager", status: "Available", avatarColor: "bg-purple-500" },
  { name: "Ms. Sarah Smith", role: "Developer", status: "Absent", avatarColor: "bg-orange-500" },
  { name: "Ms. Megha Trivedi", role: "Tester", status: "Available", avatarColor: "bg-pink-500" },
  { name: "Mr. John Deo", role: "Designer", status: "Available", avatarColor: "bg-blue-500" },
  { name: "Mr. Jacob Ryan", role: "Developer", status: "Absent", avatarColor: "bg-green-500" },
  { name: "Mr. Jay Soni", role: "Team Leader", status: "Available", avatarColor: "bg-cyan-500" },
];

const myTasks = [
  { task: "Task A", status: "Not Started", statusColor: "bg-red-100 text-red-600", manager: "Jay Soni", progress: 10 },
  { task: "Task B", status: "Completed", statusColor: "bg-green-100 text-green-600", manager: "Sarah Smith", progress: 100 },
  { task: "Task C", status: "In Progress", statusColor: "bg-blue-100 text-blue-600", manager: "Megha Trivedi", progress: 65 },
  { task: "Task D", status: "Pending", statusColor: "bg-yellow-100 text-yellow-600", manager: "Jacob Ryan", progress: 40 },
  { task: "Task E", status: "In Progress", statusColor: "bg-blue-100 text-blue-600", manager: "Airi Satou", progress: 75 },
  { task: "Task A", status: "Not Started", statusColor: "bg-red-100 text-red-600", manager: "Angelica Ramos", progress: 5 },
];

const attendanceWeekly = [
  { day: "Mon", Present: 40, Absent: 20 },
  { day: "Tue", Present: 28, Absent: 39 },
  { day: "Wed", Present: 60, Absent: 10 },
  { day: "Thu", Present: 68, Absent: 45 },
  { day: "Fri", Present: 95, Absent: 15 },
];

const todoItems = [
  { text: "Buy groceries", priority: "Normal", priorityColor: "text-gray-400", done: false },
  { text: "Finish project report", priority: "High", priorityColor: "text-red-500", done: false },
  { text: "Clean the house", priority: "Low", priorityColor: "text-green-500", done: true },
  { text: "Call the bank", priority: "Normal", priorityColor: "text-gray-400", done: false },
  { text: "Read a book", priority: "Low", priorityColor: "text-green-500", done: false },
  { text: "Schedule doctor appoint.", priority: "High", priorityColor: "text-red-500", done: false },
  { text: "Prepare for presentation", priority: "Normal", priorityColor: "text-gray-400", done: false },
];

const ticketResolvedWeekly = [
  { day: "Mon", resolved: 80, pending: 20, escalated: 10 },
  { day: "Tue", resolved: 100, pending: 15, escalated: 5 },
  { day: "Wed", resolved: 60, pending: 25, escalated: 15 },
  { day: "Thu", resolved: 90, pending: 10, escalated: 8 },
  { day: "Fri", resolved: 75, pending: 20, escalated: 12 },
  { day: "Sat", resolved: 40, pending: 10, escalated: 5 },
];

const skills = [
  { name: "Technical Skills", level: "Advanced (85%)", pct: 85, color: "bg-blue-500" },
  { name: "Communication", level: "Advanced (75%)", pct: 75, color: "bg-green-500" },
  { name: "Problem Solving", level: "Expert (90%)", pct: 90, color: "bg-purple-500" },
  { name: "Teamwork", level: "Advanced (80%)", pct: 80, color: "bg-orange-500" },
  { name: "Leadership", level: "Intermediate (60%)", pct: 60, color: "bg-cyan-500" },
  { name: "Time Management", level: "Intermediate (70%)", pct: 70, color: "bg-pink-500" },
];

const perfMetrics = [
  { label: "Tasks Completed", value: "47 / 50 tasks", pct: 94, icon: ClipboardCheck, iconBg: "bg-blue-50 text-blue-500" },
  { label: "Project Delivery", value: "95 / 100 %", pct: 95, icon: Truck, iconBg: "bg-green-50 text-green-500" },
  { label: "Client Satisfaction", value: "92 / 100 %", pct: 92, icon: Smile, iconBg: "bg-yellow-50 text-yellow-600" },
  { label: "Code Quality", value: "88 / 100 %", pct: 88, icon: Code2, iconBg: "bg-purple-50 text-purple-500" },
  { label: "Bug Resolution Time", value: "20 / 24 hours", pct: 83, icon: Bug, iconBg: "bg-red-50 text-red-500" },
];

const certifications = [
  { title: "Angular Advanced Concepts", provider: "Google", status: "Completed", statusColor: "bg-green-100 text-green-600", completedDate: "May 15, 2025", expiresDate: "May 15, 2025", pct: 100 },
  { title: "Project Management Professional", provider: "PMI", status: "In progress", statusColor: "bg-blue-100 text-blue-600", completedDate: null, expiresDate: null, pct: 65 },
];

/* ─── Component ───────────────────────────────────────────────── */

const EmployeeDashboard = () => {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Top KPI Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard title="New Tickets" value="23" change="18% Higher Then Last Month" gradient="from-purple-500 to-purple-700" icon={<Ticket className="w-6 h-6" />} />
        <KPICard title="Ticket Resolved" value="20" change="21% Higher Then Last Month" gradient="from-green-400 to-green-600" icon={<CheckCircle2 className="w-6 h-6" />} />
        <KPICard title="Project Assigned" value="13" change="37% Higher Then Last Month" gradient="from-orange-400 to-orange-600" icon={<FolderKanban className="w-6 h-6" />} />
        <KPICard title="Available Leaves" value="34" change="10% Higher Then Last Month" gradient="from-blue-400 to-blue-600" icon={<CalendarDays className="w-6 h-6" />} />
      </div>

      {/* ── Weekly Hours + Running Project ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Weekly Working Hours */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">Weekly Working Hours</h2>
            <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600">View All</button>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyHours} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1d5db" strokeOpacity={0.4} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="Work Hours" stackId="a" fill="#4f46e5" radius={[0, 0, 0, 0]} barSize={36}
                label={{ position: "center", fontSize: 10, fill: "#fff", formatter: (v: number) => `${v}%` }}
              />
              <Bar dataKey="Over Hours" stackId="a" fill="#c7d2fe" radius={[4, 4, 0, 0]} barSize={36}
                label={{ position: "center", fontSize: 10, fill: "#4f46e5", formatter: (v: number) => `${v}%` }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Running Project Review */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Running Project Review</h2>
          <div className="flex justify-center">
            <div className="relative">
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie data={projectReview} cx="50%" cy="50%" innerRadius={65} outerRadius={100} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                    {projectReview.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[11px] text-gray-400">Total</p>
                <p className="text-xl font-bold text-gray-800">57%</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-5 mt-4">
            {projectReview.map((p) => (
              <span key={p.name} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                {p.name}
              </span>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button className="px-5 py-2 text-[12px] font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
              More Details
            </button>
          </div>
        </div>
      </div>

      {/* ── Todo + Ticket Status + Ticket Resolved ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Todo List */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">Todo List</h2>
            <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
            {todoItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5">
                {item.done ? (
                  <CheckSquare className="w-4 h-4 text-blue-500 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-gray-300 shrink-0" />
                )}
                <span className={`text-[13px] flex-1 ${item.done ? "line-through text-gray-400" : "text-gray-700"}`}>{item.text}</span>
                <div className="flex items-center gap-1">
                  {item.priority === "High" && <ArrowUp className="w-3 h-3 text-red-500" />}
                  {item.priority === "Low" && <ArrowDown className="w-3 h-3 text-green-500" />}
                  {item.priority === "Normal" && <Minus className="w-3 h-3 text-gray-400" />}
                  <span className={`text-[11px] font-medium ${item.priorityColor}`}>{item.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Status */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">Ticket Status</h2>
            <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600">View All</button>
          </div>
          <div className="flex justify-center my-4">
            <div className="relative">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={[{ value: 72 }, { value: 28 }]}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={80}
                    startAngle={90} endAngle={-270}
                    dataKey="value" stroke="none"
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#e5e7eb" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-gray-800">72%</p>
                <p className="text-[11px] text-green-500 font-semibold">Closed Ticket</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 text-center">
            <div>
              <p className="text-lg font-bold text-gray-800">67%</p>
              <p className="text-[10px] text-gray-400">New Ticket</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">33%</p>
              <p className="text-[10px] text-gray-400">Closed Ticket</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">1 Day</p>
              <p className="text-[10px] text-gray-400">Duration</p>
            </div>
          </div>
        </div>

        {/* Ticket Resolved */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">Ticket Resolved</h2>
            <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600">View All</button>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={ticketResolvedWeekly} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1d5db" strokeOpacity={0.4} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Bar dataKey="resolved" stackId="a" fill="#8b5cf6" barSize={18} radius={[0, 0, 0, 0]} />
              <Bar dataKey="pending" stackId="a" fill="#f59e0b" barSize={18} radius={[0, 0, 0, 0]} />
              <Bar dataKey="escalated" stackId="a" fill="#94a3b8" barSize={18} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-orange-600">30%</p>
              <p className="text-[10px] text-gray-500">Last Week</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-green-600">70%</p>
              <p className="text-[10px] text-gray-500">Last Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Skills + Performance + Training ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Skills & Proficiency */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">Skills & Proficiency</h2>
            <button className="p-1 rounded hover:bg-gray-100"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
          </div>
          <div className="divide-y divide-gray-50">
            {skills.map((skill) => (
              <div key={skill.name} className="py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-medium text-gray-700">{skill.name}</span>
                  <span className="text-[11px] text-gray-400">{skill.level}</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${skill.color} transition-all duration-500`} style={{ width: `${skill.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">Performance Metrics</h2>
            <button className="p-1 rounded hover:bg-gray-100"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
          </div>
          <div className="space-y-4">
            {perfMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label}>
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${metric.iconBg} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-gray-700">{metric.label}</span>
                        <span className="text-[11px] text-gray-400">{metric.value}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-11">
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div className="h-full rounded-full bg-green-500 transition-all duration-500" style={{ width: `${metric.pct}%` }} />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-600 w-8 text-right">{metric.pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Training & Certifications */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">Training & Certifications</h2>
            <button className="p-1 rounded hover:bg-gray-100"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
          </div>
          <div className="space-y-4">
            {certifications.map((cert, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-[13px] font-semibold text-gray-800">{cert.title}</p>
                    <p className="text-[11px] text-gray-400">{cert.provider}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cert.statusColor}`}>{cert.status}</span>
                </div>
                {cert.pct === 100 ? (
                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <Award className="w-3.5 h-3.5 text-green-500" />
                      <span>Completed: {cert.completedDate}</span>
                      <span>·</span>
                      <span>Expires: {cert.expiresDate}</span>
                      <span>·</span>
                      <button className="text-blue-500 flex items-center gap-0.5 hover:underline">
                        <ExternalLink className="w-3 h-3" /> View Certificate
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full bg-green-500" style={{ width: "100%" }} />
                      </div>
                      <span className="text-[10px] font-semibold text-green-600">100% Complete</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${cert.pct}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold text-blue-600">{cert.pct}% Complete</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <div key={j} className={`flex-1 h-1 rounded-full ${j < Math.floor(cert.pct / 12.5) ? "bg-blue-500" : "bg-gray-200"}`} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── My Team + My Task ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* My Team */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">My Team</h2>
            <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600">View All</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Employee Name</th>
                <th className="text-left py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {myTeam.map((member, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full ${member.avatarColor} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                        {member.name.split(" ").slice(1).map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-blue-600">{member.name}</p>
                        <p className="text-[10px] text-gray-400">{member.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      member.status === "Available" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}>{member.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* My Task */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-800">My Task</h2>
            <button className="text-[12px] font-medium text-blue-500 hover:text-blue-600">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Manager</th>
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Documents</th>
                  <th className="text-left py-2 px-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody>
                {myTasks.map((task, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-2 text-[13px] font-medium text-gray-800">{task.task}</td>
                    <td className="py-3 px-2">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${task.statusColor}`}>{task.status}</span>
                    </td>
                    <td className="py-3 px-2 text-[13px] text-gray-600">{task.manager}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${task.progress}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <button className="p-1.5 rounded-md hover:bg-blue-50 text-blue-400 transition-colors">
                        <FileText className="w-4 h-4" />
                      </button>
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

      {/* ── Attendance Chart ────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-gray-800">Attendance</h2>
          <select className="text-[12px] border border-gray-200 rounded-md px-3 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-200">
            <option>Class 1</option>
            <option>Class 2</option>
            <option>Class 3</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={attendanceWeekly} barCategoryGap="15%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1d5db" strokeOpacity={0.4} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" ticks={[0, 20, 40, 60, 80, 100]} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(value: number) => [`${value}%`]} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            <Bar dataKey="Present" stackId="a" fill="#6b8e23" barSize={110} radius={[0, 0, 0, 0]}
              label={{ position: "center", fontSize: 12, fill: "#fff", fontWeight: 600, formatter: (v: number) => `${v}` }}
            />
            <Bar dataKey="Absent" stackId="a" fill="#a4c639" barSize={110} radius={[4, 4, 0, 0]}
              label={{ position: "center", fontSize: 12, fill: "#fff", fontWeight: 600, formatter: (v: number) => `${v}` }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ─── Sub-components ──────────────────────────────────────────── */

function KPICard({ title, value, change, gradient, icon }: {
  title: string; value: string; change: string; gradient: string; icon: React.ReactNode;
}) {
  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-xl p-5 text-white shadow-sm relative overflow-hidden`}>
      <p className="text-[12px] font-medium opacity-90">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-[11px] opacity-75 mt-2">{change}</p>
      <div className="absolute top-4 right-4 opacity-30">
        {icon}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
