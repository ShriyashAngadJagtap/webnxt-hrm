import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays, Mail, Phone, Lock, Briefcase,
  MapPin, GraduationCap, User,
  ChevronDown, Check, Search, ChevronLeft, ChevronRight, X
} from "lucide-react";

const departments = [
  "Engineering", "UI/UX", "Management", "Quality Assurance", "Operations",
  "Data Analytics", "IT Support", "Marketing", "Human Resources", "Sales",
  "Design", "Digital Marketing", "Finance", "Java", "DevOps",
];

const genders = ["Male", "Female", "Other"];

const currencyOptions = [
  { symbol: "₹", label: "INR", flag: "🇮🇳" },
  { symbol: "$", label: "USD", flag: "🇺🇸" },
  { symbol: "€", label: "EUR", flag: "🇪🇺" },
  { symbol: "£", label: "GBP", flag: "🇬🇧" },
  { symbol: "¥", label: "JPY", flag: "🇯🇵" },
  { symbol: "A$", label: "AUD", flag: "🇦🇺" },
  { symbol: "C$", label: "CAD", flag: "🇨🇦" },
  { symbol: "Fr", label: "CHF", flag: "🇨🇭" },
  { symbol: "¥", label: "CNY", flag: "🇨🇳" },
  { symbol: "د.إ", label: "AED", flag: "🇦🇪" },
  { symbol: "S$", label: "SGD", flag: "🇸🇬" },
  { symbol: "R", label: "ZAR", flag: "🇿🇦" },
];

interface FormData {
  firstName: string;
  lastName: string;
  gender: string;
  mobile: string;
  password: string;
  rePassword: string;
  designation: string;
  department: string;
  address: string;
  email: string;
  dob: string;
  education: string;
  salary: string;
  salaryCurrency: string;
  image: File | null;
}

const empty: FormData = {
  firstName: "", lastName: "", gender: "", mobile: "",
  password: "", rePassword: "", designation: "", department: "",
  address: "", email: "", dob: "", education: "", salary: "", salaryCurrency: "INR", image: null,
};

interface Errors { [key: string]: string }

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const AddEmployee = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormData>({ ...empty });
  const [errors, setErrors] = useState<Errors>({});
  const [dragOver, setDragOver] = useState(false);

  const set = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.gender) e.gender = "Gender is required";
    if (!form.mobile.trim()) e.mobile = "Mobile is required";
    if (!form.password.trim()) e.password = "Password is required";
    if (form.password !== form.rePassword) e.rePassword = "Passwords do not match";
    if (!form.department) e.department = "Department is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.dob) e.dob = "Date of birth is required";
    if (!form.salary.trim()) e.salary = "Salary is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) navigate("/employees");
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) setForm(prev => ({ ...prev, image: file }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setForm(prev => ({ ...prev, image: file }));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Add Employee</h1>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-900">Add Employee</h2>
        </div>

        <div className="p-6 space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="First Name" required icon={<User className="w-4 h-4 text-gray-500" />} error={errors.firstName}>
              <input type="text" value={form.firstName} onChange={e => set("firstName", e.target.value)}
                placeholder="First Name" className="w-full text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400" />
            </FormField>
            <FormField label="Last Name" icon={<User className="w-4 h-4 text-gray-500" />}>
              <input type="text" value={form.lastName} onChange={e => set("lastName", e.target.value)}
                placeholder="Last Name" className="w-full text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400" />
            </FormField>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <StyledSelect label="Gender" required options={genders} value={form.gender} placeholder="Select Gender"
              onChange={v => set("gender", v)} error={errors.gender} />
            <FormField label="Mobile" required icon={<Phone className="w-4 h-4 text-gray-500" />} error={errors.mobile}>
              <input type="tel" value={form.mobile} onChange={e => set("mobile", e.target.value)}
                placeholder="Mobile Number" className="w-full text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400" />
            </FormField>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Password" required icon={<Lock className="w-4 h-4 text-gray-500" />} error={errors.password}>
              <input type="password" value={form.password} onChange={e => set("password", e.target.value)}
                placeholder="Password" className="w-full text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400" />
            </FormField>
            <FormField label="Re-Enter Password" required icon={<Lock className="w-4 h-4 text-gray-500" />} error={errors.rePassword}>
              <input type="password" value={form.rePassword} onChange={e => set("rePassword", e.target.value)}
                placeholder="Re-Enter Password" className="w-full text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400" />
            </FormField>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Designation" icon={<Briefcase className="w-4 h-4 text-gray-500" />}>
              <input type="text" value={form.designation} onChange={e => set("designation", e.target.value)}
                placeholder="Designation" className="w-full text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400" />
            </FormField>
            <StyledSelect label="Select Department" required options={departments} value={form.department}
              placeholder="Select Department" onChange={v => set("department", v)} error={errors.department} searchable />
          </div>

          {/* Row 5 */}
          <FormField label="Address" icon={<MapPin className="w-4 h-4 text-gray-500" />}>
            <textarea value={form.address} onChange={e => set("address", e.target.value)} placeholder="Full Address" rows={3}
              className="w-full text-sm text-gray-900 bg-transparent focus:outline-none resize-none placeholder:text-gray-400" />
          </FormField>

          {/* Row 6 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Email" required icon={<Mail className="w-4 h-4 text-gray-500" />} error={errors.email}>
              <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                placeholder="Email Address" className="w-full text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400" />
            </FormField>
            <DatePickerField label="Date Of Birth" required value={form.dob}
              onChange={v => set("dob", v)} error={errors.dob} />
          </div>

          {/* Row 7 */}
          <FormField label="Education" icon={<GraduationCap className="w-4 h-4 text-gray-500" />}>
            <textarea value={form.education} onChange={e => set("education", e.target.value)} placeholder="Education details" rows={3}
              className="w-full text-sm text-gray-900 bg-transparent focus:outline-none resize-none placeholder:text-gray-400" />
          </FormField>

          {/* Row 8: Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Upload Image</label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-xl px-5 py-4 flex items-center gap-4 transition-colors cursor-pointer ${
                dragOver ? "border-blue-400 bg-blue-50/40" : "border-gray-300 bg-gray-50/50 hover:border-gray-400"
              }`}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              <span className="px-4 py-1.5 rounded-md border border-blue-500 text-blue-600 text-xs font-semibold hover:bg-blue-50 transition-colors">
                Choose file
              </span>
              <span className="text-sm text-gray-600">
                {form.image ? form.image.name : "or drag and drop file here"}
              </span>
            </div>
          </div>

          {/* Row 9: Salary with Currency */}
          <CurrencyField
            label="Salary" required
            value={form.salary}
            currency={form.salaryCurrency}
            onValueChange={v => set("salary", v)}
            onCurrencyChange={v => setForm(prev => ({ ...prev, salaryCurrency: v }))}
            error={errors.salary}
          />

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button onClick={handleSubmit}
              className="px-6 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold transition-colors">
              Submit
            </button>
            <button onClick={() => navigate("/employees")}
              className="px-6 py-2.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 text-sm font-semibold transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   FormField — basic fieldset wrapper
   ═══════════════════════════════════════════ */
const FormField = ({ label, required, icon, error, children }: {
  label: string; required?: boolean; icon?: React.ReactNode; error?: string; children: React.ReactNode;
}) => (
  <div>
    <fieldset className={`border rounded-lg px-3 pt-1 pb-2 transition-colors ${
      error ? "border-red-400 hover:border-red-500" : "border-gray-300 hover:border-gray-400"
    }`}>
      <legend className="text-[11px] font-semibold text-gray-700 px-1">
        {label}{required && <span className="text-red-500">*</span>}
      </legend>
      <div className="flex items-center gap-2">
        <div className="flex-1">{children}</div>
        {icon}
      </div>
    </fieldset>
    {error && <p className="text-[11px] text-red-500 mt-1 pl-1">{error}</p>}
  </div>
);

/* ═══════════════════════════════════════════
   StyledSelect — custom dropdown with search
   ═══════════════════════════════════════════ */
const StyledSelect = ({ label, required, options, value, placeholder, onChange, error, searchable }: {
  label: string; required?: boolean; options: string[]; value: string;
  placeholder: string; onChange: (v: string) => void; error?: string; searchable?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = searchable && query
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <div ref={ref} className="relative">
      <fieldset className={`border rounded-lg px-3 pt-1 pb-2 transition-colors cursor-pointer ${
        error ? "border-red-400 hover:border-red-500" : open ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-300 hover:border-gray-400"
      }`} onClick={() => setOpen(!open)}>
        <legend className="text-[11px] font-semibold text-gray-700 px-1">
          {label}{required && <span className="text-red-500">*</span>}
        </legend>
        <div className="flex items-center gap-2">
          <span className={`flex-1 text-sm ${value ? "text-gray-900" : "text-gray-400"}`}>
            {value || placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </fieldset>
      {error && <p className="text-[11px] text-red-500 mt-1 pl-1">{error}</p>}

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
          {searchable && (
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 text-xs text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400"
                  onClick={e => e.stopPropagation()}
                  autoFocus
                />
                {query && (
                  <button onClick={e => { e.stopPropagation(); setQuery(""); }} className="text-gray-400 hover:text-gray-600">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-xs text-gray-400 text-center">No results found</div>
            ) : (
              filtered.map(opt => (
                <button
                  key={opt}
                  onClick={e => { e.stopPropagation(); onChange(opt); setOpen(false); setQuery(""); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors ${
                    value === opt
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                    value === opt ? "border-blue-500 bg-blue-500" : "border-gray-300"
                  }`}>
                    {value === opt && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span>{opt}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   DatePickerField — custom calendar popover
   ═══════════════════════════════════════════ */
const DatePickerField = ({ label, required, value, onChange, error }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; error?: string;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();
  const selected = value ? new Date(value + "T00:00:00") : null;
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { day: number; current: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, current: false });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const pickDate = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${viewYear}-${m}-${d}`);
    setOpen(false);
  };

  const isSelected = (day: number) =>
    selected && selected.getFullYear() === viewYear && selected.getMonth() === viewMonth && selected.getDate() === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;

  const formatted = selected
    ? `${selected.getDate()} ${MONTHS[selected.getMonth()].slice(0, 3)} ${selected.getFullYear()}`
    : "";

  return (
    <div ref={ref} className="relative">
      <fieldset
        className={`border rounded-lg px-3 pt-1 pb-2 transition-colors cursor-pointer ${
          error ? "border-red-400 hover:border-red-500" : open ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-300 hover:border-gray-400"
        }`}
        onClick={() => setOpen(!open)}
      >
        <legend className="text-[11px] font-semibold text-gray-700 px-1">
          {label}{required && <span className="text-red-500">*</span>}
        </legend>
        <div className="flex items-center gap-2">
          <span className={`flex-1 text-sm ${value ? "text-gray-900" : "text-gray-400"}`}>
            {formatted || "Select date"}
          </span>
          <CalendarDays className="w-4 h-4 text-blue-500" />
        </div>
      </fieldset>
      {error && <p className="text-[11px] text-red-500 mt-1 pl-1">{error}</p>}

      {open && (
        <div className="absolute left-0 top-full mt-1 w-[310px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 animate-fade-in">
          {/* Month/Year Nav */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-gray-900">{MONTHS[viewMonth]} {viewYear}</span>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-0 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-gray-500 py-1">{d}</div>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-0">
            {cells.map((cell, i) => (
              <button
                key={i}
                disabled={!cell.current}
                onClick={e => { e.stopPropagation(); if (cell.current) pickDate(cell.day); }}
                className={`h-9 w-full rounded-lg text-xs font-medium transition-all ${
                  !cell.current
                    ? "text-gray-300 cursor-default"
                    : isSelected(cell.day)
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : isToday(cell.day)
                    ? "bg-blue-50 text-blue-700 font-bold ring-1 ring-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {cell.day}
              </button>
            ))}
          </div>

          {/* Today shortcut */}
          <div className="mt-3 pt-2 border-t border-gray-100 flex justify-center">
            <button
              onClick={e => {
                e.stopPropagation();
                const m = String(today.getMonth() + 1).padStart(2, "0");
                const d = String(today.getDate()).padStart(2, "0");
                onChange(`${today.getFullYear()}-${m}-${d}`);
                setViewYear(today.getFullYear());
                setViewMonth(today.getMonth());
                setOpen(false);
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-md transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   CurrencyField — input with currency dropdown
   ═══════════════════════════════════════════ */
const CurrencyField = ({ label, required, value, currency, onValueChange, onCurrencyChange, error }: {
  label: string; required?: boolean; value: string; currency: string;
  onValueChange: (v: string) => void; onCurrencyChange: (v: string) => void; error?: string;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cur = currencyOptions.find(c => c.label === currency) || currencyOptions[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <fieldset className={`border rounded-lg px-3 pt-1 pb-2 transition-colors ${
        error ? "border-red-400 hover:border-red-500" : "border-gray-300 hover:border-gray-400"
      }`}>
        <legend className="text-[11px] font-semibold text-gray-700 px-1">
          {label}{required && <span className="text-red-500">*</span>}
        </legend>
        <div className="flex items-center gap-2">
          {/* Currency Selector Button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-100 hover:bg-gray-200 border border-gray-200 text-sm font-semibold text-gray-700 transition-colors shrink-0"
          >
            <span className="text-base">{cur.flag}</span>
            <span className="text-xs font-bold">{cur.symbol}</span>
            <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          <input
            type="number"
            value={value}
            onChange={e => onValueChange(e.target.value)}
            placeholder="Enter amount"
            className="flex-1 text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400"
          />
        </div>
      </fieldset>
      {error && <p className="text-[11px] text-red-500 mt-1 pl-1">{error}</p>}

      {open && (
        <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
          <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Select Currency</span>
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {currencyOptions.map(opt => (
              <button
                key={opt.label}
                onClick={() => { onCurrencyChange(opt.label); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  currency === opt.label
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{opt.flag}</span>
                <span className="font-bold text-sm w-6">{opt.symbol}</span>
                <span className="text-xs text-gray-500">{opt.label}</span>
                {currency === opt.label && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEmployee;
