import { useState, useRef, useEffect, DragEvent } from "react";
import {
  Bold, Italic, Underline, Strikethrough, Code, Quote, ListOrdered, List,
  Link2, Image, AlignLeft, AlignCenter, AlignRight, Table, Heading,
  X, FileText, ChevronDown, Hash, Type, Building2, Flag, UserCircle,
  CalendarDays, Users, Briefcase, FolderKanban, CloudUpload, Check,
  Send, Ban
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

type WorkStatus = "Active" | "Completed" | "Running" | "Pending" | "Not Started" | "Cancelled";

interface FormData {
  projectId: string;
  projectTitle: string;
  department: string;
  projectPriority: string;
  client: string;
  price: string;
  startDate: string;
  endDate: string;
  team: string[];
  workStatus: WorkStatus;
  projectDescription: string;
  budget: string;
  projectManager: string;
  projectType: string;
  descriptions: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

const employees: Employee[] = [
  { id: "e1", name: "Sarah Smith", role: "Frontend Developer", avatar: "SS" },
  { id: "e2", name: "John Deo", role: "Backend Developer", avatar: "JD" },
  { id: "e3", name: "Pankaj Patel", role: "UI/UX Designer", avatar: "PP" },
  { id: "e4", name: "Pooja Sharma", role: "QA Engineer", avatar: "PS" },
  { id: "e5", name: "Rahul Verma", role: "DevOps Engineer", avatar: "RV" },
  { id: "e6", name: "Anita Desai", role: "Project Manager", avatar: "AD" },
  { id: "e7", name: "Vikram Singh", role: "Full Stack Developer", avatar: "VS" },
  { id: "e8", name: "Priya Nair", role: "Data Analyst", avatar: "PN" },
  { id: "e9", name: "Amit Kumar", role: "Mobile Developer", avatar: "AK" },
  { id: "e10", name: "Neha Gupta", role: "Business Analyst", avatar: "NG" },
];

const departments = ["IT", "HR", "Finance", "Marketing", "Digital Marketing", "Sales", "Operations", "Design", "Engineering"];
const priorities = ["Low", "Medium", "High", "Urgent", "Critical"];
const projectTypes = ["Web Development", "Mobile App Development", "UI/UX Design", "Backend Development", "DevOps", "Data Analytics", "Machine Learning"];
const workStatuses: WorkStatus[] = ["Active", "Completed", "Running", "Pending", "Not Started", "Cancelled"];

const statusColors: Record<WorkStatus, { dot: string; active: string }> = {
  Active: { dot: "bg-emerald-500", active: "border-emerald-500 bg-emerald-50 text-emerald-700" },
  Completed: { dot: "bg-blue-500", active: "border-blue-500 bg-blue-50 text-blue-700" },
  Running: { dot: "bg-orange-500", active: "border-orange-500 bg-orange-50 text-orange-700" },
  Pending: { dot: "bg-amber-500", active: "border-amber-500 bg-amber-50 text-amber-700" },
  "Not Started": { dot: "bg-gray-400", active: "border-gray-400 bg-gray-50 text-gray-700" },
  Cancelled: { dot: "bg-red-500", active: "border-red-500 bg-red-50 text-red-700" },
};

const priorityColors: Record<string, string> = {
  Low: "text-green-600 bg-green-50", Medium: "text-amber-600 bg-amber-50", High: "text-orange-600 bg-orange-50",
  Urgent: "text-red-600 bg-red-50", Critical: "text-red-700 bg-red-100",
};

const initialForm: FormData = {
  projectId: "", projectTitle: "", department: "", projectPriority: "",
  client: "", price: "", startDate: "", endDate: "", team: [],
  workStatus: "Running", projectDescription: "", budget: "",
  projectManager: "", projectType: "", descriptions: "",
};

const currencies = [
  { symbol: "₹", label: "INR", flag: "🇮🇳" },
  { symbol: "$", label: "USD", flag: "🇺🇸" },
  { symbol: "€", label: "EUR", flag: "🇪🇺" },
  { symbol: "£", label: "GBP", flag: "🇬🇧" },
  { symbol: "¥", label: "JPY", flag: "🇯🇵" },
  { symbol: "A$", label: "AUD", flag: "🇦🇺" },
];

const AddProject = () => {
  const [form, setForm] = useState<FormData>({ ...initialForm });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [priceCurrency, setPriceCurrency] = useState(currencies[0]);
  const [budgetCurrency, setBudgetCurrency] = useState(currencies[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormData, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.projectId.trim()) e.projectId = "Project ID is required";
    if (!form.projectTitle.trim()) e.projectTitle = "Project Title is required";
    if (!form.department) e.department = "Department is required";
    if (!form.projectPriority) e.projectPriority = "Priority is required";
    if (!form.client.trim()) e.client = "Client is required";
    if (!form.price.trim()) e.price = "Price is required";
    if (!form.startDate) e.startDate = "Start Date is required";
    if (!form.endDate) e.endDate = "End Date is required";
    if (form.team.length === 0) e.team = "At least one team member is required";
    if (!form.budget.trim()) e.budget = "Budget is required";
    if (!form.projectManager.trim()) e.projectManager = "Project Manager is required";
    if (!form.projectType) e.projectType = "Project Type is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (validate()) { alert("Project added successfully!"); setForm({ ...initialForm }); setUploadedFiles([]); } };
  const handleCancel = () => { setForm({ ...initialForm }); setErrors({}); setUploadedFiles([]); };

  const handleFileDrop = (e: DragEvent) => { e.preventDefault(); setIsDragOver(false); setUploadedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]); };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]); };
  const removeFile = (idx: number) => setUploadedFiles(prev => prev.filter((_, i) => i !== idx));

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Add Projects</h1>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-7 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50/60 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
              <FolderKanban className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-[16px] font-extrabold text-gray-900">Add Projects</h2>
              <p className="text-[12px] text-gray-600 font-medium">Fill in the details below to create a new project</p>
            </div>
          </div>
        </div>

        <div className="px-7 py-7 space-y-7">

          {/* ── Section: Basic Info ── */}
          <SectionLabel icon={<Hash className="w-4 h-4" />} title="Basic Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Project ID" required icon={<Hash className="w-4 h-4" />} value={form.projectId} onChange={v => set("projectId", v)} error={errors.projectId} placeholder="Enter Project ID" />
            <Field label="Project Title" required icon={<Type className="w-4 h-4" />} value={form.projectTitle} onChange={v => set("projectTitle", v)} error={errors.projectTitle} placeholder="Enter Project Title" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <CustomSelect label="Department" required icon={<Building2 className="w-4 h-4" />} value={form.department} onChange={v => set("department", v)} options={departments} error={errors.department} />
            <CustomSelect label="Project Priority" required icon={<Flag className="w-4 h-4" />} value={form.projectPriority} onChange={v => set("projectPriority", v)} options={priorities} error={errors.projectPriority} renderOption={(opt, selected) => (
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full ${priorityColors[opt]?.split(" ")[1] || "bg-gray-200"}`} />
                <span>{opt}</span>
                {selected && <Check className="w-3.5 h-3.5 ml-auto text-blue-500" />}
              </div>
            )} />
          </div>

          <div className="border-t border-dashed border-gray-300" />

          {/* ── Section: Client & Pricing ── */}
          <SectionLabel icon={<UserCircle className="w-4 h-4" />} title="Client & Pricing" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Client" required icon={<UserCircle className="w-4 h-4" />} value={form.client} onChange={v => set("client", v)} error={errors.client} placeholder="Enter Client Name" />
            <CurrencyField label="Price" required value={form.price} onChange={v => set("price", v)} error={errors.price} placeholder="Enter Price" currency={priceCurrency} onCurrencyChange={setPriceCurrency} />
          </div>

          <div className="border-t border-dashed border-gray-300" />

          {/* ── Section: Timeline ── */}
          <SectionLabel icon={<CalendarDays className="w-4 h-4" />} title="Timeline" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <DatePickerField label="Project Start Date" required value={form.startDate} onChange={v => set("startDate", v)} error={errors.startDate} />
            <DatePickerField label="Project End Date" required value={form.endDate} onChange={v => set("endDate", v)} error={errors.endDate} />
          </div>

          <div className="border-t border-dashed border-gray-300" />

          {/* ── Section: Team & Status ── */}
          <SectionLabel icon={<Users className="w-4 h-4" />} title="Team & Status" />
          <MultiSelectEmployee label="Team" required selected={form.team}
            onChange={(ids) => { setForm(prev => ({ ...prev, team: ids })); if (errors.team) setErrors(prev => ({ ...prev, team: undefined })); }}
            error={errors.team} />

          {form.team.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/40 border-2 border-blue-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <h4 className="text-[13px] font-bold text-gray-900">Assigned Team Members ({form.team.length})</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {employees.filter(e => form.team.includes(e.id)).map((emp) => (
                  <div key={emp.id} className="flex items-center gap-3 bg-white/90 rounded-lg px-3.5 py-2.5 border border-blue-100 shadow-sm">
                    <div className={`w-8 h-8 rounded-full ${avatarColors[employees.indexOf(emp) % avatarColors.length]} flex items-center justify-center shrink-0 shadow-sm`}>
                      <span className="text-white text-[10px] font-bold">{emp.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-gray-900 truncate">{emp.name}</p>
                      <p className="text-[11px] text-gray-500 font-medium">{emp.role}</p>
                    </div>
                    <button type="button" onClick={() => { setForm(prev => ({ ...prev, team: prev.team.filter(id => id !== emp.id) })); }}
                      className="p-1 rounded-lg hover:bg-red-50 transition-colors shrink-0">
                      <X className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Status */}
          <div>
            <p className="text-[13px] text-gray-900 font-bold mb-3">Work Status:</p>
            <div className="flex flex-wrap gap-2.5">
              {workStatuses.map(status => {
                const active = form.workStatus === status;
                const sc = statusColors[status];
                return (
                  <button key={status} type="button" onClick={() => set("workStatus", status)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold border-2 transition-all ${
                      active ? sc.active : "border-gray-300 text-gray-600 hover:border-gray-400 bg-white"
                    }`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${active ? sc.dot : "bg-gray-400"}`} />
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300" />

          {/* ── Section: Project Details ── */}
          <SectionLabel icon={<Briefcase className="w-4 h-4" />} title="Project Details" />
          <TextareaField label="Project Description" required value={form.projectDescription} onChange={v => set("projectDescription", v)} placeholder="Enter project description..." rows={3} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <CurrencyField label="Budget" required value={form.budget} onChange={v => set("budget", v)} error={errors.budget} placeholder="Enter Budget" currency={budgetCurrency} onCurrencyChange={setBudgetCurrency} />
            <Field label="Project Manager" required icon={<UserCircle className="w-4 h-4" />} value={form.projectManager} onChange={v => set("projectManager", v)} error={errors.projectManager} placeholder="Enter Project Manager" />
          </div>

          <CustomSelect label="Project Type" required icon={<FolderKanban className="w-4 h-4" />} value={form.projectType} onChange={v => set("projectType", v)} options={projectTypes} error={errors.projectType} />

          <div className="border-t border-dashed border-gray-300" />

          {/* ── Section: Descriptions (Rich Editor) ── */}
          <SectionLabel icon={<FileText className="w-4 h-4" />} title="Descriptions" />
          <div className="border-2 border-gray-300 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-colors">
            <div className="flex flex-wrap items-center gap-0.5 px-3 py-2.5 bg-gray-100/80 border-b border-gray-300">
              <ToolbarBtn icon={<Bold className="w-3.5 h-3.5" />} />
              <ToolbarBtn icon={<Italic className="w-3.5 h-3.5" />} />
              <ToolbarBtn icon={<Underline className="w-3.5 h-3.5" />} />
              <ToolbarBtn icon={<Strikethrough className="w-3.5 h-3.5" />} />
              <ToolbarBtn icon={<Code className="w-3.5 h-3.5" />} />
              <ToolbarBtn icon={<Quote className="w-3.5 h-3.5" />} />
              <ToolbarDivider />
              <ToolbarBtn icon={<ListOrdered className="w-3.5 h-3.5" />} />
              <ToolbarBtn icon={<List className="w-3.5 h-3.5" />} />
              <ToolbarDivider />
              <div className="flex items-center border border-gray-300 rounded-md px-2.5 py-1 text-[11px] text-gray-700 font-semibold cursor-pointer hover:bg-gray-200 transition-colors">
                <Heading className="w-3 h-3 mr-1.5" /> Heading
              </div>
              <ToolbarDivider />
              <ToolbarBtn icon={<Link2 className="w-3.5 h-3.5" />} />
              <ToolbarBtn icon={<Image className="w-3.5 h-3.5" />} />
              <ToolbarDivider />
              <ToolbarBtn icon={<AlignLeft className="w-3.5 h-3.5" />} />
              <ToolbarBtn icon={<AlignCenter className="w-3.5 h-3.5" />} />
              <ToolbarBtn icon={<AlignRight className="w-3.5 h-3.5" />} />
              <ToolbarDivider />
              <ToolbarBtn icon={<Table className="w-3.5 h-3.5" />} />
            </div>
            <textarea rows={6} value={form.descriptions} onChange={e => set("descriptions", e.target.value)}
              placeholder="Type here..." className="w-full px-4 py-3 text-[14px] text-gray-900 font-medium outline-none resize-y placeholder:text-gray-500" />
          </div>

          <div className="border-t border-dashed border-gray-300" />

          {/* ── Section: Upload ── */}
          <SectionLabel icon={<CloudUpload className="w-4 h-4" />} title="Upload Image" />
          <div
            className={`border-2 border-dashed rounded-xl px-6 py-6 transition-all ${
              isDragOver ? "border-blue-500 bg-blue-50/40 scale-[1.005]" : "border-gray-400 bg-gray-50/30 hover:border-gray-500"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                <CloudUpload className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-[13px] text-gray-800 font-semibold mb-1">Drag & drop files here</p>
              <p className="text-[12px] text-gray-500 font-medium mb-3">or</p>
                <button type="button" onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2 text-[13px] font-bold text-blue-700 border-2 border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all">
                Choose File
              </button>
              <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white rounded-lg px-4 py-2.5 border border-gray-100 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-gray-800 font-semibold truncate">{file.name}</p>
                      <p className="text-[11px] text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={() => removeFile(i)} className="p-1 rounded-lg hover:bg-red-50 transition-colors">
                      <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-gray-200 bg-gray-50/50 flex items-center gap-3">
          <button onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-[14px] font-bold rounded-lg shadow-md shadow-blue-200 hover:shadow-lg transition-all">
            <Send className="w-4 h-4" /> Submit
          </button>
          <button onClick={handleCancel}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-[14px] font-bold rounded-lg shadow-md shadow-red-200 transition-all">
            <Ban className="w-3.5 h-3.5" /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Section Label
   ═══════════════════════════════════════════ */

const SectionLabel = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-2.5">
    <div className="text-blue-600">{icon}</div>
    <h3 className="text-[13px] font-extrabold text-gray-900 uppercase tracking-wider">{title}</h3>
  </div>
);

/* ═══════════════════════════════════════════
   Input Field
   ═══════════════════════════════════════════ */

const Field = ({ label, required, value, onChange, error, placeholder, type = "text", icon }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; error?: string; placeholder?: string; type?: string; icon?: React.ReactNode;
}) => (
  <div>
    <fieldset className={`border-2 rounded-xl px-3.5 pt-1.5 pb-2.5 transition-all ${
      error ? "border-red-400 ring-1 ring-red-100 bg-red-50/30" : "border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
    }`}>
      <legend className={`text-[12px] font-semibold px-1 ${error ? "text-red-500" : "text-gray-700"}`}>{label}{required && "*"}</legend>
      <div className="flex items-center gap-2.5">
        {icon && <div className="text-gray-600 shrink-0">{icon}</div>}
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full text-[14px] text-gray-900 font-medium outline-none bg-transparent placeholder:text-gray-500 placeholder:font-normal" />
      </div>
    </fieldset>
    {error && <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{error}</p>}
  </div>
);

/* ═══════════════════════════════════════════
   Custom Dropdown Select
   ═══════════════════════════════════════════ */

const CustomSelect = ({ label, required, value, onChange, options, error, icon, renderOption }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; options: string[]; error?: string; icon?: React.ReactNode;
  renderOption?: (opt: string, selected: boolean) => React.ReactNode;
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
          {icon && <div className="text-gray-600 shrink-0">{icon}</div>}
          <span className={`flex-1 text-[14px] font-medium ${value ? "text-gray-900" : "text-gray-500 font-normal"}`}>
            {value || `Select ${label}`}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </fieldset>
      {error && <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{error}</p>}

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-xl border border-gray-300 shadow-xl py-1.5 max-h-60 overflow-y-auto animate-fade-in">
          {options.map(opt => {
            const selected = value === opt;
            return (
              <button key={opt} type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-[13px] font-semibold transition-all duration-150 ${
                  selected ? "bg-blue-50 text-blue-700 border-l-[3px] border-blue-500 pl-[13px]" : "text-gray-800 hover:bg-blue-50/50 hover:text-blue-600 hover:pl-5 border-l-[3px] border-transparent"
                }`}>
                {renderOption ? renderOption(opt, selected) : (
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {selected && <Check className="w-3.5 h-3.5 text-blue-500" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Textarea Field
   ═══════════════════════════════════════════ */

const TextareaField = ({ label, required, value, onChange, placeholder, rows = 3 }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) => (
  <fieldset className="border-2 border-gray-300 rounded-xl px-3.5 pt-1.5 pb-2.5 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
    <legend className="text-[12px] font-semibold text-gray-700 px-1">{label}{required && "*"}</legend>
    <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full text-[14px] text-gray-900 font-medium outline-none bg-transparent resize-y placeholder:text-gray-500 placeholder:font-normal" />
  </fieldset>
);

/* ═══════════════════════════════════════════
   Toolbar
   ═══════════════════════════════════════════ */

const ToolbarBtn = ({ icon }: { icon: React.ReactNode }) => (
  <button type="button" className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors">
    {icon}
  </button>
);

const ToolbarDivider = () => <div className="w-px h-5 bg-gray-300 mx-1.5" />;

/* ═══════════════════════════════════════════
   Multi-Select Employee Dropdown
   ═══════════════════════════════════════════ */

const avatarColors = [
  "bg-blue-500", "bg-emerald-500", "bg-orange-500", "bg-purple-500", "bg-pink-500",
  "bg-teal-500", "bg-indigo-500", "bg-amber-500", "bg-cyan-500", "bg-rose-500",
];

const MultiSelectEmployee = ({ label, required, selected, onChange, error }: {
  label: string; required?: boolean; selected: string[]; onChange: (ids: string[]) => void; error?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) || emp.role.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  const selectedEmps = employees.filter(e => selected.includes(e.id));

  return (
    <div ref={ref} className="relative">
      <fieldset className={`border-2 rounded-xl px-3.5 pt-1.5 pb-2.5 cursor-pointer transition-all ${
        error ? "border-red-400 ring-1 ring-red-100 bg-red-50/30"
          : open ? "border-blue-500 ring-2 ring-blue-100"
          : "border-gray-300 hover:border-gray-400"
      }`} onClick={() => setOpen(!open)}>
        <legend className={`text-[12px] font-semibold px-1 ${error ? "text-red-500" : "text-gray-700"}`}>{label}{required && "*"}</legend>
        <div className="flex items-center gap-2.5">
          <Users className="w-4 h-4 text-gray-600 shrink-0" />
          {selectedEmps.length > 0 ? (
            <div className="flex-1 flex items-center gap-1.5 flex-wrap">
              {selectedEmps.length <= 3 ? selectedEmps.map(emp => (
                <span key={emp.id} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-[12px] font-semibold text-blue-700">
                  {emp.name}
                  <button type="button" onClick={e => { e.stopPropagation(); toggle(emp.id); }}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )) : (
                <>
                  {selectedEmps.slice(0, 2).map(emp => (
                    <span key={emp.id} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-[12px] font-semibold text-blue-700">
                      {emp.name}
                      <button type="button" onClick={e => { e.stopPropagation(); toggle(emp.id); }}
                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <span className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded-full text-[11px] font-bold text-gray-600">
                    +{selectedEmps.length - 2} more
                  </span>
                </>
              )}
            </div>
          ) : (
            <span className="flex-1 text-[14px] text-gray-500 font-normal">Select Team Members</span>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </fieldset>
      {error && <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{error}</p>}

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-xl border border-gray-300 shadow-2xl animate-fade-in overflow-hidden">
          <div className="px-3.5 py-2.5 border-b border-gray-200">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search employees..."
              className="w-full text-[13px] text-gray-900 font-medium outline-none bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 placeholder:text-gray-400"
              onClick={e => e.stopPropagation()} />
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-[13px] text-gray-500 text-center">No employees found</p>
            ) : filtered.map((emp, i) => {
              const isSelected = selected.includes(emp.id);
              return (
                <button key={emp.id} type="button" onClick={e => { e.stopPropagation(); toggle(emp.id); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 ${
                    isSelected ? "bg-blue-50/70" : "hover:bg-gray-50"
                  }`}>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className={`w-9 h-9 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center shrink-0`}>
                    <span className="text-white text-[11px] font-bold">{emp.avatar}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[13px] font-semibold text-gray-900">{emp.name}</p>
                    <p className="text-[11px] text-gray-500 font-medium">{emp.role}</p>
                  </div>
                  {isSelected && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">Selected</span>
                  )}
                </button>
              );
            })}
          </div>
          {selected.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-gray-600">{selected.length} member{selected.length > 1 ? "s" : ""} selected</span>
              <button type="button" onClick={e => { e.stopPropagation(); onChange([]); }}
                className="text-[12px] font-semibold text-red-500 hover:text-red-600 transition-colors">Clear All</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Date Picker Field
   ═══════════════════════════════════════════ */

const formatDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const DatePickerField = ({ label, required, value, onChange, error }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; error?: string;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = value ? new Date(value + "T00:00:00") : undefined;

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
          <CalendarDays className="w-4.5 h-4.5 text-gray-600 shrink-0" />
          <span className={`flex-1 text-[14px] font-medium ${value ? "text-gray-900" : "text-gray-500 font-normal"}`}>
            {value ? formatDate(value) : "dd-mm-yyyy"}
          </span>
          <CalendarDays className="w-4.5 h-4.5 text-gray-500 shrink-0" />
        </div>
      </fieldset>
      {error && <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{error}</p>}

      {open && (
        <div className="absolute z-50 left-0 mt-1.5 bg-white rounded-2xl border border-gray-200 shadow-2xl animate-fade-in">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            defaultMonth={selected || new Date()}
          />
          <div className="flex items-center justify-between px-4 pb-3 border-t border-gray-100 pt-2.5">
            <button type="button" onClick={() => { onChange(""); setOpen(false); }}
              className="text-[12px] font-medium text-gray-400 hover:text-red-500 transition-colors">Clear</button>
            <button type="button" onClick={() => {
              const t = new Date();
              const y = t.getFullYear();
              const m = String(t.getMonth() + 1).padStart(2, "0");
              const d = String(t.getDate()).padStart(2, "0");
              onChange(`${y}-${m}-${d}`);
              setOpen(false);
            }} className="text-[12px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">Today</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Currency Field (with dropdown)
   ═══════════════════════════════════════════ */

const CurrencyField = ({ label, required, value, onChange, error, placeholder, currency, onCurrencyChange }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; error?: string; placeholder?: string;
  currency: typeof currencies[0]; onCurrencyChange: (c: typeof currencies[0]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div>
      <fieldset className={`border-2 rounded-xl px-3.5 pt-1.5 pb-2.5 transition-all ${
        error ? "border-red-400 ring-1 ring-red-100 bg-red-50/30" : "border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
      }`}>
        <legend className={`text-[12px] font-semibold px-1 ${error ? "text-red-500" : "text-gray-700"}`}>{label}{required && "*"}</legend>
        <div className="flex items-center gap-0">
          {/* Currency picker */}
          <div ref={ref} className="relative">
            <button type="button" onClick={() => setOpen(!open)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 text-[13px] font-semibold text-gray-800 transition-colors mr-2.5 shrink-0">
              <span className="text-[14px]">{currency.flag}</span>
              <span>{currency.symbol}</span>
              <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div className="absolute z-50 left-0 top-full mt-1.5 bg-white rounded-xl border border-gray-200 shadow-xl py-1.5 w-44 animate-fade-in">
                {currencies.map(c => {
                  const selected = currency.label === c.label;
                  return (
                    <button key={c.label} type="button" onClick={() => { onCurrencyChange(c); setOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                        selected ? "bg-blue-50 text-blue-700 border-l-[3px] border-blue-500 pl-[11px]" : "text-gray-700 hover:bg-blue-50/50 hover:text-blue-600 border-l-[3px] border-transparent"
                      }`}>
                      <span className="text-[16px]">{c.flag}</span>
                      <span className="font-bold">{c.symbol}</span>
                      <span className="text-gray-400 font-normal">{c.label}</span>
                      {selected && <Check className="w-3.5 h-3.5 ml-auto text-blue-500" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="w-full text-[14px] text-gray-900 font-medium outline-none bg-transparent placeholder:text-gray-500 placeholder:font-normal" />
        </div>
      </fieldset>
      {error && <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{error}</p>}
    </div>
  );
};

export default AddProject;
