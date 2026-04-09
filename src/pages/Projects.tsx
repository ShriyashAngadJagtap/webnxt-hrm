import { useState, useRef, useEffect, DragEvent } from "react";
import {
  CheckCircle2, Calendar, ArrowUp, ArrowDown, Diamond, MoreVertical,
  Pencil, Trash2, X, User, CalendarDays, CheckSquare, Type, Percent,
  MessageCircle, Bug, Clock, Layers, Plus
} from "lucide-react";

type ProjectStatus = "New Projects" | "Running" | "On Hold" | "Finished";
type Priority = "Low" | "Medium" | "High";
type Category = "Android" | "iPhone" | "Website" | "Testing";

interface Project {
  id: string;
  name: string;
  openTasks: number;
  category: Category;
  description: string;
  created: string;
  teamLeader: string;
  priority: Priority;
  deadline: string;
  comments: number;
  bugs: number;
  teamExtra: number;
  progress: number;
  status: ProjectStatus;
}

interface DropIndicator {
  targetId: string;
  position: "above" | "below";
}

const initialProjects: Project[] = [
  { id: "1", name: "Food Delivery App", openTasks: 2, category: "Android", description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.", created: "2019-04-16", teamLeader: "Jens Brincker", priority: "Low", deadline: "2021-01-17", comments: 25, bugs: 11, teamExtra: 4, progress: 47, status: "New Projects" },
  { id: "2", name: "Chat Application", openTasks: 2, category: "iPhone", description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.", created: "2020-07-31", teamLeader: "Airi Satou", priority: "High", deadline: "2020-08-10", comments: 7, bugs: 4, teamExtra: 4, progress: 32, status: "New Projects" },
  { id: "3", name: "HR Management System", openTasks: 8, category: "Website", description: "A comprehensive HR management platform with employee tracking, payroll, and performance modules.", created: "2021-03-05", teamLeader: "Shriyash Jagtap", priority: "Medium", deadline: "2023-12-15", comments: 18, bugs: 6, teamExtra: 4, progress: 63, status: "New Projects" },
  { id: "4", name: "Shopping Application", openTasks: 22, category: "Android", description: "There are many variations of passages of Lorem Ipsum available, but suffered alteration in some form, by injected humour.", created: "2021-08-25", teamLeader: "Jay Soni", priority: "High", deadline: "2024-03-13", comments: 14, bugs: 10, teamExtra: 4, progress: 55, status: "Running" },
  { id: "5", name: "Construction Website", openTasks: 15, category: "Website", description: "Pellentesque habitant morbi tristique senectus et netus et malesuada but suffered alteration in some form fames ac turpis egestas.", created: "2020-07-31", teamLeader: "Sarah Smith", priority: "Medium", deadline: "2022-04-22", comments: 41, bugs: 11, teamExtra: 4, progress: 48, status: "Running" },
  { id: "6", name: "J&K Sons Website", openTasks: 9, category: "Testing", description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.", created: "2020-09-12", teamLeader: "Mark Hay", priority: "Low", deadline: "2022-02-18", comments: 12, bugs: 8, teamExtra: 4, progress: 70, status: "On Hold" },
  { id: "7", name: "Ecommerce Website", openTasks: 44, category: "Website", description: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below generators on the Internet tend for those interested.", created: "2018-05-19", teamLeader: "Mark Hay", priority: "High", deadline: "2021-11-26", comments: 5, bugs: 2, teamExtra: 4, progress: 88, status: "On Hold" },
  { id: "8", name: "Video Streaming App", openTasks: 27, category: "iPhone", description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.", created: "2019-06-22", teamLeader: "Airi Satou", priority: "High", deadline: "2023-04-13", comments: 7, bugs: 4, teamExtra: 4, progress: 100, status: "Finished" },
];

const allColumns: ProjectStatus[] = ["New Projects", "Running", "On Hold", "Finished"];
const allPriorities: Priority[] = ["Low", "Medium", "High"];
const allCategories: Category[] = ["Android", "iPhone", "Website", "Testing"];

const columnConfig: Record<ProjectStatus, { badge: string; accent: string; progressBar: string; headerBg: string; dropLine: string }> = {
  "New Projects": { badge: "bg-blue-600 text-white", accent: "border-l-blue-500", progressBar: "from-blue-400 to-blue-600", headerBg: "bg-gradient-to-r from-blue-50 to-white", dropLine: "border-blue-400" },
  Running: { badge: "bg-emerald-600 text-white", accent: "border-l-emerald-500", progressBar: "from-emerald-400 to-emerald-600", headerBg: "bg-gradient-to-r from-emerald-50 to-white", dropLine: "border-emerald-400" },
  "On Hold": { badge: "bg-amber-500 text-white", accent: "border-l-amber-500", progressBar: "from-amber-400 to-amber-600", headerBg: "bg-gradient-to-r from-amber-50 to-white", dropLine: "border-amber-400" },
  Finished: { badge: "bg-gray-700 text-white", accent: "border-l-gray-500", progressBar: "from-gray-400 to-gray-600", headerBg: "bg-gradient-to-r from-gray-50 to-white", dropLine: "border-gray-400" },
};

const categoryColors: Record<Category, { bg: string; text: string; dot: string }> = {
  Android: { bg: "bg-green-50 border border-green-200", text: "text-green-600", dot: "bg-green-500" },
  iPhone: { bg: "bg-red-50 border border-red-200", text: "text-red-500", dot: "bg-red-500" },
  Website: { bg: "bg-indigo-50 border border-indigo-200", text: "text-indigo-600", dot: "bg-indigo-500" },
  Testing: { bg: "bg-sky-50 border border-sky-200", text: "text-sky-600", dot: "bg-sky-500" },
};

const priorityConfig: Record<Priority, { color: string; bg: string; icon: typeof ArrowUp; label: string }> = {
  Low: { color: "text-green-600", bg: "bg-green-50 border border-green-200", icon: ArrowDown, label: "Low" },
  Medium: { color: "text-amber-600", bg: "bg-amber-50 border border-amber-200", icon: Diamond, label: "Medium" },
  High: { color: "text-red-600", bg: "bg-red-50 border border-red-200", icon: ArrowUp, label: "High" },
};

const avatarColors = ["bg-amber-500", "bg-blue-500", "bg-pink-500"];
const avatarInitials = ["JB", "AS", "MH"];

const formatDateDisplay = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getProgressColor = (p: number) => {
  if (p >= 80) return "from-emerald-400 to-emerald-500";
  if (p >= 50) return "from-blue-400 to-blue-500";
  if (p >= 30) return "from-amber-400 to-amber-500";
  return "from-red-400 to-red-500";
};

/* ───────────── Main Component ───────────── */

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<ProjectStatus | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpenId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Drag handlers ── */
  const handleDragStart = (e: DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverCol(null);
    setDropIndicator(null);
  };

  const handleColumnDragOver = (e: DragEvent, col: ProjectStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(col);
  };

  const handleColumnDragLeave = () => {
    setDragOverCol(null);
    setDropIndicator(null);
  };

  const handleCardDragOver = (e: DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (targetId === draggedId) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position: "above" | "below" = e.clientY < midY ? "above" : "below";
    setDropIndicator({ targetId, position });
  };

  const handleColumnDrop = (e: DragEvent, targetStatus: ProjectStatus) => {
    e.preventDefault();
    if (!draggedId) return;

    setProjects(prev => {
      const dragged = prev.find(p => p.id === draggedId);
      if (!dragged) return prev;

      const without = prev.filter(p => p.id !== draggedId);
      const updated = { ...dragged, status: targetStatus };

      if (dropIndicator && dropIndicator.targetId !== draggedId) {
        const targetIdx = without.findIndex(p => p.id === dropIndicator.targetId);
        if (targetIdx !== -1) {
          const insertAt = dropIndicator.position === "above" ? targetIdx : targetIdx + 1;
          const result = [...without];
          result.splice(insertAt, 0, updated);
          return result;
        }
      }

      return [...without, updated];
    });

    setDraggedId(null);
    setDragOverCol(null);
    setDropIndicator(null);
  };

  /* ── CRUD ── */
  const handleDelete = (id: string) => { setProjects(prev => prev.filter(p => p.id !== id)); setMenuOpenId(null); };
  const handleEditSave = (updated: Project) => { setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p))); setEditProject(null); };
  const handleAddSave = (newProject: Project) => {
    const id = String(Date.now());
    setProjects(prev => [...prev, { ...newProject, id }]);
    setAddModalOpen(false);
  };

  /* ── Helpers ── */
  const getColumnProjects = (status: ProjectStatus) => projects.filter(p => p.status === status);
  const getColumnProgress = (status: ProjectStatus) => {
    const cp = getColumnProjects(status);
    return cp.length === 0 ? 0 : Math.round(cp.reduce((a, p) => a + p.progress, 0) / cp.length);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">All Projects</h1>
        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-[13px] font-semibold rounded-lg shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {allColumns.map(col => {
          const conf = columnConfig[col];
          const colProjects = getColumnProjects(col);
          const colProgress = getColumnProgress(col);
          const isDropTarget = dragOverCol === col;

          return (
            <div
              key={col}
              className={`rounded-xl border shadow-sm transition-all duration-300 min-h-[200px] overflow-hidden ${
                isDropTarget ? "border-orange-300 ring-2 ring-orange-100 scale-[1.01]" : "border-gray-100 bg-white"
              }`}
              onDragOver={(e) => handleColumnDragOver(e, col)}
              onDragLeave={handleColumnDragLeave}
              onDrop={(e) => handleColumnDrop(e, col)}
            >
              {/* Column Header */}
              <div className={`p-4 pb-3 ${conf.headerBg}`}>
                <div className="flex items-center gap-2.5 mb-3">
                  <h2 className="text-[15px] font-bold text-gray-800">{col}</h2>
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${conf.badge}`}>
                    {colProjects.length} project{colProjects.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-gray-400 font-medium">Overall Progress</span>
                  <span className="text-[12px] font-bold text-gray-700">{colProgress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${conf.progressBar} rounded-full transition-all duration-700 ease-out`} style={{ width: `${colProgress}%` }} />
                </div>
              </div>

              {/* Cards */}
              <div className="px-3 pb-3 pt-2 space-y-0 max-h-[calc(100vh-280px)] overflow-y-auto bg-gray-50/40">
                {colProjects.map(project => {
                  const showAbove = dropIndicator?.targetId === project.id && dropIndicator.position === "above" && draggedId !== project.id;
                  const showBelow = dropIndicator?.targetId === project.id && dropIndicator.position === "below" && draggedId !== project.id;

                  return (
                    <div key={project.id} className="py-1.5">
                      {/* Drop indicator - above */}
                      <div className={`mx-1 mb-1.5 border-t-2 border-dashed rounded transition-all duration-200 ${showAbove ? `${conf.dropLine} opacity-100` : "border-transparent opacity-0"}`} />

                      <div onDragOver={(e) => handleCardDragOver(e, project.id)}>
                        <ProjectCard
                          project={project}
                          colStatus={col}
                          isDragging={draggedId === project.id}
                          menuOpen={menuOpenId === project.id}
                          menuRef={menuOpenId === project.id ? menuRef : undefined}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onMenuToggle={() => setMenuOpenId(menuOpenId === project.id ? null : project.id)}
                          onEdit={() => { setEditProject({ ...project }); setMenuOpenId(null); }}
                          onDelete={() => handleDelete(project.id)}
                        />
                      </div>

                      {/* Drop indicator - below */}
                      <div className={`mx-1 mt-1.5 border-t-2 border-dashed rounded transition-all duration-200 ${showBelow ? `${conf.dropLine} opacity-100` : "border-transparent opacity-0"}`} />
                    </div>
                  );
                })}
                {colProjects.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-300">
                    <Layers className="w-8 h-8 mb-2 opacity-40" />
                    <p className="text-[13px]">Drop a project here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {editProject && <EditProjectModal project={editProject} onSave={handleEditSave} onCancel={() => setEditProject(null)} />}
      {addModalOpen && <AddProjectModal onSave={handleAddSave} onCancel={() => setAddModalOpen(false)} />}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Project Card
   ═══════════════════════════════════════════ */

interface CardProps {
  project: Project;
  colStatus: ProjectStatus;
  isDragging: boolean;
  menuOpen: boolean;
  menuRef?: React.RefObject<HTMLDivElement>;
  onDragStart: (e: DragEvent, id: string) => void;
  onDragEnd: () => void;
  onMenuToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ProjectCard = ({ project, colStatus, isDragging, menuOpen, menuRef, onDragStart, onDragEnd, onMenuToggle, onEdit, onDelete }: CardProps) => {
  const prioConf = priorityConfig[project.priority];
  const PrioIcon = prioConf.icon;
  const catConf = categoryColors[project.category];
  const accent = columnConfig[colStatus].accent;
  const progressGrad = getProgressColor(project.progress);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, project.id)}
      onDragEnd={onDragEnd}
      className={`group relative bg-white border-l-[3px] ${accent} border border-gray-100 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        isDragging ? "opacity-30 scale-95 rotate-1" : "opacity-100"
      }`}
    >
      {/* 3-dot menu */}
      <div className="absolute top-3 right-3 z-10" ref={menuOpen ? (menuRef as React.RefObject<HTMLDivElement>) : undefined}>
        <button
          onClick={(e) => { e.stopPropagation(); onMenuToggle(); }}
          className="p-1.5 rounded-lg text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-8 z-50 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 w-44 animate-fade-in">
            <button onClick={onEdit} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Pencil className="w-3.5 h-3.5" /> Edit Project
            </button>
            <div className="mx-3 border-t border-gray-100" />
            <button onClick={onDelete} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Delete Project
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Title row */}
        <div className="flex items-start gap-2.5 mb-1.5 pr-7">
          <div className={`w-8 h-8 rounded-lg ${catConf.bg} flex items-center justify-center shrink-0`}>
            <CheckCircle2 className={`w-4 h-4 ${catConf.text}`} />
          </div>
          <div className="min-w-0">
            <h3 className="text-[14px] font-bold text-gray-800 leading-snug truncate">{project.name}</h3>
            <p className="text-[11px] text-gray-500 font-medium">{project.openTasks} open tasks</p>
          </div>
        </div>

        {/* Category + Priority */}
        <div className="flex items-center gap-2 mt-2.5 mb-3">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${catConf.bg} ${catConf.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${catConf.dot}`} />
            {project.category}
          </span>
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full ${prioConf.bg} ${prioConf.color}`}>
            <PrioIcon className="w-3 h-3" />
            {prioConf.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-[12px] text-gray-600 leading-relaxed mb-3.5 line-clamp-2">{project.description}</p>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-[12px] mb-3.5 bg-gray-50/80 rounded-lg p-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-600 font-medium">Created</span>
          </div>
          <span className="text-gray-800 font-semibold text-right">{formatDateDisplay(project.created)}</span>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-600 font-medium">Leader</span>
          </div>
          <span className="text-gray-800 font-bold text-right truncate">{project.teamLeader}</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-600 font-medium">Deadline</span>
          </div>
          <span className="text-gray-800 font-semibold text-right">{formatDateDisplay(project.deadline)}</span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-3.5">
          <div className="flex items-center gap-1.5 bg-blue-50 rounded-lg px-2.5 py-1.5">
            <MessageCircle className="w-3 h-3 text-blue-500" />
            <span className="text-[11px] font-semibold text-blue-600">{project.comments}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-red-50 rounded-lg px-2.5 py-1.5">
            <Bug className="w-3 h-3 text-red-500" />
            <span className="text-[11px] font-semibold text-red-600">{project.bugs}</span>
          </div>
          <div className="ml-auto flex -space-x-2">
            {avatarColors.map((clr, i) => (
              <div key={i} className={`w-6 h-6 rounded-full ${clr} border-2 border-white flex items-center justify-center text-white text-[8px] font-bold shadow-sm`}>
                {avatarInitials[i]}
              </div>
            ))}
            <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[8px] font-bold shadow-sm">
              +{project.teamExtra}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] text-gray-600 font-medium">Progress</span>
            <span className={`text-[12px] font-bold ${
              project.progress >= 80 ? "text-emerald-600" : project.progress >= 50 ? "text-blue-600" : project.progress >= 30 ? "text-amber-600" : "text-red-500"
            }`}>{project.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${progressGrad} rounded-full transition-all duration-700 ease-out`} style={{ width: `${project.progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Edit Project Modal
   ═══════════════════════════════════════════ */

interface EditModalProps {
  project: Project;
  onSave: (p: Project) => void;
  onCancel: () => void;
}

const EditProjectModal = ({ project, onSave, onCancel }: EditModalProps) => {
  const [form, setForm] = useState<Project>({ ...project });
  const set = (key: keyof Project, val: string | number) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[820px] mx-4 animate-fade-in overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
          <h2 className="text-white font-semibold text-[15px]">Edit project</h2>
          <button onClick={onCancel} className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FieldBox label="Project Title*" icon={<Type className="w-4 h-4 text-gray-300" />}>
              <input value={form.name} onChange={e => set("name", e.target.value)} className="w-full text-[13px] text-gray-700 outline-none bg-transparent" />
            </FieldBox>
            <FieldBox label="Status*">
              <select value={form.status} onChange={e => set("status", e.target.value as ProjectStatus)} className="w-full text-[13px] text-gray-700 outline-none bg-transparent appearance-none cursor-pointer">
                {allColumns.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FieldBox>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldBox label="Team Leader" icon={<User className="w-4 h-4 text-gray-300" />}>
              <input value={form.teamLeader} onChange={e => set("teamLeader", e.target.value)} className="w-full text-[13px] text-gray-700 outline-none bg-transparent" />
            </FieldBox>
            <FieldBox label="Deadline Of Project*" icon={<CalendarDays className="w-4 h-4 text-gray-300" />}>
              <input type="date" value={form.deadline} onChange={e => set("deadline", e.target.value)} className="w-full text-[13px] text-gray-700 outline-none bg-transparent" />
            </FieldBox>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldBox label="Priority*">
              <select value={form.priority} onChange={e => set("priority", e.target.value as Priority)} className="w-full text-[13px] text-gray-700 outline-none bg-transparent appearance-none cursor-pointer">
                {allPriorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </FieldBox>
            <FieldBox label="Open Task*" icon={<CheckSquare className="w-4 h-4 text-gray-300" />}>
              <input type="number" value={form.openTasks} onChange={e => set("openTasks", Number(e.target.value))} className="w-full text-[13px] text-gray-700 outline-none bg-transparent" />
            </FieldBox>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldBox label="Type*">
              <select value={form.category} onChange={e => set("category", e.target.value as Category)} className="w-full text-[13px] text-gray-700 outline-none bg-transparent appearance-none cursor-pointer">
                {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FieldBox>
            <FieldBox label="Created Date*" icon={<CalendarDays className="w-4 h-4 text-gray-300" />}>
              <input type="date" value={form.created} onChange={e => set("created", e.target.value)} className="w-full text-[13px] text-gray-700 outline-none bg-transparent" />
            </FieldBox>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldBox label="Project Progress" icon={<Percent className="w-4 h-4 text-gray-300" />}>
              <input type="number" min={0} max={100} value={form.progress} onChange={e => set("progress", Number(e.target.value))} className="w-full text-[13px] text-gray-700 outline-none bg-transparent" />
            </FieldBox>
          </div>
          <fieldset className="border border-gray-200 rounded-lg px-3 pt-1 pb-2 hover:border-blue-300 transition-colors focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50">
            <legend className="text-[11px] text-gray-400 px-1">Descriptions Of The Project*</legend>
            <textarea rows={3} value={form.description} onChange={e => set("description", e.target.value)} className="w-full text-[13px] text-gray-700 outline-none bg-transparent resize-y" />
          </fieldset>
        </div>
        <div className="px-6 pb-5 flex items-center gap-3">
          <button onClick={() => onSave(form)} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-[13px] font-medium rounded-full transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300">Save</button>
          <button onClick={onCancel} className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-[13px] font-medium rounded-full transition-all shadow-md shadow-red-200">Cancel</button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Add Project Modal
   ═══════════════════════════════════════════ */

const emptyProject: Project = {
  id: "", name: "", openTasks: 0, category: "Android",
  description: "", created: new Date().toISOString().split("T")[0],
  teamLeader: "", priority: "Low", deadline: "",
  comments: 0, bugs: 0, teamExtra: 4, progress: 0, status: "New Projects",
};

const AddProjectModal = ({ onSave, onCancel }: { onSave: (p: Project) => void; onCancel: () => void }) => {
  const [form, setForm] = useState<Project>({ ...emptyProject });
  const set = (key: keyof Project, val: string | number) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[820px] mx-4 animate-fade-in overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600">
          <h2 className="text-white font-semibold text-[15px]">Add New Project</h2>
          <button onClick={onCancel} className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FieldBox label="Project Title*" icon={<Type className="w-4 h-4 text-gray-300" />}>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Enter project name" className="w-full text-[13px] text-gray-700 outline-none bg-transparent placeholder:text-gray-300" />
            </FieldBox>
            <FieldBox label="Status*">
              <select value={form.status} onChange={e => set("status", e.target.value as ProjectStatus)} className="w-full text-[13px] text-gray-700 outline-none bg-transparent appearance-none cursor-pointer">
                {allColumns.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FieldBox>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldBox label="Team Leader*" icon={<User className="w-4 h-4 text-gray-300" />}>
              <input value={form.teamLeader} onChange={e => set("teamLeader", e.target.value)} placeholder="Enter team leader" className="w-full text-[13px] text-gray-700 outline-none bg-transparent placeholder:text-gray-300" />
            </FieldBox>
            <FieldBox label="Deadline Of Project*" icon={<CalendarDays className="w-4 h-4 text-gray-300" />}>
              <input type="date" value={form.deadline} onChange={e => set("deadline", e.target.value)} className="w-full text-[13px] text-gray-700 outline-none bg-transparent" />
            </FieldBox>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldBox label="Priority*">
              <select value={form.priority} onChange={e => set("priority", e.target.value as Priority)} className="w-full text-[13px] text-gray-700 outline-none bg-transparent appearance-none cursor-pointer">
                {allPriorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </FieldBox>
            <FieldBox label="Open Task*" icon={<CheckSquare className="w-4 h-4 text-gray-300" />}>
              <input type="number" value={form.openTasks} onChange={e => set("openTasks", Number(e.target.value))} className="w-full text-[13px] text-gray-700 outline-none bg-transparent" />
            </FieldBox>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldBox label="Type*">
              <select value={form.category} onChange={e => set("category", e.target.value as Category)} className="w-full text-[13px] text-gray-700 outline-none bg-transparent appearance-none cursor-pointer">
                {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FieldBox>
            <FieldBox label="Created Date*" icon={<CalendarDays className="w-4 h-4 text-gray-300" />}>
              <input type="date" value={form.created} onChange={e => set("created", e.target.value)} className="w-full text-[13px] text-gray-700 outline-none bg-transparent" />
            </FieldBox>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldBox label="Project Progress" icon={<Percent className="w-4 h-4 text-gray-300" />}>
              <input type="number" min={0} max={100} value={form.progress} onChange={e => set("progress", Number(e.target.value))} className="w-full text-[13px] text-gray-700 outline-none bg-transparent" />
            </FieldBox>
          </div>
          <fieldset className="border border-gray-200 rounded-lg px-3 pt-1 pb-2 hover:border-orange-300 transition-colors focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-50">
            <legend className="text-[11px] text-gray-400 px-1">Descriptions Of The Project*</legend>
            <textarea rows={3} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Enter project description..." className="w-full text-[13px] text-gray-700 outline-none bg-transparent resize-y placeholder:text-gray-300" />
          </fieldset>
        </div>
        <div className="px-6 pb-5 flex items-center gap-3">
          <button onClick={() => { if (form.name.trim()) onSave(form); }} className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-[13px] font-medium rounded-full transition-all shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300">Add Project</button>
          <button onClick={onCancel} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[13px] font-medium rounded-full transition-all">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const FieldBox = ({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) => (
  <fieldset className="border border-gray-200 rounded-lg px-3 pt-1 pb-2 flex items-center gap-2 hover:border-blue-300 transition-colors focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50">
    <legend className="text-[11px] text-gray-400 px-1">{label}</legend>
    <div className="flex-1">{children}</div>
    {icon && <div className="shrink-0">{icon}</div>}
  </fieldset>
);

export default Projects;
