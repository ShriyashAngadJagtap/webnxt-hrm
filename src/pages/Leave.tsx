import { useState } from "react";
import {
  Search, Filter, RefreshCw, Download, UserPlus,
  Edit3, Trash2, CalendarDays, X, User, Clock,
  ChevronLeft, ChevronRight, CheckCircle2, XCircle,
  FileText, Briefcase, Hash, Timer, StickyNote,
  Eye, CalendarCheck, CalendarX, Palmtree, Stethoscope,
  Baby, Coffee, HeartPulse, CircleDot, AlertCircle
} from "lucide-react";
import { StyledDropdown, ToolbarDropdown, PaginationDropdown } from "@/components/ui/StyledDropdown";

type LeaveType = "Sick Leave" | "Casual Leave" | "Medical Leave" | "Maternity Leave" | "Paid Leave";
type LeaveStatus = "Approved" | "Pending" | "Rejected";
type DurationType = "Full-day" | "Half-day" | "Multiple Days";

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  leaveType: LeaveType;
  leaveFrom: string;
  leaveTo: string;
  noOfDays: number;
  durationType: DurationType;
  requestedOn: string;
  reason: string;
  note: string;
  status: LeaveStatus;
  approvedBy: string;
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

const statusConfig: Record<LeaveStatus, { bg: string; text: string; icon: typeof CheckCircle2; dot: string }> = {
  Approved: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle2, dot: "bg-emerald-500" },
  Pending: { bg: "bg-amber-50", text: "text-amber-700", icon: Clock, dot: "bg-amber-500" },
  Rejected: { bg: "bg-red-50", text: "text-red-700", icon: XCircle, dot: "bg-red-500" },
};

const leaveTypeConfig: Record<LeaveType, { bg: string; text: string; icon: typeof Stethoscope; ring: string }> = {
  "Sick Leave": { bg: "bg-red-50", text: "text-red-700", icon: Stethoscope, ring: "ring-red-200" },
  "Casual Leave": { bg: "bg-blue-50", text: "text-blue-700", icon: Coffee, ring: "ring-blue-200" },
  "Medical Leave": { bg: "bg-purple-50", text: "text-purple-700", icon: HeartPulse, ring: "ring-purple-200" },
  "Maternity Leave": { bg: "bg-pink-50", text: "text-pink-700", icon: Baby, ring: "ring-pink-200" },
  "Paid Leave": { bg: "bg-emerald-50", text: "text-emerald-700", icon: Palmtree, ring: "ring-emerald-200" },
};

const leaveTypes: LeaveType[] = ["Sick Leave", "Casual Leave", "Medical Leave", "Maternity Leave", "Paid Leave"];
const leaveStatuses: LeaveStatus[] = ["Approved", "Pending", "Rejected"];
const durationTypes: DurationType[] = ["Full-day", "Half-day", "Multiple Days"];
const departments = ["All", "Engineering", "Design", "Marketing", "HR", "Sales", "Finance"];

const initialLeaves: LeaveRequest[] = [
  { id: "LR-001", employeeName: "Shriyash Jagtap", employeeId: "E101", department: "Engineering", leaveType: "Casual Leave", leaveFrom: "2024-03-10", leaveTo: "2024-03-11", noOfDays: 2, durationType: "Full-day", requestedOn: "2024-03-05", reason: "Personal work and family errands that need to be attended to.", note: "Will complete pending tasks before leave.", status: "Approved", approvedBy: "HR Manager" },
  { id: "LR-002", employeeName: "Shriyash Jagtap", employeeId: "E101", department: "Engineering", leaveType: "Sick Leave", leaveFrom: "2024-02-15", leaveTo: "2024-02-15", noOfDays: 1, durationType: "Full-day", requestedOn: "2024-02-15", reason: "Not feeling well, fever and cold symptoms.", note: "Doctor's appointment scheduled.", status: "Approved", approvedBy: "HR Manager" },
  { id: "LR-003", employeeName: "Jitesh Naidu", employeeId: "E102", department: "Engineering", leaveType: "Paid Leave", leaveFrom: "2024-04-01", leaveTo: "2024-04-05", noOfDays: 5, durationType: "Multiple Days", requestedOn: "2024-03-20", reason: "Family vacation planned for the spring break.", note: "All deliverables will be handed over to the team before departure.", status: "Approved", approvedBy: "Shriyash Jagtap" },
  { id: "LR-004", employeeName: "Jitesh Naidu", employeeId: "E102", department: "Engineering", leaveType: "Casual Leave", leaveFrom: "2024-01-22", leaveTo: "2024-01-22", noOfDays: 1, durationType: "Half-day", requestedOn: "2024-01-20", reason: "Need to visit bank for some account-related work.", note: "", status: "Approved", approvedBy: "Shriyash Jagtap" },
  { id: "LR-005", employeeName: "Shubham Jadhav", employeeId: "E103", department: "Design", leaveType: "Medical Leave", leaveFrom: "2024-03-18", leaveTo: "2024-03-22", noOfDays: 5, durationType: "Multiple Days", requestedOn: "2024-03-15", reason: "Scheduled surgery and recovery period needed.", note: "Medical certificate will be submitted upon return.", status: "Approved", approvedBy: "Shriyash Jagtap" },
  { id: "LR-006", employeeName: "Shubham Jadhav", employeeId: "E103", department: "Design", leaveType: "Casual Leave", leaveFrom: "2024-05-10", leaveTo: "2024-05-10", noOfDays: 1, durationType: "Full-day", requestedOn: "2024-05-08", reason: "Personal errands.", note: "", status: "Pending", approvedBy: "" },
  { id: "LR-007", employeeName: "John Doe", employeeId: "E123", department: "Engineering", leaveType: "Medical Leave", leaveFrom: "1985-04-10", leaveTo: "1985-04-15", noOfDays: 5, durationType: "Full-day", requestedOn: "2018-01-15", reason: "God creature is sixth was abundantly and sea gathered.", note: "Fowl darkness our sixth heaven. In Image lights fourth a hath don't Abundantly they're, Image you're.", status: "Approved", approvedBy: "Jane Smith" },
  { id: "LR-008", employeeName: "Sarah Smith", employeeId: "E124", department: "Marketing", leaveType: "Maternity Leave", leaveFrom: "2024-06-01", leaveTo: "2024-08-30", noOfDays: 90, durationType: "Multiple Days", requestedOn: "2024-04-15", reason: "Maternity leave as per company policy.", note: "Handover document prepared for team.", status: "Approved", approvedBy: "HR Manager" },
  { id: "LR-009", employeeName: "Robert Johnson", employeeId: "E125", department: "Engineering", leaveType: "Sick Leave", leaveFrom: "2024-03-05", leaveTo: "2024-03-06", noOfDays: 2, durationType: "Full-day", requestedOn: "2024-03-05", reason: "Severe migraine, unable to work.", note: "Will be available on call for emergencies.", status: "Approved", approvedBy: "Emily Davis" },
  { id: "LR-010", employeeName: "Michael Brown", employeeId: "E126", department: "Sales", leaveType: "Casual Leave", leaveFrom: "2024-04-14", leaveTo: "2024-04-14", noOfDays: 1, durationType: "Half-day", requestedOn: "2024-04-12", reason: "Parent-teacher meeting at school.", note: "", status: "Approved", approvedBy: "Sarah Smith" },
  { id: "LR-011", employeeName: "Emily Davis", employeeId: "E127", department: "HR", leaveType: "Paid Leave", leaveFrom: "2024-05-20", leaveTo: "2024-05-24", noOfDays: 5, durationType: "Multiple Days", requestedOn: "2024-05-10", reason: "Annual family trip.", note: "Deputy HR will handle all requests.", status: "Pending", approvedBy: "" },
  { id: "LR-012", employeeName: "William Wilson", employeeId: "E128", department: "Finance", leaveType: "Casual Leave", leaveFrom: "2024-02-28", leaveTo: "2024-02-28", noOfDays: 1, durationType: "Full-day", requestedOn: "2024-02-26", reason: "Moving to a new apartment.", note: "", status: "Rejected", approvedBy: "Michael Brown" },
  { id: "LR-013", employeeName: "Jessica Taylor", employeeId: "E129", department: "Design", leaveType: "Sick Leave", leaveFrom: "2024-03-12", leaveTo: "2024-03-13", noOfDays: 2, durationType: "Full-day", requestedOn: "2024-03-12", reason: "Food poisoning, bed rest advised by doctor.", note: "Medical certificate attached.", status: "Approved", approvedBy: "Sarah Smith" },
  { id: "LR-014", employeeName: "David Anderson", employeeId: "E130", department: "Engineering", leaveType: "Casual Leave", leaveFrom: "2024-04-22", leaveTo: "2024-04-23", noOfDays: 2, durationType: "Full-day", requestedOn: "2024-04-18", reason: "Attending a friend's wedding.", note: "", status: "Pending", approvedBy: "" },
  { id: "LR-015", employeeName: "Linda Thomas", employeeId: "E131", department: "Marketing", leaveType: "Paid Leave", leaveFrom: "2024-05-01", leaveTo: "2024-05-03", noOfDays: 3, durationType: "Multiple Days", requestedOn: "2024-04-25", reason: "Short holiday trip.", note: "All campaigns scheduled in advance.", status: "Approved", approvedBy: "John Doe" },
  { id: "LR-016", employeeName: "James Jackson", employeeId: "E132", department: "Sales", leaveType: "Casual Leave", leaveFrom: "2024-06-10", leaveTo: "2024-06-10", noOfDays: 1, durationType: "Full-day", requestedOn: "2024-06-07", reason: "Personal appointment.", note: "", status: "Pending", approvedBy: "" },
];

const Leave = () => {
  const [leaves, setLeaves] = useState(initialLeaves);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [editLeave, setEditLeave] = useState<LeaveRequest | null>(null);
  const [deleteLeave, setDeleteLeave] = useState<LeaveRequest | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const uniqueEmployees = [...new Map(leaves.map(l => [l.employeeName, l])).values()];

  const filteredCards = uniqueEmployees.filter(e => {
    const ms = e.employeeName.toLowerCase().includes(search.toLowerCase());
    return ms && (deptFilter === "All" || e.department === deptFilter);
  });

  const selectedLeaves = selectedEmployee ? leaves.filter(l => l.employeeName === selectedEmployee) : [];
  const selectedInfo = selectedEmployee ? uniqueEmployees.find(e => e.employeeName === selectedEmployee) : null;

  const approved = leaves.filter(l => l.status === "Approved").length;
  const pending = leaves.filter(l => l.status === "Pending").length;
  const rejected = leaves.filter(l => l.status === "Rejected").length;
  const totalDays = leaves.reduce((a, l) => a + l.noOfDays, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">All Leave Requests</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard gradient="from-blue-500 to-indigo-600" icon={<FileText className="w-5 h-5 text-white" />} label="Total Requests" value={String(leaves.length)} sub={`${totalDays} total days`} />
        <KpiCard gradient="from-emerald-500 to-teal-600" icon={<CheckCircle2 className="w-5 h-5 text-white" />} label="Approved" value={String(approved)} sub="Leave granted" />
        <KpiCard gradient="from-amber-500 to-orange-600" icon={<Clock className="w-5 h-5 text-white" />} label="Pending" value={String(pending)} sub="Awaiting approval" />
        <KpiCard gradient="from-red-500 to-rose-600" icon={<XCircle className="w-5 h-5 text-white" />} label="Rejected" value={String(rejected)} sub="Not approved" />
        <KpiCard gradient="from-purple-500 to-fuchsia-600" icon={<User className="w-5 h-5 text-white" />} label="Employees" value={String(uniqueEmployees.length)} sub="With leave records" />
      </div>

      {/* Main Content */}
      {!selectedEmployee ? (
        <>
          {/* Search & Dept Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search employee..." className="pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl w-52 focus:outline-none focus:border-blue-400 text-gray-900 placeholder:text-gray-400" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {departments.map(dept => {
                const count = dept === "All" ? uniqueEmployees.length : uniqueEmployees.filter(e => e.department === dept).length;
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
            <button onClick={() => setAddOpen(true)} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm">
              <UserPlus className="w-3.5 h-3.5" /> Add Leave
            </button>
          </div>

          {/* Employee Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCards.map(emp => {
              const empLeaves = leaves.filter(l => l.employeeName === emp.employeeName);
              const empApproved = empLeaves.filter(l => l.status === "Approved").length;
              const empPending = empLeaves.filter(l => l.status === "Pending").length;
              const empDays = empLeaves.reduce((a, l) => a + l.noOfDays, 0);
              const leaveTypeCounts = empLeaves.reduce((acc, l) => { acc[l.leaveType] = (acc[l.leaveType] || 0) + 1; return acc; }, {} as Record<string, number>);

              return (
                <div key={emp.employeeName}
                  onClick={() => setSelectedEmployee(emp.employeeName)}
                  className="group relative bg-white rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">

                  {/* Gradient banner */}
                  <div className={`h-20 bg-gradient-to-r ${getColor(emp.employeeName)} relative`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {empPending > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-amber-500/90 backdrop-blur-sm animate-pulse flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {empPending} Pending
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-white/20 backdrop-blur-sm">
                        {emp.department}
                      </span>
                    </div>
                    <div className="absolute top-3 left-3 flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-white/20 backdrop-blur-sm">
                        ID: {emp.employeeId}
                      </span>
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="relative px-4 -mt-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getColor(emp.employeeName)} flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-white`}>
                      {getInitials(emp.employeeName)}
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-2">
                    <h3 className="text-[14px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{emp.employeeName}</h3>
                    <p className="text-[11px] text-gray-500 font-medium">{emp.department}</p>

                    {/* Leave Type Badges */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {Object.entries(leaveTypeCounts).map(([type, count]) => {
                        const tc = leaveTypeConfig[type as LeaveType];
                        if (!tc) return null;
                        const Icon = tc.icon;
                        return (
                          <span key={type} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold ${tc.bg} ${tc.text} ring-1 ${tc.ring}`}>
                            <Icon className="w-2.5 h-2.5" /> {count}
                          </span>
                        );
                      })}
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-lg font-extrabold text-gray-900">{empLeaves.length}</p>
                        <p className="text-[9px] text-gray-400 font-semibold uppercase">Requests</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-extrabold text-emerald-600">{empApproved}</p>
                        <p className="text-[9px] text-gray-400 font-semibold uppercase">Approved</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-extrabold text-amber-600">{empPending}</p>
                        <p className="text-[9px] text-gray-400 font-semibold uppercase">Pending</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-extrabold text-blue-600">{empDays}</p>
                        <p className="text-[9px] text-gray-400 font-semibold uppercase">Days</p>
                      </div>
                    </div>

                    {/* View Button */}
                    <button className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[11px] font-semibold shadow-sm shadow-blue-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-md">
                      <Eye className="w-3.5 h-3.5" /> View Leave Records
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredCards.length === 0 && (
              <div className="col-span-full text-center py-16 text-gray-400 text-sm">No employees found.</div>
            )}
          </div>
        </>
      ) : (
        /* ═══════════════════════════════════════════
           Detailed Leave View for Selected Employee
           ═══════════════════════════════════════════ */
        <div className="space-y-5">
          <button onClick={() => setSelectedEmployee(null)} className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to All Employees
          </button>

          {selectedInfo && (
            <div className="relative overflow-hidden rounded-2xl">
              <div className={`bg-gradient-to-r ${getColor(selectedInfo.employeeName)} px-7 py-6`}>
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
                <div className="absolute right-16 -bottom-6 w-20 h-20 rounded-full bg-white/5" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getColor(selectedInfo.employeeName)} flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-2 ring-white/30`}>
                      {getInitials(selectedInfo.employeeName)}
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-xl">{selectedInfo.employeeName}</h2>
                      <p className="text-white/60 text-[13px]">{selectedInfo.department} &bull; {selectedInfo.employeeId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm text-center">
                      <p className="text-2xl font-extrabold text-white">{selectedLeaves.length}</p>
                      <p className="text-[10px] text-white/60 font-semibold">Total Leaves</p>
                    </div>
                    <div className="bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm text-center">
                      <p className="text-2xl font-extrabold text-emerald-300">{selectedLeaves.filter(l => l.status === "Approved").length}</p>
                      <p className="text-[10px] text-white/60 font-semibold">Approved</p>
                    </div>
                    <div className="bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm text-center">
                      <p className="text-2xl font-extrabold text-amber-300">{selectedLeaves.reduce((a, l) => a + l.noOfDays, 0)}</p>
                      <p className="text-[10px] text-white/60 font-semibold">Total Days</p>
                    </div>
                    <button onClick={() => setAddOpen(true)} className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-sm transition-colors flex items-center gap-1.5">
                      <UserPlus className="w-3.5 h-3.5" /> Add Leave
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leave Records */}
          <div className="space-y-4">
            {selectedLeaves.map(leave => {
              const sc = statusConfig[leave.status];
              const tc = leaveTypeConfig[leave.leaveType];
              const StatusIcon = sc.icon;
              const TypeIcon = tc.icon;
              return (
                <div key={leave.id} className="bg-white rounded-2xl border border-gray-200 hover:border-blue-100 hover:shadow-md transition-all overflow-hidden">
                  {/* Top color strip */}
                  <div className={`h-1.5 bg-gradient-to-r ${
                    leave.status === "Approved" ? "from-emerald-400 to-teal-500" :
                    leave.status === "Pending" ? "from-amber-400 to-orange-500" :
                    "from-red-400 to-rose-500"
                  }`} />

                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Leave Type + Status + Dates */}
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold ${tc.bg} ${tc.text} ring-1 ${tc.ring}`}>
                            <TypeIcon className="w-3.5 h-3.5" /> {leave.leaveType}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${sc.bg} ${sc.text}`}>
                            <StatusIcon className="w-3 h-3" /> {leave.status}
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono">{leave.id}</span>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <InfoPill icon={<CalendarCheck className="w-3.5 h-3.5 text-emerald-500" />} label="From" value={leave.leaveFrom} />
                          <InfoPill icon={<CalendarX className="w-3.5 h-3.5 text-red-500" />} label="To" value={leave.leaveTo} />
                          <InfoPill icon={<Timer className="w-3.5 h-3.5 text-blue-500" />} label="Days" value={`${leave.noOfDays} (${leave.durationType})`} />
                          <InfoPill icon={<CalendarDays className="w-3.5 h-3.5 text-purple-500" />} label="Requested" value={leave.requestedOn} />
                        </div>

                        {/* Reason & Note */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
                              <span className="text-[10px] font-bold text-blue-700 uppercase">Reason</span>
                            </div>
                            <p className="text-[11px] text-gray-700 leading-relaxed">{leave.reason}</p>
                          </div>
                          {leave.note && (
                            <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <StickyNote className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-[10px] font-bold text-amber-700 uppercase">Note</span>
                              </div>
                              <p className="text-[11px] text-gray-700 leading-relaxed">{leave.note}</p>
                            </div>
                          )}
                        </div>

                        {/* Admin Action / Approved By */}
                        {leave.status === "Pending" ? (
                          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-dashed border-amber-200 bg-amber-50/30 -mx-5 px-5 -mb-5 pb-4 rounded-b-2xl">
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="text-[12px] font-semibold text-amber-700 flex-1">Awaiting admin decision</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); setLeaves(prev => prev.map(l => l.id === leave.id ? { ...l, status: "Approved" as LeaveStatus, approvedBy: "Shriyash Jagtap" } : l)); }}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[11px] font-bold shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setLeaves(prev => prev.map(l => l.id === leave.id ? { ...l, status: "Rejected" as LeaveStatus, approvedBy: "Shriyash Jagtap" } : l)); }}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-[11px] font-bold shadow-md shadow-red-500/20 hover:shadow-lg transition-all">
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        ) : leave.approvedBy ? (
                          <div className="flex items-center gap-1.5 mt-3">
                            {leave.status === "Approved" ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <XCircle className="w-3 h-3 text-red-500" />
                            )}
                            <span className="text-[11px] text-gray-500">
                              {leave.status === "Approved" ? "Approved" : "Rejected"} by <strong className="text-gray-700">{leave.approvedBy}</strong>
                            </span>
                          </div>
                        ) : null}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-center gap-1.5 ml-4 shrink-0">
                        <button onClick={() => setEditLeave({ ...leave })} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Edit"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteLeave(leave)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {selectedLeaves.length === 0 && (
              <div className="text-center py-14 text-gray-400 text-sm bg-white rounded-2xl border border-gray-200">No leave records for this employee.</div>
            )}
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {(editLeave || addOpen) && (
        <LeaveModal
          leave={editLeave || undefined}
          isAdd={addOpen && !editLeave}
          prefillEmployee={selectedEmployee || ""}
          prefillInfo={selectedInfo || undefined}
          onClose={() => { setEditLeave(null); setAddOpen(false); }}
          onSave={l => {
            if (editLeave) setLeaves(prev => prev.map(x => x.id === l.id ? l : x));
            else setLeaves(prev => [...prev, { ...l, id: `LR-${String(prev.length + 1).padStart(3, "0")}` }]);
            setEditLeave(null); setAddOpen(false);
          }}
        />
      )}

      {/* Delete */}
      {deleteLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteLeave(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Leave Request</h3>
            <p className="text-sm text-gray-500 mb-5">Remove <strong className="text-gray-800">{deleteLeave.leaveType}</strong> request for {deleteLeave.employeeName}?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => { setLeaves(prev => prev.filter(l => l.id !== deleteLeave.id)); setDeleteLeave(null); }}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-semibold shadow-md shadow-red-500/20 transition-all">Delete</button>
              <button onClick={() => setDeleteLeave(null)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
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
   Info Pill (Date / Days)
   ═══════════════════════════════════════════ */
const InfoPill = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
    {icon}
    <div>
      <p className="text-[9px] text-gray-400 font-semibold uppercase">{label}</p>
      <p className="text-[11px] text-gray-800 font-semibold">{value}</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   Leave Modal (Edit / Add)
   ═══════════════════════════════════════════ */
const emptyLeave: LeaveRequest = {
  id: "", employeeName: "", employeeId: "", department: "",
  leaveType: "Casual Leave", leaveFrom: new Date().toISOString().slice(0, 10),
  leaveTo: new Date().toISOString().slice(0, 10), noOfDays: 1,
  durationType: "Full-day", requestedOn: new Date().toISOString().slice(0, 10),
  reason: "", note: "", status: "Pending", approvedBy: "",
};

const deptOptions = ["Engineering", "Design", "Marketing", "HR", "Sales", "Finance"];

const LeaveModal = ({ leave, isAdd, prefillEmployee, prefillInfo, onClose, onSave }: {
  leave?: LeaveRequest; isAdd: boolean; prefillEmployee: string; prefillInfo?: LeaveRequest; onClose: () => void; onSave: (l: LeaveRequest) => void;
}) => {
  const [form, setForm] = useState<LeaveRequest>(
    leave ? { ...leave } :
    { ...emptyLeave, employeeName: prefillEmployee, employeeId: prefillInfo?.employeeId || "", department: prefillInfo?.department || "" }
  );
  const set = <K extends keyof LeaveRequest>(k: K, v: LeaveRequest[K]) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[750px] max-h-[90vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className={`bg-gradient-to-r ${isAdd ? "from-emerald-600 via-teal-600 to-cyan-600" : "from-blue-600 via-indigo-600 to-purple-600"} px-6 py-5`}>
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute right-8 -bottom-4 w-16 h-16 rounded-full bg-white/5" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  {form.employeeName ? (
                    <span className="text-white font-bold text-sm">{getInitials(form.employeeName)}</span>
                  ) : (
                    <UserPlus className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">{isAdd ? (form.employeeName || "Add Leave Request") : form.employeeName}</h2>
                  <p className="text-white/60 text-[11px]">{isAdd ? "Submit a new leave request" : `Edit leave • ${form.leaveType}`}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"><X className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<User className="w-4 h-4 text-gray-400" />} label="Name" value={form.employeeName} onChange={v => set("employeeName", v)} />
            <StyledDropdown label="Leave Type" required value={form.leaveType} options={leaveTypes} onChange={v => set("leaveType", v as LeaveType)}
              icon={(() => { const I = leaveTypeConfig[form.leaveType].icon; return <I className="w-4 h-4" />; })()} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<CalendarDays className="w-4 h-4 text-gray-400" />} label="Leave From" value={form.leaveFrom} type="date" onChange={v => set("leaveFrom", v)} />
            <FieldInput icon={<CalendarDays className="w-4 h-4 text-gray-400" />} label="Leave To" value={form.leaveTo} type="date" onChange={v => set("leaveTo", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<Hash className="w-4 h-4 text-gray-400" />} label="No. Of Days" value={String(form.noOfDays)} type="number" onChange={v => set("noOfDays", parseInt(v) || 0)} />
            <FieldInput icon={<Hash className="w-4 h-4 text-gray-400" />} label="Employee ID" value={form.employeeId} onChange={v => set("employeeId", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StyledDropdown label="Department" required value={form.department} options={deptOptions} onChange={v => set("department", v)}
              icon={<Briefcase className="w-4 h-4" />} />
            <StyledDropdown label="Duration Type" required value={form.durationType} options={durationTypes} onChange={v => set("durationType", v as DurationType)}
              icon={<Timer className="w-4 h-4" />} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<CalendarDays className="w-4 h-4 text-gray-400" />} label="Requested On" value={form.requestedOn} type="date" onChange={v => set("requestedOn", v)} />
            <StyledDropdown label="Status" required value={form.status} options={leaveStatuses} onChange={v => set("status", v as LeaveStatus)}
              icon={<CheckCircle2 className="w-4 h-4" />} />
          </div>
          <FieldTextarea label="Reason" value={form.reason} onChange={v => set("reason", v)} />
          <FieldTextarea label="Note" value={form.note} onChange={v => set("note", v)} required={false} />

          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => onSave(form)}
              className={`px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition-all ${
                isAdd ? "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20 hover:shadow-lg" : "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/20 hover:shadow-lg"
              }`}>
              {isAdd ? "Submit Request" : "Save"}
            </button>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-semibold shadow-md shadow-red-500/20 hover:shadow-lg transition-all">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Reusable Fields
   ═══════════════════════════════════════════ */
const FieldInput = ({ icon, label, value, onChange, type = "text" }: {
  icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; type?: string;
}) => (
  <fieldset className="border border-gray-300 rounded-lg px-3 pt-1 pb-2 hover:border-gray-400 transition-colors">
    <legend className="text-[11px] font-semibold text-gray-700 px-1">{label}*</legend>
    <div className="flex items-center gap-2">
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="flex-1 text-sm text-gray-900 bg-transparent focus:outline-none" />
      {icon}
    </div>
  </fieldset>
);

const FieldTextarea = ({ label, value, onChange, required = true }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean;
}) => (
  <fieldset className="border border-gray-300 rounded-lg px-3 pt-1 pb-2 hover:border-gray-400 transition-colors">
    <legend className="text-[11px] font-semibold text-gray-700 px-1">{label}{required ? "*" : ""}</legend>
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
      className="w-full text-sm text-gray-900 bg-transparent focus:outline-none resize-y" />
  </fieldset>
);

export default Leave;
