import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Clock, CalendarDays, TrendingUp, Users, Circle } from "lucide-react";

/* ═══════════════════════════════════════════
   Types & Data
   ═══════════════════════════════════════════ */

type PhaseStatus = "Completed" | "Running" | "Pending";

interface Phase {
  name: string;
  startMonth: number;
  duration: number;
  status: PhaseStatus;
  progress: number;
  color: string;
  colorLight: string;
  lead: string;
}

interface TimelineProject {
  id: string;
  name: string;
  phases: Phase[];
  startYear: number;
  totalMonths: number;
}

const projects: TimelineProject[] = [
  {
    id: "tp1",
    name: "WebNxt HRM Dashboard",
    startYear: 2024,
    totalMonths: 12,
    phases: [
      { name: "Project Planning", startMonth: 0, duration: 1.5, status: "Completed", progress: 100, color: "bg-emerald-500", colorLight: "bg-emerald-200", lead: "Sarah Smith" },
      { name: "Design Phase", startMonth: 1, duration: 2, status: "Completed", progress: 100, color: "bg-sky-500", colorLight: "bg-sky-200", lead: "Pankaj Patel" },
      { name: "Frontend Development", startMonth: 3, duration: 3, status: "Running", progress: 65, color: "bg-amber-500", colorLight: "bg-amber-200", lead: "John Deo" },
      { name: "Backend Implementation", startMonth: 4, duration: 4, status: "Running", progress: 40, color: "bg-purple-500", colorLight: "bg-purple-200", lead: "Vikram Singh" },
      { name: "Testing & QA", startMonth: 7, duration: 2.5, status: "Running", progress: 15, color: "bg-rose-500", colorLight: "bg-rose-200", lead: "Pooja Sharma" },
      { name: "Deployment & Launch", startMonth: 9.5, duration: 2.5, status: "Pending", progress: 0, color: "bg-indigo-500", colorLight: "bg-indigo-200", lead: "Rahul Verma" },
    ],
  },
  {
    id: "tp2",
    name: "E-Commerce Mobile App",
    startYear: 2024,
    totalMonths: 12,
    phases: [
      { name: "Requirements & Discovery", startMonth: 0, duration: 1, status: "Completed", progress: 100, color: "bg-emerald-500", colorLight: "bg-emerald-200", lead: "Neha Gupta" },
      { name: "Wireframes & Prototyping", startMonth: 1, duration: 1.5, status: "Completed", progress: 100, color: "bg-sky-500", colorLight: "bg-sky-200", lead: "Pankaj Patel" },
      { name: "Core Features Dev", startMonth: 2.5, duration: 3, status: "Running", progress: 55, color: "bg-amber-500", colorLight: "bg-amber-200", lead: "Amit Kumar" },
      { name: "Payment Integration", startMonth: 5, duration: 2, status: "Running", progress: 20, color: "bg-purple-500", colorLight: "bg-purple-200", lead: "Vikram Singh" },
      { name: "Beta Testing", startMonth: 7, duration: 2, status: "Pending", progress: 0, color: "bg-rose-500", colorLight: "bg-rose-200", lead: "Pooja Sharma" },
      { name: "App Store Launch", startMonth: 9, duration: 1.5, status: "Pending", progress: 0, color: "bg-indigo-500", colorLight: "bg-indigo-200", lead: "Sarah Smith" },
    ],
  },
  {
    id: "tp3",
    name: "Cloud Infrastructure Migration",
    startYear: 2024,
    totalMonths: 12,
    phases: [
      { name: "Infrastructure Audit", startMonth: 0, duration: 1.5, status: "Completed", progress: 100, color: "bg-emerald-500", colorLight: "bg-emerald-200", lead: "Rahul Verma" },
      { name: "Architecture Design", startMonth: 1.5, duration: 2, status: "Completed", progress: 100, color: "bg-sky-500", colorLight: "bg-sky-200", lead: "Anita Desai" },
      { name: "Database Migration", startMonth: 3, duration: 2.5, status: "Running", progress: 60, color: "bg-amber-500", colorLight: "bg-amber-200", lead: "Rahul Verma" },
      { name: "Server Migration", startMonth: 5, duration: 3, status: "Running", progress: 10, color: "bg-purple-500", colorLight: "bg-purple-200", lead: "Anita Desai" },
      { name: "CI/CD Pipeline Setup", startMonth: 7.5, duration: 2, status: "Pending", progress: 0, color: "bg-rose-500", colorLight: "bg-rose-200", lead: "Rahul Verma" },
      { name: "Go-Live & Monitoring", startMonth: 10, duration: 2, status: "Pending", progress: 0, color: "bg-indigo-500", colorLight: "bg-indigo-200", lead: "Anita Desai" },
    ],
  },
  {
    id: "tp4",
    name: "HR Analytics Dashboard",
    startYear: 2023,
    totalMonths: 8,
    phases: [
      { name: "Data Pipeline Setup", startMonth: 0, duration: 1.5, status: "Completed", progress: 100, color: "bg-emerald-500", colorLight: "bg-emerald-200", lead: "Priya Nair" },
      { name: "Dashboard Wireframes", startMonth: 1, duration: 1.5, status: "Completed", progress: 100, color: "bg-sky-500", colorLight: "bg-sky-200", lead: "Pankaj Patel" },
      { name: "Core Dashboard Build", startMonth: 2.5, duration: 2.5, status: "Completed", progress: 100, color: "bg-amber-500", colorLight: "bg-amber-200", lead: "John Deo" },
      { name: "ML Model Integration", startMonth: 4.5, duration: 2, status: "Completed", progress: 100, color: "bg-purple-500", colorLight: "bg-purple-200", lead: "Priya Nair" },
      { name: "Final QA & Deployment", startMonth: 6, duration: 2, status: "Completed", progress: 100, color: "bg-rose-500", colorLight: "bg-rose-200", lead: "Pooja Sharma" },
    ],
  },
  {
    id: "tp5",
    name: "Client Portal Redesign",
    startYear: 2024,
    totalMonths: 10,
    phases: [
      { name: "Stakeholder Interviews", startMonth: 0, duration: 1, status: "Completed", progress: 100, color: "bg-emerald-500", colorLight: "bg-emerald-200", lead: "Neha Gupta" },
      { name: "Design System Setup", startMonth: 1, duration: 2, status: "Running", progress: 70, color: "bg-sky-500", colorLight: "bg-sky-200", lead: "Pankaj Patel" },
      { name: "UI Development", startMonth: 3, duration: 3, status: "Pending", progress: 0, color: "bg-amber-500", colorLight: "bg-amber-200", lead: "John Deo" },
      { name: "Backend APIs", startMonth: 4, duration: 3, status: "Pending", progress: 0, color: "bg-purple-500", colorLight: "bg-purple-200", lead: "Vikram Singh" },
      { name: "Testing & Launch", startMonth: 7.5, duration: 2.5, status: "Pending", progress: 0, color: "bg-rose-500", colorLight: "bg-rose-200", lead: "Pooja Sharma" },
    ],
  },
];

const statusConfig: Record<PhaseStatus, { dot: string; badge: string; text: string }> = {
  Completed: { dot: "bg-emerald-500", badge: "bg-emerald-50 border-emerald-200 text-emerald-700", text: "text-emerald-600" },
  Running: { dot: "bg-blue-500", badge: "bg-blue-50 border-blue-200 text-blue-700", text: "text-blue-600" },
  Pending: { dot: "bg-gray-400", badge: "bg-gray-50 border-gray-200 text-gray-600", text: "text-gray-500" },
};

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */

const ProjectTimeline = () => {
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const project = projects.find(p => p.id === selectedId) || projects[0];
  const months = Array.from({ length: project.totalMonths }, (_, i) => {
    const mIdx = i % 12;
    const yr = project.startYear + Math.floor(i / 12);
    return `${monthLabels[mIdx]} '${String(yr).slice(2)}`;
  });

  const completedCount = project.phases.filter(p => p.status === "Completed").length;
  const runningCount = project.phases.filter(p => p.status === "Running").length;
  const pendingCount = project.phases.filter(p => p.status === "Pending").length;
  const overallProgress = project.phases.length > 0
    ? Math.round(project.phases.reduce((s, p) => s + p.progress, 0) / project.phases.length)
    : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Project Timeline</h1>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <CalendarDays className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-[15px] font-extrabold text-gray-900">Project Timeline</h2>
              <p className="text-[11px] text-gray-500 font-medium">Gantt chart view of project phases</p>
            </div>
          </div>

          {/* Project Selector */}
          <div ref={dropRef} className="relative">
            <fieldset className={`border-2 rounded-xl px-3.5 pt-1 pb-2 cursor-pointer transition-all min-w-[260px] ${
              dropdownOpen ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-300 hover:border-gray-400"
            }`} onClick={() => setDropdownOpen(!dropdownOpen)}>
              <legend className="text-[11px] font-semibold text-gray-700 px-1">Select Projects</legend>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[14px] font-semibold text-gray-900 truncate">{project.name}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </div>
            </fieldset>

            {dropdownOpen && (
              <div className="absolute z-50 right-0 top-full mt-1.5 bg-white rounded-xl border border-gray-300 shadow-2xl py-1.5 w-full animate-fade-in">
                {projects.map(p => {
                  const sel = p.id === selectedId;
                  return (
                    <button key={p.id} type="button" onClick={() => { setSelectedId(p.id); setDropdownOpen(false); setHoveredPhase(null); }}
                      className={`w-full text-left px-4 py-3 text-[13px] font-semibold transition-all ${
                        sel ? "bg-blue-50 text-blue-700" : "text-gray-800 hover:bg-gray-50"
                      }`}>
                      <div className="flex items-center justify-between">
                        <span className="truncate">{p.name}</span>
                        {sel && <Check className="w-4 h-4 text-blue-500 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap gap-6">
          <MiniStat icon={<TrendingUp className="w-4 h-4 text-blue-600" />} label="Overall" value={`${overallProgress}%`} />
          <MiniStat icon={<Circle className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" />} label="Completed" value={String(completedCount)} />
          <MiniStat icon={<Circle className="w-3.5 h-3.5 text-blue-500" fill="currentColor" />} label="Running" value={String(runningCount)} />
          <MiniStat icon={<Circle className="w-3.5 h-3.5 text-gray-400" fill="currentColor" />} label="Pending" value={String(pendingCount)} />
          <MiniStat icon={<Clock className="w-4 h-4 text-purple-500" />} label="Phases" value={String(project.phases.length)} />
        </div>

        {/* Gantt Chart */}
        <div className="px-6 py-6">
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Phase Rows */}
              <div className="space-y-3">
                {project.phases.map((phase, idx) => {
                  const leftPct = (phase.startMonth / project.totalMonths) * 100;
                  const widthPct = (phase.duration / project.totalMonths) * 100;
                  const isHovered = hoveredPhase === idx;
                  const sc = statusConfig[phase.status];

                  return (
                    <div key={phase.name} className="flex items-center gap-4 group">
                      {/* Label */}
                      <div className="w-44 shrink-0 text-right pr-2">
                        <p className={`text-[12px] font-bold transition-colors ${isHovered ? "text-gray-900" : "text-gray-600"}`}>{phase.name}</p>
                      </div>

                      {/* Bar Track */}
                      <div className="flex-1 relative h-10 bg-gray-50 rounded-lg border border-gray-100"
                        onMouseEnter={() => setHoveredPhase(idx)}
                        onMouseLeave={() => setHoveredPhase(null)}>

                        {/* Background Bar (full duration) */}
                        <div className={`absolute top-1 bottom-1 rounded-md transition-all duration-300 ${phase.colorLight} ${isHovered ? "opacity-100" : "opacity-60"}`}
                          style={{ left: `${leftPct}%`, width: `${widthPct}%` }} />

                        {/* Progress Bar (filled portion) */}
                        <div className={`absolute top-1 bottom-1 rounded-md transition-all duration-500 ${phase.color} ${isHovered ? "shadow-lg scale-y-110" : ""}`}
                          style={{ left: `${leftPct}%`, width: `${widthPct * (phase.progress / 100)}%`, minWidth: phase.progress > 0 ? "4px" : "0" }} />

                        {/* Progress Text on bar */}
                        {phase.progress > 0 && widthPct > 8 && (
                          <div className="absolute top-1 bottom-1 flex items-center justify-end pr-2 pointer-events-none"
                            style={{ left: `${leftPct}%`, width: `${widthPct}%` }}>
                            <span className={`text-[10px] font-bold ${phase.progress > 50 ? "text-white" : "text-gray-700"}`}>
                              {phase.progress}%
                            </span>
                          </div>
                        )}

                        {/* Tooltip */}
                        {isHovered && (
                          <div className="absolute z-40 bg-white rounded-xl border border-gray-200 shadow-xl px-4 py-3 pointer-events-none min-w-[180px]"
                            style={{
                              left: `${Math.min(leftPct + widthPct / 2, 80)}%`,
                              top: "-70px",
                              transform: "translateX(-50%)",
                            }}>
                            <p className="text-[13px] font-bold text-gray-900">{phase.name}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className={`text-[11px] font-semibold ${sc.text}`}>Status: {phase.status}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                <div className={`h-1.5 rounded-full ${phase.color}`} style={{ width: `${phase.progress}%` }} />
                              </div>
                              <span className="text-[11px] font-bold text-gray-700">{phase.progress}%</span>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">
                              <Users className="w-3 h-3 inline mr-1" />{phase.lead}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Month Axis */}
              <div className="flex items-center gap-4 mt-4">
                <div className="w-44 shrink-0" />
                <div className="flex-1 relative">
                  <div className="flex">
                    {months.map((m, i) => (
                      <div key={i} className="flex-1 text-center">
                        <div className="h-3 border-l border-gray-200 mx-auto w-0" />
                        <p className="text-[10px] font-semibold text-gray-500 mt-1">{m}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Details Cards */}
        <div className="px-6 pb-6">
          <h3 className="text-[13px] font-bold text-gray-900 mb-3 uppercase tracking-wider">Phase Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {project.phases.map((phase, idx) => {
              const sc = statusConfig[phase.status];
              return (
                <div key={phase.name}
                  className={`p-4 rounded-xl border-2 transition-all cursor-default ${
                    hoveredPhase === idx ? "border-blue-400 bg-blue-50/30 shadow-md" : "border-gray-100 bg-gray-50/50 hover:border-gray-200"
                  }`}
                  onMouseEnter={() => setHoveredPhase(idx)}
                  onMouseLeave={() => setHoveredPhase(null)}>
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${phase.color}`} />
                      <p className="text-[13px] font-bold text-gray-900">{phase.name}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${sc.badge}`}>{phase.status}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all ${phase.color}`} style={{ width: `${phase.progress}%` }} />
                    </div>
                    <span className="text-[12px] font-bold text-gray-700">{phase.progress}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
                    <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" />{phase.lead}</span>
                    <span>{phase.duration} mo</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-center gap-5">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Legend:</span>
          {(["Completed", "Running", "Pending"] as PhaseStatus[]).map(s => (
            <span key={s} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-gray-700">
              <span className={`w-3 h-3 rounded-full ${statusConfig[s].dot}`} />
              {s}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-500 ml-auto">
            <span className="w-6 h-3 rounded bg-gray-300 opacity-50" /> Light = Total Duration
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-500">
            <span className="w-6 h-3 rounded bg-gray-500" /> Dark = Progress
          </span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Mini Stat
   ═══════════════════════════════════════════ */

const MiniStat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-2">
    {icon}
    <div>
      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-[16px] font-extrabold text-gray-900 leading-tight">{value}</p>
    </div>
  </div>
);

export default ProjectTimeline;
