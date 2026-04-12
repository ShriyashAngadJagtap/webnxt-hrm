import { useState } from "react";
import {
  Search, Filter, RefreshCw, Download, UserPlus,
  Edit3, Trash2, CalendarDays, X, User,
  ChevronLeft, ChevronRight, LogOut, CheckCircle2,
  Clock, AlertTriangle, FileText, Briefcase, DoorOpen,
  UserMinus, ShieldCheck, CircleDot
} from "lucide-react";
import { StyledDropdown, ToolbarDropdown, PaginationDropdown } from "@/components/ui/StyledDropdown";

type ExitType = "Resignation" | "Termination" | "Retirement" | "End of Contract";
type ExitStatus = "Completed" | "In Progress" | "Pending";

interface ExitRecord {
  id: string;
  employeeName: string;
  exitDate: string;
  exitType: ExitType;
  reason: string;
  status: ExitStatus;
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

const statusConfig: Record<ExitStatus, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  Completed: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle2 },
  "In Progress": { bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
  Pending: { bg: "bg-blue-50", text: "text-blue-700", icon: CircleDot },
};

const exitTypeConfig: Record<ExitType, { bg: string; text: string; icon: typeof LogOut }> = {
  Resignation: { bg: "bg-blue-50", text: "text-blue-700", icon: DoorOpen },
  Termination: { bg: "bg-red-50", text: "text-red-700", icon: UserMinus },
  Retirement: { bg: "bg-purple-50", text: "text-purple-700", icon: ShieldCheck },
  "End of Contract": { bg: "bg-amber-50", text: "text-amber-700", icon: FileText },
};

const exitTypes: ExitType[] = ["Resignation", "Termination", "Retirement", "End of Contract"];
const exitStatuses: ExitStatus[] = ["Completed", "In Progress", "Pending"];

const initialExits: ExitRecord[] = [
  { id: "EX-001", employeeName: "John Doe", exitDate: "2023-12-31", exitType: "Resignation", reason: "Career Growth", status: "Completed" },
  { id: "EX-002", employeeName: "Sarah Smith", exitDate: "2023-11-15", exitType: "Retirement", reason: "Old Age", status: "Completed" },
  { id: "EX-003", employeeName: "Robert Johnson", exitDate: "2024-01-10", exitType: "Termination", reason: "Performance", status: "In Progress" },
  { id: "EX-004", employeeName: "Michael Brown", exitDate: "2023-10-05", exitType: "Resignation", reason: "Better Offer", status: "Completed" },
  { id: "EX-005", employeeName: "Emily Davis", exitDate: "2024-02-20", exitType: "Resignation", reason: "Personal", status: "Pending" },
  { id: "EX-006", employeeName: "William Wilson", exitDate: "2023-09-18", exitType: "Termination", reason: "Policy Violation", status: "Completed" },
  { id: "EX-007", employeeName: "Jessica Taylor", exitDate: "2024-03-15", exitType: "Resignation", reason: "Relocation", status: "Pending" },
  { id: "EX-008", employeeName: "David Anderson", exitDate: "2023-08-20", exitType: "End of Contract", reason: "Project End", status: "Completed" },
  { id: "EX-009", employeeName: "Linda Thomas", exitDate: "2023-07-14", exitType: "Resignation", reason: "Health Issues", status: "Completed" },
  { id: "EX-010", employeeName: "James Jackson", exitDate: "2024-04-01", exitType: "Resignation", reason: "Entrepreneurship", status: "Pending" },
  { id: "EX-011", employeeName: "Shriyash Jagtap", exitDate: "2024-06-30", exitType: "Resignation", reason: "Higher Studies", status: "In Progress" },
  { id: "EX-012", employeeName: "Jitesh Naidu", exitDate: "2024-05-15", exitType: "End of Contract", reason: "Contract Completed", status: "Pending" },
];

const EmployeeExit = () => {
  const [exits, setExits] = useState(initialExits);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editExit, setEditExit] = useState<ExitRecord | null>(null);
  const [deleteExit, setDeleteExit] = useState<ExitRecord | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = exits.filter(e => {
    const ms = e.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      e.reason.toLowerCase().includes(search.toLowerCase()) ||
      e.exitType.toLowerCase().includes(search.toLowerCase());
    return ms && (statusFilter === "All" || e.status === statusFilter);
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const allSelected = paged.length > 0 && paged.every(e => selectedIds.includes(e.id));
  const toggleAll = () => { if (allSelected) setSelectedIds(p => p.filter(id => !paged.some(e => e.id === id))); else setSelectedIds(p => [...new Set([...p, ...paged.map(e => e.id)])]); };
  const toggleOne = (id: string) => setSelectedIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);

  const completed = exits.filter(e => e.status === "Completed").length;
  const inProgress = exits.filter(e => e.status === "In Progress").length;
  const pending = exits.filter(e => e.status === "Pending").length;
  const resignations = exits.filter(e => e.exitType === "Resignation").length;

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Employee Exit</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard gradient="from-blue-500 to-indigo-600" icon={<LogOut className="w-5 h-5 text-white" />} label="Total Exits" value={String(exits.length)} sub="All exit records" />
        <KpiCard gradient="from-emerald-500 to-teal-600" icon={<CheckCircle2 className="w-5 h-5 text-white" />} label="Completed" value={String(completed)} sub="Fully processed" />
        <KpiCard gradient="from-amber-500 to-orange-600" icon={<Clock className="w-5 h-5 text-white" />} label="In Progress" value={String(inProgress)} sub="Being processed" />
        <KpiCard gradient="from-purple-500 to-fuchsia-600" icon={<CircleDot className="w-5 h-5 text-white" />} label="Pending" value={String(pending)} sub="Awaiting action" />
        <KpiCard gradient="from-rose-500 to-red-600" icon={<DoorOpen className="w-5 h-5 text-white" />} label="Resignations" value={String(resignations)} sub="Voluntary exits" />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">Employee Exit</span>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search..." className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg w-48 focus:outline-none focus:border-blue-400 text-gray-900 placeholder:text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ToolbarDropdown value={statusFilter} options={exitStatuses} onChange={v => { setStatusFilter(v); setPage(1); }} allLabel="All Status" />
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Filter"><Filter className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Download"><Download className="w-4 h-4" /></button>
            <button onClick={() => setAddOpen(true)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="Add Exit Record"><UserPlus className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3 w-10"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded" /></th>
                <th className="px-4 py-3 font-semibold">Employee Name</th>
                <th className="px-4 py-3 font-semibold">Exit Date</th>
                <th className="px-4 py-3 font-semibold">Exit Type</th>
                <th className="px-4 py-3 font-semibold">Reason</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(exit => {
                const sc = statusConfig[exit.status];
                const ec = exitTypeConfig[exit.exitType];
                const StatusIcon = sc.icon;
                const TypeIcon = ec.icon;
                return (
                  <tr key={exit.id} className="border-t border-gray-50 hover:bg-blue-50/20 transition-colors group">
                    <td className="px-4 py-3.5"><input type="checkbox" checked={selectedIds.includes(exit.id)} onChange={() => toggleOne(exit.id)} className="rounded" /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getColor(exit.employeeName)} flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm`}>
                          {getInitials(exit.employeeName)}
                        </div>
                        <span className="font-semibold text-gray-900 whitespace-nowrap">{exit.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-gray-700 font-medium">{exit.exitDate}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${ec.bg} ${ec.text}`}>
                        <TypeIcon className="w-3 h-3" /> {exit.exitType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-gray-800 font-medium">{exit.reason}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${sc.bg} ${sc.text}`}>
                        <StatusIcon className="w-3 h-3" /> {exit.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => setEditExit({ ...exit })} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteExit(exit)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length === 0 && <tr><td colSpan={7} className="text-center py-14 text-gray-400 text-sm">No exit records found.</td></tr>}
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
            <span>{filtered.length === 0 ? 0 : (page - 1) * perPage + 1} – {Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
            <div className="flex gap-1">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {(editExit || addOpen) && (
        <ExitModal
          exit={editExit || undefined}
          isAdd={addOpen && !editExit}
          onClose={() => { setEditExit(null); setAddOpen(false); }}
          onSave={e => {
            if (editExit) setExits(prev => prev.map(x => x.id === e.id ? e : x));
            else setExits(prev => [...prev, { ...e, id: `EX-${String(prev.length + 1).padStart(3, "0")}` }]);
            setEditExit(null); setAddOpen(false);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteExit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteExit(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Remove Exit Record</h3>
            <p className="text-sm text-gray-500 mb-5">
              Remove exit record for <strong className="text-gray-800">{deleteExit.employeeName}</strong>?
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => { setExits(prev => prev.filter(e => e.id !== deleteExit.id)); setDeleteExit(null); }}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-semibold shadow-md shadow-red-500/20 transition-all">Delete</button>
              <button onClick={() => setDeleteExit(null)}
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
   Exit Modal (Edit / Add)
   ═══════════════════════════════════════════ */
const emptyExit: ExitRecord = {
  id: "", employeeName: "", exitDate: new Date().toISOString().slice(0, 10),
  exitType: "Resignation", reason: "", status: "Pending",
};

const ExitModal = ({ exit, isAdd, onClose, onSave }: {
  exit?: ExitRecord; isAdd: boolean; onClose: () => void; onSave: (e: ExitRecord) => void;
}) => {
  const [form, setForm] = useState<ExitRecord>(exit ? { ...exit } : { ...emptyExit });
  const set = <K extends keyof ExitRecord>(k: K, v: ExitRecord[K]) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className={`bg-gradient-to-r ${isAdd ? "from-emerald-600 via-teal-600 to-cyan-600" : "from-blue-600 via-indigo-600 to-purple-600"} px-6 py-5`}>
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute right-8 -bottom-4 w-16 h-16 rounded-full bg-white/5" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  {isAdd ? <UserPlus className="w-5 h-5 text-white" /> : <LogOut className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">{isAdd ? "Add Exit Record" : `Edit Exit: ${form.employeeName}`}</h2>
                  <p className="text-white/60 text-[11px]">{isAdd ? "Register a new employee exit" : `${form.exitType} • ${form.exitDate}`}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"><X className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<User className="w-4 h-4 text-gray-400" />} label="Employee Name" value={form.employeeName} onChange={v => set("employeeName", v)} />
            <FieldInput icon={<CalendarDays className="w-4 h-4 text-gray-400" />} label="Exit Date" value={form.exitDate} type="date" onChange={v => set("exitDate", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StyledDropdown label="Exit Type" required value={form.exitType} options={exitTypes} onChange={v => set("exitType", v as ExitType)} icon={<Briefcase className="w-4 h-4" />} />
            <StyledDropdown label="Status" required value={form.status} options={exitStatuses} onChange={v => set("status", v as ExitStatus)} icon={<CheckCircle2 className="w-4 h-4" />} />
          </div>
          <FieldTextarea label="Reason" value={form.reason} onChange={v => set("reason", v)} />

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => onSave(form)}
              className={`px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition-all ${
                isAdd
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20 hover:shadow-lg"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/20 hover:shadow-lg"
              }`}>
              {isAdd ? "Add Record" : "Save"}
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

const FieldTextarea = ({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) => (
  <fieldset className="border border-gray-300 rounded-lg px-3 pt-1 pb-2 hover:border-gray-400 transition-colors">
    <legend className="text-[11px] font-semibold text-gray-700 px-1">{label}*</legend>
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
      className="w-full text-sm text-gray-900 bg-transparent focus:outline-none resize-y" />
  </fieldset>
);

export default EmployeeExit;
