import { useState } from "react";
import {
  Search, Filter, RefreshCw, Download, UserPlus,
  Edit3, Trash2, CalendarDays, X, Clock,
  User, Briefcase, Sun, Moon,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { StyledDropdown, ToolbarDropdown, PaginationDropdown } from "@/components/ui/StyledDropdown";

type ShiftType = "Day" | "Night";
type ShiftStatus = "Scheduled" | "Completed" | "Unscheduled";
type ShiftCategory = "Regular" | "Overtime";

interface Shift {
  id: string;
  employeeName: string;
  startTime: string;
  endTime: string;
  shiftType: ShiftType;
  shiftDate: string;
  breakStart: string;
  breakEnd: string;
  totalHours: number;
  status: ShiftStatus;
  assignedBy: string;
  overtimeHours: number;
  category: ShiftCategory;
}

const avatarColors: Record<string, string> = {
  "John Doe": "from-violet-500 to-purple-600",
  "Jane Smith": "from-pink-500 to-rose-500",
  "Michael Lee": "from-cyan-500 to-blue-500",
  "Sarah Turner": "from-amber-500 to-orange-500",
  "David Wilson": "from-teal-500 to-emerald-600",
  "Emily Clark": "from-fuchsia-500 to-pink-600",
  "Chris Adams": "from-sky-500 to-cyan-600",
  "Olivia Brown": "from-rose-500 to-red-600",
  "Jacob Martin": "from-indigo-500 to-violet-600",
  "Shriyash Jagtap": "from-blue-500 to-indigo-600",
  "Jitesh Naidu": "from-emerald-500 to-teal-600",
  "Shubham Jadhav": "from-orange-500 to-red-500",
};
const getInitials = (n: string) => n.split(" ").map(w => w[0]).join("").toUpperCase();
const getColor = (n: string) => avatarColors[n] || "from-gray-400 to-gray-500";

const initialShifts: Shift[] = [
  { id: "SH-001", employeeName: "John Doe", startTime: "09:00", endTime: "17:00", shiftType: "Day", shiftDate: "2024-11-27", breakStart: "12:30", breakEnd: "18:00", totalHours: 8, status: "Scheduled", assignedBy: "HR Manager", overtimeHours: 0, category: "Regular" },
  { id: "SH-002", employeeName: "Jane Smith", startTime: "14:00", endTime: "20:00", shiftType: "Night", shiftDate: "2024-11-27", breakStart: "18:30", breakEnd: "19:00", totalHours: 8, status: "Scheduled", assignedBy: "Operations Manager", overtimeHours: 1, category: "Overtime" },
  { id: "SH-003", employeeName: "Michael Lee", startTime: "08:00", endTime: "14:00", shiftType: "Day", shiftDate: "2024-11-28", breakStart: "09:00", breakEnd: "09:30", totalHours: 8, status: "Scheduled", assignedBy: "HR Manager", overtimeHours: 0, category: "Regular" },
  { id: "SH-004", employeeName: "Sarah Turner", startTime: "18:00", endTime: "02:00", shiftType: "Night", shiftDate: "2024-11-28", breakStart: "22:00", breakEnd: "22:30", totalHours: 8, status: "Scheduled", assignedBy: "Shift Supervisor", overtimeHours: 2, category: "Overtime" },
  { id: "SH-005", employeeName: "David Wilson", startTime: "09:00", endTime: "17:00", shiftType: "Day", shiftDate: "2024-11-29", breakStart: "17:00", breakEnd: "17:30", totalHours: 8, status: "Completed", assignedBy: "HR Manager", overtimeHours: 0, category: "Regular" },
  { id: "SH-006", employeeName: "Emily Clark", startTime: "06:00", endTime: "14:00", shiftType: "Day", shiftDate: "2024-11-29", breakStart: "09:30", breakEnd: "10:00", totalHours: 8, status: "Scheduled", assignedBy: "Operations Manager", overtimeHours: 0, category: "Regular" },
  { id: "SH-007", employeeName: "Chris Adams", startTime: "10:00", endTime: "18:00", shiftType: "Day", shiftDate: "2024-11-30", breakStart: "13:00", breakEnd: "13:30", totalHours: 8, status: "Scheduled", assignedBy: "HR Manager", overtimeHours: 0, category: "Regular" },
  { id: "SH-008", employeeName: "Olivia Brown", startTime: "18:00", endTime: "00:00", shiftType: "Night", shiftDate: "2024-11-30", breakStart: "20:00", breakEnd: "20:30", totalHours: 8, status: "Unscheduled", assignedBy: "Shift Supervisor", overtimeHours: 1, category: "Overtime" },
  { id: "SH-009", employeeName: "Jacob Martin", startTime: "08:00", endTime: "16:00", shiftType: "Day", shiftDate: "2024-12-01", breakStart: "17:00", breakEnd: "17:30", totalHours: 8, status: "Scheduled", assignedBy: "HR Manager", overtimeHours: 0, category: "Regular" },
  { id: "SH-010", employeeName: "Shriyash Jagtap", startTime: "09:00", endTime: "18:00", shiftType: "Day", shiftDate: "2024-12-01", breakStart: "13:00", breakEnd: "13:30", totalHours: 9, status: "Scheduled", assignedBy: "HR Manager", overtimeHours: 1, category: "Overtime" },
  { id: "SH-011", employeeName: "Jitesh Naidu", startTime: "10:00", endTime: "18:00", shiftType: "Day", shiftDate: "2024-12-02", breakStart: "13:30", breakEnd: "14:00", totalHours: 8, status: "Completed", assignedBy: "Operations Manager", overtimeHours: 0, category: "Regular" },
  { id: "SH-012", employeeName: "Shubham Jadhav", startTime: "14:00", endTime: "22:00", shiftType: "Night", shiftDate: "2024-12-02", breakStart: "18:00", breakEnd: "18:30", totalHours: 8, status: "Scheduled", assignedBy: "Shift Supervisor", overtimeHours: 0, category: "Regular" },
];

const shiftTypeConfig: Record<ShiftType, { bg: string; text: string; icon: typeof Sun }> = {
  Day: { bg: "bg-amber-100", text: "text-amber-700", icon: Sun },
  Night: { bg: "bg-indigo-100", text: "text-indigo-700", icon: Moon },
};

const statusConfig: Record<ShiftStatus, { bg: string; text: string; dot: string }> = {
  Scheduled: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  Completed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Unscheduled: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

const categoryConfig: Record<ShiftCategory, { bg: string; text: string }> = {
  Regular: { bg: "bg-gray-100", text: "text-gray-700" },
  Overtime: { bg: "bg-orange-100", text: "text-orange-700" },
};

const shiftTypes: ShiftType[] = ["Day", "Night"];
const shiftStatuses: ShiftStatus[] = ["Scheduled", "Completed", "Unscheduled"];
const shiftCategories: ShiftCategory[] = ["Regular", "Overtime"];
const assigners = ["HR Manager", "Operations Manager", "Shift Supervisor"];

const EmployeeShift = () => {
  const [shifts, setShifts] = useState(initialShifts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editShift, setEditShift] = useState<Shift | null>(null);
  const [deleteShift, setDeleteShift] = useState<Shift | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = shifts.filter(s => {
    const matchSearch = s.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      s.assignedBy.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const allSelected = paged.length > 0 && paged.every(s => selectedIds.includes(s.id));

  const toggleAll = () => {
    if (allSelected) setSelectedIds(prev => prev.filter(id => !paged.some(s => s.id === id)));
    else setSelectedIds(prev => [...new Set([...prev, ...paged.map(s => s.id)])]);
  };
  const toggleOne = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleDelete = () => {
    if (deleteShift) { setShifts(prev => prev.filter(s => s.id !== deleteShift.id)); setDeleteShift(null); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Employee Shift</h1>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">Employee Shift</span>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search..." className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg w-44 focus:outline-none focus:border-blue-400 text-gray-900 placeholder:text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ToolbarDropdown value={statusFilter} options={shiftStatuses} onChange={v => { setStatusFilter(v); setPage(1); }} allLabel="All Status" />
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Filter"><Filter className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Download"><Download className="w-4 h-4" /></button>
            <button onClick={() => setAddOpen(true)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="Add Shift"><UserPlus className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px]">
                <th className="px-3 py-3 w-10"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded" /></th>
                <th className="px-3 py-3 font-semibold">Employee Name</th>
                <th className="px-3 py-3 font-semibold">Start Time</th>
                <th className="px-3 py-3 font-semibold">End Time</th>
                <th className="px-3 py-3 font-semibold">Shift Type</th>
                <th className="px-3 py-3 font-semibold">Shift Date</th>
                <th className="px-3 py-3 font-semibold">Break Start</th>
                <th className="px-3 py-3 font-semibold">Break End</th>
                <th className="px-3 py-3 font-semibold">Total Hours</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Assigned By</th>
                <th className="px-3 py-3 font-semibold">Overtime Hours</th>
                <th className="px-3 py-3 font-semibold">Category</th>
                <th className="px-3 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(shift => {
                const stc = shiftTypeConfig[shift.shiftType];
                const sc = statusConfig[shift.status];
                const cc = categoryConfig[shift.category];
                const Icon = stc.icon;
                return (
                  <tr key={shift.id} className="border-t border-gray-50 hover:bg-blue-50/30 transition-colors">
                    <td className="px-3 py-3"><input type="checkbox" checked={selectedIds.includes(shift.id)} onChange={() => toggleOne(shift.id)} className="rounded" /></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getColor(shift.employeeName)} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                          {getInitials(shift.employeeName)}
                        </div>
                        <span className="font-medium text-gray-900 whitespace-nowrap">{shift.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-700 font-medium">{shift.startTime}</td>
                    <td className="px-3 py-3 text-gray-700 font-medium">{shift.endTime}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${stc.bg} ${stc.text}`}>
                        <Icon className="w-3 h-3" /> {shift.shiftType}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-3 h-3 text-blue-500" />
                        <span className="text-gray-700">{shift.shiftDate}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-700">{shift.breakStart}</td>
                    <td className="px-3 py-3 text-gray-700">{shift.breakEnd}</td>
                    <td className="px-3 py-3 text-gray-900 font-bold text-center">{shift.totalHours}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {shift.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{shift.assignedBy}</td>
                    <td className="px-3 py-3 text-gray-900 font-bold text-center">{shift.overtimeHours}</td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${cc.bg} ${cc.text}`}>{shift.category}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setEditShift({ ...shift })} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteShift(shift)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length === 0 && <tr><td colSpan={14} className="text-center py-10 text-gray-400 text-sm">No shifts found.</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>Items per page:</span>
            <PaginationDropdown value={perPage} options={[10, 15, 20]} onChange={v => { setPerPage(v); setPage(1); }} />
          </div>
          <div className="flex items-center gap-3">
            <span>{(page - 1) * perPage + 1} – {Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
            <div className="flex gap-1">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          Shift Modal (Edit / Add)
         ═══════════════════════════════════════════ */}
      {(editShift || addOpen) && (
        <ShiftModal
          shift={editShift || undefined}
          onClose={() => { setEditShift(null); setAddOpen(false); }}
          onSave={s => {
            if (editShift) {
              setShifts(prev => prev.map(x => x.id === s.id ? s : x));
            } else {
              setShifts(prev => [...prev, { ...s, id: `SH-${String(prev.length + 1).padStart(3, "0")}` }]);
            }
            setEditShift(null);
            setAddOpen(false);
          }}
          isAdd={addOpen && !editShift}
        />
      )}

      {/* ═══════════════════════════════════════════
          Delete Confirmation
         ═══════════════════════════════════════════ */}
      {deleteShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteShift(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Shift</h3>
            <p className="text-sm text-gray-500 mb-5">Remove shift for <strong>{deleteShift.employeeName}</strong> on {deleteShift.shiftDate}?</p>
            <div className="flex justify-center gap-3">
              <button onClick={handleDelete} className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">Delete</button>
              <button onClick={() => setDeleteShift(null)} className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Shift Modal Component
   ═══════════════════════════════════════════ */

const emptyShift: Shift = {
  id: "", employeeName: "", startTime: "09:00", endTime: "17:00",
  shiftType: "Day", shiftDate: "", breakStart: "12:30", breakEnd: "13:00",
  totalHours: 8, status: "Scheduled", assignedBy: "HR Manager",
  overtimeHours: 0, category: "Regular",
};

const ShiftModal = ({ shift, onClose, onSave, isAdd }: {
  shift?: Shift; onClose: () => void; onSave: (s: Shift) => void; isAdd: boolean;
}) => {
  const [form, setForm] = useState<Shift>(shift ? { ...shift } : { ...emptyShift });

  const set = <K extends keyof Shift>(key: K, val: Shift[K]) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[650px] max-h-[90vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 rounded-t-2xl bg-gradient-to-r ${isAdd ? "from-emerald-600 to-teal-600" : "from-blue-600 to-indigo-600"}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-white font-bold text-base">{isAdd ? "Add New Shift" : `Edit Shift: ${form.employeeName}`}</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<User className="w-4 h-4 text-gray-400" />} label="Employee Name" value={form.employeeName} onChange={v => set("employeeName", v)} />
            <StyledDropdown label="Shift Type" required value={form.shiftType} options={shiftTypes} onChange={v => set("shiftType", v as ShiftType)}
              icon={form.shiftType === "Day" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />} />
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<Clock className="w-4 h-4 text-gray-400" />} label="Start Time" value={form.startTime} type="time" onChange={v => set("startTime", v)} />
            <FieldInput icon={<Clock className="w-4 h-4 text-gray-400" />} label="End Time" value={form.endTime} type="time" onChange={v => set("endTime", v)} />
          </div>
          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<CalendarDays className="w-4 h-4 text-gray-400" />} label="Shift Date" value={form.shiftDate} type="date" onChange={v => set("shiftDate", v)} />
            <FieldInput icon={<Clock className="w-4 h-4 text-gray-400" />} label="Total Hours" value={String(form.totalHours)} type="number" onChange={v => set("totalHours", +v)} />
          </div>
          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<Clock className="w-4 h-4 text-gray-400" />} label="Break Start" value={form.breakStart} type="time" onChange={v => set("breakStart", v)} />
            <FieldInput icon={<Clock className="w-4 h-4 text-gray-400" />} label="Break End" value={form.breakEnd} type="time" onChange={v => set("breakEnd", v)} />
          </div>
          {/* Row 5 */}
          <div className="grid grid-cols-2 gap-4">
            <StyledDropdown label="Status" required value={form.status} options={shiftStatuses} onChange={v => set("status", v as ShiftStatus)} icon={<Briefcase className="w-4 h-4" />} />
            <StyledDropdown label="Assigned By" required value={form.assignedBy} options={assigners} onChange={v => set("assignedBy", v)} icon={<User className="w-4 h-4" />} />
          </div>
          {/* Row 6 */}
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<Clock className="w-4 h-4 text-gray-400" />} label="Overtime Hours" value={String(form.overtimeHours)} type="number" onChange={v => set("overtimeHours", +v)} />
            <StyledDropdown label="Category" required value={form.category} options={shiftCategories} onChange={v => set("category", v as ShiftCategory)} icon={<Briefcase className="w-4 h-4" />} />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => onSave(form)}
              className={`px-5 py-2 rounded-lg text-white text-sm font-semibold transition-colors ${isAdd ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"}`}>
              {isAdd ? "Add Shift" : "Save"}
            </button>
            <button onClick={onClose} className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Reusable Form Components
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

export default EmployeeShift;
