import { useState, useRef, useEffect } from "react";
import {
  Search, Plus, RefreshCw, Download, Edit3, Trash2,
  X, User, Calendar, Briefcase, ClipboardList, Clock,
  ChevronDown, ChevronLeft, ChevronRight, FileText
} from "lucide-react";

interface TimesheetEntry {
  id: string;
  empName: string;
  date: string;
  project: string;
  task: string;
  hours: number;
  status: "Approved" | "Pending" | "Rejected";
  description: string;
}

const MOCK: TimesheetEntry[] = [
  { id: "TS001", empName: "Shriyash Jagtap", date: "2025-04-01", project: "WebNxt HRM", task: "Development", hours: 8, status: "Approved", description: "Working on employee module" },
  { id: "TS002", empName: "Jitesh Naidu", date: "2025-04-01", project: "WebNxt HRM", task: "Testing", hours: 7, status: "Approved", description: "QA for leave management" },
  { id: "TS003", empName: "Shubham Jadhav", date: "2025-04-01", project: "Client Portal", task: "Design", hours: 6, status: "Pending", description: "UI mockups for dashboard" },
  { id: "TS004", empName: "John Doe", date: "2025-04-02", project: "Project A", task: "Development", hours: 8, status: "Approved", description: "Working on core modules" },
  { id: "TS005", empName: "Sarah Parker", date: "2025-04-02", project: "Project B", task: "Research", hours: 5, status: "Pending", description: "Market analysis report" },
  { id: "TS006", empName: "Angelica Ramos", date: "2025-04-02", project: "WebNxt HRM", task: "Documentation", hours: 4, status: "Approved", description: "API documentation update" },
  { id: "TS007", empName: "Mark Hay", date: "2025-04-03", project: "Project A", task: "Review", hours: 3, status: "Rejected", description: "Code review session" },
  { id: "TS008", empName: "Cara Stevens", date: "2025-04-03", project: "Client Portal", task: "Design", hours: 8, status: "Approved", description: "Final design handoff" },
  { id: "TS009", empName: "Ashton Cox", date: "2025-04-03", project: "WebNxt HRM", task: "Development", hours: 9, status: "Approved", description: "Attendance module backend" },
  { id: "TS010", empName: "Michael Chan", date: "2025-04-04", project: "Project B", task: "Testing", hours: 6, status: "Pending", description: "Integration testing" },
  { id: "TS011", empName: "Airi Satou", date: "2025-04-04", project: "Project A", task: "Development", hours: 7, status: "Approved", description: "Feature implementation" },
  { id: "TS012", empName: "Jacob Ryan", date: "2025-04-04", project: "Client Portal", task: "Marketing", hours: 5, status: "Approved", description: "Campaign setup" },
  { id: "TS013", empName: "Jeni Brincker", date: "2025-04-05", project: "WebNxt HRM", task: "Development", hours: 8, status: "Pending", description: "Bug fixes sprint 12" },
  { id: "TS014", empName: "Shriyash Jagtap", date: "2025-04-05", project: "Project A", task: "Review", hours: 4, status: "Approved", description: "Sprint retrospective" },
  { id: "TS015", empName: "Jitesh Naidu", date: "2025-04-05", project: "Project B", task: "Testing", hours: 6, status: "Rejected", description: "Regression tests" },
];

const PROJECTS = ["WebNxt HRM", "Project A", "Project B", "Client Portal", "Digital Marketing"] as const;
const TASKS = ["Development", "Testing", "Design", "Research", "Documentation", "Review", "Marketing", "Deployment"] as const;
const STATUSES = ["Approved", "Pending", "Rejected"] as const;

const avatarColors = ["#6366f1","#ec4899","#f59e0b","#22c55e","#ef4444","#06b6d4","#8b5cf6","#14b8a6","#e11d48","#3b82f6"];
const getInitials = (n: string) => n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    Approved: "bg-green-50 text-green-600 border-green-200",
    Pending:  "bg-amber-50 text-amber-600 border-amber-200",
    Rejected: "bg-red-50 text-red-500 border-red-200",
  };
  return map[s] || "bg-gray-50 text-gray-500 border-gray-200";
};

/* ─── Dropdown ─── */
const FieldDropdown = ({ label, value, options, onChange, icon }: {
  label: string; value: string; options: readonly string[]; onChange: (v: string) => void; icon?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <label className="absolute -top-2.5 left-3 px-1 bg-white text-[11px] font-semibold text-gray-500 z-10">{label}</label>
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 bg-white hover:border-[hsl(var(--primary))] transition-all focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)]">
        <span className="flex items-center gap-2">{icon}{value || <span className="text-gray-400">Select…</span>}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-100 z-50 max-h-48 overflow-auto py-1">
          {options.map(o => (
            <button key={o} type="button" onClick={() => { onChange(o); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-[hsl(var(--primary)/0.08)] transition-colors ${o === value ? "text-[hsl(var(--primary))] font-bold bg-[hsl(var(--primary)/0.04)]" : "text-gray-700"}`}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Pagination Dropdown ─── */
const PagDropdown = ({ value, options, onChange }: { value: number; options: number[]; onChange: (v: number) => void }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative inline-block">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1 border border-gray-200 rounded text-xs font-semibold text-gray-700 bg-white hover:border-[hsl(var(--primary))]">
        {value} <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute bottom-full mb-1 left-0 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1">
          {options.map(o => (
            <button key={o} onClick={() => { onChange(o); setOpen(false); }}
              className={`block w-full text-left px-4 py-1.5 text-xs hover:bg-[hsl(var(--primary)/0.08)] ${o === value ? "text-[hsl(var(--primary))] font-bold" : "text-gray-700"}`}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Edit / Add Modal ─── */
const TimesheetModal = ({ entry, onClose, onSave, isAdd }: {
  entry: TimesheetEntry; onClose: () => void; onSave: (e: TimesheetEntry) => void; isAdd?: boolean;
}) => {
  const [form, setForm] = useState<TimesheetEntry>({ ...entry });
  const set = (k: keyof TimesheetEntry, v: string | number) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.8)]">
          <h3 className="text-white font-bold text-base">{isAdd ? "Add Timesheet" : form.empName}</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Employee Name */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 px-1 bg-white text-[11px] font-semibold text-gray-500 z-10">Employee Name*</label>
            <div className="relative">
              <input value={form.empName} onChange={e => set("empName", e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)] focus:border-[hsl(var(--primary))] outline-none" />
              <User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Date + Project */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 px-1 bg-white text-[11px] font-semibold text-gray-500 z-10">Date*</label>
              <div className="relative">
                <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)] focus:border-[hsl(var(--primary))] outline-none" />
                <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <FieldDropdown label="Project Name*" value={form.project} options={PROJECTS} onChange={v => set("project", v)}
              icon={<Briefcase size={14} className="text-gray-400" />} />
          </div>

          {/* Task + Hours */}
          <div className="grid grid-cols-2 gap-4">
            <FieldDropdown label="Task*" value={form.task} options={TASKS} onChange={v => set("task", v)}
              icon={<ClipboardList size={14} className="text-gray-400" />} />
            <div className="relative">
              <label className="absolute -top-2.5 left-3 px-1 bg-white text-[11px] font-semibold text-gray-500 z-10">Hours*</label>
              <div className="relative">
                <input type="number" min={0} max={24} value={form.hours} onChange={e => set("hours", Number(e.target.value))}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)] focus:border-[hsl(var(--primary))] outline-none" />
                <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Status */}
          <FieldDropdown label="Status*" value={form.status} options={STATUSES} onChange={v => set("status", v as TimesheetEntry["status"])} />

          {/* Description */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 px-1 bg-white text-[11px] font-semibold text-gray-500 z-10">Description</label>
            <textarea rows={3} value={form.description} onChange={e => set("description", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)] focus:border-[hsl(var(--primary))] outline-none resize-y" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={() => onSave(form)}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-[hsl(var(--primary))] hover:opacity-90 shadow-sm transition-all">
            Save
          </button>
          <button onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-red-500 hover:bg-red-600 shadow-sm transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Delete Modal ─── */
const DeleteModal = ({ name, onClose, onConfirm }: { name: string; onClose: () => void; onConfirm: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center" onClick={e => e.stopPropagation()}>
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
        <Trash2 size={24} className="text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Timesheet?</h3>
      <p className="text-sm text-gray-500 mb-5">Remove the entry for <strong>{name}</strong>? This cannot be undone.</p>
      <div className="flex justify-center gap-3">
        <button onClick={onConfirm} className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-all">Delete</button>
        <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all">Cancel</button>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════
   Main Page
   ═══════════════════════════════════════ */
const Timesheets = () => {
  const [data, setData] = useState<TimesheetEntry[]>(MOCK);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editEntry, setEditEntry] = useState<TimesheetEntry | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteEntry, setDeleteEntry] = useState<TimesheetEntry | null>(null);

  const filtered = data.filter(r => {
    const q = search.toLowerCase();
    const matchQ = !q || r.empName.toLowerCase().includes(q) || r.project.toLowerCase().includes(q) || r.task.toLowerCase().includes(q);
    const matchS = statusFilter === "All" || r.status === statusFilter;
    return matchQ && matchS;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);
  const startIdx = (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, filtered.length);

  const handleSave = (entry: TimesheetEntry) => {
    setData(prev => {
      const idx = prev.findIndex(r => r.id === entry.id);
      if (idx >= 0) { const c = [...prev]; c[idx] = entry; return c; }
      return [entry, ...prev];
    });
    setEditEntry(null);
    setAddOpen(false);
  };

  const handleDelete = () => {
    if (deleteEntry) setData(prev => prev.filter(r => r.id !== deleteEntry.id));
    setDeleteEntry(null);
  };

  const blankEntry: TimesheetEntry = {
    id: `TS${String(Date.now()).slice(-6)}`,
    empName: "", date: new Date().toISOString().slice(0, 10), project: "", task: "", hours: 0, status: "Pending", description: "",
  };

  /* ── KPI cards ── */
  const totalHours = data.reduce((s, r) => s + r.hours, 0);
  const approved = data.filter(r => r.status === "Approved").length;
  const pending = data.filter(r => r.status === "Pending").length;
  const rejected = data.filter(r => r.status === "Rejected").length;

  const kpis = [
    { label: "Total Entries", value: data.length, color: "#6366f1", icon: <FileText size={20} /> },
    { label: "Total Hours", value: totalHours, color: "#06b6d4", icon: <Clock size={20} /> },
    { label: "Approved", value: approved, color: "#22c55e", icon: <ClipboardList size={20} /> },
    { label: "Pending", value: pending, color: "#f59e0b", icon: <Clock size={20} /> },
    { label: "Rejected", value: rejected, color: "#ef4444", icon: <Trash2 size={20} /> },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: k.color }}>
              {k.icon}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{k.label}</p>
              <p className="text-xl font-extrabold text-gray-900">{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search employee, project…"
                className="pl-9 pr-4 py-2 w-56 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)] focus:border-[hsl(var(--primary))] outline-none" />
            </div>
            <StatusFilterDropdown value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1); }} />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setSearch(""); setStatusFilter("All"); setPage(1); }}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors" title="Refresh">
              <RefreshCw size={16} />
            </button>
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors" title="Download">
              <Download size={16} />
            </button>
            <button onClick={() => setAddOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white bg-[hsl(var(--primary))] hover:opacity-90 shadow-sm transition-all">
              <Plus size={16} /> Add Timesheet
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/80">
                {["Employee Name","Date","Project Name","Task","Hours","Status","Actions"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((row, ri) => (
                <tr key={row.id} className={`border-b border-gray-50 hover:bg-[hsl(var(--primary)/0.03)] transition-colors ${ri % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm"
                        style={{ backgroundColor: avatarColors[row.empName.length % avatarColors.length] }}>
                        {getInitials(row.empName)}
                      </span>
                      <span className="text-sm font-semibold text-gray-800">{row.empName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600 font-medium">{row.date}</td>
                  <td className="px-5 py-3 text-sm text-gray-700 font-semibold">{row.project}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 font-medium">{row.task}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold">{row.hours}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusBadge(row.status)}`}>{row.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setEditEntry(row)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Edit">
                        <Edit3 size={15} />
                      </button>
                      <button onClick={() => setDeleteEntry(row)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">No timesheets found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium">
            {filtered.length > 0 ? `${startIdx} - ${endIdx} of ${filtered.length}` : "0 results"}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-medium">Items per page:</span>
            <PagDropdown value={perPage} options={[5, 10, 20, 50]} onChange={v => { setPerPage(v); setPage(1); }} />
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="p-1 rounded hover:bg-gray-100 text-gray-500 disabled:opacity-30 transition-colors"><ChevronLeft size={16} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                Math.max(0, page - 3), Math.min(totalPages, page + 2)
              ).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded text-xs font-bold transition-colors ${p === page ? "bg-[hsl(var(--primary))] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="p-1 rounded hover:bg-gray-100 text-gray-500 disabled:opacity-30 transition-colors"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {editEntry && <TimesheetModal entry={editEntry} onClose={() => setEditEntry(null)} onSave={handleSave} />}
      {addOpen && <TimesheetModal entry={blankEntry} onClose={() => setAddOpen(false)} onSave={handleSave} isAdd />}
      {deleteEntry && <DeleteModal name={deleteEntry.empName} onClose={() => setDeleteEntry(null)} onConfirm={handleDelete} />}
    </div>
  );
};

/* ─── Status filter dropdown ─── */
const StatusFilterDropdown = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  const opts = ["All", "Approved", "Pending", "Rejected"];
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:border-[hsl(var(--primary))] transition-all">
        Status: {value} <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 min-w-[120px]">
          {opts.map(o => (
            <button key={o} onClick={() => { onChange(o); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-[hsl(var(--primary)/0.08)] transition-colors ${o === value ? "text-[hsl(var(--primary))] font-bold" : "text-gray-700"}`}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Timesheets;
