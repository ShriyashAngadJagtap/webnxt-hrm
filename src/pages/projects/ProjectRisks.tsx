import { useState, useRef, useEffect } from "react";
import {
  Search, Filter, RefreshCw, Download, Plus, Edit3, Trash2,
  ChevronLeft, ChevronRight, ChevronDown, X, Check, User,
} from "lucide-react";

/* ═══════════════════════════════════════════
   Types & Data
   ═══════════════════════════════════════════ */

type RiskType = "Risk" | "Issue";
type Impact = "High" | "Medium" | "Low";
type Probability = "High" | "Medium" | "Low" | "N/A";
type RiskStatus = "Open" | "Mitigated" | "Closed";

interface RiskItem {
  id: string;
  description: string;
  type: RiskType;
  impact: Impact;
  probability: Probability;
  status: RiskStatus;
  owner: string;
}

const initialRisks: RiskItem[] = [
  { id: "R001", description: "Budget overruns on software licenses", type: "Risk", impact: "High", probability: "Medium", status: "Open", owner: "Jayesh Patel" },
  { id: "R002", description: "Delayed API response from vendor", type: "Issue", impact: "Medium", probability: "N/A", status: "Open", owner: "Rohan Sharma" },
  { id: "R003", description: "Scope creep due to new requirements", type: "Risk", impact: "High", probability: "High", status: "Mitigated", owner: "Sarah Smith" },
  { id: "R004", description: "Server downtime during migration", type: "Risk", impact: "High", probability: "Low", status: "Open", owner: "Michael Ross" },
  { id: "R005", description: "Missing documentation for legacy code", type: "Issue", impact: "Low", probability: "N/A", status: "Closed", owner: "John Deo" },
  { id: "R006", description: "Integration issues with third-party CRM", type: "Issue", impact: "High", probability: "N/A", status: "Open", owner: "Pooja Sharma" },
  { id: "R007", description: "Potential shortage of specialized developers", type: "Risk", impact: "Medium", probability: "Medium", status: "Open", owner: "Sarah Smith" },
  { id: "R008", description: "User data privacy compliance (GDPR)", type: "Risk", impact: "High", probability: "Low", status: "Mitigated", owner: "Emily Clark" },
  { id: "R009", description: "Slow performance on mobile devices", type: "Issue", impact: "Medium", probability: "N/A", status: "Open", owner: "Pankaj Patel" },
  { id: "R010", description: "Unexpected license fee increase", type: "Risk", impact: "Medium", probability: "Low", status: "Open", owner: "Jayesh Patel" },
  { id: "R011", description: "Testing environment instability", type: "Issue", impact: "High", probability: "N/A", status: "Open", owner: "Vikram Singh" },
  { id: "R012", description: "Key team member resignation risk", type: "Risk", impact: "High", probability: "Medium", status: "Open", owner: "Shriyash Jagtap" },
];

const impactConfig: Record<Impact, { dot: string; text: string; flag: string }> = {
  High: { dot: "bg-red-500", text: "text-red-600", flag: "🚩" },
  Medium: { dot: "bg-amber-500", text: "text-amber-600", flag: "⚠" },
  Low: { dot: "bg-emerald-500", text: "text-emerald-600", flag: "✓" },
};

const statusConfig: Record<RiskStatus, { bg: string; text: string }> = {
  Open: { bg: "bg-red-100", text: "text-red-700" },
  Mitigated: { bg: "bg-blue-100", text: "text-blue-700" },
  Closed: { bg: "bg-emerald-100", text: "text-emerald-700" },
};

const avatarColors: Record<string, string> = {
  "Jayesh Patel": "from-emerald-400 to-green-500",
  "Rohan Sharma": "from-cyan-400 to-teal-500",
  "Sarah Smith": "from-rose-400 to-pink-500",
  "Michael Ross": "from-sky-400 to-blue-500",
  "John Deo": "from-blue-400 to-indigo-500",
  "Pooja Sharma": "from-purple-400 to-violet-500",
  "Emily Clark": "from-fuchsia-400 to-pink-500",
  "Pankaj Patel": "from-amber-400 to-orange-500",
  "Vikram Singh": "from-red-400 to-rose-500",
  "Shriyash Jagtap": "from-orange-500 to-amber-600",
};

const getInitials = (name: string) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
const getAvatarColor = (name: string) => avatarColors[name] || "from-gray-400 to-gray-500";

const riskTypes: RiskType[] = ["Risk", "Issue"];
const impacts: Impact[] = ["High", "Medium", "Low"];
const probabilities: Probability[] = ["High", "Medium", "Low", "N/A"];
const riskStatuses: RiskStatus[] = ["Open", "Mitigated", "Closed"];

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */

const ProjectRisks = () => {
  const [risks, setRisks] = useState<RiskItem[]>(initialRisks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RiskStatus | "All">("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editItem, setEditItem] = useState<RiskItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<RiskItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = risks.filter(r => {
    const matchSearch = r.description.toLowerCase().includes(search.toLowerCase()) || r.owner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const allSelected = paginated.length > 0 && paginated.every(r => selectedIds.has(r.id));

  const toggleSelectAll = () => {
    if (allSelected) { const n = new Set(selectedIds); paginated.forEach(r => n.delete(r.id)); setSelectedIds(n); }
    else { const n = new Set(selectedIds); paginated.forEach(r => n.add(r.id)); setSelectedIds(n); }
  };
  const toggleSelect = (id: string) => { const n = new Set(selectedIds); n.has(id) ? n.delete(id) : n.add(id); setSelectedIds(n); };
  const handleDelete = () => { if (deleteItem) { setRisks(p => p.filter(r => r.id !== deleteItem.id)); setDeleteItem(null); } };
  const handleSaveEdit = (u: RiskItem) => { setRisks(p => p.map(r => r.id === u.id ? u : r)); setEditItem(null); };
  const handleAddItem = (item: Omit<RiskItem, "id">) => {
    const id = `R${String(risks.length + 1).padStart(3, "0")}`;
    setRisks(p => [...p, { ...item, id }]);
    setAddOpen(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Project Risks & Issues</h1>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-visible">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 min-w-[220px]">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
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
                  {riskStatuses.map(s => (
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
            <button onClick={() => setAddOpen(true)} className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all"><Plus className="w-4 h-4 text-blue-600" /></button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="pl-5 py-3 w-10"><input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer" /></th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Impact</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Probability</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Owner</th>
                <th className="py-3 pr-5 text-[12px] font-bold text-gray-600 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item, idx) => {
                const ic = impactConfig[item.impact];
                const sc = statusConfig[item.status];
                return (
                  <tr key={item.id} className={`border-b border-gray-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"} hover:bg-blue-50/30`}>
                    <td className="pl-5 py-3.5"><input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => toggleSelect(item.id)} className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer" /></td>
                    <td className="py-3.5"><span className="text-[13px] font-bold text-gray-900">{item.description}</span></td>
                    <td className="py-3.5"><span className="text-[13px] font-semibold text-gray-700">{item.type}</span></td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="text-[13px]">{ic.flag}</span>
                        <span className={`text-[12px] font-bold ${ic.text}`}>{item.impact}</span>
                      </span>
                    </td>
                    <td className="py-3.5"><span className="text-[13px] font-semibold text-gray-700">{item.probability}</span></td>
                    <td className="py-3.5"><span className={`px-3 py-1 rounded-full text-[11px] font-bold ${sc.bg} ${sc.text}`}>{item.status}</span></td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getAvatarColor(item.owner)} flex items-center justify-center shrink-0`}>
                          <span className="text-[10px] font-bold text-white leading-none">{getInitials(item.owner)}</span>
                        </div>
                        <span className="text-[13px] font-semibold text-gray-700">{item.owner}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-5">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setEditItem({ ...item })} className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors group"><Edit3 className="w-4 h-4 text-blue-500 group-hover:text-blue-700" /></button>
                        <button onClick={() => setDeleteItem(item)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors group"><Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-600" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400 text-[14px] font-medium">No risks or issues found.</td></tr>
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

      {/* Edit Modal */}
      {editItem && <EditRiskModal item={editItem} onSave={handleSaveEdit} onClose={() => setEditItem(null)} />}

      {/* Add Modal */}
      {addOpen && <AddRiskModal onSave={handleAddItem} onClose={() => setAddOpen(false)} />}

      {/* Delete Confirmation */}
      {deleteItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setDeleteItem(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-[16px] font-bold text-gray-900 mb-2">Delete Risk/Issue</h3>
            <p className="text-[13px] text-gray-600 mb-5">
              Are you sure you want to delete <span className="font-bold text-gray-900">"{deleteItem.description}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={handleDelete} className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold transition-colors">Delete</button>
              <button onClick={() => setDeleteItem(null)} className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-bold transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Edit Risk/Issue Modal
   ═══════════════════════════════════════════ */

interface EditRiskModalProps {
  item: RiskItem;
  onSave: (r: RiskItem) => void;
  onClose: () => void;
}

const EditRiskModal = ({ item, onSave, onClose }: EditRiskModalProps) => {
  const [form, setForm] = useState({ ...item });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-white">Edit Risk/Issue: {item.description}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"><X className="w-5 h-5 text-white" /></button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Description (full width) */}
          <fieldset className="border-2 rounded-xl px-3.5 pt-1 pb-2.5 transition-all border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <legend className="text-[11px] font-semibold text-gray-700 px-1">Description<span className="text-red-500">*</span></legend>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
              className="w-full text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent resize-none" />
          </fieldset>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DropdownField label="Type" required value={form.type} options={riskTypes}
              onChange={v => setForm(f => ({ ...f, type: v as RiskType }))} />

            <DropdownField label="Impact" required value={form.impact} options={impacts}
              onChange={v => setForm(f => ({ ...f, impact: v as Impact }))} />

            <DropdownField label="Probability" required value={form.probability} options={probabilities}
              onChange={v => setForm(f => ({ ...f, probability: v as Probability }))} />

            <DropdownField label="Status" required value={form.status} options={riskStatuses}
              onChange={v => setForm(f => ({ ...f, status: v as RiskStatus }))} />

            {/* Owner */}
            <fieldset className="border-2 rounded-xl px-3.5 pt-1 pb-2.5 transition-all border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <legend className="text-[11px] font-semibold text-gray-700 px-1">Owner<span className="text-red-500">*</span></legend>
              <div className="flex items-center gap-2">
                <input type="text" value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))}
                  className="w-full text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
                <User className="w-4 h-4 text-gray-400 shrink-0" />
              </div>
            </fieldset>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => onSave(form)} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold transition-colors shadow-md">Save</button>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Dropdown Field
   ═══════════════════════════════════════════ */

const DropdownField = ({ label, required, value, options, onChange }: {
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
   Add Risk/Issue Modal
   ═══════════════════════════════════════════ */

const AddRiskModal = ({ onSave, onClose }: { onSave: (r: Omit<RiskItem, "id">) => void; onClose: () => void }) => {
  const [form, setForm] = useState({
    description: "", type: "Risk" as RiskType, impact: "Medium" as Impact,
    probability: "Medium" as Probability, status: "Open" as RiskStatus, owner: "",
  });

  const handleSubmit = () => {
    if (!form.description.trim() || !form.owner.trim()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-white">Add New Risk/Issue</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"><X className="w-5 h-5 text-white" /></button>
        </div>
        <div className="p-6 space-y-5">
          <fieldset className="border-2 rounded-xl px-3.5 pt-1 pb-2.5 transition-all border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <legend className="text-[11px] font-semibold text-gray-700 px-1">Description<span className="text-red-500">*</span></legend>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
              className="w-full text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent resize-none" placeholder="Describe the risk or issue..." />
          </fieldset>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DropdownField label="Type" required value={form.type} options={riskTypes} onChange={v => setForm(f => ({ ...f, type: v as RiskType }))} />
            <DropdownField label="Impact" required value={form.impact} options={impacts} onChange={v => setForm(f => ({ ...f, impact: v as Impact }))} />
            <DropdownField label="Probability" required value={form.probability} options={probabilities} onChange={v => setForm(f => ({ ...f, probability: v as Probability }))} />
            <DropdownField label="Status" required value={form.status} options={riskStatuses} onChange={v => setForm(f => ({ ...f, status: v as RiskStatus }))} />
            <fieldset className="border-2 rounded-xl px-3.5 pt-1 pb-2.5 transition-all border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <legend className="text-[11px] font-semibold text-gray-700 px-1">Owner<span className="text-red-500">*</span></legend>
              <div className="flex items-center gap-2">
                <input type="text" value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} placeholder="Assignee name"
                  className="w-full text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
                <User className="w-4 h-4 text-gray-400 shrink-0" />
              </div>
            </fieldset>
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

export default ProjectRisks;
