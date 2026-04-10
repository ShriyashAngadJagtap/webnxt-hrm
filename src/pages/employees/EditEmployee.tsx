import { useState, useRef, useEffect } from "react";
import {
  Search, Edit3, X, User, GraduationCap, MapPin,
  Briefcase, IndianRupee, Mail, Phone, CalendarDays,
  Settings2, ChevronDown, Check, Filter
} from "lucide-react";
import { StyledDropdown } from "@/components/ui/StyledDropdown";

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  mobile: string;
  joiningDate: string;
  email: string;
  gender: "Male" | "Female";
  address: string;
  status: "Active" | "Inactive" | "On Leave";
  degree: string;
  birthDate: string;
  salary: number;
  lastPromotion: string;
  workLocation: "Office" | "Remote" | "Hybrid";
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
  "Charles Taylor": "from-sky-500 to-cyan-600",
  "Sarah Miller": "from-lime-500 to-green-600",
  "Olivia White": "from-rose-500 to-red-600",
  "Noah Harris": "from-indigo-500 to-violet-600",
  "Rahul Sharma": "from-yellow-500 to-amber-600",
  "Priya Patel": "from-purple-500 to-fuchsia-600",
};
const getInitials = (n: string) => n.split(" ").map(w => w[0]).join("").toUpperCase();
const getColor = (n: string) => avatarColors[n] || "from-gray-400 to-gray-500";

const initialEmployees: Employee[] = [
  { id: "EMP-001", name: "Shriyash Jagtap", role: "Full Stack Developer", department: "Engineering", mobile: "9876543210", joiningDate: "2023-01-15", email: "shriyash.jagtap@webnxt.com", gender: "Male", address: "123 Tech Park, Pune, Maharashtra", status: "Active", degree: "B.E.", birthDate: "2000-05-12", salary: 85000, lastPromotion: "2024-06-01", workLocation: "Office" },
  { id: "EMP-002", name: "Jitesh Naidu", role: "Frontend Developer", department: "Engineering", mobile: "9876543211", joiningDate: "2023-03-20", email: "jitesh.naidu@webnxt.com", gender: "Male", address: "456 IT Hub, Hyderabad, Telangana", status: "Active", degree: "B.Tech", birthDate: "1999-08-22", salary: 78000, lastPromotion: "2024-08-15", workLocation: "Hybrid" },
  { id: "EMP-003", name: "Shubham Jadhav", role: "Backend Developer", department: "Engineering", mobile: "9876543212", joiningDate: "2023-06-01", email: "shubham.jadhav@webnxt.com", gender: "Male", address: "789 Software Lane, Mumbai, Maharashtra", status: "Active", degree: "M.Tech", birthDate: "1998-11-30", salary: 82000, lastPromotion: "2025-01-10", workLocation: "Office" },
  { id: "EMP-004", name: "John Doe", role: "Developer", department: "Java", mobile: "1234567890", joiningDate: "2018-03-01", email: "john.doe@email.com", gender: "Male", address: "123 Elm Street, City, State, ...", status: "On Leave", degree: "C.E.", birthDate: "2018-02-25", salary: 70000, lastPromotion: "2021-06-15", workLocation: "Office" },
  { id: "EMP-005", name: "Jane Smith", role: "Designer", department: "UI/UX", mobile: "2345678901", joiningDate: "2019-05-20", email: "jane.smith@email.com", gender: "Female", address: "456 Oak Avenue, City, State...", status: "Active", degree: "B.Des", birthDate: "1995-07-14", salary: 65000, lastPromotion: "2022-03-20", workLocation: "Remote" },
  { id: "EMP-006", name: "Mike Johnson", role: "Project Manager", department: "Management", mobile: "3456789012", joiningDate: "2020-09-01", email: "mike.johnson@email.com", gender: "Male", address: "789 Pine Road, City, State, ...", status: "Inactive", degree: "MBA", birthDate: "1988-12-05", salary: 95000, lastPromotion: "2023-01-10", workLocation: "Office" },
  { id: "EMP-007", name: "Lisa Wang", role: "Tester", department: "Quality Assurance", mobile: "4567890123", joiningDate: "2021-05-15", email: "lisa.wang@email.com", gender: "Female", address: "321 Maple Street, City, Stat...", status: "On Leave", degree: "B.Sc", birthDate: "1997-03-18", salary: 58000, lastPromotion: "2023-09-01", workLocation: "Hybrid" },
  { id: "EMP-008", name: "Alex Brown", role: "DevOps Engineer", department: "Operations", mobile: "5678901234", joiningDate: "2017-11-10", email: "alex.brown@email.com", gender: "Male", address: "654 Cedar Lane, City, State...", status: "Active", degree: "M.Sc", birthDate: "1990-09-25", salary: 88000, lastPromotion: "2022-12-01", workLocation: "Office" },
  { id: "EMP-009", name: "Emily Jones", role: "Data Scientist", department: "Data Analytics", mobile: "6789012345", joiningDate: "2022-01-25", email: "emily.jones@email.com", gender: "Female", address: "987 Birch Boulevard, City, S...", status: "Inactive", degree: "Ph.D", birthDate: "1993-06-30", salary: 105000, lastPromotion: "2024-02-15", workLocation: "Remote" },
  { id: "EMP-010", name: "Charles Taylor", role: "System Administrator", department: "IT Support", mobile: "7890123456", joiningDate: "2019-08-01", email: "charles.taylor@email.com", gender: "Male", address: "159 Spruce Circle, City, Stat...", status: "On Leave", degree: "B.Tech", birthDate: "1991-01-12", salary: 72000, lastPromotion: "2023-05-20", workLocation: "Office" },
  { id: "EMP-011", name: "Sarah Miller", role: "Marketing Specialist", department: "Marketing", mobile: "8901234567", joiningDate: "2020-04-20", email: "sarah.miller@email.com", gender: "Female", address: "258 Walnut Street, City, Sta...", status: "Active", degree: "BBA", birthDate: "1994-11-08", salary: 62000, lastPromotion: "2023-07-01", workLocation: "Hybrid" },
  { id: "EMP-012", name: "Olivia White", role: "HR Manager", department: "Human Resources", mobile: "9012345678", joiningDate: "2018-12-10", email: "olivia.white@email.com", gender: "Female", address: "366 Ash Drive, City, State, 1...", status: "Inactive", degree: "MBA", birthDate: "1989-04-22", salary: 92000, lastPromotion: "2022-11-15", workLocation: "Office" },
  { id: "EMP-013", name: "Noah Harris", role: "Sales Executive", department: "Sales", mobile: "0123456789", joiningDate: "2019-09-30", email: "noah.harris@email.com", gender: "Male", address: "111 Market Street, City, Sta...", status: "On Leave", degree: "B.Com", birthDate: "1996-08-17", salary: 55000, lastPromotion: "2023-03-10", workLocation: "Office" },
  { id: "EMP-014", name: "Rahul Sharma", role: "Cloud Architect", department: "Engineering", mobile: "9988776655", joiningDate: "2022-07-01", email: "rahul.sharma@webnxt.com", gender: "Male", address: "42 Cloud Avenue, Bangalore, Karnataka", status: "Active", degree: "M.Tech", birthDate: "1992-02-14", salary: 115000, lastPromotion: "2024-11-01", workLocation: "Remote" },
  { id: "EMP-015", name: "Priya Patel", role: "UI/UX Lead", department: "Design", mobile: "8877665544", joiningDate: "2021-10-15", email: "priya.patel@webnxt.com", gender: "Female", address: "78 Creative Hub, Ahmedabad, Gujarat", status: "Active", degree: "M.Des", birthDate: "1994-09-03", salary: 90000, lastPromotion: "2025-02-01", workLocation: "Hybrid" },
];

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Inactive: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  "On Leave": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
};

const allDepartments = [...new Set(initialEmployees.map(e => e.department))].sort();
const statuses: Employee["status"][] = ["Active", "Inactive", "On Leave"];
const genders: Employee["gender"][] = ["Male", "Female"];
const workLocations: Employee["workLocation"][] = ["Office", "Remote", "Hybrid"];
const departmentsList = ["Engineering", "Java", "UI/UX", "Management", "Quality Assurance", "Operations", "Data Analytics", "IT Support", "Marketing", "Human Resources", "Sales", "Design", "Digital Marketing", "Finance", "DevOps"];

const deptColors: Record<string, { bg: string; text: string; border: string }> = {
  Engineering: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Java: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  "UI/UX": { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  Management: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  "Quality Assurance": { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  Operations: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "Data Analytics": { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  "IT Support": { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  Marketing: { bg: "bg-lime-50", text: "text-lime-700", border: "border-lime-200" },
  "Human Resources": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  Sales: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Design: { bg: "bg-fuchsia-50", text: "text-fuchsia-700", border: "border-fuchsia-200" },
};
const getDeptColor = (d: string) => deptColors[d] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };

const EditEmployee = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [editEmp, setEditEmp] = useState<Employee | null>(null);

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "All" || e.department === deptFilter;
    return matchSearch && matchDept;
  });

  const deptCounts = allDepartments.map(d => ({
    name: d,
    count: employees.filter(e => e.department === d).length,
  }));

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Edit Employee</h1>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search employees..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500 shrink-0" />
            <button
              onClick={() => setDeptFilter("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                deptFilter === "All"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              All ({employees.length})
            </button>
            {deptCounts.map(d => {
              const dc = getDeptColor(d.name);
              const active = deptFilter === d.name;
              return (
                <button
                  key={d.name}
                  onClick={() => setDeptFilter(d.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                    active
                      ? `${dc.bg} ${dc.text} ${dc.border} ring-2 ring-offset-1 ring-blue-200`
                      : `bg-white text-gray-600 border-gray-200 hover:${dc.bg} hover:${dc.text}`
                  }`}
                >
                  {d.name} ({d.count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(emp => {
          const sc = statusConfig[emp.status];
          const dc = getDeptColor(emp.department);
          return (
            <div key={emp.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              {/* Card Banner */}
              <div className={`h-16 bg-gradient-to-r ${getColor(emp.name)} relative`}>
                <div className="absolute -bottom-6 left-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getColor(emp.name)} border-[3px] border-white flex items-center justify-center text-white text-base font-bold shadow-lg`}>
                    {getInitials(emp.name)}
                  </div>
                </div>
                {/* Status Badge */}
                <div className="absolute top-2.5 right-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${sc.bg} ${sc.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {emp.status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="pt-9 pb-4 px-4">
                <h3 className="text-sm font-bold text-gray-900 truncate">{emp.name}</h3>
                <p className="text-[11px] text-gray-500 mt-0.5 truncate">{emp.role}</p>

                {/* Department Tag */}
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${dc.bg} ${dc.text} ${dc.border}`}>
                    {emp.department}
                  </span>
                </div>

                {/* Info */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-gray-600">
                    <Mail className="w-3 h-3 text-red-500 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-600">
                    <Phone className="w-3 h-3 text-green-500 shrink-0" />
                    <span>{emp.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-600">
                    <IndianRupee className="w-3 h-3 text-blue-500 shrink-0" />
                    <span>₹{emp.salary.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setEditEmp({ ...emp })}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Employee
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400 text-sm">
            No employees found for the selected department.
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-xs text-gray-500 text-center">
        Showing {filtered.length} of {employees.length} employees
      </div>

      {/* ═══════════════════════════════════════════
          Edit Employee Modal
         ═══════════════════════════════════════════ */}
      {editEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setEditEmp(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getColor(editEmp.name)} border-2 border-white/30 flex items-center justify-center text-white text-sm font-bold`}>
                  {getInitials(editEmp.name)}
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">Edit Employee: {editEmp.name}</h2>
                  <p className="text-white/70 text-[11px]">{editEmp.id} • {editEmp.department}</p>
                </div>
              </div>
              <button onClick={() => setEditEmp(null)} className="text-white/80 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FieldInput icon={<User className="w-4 h-4 text-gray-400" />} label="Name" value={editEmp.name} onChange={v => setEditEmp({ ...editEmp, name: v })} />
                <StyledDropdown icon={<Briefcase className="w-4 h-4" />} label="Department" required value={editEmp.department} options={departmentsList} onChange={v => setEditEmp({ ...editEmp, department: v })} searchable />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FieldInput icon={<Briefcase className="w-4 h-4 text-gray-400" />} label="Role" value={editEmp.role} onChange={v => setEditEmp({ ...editEmp, role: v })} />
                <FieldInput icon={<GraduationCap className="w-4 h-4 text-gray-400" />} label="Degree" value={editEmp.degree} onChange={v => setEditEmp({ ...editEmp, degree: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FieldInput icon={<Phone className="w-4 h-4 text-gray-400" />} label="Mobile" value={editEmp.mobile} onChange={v => setEditEmp({ ...editEmp, mobile: v })} />
                <FieldInput icon={<Mail className="w-4 h-4 text-gray-400" />} label="Email" value={editEmp.email} onChange={v => setEditEmp({ ...editEmp, email: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FieldInput icon={<CalendarDays className="w-4 h-4 text-gray-400" />} label="Birth Date" value={editEmp.birthDate} type="date" onChange={v => setEditEmp({ ...editEmp, birthDate: v })} />
                <StyledDropdown icon={<User className="w-4 h-4" />} label="Gender" required value={editEmp.gender} options={genders} onChange={v => setEditEmp({ ...editEmp, gender: v as Employee["gender"] })} />
              </div>
              <fieldset className="border border-gray-300 rounded-lg px-3 pt-1 pb-2 hover:border-gray-400 transition-colors">
                <legend className="text-[11px] font-semibold text-gray-700 px-1">Address</legend>
                <textarea value={editEmp.address} onChange={e => setEditEmp({ ...editEmp, address: e.target.value })} rows={2}
                  className="w-full text-sm text-gray-900 bg-transparent focus:outline-none resize-none" />
              </fieldset>
              <div className="grid grid-cols-2 gap-4">
                <FieldInput icon={<CalendarDays className="w-4 h-4 text-gray-400" />} label="Joining Date" value={editEmp.joiningDate} type="date" onChange={v => setEditEmp({ ...editEmp, joiningDate: v })} />
                <FieldInput icon={<IndianRupee className="w-4 h-4 text-gray-400" />} label="Salary" value={String(editEmp.salary)} type="number" onChange={v => setEditEmp({ ...editEmp, salary: +v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FieldInput icon={<CalendarDays className="w-4 h-4 text-gray-400" />} label="Last Promotion Date" value={editEmp.lastPromotion} type="date" onChange={v => setEditEmp({ ...editEmp, lastPromotion: v })} />
                <StyledDropdown icon={<Settings2 className="w-4 h-4" />} label="Employee Status" required value={editEmp.status} options={statuses} onChange={v => setEditEmp({ ...editEmp, status: v as Employee["status"] })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <StyledDropdown icon={<MapPin className="w-4 h-4" />} label="Work Location" required value={editEmp.workLocation} options={workLocations} onChange={v => setEditEmp({ ...editEmp, workLocation: v as Employee["workLocation"] })} />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setEmployees(prev => prev.map(e => e.id === editEmp.id ? editEmp : e));
                    setEditEmp(null);
                  }}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                >Save</button>
                <button onClick={() => setEditEmp(null)}
                  className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
                >Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Reusable Form Components
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

export default EditEmployee;
