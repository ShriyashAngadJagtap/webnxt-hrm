import { useState } from "react";
import {
  Search, ChevronLeft, Eye, Clock, Timer, LogIn, LogOut,
  Coffee, CalendarDays, Edit3, Trash2, UserCheck, Briefcase,
  ClipboardList, BarChart3, X, User, CheckCircle2
} from "lucide-react";

type DayStatus = "Present" | "Absent" | "Leave" | "Weekend" | "Holiday" | "Half Day" | "On Duty";

interface AttendanceDay {
  date: string;
  checkIn: string;
  checkOut: string;
  workingHours: string;
  shift: string;
  status: DayStatus;
}

interface EmpProfile {
  id: string;
  name: string;
  role: string;
  empId: string;
  department: string;
  joinedDate: string;
  avgWorkingHours: string;
  avgInTime: string;
  avgOutTime: string;
  avgBreakTime: string;
  attendance: AttendanceDay[];
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

const dayStatusConfig: Record<DayStatus, { bg: string; text: string }> = {
  Present: { bg: "bg-emerald-50", text: "text-emerald-700" },
  Absent: { bg: "bg-red-50", text: "text-red-700" },
  Leave: { bg: "bg-amber-50", text: "text-amber-700" },
  Weekend: { bg: "bg-purple-50", text: "text-purple-700" },
  Holiday: { bg: "bg-pink-50", text: "text-pink-700" },
  "Half Day": { bg: "bg-cyan-50", text: "text-cyan-700" },
  "On Duty": { bg: "bg-blue-50", text: "text-blue-700" },
};

const analyticsColors: Record<string, string> = {
  Present: "#6366f1",
  "On Duty": "#06b6d4",
  "Paid Leave": "#f59e0b",
  Absent: "#ef4444",
  "Holiday Leave": "#ec4899",
  Weekend: "#8b5cf6",
};

const departments = ["All", "Engineering", "Design", "Marketing", "HR", "Sales", "Finance"];

const makeAttendance = (): AttendanceDay[] => [
  { date: "10-02-2018", checkIn: "10:28", checkOut: "19:32", workingHours: "08:04", shift: "Shift 1", status: "Present" },
  { date: "11-02-2018", checkIn: "10:02", checkOut: "19:02", workingHours: "08:00", shift: "Shift 1", status: "Present" },
  { date: "12-02-2018", checkIn: "-", checkOut: "-", workingHours: "-", shift: "Shift 1", status: "Leave" },
  { date: "13-02-2018", checkIn: "10:05", checkOut: "19:01", workingHours: "07:56", shift: "Shift 1", status: "Present" },
  { date: "14-02-2018", checkIn: "10:25", checkOut: "19:29", workingHours: "08:04", shift: "Shift 1", status: "Present" },
  { date: "15-02-2018", checkIn: "-", checkOut: "-", workingHours: "-", shift: "Shift 1", status: "Weekend" },
  { date: "16-02-2018", checkIn: "-", checkOut: "-", workingHours: "-", shift: "Shift 1", status: "Weekend" },
  { date: "17-02-2018", checkIn: "10:28", checkOut: "19:35", workingHours: "08:07", shift: "Shift 1", status: "Present" },
  { date: "18-02-2018", checkIn: "10:15", checkOut: "19:10", workingHours: "07:55", shift: "Shift 1", status: "Present" },
  { date: "19-02-2018", checkIn: "10:30", checkOut: "19:00", workingHours: "07:30", shift: "Shift 1", status: "Half Day" },
  { date: "20-02-2018", checkIn: "-", checkOut: "-", workingHours: "-", shift: "Shift 1", status: "Absent" },
  { date: "21-02-2018", checkIn: "10:00", checkOut: "19:45", workingHours: "08:45", shift: "Shift 1", status: "Present" },
  { date: "22-02-2018", checkIn: "-", checkOut: "-", workingHours: "-", shift: "Shift 1", status: "Weekend" },
  { date: "23-02-2018", checkIn: "-", checkOut: "-", workingHours: "-", shift: "Shift 1", status: "Weekend" },
  { date: "24-02-2018", checkIn: "10:20", checkOut: "19:25", workingHours: "08:05", shift: "Shift 1", status: "Present" },
];

const employees: EmpProfile[] = [
  { id: "E101", name: "Shriyash Jagtap", role: "Full Stack Developer", empId: "IMK652587UT", department: "Engineering", joinedDate: "15 March 2023", avgWorkingHours: "08:15", avgInTime: "09:05 AM", avgOutTime: "06:20 PM", avgBreakTime: "00:45", attendance: makeAttendance() },
  { id: "E102", name: "Jitesh Naidu", role: "Backend Developer", empId: "IMK652588UT", department: "Engineering", joinedDate: "01 April 2023", avgWorkingHours: "07:50", avgInTime: "09:15 AM", avgOutTime: "06:05 PM", avgBreakTime: "00:30", attendance: makeAttendance() },
  { id: "E103", name: "Shubham Jadhav", role: "UI/UX Designer", empId: "IMK652589UT", department: "Design", joinedDate: "20 May 2023", avgWorkingHours: "07:30", avgInTime: "10:00 AM", avgOutTime: "06:30 PM", avgBreakTime: "01:00", attendance: makeAttendance() },
  { id: "E104", name: "John Doe", role: "Senior Developer", empId: "IMK652590UT", department: "Engineering", joinedDate: "10 January 2018", avgWorkingHours: "08:00", avgInTime: "08:55 AM", avgOutTime: "05:55 PM", avgBreakTime: "01:00", attendance: makeAttendance() },
  { id: "E105", name: "Sarah Smith", role: "Marketing Lead", empId: "IMK652591UT", department: "Marketing", joinedDate: "05 June 2019", avgWorkingHours: "07:45", avgInTime: "09:10 AM", avgOutTime: "05:55 PM", avgBreakTime: "00:50", attendance: makeAttendance() },
  { id: "E106", name: "Robert Johnson", role: "DevOps Engineer", empId: "IMK652592UT", department: "Engineering", joinedDate: "12 August 2020", avgWorkingHours: "08:10", avgInTime: "09:00 AM", avgOutTime: "06:10 PM", avgBreakTime: "00:40", attendance: makeAttendance() },
  { id: "E107", name: "Michael Brown", role: "Sales Manager", empId: "IMK652593UT", department: "Sales", joinedDate: "22 February 2019", avgWorkingHours: "08:05", avgInTime: "09:05 AM", avgOutTime: "06:10 PM", avgBreakTime: "00:45", attendance: makeAttendance() },
  { id: "E108", name: "Emily Davis", role: "HR Manager", empId: "IMK652594UT", department: "HR", joinedDate: "18 September 2018", avgWorkingHours: "07:40", avgInTime: "08:50 AM", avgOutTime: "05:30 PM", avgBreakTime: "01:00", attendance: makeAttendance() },
  { id: "E109", name: "William Wilson", role: "Accountant", empId: "IMK652595UT", department: "Finance", joinedDate: "30 November 2020", avgWorkingHours: "07:55", avgInTime: "09:00 AM", avgOutTime: "05:55 PM", avgBreakTime: "00:50", attendance: makeAttendance() },
  { id: "E110", name: "Jessica Taylor", role: "Graphic Designer", empId: "IMK652596UT", department: "Design", joinedDate: "08 July 2021", avgWorkingHours: "07:50", avgInTime: "09:10 AM", avgOutTime: "06:00 PM", avgBreakTime: "00:40", attendance: makeAttendance() },
  { id: "E111", name: "David Anderson", role: "QA Engineer", empId: "IMK652597UT", department: "Engineering", joinedDate: "14 March 2022", avgWorkingHours: "08:10", avgInTime: "09:00 AM", avgOutTime: "06:10 PM", avgBreakTime: "00:50", attendance: makeAttendance() },
  { id: "E112", name: "Linda Thomas", role: "Content Writer", empId: "IMK652598UT", department: "Marketing", joinedDate: "25 April 2022", avgWorkingHours: "07:35", avgInTime: "09:30 AM", avgOutTime: "06:05 PM", avgBreakTime: "00:45", attendance: makeAttendance() },
  { id: "E113", name: "James Jackson", role: "Sales Executive", empId: "IMK652599UT", department: "Sales", joinedDate: "01 October 2022", avgWorkingHours: "08:00", avgInTime: "09:05 AM", avgOutTime: "06:05 PM", avgBreakTime: "01:00", attendance: makeAttendance() },
];

const EmployeeAttendance = () => {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [selectedEmp, setSelectedEmp] = useState<EmpProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"log" | "analytics">("log");

  const filtered = employees.filter(e => {
    const ms = e.name.toLowerCase().includes(search.toLowerCase());
    return ms && (deptFilter === "All" || e.department === deptFilter);
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Employee Attendance</h1>

      {!selectedEmp ? (
        <>
          {/* Search & Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search employee..." className="pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl w-52 focus:outline-none focus:border-blue-400 text-gray-900 placeholder:text-gray-400" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {departments.map(dept => {
                const count = dept === "All" ? employees.length : employees.filter(e => e.department === dept).length;
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
          </div>

          {/* Employee Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(emp => {
              const presentDays = emp.attendance.filter(d => d.status === "Present" || d.status === "Half Day" || d.status === "On Duty").length;
              const totalWorking = emp.attendance.filter(d => d.status !== "Weekend" && d.status !== "Holiday").length;
              const pct = totalWorking > 0 ? Math.round((presentDays / totalWorking) * 100) : 0;
              return (
                <div key={emp.id} onClick={() => { setSelectedEmp(emp); setActiveTab("log"); }}
                  className="group relative bg-white rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
                  <div className={`h-20 bg-gradient-to-r ${getColor(emp.name)} relative`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-white/20 backdrop-blur-sm">{emp.department}</span>
                    </div>
                  </div>
                  <div className="relative px-4 -mt-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getColor(emp.name)} flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-white`}>
                      {getInitials(emp.name)}
                    </div>
                  </div>
                  <div className="px-4 pb-4 pt-2">
                    <h3 className="text-[14px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{emp.name}</h3>
                    <p className="text-[11px] text-gray-500 font-medium">{emp.role}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {emp.empId}</span>
                      <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {emp.joinedDate}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-lg font-extrabold text-gray-900">{emp.avgWorkingHours}</p>
                        <p className="text-[9px] text-gray-400 font-semibold uppercase">Avg Hours</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-extrabold text-emerald-600">{pct}%</p>
                        <p className="text-[9px] text-gray-400 font-semibold uppercase">Attendance</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-extrabold text-blue-600">{presentDays}</p>
                        <p className="text-[9px] text-gray-400 font-semibold uppercase">Present</p>
                      </div>
                    </div>
                    <button className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[11px] font-semibold shadow-sm shadow-blue-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-md">
                      <Eye className="w-3.5 h-3.5" /> View Attendance
                    </button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && <div className="col-span-full text-center py-16 text-gray-400 text-sm">No employees found.</div>}
          </div>
        </>
      ) : (
        /* ═══════════════════════════════════════════
           Employee Detail View
           ═══════════════════════════════════════════ */
        <div className="space-y-5">
          <button onClick={() => setSelectedEmp(null)} className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to All Employees
          </button>

          {/* Profile Banner */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getColor(selectedEmp.name)} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
              {getInitials(selectedEmp.name)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{selectedEmp.name}</h2>
              <p className="text-[12px] text-gray-500">{selectedEmp.role}</p>
              <div className="flex items-center gap-4 mt-1 text-[11px] text-gray-400">
                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-blue-500" /> ID: {selectedEmp.empId}</span>
                <span className="flex items-center gap-1"><User className="w-3 h-3 text-emerald-500" /> Dept: {selectedEmp.department}</span>
                <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3 text-purple-500" /> Joined: {selectedEmp.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Avg Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <AvgCard icon={<Clock className="w-5 h-5 text-blue-600" />} label="Avg Working Hours" value={selectedEmp.avgWorkingHours} border="border-blue-200" bg="bg-blue-50/50" />
            <AvgCard icon={<LogIn className="w-5 h-5 text-emerald-600" />} label="Avg In Time" value={selectedEmp.avgInTime} border="border-emerald-200" bg="bg-emerald-50/50" />
            <AvgCard icon={<LogOut className="w-5 h-5 text-amber-600" />} label="Avg Out Time" value={selectedEmp.avgOutTime} border="border-amber-200" bg="bg-amber-50/50" />
            <AvgCard icon={<Coffee className="w-5 h-5 text-rose-600" />} label="Avg Break Time" value={selectedEmp.avgBreakTime} border="border-rose-200" bg="bg-rose-50/50" />
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button onClick={() => setActiveTab("log")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-semibold transition-all border-b-2 ${
                  activeTab === "log" ? "border-blue-600 text-blue-600 bg-blue-50/30" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}>
                <ClipboardList className="w-4 h-4" /> Attendance Log
              </button>
              <button onClick={() => setActiveTab("analytics")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-semibold transition-all border-b-2 ${
                  activeTab === "analytics" ? "border-blue-600 text-blue-600 bg-blue-50/30" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}>
                <BarChart3 className="w-4 h-4" /> Analytics
              </button>
            </div>

            {activeTab === "log" ? (
              /* Attendance Log Table */
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px]">
                      <th className="px-5 py-3 font-semibold">Date</th>
                      <th className="px-5 py-3 font-semibold">Check In</th>
                      <th className="px-5 py-3 font-semibold">Check Out</th>
                      <th className="px-5 py-3 font-semibold">Working Hours</th>
                      <th className="px-5 py-3 font-semibold">Shift</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEmp.attendance.map((day, i) => {
                      const sc = dayStatusConfig[day.status];
                      const lowHours = day.workingHours !== "-" && day.workingHours < "08:00" && day.status === "Present";
                      return (
                        <tr key={i} className="border-t border-gray-50 hover:bg-blue-50/20 transition-colors">
                          <td className="px-5 py-3.5 text-gray-800 font-medium">{day.date}</td>
                          <td className="px-5 py-3.5 text-gray-700">{day.checkIn}</td>
                          <td className="px-5 py-3.5 text-gray-700">{day.checkOut}</td>
                          <td className={`px-5 py-3.5 font-semibold ${lowHours ? "text-amber-600" : "text-gray-800"}`}>{day.workingHours}</td>
                          <td className="px-5 py-3.5 text-gray-600">{day.shift}</td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold ${sc.bg} ${sc.text}`}>
                              {day.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                              <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Analytics Tab */
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pie Chart — Attendance Distribution */}
                  <div className="border border-gray-200 rounded-2xl p-5">
                    <h3 className="text-[13px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-1 h-4 bg-blue-600 rounded-full" /> Attendance Distribution
                    </h3>
                    <AttendancePieChart data={selectedEmp.attendance} />
                  </div>

                  {/* Status Overview — Ring Charts */}
                  <div className="border border-gray-200 rounded-2xl p-5">
                    <h3 className="text-[13px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-1 h-4 bg-emerald-600 rounded-full" /> Status Overview
                    </h3>
                    <StatusOverviewRings data={selectedEmp.attendance} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Avg Stats Card
   ═══════════════════════════════════════════ */
const AvgCard = ({ icon, label, value, border, bg }: {
  icon: React.ReactNode; label: string; value: string; border: string; bg: string;
}) => (
  <div className={`rounded-2xl border ${border} ${bg} px-5 py-4 flex items-center justify-between`}>
    <div>
      <p className="text-[11px] text-gray-500 font-semibold">{label}</p>
      <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{value}</p>
    </div>
    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">{icon}</div>
  </div>
);

/* ═══════════════════════════════════════════
   Pie Chart (SVG) — Interactive with hover + labels
   ═══════════════════════════════════════════ */
const AttendancePieChart = ({ data }: { data: AttendanceDay[] }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  const counts: Record<string, number> = {};
  data.forEach(d => {
    const key = d.status === "Half Day" ? "Present" : d.status === "On Duty" ? "On Duty" : d.status;
    counts[key] = (counts[key] || 0) + 1;
  });

  const total = data.length;
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const colors: Record<string, string> = {
    Present: "#6366f1", "On Duty": "#06b6d4", Leave: "#22c55e", Absent: "#f59e0b", Holiday: "#ef4444", Weekend: "#8b5cf6",
  };

  let cumulative = 0;
  const slices = entries.map(([status, count]) => {
    const pct = count / total;
    const start = cumulative;
    cumulative += pct;
    const midAngle = (start + pct / 2) * 2 * Math.PI - Math.PI / 2;
    return { status, count, pct, start, color: colors[status] || "#94a3b8", midAngle };
  });

  const cx = 150, cy = 150, r = 110;

  const toXY = (pct: number, radius: number = r) => {
    const angle = pct * 2 * Math.PI - Math.PI / 2;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  };

  return (
    <div className="flex items-center gap-8 justify-center py-4">
      <div className="relative shrink-0">
        <svg viewBox="0 0 400 300" className="w-[420px] h-[320px]">
          {slices.map((s, i) => {
            const [x1, y1] = toXY(s.start);
            const [x2, y2] = toXY(s.start + s.pct);
            const large = s.pct > 0.5 ? 1 : 0;
            const isHovered = hovered === s.status;
            const scale = isHovered ? "scale(1.04)" : "scale(1)";
            return (
              <g key={i}>
                <path
                  d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`}
                  fill={s.color} stroke="white" strokeWidth="2.5"
                  style={{ transform: scale, transformOrigin: `${cx}px ${cy}px`, transition: "transform 0.2s ease", cursor: "pointer", filter: isHovered ? "brightness(1.15)" : "none" }}
                  onMouseEnter={() => setHovered(s.status)}
                  onMouseLeave={() => setHovered(null)}
                  opacity={hovered && !isHovered ? 0.55 : 1}
                />
                {/* Label line + text for each slice */}
                {(() => {
                  const labelR = r + 18;
                  const textR = r + 35;
                  const [lx, ly] = toXY(s.start + s.pct / 2, labelR);
                  const [tx, ty] = toXY(s.start + s.pct / 2, textR);
                  const anchor = tx > cx ? "start" : "end";
                  return s.pct > 0.04 ? (
                    <g opacity={hovered && hovered !== s.status ? 0.35 : 1} style={{ transition: "opacity 0.2s" }}>
                      <line x1={lx} y1={ly} x2={tx} y2={ty} stroke={s.color} strokeWidth="1" opacity="0.6" />
                      <text x={tx + (tx > cx ? 4 : -4)} y={ty + 4} textAnchor={anchor} fill="#374151" fontSize="9" fontWeight="600">{s.status}</text>
                    </g>
                  ) : null;
                })()}
              </g>
            );
          })}
          {/* Center label on hover */}
          {hovered && (() => {
            const s = slices.find(s => s.status === hovered);
            if (!s) return null;
            return (
              <g>
                <rect x={cx - 45} y={cy - 22} width="90" height="44" rx="8" fill="#1f2937" opacity="0.9" />
                <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="700">{s.status}</text>
                <text x={cx} y={cy + 14} textAnchor="middle" fill="white" fontSize="16" fontWeight="800">{s.count}</text>
              </g>
            );
          })()}
        </svg>
      </div>
      <div className="space-y-3">
        {slices.map(s => {
          const isH = hovered === s.status;
          return (
            <div key={s.status}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all ${isH ? "bg-gray-100 shadow-sm scale-105" : "hover:bg-gray-50"}`}
              onMouseEnter={() => setHovered(s.status)}
              onMouseLeave={() => setHovered(null)}>
              <span className="w-5 h-5 rounded shrink-0 shadow-sm" style={{ backgroundColor: s.color }} />
              <span className={`text-[14px] font-semibold transition-colors ${isH ? "text-gray-900" : "text-gray-600"}`}>{s.status}</span>
              <span className={`text-[14px] font-bold ml-auto ${isH ? "text-gray-900" : "text-gray-400"}`}>{s.count}</span>
              <span className={`text-[11px] font-semibold ${isH ? "text-gray-600" : "text-gray-300"}`}>({Math.round(s.pct * 100)}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Status Overview Rings (SVG)
   ═══════════════════════════════════════════ */
const StatusOverviewRings = ({ data }: { data: AttendanceDay[] }) => {
  const [hoveredRing, setHoveredRing] = useState<string | null>(null);
  const total = data.length;
  const counts: Record<string, number> = {};
  data.forEach(d => {
    const key = d.status === "Half Day" || d.status === "On Duty" ? "Present" : d.status;
    counts[key] = (counts[key] || 0) + 1;
  });

  const ringData = [
    { label: "Present", color: "#6366f1", count: counts["Present"] || 0 },
    { label: "On Duty", color: "#06b6d4", count: counts["On Duty"] || 0 },
    { label: "Paid Leave", color: "#f59e0b", count: counts["Leave"] || 0 },
    { label: "Absent", color: "#ef4444", count: counts["Absent"] || 0 },
    { label: "Holiday", color: "#ec4899", count: counts["Holiday"] || 0 },
    { label: "Weekend", color: "#8b5cf6", count: counts["Weekend"] || 0 },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-8 py-6">
      {ringData.map(r => {
        const pct = total > 0 ? Math.round((r.count / total) * 100) : 0;
        const circumference = 2 * Math.PI * 42;
        const offset = circumference - (pct / 100) * circumference;
        const isH = hoveredRing === r.label;
        return (
          <div key={r.label}
            className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${isH ? "scale-110" : "hover:scale-105"}`}
            onMouseEnter={() => setHoveredRing(r.label)}
            onMouseLeave={() => setHoveredRing(null)}
            style={{ opacity: hoveredRing && !isH ? 0.4 : 1 }}>
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="6" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={r.color}
                strokeWidth={isH ? "8" : "6"}
                strokeDasharray={circumference} strokeDashoffset={offset}
                strokeLinecap="round" transform="rotate(-90 50 50)"
                style={{ transition: "all 0.5s ease", filter: isH ? `drop-shadow(0 0 6px ${r.color}66)` : "none" }} />
              <text x="50" y="44" textAnchor="middle" fontSize="16" fontWeight="800" fill="#1f2937">{pct}%</text>
              <text x="50" y="58" textAnchor="middle" fontSize="8" fontWeight="600" fill="#9ca3af">{r.label}</text>
            </svg>
            <p className={`text-[12px] font-semibold mt-2 transition-colors ${isH ? "text-gray-800" : "text-gray-400"}`}>Total: {r.count}</p>
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeAttendance;
