import { useState } from "react";
import {
  FileText, CalendarDays, Hash, Briefcase, Users,
  StickyNote, Save, RotateCcw, Settings, Shield
} from "lucide-react";
import { StyledDropdown } from "@/components/ui/StyledDropdown";

interface LeavePolicy {
  policyName: string;
  leaveType: string;
  leaveDuration: string;
  carryForwardLimit: number;
  leaveQuota: number;
  department: string;
  approvalWorkflow: string;
  notes: string;
  enableEncashment: boolean;
  enableHalfDay: boolean;
}

const leaveTypeOptions = ["Sick Leave", "Casual Leave", "Medical Leave", "Maternity Leave", "Paid Leave", "Unpaid Leave", "Work From Home"];
const departmentOptions = ["IT", "HR", "Finance", "Marketing", "Engineering", "Design", "Sales", "All Departments"];
const workflowOptions = ["Manager", "HR Manager", "Department Head", "CEO", "Auto Approve"];

const defaultPolicy: LeavePolicy = {
  policyName: "",
  leaveType: "",
  leaveDuration: "",
  carryForwardLimit: 0,
  leaveQuota: 12,
  department: "",
  approvalWorkflow: "Manager",
  notes: "",
  enableEncashment: false,
  enableHalfDay: false,
};

const LeaveSettings = () => {
  const [form, setForm] = useState<LeavePolicy>({ ...defaultPolicy });
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof LeavePolicy>(k: K, v: LeavePolicy[K]) => {
    setForm(prev => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors(prev => { const n = { ...prev }; delete n[k]; return n; });
    setSaved(false);
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!form.policyName.trim()) newErrors.policyName = "Leave Policy Name is required.";
    if (!form.leaveType) newErrors.leaveType = "Leave Type is required.";
    if (!form.department) newErrors.department = "Department is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setForm({ ...defaultPolicy });
    setErrors({});
    setSaved(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-900">Leave Settings</h1>

      {/* Settings Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-600" />
          <span className="text-[14px] font-bold text-gray-900">Leave Settings</span>
        </div>

        <div className="p-6 space-y-5">
          {/* Row 1: Policy Name + Leave Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldInput
                icon={<FileText className="w-4 h-4 text-gray-400" />}
                label="Leave Policy Name"
                value={form.policyName}
                onChange={v => set("policyName", v)}
                error={errors.policyName}
              />
            </div>
            <div>
              <StyledDropdown
                label="Leave Type"
                required
                value={form.leaveType}
                options={leaveTypeOptions}
                onChange={v => set("leaveType", v)}
                icon={<Briefcase className="w-4 h-4" />}
              />
              {errors.leaveType && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.leaveType}</p>}
            </div>
          </div>

          {/* Row 2: Leave Duration + Carry Forward */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldInput
              icon={<CalendarDays className="w-4 h-4 text-gray-400" />}
              label="Leave Duration (Days)"
              value={form.leaveDuration}
              onChange={v => set("leaveDuration", v)}
            />
            <FieldInput
              icon={<RotateCcw className="w-4 h-4 text-gray-400" />}
              label="Carry Forward Limit"
              value={String(form.carryForwardLimit)}
              type="number"
              onChange={v => set("carryForwardLimit", parseInt(v) || 0)}
            />
          </div>

          {/* Row 3: Leave Quota + Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldInput
              icon={<Hash className="w-4 h-4 text-gray-400" />}
              label="Leave Quota (Days)"
              value={String(form.leaveQuota)}
              type="number"
              onChange={v => set("leaveQuota", parseInt(v) || 0)}
            />
            <div>
              <StyledDropdown
                label="Select Department"
                required
                value={form.department}
                options={departmentOptions}
                onChange={v => set("department", v)}
                icon={<Users className="w-4 h-4" />}
              />
              {errors.department && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.department}</p>}
            </div>
          </div>

          {/* Row 4: Approval Workflow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StyledDropdown
              label="Leave Approval Workflow"
              required
              value={form.approvalWorkflow}
              options={workflowOptions}
              onChange={v => set("approvalWorkflow", v)}
              icon={<Shield className="w-4 h-4" />}
            />
          </div>

          {/* Row 5: Notes */}
          <FieldTextarea
            label="Notes (Optional)"
            value={form.notes}
            onChange={v => set("notes", v)}
          />

          {/* Checkboxes */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.enableEncashment}
                onChange={e => set("enableEncashment", e.target.checked)}
                className="w-4.5 h-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-[13px] text-gray-700 font-medium group-hover:text-gray-900 transition-colors">Enable Leave Encashment</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.enableHalfDay}
                onChange={e => set("enableHalfDay", e.target.checked)}
                className="w-4.5 h-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-[13px] text-gray-700 font-medium group-hover:text-gray-900 transition-colors">Enable Half Day Leave</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>

          {/* Success Message */}
          {saved && (
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl animate-fade-in">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <Save className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-[13px] font-semibold text-emerald-700">Leave settings saved successfully!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Reusable Fields
   ═══════════════════════════════════════════ */
const FieldInput = ({ icon, label, value, onChange, type = "text", error }: {
  icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; type?: string; error?: string;
}) => (
  <div>
    <fieldset className={`border rounded-lg px-3 pt-1 pb-2 transition-colors ${error ? "border-red-400 hover:border-red-500" : "border-gray-300 hover:border-gray-400"}`}>
      <legend className={`text-[11px] font-semibold px-1 ${error ? "text-red-600" : "text-gray-700"}`}>{label}*</legend>
      <div className="flex items-center gap-2">
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          className="flex-1 text-sm text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400" />
        {icon}
      </div>
    </fieldset>
    {error && <p className="text-red-500 text-[11px] mt-1 font-medium">{error}</p>}
  </div>
);

const FieldTextarea = ({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) => (
  <fieldset className="border border-gray-300 rounded-lg px-3 pt-1 pb-2 hover:border-gray-400 transition-colors">
    <legend className="text-[11px] font-semibold text-gray-700 px-1">{label}</legend>
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
      className="w-full text-sm text-gray-900 bg-transparent focus:outline-none resize-y placeholder:text-gray-400" />
  </fieldset>
);

export default LeaveSettings;
