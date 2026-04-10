import { useState, useRef, useEffect } from "react";
import {
  Search, Filter, RefreshCw, Download, Upload, Edit3, Trash2,
  CalendarDays, ChevronLeft, ChevronRight, ChevronDown, X, Check, User,
  FileText, Image, Table2, FileCode, FileType, Presentation, File,
} from "lucide-react";
import { PaginationDropdown } from "@/components/ui/StyledDropdown";

/* ═══════════════════════════════════════════
   Types & Data
   ═══════════════════════════════════════════ */

type FileType_ = "PDF" | "Figma" | "Excel" | "Word" | "Image" | "SQL" | "PowerPoint" | "Markdown";

interface ProjectFile {
  id: string;
  name: string;
  type: FileType_;
  size: string;
  uploadedBy: string;
  date: string;
}

const initialFiles: ProjectFile[] = [
  { id: "F001", name: "Project_Requirements.pdf", type: "PDF", size: "2.5 MB", uploadedBy: "Sarah Smith", date: "2024-01-05" },
  { id: "F002", name: "Design_Mockup.fig", type: "Figma", size: "45.2 MB", uploadedBy: "John Deo", date: "2024-01-12" },
  { id: "F003", name: "Budget_Report.xlsx", type: "Excel", size: "1.8 MB", uploadedBy: "Pankaj Patel", date: "2024-01-13" },
  { id: "F004", name: "Meeting_Notes.docx", type: "Word", size: "580 KB", uploadedBy: "Pooja Sharma", date: "2024-01-15" },
  { id: "F005", name: "Logo_Final.png", type: "Image", size: "1.2 MB", uploadedBy: "Pankaj Patel", date: "2024-01-20" },
  { id: "F006", name: "Database_Schema.sql", type: "SQL", size: "64 KB", uploadedBy: "Jayesh Patel", date: "2024-02-01" },
  { id: "F007", name: "User_Personas.pdf", type: "PDF", size: "0.1 MB", uploadedBy: "Sarah Smith", date: "2024-02-05" },
  { id: "F008", name: "Marketing_Strategy.pptx", type: "PowerPoint", size: "12.5 MB", uploadedBy: "Mohan Sharma", date: "2024-02-10" },
  { id: "F009", name: "Code_Review_Guidelines.md", type: "Markdown", size: "12 KB", uploadedBy: "John Deo", date: "2024-02-12" },
  { id: "F010", name: "Sprint_Retrospective.docx", type: "Word", size: "450 KB", uploadedBy: "Sarah Smith", date: "2024-02-15" },
  { id: "F011", name: "API_Documentation.pdf", type: "PDF", size: "3.8 MB", uploadedBy: "Vikram Singh", date: "2024-02-18" },
  { id: "F012", name: "Wireframes_v2.fig", type: "Figma", size: "38.6 MB", uploadedBy: "Pankaj Patel", date: "2024-02-22" },
];

const typeConfig: Record<FileType_, { icon: typeof FileText; color: string; bg: string }> = {
  PDF: { icon: FileText, color: "text-red-600", bg: "bg-red-50" },
  Figma: { icon: FileType, color: "text-purple-600", bg: "bg-purple-50" },
  Excel: { icon: Table2, color: "text-emerald-600", bg: "bg-emerald-50" },
  Word: { icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  Image: { icon: Image, color: "text-amber-600", bg: "bg-amber-50" },
  SQL: { icon: FileCode, color: "text-orange-600", bg: "bg-orange-50" },
  PowerPoint: { icon: Presentation, color: "text-rose-600", bg: "bg-rose-50" },
  Markdown: { icon: FileCode, color: "text-gray-600", bg: "bg-gray-100" },
};

const fileTypes: FileType_[] = ["PDF", "Figma", "Excel", "Word", "Image", "SQL", "PowerPoint", "Markdown"];

const avatarColors: Record<string, string> = {
  "Sarah Smith": "from-rose-400 to-pink-500",
  "John Deo": "from-blue-400 to-indigo-500",
  "Pankaj Patel": "from-amber-400 to-orange-500",
  "Pooja Sharma": "from-purple-400 to-violet-500",
  "Jayesh Patel": "from-emerald-400 to-green-500",
  "Mohan Sharma": "from-cyan-400 to-teal-500",
  "Vikram Singh": "from-red-400 to-rose-500",
  "Shriyash Jagtap": "from-orange-500 to-amber-600",
  "Jitesh Naidu": "from-cyan-500 to-blue-600",
};

const getInitials = (name: string) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
const getAvatarColor = (name: string) => avatarColors[name] || "from-gray-400 to-gray-500";

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */

const ProjectFiles = () => {
  const [files, setFiles] = useState<ProjectFile[]>(initialFiles);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FileType_ | "All">("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [deleteFile, setDeleteFile] = useState<ProjectFile | null>(null);
  const [editFile, setEditFile] = useState<ProjectFile | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.uploadedBy.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || f.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const allSelected = paginated.length > 0 && paginated.every(f => selectedIds.has(f.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      const next = new Set(selectedIds);
      paginated.forEach(f => next.delete(f.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      paginated.forEach(f => next.add(f.id));
      setSelectedIds(next);
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const handleDelete = () => {
    if (deleteFile) {
      setFiles(prev => prev.filter(f => f.id !== deleteFile.id));
      setDeleteFile(null);
    }
  };

  const handleSaveEdit = (updated: ProjectFile) => {
    setFiles(prev => prev.map(f => f.id === updated.id ? updated : f));
    setEditFile(null);
  };

  const handleAddFile = (newFile: Omit<ProjectFile, "id">) => {
    const id = `F${String(files.length + 1).padStart(3, "0")}`;
    setFiles(prev => [...prev, { ...newFile, id }]);
    setAddOpen(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Project Files</h1>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-visible">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 min-w-[220px]">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search files..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent text-[13px] font-medium text-gray-900 placeholder:text-gray-400 outline-none flex-1" />
          </div>

          <div className="flex items-center gap-2">
            {/* Type Filter */}
            <div ref={filterRef} className="relative">
              <button onClick={() => setFilterOpen(!filterOpen)}
                className={`p-2.5 rounded-xl border transition-all ${filterOpen ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}>
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
              {filterOpen && (
                <div className="absolute right-0 top-full mt-1.5 bg-white rounded-xl border border-gray-200 shadow-xl py-1.5 w-44 z-50 animate-fade-in max-h-[320px] overflow-y-auto">
                  <button onClick={() => { setTypeFilter("All"); setFilterOpen(false); setPage(1); }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] font-semibold flex items-center justify-between ${typeFilter === "All" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"}`}>
                    All {typeFilter === "All" && <Check className="w-3.5 h-3.5" />}
                  </button>
                  {fileTypes.map(t => {
                    const tc = typeConfig[t];
                    return (
                      <button key={t} onClick={() => { setTypeFilter(t); setFilterOpen(false); setPage(1); }}
                        className={`w-full text-left px-4 py-2.5 text-[13px] font-semibold flex items-center justify-between ${typeFilter === t ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"}`}>
                        <span className="flex items-center gap-2">
                          <tc.icon className={`w-3.5 h-3.5 ${tc.color}`} />{t}
                        </span>
                        {typeFilter === t && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <button onClick={() => { setSearch(""); setTypeFilter("All"); setPage(1); }}
              className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:border-gray-300 transition-all">
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:border-gray-300 transition-all">
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <button onClick={() => setAddOpen(true)} className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all">
              <Upload className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="pl-5 py-3 w-10">
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer" />
                </th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">File Name</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Size</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Uploaded By</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider text-center">Download</th>
                <th className="py-3 pr-5 text-[12px] font-bold text-gray-600 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((file, idx) => {
                const tc = typeConfig[file.type];
                const Icon = tc.icon;
                return (
                  <tr key={file.id}
                    className={`border-b border-gray-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"} hover:bg-blue-50/30`}>
                    <td className="pl-5 py-3.5">
                      <input type="checkbox" checked={selectedIds.has(file.id)} onChange={() => toggleSelect(file.id)}
                        className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer" />
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg ${tc.bg} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-4 h-4 ${tc.color}`} />
                        </div>
                        <span className="text-[13px] font-bold text-gray-900">{file.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${tc.bg} ${tc.color}`}>{file.type}</span>
                    </td>
                    <td className="py-3.5">
                      <span className="text-[13px] font-semibold text-gray-700">{file.size}</span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getAvatarColor(file.uploadedBy)} flex items-center justify-center shrink-0`}>
                          <span className="text-[10px] font-bold text-white leading-none">{getInitials(file.uploadedBy)}</span>
                        </div>
                        <span className="text-[13px] font-semibold text-gray-700">{file.uploadedBy}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-gray-700">
                        <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                        {file.date}
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors group">
                        <Download className="w-4 h-4 text-blue-500 group-hover:text-blue-700" />
                      </button>
                    </td>
                    <td className="py-3.5 pr-5">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setEditFile({ ...file })}
                          className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors group">
                          <Edit3 className="w-4 h-4 text-blue-500 group-hover:text-blue-700" />
                        </button>
                        <button onClick={() => setDeleteFile(file)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors group">
                          <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 text-[14px] font-medium">No files found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-end gap-4 text-[12px] font-semibold text-gray-600">
          <div className="flex items-center gap-2">
            <span>Items per page</span>
            <PaginationDropdown value={perPage} options={[5, 10, 20]} onChange={v => { setPerPage(v); setPage(1); }} />
          </div>
          <span>{(page - 1) * perPage + 1} - {Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add File Modal */}
      {addOpen && <AddFileModal onSave={handleAddFile} onClose={() => setAddOpen(false)} />}

      {/* Edit File Modal */}
      {editFile && (
        <EditFileModal file={editFile} onSave={handleSaveEdit} onClose={() => setEditFile(null)} />
      )}

      {/* Delete Confirmation */}
      {deleteFile && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setDeleteFile(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-[16px] font-bold text-gray-900 mb-2">Delete File</h3>
            <p className="text-[13px] text-gray-600 mb-5">
              Are you sure you want to delete <span className="font-bold text-gray-900">"{deleteFile.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold transition-colors">
                Delete
              </button>
              <button onClick={() => setDeleteFile(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-bold transition-colors">
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
   Edit File Modal
   ═══════════════════════════════════════════ */

interface EditFileModalProps {
  file: ProjectFile;
  onSave: (f: ProjectFile) => void;
  onClose: () => void;
}

const EditFileModal = ({ file, onSave, onClose }: EditFileModalProps) => {
  const [form, setForm] = useState({ ...file });
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleSubmit = () => {
    onSave(form);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-white">Edit File: {file.name}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* File Name */}
            <fieldset className="border-2 rounded-xl px-3.5 pt-1 pb-2.5 transition-all border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <legend className="text-[11px] font-semibold text-gray-700 px-1">File Name<span className="text-red-500">*</span></legend>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
            </fieldset>

            {/* File Type */}
            <fieldset className="border-2 rounded-xl px-3.5 pt-1 pb-2.5 transition-all border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <legend className="text-[11px] font-semibold text-gray-700 px-1">File Type<span className="text-red-500">*</span></legend>
              <input type="text" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as FileType_ }))}
                className="w-full text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
            </fieldset>

            {/* File Size */}
            <fieldset className="border-2 rounded-xl px-3.5 pt-1 pb-2.5 transition-all border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <legend className="text-[11px] font-semibold text-gray-700 px-1">File Size<span className="text-red-500">*</span></legend>
              <input type="text" value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
                className="w-full text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
            </fieldset>

            {/* Uploaded By */}
            <fieldset className="border-2 rounded-xl px-3.5 pt-1 pb-2.5 transition-all border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <legend className="text-[11px] font-semibold text-gray-700 px-1">Uploaded By<span className="text-red-500">*</span></legend>
              <div className="flex items-center gap-2">
                <input type="text" value={form.uploadedBy} onChange={e => setForm(f => ({ ...f, uploadedBy: e.target.value }))}
                  className="w-full text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
                <User className="w-4 h-4 text-gray-400 shrink-0" />
              </div>
            </fieldset>

            {/* Uploaded Date */}
            <fieldset className="border-2 rounded-xl px-3.5 pt-1 pb-2.5 transition-all border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <legend className="text-[11px] font-semibold text-gray-700 px-1">Uploaded Date<span className="text-red-500">*</span></legend>
              <div className="flex items-center gap-2">
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full text-[14px] font-semibold text-gray-900 outline-none bg-transparent" />
                <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
              </div>
            </fieldset>
          </div>

          {/* Drag & Drop Upload Area */}
          <div
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl py-8 px-4 text-center transition-all ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"
            }`}>
            <input type="file" onChange={handleFileInput} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <Upload className={`w-8 h-8 mx-auto mb-2 ${dragActive ? "text-blue-500" : "text-gray-400"}`} />
            {uploadedFileName ? (
              <p className="text-[13px] font-semibold text-emerald-600">{uploadedFileName} selected</p>
            ) : (
              <>
                <p className="text-[13px] font-medium text-gray-600">
                  Drag & drop a file here or <span className="text-blue-600 font-bold cursor-pointer underline">browse</span>
                </p>
                <p className="text-[11px] text-gray-400 mt-1">Supported formats: PDF, DOCX, ZIP, PNG (Max 10MB)</p>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold transition-colors shadow-md">
              Save
            </button>
            <button onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Add File Modal
   ═══════════════════════════════════════════ */

const AddFileModal = ({ onSave, onClose }: { onSave: (f: Omit<ProjectFile, "id">) => void; onClose: () => void }) => {
  const [form, setForm] = useState({ name: "", type: "PDF" as FileType_, size: "", uploadedBy: "", date: "" });
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      setUploadedFileName(f.name);
      setForm(prev => ({ ...prev, name: f.name, size: `${(f.size / 1024 / 1024).toFixed(1)} MB` }));
    }
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setUploadedFileName(f.name);
      setForm(prev => ({ ...prev, name: f.name, size: `${(f.size / 1024 / 1024).toFixed(1)} MB` }));
    }
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.uploadedBy.trim() || !form.date) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-white">Upload New File</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"><X className="w-5 h-5 text-white" /></button>
        </div>
        <div className="p-6 space-y-5">
          {/* Drag & Drop */}
          <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl py-8 px-4 text-center transition-all ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"}`}>
            <input type="file" onChange={handleFileInput} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <Upload className={`w-8 h-8 mx-auto mb-2 ${dragActive ? "text-blue-500" : "text-gray-400"}`} />
            {uploadedFileName ? (
              <p className="text-[13px] font-semibold text-emerald-600">{uploadedFileName} selected</p>
            ) : (
              <>
                <p className="text-[13px] font-medium text-gray-600">Drag & drop a file here or <span className="text-blue-600 font-bold underline">browse</span></p>
                <p className="text-[11px] text-gray-400 mt-1">Supported formats: PDF, DOCX, ZIP, PNG (Max 10MB)</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <fieldset className="border-2 rounded-xl px-3.5 pt-1 pb-2.5 transition-all border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <legend className="text-[11px] font-semibold text-gray-700 px-1">File Name<span className="text-red-500">*</span></legend>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" placeholder="Enter file name" />
            </fieldset>
            <fieldset className="border-2 rounded-xl px-3.5 pt-1 pb-2.5 transition-all border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <legend className="text-[11px] font-semibold text-gray-700 px-1">File Type<span className="text-red-500">*</span></legend>
              <input type="text" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as FileType_ }))}
                className="w-full text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
            </fieldset>
            <fieldset className="border-2 rounded-xl px-3.5 pt-1 pb-2.5 transition-all border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <legend className="text-[11px] font-semibold text-gray-700 px-1">Uploaded By<span className="text-red-500">*</span></legend>
              <div className="flex items-center gap-2">
                <input type="text" value={form.uploadedBy} onChange={e => setForm(f => ({ ...f, uploadedBy: e.target.value }))} placeholder="Your name"
                  className="w-full text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
                <User className="w-4 h-4 text-gray-400 shrink-0" />
              </div>
            </fieldset>
            <fieldset className="border-2 rounded-xl px-3.5 pt-1 pb-2.5 transition-all border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <legend className="text-[11px] font-semibold text-gray-700 px-1">Date<span className="text-red-500">*</span></legend>
              <div className="flex items-center gap-2">
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full text-[14px] font-semibold text-gray-900 outline-none bg-transparent" />
                <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
              </div>
            </fieldset>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button onClick={handleSubmit} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold transition-colors shadow-md">Save</button>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectFiles;
