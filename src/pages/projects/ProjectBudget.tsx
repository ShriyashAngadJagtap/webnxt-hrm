import { useState, useRef, useEffect } from "react";
import {
  Search, Filter, RefreshCw, Download, UserPlus, Edit3, Trash2,
  CalendarDays, ChevronLeft, ChevronRight, ChevronDown, X, Check,
  Wallet, ShoppingCart, PiggyBank, HeartPulse, DollarSign,
} from "lucide-react";

/* ═══════════════════════════════════════════
   Types & Data
   ═══════════════════════════════════════════ */

type BudgetStatus = "Approved" | "Pending" | "Rejected";
type Category = "Infrastructure" | "Software" | "Services" | "General";

interface Transaction {
  id: string;
  description: string;
  category: Category;
  amount: number;
  date: string;
  status: BudgetStatus;
}

const initialTransactions: Transaction[] = [
  { id: "B001", description: "Server Hosting", category: "Infrastructure", amount: 1200, date: "2024-01-05", status: "Approved" },
  { id: "B002", description: "UI/UX Design Tools", category: "Software", amount: 450, date: "2024-01-10", status: "Approved" },
  { id: "B003", description: "External Consultant", category: "Services", amount: 5000, date: "2024-01-15", status: "Pending" },
  { id: "B004", description: "API Subscription", category: "Software", amount: 200, date: "2024-01-20", status: "Approved" },
  { id: "B005", description: "Hardware Upgrade", category: "Infrastructure", amount: 3500, date: "2024-01-25", status: "Rejected" },
  { id: "B006", description: "SSL Certificate", category: "Software", amount: 150, date: "2024-01-28", status: "Approved" },
  { id: "B007", description: "Project Management Tool", category: "Software", amount: 600, date: "2024-02-01", status: "Approved" },
  { id: "B008", description: "Team Offsite", category: "General", amount: 2200, date: "2024-02-05", status: "Pending" },
  { id: "B009", description: "Google Cloud Platform", category: "Infrastructure", amount: 800, date: "2024-02-10", status: "Approved" },
  { id: "B010", description: "Legal Documentation", category: "Services", amount: 1500, date: "2024-02-12", status: "Approved" },
  { id: "B011", description: "Domain & DNS", category: "Infrastructure", amount: 100, date: "2024-02-18", status: "Approved" },
  { id: "B012", description: "Marketing Campaign", category: "General", amount: 4300, date: "2024-02-22", status: "Pending" },
];

const TOTAL_BUDGET = 50000;

const statusConfig: Record<BudgetStatus, { bg: string; text: string }> = {
  Approved: { bg: "bg-emerald-100", text: "text-emerald-700" },
  Pending: { bg: "bg-amber-100", text: "text-amber-700" },
  Rejected: { bg: "bg-red-100", text: "text-red-700" },
};

const categories: Category[] = ["Infrastructure", "Software", "Services", "General"];
const statuses: BudgetStatus[] = ["Approved", "Pending", "Rejected"];

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */

const ProjectBudget = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BudgetStatus | "All">("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editTxn, setEditTxn] = useState<Transaction | null>(null);
  const [deleteTxn, setDeleteTxn] = useState<Transaction | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const usedBudget = transactions.filter(t => t.status === "Approved").reduce((s, t) => s + t.amount, 0);
  const remaining = TOTAL_BUDGET - usedBudget;
  const usedPct = Math.round((usedBudget / TOTAL_BUDGET) * 100);
  const health = usedPct <= 60 ? "Stable" : usedPct <= 85 ? "Moderate" : "Critical";
  const healthColor = health === "Stable" ? "from-emerald-500 to-emerald-600" : health === "Moderate" ? "from-amber-500 to-amber-600" : "from-red-500 to-red-600";

  const filtered = transactions.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const allSelected = paginated.length > 0 && paginated.every(t => selectedIds.has(t.id));

  const toggleSelectAll = () => {
    if (allSelected) { const n = new Set(selectedIds); paginated.forEach(t => n.delete(t.id)); setSelectedIds(n); }
    else { const n = new Set(selectedIds); paginated.forEach(t => n.add(t.id)); setSelectedIds(n); }
  };
  const toggleSelect = (id: string) => { const n = new Set(selectedIds); n.has(id) ? n.delete(id) : n.add(id); setSelectedIds(n); };

  const handleDelete = () => { if (deleteTxn) { setTransactions(p => p.filter(t => t.id !== deleteTxn.id)); setDeleteTxn(null); } };
  const handleSaveEdit = (u: Transaction) => { setTransactions(p => p.map(t => t.id === u.id ? u : t)); setEditTxn(null); };
  const handleAddTxn = (t: Omit<Transaction, "id">) => {
    const id = `B${String(transactions.length + 1).padStart(3, "0")}`;
    setTransactions(p => [...p, { ...t, id }]);
    setAddOpen(false);
  };

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Project Budget</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard gradient="from-blue-500 to-blue-600" icon={<Wallet className="w-5 h-5 text-white" />} label="Total Budget" sublabel="Allocated budget" value={fmt(TOTAL_BUDGET)} />
        <KpiCard gradient="from-orange-500 to-orange-600" icon={<ShoppingCart className="w-5 h-5 text-white" />} label="Used Budget" sublabel={`${usedPct}% of total`} value={fmt(usedBudget)} />
        <KpiCard gradient="from-emerald-500 to-emerald-600" icon={<PiggyBank className="w-5 h-5 text-white" />} label="Remaining" sublabel="Available funds" value={fmt(remaining)} />
        <KpiCard gradient={healthColor} icon={<HeartPulse className="w-5 h-5 text-white" />} label="Health" sublabel="Budget status" value={health} large />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-visible">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 min-w-[220px]">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search transactions..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent text-[13px] font-medium text-gray-900 placeholder:text-gray-400 outline-none flex-1" />
          </div>
          <div className="flex items-center gap-2">
            <div ref={filterRef} className="relative">
              <button onClick={() => setFilterOpen(!filterOpen)}
                className={`p-2.5 rounded-xl border transition-all ${filterOpen ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}>
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
              {filterOpen && (
                <div className="absolute right-0 top-full mt-1.5 bg-white rounded-xl border border-gray-200 shadow-xl py-1.5 w-40 z-50 animate-fade-in">
                  <button onClick={() => { setStatusFilter("All"); setFilterOpen(false); setPage(1); }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] font-semibold flex items-center justify-between ${statusFilter === "All" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"}`}>
                    All {statusFilter === "All" && <Check className="w-3.5 h-3.5" />}
                  </button>
                  {statuses.map(s => (
                    <button key={s} onClick={() => { setStatusFilter(s); setFilterOpen(false); setPage(1); }}
                      className={`w-full text-left px-4 py-2.5 text-[13px] font-semibold flex items-center justify-between ${statusFilter === s ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"}`}>
                      <span className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${statusConfig[s].bg.replace("100","500")}`} />{s}</span>
                      {statusFilter === s && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => { setSearch(""); setStatusFilter("All"); setPage(1); }}
              className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:border-gray-300 transition-all"><RefreshCw className="w-4 h-4 text-gray-600" /></button>
            <button className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:border-gray-300 transition-all"><Download className="w-4 h-4 text-gray-600" /></button>
            <button onClick={() => setAddOpen(true)} className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all"><UserPlus className="w-4 h-4 text-blue-600" /></button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="pl-5 py-3 w-10"><input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer" /></th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="py-3 pr-5 text-[12px] font-bold text-gray-600 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((txn, idx) => {
                const sc = statusConfig[txn.status];
                return (
                  <tr key={txn.id} className={`border-b border-gray-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"} hover:bg-blue-50/30`}>
                    <td className="pl-5 py-3.5"><input type="checkbox" checked={selectedIds.has(txn.id)} onChange={() => toggleSelect(txn.id)} className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer" /></td>
                    <td className="py-3.5"><span className="text-[13px] font-bold text-gray-900">{txn.description}</span></td>
                    <td className="py-3.5"><span className="text-[13px] font-semibold text-gray-700">{txn.category}</span></td>
                    <td className="py-3.5"><span className="text-[13px] font-bold text-gray-900">{txn.amount.toLocaleString()}</span></td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-gray-700">
                        <CalendarDays className="w-3.5 h-3.5 text-blue-500" />{txn.date}
                      </span>
                    </td>
                    <td className="py-3.5"><span className={`px-3 py-1 rounded-full text-[11px] font-bold ${sc.bg} ${sc.text}`}>{txn.status}</span></td>
                    <td className="py-3.5 pr-5">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setEditTxn({ ...txn })} className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors group"><Edit3 className="w-4 h-4 text-blue-500 group-hover:text-blue-700" /></button>
                        <button onClick={() => setDeleteTxn(txn)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors group"><Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-600" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-[14px] font-medium">No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-end gap-4 text-[12px] font-semibold text-gray-600">
          <div className="flex items-center gap-2">
            <span>Items per page</span>
            <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="border border-gray-200 rounded-lg px-2 py-1 text-[12px] font-semibold bg-white outline-none cursor-pointer">
              <option value={5}>5</option><option value={10}>10</option><option value={20}>20</option>
            </select>
          </div>
          <span>{(page - 1) * perPage + 1} - {Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>

      {/* Edit Transaction Modal */}
      {editTxn && <EditModal txn={editTxn} onSave={handleSaveEdit} onClose={() => setEditTxn(null)} />}

      {/* Add Transaction Modal */}
      {addOpen && <AddModal onSave={handleAddTxn} onClose={() => setAddOpen(false)} />}

      {/* Delete Confirmation */}
      {deleteTxn && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setDeleteTxn(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-[16px] font-bold text-gray-900 mb-2">Delete Transaction</h3>
            <p className="text-[13px] text-gray-600 mb-5">
              Are you sure you want to delete <span className="font-bold text-gray-900">"{deleteTxn.description}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={handleDelete} className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold transition-colors">Delete</button>
              <button onClick={() => setDeleteTxn(null)} className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-bold transition-colors">Cancel</button>
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

const KpiCard = ({ gradient, icon, label, sublabel, value, large }: {
  gradient: string; icon: React.ReactNode; label: string; sublabel: string; value: string; large?: boolean;
}) => (
  <div className={`rounded-2xl bg-gradient-to-br ${gradient} px-7 py-9 text-white shadow-lg min-h-[130px] flex flex-col justify-center`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[15px] font-bold opacity-95">{label}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">{icon}</div>
          <p className="text-[11px] font-medium opacity-75">{sublabel}</p>
        </div>
      </div>
      <p className={`font-extrabold ${large ? "text-[32px]" : "text-[26px]"} leading-tight`}>{value}</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   Edit Transaction Modal
   ═══════════════════════════════════════════ */

interface EditModalProps {
  txn: Transaction;
  onSave: (t: Transaction) => void;
  onClose: () => void;
}

const EditModal = ({ txn, onSave, onClose }: EditModalProps) => {
  const [form, setForm] = useState({ ...txn });

  const handleSubmit = () => { onSave(form); };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-white">Edit Transaction: {txn.description}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"><X className="w-5 h-5 text-white" /></button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Description */}
            <FieldInput label="Description" required value={form.description}
              onChange={v => setForm(f => ({ ...f, description: v }))} />

            {/* Category */}
            <FieldSelect label="Category" required value={form.category}
              options={categories} onChange={v => setForm(f => ({ ...f, category: v as Category }))} />

            {/* Amount */}
            <FieldInput label="Amount" required type="number" value={String(form.amount)}
              onChange={v => setForm(f => ({ ...f, amount: Number(v) }))}
              icon={<DollarSign className="w-4 h-4 text-gray-400" />} />

            {/* Status */}
            <FieldSelect label="Status" required value={form.status}
              options={statuses} onChange={v => setForm(f => ({ ...f, status: v as BudgetStatus }))} />

            {/* Date */}
            <FieldInput label="Date" required type="date" value={form.date}
              onChange={v => setForm(f => ({ ...f, date: v }))}
              icon={<CalendarDays className="w-4 h-4 text-gray-400" />} />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold transition-colors shadow-md">Save</button>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Form Sub-components
   ═══════════════════════════════════════════ */

const FieldInput = ({ label, required, value, onChange, type = "text", icon }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; type?: string; icon?: React.ReactNode;
}) => (
  <fieldset className="border-2 rounded-xl px-3.5 pt-1 pb-2.5 transition-all border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
    <legend className="text-[11px] font-semibold text-gray-700 px-1">{label}{required && <span className="text-red-500">*</span>}</legend>
    <div className="flex items-center gap-2">
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
      {icon && <span className="shrink-0">{icon}</span>}
    </div>
  </fieldset>
);

const FieldSelect = ({ label, required, value, options, onChange }: {
  label: string; required?: boolean; value: string; options: string[]; onChange: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLFieldSetElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <fieldset ref={ref}
      className={`border-2 rounded-xl px-3.5 pt-1 pb-2.5 cursor-pointer relative transition-all ${
        open ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-300 hover:border-gray-400"
      }`}
      onClick={() => setOpen(!open)}>
      <legend className="text-[11px] font-semibold text-gray-700 px-1">{label}{required && <span className="text-red-500">*</span>}</legend>
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-semibold text-gray-900">{value}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-50 animate-fade-in">
          {options.map(o => (
            <button key={o} type="button" onClick={e => { e.stopPropagation(); onChange(o); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-[13px] font-semibold transition-all flex items-center justify-between ${
                value === o ? "bg-blue-50 text-blue-700" : "text-gray-800 hover:bg-gray-50"
              }`}>
              {o} {value === o && <Check className="w-3.5 h-3.5 text-blue-500" />}
            </button>
          ))}
        </div>
      )}
    </fieldset>
  );
};

/* ═══════════════════════════════════════════
   Add Transaction Modal
   ═══════════════════════════════════════════ */

const AddModal = ({ onSave, onClose }: { onSave: (t: Omit<Transaction, "id">) => void; onClose: () => void }) => {
  const [form, setForm] = useState({ description: "", category: "Infrastructure" as Category, amount: 0, date: "", status: "Pending" as BudgetStatus });

  const handleSubmit = () => {
    if (!form.description.trim() || !form.date) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-white">Add New Transaction</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"><X className="w-5 h-5 text-white" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldInput label="Description" required value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} />
            <FieldSelect label="Category" required value={form.category} options={categories} onChange={v => setForm(f => ({ ...f, category: v as Category }))} />
            <FieldInput label="Amount" required type="number" value={form.amount ? String(form.amount) : ""} onChange={v => setForm(f => ({ ...f, amount: Number(v) }))} icon={<DollarSign className="w-4 h-4 text-gray-400" />} />
            <FieldSelect label="Status" required value={form.status} options={statuses} onChange={v => setForm(f => ({ ...f, status: v as BudgetStatus }))} />
            <FieldInput label="Date" required type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} icon={<CalendarDays className="w-4 h-4 text-gray-400" />} />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold transition-colors shadow-md">Save</button>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectBudget;
