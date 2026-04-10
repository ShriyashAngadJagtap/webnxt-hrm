import { useState, useRef, useEffect } from "react";
import {
  Search, Filter, RefreshCw, Download, UserPlus, Edit3, Trash2,
  CalendarDays, ChevronLeft, ChevronRight, ChevronDown, X, User, Check,
} from "lucide-react";
import { PaginationDropdown } from "@/components/ui/StyledDropdown";

/* ═══════════════════════════════════════════
   Types & Data
   ═══════════════════════════════════════════ */

type Priority = "High" | "Medium" | "Low";
type Status = "Completed" | "Running" | "Pending";

interface Task {
  id: string;
  name: string;
  assignedTo: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  progress: number;
}

const initialTasks: Task[] = [
  { id: "T001", name: "Design Homepage", assignedTo: "Sarah Smith", priority: "High", status: "Completed", dueDate: "2024-01-15", progress: 100 },
  { id: "T002", name: "Develop API", assignedTo: "John Deo", priority: "Medium", status: "Running", dueDate: "2024-02-10", progress: 65 },
  { id: "T003", name: "Testing Phase", assignedTo: "Pankaj Patel", priority: "Low", status: "Pending", dueDate: "2024-08-01", progress: 0 },
  { id: "T004", name: "Client Review", assignedTo: "Pooja Sharma", priority: "High", status: "Running", dueDate: "2024-01-20", progress: 40 },
  { id: "T005", name: "Setup Database", assignedTo: "Jayesh Patel", priority: "High", status: "Completed", dueDate: "2024-01-05", progress: 100 },
  { id: "T006", name: "Fix Login Bugs", assignedTo: "Mohan Sharma", priority: "Medium", status: "Running", dueDate: "2024-01-25", progress: 55 },
  { id: "T007", name: "Product Documentation", assignedTo: "Emily Clark", priority: "Low", status: "Pending", dueDate: "2024-08-15", progress: 20 },
  { id: "T008", name: "CI/CD Pipeline", assignedTo: "Michael Ross", priority: "High", status: "Running", dueDate: "2024-02-05", progress: 70 },
  { id: "T009", name: "UI Refactoring", assignedTo: "Hardik Patel", priority: "Medium", status: "Pending", dueDate: "2024-02-28", progress: 30 },
  { id: "T010", name: "User Feedback Analysis", assignedTo: "Sarah Smith", priority: "Low", status: "Completed", dueDate: "2024-01-10", progress: 100 },
  { id: "T011", name: "Performance Optimization", assignedTo: "Vikram Singh", priority: "High", status: "Running", dueDate: "2024-03-01", progress: 45 },
  { id: "T012", name: "Security Audit", assignedTo: "Rahul Verma", priority: "High", status: "Pending", dueDate: "2024-03-15", progress: 10 },
];

const priorityConfig: Record<Priority, { dot: string; text: string }> = {
  High: { dot: "bg-red-500", text: "text-red-600" },
  Medium: { dot: "bg-amber-500", text: "text-amber-600" },
  Low: { dot: "bg-emerald-500", text: "text-emerald-600" },
};

const statusConfig: Record<Status, { bg: string; text: string }> = {
  Completed: { bg: "bg-emerald-100", text: "text-emerald-700" },
  Running: { bg: "bg-blue-100", text: "text-blue-700" },
  Pending: { bg: "bg-orange-100", text: "text-orange-700" },
};

const progressColor: Record<Status, string> = {
  Completed: "bg-emerald-500",
  Running: "bg-blue-500",
  Pending: "bg-orange-400",
};

const priorities: Priority[] = ["High", "Medium", "Low"];
const statuses: Status[] = ["Completed", "Running", "Pending"];

const avatarColors: Record<string, string> = {
  "Sarah Smith": "from-rose-400 to-pink-500",
  "John Deo": "from-blue-400 to-indigo-500",
  "Pankaj Patel": "from-amber-400 to-orange-500",
  "Pooja Sharma": "from-purple-400 to-violet-500",
  "Jayesh Patel": "from-emerald-400 to-green-500",
  "Mohan Sharma": "from-cyan-400 to-teal-500",
  "Emily Clark": "from-fuchsia-400 to-pink-500",
  "Michael Ross": "from-sky-400 to-blue-500",
  "Hardik Patel": "from-lime-400 to-emerald-500",
  "Vikram Singh": "from-red-400 to-rose-500",
  "Rahul Verma": "from-indigo-400 to-purple-500",
};

const getInitials = (name: string) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
const getAvatarColor = (name: string) => avatarColors[name] || "from-gray-400 to-gray-500";

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */

const ProjectTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Modal state
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Filtered & paginated
  const filtered = tasks.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.assignedTo.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const allSelected = paginated.length > 0 && paginated.every(t => selectedIds.has(t.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      const next = new Set(selectedIds);
      paginated.forEach(t => next.delete(t.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      paginated.forEach(t => next.add(t.id));
      setSelectedIds(next);
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const handleDelete = () => {
    if (deleteTask) {
      setTasks(prev => prev.filter(t => t.id !== deleteTask.id));
      setDeleteTask(null);
    }
  };

  const handleSaveEdit = (updated: Task) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    setEditTask(null);
  };

  const handleAddTask = (newTask: Omit<Task, "id">) => {
    const id = `T${String(tasks.length + 1).padStart(3, "0")}`;
    setTasks(prev => [...prev, { ...newTask, id }]);
    setAddOpen(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Project Tasks</h1>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-visible">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 min-w-[220px]">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search tasks..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent text-[13px] font-medium text-gray-900 placeholder:text-gray-400 outline-none flex-1" />
          </div>

          <div className="flex items-center gap-2">
            {/* Status Filter */}
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
                      <span className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${statusConfig[s].bg.replace("100", "500")}`} />{s}
                      </span>
                      {statusFilter === s && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => { setSearch(""); setStatusFilter("All"); setPage(1); }}
              className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:border-gray-300 transition-all">
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:border-gray-300 transition-all">
              <Download className="w-4 h-4 text-gray-600" />
            </button>
            <button onClick={() => setAddOpen(true)}
              className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all">
              <UserPlus className="w-4 h-4 text-blue-600" />
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
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Task Name</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Assigned To</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Priority</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider">Due Date</th>
                <th className="py-3 text-[12px] font-bold text-gray-600 uppercase tracking-wider min-w-[140px]">Progress</th>
                <th className="py-3 pr-5 text-[12px] font-bold text-gray-600 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((task, idx) => {
                const pc = priorityConfig[task.priority];
                const sc = statusConfig[task.status];
                const bar = progressColor[task.status];
                return (
                  <tr key={task.id}
                    className={`border-b border-gray-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"} hover:bg-blue-50/30`}>
                    <td className="pl-5 py-3.5">
                      <input type="checkbox" checked={selectedIds.has(task.id)} onChange={() => toggleSelect(task.id)}
                        className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer" />
                    </td>
                    <td className="py-3.5">
                      <span className="text-[13px] font-bold text-gray-900">{task.name}</span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(task.assignedTo)} flex items-center justify-center shadow-sm shrink-0`}>
                          <span className="text-[11px] font-bold text-white leading-none">{getInitials(task.assignedTo)}</span>
                        </div>
                        <span className="text-[13px] font-semibold text-gray-700">{task.assignedTo}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${pc.dot}`} />
                        <span className={`text-[12px] font-bold ${pc.text}`}>{task.priority}</span>
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${sc.bg} ${sc.text}`}>{task.status}</span>
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-gray-700">
                        <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                        {task.dueDate}
                      </span>
                    </td>
                    <td className="py-3.5 pr-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                          <div className={`h-2 rounded-full transition-all ${bar}`} style={{ width: `${task.progress}%` }} />
                        </div>
                        <span className="text-[11px] font-bold text-gray-600 w-8 text-right">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-5">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setEditTask({ ...task })}
                          className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors group">
                          <Edit3 className="w-4 h-4 text-blue-500 group-hover:text-blue-700" />
                        </button>
                        <button onClick={() => setDeleteTask(task)}
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
                  <td colSpan={8} className="text-center py-12 text-gray-400 text-[14px] font-medium">No tasks found.</td>
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

      {/* ── Edit Task Modal ── */}
      {editTask && (
        <TaskModal
          title={`Edit Task: ${editTask.name}`}
          task={editTask}
          onSave={(t) => handleSaveEdit(t as Task)}
          onClose={() => setEditTask(null)}
        />
      )}

      {/* ── Add Task Modal ── */}
      {addOpen && (
        <TaskModal
          title="Add New Task"
          onSave={(t) => handleAddTask(t)}
          onClose={() => setAddOpen(false)}
        />
      )}

      {/* ── Delete Confirmation ── */}
      {deleteTask && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setDeleteTask(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-[16px] font-bold text-gray-900 mb-2">Delete Task</h3>
            <p className="text-[13px] text-gray-600 mb-5">
              Are you sure you want to delete <span className="font-bold text-gray-900">"{deleteTask.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold transition-colors">
                Delete
              </button>
              <button onClick={() => setDeleteTask(null)}
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
   Task Modal (Edit / Add)
   ═══════════════════════════════════════════ */

interface TaskModalProps {
  title: string;
  task?: Task;
  onSave: (task: Omit<Task, "id"> & { id?: string }) => void;
  onClose: () => void;
}

const TaskModal = ({ title, task, onSave, onClose }: TaskModalProps) => {
  const [form, setForm] = useState({
    name: task?.name || "",
    assignedTo: task?.assignedTo || "",
    priority: task?.priority || "Medium" as Priority,
    status: task?.status || "Pending" as Status,
    dueDate: task?.dueDate || "",
    progress: task?.progress ?? 0,
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const validate = () => {
    const errs: Record<string, boolean> = {};
    if (!form.name.trim()) errs.name = true;
    if (!form.assignedTo.trim()) errs.assignedTo = true;
    if (!form.dueDate) errs.dueDate = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      ...(task ? { id: task.id } : {}),
      name: form.name,
      assignedTo: form.assignedTo,
      priority: form.priority as Priority,
      status: form.status as Status,
      dueDate: form.dueDate,
      progress: Number(form.progress),
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ModalField label="Task Name" required value={form.name} error={errors.name}
              onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Enter task name" />

            <ModalField label="Assigned To" required value={form.assignedTo} error={errors.assignedTo}
              onChange={v => setForm(f => ({ ...f, assignedTo: v }))} placeholder="Employee name"
              icon={<User className="w-4 h-4 text-gray-400" />} />

            <ModalSelect label="Priority" required value={form.priority}
              options={priorities} onChange={v => setForm(f => ({ ...f, priority: v as Priority }))} />

            <ModalSelect label="Status" required value={form.status}
              options={statuses} onChange={v => setForm(f => ({ ...f, status: v as Status }))} />

            <ModalField label="Due Date" required type="date" value={form.dueDate} error={errors.dueDate}
              onChange={v => setForm(f => ({ ...f, dueDate: v }))}
              icon={<CalendarDays className="w-4 h-4 text-gray-400" />} />

            <ModalField label="Progress (%)" required type="number" value={String(form.progress)}
              onChange={v => setForm(f => ({ ...f, progress: Math.min(100, Math.max(0, Number(v))) }))}
              placeholder="0 - 100" />
          </div>

          <div className="flex items-center gap-3 pt-2">
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
   Form Sub-components
   ═══════════════════════════════════════════ */

interface ModalFieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: boolean;
  icon?: React.ReactNode;
}

const ModalField = ({ label, required, value, onChange, placeholder, type = "text", error, icon }: ModalFieldProps) => (
  <fieldset className={`border-2 rounded-xl px-3.5 pt-1 pb-2.5 transition-all ${
    error ? "border-red-400 ring-2 ring-red-100" : "border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
  }`}>
    <legend className="text-[11px] font-semibold text-gray-700 px-1">{label}{required && <span className="text-red-500">*</span>}</legend>
    <div className="flex items-center gap-2">
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full text-[14px] font-semibold text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
      {icon && <span className="shrink-0">{icon}</span>}
    </div>
  </fieldset>
);

interface ModalSelectProps {
  label: string;
  required?: boolean;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

const ModalSelect = ({ label, required, value, options, onChange }: ModalSelectProps) => {
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
            <button key={o} type="button" onClick={(e) => { e.stopPropagation(); onChange(o); setOpen(false); }}
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

export default ProjectTasks;
