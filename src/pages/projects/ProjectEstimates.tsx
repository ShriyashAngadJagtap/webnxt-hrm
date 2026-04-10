import { useState, useRef, useEffect } from "react";
import {
  Search, Filter, Plus, RefreshCw, Download, Edit3, Trash2, X,
  Phone, Mail, CalendarDays, MapPin, IndianRupee, ChevronDown, Check,
  UserCircle, FileText, ChevronLeft, ChevronRight, AlertTriangle
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { PaginationDropdown } from "@/components/ui/StyledDropdown";

/* ═══════════════════════════════════════════
   Types & Data
   ═══════════════════════════════════════════ */

type EstimateStatus = "Accepted" | "Declined" | "Sent" | "Expired";

interface Estimate {
  id: string;
  clientName: string;
  mobile: string;
  email: string;
  estimateDate: string;
  expirationDate: string;
  country: string;
  amount: number;
  status: EstimateStatus;
  details: string;
}

const statusConfig: Record<EstimateStatus, { bg: string; text: string; dot: string }> = {
  Accepted: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  Declined: { bg: "bg-red-50 border-red-200", text: "text-red-700", dot: "bg-red-500" },
  Sent: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
  Expired: { bg: "bg-orange-50 border-orange-200", text: "text-orange-700", dot: "bg-orange-500" },
};

const allStatuses: EstimateStatus[] = ["Accepted", "Declined", "Sent", "Expired"];
const countries = ["India", "USA", "Australia", "Sri Lanka", "Bangladesh", "UK", "Canada", "Germany"];

const initialEstimates: Estimate[] = [
  { id: "589", clientName: "Sarah Smith", mobile: "1235443210", email: "sarah.smith@email.com", estimateDate: "2018-12-02", expirationDate: "2018-12-02", country: "India", amount: 142, status: "Accepted", details: "Fowl darkness our sixth heaven. In image lights fourth a hath don't Abundantly they're, image you're." },
  { id: "004", clientName: "John Doe", mobile: "1234561890", email: "john.doe@email.com", estimateDate: "2018-12-02", expirationDate: "2018-12-02", country: "USA", amount: 877, status: "Declined", details: "Web application development project estimate for Q4 requirements." },
  { id: "KN1", clientName: "Ani Saito", mobile: "7354561890", email: "ani.saito@email.com", estimateDate: "2018-11-02", expirationDate: "2018-12-02", country: "Australia", amount: 1647, status: "Accepted", details: "Mobile app design and development estimate including UX research." },
  { id: "285", clientName: "Angelica Ramos", mobile: "8405789012", email: "angelica.ramos@email.com", estimateDate: "2018-12-02", expirationDate: "2018-12-02", country: "Sri Lanka", amount: 8074, status: "Declined", details: "Enterprise dashboard redesign with analytics integration." },
  { id: "KN1", clientName: "Ashton Cox", mobile: "4561890170", email: "ashton.cox@email.com", estimateDate: "2018-11-02", expirationDate: "2018-12-02", country: "India", amount: 10800, status: "Sent", details: "Full-stack development services estimate for e-commerce platform." },
  { id: "598", clientName: "Cara Stevens", mobile: "9678901234", email: "cara.stevens@email.com", estimateDate: "2018-12-02", expirationDate: "2018-12-02", country: "Bangladesh", amount: 578, status: "Sent", details: "UI/UX audit and recommendation report for existing application." },
  { id: "757", clientName: "Jacob Ryan", mobile: "8199012345", email: "jacob.ryan@email.com", estimateDate: "2018-12-02", expirationDate: "2018-12-02", country: "Sri Lanka", amount: 474, status: "Expired", details: "Backend microservices architecture planning and implementation." },
  { id: "937", clientName: "Pooja Sarma", mobile: "7890123456", email: "pooja.sarma@email.com", estimateDate: "2018-12-02", expirationDate: "2018-12-02", country: "India", amount: 1482, status: "Accepted", details: "Cloud migration estimate for legacy systems modernization." },
];

const emptyEstimate: Omit<Estimate, "id"> & { id: string } = {
  id: "", clientName: "", mobile: "", email: "", estimateDate: "", expirationDate: "",
  country: "", amount: 0, status: "Sent", details: "",
};

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */

const ProjectEstimates = () => {
  const [estimates, setEstimates] = useState<Estimate[]>(initialEstimates);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editEstimate, setEditEstimate] = useState<Estimate | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<EstimateStatus | "All">("All");
  const [showFilter, setShowFilter] = useState(false);

  const filtered = estimates.filter(e => {
    const matchSearch = e.clientName.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.country.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const allSelected = paginated.length > 0 && paginated.every(e => selectedRows.has(e.id + e.clientName));

  const toggleSelect = (key: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) setSelectedRows(new Set());
    else setSelectedRows(new Set(paginated.map(e => e.id + e.clientName)));
  };

  const handleDelete = (est: Estimate) => {
    setEstimates(prev => prev.filter(e => !(e.id === est.id && e.clientName === est.clientName)));
    setDeleteConfirm(null);
  };

  const handleSaveEdit = (updated: Estimate) => {
    setEstimates(prev => prev.map(e => (e.id === editEstimate?.id && e.clientName === editEstimate?.clientName) ? updated : e));
    setEditEstimate(null);
  };

  const handleAdd = (newEst: Estimate) => {
    setEstimates(prev => [...prev, newEst]);
    setAddModalOpen(false);
  };

  const formatDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const formatAmount = (amt: number) => `₹${(amt * 83).toLocaleString("en-IN")}`;

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Estimates</h1>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-bold text-gray-900">Estimates</span>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search..."
                className="pl-9 pr-4 py-2 text-[13px] text-gray-900 font-medium border-2 border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 w-52 placeholder:text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter */}
            <div className="relative">
              <button onClick={() => setShowFilter(!showFilter)}
                className={`p-2.5 rounded-lg border-2 transition-all ${statusFilter !== "All" ? "border-blue-400 bg-blue-50 text-blue-600" : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}>
                <Filter className="w-4.5 h-4.5" />
              </button>
              {showFilter && <FilterDropdown current={statusFilter} onChange={v => { setStatusFilter(v); setShowFilter(false); setPage(1); }} onClose={() => setShowFilter(false)} />}
            </div>

            {/* Add */}
            <button onClick={() => setAddModalOpen(true)}
              className="p-2.5 rounded-lg border-2 border-emerald-300 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-400 transition-all shadow-sm">
              <Plus className="w-4.5 h-4.5" strokeWidth={2.5} />
            </button>

            {/* Refresh */}
            <button onClick={() => { setEstimates([...initialEstimates]); setSearch(""); setStatusFilter("All"); setPage(1); }}
              className="p-2.5 rounded-lg border-2 border-gray-200 bg-white text-amber-600 hover:bg-amber-50 hover:border-amber-300 transition-all">
              <RefreshCw className="w-4.5 h-4.5" />
            </button>

            {/* Download */}
            <button className="p-2.5 rounded-lg border-2 border-gray-200 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all">
              <Download className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                <th className="pl-6 pr-2 py-3.5 w-10">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll}
                    className="w-4 h-4 rounded border-2 border-gray-300 accent-blue-600 cursor-pointer" />
                </th>
                {["E.ID", "Client Name", "Mobile", "Email", "E.Date", "Expiration Date", "Country", "Amount", "Status", "Actions"].map(h => (
                  <th key={h} className="px-3 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={11} className="text-center py-12 text-gray-400 text-[14px]">No estimates found</td></tr>
              ) : paginated.map((est, idx) => {
                const key = est.id + est.clientName;
                const sc = statusConfig[est.status];
                return (
                  <tr key={key + idx} className={`border-b border-gray-100 transition-colors ${idx % 2 === 1 ? "bg-gray-50/50" : "bg-white"} hover:bg-blue-50/30`}>
                    <td className="pl-6 pr-2 py-3">
                      <input type="checkbox" checked={selectedRows.has(key)} onChange={() => toggleSelect(key)}
                        className="w-4 h-4 rounded border-2 border-gray-300 accent-blue-600 cursor-pointer" />
                    </td>
                    <td className="px-3 py-3 text-[13px] font-bold text-gray-800">{est.id}</td>
                    <td className="px-3 py-3">
                      <button onClick={() => setEditEstimate(est)} className="text-[13px] font-semibold text-blue-700 hover:text-blue-800 hover:underline transition-colors">
                        {est.clientName}
                      </button>
                    </td>
                    <td className="px-3 py-3 text-[12px] text-gray-600 font-medium">
                      <span className="inline-flex items-center gap-1.5"><Phone className="w-3 h-3 text-green-500" />{est.mobile}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-gray-600 font-medium">
                        <Mail className="w-3 h-3 text-red-500" />{est.email}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[12px] text-gray-600 font-medium whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3 h-3 text-blue-500" />{formatDate(est.estimateDate)}</span>
                    </td>
                    <td className="px-3 py-3 text-[12px] text-gray-600 font-medium whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3 h-3 text-orange-500" />{formatDate(est.expirationDate)}</span>
                    </td>
                    <td className="px-3 py-3 text-[12px] text-gray-700 font-semibold">{est.country}</td>
                    <td className="px-3 py-3 text-[13px] font-bold text-gray-900 whitespace-nowrap">₹{(est.amount * 83).toLocaleString("en-IN")}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${sc.bg} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {est.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setEditEstimate(est)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-all">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteConfirm(key)}
                          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[12px] text-gray-600 font-medium">
            Items per page:
            <PaginationDropdown value={perPage} options={[5, 10, 20, 50]} onChange={v => { setPerPage(v); setPage(1); }} />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-gray-600 font-medium">
              {filtered.length === 0 ? "0" : `${(page - 1) * perPage + 1} – ${Math.min(page * perPage, filtered.length)}`} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editEstimate && (
        <EstimateModal
          title={`Edit Estimate for ${editEstimate.clientName}`}
          estimate={editEstimate}
          onSave={handleSaveEdit}
          onClose={() => setEditEstimate(null)}
          saveLabel="Save"
        />
      )}

      {/* Add Modal */}
      {addModalOpen && (
        <EstimateModal
          title="Add New Estimate"
          estimate={{ ...emptyEstimate, id: String(Math.floor(Math.random() * 900) + 100) }}
          onSave={handleAdd}
          onClose={() => setAddModalOpen(false)}
          saveLabel="Create"
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-900">Delete Estimate</h3>
                <p className="text-[12px] text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button onClick={() => { const est = estimates.find(e => e.id + e.clientName === deleteConfirm); if (est) handleDelete(est); }}
                className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-[13px] font-bold rounded-lg shadow-md transition-all">
                Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 text-[13px] font-bold rounded-lg hover:bg-gray-50 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Filter Dropdown
   ═══════════════════════════════════════════ */

const FilterDropdown = ({ current, onChange, onClose }: {
  current: EstimateStatus | "All"; onChange: (v: EstimateStatus | "All") => void; onClose: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const options: (EstimateStatus | "All")[] = ["All", ...allStatuses];

  return (
    <div ref={ref} className="absolute right-0 top-full mt-1.5 bg-white rounded-xl border border-gray-300 shadow-xl py-1.5 w-44 z-50 animate-fade-in">
      {options.map(opt => {
        const active = current === opt;
        return (
          <button key={opt} onClick={() => onChange(opt)}
            className={`w-full text-left px-4 py-2.5 text-[13px] font-semibold transition-all ${
              active ? "bg-blue-50 text-blue-700 border-l-[3px] border-blue-500 pl-[13px]" : "text-gray-800 hover:bg-blue-50/50 hover:text-blue-600 border-l-[3px] border-transparent"
            }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {opt !== "All" && <span className={`w-2.5 h-2.5 rounded-full ${statusConfig[opt as EstimateStatus].dot}`} />}
                <span>{opt}</span>
              </div>
              {active && <Check className="w-3.5 h-3.5 text-blue-500" />}
            </div>
          </button>
        );
      })}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Estimate Modal (Edit / Add)
   ═══════════════════════════════════════════ */

const EstimateModal = ({ title, estimate, onSave, onClose, saveLabel }: {
  title: string; estimate: Estimate; onSave: (e: Estimate) => void; onClose: () => void; saveLabel: string;
}) => {
  const [form, setForm] = useState<Estimate>({ ...estimate });
  const [errors, setErrors] = useState<Partial<Record<keyof Estimate, string>>>({});

  const set = (key: keyof Estimate, val: string | number) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof Estimate, string>> = {};
    if (!form.id.trim()) e.id = "Required";
    if (!form.clientName.trim()) e.clientName = "Required";
    if (!form.mobile.trim()) e.mobile = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.estimateDate) e.estimateDate = "Required";
    if (!form.expirationDate) e.expirationDate = "Required";
    if (!form.country) e.country = "Required";
    if (!form.amount) e.amount = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (validate()) onSave(form); };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 bg-black/40 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in my-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModalField label="Estimate Id" required value={form.id} onChange={v => set("id", v)} error={errors.id} placeholder="Enter ID" icon={<FileText className="w-4 h-4" />} />
            <ModalField label="Client Name" required value={form.clientName} onChange={v => set("clientName", v)} error={errors.clientName} placeholder="Enter Name" icon={<UserCircle className="w-4 h-4" />} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModalField label="Mobile" required value={form.mobile} onChange={v => set("mobile", v)} error={errors.mobile} placeholder="Enter Mobile" icon={<Phone className="w-4 h-4" />} />
            <ModalField label="Email" required value={form.email} onChange={v => set("email", v)} error={errors.email} placeholder="Enter Email" icon={<Mail className="w-4 h-4" />} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModalDateField label="Estimate Date" required value={form.estimateDate} onChange={v => set("estimateDate", v)} error={errors.estimateDate} />
            <ModalDateField label="Expired Date" required value={form.expirationDate} onChange={v => set("expirationDate", v)} error={errors.expirationDate} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModalSelect label="Country" required value={form.country} onChange={v => set("country", v)} options={countries} error={errors.country} icon={<MapPin className="w-4 h-4" />} />
            <ModalField label="Amount" required value={form.amount ? String(form.amount) : ""} onChange={v => set("amount", Number(v) || 0)} error={errors.amount} placeholder="Enter Amount" icon={<IndianRupee className="w-4 h-4" />} />
          </div>
          <ModalSelect label="Status" required value={form.status} onChange={v => set("status", v as EstimateStatus)} options={[...allStatuses]} icon={<ChevronDown className="w-4 h-4" />} />
          <div>
            <fieldset className="border-2 border-gray-300 rounded-xl px-3.5 pt-1.5 pb-2.5 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <legend className="text-[12px] font-semibold text-gray-700 px-1">Details</legend>
              <textarea rows={3} value={form.details} onChange={e => set("details", e.target.value)} placeholder="Enter details..."
                className="w-full text-[14px] text-gray-900 font-medium outline-none bg-transparent resize-y placeholder:text-gray-500" />
            </fieldset>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex items-center gap-3">
          <button onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-[14px] font-bold rounded-lg shadow-md shadow-blue-200 hover:shadow-lg transition-all">
            {saveLabel}
          </button>
          <button onClick={onClose}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-[14px] font-bold rounded-lg shadow-md shadow-red-200 transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Modal Sub-Components
   ═══════════════════════════════════════════ */

const ModalField = ({ label, required, value, onChange, error, placeholder, icon }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; error?: string; placeholder?: string; icon?: React.ReactNode;
}) => (
  <div>
    <fieldset className={`border-2 rounded-xl px-3.5 pt-1.5 pb-2.5 transition-all ${
      error ? "border-red-400 ring-1 ring-red-100 bg-red-50/30" : "border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
    }`}>
      <legend className={`text-[12px] font-semibold px-1 ${error ? "text-red-500" : "text-gray-700"}`}>{label}{required && "*"}</legend>
      <div className="flex items-center gap-2.5">
        {icon && <div className="text-gray-500 shrink-0">{icon}</div>}
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full text-[14px] text-gray-900 font-medium outline-none bg-transparent placeholder:text-gray-500 placeholder:font-normal" />
      </div>
    </fieldset>
    {error && <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{error}</p>}
  </div>
);

const ModalSelect = ({ label, required, value, onChange, options, error, icon }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; options: string[]; error?: string; icon?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <fieldset className={`border-2 rounded-xl px-3.5 pt-1.5 pb-2.5 cursor-pointer transition-all ${
        error ? "border-red-400 ring-1 ring-red-100 bg-red-50/30"
          : open ? "border-blue-500 ring-2 ring-blue-100"
          : "border-gray-300 hover:border-gray-400"
      }`} onClick={() => setOpen(!open)}>
        <legend className={`text-[12px] font-semibold px-1 ${error ? "text-red-500" : "text-gray-700"}`}>{label}{required && "*"}</legend>
        <div className="flex items-center gap-2.5">
          {icon && <div className="text-gray-500 shrink-0">{icon}</div>}
          <span className={`flex-1 text-[14px] font-medium ${value ? "text-gray-900" : "text-gray-500"}`}>{value || `Select ${label}`}</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </fieldset>
      {error && <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{error}</p>}

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-xl border border-gray-300 shadow-xl py-1.5 max-h-48 overflow-y-auto animate-fade-in">
          {options.map(opt => {
            const sel = value === opt;
            return (
              <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-[13px] font-semibold transition-all ${
                  sel ? "bg-blue-50 text-blue-700 border-l-[3px] border-blue-500 pl-[13px]" : "text-gray-800 hover:bg-blue-50/50 hover:text-blue-600 border-l-[3px] border-transparent"
                }`}>
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  {sel && <Check className="w-3.5 h-3.5 text-blue-500" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const formatDateDisplay = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const ModalDateField = ({ label, required, value, onChange, error }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; error?: string;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const sel = value ? new Date(value + "T00:00:00") : undefined;

  const handleSelect = (day: Date | undefined) => {
    if (day) {
      const y = day.getFullYear();
      const m = String(day.getMonth() + 1).padStart(2, "0");
      const d = String(day.getDate()).padStart(2, "0");
      onChange(`${y}-${m}-${d}`);
    }
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <fieldset className={`border-2 rounded-xl px-3.5 pt-1.5 pb-2.5 cursor-pointer transition-all ${
        error ? "border-red-400 ring-1 ring-red-100 bg-red-50/30"
          : open ? "border-blue-500 ring-2 ring-blue-100"
          : "border-gray-300 hover:border-gray-400"
      }`} onClick={() => setOpen(!open)}>
        <legend className={`text-[12px] font-semibold px-1 ${error ? "text-red-500" : "text-gray-700"}`}>{label}{required && "*"}</legend>
        <div className="flex items-center gap-2.5">
          <CalendarDays className="w-4 h-4 text-gray-500 shrink-0" />
          <span className={`flex-1 text-[14px] font-medium ${value ? "text-gray-900" : "text-gray-500"}`}>
            {value ? formatDateDisplay(value) : "dd-mm-yyyy"}
          </span>
          <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
        </div>
      </fieldset>
      {error && <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{error}</p>}

      {open && (
        <div className="absolute z-[60] left-0 mt-1.5 bg-white rounded-2xl border border-gray-200 shadow-2xl animate-fade-in">
          <Calendar mode="single" selected={sel} onSelect={handleSelect} defaultMonth={sel || new Date()} />
          <div className="flex items-center justify-between px-4 pb-3 border-t border-gray-100 pt-2.5">
            <button type="button" onClick={() => { onChange(""); setOpen(false); }}
              className="text-[12px] font-medium text-gray-400 hover:text-red-500 transition-colors">Clear</button>
            <button type="button" onClick={() => {
              const t = new Date();
              onChange(`${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`);
              setOpen(false);
            }} className="text-[12px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">Today</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectEstimates;
