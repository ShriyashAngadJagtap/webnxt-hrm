import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Mail, User, MessageSquare, Briefcase, ListChecks } from "lucide-react";

/* ═══════════════════════════════════════════
   Types & Data
   ═══════════════════════════════════════════ */

interface Member {
  name: string;
  role: string;
  email: string;
  projects: number;
  tasks: number;
  avatarGradient: string;
  bannerGradient: string;
}

interface MemberProject {
  id: string;
  name: string;
  members: Member[];
}

const memberProjects: MemberProject[] = [
  {
    id: "mp1",
    name: "WebNxt HRM Dashboard",
    members: [
      { name: "Shriyash Jagtap", role: "Admin & Tech Lead", email: "shriyash@webnxt.com", projects: 15, tasks: 62, avatarGradient: "from-orange-500 to-amber-600", bannerGradient: "from-orange-500 to-amber-500" },
      { name: "Jitesh Naidu", role: "Senior Developer", email: "jitesh@webnxt.com", projects: 11, tasks: 48, avatarGradient: "from-cyan-500 to-blue-600", bannerGradient: "from-cyan-500 to-blue-600" },
      { name: "Sarah Smith", role: "Project Manager", email: "sarah@example.com", projects: 12, tasks: 45, avatarGradient: "from-rose-400 to-pink-500", bannerGradient: "from-blue-500 to-blue-600" },
      { name: "John Deo", role: "Software Engineer", email: "john@example.com", projects: 8, tasks: 30, avatarGradient: "from-blue-400 to-indigo-500", bannerGradient: "from-blue-400 to-indigo-500" },
      { name: "Pankaj Patel", role: "UI/UX Designer", email: "pankaj@example.com", projects: 5, tasks: 20, avatarGradient: "from-amber-400 to-orange-500", bannerGradient: "from-indigo-400 to-purple-500" },
      { name: "Pooja Sharma", role: "QA Engineer", email: "pooja@example.com", projects: 10, tasks: 55, avatarGradient: "from-purple-400 to-violet-500", bannerGradient: "from-purple-400 to-violet-500" },
      { name: "Vikram Singh", role: "Backend Developer", email: "vikram@example.com", projects: 7, tasks: 38, avatarGradient: "from-red-400 to-rose-500", bannerGradient: "from-blue-500 to-cyan-500" },
      { name: "Rahul Verma", role: "DevOps Engineer", email: "rahul@example.com", projects: 9, tasks: 42, avatarGradient: "from-indigo-400 to-purple-500", bannerGradient: "from-emerald-400 to-teal-500" },
    ],
  },
  {
    id: "mp2",
    name: "E-Commerce Mobile App",
    members: [
      { name: "Shriyash Jagtap", role: "Admin & Tech Lead", email: "shriyash@webnxt.com", projects: 15, tasks: 62, avatarGradient: "from-orange-500 to-amber-600", bannerGradient: "from-orange-500 to-amber-500" },
      { name: "Amit Kumar", role: "Lead Developer", email: "amit@example.com", projects: 6, tasks: 28, avatarGradient: "from-emerald-400 to-green-500", bannerGradient: "from-blue-500 to-blue-600" },
      { name: "Neha Gupta", role: "Business Analyst", email: "neha@example.com", projects: 4, tasks: 18, avatarGradient: "from-fuchsia-400 to-pink-500", bannerGradient: "from-indigo-400 to-purple-500" },
      { name: "Pankaj Patel", role: "UI/UX Designer", email: "pankaj@example.com", projects: 5, tasks: 20, avatarGradient: "from-amber-400 to-orange-500", bannerGradient: "from-purple-400 to-violet-500" },
      { name: "Jitesh Naidu", role: "Senior Developer", email: "jitesh@webnxt.com", projects: 11, tasks: 48, avatarGradient: "from-cyan-500 to-blue-600", bannerGradient: "from-cyan-500 to-blue-600" },
      { name: "Michael Ross", role: "Full Stack Developer", email: "michael@example.com", projects: 11, tasks: 50, avatarGradient: "from-sky-400 to-blue-500", bannerGradient: "from-blue-400 to-indigo-500" },
    ],
  },
  {
    id: "mp3",
    name: "Healthcare System",
    members: [
      { name: "Priya Nair", role: "Data Scientist", email: "priya@example.com", projects: 3, tasks: 15, avatarGradient: "from-teal-400 to-cyan-500", bannerGradient: "from-emerald-500 to-teal-500" },
      { name: "Jayesh Patel", role: "Backend Developer", email: "jayesh@example.com", projects: 7, tasks: 32, avatarGradient: "from-emerald-400 to-green-500", bannerGradient: "from-blue-500 to-blue-600" },
      { name: "Emily Clark", role: "Technical Writer", email: "emily@example.com", projects: 4, tasks: 22, avatarGradient: "from-fuchsia-400 to-pink-500", bannerGradient: "from-indigo-400 to-purple-500" },
      { name: "Mohan Sharma", role: "Frontend Developer", email: "mohan@example.com", projects: 6, tasks: 25, avatarGradient: "from-cyan-400 to-teal-500", bannerGradient: "from-purple-400 to-violet-500" },
      { name: "Hardik Patel", role: "QA Lead", email: "hardik@example.com", projects: 8, tasks: 40, avatarGradient: "from-lime-400 to-emerald-500", bannerGradient: "from-blue-400 to-indigo-500" },
    ],
  },
  {
    id: "mp4",
    name: "Client Portal Redesign",
    members: [
      { name: "John Deo", role: "Software Engineer", email: "john@example.com", projects: 8, tasks: 30, avatarGradient: "from-blue-400 to-indigo-500", bannerGradient: "from-blue-500 to-blue-600" },
      { name: "Jitesh Naidu", role: "Senior Developer", email: "jitesh@webnxt.com", projects: 11, tasks: 48, avatarGradient: "from-cyan-500 to-blue-600", bannerGradient: "from-cyan-500 to-blue-600" },
      { name: "Sarah Smith", role: "Project Manager", email: "sarah@example.com", projects: 12, tasks: 45, avatarGradient: "from-rose-400 to-pink-500", bannerGradient: "from-indigo-400 to-purple-500" },
      { name: "Vikram Singh", role: "Backend Developer", email: "vikram@example.com", projects: 7, tasks: 38, avatarGradient: "from-red-400 to-rose-500", bannerGradient: "from-purple-400 to-violet-500" },
    ],
  },
  {
    id: "mp5",
    name: "Cloud Infrastructure Migration",
    members: [
      { name: "Rahul Verma", role: "DevOps Engineer", email: "rahul@example.com", projects: 9, tasks: 42, avatarGradient: "from-indigo-400 to-purple-500", bannerGradient: "from-blue-500 to-blue-600" },
      { name: "Anita Desai", role: "Cloud Architect", email: "anita@example.com", projects: 6, tasks: 35, avatarGradient: "from-orange-400 to-red-400", bannerGradient: "from-indigo-400 to-purple-500" },
      { name: "Amit Kumar", role: "Lead Developer", email: "amit@example.com", projects: 6, tasks: 28, avatarGradient: "from-emerald-400 to-green-500", bannerGradient: "from-purple-400 to-violet-500" },
      { name: "Pooja Sharma", role: "QA Engineer", email: "pooja@example.com", projects: 10, tasks: 55, avatarGradient: "from-purple-400 to-violet-500", bannerGradient: "from-blue-400 to-indigo-500" },
    ],
  },
];

const getInitials = (name: string) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */

const ProjectMembers = () => {
  const [selectedId, setSelectedId] = useState(memberProjects[0].id);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const project = memberProjects.find(p => p.id === selectedId) || memberProjects[0];

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Project Members</h1>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        {/* Project Selector */}
        <div ref={dropRef} className="relative mb-6 max-w-xs">
          <fieldset className={`border-2 rounded-xl px-3.5 pt-1 pb-2 cursor-pointer transition-all ${
            dropdownOpen ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-300 hover:border-gray-400"
          }`} onClick={() => setDropdownOpen(!dropdownOpen)}>
            <legend className="text-[11px] font-semibold text-blue-600 px-1">Select Project</legend>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[14px] font-semibold text-gray-900 truncate">{project.name}</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </div>
          </fieldset>

          {dropdownOpen && (
            <div className="absolute z-50 left-0 top-full mt-1.5 bg-white rounded-xl border border-gray-300 shadow-2xl py-1.5 w-full animate-fade-in">
              {memberProjects.map(p => {
                const sel = p.id === selectedId;
                return (
                  <button key={p.id} type="button" onClick={() => { setSelectedId(p.id); setDropdownOpen(false); }}
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

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {project.members.map((member) => (
            <MemberCard key={member.email} member={member} />
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-6 text-[12px] font-semibold text-gray-500">
          <span>Total Members: <span className="text-gray-900 font-bold text-[14px]">{project.members.length}</span></span>
          <span>Total Projects: <span className="text-gray-900 font-bold text-[14px]">{project.members.reduce((s, m) => s + m.projects, 0)}</span></span>
          <span>Total Tasks: <span className="text-gray-900 font-bold text-[14px]">{project.members.reduce((s, m) => s + m.tasks, 0)}</span></span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Member Card
   ═══════════════════════════════════════════ */

const MemberCard = ({ member }: { member: Member }) => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
    {/* Banner */}
    <div className={`h-20 bg-gradient-to-r ${member.bannerGradient} relative`}>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.avatarGradient} flex items-center justify-center border-4 border-white shadow-lg`}>
          <span className="text-[18px] font-bold text-white leading-none">{getInitials(member.name)}</span>
        </div>
      </div>
    </div>

    {/* Info */}
    <div className="pt-10 pb-4 px-4 text-center">
      <h3 className="text-[15px] font-bold text-gray-900">{member.name}</h3>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{member.role}</p>
      <div className="flex items-center justify-center gap-1.5 mt-2">
        <Mail className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[11px] font-medium text-gray-500">{member.email}</span>
      </div>
    </div>

    {/* Stats */}
    <div className="mx-4 mb-4 flex items-center rounded-xl bg-gray-50 border border-gray-100">
      <div className="flex-1 text-center py-3 border-r border-gray-100">
        <p className="text-[18px] font-extrabold text-gray-900">{member.projects}</p>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Projects</p>
      </div>
      <div className="flex-1 text-center py-3">
        <p className="text-[18px] font-extrabold text-gray-900">{member.tasks}</p>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Tasks</p>
      </div>
    </div>

    {/* Actions */}
    <div className="px-4 pb-4 flex items-center gap-2">
      <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold transition-colors shadow-sm">
        <User className="w-3.5 h-3.5" /> Profile
      </button>
      <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 text-[12px] font-bold transition-colors">
        <MessageSquare className="w-3.5 h-3.5" /> Chat
      </button>
    </div>
  </div>
);

export default ProjectMembers;
