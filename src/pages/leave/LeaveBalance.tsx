import { useState } from "react";
import {
  Search, Filter, RefreshCw, Download, UserPlus,
  Edit3, Trash2, X, User, ChevronLeft, ChevronRight,
  CheckCircle2, XCircle, Clock, CalendarDays, Wallet,
  TrendingUp, RotateCcw, AlertTriangle, BarChart3
} from "lucide-react";
import { ToolbarDropdown, PaginationDropdown } from "@/components/ui/StyledDropdown";

interface LeaveBalance {
  id: string;
  employeeName: string;
  previousBalance: number;
  currentBalance: number;
  totalBalance: number;
  usedLeave: number;
  acceptedLeave: number;
  rejectedLeave: number;
  expiredLeave: number;
  carryOver: number;
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

const initialBalances: LeaveBalance[] = [
  { id: "LB-001", employeeName: "Shriyash Jagtap", previousBalance: 12, currentBalance: 18, totalBalance: 30, usedLeave: 8, acceptedLeave: 14, rejectedLeave: 1, expiredLeave: 3, carryOver: 7 },
  { id: "LB-002", employeeName: "Jitesh Naidu", previousBalance: 10, currentBalance: 15, totalBalance: 25, usedLeave: 12, acceptedLeave: 10, rejectedLeave: 2, expiredLeave: 5, carryOver: 5 },
  { id: "LB-003", employeeName: "Shubham Jadhav", previousBalance: 10, currentBalance: 15, totalBalance: 25, usedLeave: 15, acceptedLeave: 10, rejectedLeave: 2, expiredLeave: 5, carryOver: 5 },
  { id: "LB-004", employeeName: "John Doe", previousBalance: 10, currentBalance: 15, totalBalance: 25, usedLeave: 15, acceptedLeave: 10, rejectedLeave: 2, expiredLeave: 5, carryOver: 5 },
  { id: "LB-005", employeeName: "Sarah Smith", previousBalance: 10, currentBalance: 15, totalBalance: 25, usedLeave: 15, acceptedLeave: 10, rejectedLeave: 2, expiredLeave: 5, carryOver: 5 },
  { id: "LB-006", employeeName: "Robert Johnson", previousBalance: 10, currentBalance: 15, totalBalance: 25, usedLeave: 15, acceptedLeave: 10, rejectedLeave: 2, expiredLeave: 5, carryOver: 5 },
  { id: "LB-007", employeeName: "Michael Brown", previousBalance: 10, currentBalance: 15, totalBalance: 25, usedLeave: 15, acceptedLeave: 10, rejectedLeave: 2, expiredLeave: 5, carryOver: 5 },
  { id: "LB-008", employeeName: "Emily Davis", previousBalance: 10, currentBalance: 15, totalBalance: 25, usedLeave: 15, acceptedLeave: 10, rejectedLeave: 2, expiredLeave: 5, carryOver: 5 },
  { id: "LB-009", employeeName: "William Wilson", previousBalance: 10, currentBalance: 15, totalBalance: 25, usedLeave: 15, acceptedLeave: 10, rejectedLeave: 2, expiredLeave: 5, carryOver: 5 },
  { id: "LB-010", employeeName: "Jessica Taylor", previousBalance: 10, currentBalance: 15, totalBalance: 25, usedLeave: 15, acceptedLeave: 10, rejectedLeave: 2, expiredLeave: 5, carryOver: 5 },
  { id: "LB-011", employeeName: "David Anderson", previousBalance: 10, currentBalance: 15, totalBalance: 25, usedLeave: 15, acceptedLeave: 10, rejectedLeave: 2, expiredLeave: 5, carryOver: 5 },
  { id: "LB-012", employeeName: "Linda Thomas", previousBalance: 10, currentBalance: 15, totalBalance: 25, usedLeave: 15, acceptedLeave: 10, rejectedLeave: 2, expiredLeave: 5, carryOver: 5 },
  { id: "LB-013", employeeName: "James Jackson", previousBalance: 10, currentBalance: 15, totalBalance: 25, usedLeave: 15, acceptedLeave: 10, rejectedLeave: 2, expiredLeave: 5, carryOver: 5 },
];

const LeaveBalancePage = () => {
  const [balances, setBalances] = useState(initialBalances);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editBalance, setEditBalance] = useState<LeaveBalance | null>(null);
  const [deleteBalance, setDeleteBalance] = useState<LeaveBalance | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = balances.filter(b =>
    b.employeeName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const allSelected = paged.length > 0 && paged.every(b => selectedIds.includes(b.id));
  const toggleAll = () => { if (allSelected) setSelectedIds(p => p.filter(id => !paged.some(b => b.id === id))); else setSelectedIds(p => [...new Set([...p, ...paged.map(b => b.id)])]); };
  const toggleOne = (id: string) => setSelectedIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);

  const totUsed = balances.reduce((a, b) => a + b.usedLeave, 0);
  const totAccepted = balances.reduce((a, b) => a + b.acceptedLeave, 0);
  const totRejected = balances.reduce((a, b) => a + b.rejectedLeave, 0);
  const totCarry = balances.reduce((a, b) => a + b.carryOver, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Leave Balance</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard gradient="from-blue-500 to-indigo-600" icon={<BarChart3 className="w-5 h-5 text-white" />} label="Total Employees" value={String(balances.length)} sub="With balance records" />
        <KpiCard gradient="from-amber-500 to-orange-600" icon={<CalendarDays className="w-5 h-5 text-white" />} label="Total Used" value={String(totUsed)} sub="Leaves taken" />
        <KpiCard gradient="from-emerald-500 to-teal-600" icon={<CheckCircle2 className="w-5 h-5 text-white" />} label="Total Accepted" value={String(totAccepted)} sub="Leaves approved" />
        <KpiCard gradient="from-red-500 to-rose-600" icon={<XCircle className="w-5 h-5 text-white" />} label="Total Rejected" value={String(totRejected)} sub="Leaves denied" />
        <KpiCard gradient="from-purple-500 to-fuchsia-600" icon={<RotateCcw className="w-5 h-5 text-white" />} label="Total Carry Over" value={String(totCarry)} sub="Rolled forward" />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">Leave Balance</span>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search..." className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg w-48 focus:outline-none focus:border-blue-400 text-gray-900 placeholder:text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Filter"><Filter className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Download"><Download className="w-4 h-4" /></button>
            <button onClick={() => setAddOpen(true)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="Add Balance"><UserPlus className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3 w-10"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded" /></th>
                <th className="px-4 py-3 font-semibold">Employee Name</th>
                <th className="px-4 py-3 font-semibold text-center">Previous Balance</th>
                <th className="px-4 py-3 font-semibold text-center">Current Balance</th>
                <th className="px-4 py-3 font-semibold text-center">Total Balance</th>
                <th className="px-4 py-3 font-semibold text-center">Used Leave</th>
                <th className="px-4 py-3 font-semibold text-center">Accepted Leave</th>
                <th className="px-4 py-3 font-semibold text-center">Rejected Leave</th>
                <th className="px-4 py-3 font-semibold text-center">Expired Leave</th>
                <th className="px-4 py-3 font-semibold text-center">Carry Over Balance</th>
                <th className="px-4 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(bal => (
                <tr key={bal.id} className="border-t border-gray-50 hover:bg-blue-50/20 transition-colors group">
                  <td className="px-4 py-3.5"><input type="checkbox" checked={selectedIds.includes(bal.id)} onChange={() => toggleOne(bal.id)} className="rounded" /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getColor(bal.employeeName)} flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm`}>
                        {getInitials(bal.employeeName)}
                      </div>
                      <span className="font-semibold text-gray-900 whitespace-nowrap">{bal.employeeName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-bold text-[12px]">{bal.previousBalance}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold text-[12px]">{bal.currentBalance}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-[12px]">{bal.totalBalance}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 text-amber-700 font-bold text-[12px]">{bal.usedLeave}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[12px]">{bal.acceptedLeave}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-700 font-bold text-[12px]">{bal.rejectedLeave}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 text-purple-700 font-bold text-[12px]">{bal.expiredLeave}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 font-bold text-[12px]">{bal.carryOver}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => setEditBalance({ ...bal })} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteBalance(bal)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && <tr><td colSpan={11} className="text-center py-14 text-gray-400 text-sm">No records found.</td></tr>}
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
      {(editBalance || addOpen) && (
        <BalanceModal
          balance={editBalance || undefined}
          isAdd={addOpen && !editBalance}
          onClose={() => { setEditBalance(null); setAddOpen(false); }}
          onSave={b => {
            if (editBalance) setBalances(prev => prev.map(x => x.id === b.id ? b : x));
            else setBalances(prev => [...prev, { ...b, id: `LB-${String(prev.length + 1).padStart(3, "0")}` }]);
            setEditBalance(null); setAddOpen(false);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteBalance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteBalance(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Remove Balance Record</h3>
            <p className="text-sm text-gray-500 mb-5">
              Remove leave balance for <strong className="text-gray-800">{deleteBalance.employeeName}</strong>?
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => { setBalances(prev => prev.filter(b => b.id !== deleteBalance.id)); setDeleteBalance(null); }}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-semibold shadow-md shadow-red-500/20 transition-all">Delete</button>
              <button onClick={() => setDeleteBalance(null)}
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
   Balance Modal (Edit)
   ═══════════════════════════════════════════ */
const emptyBalance: LeaveBalance = {
  id: "", employeeName: "", previousBalance: 0, currentBalance: 0,
  totalBalance: 0, usedLeave: 0, acceptedLeave: 0, rejectedLeave: 0,
  expiredLeave: 0, carryOver: 0,
};

const BalanceModal = ({ balance, isAdd, onClose, onSave }: {
  balance?: LeaveBalance; isAdd: boolean; onClose: () => void; onSave: (b: LeaveBalance) => void;
}) => {
  const [form, setForm] = useState<LeaveBalance>(balance ? { ...balance } : { ...emptyBalance });
  const set = <K extends keyof LeaveBalance>(k: K, v: LeaveBalance[K]) => setForm(prev => ({ ...prev, [k]: v }));

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
                <div className={`w-10 h-10 rounded-xl ${form.employeeName ? `bg-gradient-to-br ${getColor(form.employeeName)}` : "bg-white/20"} flex items-center justify-center shadow-lg ring-2 ring-white/30`}>
                  {form.employeeName ? (
                    <span className="text-white font-bold text-sm">{getInitials(form.employeeName)}</span>
                  ) : (
                    <UserPlus className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">{isAdd ? (form.employeeName || "Add Leave Balance") : form.employeeName}</h2>
                  <p className="text-white/60 text-[11px]">{isAdd ? "Create a new balance record" : "Edit leave balance record"}</p>
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
            <FieldInput icon={<Wallet className="w-4 h-4 text-gray-400" />} label="Previous Balance" value={String(form.previousBalance)} type="number" onChange={v => set("previousBalance", parseInt(v) || 0)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<TrendingUp className="w-4 h-4 text-gray-400" />} label="Current Balance" value={String(form.currentBalance)} type="number" onChange={v => set("currentBalance", parseInt(v) || 0)} />
            <FieldInput icon={<BarChart3 className="w-4 h-4 text-gray-400" />} label="Total Balance" value={String(form.totalBalance)} type="number" onChange={v => set("totalBalance", parseInt(v) || 0)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<CalendarDays className="w-4 h-4 text-gray-400" />} label="Used Balance" value={String(form.usedLeave)} type="number" onChange={v => set("usedLeave", parseInt(v) || 0)} />
            <FieldInput icon={<CheckCircle2 className="w-4 h-4 text-gray-400" />} label="Accepted" value={String(form.acceptedLeave)} type="number" onChange={v => set("acceptedLeave", parseInt(v) || 0)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<XCircle className="w-4 h-4 text-gray-400" />} label="Rejected" value={String(form.rejectedLeave)} type="number" onChange={v => set("rejectedLeave", parseInt(v) || 0)} />
            <FieldInput icon={<AlertTriangle className="w-4 h-4 text-gray-400" />} label="Expired" value={String(form.expiredLeave)} type="number" onChange={v => set("expiredLeave", parseInt(v) || 0)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<RotateCcw className="w-4 h-4 text-gray-400" />} label="Carry Over" value={String(form.carryOver)} type="number" onChange={v => set("carryOver", parseInt(v) || 0)} />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => onSave(form)}
              className={`px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition-all ${
                isAdd ? "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20 hover:shadow-lg" : "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/20 hover:shadow-lg"
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
   Reusable Field
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

export default LeaveBalancePage;
