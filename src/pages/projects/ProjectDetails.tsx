import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, Users, Clock, CheckCircle2, Circle, CircleDot,
  Building2, User, Edit3, Share2, CheckSquare, Wallet,
  AlertTriangle, ArrowRight, Download, MessageSquare, Upload,
  Tag, CalendarDays, TrendingUp, ChevronDown, Check
} from "lucide-react";

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

type TabId = "overview" | "team" | "activity";
type ProjectStatus = "In Progress" | "Completed" | "On Hold" | "Planning";

interface Milestone {
  title: string;
  date: string;
  status: "completed" | "in-progress" | "pending";
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  color: string;
}

interface ActivityItem {
  user: string;
  avatar: string;
  color: string;
  action: string;
  target: string;
  time: string;
  icon: "upload" | "check" | "comment";
}

interface ProjectFile {
  name: string;
  size: string;
}

interface ClientInfo {
  company: string;
  code: string;
  contact: string;
  country: string;
  industry: string;
}

interface ProjectData {
  id: string;
  title: string;
  status: ProjectStatus;
  department: string;
  lead: string;
  progress: number;
  tasksCompleted: number;
  tasksTotal: number;
  budgetINR: string;
  budgetUSD: string;
  budgetNote: string;
  activeRisks: number;
  description: string;
  startDate: string;
  endDate: string;
  tags: string[];
  files: ProjectFile[];
  client: ClientInfo;
  milestones: Milestone[];
  team: TeamMember[];
  activities: ActivityItem[];
  gradient: string;
}

/* ═══════════════════════════════════════════
   Project Data (5 projects)
   ═══════════════════════════════════════════ */

const statusBadge: Record<ProjectStatus, { bg: string; text: string; dot: string; cardBorder: string }> = {
  "In Progress": { bg: "bg-emerald-400/20 border-emerald-400/40", text: "text-emerald-300", dot: "bg-emerald-500", cardBorder: "border-emerald-400" },
  Completed: { bg: "bg-blue-400/20 border-blue-400/40", text: "text-blue-300", dot: "bg-blue-500", cardBorder: "border-blue-400" },
  "On Hold": { bg: "bg-amber-400/20 border-amber-400/40", text: "text-amber-300", dot: "bg-amber-500", cardBorder: "border-amber-400" },
  Planning: { bg: "bg-purple-400/20 border-purple-400/40", text: "text-purple-300", dot: "bg-purple-500", cardBorder: "border-purple-400" },
};

const projects: ProjectData[] = [
  {
    id: "p1",
    title: "WebNxt HRM Dashboard Redesign",
    status: "In Progress",
    department: "Development",
    lead: "Sarah Smith",
    progress: 75,
    tasksCompleted: 36,
    tasksTotal: 48,
    budgetINR: "₹16,60,000",
    budgetUSD: "$20,000",
    budgetNote: "Above Est. ₹1,66,000",
    activeRisks: 2,
    description: "This project involves a complete overhaul of the existing WebNxt HRM Dashboard. The goal is to modernize the UI/UX, improve performance, and add advanced data visualization features. We are currently in the implementation phase of the core modules.",
    startDate: "2023-10-15",
    endDate: "2024-03-20",
    tags: ["React", "TypeScript", "Tailwind", "Node.js", "Material Design"],
    files: [{ name: "Project_Scope.pdf", size: "2.4 MB" }, { name: "Requirements.docx", size: "1.1 MB" }],
    client: { company: "NexGen Technologies", code: "TECH-NXG-2507", contact: "John Doe (CTO)", country: "United States", industry: "Technology" },
    milestones: [
      { title: "Project Kickoff", date: "Oct 15, 2023", status: "completed" },
      { title: "Design Finalization", date: "Nov 10, 2023", status: "completed" },
      { title: "Backend API Integration", date: "Dec 20, 2023", status: "completed" },
      { title: "Frontend Core Modules", date: "Jan 25, 2024", status: "in-progress" },
      { title: "UAT Testing", date: "Feb 28, 2024", status: "pending" },
    ],
    team: [
      { name: "Sarah Smith", role: "Project Manager", avatar: "SS", color: "bg-violet-500" },
      { name: "John Deo", role: "Full Stack Developer", avatar: "JD", color: "bg-blue-500" },
      { name: "Pankaj Patel", role: "UI/UX Designer", avatar: "PP", color: "bg-emerald-500" },
      { name: "Pooja Sharma", role: "QA Engineer", avatar: "PS", color: "bg-orange-500" },
    ],
    activities: [
      { user: "Airi Satou", avatar: "AS", color: "bg-blue-500", action: "uploaded 3 new design files to", target: "Draft Assets", time: "2h ago", icon: "upload" },
      { user: "John Deo", avatar: "JD", color: "bg-emerald-500", action: "marked Feature:", target: "User Auth as completed", time: "5h ago", icon: "check" },
      { user: "Pooja Sharma", avatar: "PS", color: "bg-orange-500", action: "commented on", target: "Mobile UI Bug", time: "Yesterday", icon: "comment" },
      { user: "Sarah Smith", avatar: "SS", color: "bg-violet-500", action: "updated project timeline for", target: "Sprint 4 Review", time: "2 days ago", icon: "check" },
    ],
    gradient: "from-indigo-600 via-blue-600 to-blue-700",
  },
  {
    id: "p2",
    title: "E-Commerce Mobile App",
    status: "In Progress",
    department: "Mobile",
    lead: "Vikram Singh",
    progress: 58,
    tasksCompleted: 22,
    tasksTotal: 38,
    budgetINR: "₹24,90,000",
    budgetUSD: "$30,000",
    budgetNote: "On Budget",
    activeRisks: 1,
    description: "Building a cross-platform mobile application for e-commerce with real-time inventory management, secure payments, and personalized user experience. The app targets both iOS and Android platforms using React Native.",
    startDate: "2024-01-10",
    endDate: "2024-07-15",
    tags: ["React Native", "Redux", "Firebase", "Stripe", "Node.js"],
    files: [{ name: "App_Architecture.pdf", size: "3.1 MB" }, { name: "API_Docs.md", size: "0.8 MB" }],
    client: { company: "ShopEase Pvt Ltd", code: "CLI-SHOP-1024", contact: "Priya Nair (CEO)", country: "India", industry: "E-Commerce" },
    milestones: [
      { title: "Requirements Gathering", date: "Jan 10, 2024", status: "completed" },
      { title: "Wireframes & Prototyping", date: "Feb 05, 2024", status: "completed" },
      { title: "Core Features Development", date: "Mar 20, 2024", status: "in-progress" },
      { title: "Payment Integration", date: "May 01, 2024", status: "pending" },
      { title: "Beta Launch", date: "Jun 15, 2024", status: "pending" },
    ],
    team: [
      { name: "Vikram Singh", role: "Tech Lead", avatar: "VS", color: "bg-indigo-500" },
      { name: "Amit Kumar", role: "Mobile Developer", avatar: "AK", color: "bg-cyan-500" },
      { name: "Neha Gupta", role: "Business Analyst", avatar: "NG", color: "bg-rose-500" },
    ],
    activities: [
      { user: "Vikram Singh", avatar: "VS", color: "bg-indigo-500", action: "pushed 12 commits to", target: "feature/cart", time: "1h ago", icon: "upload" },
      { user: "Amit Kumar", avatar: "AK", color: "bg-cyan-500", action: "resolved bug in", target: "Payment Gateway", time: "4h ago", icon: "check" },
      { user: "Neha Gupta", avatar: "NG", color: "bg-rose-500", action: "commented on", target: "User Flow Diagram", time: "Yesterday", icon: "comment" },
    ],
    gradient: "from-cyan-600 via-teal-600 to-emerald-600",
  },
  {
    id: "p3",
    title: "Cloud Infrastructure Migration",
    status: "On Hold",
    department: "DevOps",
    lead: "Rahul Verma",
    progress: 32,
    tasksCompleted: 10,
    tasksTotal: 31,
    budgetINR: "₹41,50,000",
    budgetUSD: "$50,000",
    budgetNote: "Under Review",
    activeRisks: 4,
    description: "Migrating existing on-premise infrastructure to AWS cloud. This includes setting up CI/CD pipelines, containerization with Docker/Kubernetes, database migration, and implementing auto-scaling. Currently on hold due to vendor contract negotiations.",
    startDate: "2023-11-01",
    endDate: "2024-05-30",
    tags: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins"],
    files: [{ name: "Migration_Plan.pdf", size: "5.2 MB" }, { name: "Cost_Analysis.xlsx", size: "1.4 MB" }, { name: "Risk_Register.docx", size: "0.9 MB" }],
    client: { company: "Internal - WebNxt", code: "INT-INFRA-001", contact: "Shriyash Jagtap (Admin)", country: "India", industry: "IT Infrastructure" },
    milestones: [
      { title: "Infrastructure Audit", date: "Nov 01, 2023", status: "completed" },
      { title: "Cloud Architecture Design", date: "Dec 15, 2023", status: "completed" },
      { title: "Database Migration", date: "Feb 10, 2024", status: "in-progress" },
      { title: "App Server Migration", date: "Apr 01, 2024", status: "pending" },
      { title: "Go-Live & Monitoring", date: "May 30, 2024", status: "pending" },
    ],
    team: [
      { name: "Rahul Verma", role: "DevOps Lead", avatar: "RV", color: "bg-amber-500" },
      { name: "Anita Desai", role: "Cloud Architect", avatar: "AD", color: "bg-teal-500" },
    ],
    activities: [
      { user: "Rahul Verma", avatar: "RV", color: "bg-amber-500", action: "paused deployment pipeline for", target: "Staging Server", time: "1 day ago", icon: "check" },
      { user: "Anita Desai", avatar: "AD", color: "bg-teal-500", action: "uploaded updated cost report to", target: "Finance Review", time: "3 days ago", icon: "upload" },
    ],
    gradient: "from-amber-600 via-orange-600 to-red-600",
  },
  {
    id: "p4",
    title: "HR Analytics Dashboard",
    status: "Completed",
    department: "Data Analytics",
    lead: "Priya Nair",
    progress: 100,
    tasksCompleted: 42,
    tasksTotal: 42,
    budgetINR: "₹12,45,000",
    budgetUSD: "$15,000",
    budgetNote: "Under Budget by ₹83,000",
    activeRisks: 0,
    description: "Developed a comprehensive HR analytics dashboard featuring employee performance tracking, attrition prediction models, hiring funnel analysis, and department-wise workforce statistics. Successfully delivered ahead of schedule.",
    startDate: "2023-06-01",
    endDate: "2023-12-15",
    tags: ["Python", "Power BI", "PostgreSQL", "REST API", "Chart.js"],
    files: [{ name: "Final_Report.pdf", size: "4.8 MB" }, { name: "User_Guide.pdf", size: "2.1 MB" }],
    client: { company: "WebNxt HR Dept", code: "INT-HR-042", contact: "Anita Desai (HR Head)", country: "India", industry: "Human Resources" },
    milestones: [
      { title: "Data Pipeline Setup", date: "Jun 15, 2023", status: "completed" },
      { title: "Dashboard Wireframes", date: "Jul 20, 2023", status: "completed" },
      { title: "Core Dashboard Build", date: "Sep 30, 2023", status: "completed" },
      { title: "ML Model Integration", date: "Nov 10, 2023", status: "completed" },
      { title: "Final QA & Deployment", date: "Dec 10, 2023", status: "completed" },
    ],
    team: [
      { name: "Priya Nair", role: "Data Lead", avatar: "PN", color: "bg-pink-500" },
      { name: "John Deo", role: "Backend Developer", avatar: "JD", color: "bg-blue-500" },
      { name: "Pooja Sharma", role: "QA Engineer", avatar: "PS", color: "bg-orange-500" },
    ],
    activities: [
      { user: "Priya Nair", avatar: "PN", color: "bg-pink-500", action: "marked project as", target: "Completed", time: "Dec 15, 2023", icon: "check" },
      { user: "Pooja Sharma", avatar: "PS", color: "bg-orange-500", action: "submitted final QA report for", target: "Analytics Module", time: "Dec 12, 2023", icon: "upload" },
    ],
    gradient: "from-emerald-600 via-green-600 to-teal-600",
  },
  {
    id: "p5",
    title: "Client Portal Redesign",
    status: "Planning",
    department: "Design",
    lead: "Pankaj Patel",
    progress: 12,
    tasksCompleted: 3,
    tasksTotal: 25,
    budgetINR: "₹8,30,000",
    budgetUSD: "$10,000",
    budgetNote: "Estimation Phase",
    activeRisks: 1,
    description: "Redesigning the client-facing portal with modern UI patterns, improved accessibility, multi-language support, and a responsive design. Currently in the planning and discovery phase with stakeholder interviews underway.",
    startDate: "2024-03-01",
    endDate: "2024-08-30",
    tags: ["Figma", "React", "i18n", "Accessibility", "Storybook"],
    files: [{ name: "Discovery_Notes.pdf", size: "1.6 MB" }],
    client: { company: "Global Fintech Corp", code: "CLI-GFC-3301", contact: "Rajesh Kapoor (VP)", country: "Singapore", industry: "Fintech" },
    milestones: [
      { title: "Stakeholder Interviews", date: "Mar 05, 2024", status: "completed" },
      { title: "Design System Setup", date: "Mar 25, 2024", status: "in-progress" },
      { title: "Wireframes & Prototypes", date: "Apr 20, 2024", status: "pending" },
      { title: "Development Sprint 1", date: "Jun 01, 2024", status: "pending" },
      { title: "Launch", date: "Aug 30, 2024", status: "pending" },
    ],
    team: [
      { name: "Pankaj Patel", role: "Design Lead", avatar: "PP", color: "bg-emerald-500" },
      { name: "Sarah Smith", role: "Project Manager", avatar: "SS", color: "bg-violet-500" },
      { name: "Neha Gupta", role: "Business Analyst", avatar: "NG", color: "bg-rose-500" },
    ],
    activities: [
      { user: "Pankaj Patel", avatar: "PP", color: "bg-emerald-500", action: "created initial moodboard for", target: "Portal Theme", time: "3h ago", icon: "upload" },
      { user: "Sarah Smith", avatar: "SS", color: "bg-violet-500", action: "scheduled kickoff meeting for", target: "Sprint 0", time: "Yesterday", icon: "check" },
      { user: "Neha Gupta", avatar: "NG", color: "bg-rose-500", action: "documented requirements in", target: "Confluence Wiki", time: "2 days ago", icon: "comment" },
    ],
    gradient: "from-purple-600 via-violet-600 to-indigo-600",
  },
];

/* ═══════════════════════════════════════════
   Progress Ring SVG
   ═══════════════════════════════════════════ */

const ProgressRing = ({ percent, id }: { percent: number; id: string }) => {
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={`url(#ring-${id})`} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out" />
        <defs>
          <linearGradient id={`ring-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[20px] font-extrabold text-white">{percent}%</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */

const ProjectDetails = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const project = projects.find(p => p.id === selectedId) || projects[0];
  const sb = statusBadge[project.status];

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <FileText className="w-4 h-4" /> },
    { id: "team", label: "Team Members", icon: <Users className="w-4 h-4" /> },
    { id: "activity", label: "Live Activity", icon: <Clock className="w-4 h-4" /> },
  ];

  const switchProject = (id: string) => {
    setSelectedId(id);
    setActiveTab("overview");
    setDropdownOpen(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Project Details</h1>

      {/* ── Hero Banner ── */}
      <div className={`bg-gradient-to-r ${project.gradient} rounded-2xl p-6 md:p-8 relative shadow-lg transition-all duration-500`}>
        <div className="absolute inset-0 opacity-10 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white" />
        </div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1 space-y-3">
            <span className={`inline-block px-3 py-1 ${sb.bg} border rounded-full text-[11px] font-bold ${sb.text} uppercase tracking-wider`}>
              {project.status}
            </span>

            {/* Title + Dropdown Switcher */}
            <div ref={dropdownRef} className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 group">
                <h2 className="text-[22px] md:text-[26px] font-extrabold text-white leading-tight">
                  {project.title}
                </h2>
                <ChevronDown className={`w-5 h-5 text-white/60 group-hover:text-white transition-all ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute z-[100] left-0 top-full mt-2 bg-white rounded-xl border border-gray-300 shadow-2xl py-2 w-80 animate-fade-in"
                  onClick={e => e.stopPropagation()}>
                  <div className="px-3.5 pb-2 mb-1 border-b border-gray-100">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Switch Project</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {projects.map(p => {
                      const sel = p.id === selectedId;
                      const pSb = statusBadge[p.status];
                      return (
                        <button key={p.id} type="button"
                          onClick={(e) => { e.stopPropagation(); switchProject(p.id); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                            sel ? "bg-blue-50" : "hover:bg-gray-50"
                          }`}>
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${pSb.dot}`} />
                          <div className="flex-1 text-left min-w-0">
                            <p className={`text-[13px] font-semibold truncate ${sel ? "text-blue-700" : "text-gray-800"}`}>{p.title}</p>
                            <p className="text-[11px] text-gray-500">{p.department} &middot; {p.progress}%</p>
                          </div>
                          {sel && <Check className="w-4 h-4 text-blue-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-white/70 text-[13px] font-medium">
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> {project.department}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> {project.lead}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <ProgressRing percent={project.progress} id={project.id} />
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate("/projects/edit")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 rounded-lg text-[13px] font-semibold text-white transition-all">
                <Edit3 className="w-3.5 h-3.5" /> Edit Project
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 rounded-lg text-[13px] font-semibold text-white transition-all">
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<TrendingUp className="w-5 h-5" />} iconBg="bg-blue-100 text-blue-600" label="Overall Progress" value={`${project.progress}%`}
          sub={<div className="w-full bg-gray-200 rounded-full h-2 mt-1.5"><div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} /></div>} />
        <StatCard icon={<CheckSquare className="w-5 h-5" />} iconBg="bg-emerald-100 text-emerald-600" label="Tasks Completed" value={`${project.tasksCompleted}/${project.tasksTotal}`}
          sub={<p className="text-[11px] text-gray-500 font-medium">{project.tasksCompleted === project.tasksTotal ? "All Done!" : "On Schedule"}</p>} />
        <StatCard icon={<Wallet className="w-5 h-5" />} iconBg="bg-orange-100 text-orange-600" label="Total Budget" value={`${project.budgetINR} / ${project.budgetUSD}`}
          sub={<p className="text-[11px] text-gray-500 font-medium">{project.budgetNote}</p>} />
        <StatCard icon={<AlertTriangle className="w-5 h-5" />} iconBg="bg-red-100 text-red-600" label="Active Risks" value={String(project.activeRisks)}
          sub={<p className={`text-[11px] font-medium ${project.activeRisks > 0 ? "text-red-500" : "text-emerald-500"}`}>{project.activeRisks > 0 ? "Requires Attention" : "No Active Risks"}</p>} />
      </div>

      {/* ── Main Content + Sidebar ── */}
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-[13px] font-bold transition-all border-b-[3px] ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-700 bg-blue-50/30"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "overview" && <OverviewTab project={project} />}
            {activeTab === "team" && <TeamTab team={project.team} />}
            {activeTab === "activity" && <ActivityTab activities={project.activities} />}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 space-y-4 shrink-0">
          <SidebarCard title="Client Details" icon={<Building2 className="w-4 h-4 text-blue-600" />}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-900">{project.client.company}</p>
                <p className="text-[11px] text-gray-500 font-medium">{project.client.code}</p>
              </div>
            </div>
            <div className="space-y-2 text-[12px]">
              <div className="flex gap-2"><span className="text-gray-500 font-medium">Contact:</span><span className="text-gray-900 font-semibold">{project.client.contact}</span></div>
              <div className="flex gap-2"><span className="text-gray-500 font-medium">Country:</span><span className="text-gray-900 font-semibold">{project.client.country}</span></div>
              <div className="flex gap-2"><span className="text-gray-500 font-medium">Industry:</span><span className="text-gray-900 font-semibold">{project.client.industry}</span></div>
            </div>
          </SidebarCard>

          <SidebarCard title="Project Dates" icon={<CalendarDays className="w-4 h-4 text-blue-600" />}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Start Date</p>
                <p className="text-[14px] font-bold text-gray-900">{project.startDate}</p>
              </div>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">End Date</p>
                <p className="text-[14px] font-bold text-gray-900">{project.endDate}</p>
              </div>
            </div>
          </SidebarCard>

          <SidebarCard title="Tags & Technologies" icon={<Tag className="w-4 h-4 text-blue-600" />}>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="px-3 py-1.5 border-2 border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 bg-gray-50 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </SidebarCard>

          <SidebarCard title="Featured Files" icon={<FileText className="w-4 h-4 text-blue-600" />}>
            <div className="space-y-2.5">
              {project.files.map(file => (
                <div key={file.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                  <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-gray-900 truncate">{file.name}</p>
                    <p className="text-[11px] text-gray-500">{file.size}</p>
                  </div>
                  <button className="p-2 rounded-lg text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-all opacity-60 group-hover:opacity-100">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </SidebarCard>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Stat Card
   ═══════════════════════════════════════════ */

const StatCard = ({ icon, iconBg, label, value, sub }: {
  icon: React.ReactNode; iconBg: string; label: string; value: string; sub: React.ReactNode;
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3.5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-[20px] font-extrabold text-gray-900 leading-tight mt-0.5">{value}</p>
        <div className="mt-1">{sub}</div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   Sidebar Card
   ═══════════════════════════════════════════ */

const SidebarCard = ({ title, icon, children }: {
  title: string; icon: React.ReactNode; children: React.ReactNode;
}) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
      {icon}
      <h3 className="text-[13px] font-bold text-gray-900">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

/* ═══════════════════════════════════════════
   Overview Tab
   ═══════════════════════════════════════════ */

const OverviewTab = ({ project }: { project: ProjectData }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-[14px] font-bold text-gray-900 mb-3 pb-2 border-b-2 border-gray-100">Description</h3>
      <p className="text-[13px] text-gray-600 font-medium leading-relaxed">{project.description}</p>
    </div>

    <div>
      <h3 className="text-[14px] font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-100">Key Milestones</h3>
      <div className="space-y-0">
        {project.milestones.map((ms, idx) => {
          const isLast = idx === project.milestones.length - 1;
          return (
            <div key={ms.title} className="flex gap-4">
              <div className="flex flex-col items-center shrink-0 w-8">
                {ms.status === "completed" ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" fill="currentColor" stroke="white" />
                ) : ms.status === "in-progress" ? (
                  <CircleDot className="w-6 h-6 text-blue-500 shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300 shrink-0" />
                )}
                {!isLast && <div className={`w-0.5 flex-1 my-1 ${ms.status === "completed" ? "bg-emerald-300" : "bg-gray-200"}`} />}
              </div>
              <div className="flex-1 flex items-center justify-between pb-6">
                <div>
                  <p className={`text-[14px] font-bold ${ms.status === "pending" ? "text-gray-500" : "text-gray-900"}`}>{ms.title}</p>
                  <p className="text-[12px] text-gray-500 font-medium mt-0.5">{ms.date}</p>
                </div>
                <span className={`text-[12px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                  ms.status === "completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : ms.status === "in-progress" ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-gray-50 text-gray-500 border border-gray-200"
                }`}>
                  {ms.status === "completed" ? "Completed" : ms.status === "in-progress" ? "In Progress" : "Pending"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   Team Members Tab
   ═══════════════════════════════════════════ */

const TeamTab = ({ team }: { team: TeamMember[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {team.map(member => (
      <div key={member.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/20 hover:shadow-sm transition-all group">
        <div className={`w-12 h-12 rounded-full ${member.color} flex items-center justify-center shrink-0 shadow-md`}>
          <span className="text-white text-[13px] font-bold">{member.avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-gray-900">{member.name}</p>
          <p className="text-[12px] text-gray-500 font-medium">{member.role}</p>
        </div>
        <button className="p-2.5 rounded-lg text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-all opacity-50 group-hover:opacity-100">
          <MessageSquare className="w-4.5 h-4.5" />
        </button>
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════
   Live Activity Tab
   ═══════════════════════════════════════════ */

const activityIcons = {
  upload: { icon: <Upload className="w-3.5 h-3.5" />, color: "bg-blue-500" },
  check: { icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "bg-emerald-500" },
  comment: { icon: <MessageSquare className="w-3.5 h-3.5" />, color: "bg-orange-500" },
};

const ActivityTab = ({ activities }: { activities: ActivityItem[] }) => (
  <div className="space-y-0">
    {activities.map((act, idx) => {
      const ai = activityIcons[act.icon];
      const isLast = idx === activities.length - 1;
      return (
        <div key={idx} className="flex gap-4">
          <div className="flex flex-col items-center shrink-0 w-8">
            <div className={`w-7 h-7 rounded-full ${ai.color} flex items-center justify-center text-white shrink-0 shadow-sm`}>
              {ai.icon}
            </div>
            {!isLast && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
          </div>
          <div className="flex-1 pb-6">
            <p className="text-[11px] text-gray-400 font-medium mb-1">{act.time}</p>
            <p className="text-[13px] text-gray-700 font-medium leading-relaxed">
              <span className="font-bold text-gray-900">{act.user}</span>{" "}
              {act.action}{" "}
              <span className="font-bold text-gray-900">{act.target}</span>
            </p>
          </div>
        </div>
      );
    })}
  </div>
);

export default ProjectDetails;
