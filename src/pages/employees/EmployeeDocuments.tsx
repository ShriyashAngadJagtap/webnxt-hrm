import { useState, useRef } from "react";
import {
  Search, Filter, RefreshCw, Download, UserPlus,
  Edit3, Trash2, CalendarDays, X, FileText,
  User, ChevronLeft, ChevronRight,
  File, FileImage, FileArchive, FileSpreadsheet,
  CheckCircle2, Clock, XCircle, FolderOpen, HardDrive,
  Shield, CloudUpload, ExternalLink, Lock, Eye
} from "lucide-react";
import { StyledDropdown, ToolbarDropdown, PaginationDropdown } from "@/components/ui/StyledDropdown";

type DocType = "PDF" | "DOCX" | "JPG" | "ZIP" | "PNG" | "XLS";
type DocStatus = "Approved" | "Pending" | "Rejected";

interface EmployeeDoc {
  id: string;
  employeeName: string;
  fileName: string;
  type: DocType;
  size: string;
  uploadedBy: string;
  date: string;
  status: DocStatus;
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

const typeConfig: Record<DocType, { icon: typeof FileText; bg: string; text: string; ring: string; gradient: string }> = {
  PDF: { icon: FileText, bg: "bg-red-50", text: "text-red-600", ring: "ring-red-200", gradient: "from-red-500 to-rose-600" },
  DOCX: { icon: File, bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-200", gradient: "from-blue-500 to-indigo-600" },
  JPG: { icon: FileImage, bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-200", gradient: "from-emerald-500 to-green-600" },
  ZIP: { icon: FileArchive, bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-200", gradient: "from-amber-500 to-orange-600" },
  PNG: { icon: FileImage, bg: "bg-purple-50", text: "text-purple-600", ring: "ring-purple-200", gradient: "from-purple-500 to-fuchsia-600" },
  XLS: { icon: FileSpreadsheet, bg: "bg-green-50", text: "text-green-600", ring: "ring-green-200", gradient: "from-green-500 to-emerald-600" },
};

const statusConfig: Record<DocStatus, { bg: string; text: string; dot: string; icon: typeof CheckCircle2; iconColor: string }> = {
  Approved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", icon: CheckCircle2, iconColor: "text-emerald-500" },
  Pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", icon: Clock, iconColor: "text-amber-500" },
  Rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", icon: XCircle, iconColor: "text-red-500" },
};

const docTypes: DocType[] = ["PDF", "DOCX", "JPG", "ZIP", "PNG", "XLS"];
const docStatuses: DocStatus[] = ["Approved", "Pending", "Rejected"];

const initialDocs: EmployeeDoc[] = [
  { id: "DOC-001", employeeName: "Shriyash Jagtap", fileName: "aadhar_card.pdf", type: "PDF", size: "1.1 MB", uploadedBy: "Admin", date: "2024-01-10", status: "Approved" },
  { id: "DOC-002", employeeName: "Shriyash Jagtap", fileName: "pan_card.jpg", type: "JPG", size: "450 KB", uploadedBy: "Admin", date: "2024-01-10", status: "Approved" },
  { id: "DOC-003", employeeName: "Shriyash Jagtap", fileName: "passport.pdf", type: "PDF", size: "2.4 MB", uploadedBy: "Shriyash Jagtap", date: "2024-01-15", status: "Approved" },
  { id: "DOC-004", employeeName: "Shriyash Jagtap", fileName: "offer_letter.pdf", type: "PDF", size: "1.8 MB", uploadedBy: "HR Manager", date: "2024-01-08", status: "Approved" },
  { id: "DOC-005", employeeName: "Shriyash Jagtap", fileName: "degree_certificate.pdf", type: "PDF", size: "3.2 MB", uploadedBy: "Shriyash Jagtap", date: "2024-02-01", status: "Pending" },
  { id: "DOC-006", employeeName: "Jitesh Naidu", fileName: "aadhar_card.pdf", type: "PDF", size: "1.0 MB", uploadedBy: "Admin", date: "2024-02-05", status: "Approved" },
  { id: "DOC-007", employeeName: "Jitesh Naidu", fileName: "pan_card.jpg", type: "JPG", size: "380 KB", uploadedBy: "Admin", date: "2024-02-05", status: "Approved" },
  { id: "DOC-008", employeeName: "Jitesh Naidu", fileName: "voter_id.pdf", type: "PDF", size: "900 KB", uploadedBy: "Jitesh Naidu", date: "2024-02-10", status: "Pending" },
  { id: "DOC-009", employeeName: "Jitesh Naidu", fileName: "offer_letter.pdf", type: "PDF", size: "1.5 MB", uploadedBy: "HR Manager", date: "2024-02-03", status: "Approved" },
  { id: "DOC-010", employeeName: "Shubham Jadhav", fileName: "aadhar_card.pdf", type: "PDF", size: "1.2 MB", uploadedBy: "Admin", date: "2024-03-01", status: "Approved" },
  { id: "DOC-011", employeeName: "Shubham Jadhav", fileName: "pan_card.jpg", type: "JPG", size: "420 KB", uploadedBy: "Admin", date: "2024-03-01", status: "Approved" },
  { id: "DOC-012", employeeName: "Shubham Jadhav", fileName: "driving_license.jpg", type: "JPG", size: "650 KB", uploadedBy: "Shubham Jadhav", date: "2024-03-05", status: "Approved" },
  { id: "DOC-013", employeeName: "John Doe", fileName: "passport.pdf", type: "PDF", size: "2.4 MB", uploadedBy: "Admin", date: "2023-01-15", status: "Approved" },
  { id: "DOC-014", employeeName: "John Doe", fileName: "offer_letter.docx", type: "DOCX", size: "1.2 MB", uploadedBy: "HR Manager", date: "2023-01-12", status: "Approved" },
  { id: "DOC-015", employeeName: "John Doe", fileName: "aadhar_card.pdf", type: "PDF", size: "1.0 MB", uploadedBy: "John Doe", date: "2023-01-18", status: "Approved" },
  { id: "DOC-016", employeeName: "Sarah Smith", fileName: "resume_final.pdf", type: "PDF", size: "2.5 MB", uploadedBy: "Sarah Smith", date: "2023-03-10", status: "Approved" },
  { id: "DOC-017", employeeName: "Sarah Smith", fileName: "certificates.zip", type: "ZIP", size: "15.5 MB", uploadedBy: "Admin", date: "2023-03-12", status: "Pending" },
  { id: "DOC-018", employeeName: "Robert Johnson", fileName: "cv_v2.pdf", type: "PDF", size: "3.1 MB", uploadedBy: "Robert Johnson", date: "2023-01-20", status: "Approved" },
  { id: "DOC-019", employeeName: "Michael Brown", fileName: "certificates.zip", type: "ZIP", size: "15.5 MB", uploadedBy: "Admin", date: "2023-03-05", status: "Rejected" },
  { id: "DOC-020", employeeName: "Emily Davis", fileName: "license.jpg", type: "JPG", size: "800 KB", uploadedBy: "Emily Davis", date: "2023-04-12", status: "Approved" },
  { id: "DOC-021", employeeName: "Emily Davis", fileName: "salary_slip.xls", type: "XLS", size: "340 KB", uploadedBy: "Admin", date: "2023-04-15", status: "Approved" },
];

interface EmployeeSummary {
  name: string;
  totalDocs: number;
  approved: number;
  pending: number;
  rejected: number;
  totalSize: string;
  lastUpload: string;
  fileTypes: DocType[];
}

const EmployeeDocuments = () => {
  const [docs, setDocs] = useState(initialDocs);
  const [search, setSearch] = useState("");
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editDoc, setEditDoc] = useState<EmployeeDoc | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<EmployeeDoc | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [vaultEmployee, setVaultEmployee] = useState<string | null>(null);

  const employeeSummaries: EmployeeSummary[] = (() => {
    const map = new Map<string, EmployeeDoc[]>();
    docs.forEach(d => { const arr = map.get(d.employeeName) || []; arr.push(d); map.set(d.employeeName, arr); });
    const summaries: EmployeeSummary[] = [];
    map.forEach((empDocs, name) => {
      const sizeBytes = empDocs.reduce((acc, d) => {
        const num = parseFloat(d.size);
        if (d.size.includes("MB")) return acc + num;
        if (d.size.includes("KB")) return acc + num / 1024;
        return acc;
      }, 0);
      const dates = empDocs.map(d => d.date).sort();
      const types = [...new Set(empDocs.map(d => d.type))];
      summaries.push({
        name,
        totalDocs: empDocs.length,
        approved: empDocs.filter(d => d.status === "Approved").length,
        pending: empDocs.filter(d => d.status === "Pending").length,
        rejected: empDocs.filter(d => d.status === "Rejected").length,
        totalSize: sizeBytes >= 1 ? `${sizeBytes.toFixed(1)} MB` : `${Math.round(sizeBytes * 1024)} KB`,
        lastUpload: dates[dates.length - 1] || "",
        fileTypes: types,
      });
    });
    return summaries;
  })();

  const filtered = employeeSummaries.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const allSelected = paged.length > 0 && paged.every(e => selectedNames.includes(e.name));
  const toggleAll = () => { if (allSelected) setSelectedNames(p => p.filter(n => !paged.some(e => e.name === n))); else setSelectedNames(p => [...new Set([...p, ...paged.map(e => e.name)])]); };
  const toggleOne = (name: string) => setSelectedNames(p => p.includes(name) ? p.filter(n => n !== name) : [...p, name]);

  const totalDocsCount = docs.length;
  const approved = docs.filter(d => d.status === "Approved").length;
  const pending = docs.filter(d => d.status === "Pending").length;
  const rejected = docs.filter(d => d.status === "Rejected").length;

  const vaultDocs = vaultEmployee ? docs.filter(d => d.employeeName === vaultEmployee) : [];

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Employee Documents</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard gradient="from-blue-500 to-indigo-600" icon={<FolderOpen className="w-5 h-5 text-white" />} label="Total Documents" value={String(totalDocsCount)} sub={`${employeeSummaries.length} employees`} />
        <KpiCard gradient="from-emerald-500 to-teal-600" icon={<Shield className="w-5 h-5 text-white" />} label="Approved" value={String(approved)} sub={`${totalDocsCount > 0 ? Math.round((approved / totalDocsCount) * 100) : 0}% verified`} />
        <KpiCard gradient="from-amber-500 to-orange-600" icon={<Clock className="w-5 h-5 text-white" />} label="Pending Review" value={String(pending)} sub="Awaiting approval" />
        <KpiCard gradient="from-red-500 to-rose-600" icon={<XCircle className="w-5 h-5 text-white" />} label="Rejected" value={String(rejected)} sub="Needs re-upload" />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">Employee Documents</span>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search employee..." className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg w-48 focus:outline-none focus:border-blue-400 text-gray-900 placeholder:text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Filter"><Filter className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Download All"><Download className="w-4 h-4" /></button>
            <button onClick={() => setAddOpen(true)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="Upload Document"><UserPlus className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Table — One row per employee */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3 w-10"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded" /></th>
                <th className="px-4 py-3 font-semibold">Employee Name</th>
                <th className="px-4 py-3 font-semibold">Total Docs</th>
                <th className="px-4 py-3 font-semibold">File Types</th>
                <th className="px-4 py-3 font-semibold">Total Size</th>
                <th className="px-4 py-3 font-semibold">Last Upload</th>
                <th className="px-4 py-3 font-semibold">Status Summary</th>
                <th className="px-4 py-3 font-semibold text-center">View All</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(emp => (
                <tr key={emp.name} className="border-t border-gray-50 hover:bg-blue-50/20 transition-colors group cursor-pointer" onClick={() => setVaultEmployee(emp.name)}>
                  <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedNames.includes(emp.name)} onChange={() => toggleOne(emp.name)} className="rounded" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getColor(emp.name)} flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm`}>
                        {getInitials(emp.name)}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 whitespace-nowrap group-hover:text-blue-600 transition-colors">{emp.name}</span>
                        <span className="block text-[10px] text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Click to open vault</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <FolderOpen className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="text-lg font-bold text-gray-900">{emp.totalDocs}</span>
                      <span className="text-[10px] text-gray-400 font-medium">file{emp.totalDocs > 1 ? "s" : ""}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {emp.fileTypes.map(t => {
                        const tc = typeConfig[t];
                        return (
                          <span key={t} className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold ${tc.bg} ${tc.text} ring-1 ${tc.ring}`}>
                            {t}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-700 font-semibold">{emp.totalSize}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-3 h-3 text-blue-500" />
                      <span className="text-gray-700">{emp.lastUpload}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {emp.approved > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="w-2.5 h-2.5" /> {emp.approved}
                        </span>
                      )}
                      {emp.pending > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700">
                          <Clock className="w-2.5 h-2.5" /> {emp.pending}
                        </span>
                      )}
                      {emp.rejected > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-700">
                          <XCircle className="w-2.5 h-2.5" /> {emp.rejected}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[11px] font-semibold shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all flex items-center gap-1.5 mx-auto">
                      <Eye className="w-3.5 h-3.5" /> Open Vault
                    </button>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && <tr><td colSpan={8} className="text-center py-14 text-gray-400 text-sm">No employees found.</td></tr>}
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

      {/* ═══════════════════════════════════════════
          Document Vault Modal (Per Employee)
         ═══════════════════════════════════════════ */}
      {vaultEmployee && (
        <VaultModal
          employeeName={vaultEmployee}
          docs={vaultDocs}
          onClose={() => setVaultEmployee(null)}
          onEdit={d => { setVaultEmployee(null); setEditDoc({ ...d }); }}
          onDelete={d => { setVaultEmployee(null); setDeleteDoc(d); }}
        />
      )}

      {/* Edit / Add Modal */}
      {(editDoc || addOpen) && (
        <DocModal doc={editDoc || undefined} isAdd={addOpen && !editDoc}
          onClose={() => { setEditDoc(null); setAddOpen(false); }}
          onSave={d => { if (editDoc) setDocs(prev => prev.map(x => x.id === d.id ? d : x)); else setDocs(prev => [...prev, { ...d, id: `DOC-${String(prev.length + 1).padStart(3, "0")}` }]); setEditDoc(null); setAddOpen(false); }} />
      )}

      {/* Delete */}
      {deleteDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteDoc(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Document</h3>
            <p className="text-sm text-gray-500 mb-5">Remove <strong className="text-gray-800">{deleteDoc.fileName}</strong> for {deleteDoc.employeeName}?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => { setDocs(prev => prev.filter(d => d.id !== deleteDoc.id)); setDeleteDoc(null); }}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-semibold shadow-md shadow-red-500/20 transition-all">Delete</button>
              <button onClick={() => setDeleteDoc(null)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Vault Modal — All docs for one employee
   ═══════════════════════════════════════════ */
const VaultModal = ({ employeeName, docs, onClose, onEdit, onDelete }: {
  employeeName: string; docs: EmployeeDoc[]; onClose: () => void;
  onEdit: (d: EmployeeDoc) => void; onDelete: (d: EmployeeDoc) => void;
}) => {
  const approvedCount = docs.filter(d => d.status === "Approved").length;
  const pendingCount = docs.filter(d => d.status === "Pending").length;
  const totalSize = docs.reduce((acc, d) => {
    const num = parseFloat(d.size);
    if (d.size.includes("MB")) return acc + num;
    if (d.size.includes("KB")) return acc + num / 1024;
    return acc;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[780px] max-h-[90vh] overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>

        {/* Header Banner */}
        <div className="relative overflow-hidden">
          <div className={`bg-gradient-to-r ${getColor(employeeName).replace("from-", "from-").replace("to-", "via-")} from-blue-600 via-indigo-600 to-purple-700 px-7 py-6`}>
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute right-16 -bottom-6 w-20 h-20 rounded-full bg-white/5" />
            <div className="absolute left-1/2 -bottom-10 w-40 h-40 rounded-full bg-white/[0.03]" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getColor(employeeName)} flex items-center justify-center text-white text-lg font-bold shadow-lg ring-2 ring-white/30`}>
                  {getInitials(employeeName)}
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">{employeeName}</h2>
                  <p className="text-white/60 text-[12px] flex items-center gap-2 mt-0.5">
                    <Lock className="w-3 h-3" /> Personal Document Vault
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mini Stats */}
            <div className="relative z-10 flex items-center gap-4 mt-5">
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3.5 py-2 backdrop-blur-sm">
                <FolderOpen className="w-4 h-4 text-white/80" />
                <span className="text-white text-[12px] font-semibold">{docs.length} Documents</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3.5 py-2 backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span className="text-white text-[12px] font-semibold">{approvedCount} Approved</span>
              </div>
              {pendingCount > 0 && (
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3.5 py-2 backdrop-blur-sm">
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span className="text-white text-[12px] font-semibold">{pendingCount} Pending</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3.5 py-2 backdrop-blur-sm">
                <HardDrive className="w-4 h-4 text-white/80" />
                <span className="text-white text-[12px] font-semibold">{totalSize.toFixed(1)} MB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Document Cards Grid */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 200px)" }}>
          {docs.length === 0 ? (
            <div className="text-center py-16">
              <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No documents uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {docs.map(doc => {
                const tc = typeConfig[doc.type];
                const sc = statusConfig[doc.status];
                const Icon = tc.icon;
                const StatusIcon = sc.icon;
                return (
                  <div key={doc.id} className="group relative bg-white rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    {/* Colored top strip */}
                    <div className={`h-1.5 bg-gradient-to-r ${tc.gradient}`} />

                    <div className="p-4">
                      {/* File icon + name + type badge */}
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl ${tc.bg} flex items-center justify-center shrink-0 ring-1 ${tc.ring}`}>
                          <Icon className={`w-5 h-5 ${tc.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-bold text-gray-900 truncate">{doc.fileName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${tc.bg} ${tc.text}`}>
                              {doc.type}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${sc.bg} ${sc.text}`}>
                              <StatusIcon className={`w-2.5 h-2.5 ${sc.iconColor}`} />
                              {doc.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Meta row */}
                      <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-500">
                        <div className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3" />
                          <span>{doc.size}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3 text-blue-400" />
                          <span>{doc.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <span>{doc.uploadedBy}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[11px] font-semibold shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all">
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                        <button className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] font-semibold transition-colors"
                          title="Preview">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onEdit(doc)} className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-[11px] font-semibold transition-colors"
                          title="Edit">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onDelete(doc)} className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-[11px] font-semibold transition-colors"
                          title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
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
   Document Modal (Edit / Add)
   ═══════════════════════════════════════════ */
const emptyDoc: EmployeeDoc = {
  id: "", employeeName: "", fileName: "", type: "PDF",
  size: "", uploadedBy: "Admin", date: new Date().toISOString().slice(0, 10), status: "Pending",
};

const DocModal = ({ doc, isAdd, onClose, onSave }: {
  doc?: EmployeeDoc; isAdd: boolean; onClose: () => void; onSave: (d: EmployeeDoc) => void;
}) => {
  const [form, setForm] = useState<EmployeeDoc>(doc ? { ...doc } : { ...emptyDoc });
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof EmployeeDoc>(k: K, v: EmployeeDoc[K]) => setForm(prev => ({ ...prev, [k]: v }));

  const handleFile = (file: File) => {
    setUploadedFile(file.name);
    if (isAdd) {
      const ext = file.name.split(".").pop()?.toUpperCase() || "PDF";
      const sizeKB = file.size / 1024;
      const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${Math.round(sizeKB)} KB`;
      set("fileName", file.name);
      set("size", sizeStr);
      if (["PDF", "DOCX", "JPG", "ZIP", "PNG", "XLS"].includes(ext)) set("type", ext as DocType);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[680px] max-h-[90vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className={`bg-gradient-to-r ${isAdd ? "from-emerald-600 via-teal-600 to-cyan-600" : "from-blue-600 via-indigo-600 to-purple-600"} px-6 py-5`}>
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute right-8 -bottom-4 w-16 h-16 rounded-full bg-white/5" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  {isAdd ? <CloudUpload className="w-5 h-5 text-white" /> : <FileText className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">{isAdd ? "Upload New Document" : "Edit Document"}</h2>
                  <p className="text-white/60 text-[11px]">{isAdd ? "Add a new document to the vault" : form.fileName}</p>
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
            <FieldInput icon={<FileText className="w-4 h-4 text-gray-400" />} label="File Name" value={form.fileName} onChange={v => set("fileName", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StyledDropdown label="File Type" required value={form.type} options={docTypes} onChange={v => set("type", v as DocType)} icon={<File className="w-4 h-4" />} />
            <FieldInput icon={<HardDrive className="w-4 h-4 text-gray-400" />} label="File Size" value={form.size} onChange={v => set("size", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<User className="w-4 h-4 text-gray-400" />} label="Uploaded By" value={form.uploadedBy} onChange={v => set("uploadedBy", v)} />
            <FieldInput icon={<CalendarDays className="w-4 h-4 text-gray-400" />} label="Uploaded Date" value={form.date} type="date" onChange={v => set("date", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StyledDropdown label="Status" required value={form.status} options={docStatuses} onChange={v => set("status", v as DocStatus)} icon={<CheckCircle2 className="w-4 h-4" />} />
          </div>

          {/* Upload Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            onClick={() => fileRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 ${
              dragOver
                ? "border-blue-400 bg-blue-50/60 scale-[1.01]"
                : "border-gray-300 bg-gradient-to-br from-gray-50/50 to-blue-50/30 hover:border-blue-300 hover:bg-blue-50/40"
            }`}
          >
            <input ref={fileRef} type="file" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            {uploadedFile ? (
              <div className="space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-gray-800">{uploadedFile}</p>
                <p className="text-[11px] text-emerald-600 font-medium">File ready &bull; Click to change</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto">
                  <CloudUpload className="w-7 h-7 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">Drag & drop a file here or <span className="text-blue-600 font-bold underline decoration-2 underline-offset-2">browse</span></p>
                  <p className="text-[11px] text-gray-400 mt-1.5">Supported formats: PDF, DOCX, ZIP, PNG (Max 10MB)</p>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => onSave(form)}
              className={`px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition-all ${
                isAdd
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20 hover:shadow-lg"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/20 hover:shadow-lg"
              }`}>
              Save
            </button>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-semibold shadow-md shadow-red-500/20 hover:shadow-lg transition-all">Cancel</button>
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

export default EmployeeDocuments;
