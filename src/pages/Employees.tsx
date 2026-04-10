import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Filter, RefreshCw, Download, UserPlus,
  Edit3, Trash2, CalendarDays, Mail, Phone, X,
  User, GraduationCap, MapPin, Briefcase, IndianRupee,
  ChevronLeft, ChevronRight, Settings2
} from "lucide-react";
import { StyledDropdown, ToolbarDropdown, PaginationDropdown } from "@/components/ui/StyledDropdown";

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

const genderConfig: Record<string, { bg: string; text: string }> = {
  Male: { bg: "bg-blue-100", text: "text-blue-700" },
  Female: { bg: "bg-pink-100", text: "text-pink-700" },
};

const departments = ["Java", "UI/UX", "Management", "Quality Assurance", "Operations", "Data Analytics", "IT Support", "Marketing", "Human Resources", "Sales", "Engineering", "Design", "Digital Marketing"];
const statuses: Employee["status"][] = ["Active", "Inactive", "On Leave"];
const genders: Employee["gender"][] = ["Male", "Female"];
const workLocations: Employee["workLocation"][] = ["Office", "Remote", "Hybrid"];

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [deleteEmp, setDeleteEmp] = useState<Employee | null>(null);

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const allSelected = paged.length > 0 && paged.every(e => selectedIds.includes(e.id));

  const toggleAll = () => {
    if (allSelected) setSelectedIds(prev => prev.filter(id => !paged.some(e => e.id === id)));
    else setSelectedIds(prev => [...new Set([...prev, ...paged.map(e => e.id)])]);
  };
  const toggleOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleDelete = () => {
    if (deleteEmp) {
      setEmployees(prev => prev.filter(e => e.id !== deleteEmp.id));
      setDeleteEmp(null);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <h1 className="text-xl font-bold text-gray-900">All Employees</h1>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          {/* Left: Tab + Search */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">All Employees</span>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg w-44 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <ToolbarDropdown value={statusFilter} options={statuses} onChange={v => { setStatusFilter(v); setPage(1); }} allLabel="All Status" />
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Filter"><Filter className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title="Download"><Download className="w-4 h-4" /></button>
            <button onClick={() => navigate("/employees/add")} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="Add Employee"><UserPlus className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded" />
                </th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Mobile</th>
                <th className="px-4 py-3 font-semibold">Joining Date</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Gender</th>
                <th className="px-4 py-3 font-semibold">Address</th>
                <th className="px-4 py-3 font-semibold">Employee Status</th>
                <th className="px-4 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(emp => {
                const sc = statusConfig[emp.status];
                const gc = genderConfig[emp.gender];
                return (
                  <tr key={emp.id} className="border-t border-gray-50 hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedIds.includes(emp.id)} onChange={() => toggleOne(emp.id)} className="rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getColor(emp.name)} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                          {getInitials(emp.name)}
                        </div>
                        <span className="font-medium text-gray-900 whitespace-nowrap">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{emp.role}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{emp.department}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-green-500" />
                        <span className="text-gray-700">{emp.mobile}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-3 h-3 text-blue-500" />
                        <span className="text-gray-700">{emp.joiningDate}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-red-500" />
                        <span className="text-gray-700">{emp.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${gc.bg} ${gc.text}`}>
                        {emp.gender}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate" title={emp.address}>{emp.address}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setEditEmp({ ...emp })} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Edit">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteEmp(emp)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length === 0 && (
                <tr><td colSpan={11} className="text-center py-10 text-gray-400 text-sm">No employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>Items per page:</span>
            <PaginationDropdown value={perPage} options={[10, 15, 20, 25]} onChange={v => { setPerPage(v); setPage(1); }} />
          </div>
          <div className="flex items-center gap-3">
            <span>{(page - 1) * perPage + 1} – {Math.min(page * perPage, filtered.length)} of {filtered.length}</span>
            <div className="flex gap-1">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
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
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Settings2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-white font-bold text-base">Edit Employee: {editEmp.name}</h2>
              </div>
              <button onClick={() => setEditEmp(null)} className="text-white/80 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              {/* Row 1: Name + Department */}
              <div className="grid grid-cols-2 gap-4">
                <FieldInput icon={<User className="w-4 h-4 text-gray-400" />} label="Name" value={editEmp.name} onChange={v => setEditEmp({ ...editEmp, name: v })} />
                <StyledDropdown icon={<Briefcase className="w-4 h-4" />} label="Department" required value={editEmp.department} options={departments} onChange={v => setEditEmp({ ...editEmp, department: v })} searchable />
              </div>
              {/* Row 2: Role + Degree */}
              <div className="grid grid-cols-2 gap-4">
                <FieldInput icon={<Briefcase className="w-4 h-4 text-gray-400" />} label="Role" value={editEmp.role} onChange={v => setEditEmp({ ...editEmp, role: v })} />
                <FieldInput icon={<GraduationCap className="w-4 h-4 text-gray-400" />} label="Degree" value={editEmp.degree} onChange={v => setEditEmp({ ...editEmp, degree: v })} />
              </div>
              {/* Row 3: Mobile + Email */}
              <div className="grid grid-cols-2 gap-4">
                <FieldInput icon={<Phone className="w-4 h-4 text-gray-400" />} label="Mobile" value={editEmp.mobile} onChange={v => setEditEmp({ ...editEmp, mobile: v })} />
                <FieldInput icon={<Mail className="w-4 h-4 text-gray-400" />} label="Email" value={editEmp.email} onChange={v => setEditEmp({ ...editEmp, email: v })} />
              </div>
              {/* Row 4: Birth Date + Gender */}
              <div className="grid grid-cols-2 gap-4">
                <FieldInput icon={<CalendarDays className="w-4 h-4 text-gray-400" />} label="Birth Date" value={editEmp.birthDate} type="date" onChange={v => setEditEmp({ ...editEmp, birthDate: v })} />
                <StyledDropdown icon={<User className="w-4 h-4" />} label="Gender" required value={editEmp.gender} options={genders} onChange={v => setEditEmp({ ...editEmp, gender: v as Employee["gender"] })} />
              </div>
              {/* Row 5: Address */}
              <fieldset className="border border-gray-300 rounded-lg px-3 pt-1 pb-2 hover:border-gray-400 transition-colors">
                <legend className="text-[11px] font-medium text-gray-500 px-1">Address</legend>
                <textarea
                  value={editEmp.address}
                  onChange={e => setEditEmp({ ...editEmp, address: e.target.value })}
                  rows={2}
                  className="w-full text-sm text-gray-900 bg-transparent focus:outline-none resize-none"
                />
              </fieldset>
              {/* Row 6: Joining Date + Salary */}
              <div className="grid grid-cols-2 gap-4">
                <FieldInput icon={<CalendarDays className="w-4 h-4 text-gray-400" />} label="Joining Date" value={editEmp.joiningDate} type="date" onChange={v => setEditEmp({ ...editEmp, joiningDate: v })} />
                <FieldInput icon={<IndianRupee className="w-4 h-4 text-gray-400" />} label="Salary" value={String(editEmp.salary)} type="number" onChange={v => setEditEmp({ ...editEmp, salary: +v })} />
              </div>
              {/* Row 7: Last Promotion + Status */}
              <div className="grid grid-cols-2 gap-4">
                <FieldInput icon={<CalendarDays className="w-4 h-4 text-gray-400" />} label="Last Promotion Date" value={editEmp.lastPromotion} type="date" onChange={v => setEditEmp({ ...editEmp, lastPromotion: v })} />
                <StyledDropdown icon={<Settings2 className="w-4 h-4" />} label="Employee Status" required value={editEmp.status} options={statuses} onChange={v => setEditEmp({ ...editEmp, status: v as Employee["status"] })} />
              </div>
              {/* Row 8: Work Location */}
              <div className="grid grid-cols-2 gap-4">
                <StyledDropdown icon={<MapPin className="w-4 h-4" />} label="Work Location" required value={editEmp.workLocation} options={workLocations} onChange={v => setEditEmp({ ...editEmp, workLocation: v as Employee["workLocation"] })} />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setEmployees(prev => prev.map(e => e.id === editEmp.id ? editEmp : e));
                    setEditEmp(null);
                  }}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                >Save</button>
                <button onClick={() => setEditEmp(null)} className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          Delete Confirmation
         ═══════════════════════════════════════════ */}
      {deleteEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteEmp(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Employee</h3>
            <p className="text-sm text-gray-500 mb-5">Are you sure you want to remove <strong>{deleteEmp.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={handleDelete} className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">Delete</button>
              <button onClick={() => setDeleteEmp(null)} className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
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
    <legend className="text-[11px] font-medium text-gray-500 px-1">{label}*</legend>
    <div className="flex items-center gap-2">
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className="flex-1 text-sm text-gray-900 bg-transparent focus:outline-none" />
      {icon}
    </div>
  </fieldset>
);

export default Employees;
