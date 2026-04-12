import { useState } from "react";
import {
  Search, Filter, RefreshCw, Download, UserPlus,
  Edit3, Trash2, X, ChevronLeft, ChevronRight,
  CheckCircle2, XCircle, Clock, FileText, Briefcase,
  CalendarDays, Bell, Hash, StickyNote, RotateCcw,
  Layers, Timer, Shield
} from "lucide-react";
import { StyledDropdown, ToolbarDropdown, PaginationDropdown } from "@/components/ui/StyledDropdown";

type PayType = "Paid" | "Unpaid";
type LeaveUnit = "Days" | "Hours";
type TypeStatus = "Active" | "Inactive";

interface LeaveType {
  id: string;
  leaveName: string;
  leaveType: PayType;
  leaveUnit: LeaveUnit;
  status: TypeStatus;
  duration: number;
  createdBy: string;
  notificationPeriod: string;
  carryOver: string;
  note: string;
  maxLeaves: number;
  annualLimit: number;
}

const statusConfig: Record<TypeStatus, { bg: string; text: string }> = {
  Active: { bg: "bg-emerald-50", text: "text-emerald-700" },
  Inactive: { bg: "bg-red-50", text: "text-red-700" },
};

const payTypes: PayType[] = ["Paid", "Unpaid"];
const leaveUnits: LeaveUnit[] = ["Days", "Hours"];
const typeStatuses: TypeStatus[] = ["Active", "Inactive"];

const initialTypes: LeaveType[] = [
  { id: "LT-001", leaveName: "Work From Home Leave", leaveType: "Paid", leaveUnit: "Days", status: "Inactive", duration: 5, createdBy: "HR Department", notificationPeriod: "48 hours prior", carryOver: "Allowed up to 2 days", note: "Winged lights seed don't to him. Be day fish whose had that it him sea bearing abundantly greater.", maxLeaves: 10, annualLimit: 15 },
  { id: "LT-002", leaveName: "Casual Leave", leaveType: "Unpaid", leaveUnit: "Hours", status: "Active", duration: 8, createdBy: "HR Department", notificationPeriod: "24 hours prior", carryOver: "Not allowed", note: "General purpose leave for personal matters.", maxLeaves: 12, annualLimit: 12 },
  { id: "LT-003", leaveName: "Emergency Leave", leaveType: "Unpaid", leaveUnit: "Days", status: "Active", duration: 3, createdBy: "HR Department", notificationPeriod: "Immediate", carryOver: "Not allowed", note: "For urgent unforeseen circumstances.", maxLeaves: 5, annualLimit: 5 },
  { id: "LT-004", leaveName: "Family Leave", leaveType: "Unpaid", leaveUnit: "Hours", status: "Inactive", duration: 12, createdBy: "HR Department", notificationPeriod: "48 hours prior", carryOver: "Not allowed", note: "Leave for family-related responsibilities.", maxLeaves: 10, annualLimit: 15 },
  { id: "LT-005", leaveName: "Sick Leave", leaveType: "Unpaid", leaveUnit: "Days", status: "Active", duration: 10, createdBy: "HR Department", notificationPeriod: "48 hours prior", carryOver: "Allowed up to 5 days", note: "Medical leave with doctor's certificate required for 3+ days.", maxLeaves: 10, annualLimit: 12 },
  { id: "LT-006", leaveName: "Casual Leave", leaveType: "Unpaid", leaveUnit: "Days", status: "Active", duration: 8, createdBy: "HR Department", notificationPeriod: "24 hours prior", carryOver: "Not allowed", note: "Short-term personal leave.", maxLeaves: 8, annualLimit: 10 },
  { id: "LT-007", leaveName: "Maternity Leave", leaveType: "Paid", leaveUnit: "Days", status: "Inactive", duration: 90, createdBy: "HR Department", notificationPeriod: "1 month prior", carryOver: "Not applicable", note: "As per government maternity benefit act.", maxLeaves: 90, annualLimit: 90 },
  { id: "LT-008", leaveName: "Sick Leave", leaveType: "Unpaid", leaveUnit: "Days", status: "Active", duration: 10, createdBy: "HR Department", notificationPeriod: "48 hours prior", carryOver: "Allowed up to 3 days", note: "Extended sick leave policy.", maxLeaves: 10, annualLimit: 15 },
  { id: "LT-009", leaveName: "Sick Leave", leaveType: "Unpaid", leaveUnit: "Days", status: "Active", duration: 10, createdBy: "HR Department", notificationPeriod: "48 hours prior", carryOver: "Allowed up to 3 days", note: "Supplementary sick leave allocation.", maxLeaves: 10, annualLimit: 15 },
  { id: "LT-010", leaveName: "Casual Leave", leaveType: "Unpaid", leaveUnit: "Days", status: "Active", duration: 8, createdBy: "HR Department", notificationPeriod: "24 hours prior", carryOver: "Not allowed", note: "Additional casual leave quota.", maxLeaves: 8, annualLimit: 10 },
];

const LeaveTypesPage = () => {
  const [types, setTypes] = useState(initialTypes);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editType, setEditType] = useState<LeaveType | null>(null);
  const [deleteType, setDeleteType] = useState<LeaveType | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = types.filter(t => {
    const ms = t.leaveName.toLowerCase().includes(search.toLowerCase()) ||
      t.leaveType.toLowerCase().includes(search.toLowerCase());
    return ms && (statusFilter === "All" || t.status === statusFilter);
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const allSelected = paged.length > 0 && paged.every(t => selectedIds.includes(t.id));
  const toggleAll = () => { if (allSelected) setSelectedIds(p => p.filter(id => !paged.some(t => t.id === id))); else setSelectedIds(p => [...new Set([...p, ...paged.map(t => t.id)])]); };
  const toggleOne = (id: string) => setSelectedIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Leave Types</h1>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">Leave Types</span>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search..." className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg w-48 focus:outline-none focus:border-blue-400 text-gray-900 placeholder:text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ToolbarDropdown value={statusFilter} options={typeStatuses} onChange={v => { setStatusFilter(v); setPage(1); }} allLabel="All Status" />
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Filter"><Filter className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Download"><Download className="w-4 h-4" /></button>
            <button onClick={() => setAddOpen(true)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="Add Leave Type"><UserPlus className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3 w-10"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded" /></th>
                <th className="px-4 py-3 font-semibold">Leave Name</th>
                <th className="px-4 py-3 font-semibold">Leave Type</th>
                <th className="px-4 py-3 font-semibold">Leave Unit</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-center">Duration (Days)</th>
                <th className="px-4 py-3 font-semibold">Created By</th>
                <th className="px-4 py-3 font-semibold">Notification Period</th>
                <th className="px-4 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(lt => {
                const sc = statusConfig[lt.status];
                return (
                  <tr key={lt.id} className="border-t border-gray-50 hover:bg-blue-50/20 transition-colors group">
                    <td className="px-4 py-3.5"><input type="checkbox" checked={selectedIds.includes(lt.id)} onChange={() => toggleOne(lt.id)} className="rounded" /></td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-gray-900">{lt.leaveName}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        lt.leaveType === "Paid" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                      }`}>
                        {lt.leaveType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-gray-700 font-medium">{lt.leaveUnit}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${sc.bg} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${lt.status === "Active" ? "bg-emerald-500" : "bg-red-500"}`} />
                        {lt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold text-[12px]">{lt.duration}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-gray-700 font-medium">{lt.createdBy}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-gray-600 text-[11px]">{lt.notificationPeriod}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => setEditType({ ...lt })} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteType(lt)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length === 0 && <tr><td colSpan={9} className="text-center py-14 text-gray-400 text-sm">No leave types found.</td></tr>}
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
      {(editType || addOpen) && (
        <TypeModal
          leaveType={editType || undefined}
          isAdd={addOpen && !editType}
          onClose={() => { setEditType(null); setAddOpen(false); }}
          onSave={t => {
            if (editType) setTypes(prev => prev.map(x => x.id === t.id ? t : x));
            else setTypes(prev => [...prev, { ...t, id: `LT-${String(prev.length + 1).padStart(3, "0")}` }]);
            setEditType(null); setAddOpen(false);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteType(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Leave Type</h3>
            <p className="text-sm text-gray-500 mb-5">
              Remove <strong className="text-gray-800">{deleteType.leaveName}</strong>?
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => { setTypes(prev => prev.filter(t => t.id !== deleteType.id)); setDeleteType(null); }}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-semibold shadow-md shadow-red-500/20 transition-all">Delete</button>
              <button onClick={() => setDeleteType(null)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Type Modal (Edit / Add)
   ═══════════════════════════════════════════ */
const emptyType: LeaveType = {
  id: "", leaveName: "", leaveType: "Paid", leaveUnit: "Days", status: "Active",
  duration: 0, createdBy: "HR Department", notificationPeriod: "",
  carryOver: "", note: "", maxLeaves: 0, annualLimit: 0,
};

const TypeModal = ({ leaveType, isAdd, onClose, onSave }: {
  leaveType?: LeaveType; isAdd: boolean; onClose: () => void; onSave: (t: LeaveType) => void;
}) => {
  const [form, setForm] = useState<LeaveType>(leaveType ? { ...leaveType } : { ...emptyType });
  const set = <K extends keyof LeaveType>(k: K, v: LeaveType[K]) => setForm(prev => ({ ...prev, [k]: v }));

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
                  {isAdd ? <Layers className="w-5 h-5 text-white" /> : <FileText className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">{isAdd ? "Add Leave Type" : `Edit Leave Type - ${form.leaveName}`}</h2>
                  <p className="text-white/60 text-[11px]">{isAdd ? "Create a new leave type" : "Modify leave type configuration"}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"><X className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<FileText className="w-4 h-4 text-gray-400" />} label="Leave Name" value={form.leaveName} onChange={v => set("leaveName", v)} />
            <StyledDropdown label="Leave Type" required value={form.leaveType} options={payTypes} onChange={v => set("leaveType", v as PayType)} icon={<Briefcase className="w-4 h-4" />} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StyledDropdown label="Leave Unit" required value={form.leaveUnit} options={leaveUnits} onChange={v => set("leaveUnit", v as LeaveUnit)} icon={<Timer className="w-4 h-4" />} />
            <StyledDropdown label="Status" required value={form.status} options={typeStatuses} onChange={v => set("status", v as TypeStatus)} icon={<Shield className="w-4 h-4" />} />
          </div>
          <FieldTextarea label="Note" value={form.note} onChange={v => set("note", v)} />
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<CalendarDays className="w-4 h-4 text-gray-400" />} label="Duration" value={String(form.duration)} type="number" onChange={v => set("duration", parseInt(v) || 0)} />
            <FieldInput icon={<Briefcase className="w-4 h-4 text-gray-400" />} label="Created By" value={form.createdBy} onChange={v => set("createdBy", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<RotateCcw className="w-4 h-4 text-gray-400" />} label="Carry Over" value={form.carryOver} onChange={v => set("carryOver", v)} />
            <FieldInput icon={<Bell className="w-4 h-4 text-gray-400" />} label="Notification Period" value={form.notificationPeriod} onChange={v => set("notificationPeriod", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<Hash className="w-4 h-4 text-gray-400" />} label="Max Leaves" value={String(form.maxLeaves)} type="number" onChange={v => set("maxLeaves", parseInt(v) || 0)} />
            <FieldInput icon={<Hash className="w-4 h-4 text-gray-400" />} label="Annual Limit" value={String(form.annualLimit)} type="number" onChange={v => set("annualLimit", parseInt(v) || 0)} />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => onSave(form)}
              className={`px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition-all ${
                isAdd ? "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20 hover:shadow-lg" : "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/20 hover:shadow-lg"
              }`}>
              {isAdd ? "Add Leave Type" : "Save"}
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
    <legend className="text-[11px] font-semibold text-gray-700 px-1">{label}</legend>
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
      className="w-full text-sm text-gray-900 bg-transparent focus:outline-none resize-y" />
  </fieldset>
);

export default LeaveTypesPage;
