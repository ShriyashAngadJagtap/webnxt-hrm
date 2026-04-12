import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Download, RefreshCw, Minus, Check, X as XIcon, Star, Clock } from "lucide-react";

type DayStatus = "Present" | "Absent" | "Leave" | "Weekend" | "Holiday" | "Half Day" | "On Duty";

interface EmployeeRow {
  id: string;
  name: string;
  avatar: string;
  department: string;
  days: (DayStatus | null)[];
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"] as const;
const YEARS = ["2024","2025","2026"] as const;


const LEGEND: { status: DayStatus; color: string; label: string }[] = [
  { status: "Weekend",  color: "#6366f1", label: "Weekend" },
  { status: "Present",  color: "#22c55e", label: "Present" },
  { status: "Leave",    color: "#f59e0b", label: "Leave" },
  { status: "Holiday",  color: "#ef4444", label: "Holiday" },
];

const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();

const avatarColors = ["#6366f1","#ec4899","#f59e0b","#22c55e","#ef4444","#06b6d4","#8b5cf6","#14b8a6","#e11d48","#3b82f6"];
const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

const generateAttendance = (numDays: number, month: number, year: number): (DayStatus | null)[] => {
  const statuses: DayStatus[] = ["Present", "Present", "Present", "Present", "Leave", "Absent", "Holiday", "Half Day", "On Duty"];
  return Array.from({ length: numDays }, (_, i) => {
    const date = new Date(year, month, i + 1);
    const dow = date.getDay();
    if (dow === 0 || dow === 6) return "Weekend" as DayStatus;
    return statuses[Math.floor(Math.random() * statuses.length)];
  });
};

const EMPLOYEES_BASE = [
  { id: "EMP001", name: "Shriyash Jagtap", department: "Engineering", avatar: "" },
  { id: "EMP002", name: "Jitesh Naidu", department: "Engineering", avatar: "" },
  { id: "EMP003", name: "Shubham Jadhav", department: "Design", avatar: "" },
  { id: "EMP004", name: "Jacob Ryan", department: "Marketing", avatar: "" },
  { id: "EMP005", name: "Angelica Ramos", department: "HR", avatar: "" },
  { id: "EMP006", name: "Jeni Brincker", department: "Engineering", avatar: "" },
  { id: "EMP007", name: "Mark Hay", department: "Finance", avatar: "" },
  { id: "EMP008", name: "Cara Stevens", department: "Design", avatar: "" },
  { id: "EMP009", name: "John Doe", department: "Marketing", avatar: "" },
  { id: "EMP010", name: "Ashton Cox", department: "Engineering", avatar: "" },
  { id: "EMP011", name: "Sarah Parker", department: "HR", avatar: "" },
  { id: "EMP012", name: "Airi Satou", department: "Finance", avatar: "" },
  { id: "EMP013", name: "Michael Chan", department: "Engineering", avatar: "" },
];

const buildRows = (month: number, year: number): EmployeeRow[] => {
  const nd = daysInMonth(month, year);
  return EMPLOYEES_BASE.map(e => ({
    ...e,
    days: generateAttendance(nd, month, year),
  }));
};

/* ─── small dropdown ─── */
const MiniDropdown = ({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative w-56">
      <label className="absolute -top-2.5 left-3 px-1 bg-white text-[11px] font-semibold text-gray-500 z-10">{label}</label>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-800 bg-white hover:border-[hsl(var(--primary))] transition-all focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)]">
        {value}
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-100 z-50 max-h-48 overflow-auto py-1">
          {options.map(o => (
            <button key={o} onClick={() => { onChange(o); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-[hsl(var(--primary)/0.08)] transition-colors ${o === value ? "text-[hsl(var(--primary))] font-bold bg-[hsl(var(--primary)/0.04)]" : "text-gray-700"}`}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── status icon ─── */
const StatusIcon = ({ status, size = 18 }: { status: DayStatus | null; size?: number }) => {
  if (!status) return <span style={{ width: size, height: size }} />;

  const cfg: Record<DayStatus, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
    Weekend:   { icon: <Minus size={size * 0.55} strokeWidth={3} />, color: "#6b7280", bg: "transparent", border: "#9ca3af" },
    Present:   { icon: <Check size={size * 0.6} strokeWidth={3} />,  color: "#fff",    bg: "#22c55e",     border: "#22c55e" },
    Leave:     { icon: <XIcon size={size * 0.55} strokeWidth={3} />, color: "#fff",    bg: "#f97316",     border: "#f97316" },
    Absent:    { icon: <XIcon size={size * 0.55} strokeWidth={3} />, color: "#fff",    bg: "#ef4444",     border: "#ef4444" },
    Holiday:   { icon: <Star size={size * 0.6} strokeWidth={2.5} fill="#f59e0b" />, color: "#f59e0b", bg: "transparent", border: "transparent" },
    "Half Day": { icon: <Clock size={size * 0.55} strokeWidth={2.5} />, color: "#fff", bg: "#eab308",    border: "#eab308" },
    "On Duty":  { icon: <Check size={size * 0.6} strokeWidth={3} />,  color: "#fff",   bg: "#06b6d4",    border: "#06b6d4" },
  };

  const c = cfg[status];

  if (status === "Holiday") {
    return (
      <span title={status} className="flex items-center justify-center shrink-0 cursor-default transition-transform hover:scale-125"
        style={{ width: size, height: size, color: c.color }}>
        {c.icon}
      </span>
    );
  }

  return (
    <span title={status}
      className="rounded-full flex items-center justify-center shrink-0 cursor-default transition-transform hover:scale-125"
      style={{ width: size, height: size, backgroundColor: c.bg, border: `2px solid ${c.border}`, color: c.color }}>
      {c.icon}
    </span>
  );
};

const LegendIcon = ({ status }: { status: DayStatus }) => <StatusIcon status={status} size={16} />;

/* ─── main page ─── */
const AttendanceSheet = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear().toString());
  const [month, setMonth] = useState(MONTHS[now.getMonth()]);
  const [rows, setRows] = useState<EmployeeRow[]>([]);
  const [searched, setSearched] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  const handleSearch = () => {
    const mi = MONTHS.indexOf(month as typeof MONTHS[number]);
    setRows(buildRows(mi, parseInt(year)));
    setSearched(true);
  };

  useEffect(() => { handleSearch(); }, []);

  const mi = MONTHS.indexOf(month as typeof MONTHS[number]);
  const numDays = daysInMonth(mi, parseInt(year));
  const dayNums = Array.from({ length: numDays }, (_, i) => i + 1);

  const getSummary = (row: EmployeeRow) => {
    const c: Record<string, number> = {};
    row.days.forEach(d => { if (d) c[d] = (c[d] || 0) + 1; });
    return c;
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {/* Header / Filters */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Attendance Sheet</h2>
          <div className="flex items-end gap-4 flex-wrap">
            <MiniDropdown label="Select Year*" value={year} options={YEARS} onChange={setYear} />
            <MiniDropdown label="Select Month*" value={month} options={MONTHS} onChange={setMonth} />
            <button onClick={handleSearch}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[hsl(var(--primary))] hover:opacity-90 transition-all shadow-sm">
              <Search size={15} /> Search
            </button>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={handleSearch}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500" title="Refresh">
                <RefreshCw size={16} />
              </button>
              <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500" title="Download">
                <Download size={16} />
              </button>
            </div>
          </div>

          {/* Filtered info + Legend */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-400 font-medium">
              Filtered by: Year: {year} | Month: {month}
            </p>
            <div className="flex items-center gap-5">
              {LEGEND.map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <LegendIcon status={l.status} />
                  <span className="text-[12px] font-semibold text-gray-600">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        {searched && rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="sticky left-0 z-20 bg-gray-50 text-left px-4 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[180px] border-r border-gray-100">
                    Employee Name
                  </th>
                  {dayNums.map(d => {
                    const date = new Date(parseInt(year), mi, d);
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    return (
                      <th key={d}
                        className={`px-1 py-3 text-center text-xs font-bold min-w-[34px] ${isWeekend ? "text-indigo-500" : "text-gray-500"} ${hoveredCol === d ? "bg-[hsl(var(--primary)/0.06)]" : ""}`}
                        onMouseEnter={() => setHoveredCol(d)}
                        onMouseLeave={() => setHoveredCol(null)}>
                        {d}
                      </th>
                    );
                  })}
                  <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase min-w-[50px]">P</th>
                  <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase min-w-[50px]">A</th>
                  <th className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase min-w-[50px]">L</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => {
                  const summary = getSummary(row);
                  const isHR = hoveredRow === row.id;
                  return (
                    <tr key={row.id}
                      className={`border-b border-gray-50 transition-colors ${isHR ? "bg-[hsl(var(--primary)/0.03)]" : ri % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                      onMouseEnter={() => setHoveredRow(row.id)}
                      onMouseLeave={() => setHoveredRow(null)}>
                      {/* Employee name — sticky */}
                      <td className={`sticky left-0 z-10 px-4 py-2.5 border-r border-gray-100 ${isHR ? "bg-[hsl(var(--primary)/0.03)]" : ri % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm"
                            style={{ backgroundColor: avatarColors[ri % avatarColors.length] }}>
                            {getInitials(row.name)}
                          </span>
                          <span className="text-sm font-semibold text-gray-800 truncate">{row.name}</span>
                        </div>
                      </td>
                      {/* Day cells */}
                      {dayNums.map(d => (
                        <td key={d}
                          className={`px-1 py-2 text-center ${hoveredCol === d ? "bg-[hsl(var(--primary)/0.04)]" : ""}`}
                          onMouseEnter={() => setHoveredCol(d)}
                          onMouseLeave={() => setHoveredCol(null)}>
                          <div className="flex justify-center">
                            <StatusIcon status={row.days[d - 1] ?? null} />
                          </div>
                        </td>
                      ))}
                      {/* Summary columns */}
                      <td className="px-3 py-2 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-50 text-green-600 text-xs font-bold">
                          {(summary["Present"] || 0) + (summary["Half Day"] || 0) + (summary["On Duty"] || 0)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-50 text-red-500 text-xs font-bold">
                          {summary["Absent"] || 0}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-50 text-orange-500 text-xs font-bold">
                          {summary["Leave"] || 0}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty state */}
        {searched && rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Search size={40} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">No attendance data found for the selected period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceSheet;
