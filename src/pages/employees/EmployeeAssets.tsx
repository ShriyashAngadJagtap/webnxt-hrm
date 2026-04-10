import { useState } from "react";
import {
  Search, Filter, RefreshCw, Download, UserPlus,
  Edit3, Trash2, CalendarDays, X,
  Laptop, Smartphone, Monitor, Mouse, HardDrive, Tablet,
  ChevronLeft, ChevronRight, Package, CheckCircle2, Clock,
  XCircle, AlertTriangle, Cpu, Hash, User, RotateCcw,
  ShieldCheck, Boxes
} from "lucide-react";
import { StyledDropdown, ToolbarDropdown, PaginationDropdown } from "@/components/ui/StyledDropdown";

type AssetCategory = "Laptop" | "Mobile" | "Peripheral" | "Tablet" | "Storage" | "Monitor";
type AssetStatus = "Assigned" | "Returned" | "Repair" | "Damaged";

interface Asset {
  id: string;
  employeeName: string;
  assetName: string;
  category: AssetCategory;
  serialNumber: string;
  status: AssetStatus;
  assignedDate: string;
  condition: string;
  value: string;
}

const avatarColors: Record<string, string> = {
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
  "Shriyash Jagtap": "from-blue-500 to-indigo-600",
  "Jitesh Naidu": "from-emerald-500 to-teal-600",
  "Shubham Jadhav": "from-orange-500 to-amber-600",
};
const getInitials = (n: string) => n.split(" ").map(w => w[0]).join("").toUpperCase();
const getColor = (n: string) => avatarColors[n] || "from-gray-400 to-gray-500";

const categoryConfig: Record<AssetCategory, { icon: typeof Laptop; bg: string; text: string; ring: string; gradient: string }> = {
  Laptop:     { icon: Laptop,     bg: "bg-blue-50",    text: "text-blue-600",    ring: "ring-blue-200",    gradient: "from-blue-500 to-indigo-600" },
  Mobile:     { icon: Smartphone, bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-200", gradient: "from-emerald-500 to-green-600" },
  Peripheral: { icon: Mouse,      bg: "bg-purple-50",  text: "text-purple-600",  ring: "ring-purple-200",  gradient: "from-purple-500 to-fuchsia-600" },
  Tablet:     { icon: Tablet,     bg: "bg-amber-50",   text: "text-amber-600",   ring: "ring-amber-200",   gradient: "from-amber-500 to-orange-600" },
  Storage:    { icon: HardDrive,  bg: "bg-cyan-50",    text: "text-cyan-600",    ring: "ring-cyan-200",    gradient: "from-cyan-500 to-blue-600" },
  Monitor:    { icon: Monitor,    bg: "bg-rose-50",    text: "text-rose-600",    ring: "ring-rose-200",    gradient: "from-rose-500 to-red-600" },
};

const statusConfig: Record<AssetStatus, { bg: string; text: string; dot: string; icon: typeof CheckCircle2 }> = {
  Assigned: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", icon: CheckCircle2 },
  Returned: { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500",    icon: RotateCcw },
  Repair:   { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   icon: Clock },
  Damaged:  { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500",     icon: AlertTriangle },
};

const categories: AssetCategory[] = ["Laptop", "Mobile", "Peripheral", "Tablet", "Storage", "Monitor"];
const statuses: AssetStatus[] = ["Assigned", "Returned", "Repair", "Damaged"];
const conditions = ["Excellent", "Good", "Fair", "Poor"];

const initialAssets: Asset[] = [
  { id: "AST-001", employeeName: "Shriyash Jagtap", assetName: "MacBook Pro M3", category: "Laptop", serialNumber: "SN78432", status: "Assigned", assignedDate: "2024-01-10", condition: "Excellent", value: "₹1,85,000" },
  { id: "AST-002", employeeName: "Shriyash Jagtap", assetName: "iPhone 15 Pro", category: "Mobile", serialNumber: "SM91204", status: "Assigned", assignedDate: "2024-01-10", condition: "Excellent", value: "₹1,34,900" },
  { id: "AST-003", employeeName: "Jitesh Naidu", assetName: "Dell XPS 15", category: "Laptop", serialNumber: "SN34521", status: "Assigned", assignedDate: "2024-02-05", condition: "Good", value: "₹1,45,000" },
  { id: "AST-004", employeeName: "Jitesh Naidu", assetName: "Samsung Galaxy S24", category: "Mobile", serialNumber: "SM56789", status: "Assigned", assignedDate: "2024-02-05", condition: "Good", value: "₹79,999" },
  { id: "AST-005", employeeName: "Shubham Jadhav", assetName: "HP EliteBook 840", category: "Laptop", serialNumber: "SN88901", status: "Assigned", assignedDate: "2024-03-01", condition: "Good", value: "₹1,12,000" },
  { id: "AST-006", employeeName: "John Doe", assetName: "MacBook Pro", category: "Laptop", serialNumber: "SN12345", status: "Assigned", assignedDate: "2023-01-10", condition: "Good", value: "₹1,75,000" },
  { id: "AST-007", employeeName: "Sarah Smith", assetName: "iPhone 13", category: "Mobile", serialNumber: "SM7998", status: "Assigned", assignedDate: "2023-02-15", condition: "Good", value: "₹69,900" },
  { id: "AST-008", employeeName: "Robert Johnson", assetName: "Dell Monitor 27\"", category: "Monitor", serialNumber: "SN11229", status: "Returned", assignedDate: "2023-01-20", condition: "Fair", value: "₹32,000" },
  { id: "AST-009", employeeName: "Michael Brown", assetName: "Samsung Tab S9", category: "Tablet", serialNumber: "SN44526", status: "Assigned", assignedDate: "2023-05-01", condition: "Excellent", value: "₹74,999" },
  { id: "AST-010", employeeName: "Emily Davis", assetName: "Lenovo ThinkPad X1", category: "Laptop", serialNumber: "SN77889", status: "Repair", assignedDate: "2023-04-12", condition: "Fair", value: "₹1,30,000" },
  { id: "AST-011", employeeName: "William Wilson", assetName: "Logitech MX Master 3", category: "Peripheral", serialNumber: "SM9001", status: "Assigned", assignedDate: "2023-06-18", condition: "Excellent", value: "₹8,995" },
  { id: "AST-012", employeeName: "Jessica Taylor", assetName: "External HDD 2TB", category: "Storage", serialNumber: "SN22384", status: "Returned", assignedDate: "2023-06-22", condition: "Good", value: "₹5,499" },
  { id: "AST-013", employeeName: "David Anderson", assetName: "iPad Air", category: "Tablet", serialNumber: "SN05617", status: "Damaged", assignedDate: "2023-07-30", condition: "Poor", value: "₹59,900" },
  { id: "AST-014", employeeName: "Linda Thomas", assetName: "HP EliteBook", category: "Laptop", serialNumber: "SN88909", status: "Assigned", assignedDate: "2023-08-14", condition: "Good", value: "₹95,000" },
  { id: "AST-015", employeeName: "James Jackson", assetName: "Android Phone", category: "Mobile", serialNumber: "SM11022", status: "Assigned", assignedDate: "2023-09-01", condition: "Good", value: "₹45,000" },
];

const EmployeeAssets = () => {
  const [assets, setAssets] = useState(initialAssets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editAsset, setEditAsset] = useState<Asset | null>(null);
  const [deleteAsset, setDeleteAsset] = useState<Asset | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = assets.filter(a => {
    const ms = a.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      a.assetName.toLowerCase().includes(search.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(search.toLowerCase());
    return ms && (statusFilter === "All" || a.status === statusFilter);
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const allSelected = paged.length > 0 && paged.every(a => selectedIds.includes(a.id));
  const toggleAll = () => { if (allSelected) setSelectedIds(p => p.filter(id => !paged.some(a => a.id === id))); else setSelectedIds(p => [...new Set([...p, ...paged.map(a => a.id)])]); };
  const toggleOne = (id: string) => setSelectedIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);

  const assigned = assets.filter(a => a.status === "Assigned").length;
  const returned = assets.filter(a => a.status === "Returned").length;
  const inRepair = assets.filter(a => a.status === "Repair").length;
  const damaged = assets.filter(a => a.status === "Damaged").length;

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Employee Assets</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard gradient="from-blue-500 to-indigo-600" icon={<Boxes className="w-5 h-5 text-white" />} label="Total Assets" value={String(assets.length)} sub="All company assets" />
        <KpiCard gradient="from-emerald-500 to-teal-600" icon={<CheckCircle2 className="w-5 h-5 text-white" />} label="Assigned" value={String(assigned)} sub="Currently in use" />
        <KpiCard gradient="from-sky-500 to-blue-600" icon={<RotateCcw className="w-5 h-5 text-white" />} label="Returned" value={String(returned)} sub="Back in inventory" />
        <KpiCard gradient="from-amber-500 to-orange-600" icon={<Clock className="w-5 h-5 text-white" />} label="In Repair" value={String(inRepair)} sub="Under maintenance" />
        <KpiCard gradient="from-red-500 to-rose-600" icon={<AlertTriangle className="w-5 h-5 text-white" />} label="Damaged" value={String(damaged)} sub="Needs replacement" />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">Employee Assets</span>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search..." className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg w-48 focus:outline-none focus:border-blue-400 text-gray-900 placeholder:text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ToolbarDropdown value={statusFilter} options={statuses} onChange={v => { setStatusFilter(v); setPage(1); }} allLabel="All Status" />
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Filter"><Filter className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Download"><Download className="w-4 h-4" /></button>
            <button onClick={() => setAddOpen(true)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="Add Asset"><UserPlus className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3 w-10"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded" /></th>
                <th className="px-4 py-3 font-semibold">Employee Name</th>
                <th className="px-4 py-3 font-semibold">Asset Name</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Serial Number</th>
                <th className="px-4 py-3 font-semibold">Condition</th>
                <th className="px-4 py-3 font-semibold">Value</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Assigned Date</th>
                <th className="px-4 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(asset => {
                const cc = categoryConfig[asset.category];
                const sc = statusConfig[asset.status];
                const CatIcon = cc.icon;
                const StatusIcon = sc.icon;
                const condColor = asset.condition === "Excellent" ? "text-emerald-600 bg-emerald-50"
                  : asset.condition === "Good" ? "text-blue-600 bg-blue-50"
                  : asset.condition === "Fair" ? "text-amber-600 bg-amber-50"
                  : "text-red-600 bg-red-50";
                return (
                  <tr key={asset.id} className="border-t border-gray-50 hover:bg-blue-50/20 transition-colors group">
                    <td className="px-4 py-3.5"><input type="checkbox" checked={selectedIds.includes(asset.id)} onChange={() => toggleOne(asset.id)} className="rounded" /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getColor(asset.employeeName)} flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm`}>
                          {getInitials(asset.employeeName)}
                        </div>
                        <span className="font-semibold text-gray-900 whitespace-nowrap">{asset.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg ${cc.bg} flex items-center justify-center shrink-0 ring-1 ${cc.ring}`}>
                          <CatIcon className={`w-3.5 h-3.5 ${cc.text}`} />
                        </div>
                        <span className="text-gray-800 font-medium">{asset.assetName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${cc.bg} ${cc.text} ring-1 ${cc.ring}`}>
                        <CatIcon className="w-3 h-3" /> {asset.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Hash className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-700 font-mono text-[11px] font-semibold">{asset.serialNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${condColor}`}>{asset.condition}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-gray-900 font-bold text-[11px]">{asset.value}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${sc.bg} ${sc.text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-3 h-3 text-blue-500" />
                        <span className="text-gray-700">{asset.assignedDate}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => setEditAsset({ ...asset })} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteAsset(asset)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length === 0 && <tr><td colSpan={10} className="text-center py-14 text-gray-400 text-sm">No assets found.</td></tr>}
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

      {/* Edit / Add Asset Modal */}
      {(editAsset || addOpen) && (
        <AssetModal
          asset={editAsset || undefined}
          isAdd={addOpen && !editAsset}
          onClose={() => { setEditAsset(null); setAddOpen(false); }}
          onSave={a => {
            if (editAsset) setAssets(prev => prev.map(x => x.id === a.id ? a : x));
            else setAssets(prev => [...prev, { ...a, id: `AST-${String(prev.length + 1).padStart(3, "0")}` }]);
            setEditAsset(null); setAddOpen(false);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteAsset(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Remove Asset</h3>
            <p className="text-sm text-gray-500 mb-5">
              Remove <strong className="text-gray-800">{deleteAsset.assetName}</strong> ({deleteAsset.serialNumber}) from {deleteAsset.employeeName}?
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => { setAssets(prev => prev.filter(a => a.id !== deleteAsset.id)); setDeleteAsset(null); }}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-semibold shadow-md shadow-red-500/20 transition-all">Delete</button>
              <button onClick={() => setDeleteAsset(null)}
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
        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
          {icon}
        </div>
      </div>
      <p className="text-[11px] opacity-75 mt-2">{sub}</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   Asset Modal (Edit / Add)
   ═══════════════════════════════════════════ */
const emptyAsset: Asset = {
  id: "", employeeName: "", assetName: "", category: "Laptop",
  serialNumber: "", status: "Assigned", assignedDate: new Date().toISOString().slice(0, 10),
  condition: "Good", value: "",
};

const AssetModal = ({ asset, isAdd, onClose, onSave }: {
  asset?: Asset; isAdd: boolean; onClose: () => void; onSave: (a: Asset) => void;
}) => {
  const [form, setForm] = useState<Asset>(asset ? { ...asset } : { ...emptyAsset });
  const set = <K extends keyof Asset>(k: K, v: Asset[K]) => setForm(prev => ({ ...prev, [k]: v }));

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
                  {isAdd ? <Package className="w-5 h-5 text-white" /> : (() => { const I = categoryConfig[form.category].icon; return <I className="w-5 h-5 text-white" />; })()}
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">{isAdd ? "Add New Asset" : `Edit Asset: ${form.assetName}`}</h2>
                  <p className="text-white/60 text-[11px]">{isAdd ? "Register a new company asset" : `${form.serialNumber} • ${form.category}`}</p>
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
            <FieldInput icon={<Cpu className="w-4 h-4 text-gray-400" />} label="Asset Name" value={form.assetName} onChange={v => set("assetName", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StyledDropdown label="Asset Category" required value={form.category} options={categories} onChange={v => set("category", v as AssetCategory)}
              icon={(() => { const I = categoryConfig[form.category].icon; return <I className="w-4 h-4" />; })()} />
            <FieldInput icon={<Hash className="w-4 h-4 text-gray-400" />} label="Serial Number" value={form.serialNumber} onChange={v => set("serialNumber", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StyledDropdown label="Status" required value={form.status} options={statuses} onChange={v => set("status", v as AssetStatus)}
              icon={<ShieldCheck className="w-4 h-4" />} />
            <FieldInput icon={<CalendarDays className="w-4 h-4 text-gray-400" />} label="Assigned Date" value={form.assignedDate} type="date" onChange={v => set("assignedDate", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StyledDropdown label="Condition" required value={form.condition} options={conditions} onChange={v => set("condition", v)}
              icon={<CheckCircle2 className="w-4 h-4" />} />
            <FieldInput icon={<Package className="w-4 h-4 text-gray-400" />} label="Asset Value" value={form.value} onChange={v => set("value", v)} placeholder="₹0" />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => onSave(form)}
              className={`px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition-all ${
                isAdd
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20 hover:shadow-lg"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/20 hover:shadow-lg"
              }`}>
              {isAdd ? "Add Asset" : "Save"}
            </button>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-semibold shadow-md shadow-red-500/20 hover:shadow-lg transition-all">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Reusable Form Input
   ═══════════════════════════════════════════ */
const FieldInput = ({ icon, label, value, onChange, type = "text", placeholder }: {
  icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) => (
  <fieldset className="border border-gray-300 rounded-lg px-3 pt-1 pb-2 hover:border-gray-400 transition-colors">
    <legend className="text-[11px] font-semibold text-gray-700 px-1">{label}*</legend>
    <div className="flex items-center gap-2">
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400" />
      {icon}
    </div>
  </fieldset>
);

export default EmployeeAssets;
