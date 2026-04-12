import { useState } from "react";
import {
  Search, X, Star, CalendarDays, User, TrendingUp,
  Award, Target, CheckCircle2, Clock, FileEdit,
  BarChart3, ChevronLeft, ChevronRight, Edit3, Trash2,
  Sparkles, Medal, ArrowUpRight, Eye
} from "lucide-react";
import { StyledDropdown } from "@/components/ui/StyledDropdown";

type PerfStatus = "Completed" | "In Review" | "Draft";
type Rating = 1 | 2 | 3 | 4 | 5;

interface PerformanceReview {
  id: string;
  employeeName: string;
  department: string;
  role: string;
  reviewPeriod: string;
  rating: Rating;
  reviewer: string;
  status: PerfStatus;
  goals: string;
  strengths: string;
  improvements: string;
}

const avatarColors: Record<string, string> = {
  "Shriyash Jagtap": "from-blue-500 to-indigo-600",
  "Jitesh Naidu": "from-emerald-500 to-teal-600",
  "Shubham Jadhav": "from-orange-500 to-amber-600",
  "John Doe": "from-violet-500 to-purple-600",
  "Sarah Smith": "from-pink-500 to-rose-500",
  "Robert Johnson": "from-cyan-500 to-blue-500",
  "Michael Brown": "from-amber-500 to-orange-500",
  "Emily Davis": "from-fuchsia-500 to-pink-600",
  "William Wilson": "from-sky-500 to-cyan-600",
  "Jessica Taylor": "from-rose-500 to-red-600",
  "David Anderson": "from-indigo-500 to-violet-600",
  "Linda Thomas": "from-teal-500 to-emerald-600",
  "James Jackson": "from-lime-500 to-green-600",
};
const getInitials = (n: string) => n.split(" ").map(w => w[0]).join("").toUpperCase();
const getColor = (n: string) => avatarColors[n] || "from-gray-400 to-gray-500";

const ratingLabels: Record<Rating, { label: string; color: string; bg: string }> = {
  1: { label: "Needs Improvement", color: "text-red-600", bg: "from-red-500 to-rose-600" },
  2: { label: "Below Average", color: "text-orange-600", bg: "from-orange-500 to-amber-600" },
  3: { label: "Good", color: "text-amber-600", bg: "from-amber-500 to-yellow-500" },
  4: { label: "Very Good", color: "text-blue-600", bg: "from-blue-500 to-indigo-600" },
  5: { label: "Excellent", color: "text-emerald-600", bg: "from-emerald-500 to-teal-600" },
};

const statusConfig: Record<PerfStatus, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  Completed: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle2 },
  "In Review": { bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
  Draft: { bg: "bg-blue-50", text: "text-blue-700", icon: FileEdit },
};

const perfStatuses: PerfStatus[] = ["Completed", "In Review", "Draft"];
const reviewPeriods = ["2024 Q1", "2024 Q2", "2024 Q3", "2024 Q4", "2023 Q1", "2023 Q2", "2023 Q3", "2023 Q4"];
const ratingOptions = ["1 - Needs Improvement", "2 - Below Average", "3 - Good", "4 - Very Good", "5 - Excellent"];
const departments = ["All", "Engineering", "Design", "Marketing", "HR", "Sales", "Finance"];

const initialReviews: PerformanceReview[] = [
  { id: "PR-001", employeeName: "Shriyash Jagtap", department: "Engineering", role: "Full Stack Developer", reviewPeriod: "2024 Q1", rating: 5, reviewer: "HR Manager", status: "Completed", goals: "Lead the WebNxt HRM frontend architecture and deliver all modules on time.", strengths: "Exceptional problem-solving, clean code architecture, proactive communication.", improvements: "Could delegate more tasks to junior developers." },
  { id: "PR-002", employeeName: "Jitesh Naidu", department: "Engineering", role: "Backend Developer", reviewPeriod: "2024 Q1", rating: 4, reviewer: "Shriyash Jagtap", status: "Completed", goals: "Build and optimize Supabase API layer for the HRM system.", strengths: "Strong database skills, reliable delivery, good documentation.", improvements: "Needs to improve frontend collaboration skills." },
  { id: "PR-003", employeeName: "Shubham Jadhav", department: "Design", role: "UI/UX Designer", reviewPeriod: "2024 Q1", rating: 4, reviewer: "Shriyash Jagtap", status: "In Review", goals: "Deliver all UI mockups and design system components.", strengths: "Creative design sense, attention to detail, fast turnaround.", improvements: "Should focus more on accessibility standards." },
  { id: "PR-004", employeeName: "John Doe", department: "Engineering", role: "Senior Developer", reviewPeriod: "2023 Q1", rating: 4, reviewer: "Emily Davis", status: "Completed", goals: "Mentor junior devs and deliver project milestones.", strengths: "Strong leadership, excellent code reviews, reliable.", improvements: "Time management on parallel projects." },
  { id: "PR-005", employeeName: "Sarah Smith", department: "Marketing", role: "Marketing Lead", reviewPeriod: "2023 Q1", rating: 5, reviewer: "Michael Brown", status: "Completed", goals: "Increase brand awareness by 30% through digital campaigns.", strengths: "Creative campaigns, data-driven approach, team motivation.", improvements: "Could improve cross-department communication." },
  { id: "PR-006", employeeName: "Robert Johnson", department: "Engineering", role: "DevOps Engineer", reviewPeriod: "2023 Q1", rating: 3, reviewer: "Emily Davis", status: "In Review", goals: "Implement CI/CD pipeline and monitoring dashboards.", strengths: "Strong infrastructure knowledge, automation skills.", improvements: "Documentation quality and response time." },
  { id: "PR-007", employeeName: "Michael Brown", department: "Sales", role: "Sales Manager", reviewPeriod: "2023 Q2", rating: 4, reviewer: "Sarah Smith", status: "Completed", goals: "Achieve quarterly revenue target of ₹50L.", strengths: "Client relationships, negotiation skills, consistent performer.", improvements: "Should explore new market segments." },
  { id: "PR-008", employeeName: "Emily Davis", department: "HR", role: "HR Manager", reviewPeriod: "2023 Q2", rating: 5, reviewer: "John Doe", status: "Draft", goals: "Streamline hiring process and reduce onboarding time.", strengths: "Empathetic leadership, process optimization, conflict resolution.", improvements: "Adopt more HR tech tools." },
  { id: "PR-009", employeeName: "William Wilson", department: "Finance", role: "Accountant", reviewPeriod: "2023 Q2", rating: 3, reviewer: "Michael Brown", status: "Completed", goals: "Ensure timely financial reporting and compliance.", strengths: "Accuracy, attention to regulations, spreadsheet mastery.", improvements: "Should learn modern accounting software." },
  { id: "PR-010", employeeName: "Jessica Taylor", department: "Design", role: "Graphic Designer", reviewPeriod: "2023 Q3", rating: 4, reviewer: "Sarah Smith", status: "In Review", goals: "Deliver brand identity refresh and marketing materials.", strengths: "Visual creativity, brand consistency, fast iterations.", improvements: "Could be more proactive in suggesting ideas." },
  { id: "PR-011", employeeName: "David Anderson", department: "Engineering", role: "QA Engineer", reviewPeriod: "2023 Q3", rating: 2, reviewer: "Emily Davis", status: "Completed", goals: "Implement automated test suite for all modules.", strengths: "Thorough testing, bug identification.", improvements: "Speed of test execution and automation coverage." },
  { id: "PR-012", employeeName: "Linda Thomas", department: "Marketing", role: "Content Writer", reviewPeriod: "2023 Q3", rating: 5, reviewer: "John Doe", status: "Completed", goals: "Produce 20 blog posts and 5 case studies per quarter.", strengths: "Engaging writing, SEO knowledge, meets deadlines.", improvements: "Video content creation skills." },
  { id: "PR-013", employeeName: "James Jackson", department: "Sales", role: "Sales Executive", reviewPeriod: "2023 Q4", rating: 4, reviewer: "Michael Brown", status: "Draft", goals: "Close 15 enterprise deals in Q4.", strengths: "Persistence, product knowledge, client follow-ups.", improvements: "Presentation skills for large audiences." },
];

const EmployeePerformance = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [editReview, setEditReview] = useState<PerformanceReview | null>(null);
  const [deleteReview, setDeleteReview] = useState<PerformanceReview | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const uniqueEmployees = [...new Map(reviews.map(r => [r.employeeName, r])).values()];

  const filteredCards = uniqueEmployees.filter(e => {
    const ms = e.employeeName.toLowerCase().includes(search.toLowerCase());
    return ms && (deptFilter === "All" || e.department === deptFilter);
  });

  const selectedReviews = selectedEmployee ? reviews.filter(r => r.employeeName === selectedEmployee) : [];
  const selectedInfo = selectedEmployee ? uniqueEmployees.find(e => e.employeeName === selectedEmployee) : null;

  const completed = reviews.filter(r => r.status === "Completed").length;
  const inReview = reviews.filter(r => r.status === "In Review").length;
  const draft = reviews.filter(r => r.status === "Draft").length;
  const avgRating = reviews.length > 0 ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "0";

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Employee Performance</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard gradient="from-blue-500 to-indigo-600" icon={<BarChart3 className="w-5 h-5 text-white" />} label="Total Reviews" value={String(reviews.length)} sub={`${uniqueEmployees.length} employees`} />
        <KpiCard gradient="from-amber-500 to-orange-600" icon={<Star className="w-5 h-5 text-white" />} label="Avg Rating" value={avgRating} sub="Out of 5.0" />
        <KpiCard gradient="from-emerald-500 to-teal-600" icon={<CheckCircle2 className="w-5 h-5 text-white" />} label="Completed" value={String(completed)} sub="Finalized reviews" />
        <KpiCard gradient="from-purple-500 to-fuchsia-600" icon={<Clock className="w-5 h-5 text-white" />} label="In Review" value={String(inReview)} sub="Pending approval" />
        <KpiCard gradient="from-sky-500 to-blue-600" icon={<FileEdit className="w-5 h-5 text-white" />} label="Drafts" value={String(draft)} sub="Work in progress" />
      </div>

      {/* Main Content */}
      {!selectedEmployee ? (
        <>
          {/* Search & Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search employee..." className="pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl w-52 focus:outline-none focus:border-blue-400 text-gray-900 placeholder:text-gray-400" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {departments.map(dept => {
                const count = dept === "All" ? uniqueEmployees.length : uniqueEmployees.filter(e => e.department === dept).length;
                const active = deptFilter === dept;
                return (
                  <button key={dept} onClick={() => setDeptFilter(dept)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                      active
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                    }`}>
                    {dept} <span className={`ml-1 ${active ? "text-white/70" : "text-gray-400"}`}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Employee Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCards.map(emp => {
              const empReviews = reviews.filter(r => r.employeeName === emp.employeeName);
              const latestRating = empReviews[0]?.rating || 0;
              const rl = ratingLabels[latestRating as Rating];
              const completedCount = empReviews.filter(r => r.status === "Completed").length;
              return (
                <div key={emp.employeeName}
                  onClick={() => setSelectedEmployee(emp.employeeName)}
                  className="group relative bg-white rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">

                  {/* Gradient banner */}
                  <div className={`h-20 bg-gradient-to-r ${getColor(emp.employeeName)} relative`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-white/20 backdrop-blur-sm`}>
                        {emp.department}
                      </span>
                    </div>
                  </div>

                  {/* Avatar overlapping banner */}
                  <div className="relative px-4 -mt-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getColor(emp.employeeName)} flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-white`}>
                      {getInitials(emp.employeeName)}
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-2">
                    <h3 className="text-[14px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{emp.employeeName}</h3>
                    <p className="text-[11px] text-gray-500 font-medium">{emp.role}</p>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1.5 mt-3">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= latestRating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                        ))}
                      </div>
                      <span className={`text-[11px] font-bold ${rl?.color || "text-gray-500"}`}>{latestRating}/5</span>
                    </div>
                    <p className={`text-[10px] font-semibold mt-0.5 ${rl?.color || "text-gray-400"}`}>{rl?.label || "No rating"}</p>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-lg font-extrabold text-gray-900">{empReviews.length}</p>
                        <p className="text-[9px] text-gray-400 font-semibold uppercase">Reviews</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-extrabold text-emerald-600">{completedCount}</p>
                        <p className="text-[9px] text-gray-400 font-semibold uppercase">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-extrabold text-blue-600">{emp.reviewPeriod}</p>
                        <p className="text-[9px] text-gray-400 font-semibold uppercase">Latest</p>
                      </div>
                    </div>

                    {/* View Button */}
                    <button className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[11px] font-semibold shadow-sm shadow-blue-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-md">
                      <Eye className="w-3.5 h-3.5" /> View Performance
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredCards.length === 0 && (
              <div className="col-span-full text-center py-16 text-gray-400 text-sm">No employees found.</div>
            )}
          </div>
        </>
      ) : (
        /* ═══════════════════════════════════════════
           Detailed Performance View for Selected Employee
           ═══════════════════════════════════════════ */
        <div className="space-y-5">
          {/* Back Button + Employee Header */}
          <button onClick={() => setSelectedEmployee(null)} className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to All Employees
          </button>

          {selectedInfo && (
            <div className="relative overflow-hidden rounded-2xl">
              <div className={`bg-gradient-to-r ${getColor(selectedInfo.employeeName)} px-7 py-6`}>
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
                <div className="absolute right-16 -bottom-6 w-20 h-20 rounded-full bg-white/5" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getColor(selectedInfo.employeeName)} flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-2 ring-white/30`}>
                      {getInitials(selectedInfo.employeeName)}
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-xl">{selectedInfo.employeeName}</h2>
                      <p className="text-white/60 text-[13px]">{selectedInfo.role} &bull; {selectedInfo.department}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-4 h-4 ${s <= selectedReviews[0]?.rating ? "text-amber-300 fill-amber-300" : "text-white/30"}`} />
                        ))}
                        <span className="text-white/80 text-[12px] font-semibold ml-1">{selectedReviews[0]?.rating}/5 Latest</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm text-center">
                      <p className="text-2xl font-extrabold text-white">{selectedReviews.length}</p>
                      <p className="text-[10px] text-white/60 font-semibold">Total Reviews</p>
                    </div>
                    <div className="bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm text-center">
                      <p className="text-2xl font-extrabold text-emerald-300">{selectedReviews.filter(r => r.status === "Completed").length}</p>
                      <p className="text-[10px] text-white/60 font-semibold">Completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Reviews Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">Performance Reviews</span>
              <button onClick={() => setAddOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors">
                <Sparkles className="w-3.5 h-3.5" /> Add Review
              </button>
            </div>

            <div className="divide-y divide-gray-50">
              {selectedReviews.map(review => {
                const rl = ratingLabels[review.rating];
                const sc = statusConfig[review.status];
                const StatusIcon = sc.icon;
                return (
                  <div key={review.id} className="px-5 py-4 hover:bg-blue-50/20 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Period + Status */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-[13px] font-bold text-gray-900">{review.reviewPeriod}</span>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${sc.bg} ${sc.text}`}>
                            <StatusIcon className="w-3 h-3" /> {review.status}
                          </span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                            ))}
                            <span className={`text-[11px] font-bold ml-1 ${rl.color}`}>{review.rating} - {rl.label}</span>
                          </div>
                        </div>

                        {/* Reviewer */}
                        <div className="flex items-center gap-1.5 mb-3">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-[11px] text-gray-500">Reviewed by <strong className="text-gray-700">{review.reviewer}</strong></span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Target className="w-3.5 h-3.5 text-blue-500" />
                              <span className="text-[10px] font-bold text-blue-700 uppercase">Goals</span>
                            </div>
                            <p className="text-[11px] text-gray-700 leading-relaxed">{review.goals}</p>
                          </div>
                          <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Award className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-[10px] font-bold text-emerald-700 uppercase">Strengths</span>
                            </div>
                            <p className="text-[11px] text-gray-700 leading-relaxed">{review.strengths}</p>
                          </div>
                          <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                              <span className="text-[10px] font-bold text-amber-700 uppercase">Areas to Improve</span>
                            </div>
                            <p className="text-[11px] text-gray-700 leading-relaxed">{review.improvements}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 ml-4 shrink-0">
                        <button onClick={() => setEditReview({ ...review })} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Edit"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteReview(review)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {selectedReviews.length === 0 && (
                <div className="text-center py-14 text-gray-400 text-sm">No performance reviews for this employee.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {(editReview || addOpen) && (
        <ReviewModal
          review={editReview || undefined}
          isAdd={addOpen && !editReview}
          prefillEmployee={selectedEmployee || ""}
          onClose={() => { setEditReview(null); setAddOpen(false); }}
          onSave={r => {
            if (editReview) setReviews(prev => prev.map(x => x.id === r.id ? r : x));
            else setReviews(prev => [...prev, { ...r, id: `PR-${String(prev.length + 1).padStart(3, "0")}` }]);
            setEditReview(null); setAddOpen(false);
          }}
        />
      )}

      {/* Delete */}
      {deleteReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteReview(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Review</h3>
            <p className="text-sm text-gray-500 mb-5">Remove <strong className="text-gray-800">{deleteReview.reviewPeriod}</strong> review for {deleteReview.employeeName}?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => { setReviews(prev => prev.filter(r => r.id !== deleteReview.id)); setDeleteReview(null); }}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-semibold shadow-md shadow-red-500/20 transition-all">Delete</button>
              <button onClick={() => setDeleteReview(null)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   KPI Card
   ═══════════════════════════════════════════ */
const KpiCard = ({ gradient, icon, label, value, sub }: {
  gradient: string; icon: React.ReactNode; label: string; value: string; sub: string;
}) => (
  <div className={`rounded-2xl bg-gradient-to-br ${gradient} px-5 py-5 text-white shadow-lg relative overflow-hidden`}>
    <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10" />
    <div className="absolute -right-1 -bottom-6 w-16 h-16 rounded-full bg-white/5" />
    <div className="relative z-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold opacity-90">{label}</p>
          <p className="text-3xl font-extrabold mt-1">{value}</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">{icon}</div>
      </div>
      <p className="text-[11px] opacity-75 mt-2">{sub}</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   Review Modal (Edit / Add)
   ═══════════════════════════════════════════ */
const emptyReview: PerformanceReview = {
  id: "", employeeName: "", department: "", role: "", reviewPeriod: "2024 Q1",
  rating: 3, reviewer: "", status: "Draft", goals: "", strengths: "", improvements: "",
};

const ReviewModal = ({ review, isAdd, prefillEmployee, onClose, onSave }: {
  review?: PerformanceReview; isAdd: boolean; prefillEmployee: string; onClose: () => void; onSave: (r: PerformanceReview) => void;
}) => {
  const [form, setForm] = useState<PerformanceReview>(review ? { ...review } : { ...emptyReview, employeeName: prefillEmployee });
  const set = <K extends keyof PerformanceReview>(k: K, v: PerformanceReview[K]) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className={`bg-gradient-to-r ${isAdd ? "from-emerald-600 via-teal-600 to-cyan-600" : "from-blue-600 via-indigo-600 to-purple-600"} px-6 py-5`}>
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  {isAdd ? <Sparkles className="w-5 h-5 text-white" /> : <Medal className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">{isAdd ? "Add Performance Review" : `Edit Performance: ${form.employeeName}`}</h2>
                  <p className="text-white/60 text-[11px]">{isAdd ? "Create a new review" : form.reviewPeriod}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"><X className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FieldInput icon={<User className="w-4 h-4 text-gray-400" />} label="Employee Name" value={form.employeeName} onChange={v => set("employeeName", v)} />
            <StyledDropdown label="Review Period" required value={form.reviewPeriod} options={reviewPeriods} onChange={v => set("reviewPeriod", v)} icon={<CalendarDays className="w-4 h-4" />} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StyledDropdown label="Rating" required value={`${form.rating} - ${ratingLabels[form.rating].label}`} options={ratingOptions}
              onChange={v => set("rating", parseInt(v.charAt(0)) as Rating)} icon={<Star className="w-4 h-4" />} />
            <FieldInput icon={<User className="w-4 h-4 text-gray-400" />} label="Reviewer" value={form.reviewer} onChange={v => set("reviewer", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StyledDropdown label="Status" required value={form.status} options={perfStatuses} onChange={v => set("status", v as PerfStatus)} icon={<CheckCircle2 className="w-4 h-4" />} />
          </div>
          <FieldTextarea label="Goals" value={form.goals} onChange={v => set("goals", v)} />
          <FieldTextarea label="Strengths" value={form.strengths} onChange={v => set("strengths", v)} />
          <FieldTextarea label="Areas to Improve" value={form.improvements} onChange={v => set("improvements", v)} />

          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => onSave(form)}
              className={`px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition-all ${
                isAdd ? "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20 hover:shadow-lg" : "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/20 hover:shadow-lg"
              }`}>
              {isAdd ? "Add Review" : "Save"}
            </button>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-semibold shadow-md shadow-red-500/20 hover:shadow-lg transition-all">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Reusable Fields
   ═══════════════════════════════════════════ */
const FieldInput = ({ icon, label, value, onChange, type = "text" }: {
  icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; type?: string;
}) => (
  <fieldset className="border border-gray-300 rounded-lg px-3 pt-1 pb-2 hover:border-gray-400 transition-colors">
    <legend className="text-[11px] font-semibold text-gray-700 px-1">{label}*</legend>
    <div className="flex items-center gap-2">
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="flex-1 text-sm text-gray-900 bg-transparent focus:outline-none" />
      {icon}
    </div>
  </fieldset>
);

const FieldTextarea = ({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) => (
  <fieldset className="border border-gray-300 rounded-lg px-3 pt-1 pb-2 hover:border-gray-400 transition-colors">
    <legend className="text-[11px] font-semibold text-gray-700 px-1">{label}</legend>
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={2}
      className="w-full text-sm text-gray-900 bg-transparent focus:outline-none resize-y" />
  </fieldset>
);

export default EmployeePerformance;
