import { useState } from "react";
import {
  Search, Filter, Mail, Phone, MapPin, ArrowLeft,
  User, Settings, GraduationCap, Briefcase, Award,
  Lock, ChevronRight, Star, Heart, MessageCircle,
  Sparkles, Globe, Shield, Bell, UserCheck, Eye,
  Calendar, Building2, TrendingUp, Zap
} from "lucide-react";

/* ═══════════════════════════════════════════
   Types & Data
   ═══════════════════════════════════════════ */

interface EmployeeProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  country: string;
  gender: "Male" | "Female";
  status: "Active" | "Inactive" | "On Leave";
  bio: string;
  skills: { name: string; level: number }[];
  education: { title: string; year: string }[];
  experience: { title: string; period: string }[];
  conferences: string[];
  following: number;
  followers: number;
  posts: number;
  joinDate: string;
  rating: number;
}

const avatarColors: Record<string, string> = {
  "Shriyash Jagtap": "from-blue-500 to-indigo-600",
  "Jitesh Naidu": "from-emerald-500 to-teal-600",
  "Shubham Jadhav": "from-orange-500 to-red-500",
  "John Doe": "from-violet-500 to-purple-600",
  "Jane Smith": "from-pink-500 to-rose-500",
  "Mike Johnson": "from-cyan-500 to-blue-500",
  "Lisa Wang": "from-amber-500 to-orange-500",
  "Alex Brown": "from-teal-500 to-emerald-600",
  "Emily Jones": "from-fuchsia-500 to-pink-600",
  "Sarah Miller": "from-lime-500 to-green-600",
};
const getInitials = (n: string) => n.split(" ").map(w => w[0]).join("").toUpperCase();
const getColor = (n: string) => avatarColors[n] || "from-gray-400 to-gray-500";

const bannerPatterns: Record<string, string> = {
  "Shriyash Jagtap": "from-blue-600 via-indigo-600 to-purple-700",
  "Jitesh Naidu": "from-emerald-600 via-teal-600 to-cyan-700",
  "Shubham Jadhav": "from-orange-600 via-red-500 to-rose-600",
  "John Doe": "from-violet-600 via-purple-600 to-indigo-700",
  "Jane Smith": "from-pink-500 via-rose-500 to-fuchsia-600",
  "Mike Johnson": "from-cyan-600 via-blue-600 to-indigo-600",
  "Lisa Wang": "from-amber-500 via-orange-500 to-red-500",
  "Alex Brown": "from-teal-600 via-emerald-600 to-green-700",
  "Emily Jones": "from-fuchsia-500 via-pink-500 to-rose-600",
  "Sarah Miller": "from-lime-600 via-green-600 to-emerald-700",
};
const getBanner = (n: string) => bannerPatterns[n] || "from-gray-600 via-gray-700 to-gray-800";

const statusConfig: Record<string, { bg: string; text: string; dot: string; glow: string }> = {
  Active: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", glow: "shadow-emerald-500/20" },
  Inactive: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", glow: "shadow-red-500/20" },
  "On Leave": { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", glow: "shadow-amber-500/20" },
};

const deptColors: Record<string, { bg: string; text: string; border: string }> = {
  Engineering: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Java: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  "UI/UX": { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  Management: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  "Quality Assurance": { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  Operations: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Data Analytics": { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  Marketing: { bg: "bg-lime-50", text: "text-lime-700", border: "border-lime-200" },
};
const getDeptColor = (d: string) => deptColors[d] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };

const employees: EmployeeProfile[] = [
  {
    id: "EMP-001", name: "Shriyash Jagtap", role: "Full Stack Developer", department: "Engineering",
    mobile: "+91 9876543210", email: "shriyash.jagtap@webnxt.com",
    address: "123 Tech Park, Hinjewadi Phase 2", city: "Pune", country: "India", gender: "Male", status: "Active",
    bio: "Passionate full stack developer with expertise in React, Node.js, and cloud technologies. Dedicated to building scalable and user-friendly applications. Strong advocate for clean code practices and agile methodology. Loves exploring new tech stacks and contributing to open-source projects.",
    skills: [{ name: "React", level: 95 }, { name: "TypeScript", level: 90 }, { name: "Node.js", level: 88 }, { name: "PostgreSQL", level: 82 }, { name: "AWS", level: 78 }, { name: "Docker", level: 75 }, { name: "Tailwind CSS", level: 92 }, { name: "Git", level: 85 }],
    education: [{ title: "B.E. Computer Engineering, Pune University, India", year: "2018-2022" }, { title: "HSC, Maharashtra State Board", year: "2016-2018" }],
    experience: [{ title: "Full Stack Developer at WebNxt Technologies", period: "Jan 2023 - Present" }, { title: "Junior Developer at TechSoft Solutions", period: "Jun 2021 - Dec 2022" }, { title: "Intern at CloudBase Inc.", period: "Jan 2021 - May 2021" }],
    conferences: ["ReactConf India 2024 — Speaker on 'Building Scalable HRM Systems'", "JSConf Asia 2023 — Attendee", "DevOps Summit Pune 2023 — Workshop participant"],
    following: 564, followers: 18000, posts: 565, joinDate: "Jan 2023", rating: 4.9,
  },
  {
    id: "EMP-002", name: "Jitesh Naidu", role: "Frontend Developer", department: "Engineering",
    mobile: "+91 9876543211", email: "jitesh.naidu@webnxt.com",
    address: "456 IT Hub, Madhapur", city: "Hyderabad", country: "India", gender: "Male", status: "Active",
    bio: "Creative frontend developer specializing in responsive design, animations, and modern JavaScript frameworks. Loves transforming Figma designs into pixel-perfect interfaces.",
    skills: [{ name: "React", level: 92 }, { name: "Vue.js", level: 85 }, { name: "CSS/SCSS", level: 95 }, { name: "Figma", level: 80 }, { name: "JavaScript", level: 90 }, { name: "Storybook", level: 78 }, { name: "Framer Motion", level: 88 }],
    education: [{ title: "B.Tech Computer Science, JNTU Hyderabad", year: "2015-2019" }],
    experience: [{ title: "Frontend Developer at WebNxt Technologies", period: "Mar 2023 - Present" }, { title: "UI Developer at PixelCraft Studios", period: "Aug 2020 - Feb 2023" }],
    conferences: ["CSSConf 2023 — Attendee", "FrontendLove 2024 — Lightning talk on Micro-Animations"],
    following: 320, followers: 9500, posts: 210, joinDate: "Mar 2023", rating: 4.7,
  },
  {
    id: "EMP-003", name: "Shubham Jadhav", role: "Backend Developer", department: "Engineering",
    mobile: "+91 9876543212", email: "shubham.jadhav@webnxt.com",
    address: "789 Software Lane, Andheri East", city: "Mumbai", country: "India", gender: "Male", status: "Active",
    bio: "Backend architect focused on building high-performance APIs and microservices. Experienced in distributed systems, database optimization, and cloud-native development.",
    skills: [{ name: "Node.js", level: 93 }, { name: "Python", level: 88 }, { name: "PostgreSQL", level: 90 }, { name: "Redis", level: 82 }, { name: "Docker", level: 85 }, { name: "Kubernetes", level: 78 }, { name: "GraphQL", level: 86 }],
    education: [{ title: "M.Tech Software Engineering, IIT Bombay", year: "2016-2018" }, { title: "B.E. from Mumbai University", year: "2012-2016" }],
    experience: [{ title: "Backend Developer at WebNxt Technologies", period: "Jun 2023 - Present" }, { title: "Software Engineer at DataFlow Systems", period: "May 2019 - May 2023" }],
    conferences: ["NodeConf India 2024 — Speaker", "AWS re:Invent 2023 — Attendee"],
    following: 415, followers: 12000, posts: 340, joinDate: "Jun 2023", rating: 4.8,
  },
  {
    id: "EMP-004", name: "John Doe", role: "Senior Developer", department: "Java",
    mobile: "+1 1234567890", email: "john.doe@email.com",
    address: "123 Elm Street", city: "New York", country: "USA", gender: "Male", status: "On Leave",
    bio: "Senior Java developer with extensive experience in enterprise application development. Skilled in Spring Boot, microservices architecture, and agile development methodologies.",
    skills: [{ name: "Java", level: 95 }, { name: "Spring Boot", level: 92 }, { name: "Hibernate", level: 88 }, { name: "MySQL", level: 85 }, { name: "Maven", level: 80 }, { name: "Jenkins", level: 78 }],
    education: [{ title: "C.E., Gujarat University, Ahmedabad, India", year: "2004-2008" }, { title: "M.S., Gujarat University, Ahmedabad, India", year: "2008-2010" }, { title: "SPINAL FELLOWSHIP, Allgemeines Krakenhaus, Germany", year: "2011-2012" }, { title: "Fellowship in Endoscopic Spine Surgery, Phoenix, USA", year: "2013" }],
    experience: [{ title: "Rotatory Internship at B.J. Medical College, Ahmedabad", period: "Apr 2009 - Mar 2010" }, { title: "Resident in Orthopedics, V.S. General Hospital", period: "Apr 2008 - Apr 2011" }, { title: "Research Fellow, KUMC Krishna Hospital, Rajkot", period: "Apr 2013 - Jun 2013" }, { title: "Worked at Mahatma Gandhi General Hospital", period: "2.5 Years" }, { title: "Consultant Orthopedics Surgeon, Jalna", period: "2 Years" }],
    conferences: ["Medical Orthopedics Annual Conf 2023", "Spine Surgery Innovations Summit 2022", "National Health Research Conference 2021"],
    following: 564, followers: 18000, posts: 565, joinDate: "Mar 2018", rating: 4.6,
  },
  {
    id: "EMP-005", name: "Jane Smith", role: "Lead Designer", department: "UI/UX",
    mobile: "+1 2345678901", email: "jane.smith@email.com",
    address: "456 Oak Avenue", city: "San Francisco", country: "USA", gender: "Female", status: "Active",
    bio: "Award-winning UI/UX designer with a passion for creating intuitive and beautiful digital experiences. Expert in user research, wireframing, and prototyping.",
    skills: [{ name: "Figma", level: 97 }, { name: "Sketch", level: 90 }, { name: "Adobe XD", level: 88 }, { name: "Illustrator", level: 85 }, { name: "Prototyping", level: 92 }, { name: "User Research", level: 88 }],
    education: [{ title: "B.Des Interaction Design, NID Ahmedabad", year: "2013-2017" }],
    experience: [{ title: "Lead Designer at WebNxt", period: "May 2019 - Present" }, { title: "UX Designer at CreativeMinds", period: "2017-2019" }],
    conferences: ["Figma Config 2024 — Speaker", "UX India Conference 2023 — Panelist"],
    following: 890, followers: 25000, posts: 420, joinDate: "May 2019", rating: 4.9,
  },
  {
    id: "EMP-006", name: "Mike Johnson", role: "Project Manager", department: "Management",
    mobile: "+1 3456789012", email: "mike.johnson@email.com",
    address: "789 Pine Road", city: "Chicago", country: "USA", gender: "Male", status: "Inactive",
    bio: "Experienced project manager with PMP certification. Led cross-functional teams across multiple domains. Expert in Agile, Scrum, and Waterfall methodologies.",
    skills: [{ name: "Agile", level: 95 }, { name: "Scrum", level: 92 }, { name: "JIRA", level: 88 }, { name: "MS Project", level: 82 }, { name: "Risk Mgmt", level: 90 }, { name: "Budgeting", level: 85 }],
    education: [{ title: "MBA, Kellogg School of Management", year: "2012-2014" }, { title: "B.Tech, IIT Delhi", year: "2008-2012" }],
    experience: [{ title: "Project Manager at WebNxt", period: "Sep 2020 - Present" }, { title: "Delivery Manager at Infosys", period: "2015-2020" }],
    conferences: ["PMI Global Summit 2023", "Agile India Conference 2024"],
    following: 230, followers: 7500, posts: 156, joinDate: "Sep 2020", rating: 4.5,
  },
  {
    id: "EMP-007", name: "Lisa Wang", role: "QA Engineer", department: "Quality Assurance",
    mobile: "+1 4567890123", email: "lisa.wang@email.com",
    address: "321 Maple Street", city: "Seattle", country: "USA", gender: "Female", status: "On Leave",
    bio: "QA engineer specializing in automation testing and CI/CD integration. Experienced with Selenium, Cypress, and performance testing tools.",
    skills: [{ name: "Selenium", level: 92 }, { name: "Cypress", level: 88 }, { name: "JMeter", level: 80 }, { name: "Postman", level: 85 }, { name: "CI/CD", level: 82 }],
    education: [{ title: "B.Sc Computer Science, University of Washington", year: "2014-2018" }],
    experience: [{ title: "QA Engineer at WebNxt", period: "May 2021 - Present" }, { title: "Test Analyst at QualityFirst", period: "2018-2021" }],
    conferences: ["SeleniumConf 2023", "QA Summit 2024"],
    following: 180, followers: 4200, posts: 95, joinDate: "May 2021", rating: 4.4,
  },
  {
    id: "EMP-008", name: "Alex Brown", role: "DevOps Engineer", department: "Operations",
    mobile: "+1 5678901234", email: "alex.brown@email.com",
    address: "654 Cedar Lane", city: "Austin", country: "USA", gender: "Male", status: "Active",
    bio: "DevOps specialist with deep expertise in cloud infrastructure, containerization, and automation. Building reliable and scalable deployment pipelines.",
    skills: [{ name: "AWS", level: 95 }, { name: "Terraform", level: 90 }, { name: "Docker", level: 92 }, { name: "Kubernetes", level: 88 }, { name: "Jenkins", level: 85 }, { name: "Linux", level: 90 }],
    education: [{ title: "M.Sc Cloud Computing, Georgia Tech", year: "2012-2014" }],
    experience: [{ title: "DevOps Engineer at WebNxt", period: "Nov 2017 - Present" }, { title: "SysAdmin at CloudScale", period: "2014-2017" }],
    conferences: ["KubeCon 2024", "AWS re:Invent 2023"],
    following: 310, followers: 11000, posts: 280, joinDate: "Nov 2017", rating: 4.7,
  },
  {
    id: "EMP-009", name: "Emily Jones", role: "Data Scientist", department: "Data Analytics",
    mobile: "+1 6789012345", email: "emily.jones@email.com",
    address: "987 Birch Boulevard", city: "Boston", country: "USA", gender: "Female", status: "Active",
    bio: "Data scientist with a Ph.D. focused on machine learning and predictive analytics. Published researcher in NLP and recommendation systems.",
    skills: [{ name: "Python", level: 96 }, { name: "TensorFlow", level: 92 }, { name: "PyTorch", level: 90 }, { name: "SQL", level: 85 }, { name: "Spark", level: 82 }, { name: "NLP", level: 88 }],
    education: [{ title: "Ph.D. Data Science, MIT", year: "2016-2021" }, { title: "M.S., Stanford University", year: "2014-2016" }],
    experience: [{ title: "Data Scientist at WebNxt", period: "Jan 2022 - Present" }, { title: "Research Assistant at MIT", period: "2019-2021" }],
    conferences: ["NeurIPS 2023 — Paper presenter", "PyData Global 2024"],
    following: 520, followers: 32000, posts: 610, joinDate: "Jan 2022", rating: 4.9,
  },
  {
    id: "EMP-010", name: "Sarah Miller", role: "Marketing Specialist", department: "Marketing",
    mobile: "+1 8901234567", email: "sarah.miller@email.com",
    address: "258 Walnut Street", city: "Los Angeles", country: "USA", gender: "Female", status: "Active",
    bio: "Digital marketing expert with expertise in SEO, content strategy, and paid advertising campaigns. Driven by data and creative storytelling.",
    skills: [{ name: "SEO", level: 94 }, { name: "Google Ads", level: 90 }, { name: "Analytics", level: 88 }, { name: "Social Media", level: 92 }, { name: "Copywriting", level: 86 }, { name: "HubSpot", level: 82 }],
    education: [{ title: "BBA in Marketing, UCLA", year: "2012-2016" }],
    experience: [{ title: "Marketing Specialist at WebNxt", period: "Apr 2020 - Present" }, { title: "Content Strategist at BrandHive", period: "2018-2020" }],
    conferences: ["Content Marketing World 2024", "Google Marketing Live 2023"],
    following: 750, followers: 15000, posts: 380, joinDate: "Apr 2020", rating: 4.6,
  },
];

const allDepartments = [...new Set(employees.map(e => e.department))].sort();
const fmtNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */

const EmployeeProfile = () => {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [selected, setSelected] = useState<EmployeeProfile | null>(null);
  const [tab, setTab] = useState<"about" | "settings">("about");
  const [sideTab, setSideTab] = useState<"about" | "skills">("about");

  const filtered = employees.filter(e => {
    const ms = e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase());
    return ms && (deptFilter === "All" || e.department === deptFilter);
  });

  const deptCounts = allDepartments.map(d => ({ name: d, count: employees.filter(e => e.department === d).length }));

  if (selected) return <ProfileView emp={selected} tab={tab} setTab={setTab} sideTab={sideTab} setSideTab={setSideTab} onBack={() => { setSelected(null); setTab("about"); setSideTab("about"); }} />;

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Employee Profile</h1>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900 placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500 shrink-0" />
            <button onClick={() => setDeptFilter("All")} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${deptFilter === "All" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
              All ({employees.length})
            </button>
            {deptCounts.map(d => {
              const dc = getDeptColor(d.name);
              return (
                <button key={d.name} onClick={() => setDeptFilter(d.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${deptFilter === d.name ? `${dc.bg} ${dc.text} ${dc.border} ring-2 ring-offset-1 ring-blue-200` : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
                  {d.name} ({d.count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ Enhanced Card Grid ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(emp => {
          const sc = statusConfig[emp.status];
          const dc = getDeptColor(emp.department);
          return (
            <div key={emp.id} onClick={() => setSelected(emp)}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative">
              {/* Gradient Banner with Pattern Overlay */}
              <div className="relative">
                <div className={`h-24 bg-gradient-to-r ${getBanner(emp.name)} relative overflow-hidden rounded-t-2xl`}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
                  {/* Status Glass Pill */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold backdrop-blur-md bg-white/20 text-white shadow-lg ${sc.glow}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} animate-pulse`} />{emp.status}
                    </span>
                  </div>
                  {/* Rating Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/20 backdrop-blur-md text-white">
                      <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" /> {emp.rating}
                    </span>
                  </div>
                </div>
                {/* Avatar — overlapping banner */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-10">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getColor(emp.name)} border-4 border-white flex items-center justify-center text-white text-xl font-bold shadow-xl group-hover:scale-105 transition-transform duration-300`}>
                    {getInitials(emp.name)}
                  </div>
                </div>
              </div>

              <div className="pt-12 pb-5 px-5 text-center">
                <h3 className="text-[15px] font-bold text-gray-900">{emp.name}</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">{emp.role}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border mt-2 ${dc.bg} ${dc.text} ${dc.border}`}>{emp.department}</span>

                {/* Mini Stats */}
                <div className="flex items-center justify-center gap-5 mt-4 pt-3 border-t border-gray-100">
                  <StatMini icon={<Heart className="w-3 h-3 text-red-400" />} value={fmtNum(emp.followers)} label="Followers" />
                  <div className="w-px h-8 bg-gray-100" />
                  <StatMini icon={<MessageCircle className="w-3 h-3 text-blue-400" />} value={String(emp.posts)} label="Posts" />
                  <div className="w-px h-8 bg-gray-100" />
                  <StatMini icon={<UserCheck className="w-3 h-3 text-emerald-400" />} value={String(emp.following)} label="Following" />
                </div>

                {/* Hover CTA */}
                <div className="mt-4 overflow-hidden">
                  <div className="flex items-center justify-center gap-2 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[11px] font-semibold shadow-lg shadow-blue-500/25 flex items-center gap-1.5">
                      View Profile <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="col-span-full text-center py-16 text-gray-400 text-sm">No employees found.</div>}
      </div>
    </div>
  );
};

const StatMini = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="text-center">
    <div className="flex items-center justify-center gap-1">
      {icon}
      <span className="text-xs font-bold text-gray-900">{value}</span>
    </div>
    <p className="text-[8px] text-gray-400 mt-0.5">{label}</p>
  </div>
);

/* ═══════════════════════════════════════════
   Profile View
   ═══════════════════════════════════════════ */

const ProfileView = ({ emp, tab, setTab, sideTab, setSideTab, onBack }: {
  emp: EmployeeProfile; tab: "about" | "settings"; setTab: (t: "about" | "settings") => void;
  sideTab: "about" | "skills"; setSideTab: (t: "about" | "skills") => void; onBack: () => void;
}) => {
  const [settings, setSettings] = useState({
    username: emp.email.split("@")[0], currentPassword: "", newPassword: "",
    firstName: emp.name.split(" ")[0], lastName: emp.name.split(" ").slice(1).join(" "),
    city: emp.city, settingsEmail: emp.email, country: emp.country, address: emp.address,
    profileVisibility: true, taskNotifications: true, friendNotifications: false,
  });
  const setSetting = (k: string, v: string | boolean) => setSettings(prev => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-5 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to All Employees
      </button>

      <div className="flex gap-5">
        {/* ─── Left Sidebar ─── */}
        <div className="w-[300px] shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            {/* Banner with Overlay Pattern */}
            <div className="relative">
              <div className={`h-32 bg-gradient-to-br ${getBanner(emp.name)} relative overflow-hidden rounded-t-2xl`}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
              </div>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-10">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getColor(emp.name)} border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-2xl`}>
                  {getInitials(emp.name)}
                </div>
              </div>
            </div>

            <div className="pt-16 pb-5 px-5 text-center">
              <h2 className="text-lg font-bold text-gray-900">{emp.name}</h2>
              <p className="text-xs text-gray-500">{emp.role}</p>
              <div className="flex items-center justify-center gap-1.5 mt-2 text-[11px] text-gray-500">
                <MapPin className="w-3 h-3 text-blue-500" />{emp.address}, {emp.city}
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-1 text-[11px] text-gray-500">
                <Phone className="w-3 h-3 text-green-500" />{emp.mobile}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 mt-5">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl py-3 px-2 border border-blue-100">
                  <p className="text-lg font-bold text-blue-700">{emp.following}</p>
                  <p className="text-[9px] text-blue-500 font-medium">Following</p>
                </div>
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl py-3 px-2 border border-rose-100">
                  <p className="text-lg font-bold text-rose-700">{fmtNum(emp.followers)}</p>
                  <p className="text-[9px] text-rose-500 font-medium">Followers</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl py-3 px-2 border border-emerald-100">
                  <p className="text-lg font-bold text-emerald-700">{emp.posts}</p>
                  <p className="text-[9px] text-emerald-500 font-medium">Posts</p>
                </div>
              </div>
            </div>

            {/* Side Tabs */}
            <div className="border-t border-gray-100">
              <div className="flex">
                {(["about", "skills"] as const).map(t => (
                  <button key={t} onClick={() => setSideTab(t)}
                    className={`flex-1 py-3 text-xs font-semibold text-center transition-colors border-b-2 ${sideTab === t ? "text-blue-600 border-blue-600 bg-blue-50/50" : "text-gray-400 border-transparent hover:text-gray-600"}`}>
                    {t === "about" ? "About" : "Skills"}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {sideTab === "about" ? (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-600 leading-relaxed">{emp.bio}</p>
                    <SideInfoRow icon={<Mail className="w-3.5 h-3.5 text-red-500" />} label="Email" value={emp.email} />
                    <SideInfoRow icon={<Phone className="w-3.5 h-3.5 text-green-500" />} label="Phone" value={emp.mobile} />
                    <SideInfoRow icon={<Globe className="w-3.5 h-3.5 text-blue-500" />} label="Location" value={`${emp.city}, ${emp.country}`} />
                    <SideInfoRow icon={<Calendar className="w-3.5 h-3.5 text-purple-500" />} label="Joined" value={emp.joinDate} />
                    <SideInfoRow icon={<Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />} label="Rating" value={`${emp.rating} / 5.0`} />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {emp.skills.map(skill => (
                      <div key={skill.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold text-gray-700">{skill.name}</span>
                          <span className="text-[10px] font-bold text-blue-600">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${skill.level}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Right Content ─── */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Tab Bar */}
            <div className="flex border-b border-gray-200">
              {([{ id: "about", label: "About Me", icon: User }, { id: "settings", label: "Settings", icon: Settings }] as const).map(t => (
                <button key={t.id} onClick={() => setTab(t.id as "about" | "settings")}
                  className={`flex items-center gap-2 px-8 py-4 text-sm font-semibold transition-all border-b-[3px] ${tab === t.id ? "text-blue-600 border-blue-600 bg-blue-50/30" : "text-gray-400 border-transparent hover:text-gray-600"}`}>
                  <t.icon className="w-4 h-4" /> {t.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {tab === "about" ? <AboutTab emp={emp} /> : <SettingsTab settings={settings} setSetting={setSetting} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SideInfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-gray-50/80 border border-gray-100">
    {icon}
    <div className="min-w-0">
      <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
      <p className="text-[11px] text-gray-700 font-medium truncate">{value}</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   About Me Tab
   ═══════════════════════════════════════════ */

const AboutTab = ({ emp }: { emp: EmployeeProfile }) => (
  <div className="space-y-7 animate-fade-in">
    {/* Info Header Cards */}
    <div>
      <SectionTitle icon={<User className="w-4 h-4" />} title="About" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <InfoCard icon={<User className="w-4 h-4 text-blue-500" />} label="Full Name" value={emp.name} color="blue" />
        <InfoCard icon={<Phone className="w-4 h-4 text-green-500" />} label="Mobile" value={emp.mobile} color="green" />
        <InfoCard icon={<Mail className="w-4 h-4 text-red-500" />} label="Email" value={emp.email} color="red" />
        <InfoCard icon={<MapPin className="w-4 h-4 text-purple-500" />} label="Location" value={`${emp.city}, ${emp.country}`} color="purple" />
      </div>
    </div>

    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
      <p className="text-sm text-gray-700 leading-relaxed">{emp.bio}</p>
    </div>

    {/* Education Timeline */}
    <div>
      <SectionTitle icon={<GraduationCap className="w-4 h-4" />} title="Education" />
      <div className="mt-4 space-y-0 relative pl-6">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-400 to-blue-100 rounded-full" />
        {emp.education.map((ed, i) => (
          <div key={i} className="relative pb-4 last:pb-0">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-500 border-[3px] border-white shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            <div className="bg-white rounded-lg border border-gray-100 p-3 ml-2 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-800 font-medium">{ed.title}</p>
              <p className="text-[10px] text-blue-600 font-semibold mt-1">{ed.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Experience Timeline */}
    <div>
      <SectionTitle icon={<Briefcase className="w-4 h-4" />} title="Experience" />
      <div className="mt-4 space-y-0 relative pl-6">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-400 to-emerald-100 rounded-full" />
        {emp.experience.map((ex, i) => (
          <div key={i} className="relative pb-4 last:pb-0">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-white shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            <div className="bg-white rounded-lg border border-gray-100 p-3 ml-2 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-800 font-medium">{ex.title}</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-1">{ex.period}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Conferences */}
    <div>
      <SectionTitle icon={<Award className="w-4 h-4" />} title="Conferences, Courses & Workshops" />
      <div className="mt-4 grid gap-2">
        {emp.conferences.map((conf, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/60 border border-amber-100 hover:bg-amber-50 transition-colors">
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3 h-3 text-amber-600" />
            </div>
            <p className="text-sm text-gray-700">{conf}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-2.5">
    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">{icon}</div>
    <h3 className="text-sm font-bold text-gray-900">{title}</h3>
  </div>
);

const infoColors: Record<string, string> = {
  blue: "bg-blue-50 border-blue-100", green: "bg-emerald-50 border-emerald-100",
  red: "bg-red-50 border-red-100", purple: "bg-purple-50 border-purple-100",
};

const InfoCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => (
  <div className={`rounded-xl p-3.5 border ${infoColors[color]} hover:shadow-sm transition-shadow`}>
    <div className="flex items-center gap-2 mb-1.5">{icon}<span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{label}</span></div>
    <p className="text-[12px] font-semibold text-gray-800 truncate" title={value}>{value}</p>
  </div>
);

/* ═══════════════════════════════════════════
   Settings Tab
   ═══════════════════════════════════════════ */

const SettingsTab = ({ settings, setSetting }: {
  settings: Record<string, string | boolean>; setSetting: (k: string, v: string | boolean) => void;
}) => (
  <div className="space-y-8 animate-fade-in">
    {/* Security */}
    <div className="bg-gray-50/80 rounded-xl p-6 border border-gray-100">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center"><Shield className="w-4 h-4 text-red-600" /></div>
        <h3 className="text-sm font-bold text-gray-900">Security <span className="text-gray-400 font-normal">Settings</span></h3>
      </div>
      <div className="space-y-4">
        <SettingsInput label="Username" value={settings.username as string} onChange={v => setSetting("username", v)} icon={<User className="w-4 h-4 text-gray-400" />} />
        <SettingsInput label="Current Password" value={settings.currentPassword as string} onChange={v => setSetting("currentPassword", v)} type="password" icon={<Lock className="w-4 h-4 text-gray-400" />} />
        <SettingsInput label="New Password" value={settings.newPassword as string} onChange={v => setSetting("newPassword", v)} type="password" icon={<Lock className="w-4 h-4 text-gray-400" />} />
        <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg transition-shadow">
          Save Password
        </button>
      </div>
    </div>

    {/* Account */}
    <div className="bg-gray-50/80 rounded-xl p-6 border border-gray-100">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><Settings className="w-4 h-4 text-blue-600" /></div>
        <h3 className="text-sm font-bold text-gray-900">Account <span className="text-gray-400 font-normal">Settings</span></h3>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <SettingsInput label="First Name" value={settings.firstName as string} onChange={v => setSetting("firstName", v)} icon={<User className="w-4 h-4 text-gray-400" />} />
          <SettingsInput label="Last Name" value={settings.lastName as string} onChange={v => setSetting("lastName", v)} icon={<User className="w-4 h-4 text-gray-400" />} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <SettingsInput label="City" value={settings.city as string} onChange={v => setSetting("city", v)} icon={<Building2 className="w-4 h-4 text-gray-400" />} />
          <SettingsInput label="Email" value={settings.settingsEmail as string} onChange={v => setSetting("settingsEmail", v)} icon={<Mail className="w-4 h-4 text-gray-400" />} />
          <SettingsInput label="Country" value={settings.country as string} onChange={v => setSetting("country", v)} icon={<Globe className="w-4 h-4 text-gray-400" />} />
        </div>
        <SettingsInput label="Address" value={settings.address as string} onChange={v => setSetting("address", v)} textarea icon={<MapPin className="w-4 h-4 text-gray-400" />} />
      </div>

      <div className="mt-6 space-y-3">
        {[
          { key: "profileVisibility", label: "Profile Visibility For Everyone", icon: <Eye className="w-4 h-4 text-blue-500" /> },
          { key: "taskNotifications", label: "New task notifications", icon: <Bell className="w-4 h-4 text-amber-500" /> },
          { key: "friendNotifications", label: "New friend request notifications", icon: <UserCheck className="w-4 h-4 text-emerald-500" /> },
        ].map(item => (
          <label key={item.key} className="flex items-center gap-3 cursor-pointer py-2.5 px-4 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-gray-200 group">
            <input type="checkbox" checked={settings[item.key] as boolean} onChange={e => setSetting(item.key, e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            {item.icon}
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{item.label}</span>
          </label>
        ))}
      </div>

      <button className="mt-5 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg transition-shadow">
        Save Changes
      </button>
    </div>
  </div>
);

const SettingsInput = ({ label, value, onChange, type = "text", textarea, icon }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean; icon?: React.ReactNode;
}) => (
  <div>
    {textarea ? (
      <fieldset className="border border-gray-200 bg-white rounded-xl px-4 pt-2 pb-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-colors hover:border-gray-300">
        <legend className="text-[11px] font-semibold text-gray-500 px-1">{label}</legend>
        <div className="flex gap-2">
          {icon && <span className="mt-1 shrink-0">{icon}</span>}
          <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
            className="w-full text-sm text-gray-900 bg-transparent focus:outline-none resize-none" />
        </div>
      </fieldset>
    ) : (
      <fieldset className="border border-gray-200 bg-white rounded-xl px-4 pt-1 pb-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-colors hover:border-gray-300">
        <legend className="text-[11px] font-semibold text-gray-500 px-1">{label}</legend>
        <div className="flex items-center gap-2">
          <input type={type} value={value} onChange={e => onChange(e.target.value)}
            className="flex-1 text-sm text-gray-900 bg-transparent focus:outline-none" />
          {icon}
        </div>
      </fieldset>
    )}
  </div>
);

export default EmployeeProfile;
