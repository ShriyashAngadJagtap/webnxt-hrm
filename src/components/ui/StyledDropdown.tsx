import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";

interface StyledDropdownProps {
  label: string;
  required?: boolean;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  placeholder?: string;
  searchable?: boolean;
  error?: string;
  compact?: boolean;
  renderOption?: (opt: string, selected: boolean) => React.ReactNode;
}

export const StyledDropdown = ({
  label, required, value, options, onChange,
  icon, placeholder, searchable, error, compact, renderOption,
}: StyledDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hoverIdx, setHoverIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setQuery(""); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = searchable && query
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : [...options];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } return; }
    if (e.key === "Escape") { setOpen(false); setQuery(""); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setHoverIdx(prev => Math.min(filtered.length - 1, prev + 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setHoverIdx(prev => Math.max(0, prev - 1)); }
    if (e.key === "Enter" && hoverIdx >= 0 && hoverIdx < filtered.length) {
      e.preventDefault(); onChange(filtered[hoverIdx]); setOpen(false); setQuery("");
    }
  };

  useEffect(() => {
    if (hoverIdx >= 0 && listRef.current) {
      const el = listRef.current.children[hoverIdx] as HTMLElement;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [hoverIdx]);

  return (
    <div ref={ref} className="relative" onKeyDown={handleKeyDown}>
      <fieldset
        tabIndex={0}
        className={`border-2 rounded-xl cursor-pointer transition-all duration-200 ${
          compact ? "px-3 pt-1 pb-1.5" : "px-3.5 pt-1.5 pb-2.5"
        } ${
          error
            ? "border-red-400 ring-1 ring-red-100 bg-red-50/30"
            : open
              ? "border-blue-500 ring-2 ring-blue-100 bg-blue-50/5"
              : "border-gray-300 hover:border-gray-400 hover:shadow-sm"
        }`}
        onClick={() => { setOpen(!open); setHoverIdx(-1); }}
      >
        <legend className={`text-[11px] font-semibold px-1 transition-colors ${
          error ? "text-red-500" : open ? "text-blue-600" : "text-gray-700"
        }`}>
          {label}{required && <span className="text-red-500">*</span>}
        </legend>
        <div className="flex items-center gap-2">
          {icon && <div className={`shrink-0 transition-colors ${open ? "text-blue-500" : "text-gray-500"}`}>{icon}</div>}
          <span className={`flex-1 text-sm font-medium truncate ${value ? "text-gray-900" : "text-gray-400"}`}>
            {value || placeholder || `Select ${label}`}
          </span>
          <ChevronDown className={`w-4 h-4 shrink-0 transition-all duration-300 ${open ? "rotate-180 text-blue-500" : "text-gray-400"}`} />
        </div>
      </fieldset>
      {error && <p className="text-[11px] text-red-500 font-medium mt-1 ml-1">{error}</p>}

      {open && (
        <div className="absolute z-[60] left-0 right-0 mt-1.5 bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden animate-fade-in"
          style={{ boxShadow: "0 12px 40px -8px rgba(0,0,0,0.15), 0 4px 12px -4px rgba(0,0,0,0.08)" }}>

          {searchable && (
            <div className="px-3 py-2.5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <input value={query} onChange={e => { setQuery(e.target.value); setHoverIdx(0); }}
                  placeholder="Search..." autoFocus onClick={e => e.stopPropagation()}
                  className="flex-1 text-xs text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400" />
                {query && (
                  <button onClick={e => { e.stopPropagation(); setQuery(""); }}
                    className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div ref={listRef} className="max-h-56 overflow-y-auto py-1 scrollbar-thin">
            {filtered.length === 0 ? (
              <div className="px-4 py-4 text-xs text-gray-400 text-center">No options found</div>
            ) : (
              filtered.map((opt, i) => {
                const selected = value === opt;
                const hovered = hoverIdx === i;
                return (
                  <button key={opt} type="button"
                    onMouseEnter={() => setHoverIdx(i)}
                    onClick={e => { e.stopPropagation(); onChange(opt); setOpen(false); setQuery(""); }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] font-medium flex items-center gap-2.5 transition-all duration-150 ${
                      selected
                        ? "bg-blue-50 text-blue-700 font-semibold border-l-[3px] border-blue-500 pl-[13px]"
                        : hovered
                          ? "bg-gradient-to-r from-blue-50/80 to-indigo-50/50 text-blue-600 pl-5 border-l-[3px] border-blue-300"
                          : "text-gray-700 hover:bg-gray-50 border-l-[3px] border-transparent"
                    }`}
                  >
                    {renderOption ? renderOption(opt, selected) : (
                      <>
                        <span className="flex-1">{opt}</span>
                        {selected && (
                          <div className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface ToolbarDropdownProps {
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  allLabel?: string;
  icon?: React.ReactNode;
}

export const ToolbarDropdown = ({ value, options, onChange, allLabel = "All Status", icon }: ToolbarDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const allOpts = ["All", ...options];

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 ${
          open ? "border-blue-400 bg-blue-50 text-blue-700 ring-2 ring-blue-100" : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
        }`}>
        {icon}
        <span>{value === "All" ? allLabel : value}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 min-w-[160px] bg-white rounded-xl border border-gray-200 shadow-2xl z-50 overflow-hidden animate-fade-in"
          style={{ boxShadow: "0 12px 40px -8px rgba(0,0,0,0.15)" }}>
          <div className="py-1">
            {allOpts.map(opt => {
              const isAll = opt === "All";
              const selected = value === opt;
              return (
                <button key={opt} type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-[12px] font-medium flex items-center gap-2 transition-all duration-150 ${
                    selected
                      ? "bg-blue-50 text-blue-700 font-semibold border-l-[3px] border-blue-500 pl-[13px]"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-transparent hover:text-blue-600 border-l-[3px] border-transparent hover:border-blue-200 hover:pl-[13px]"
                  }`}>
                  <span className="flex-1">{isAll ? allLabel : opt}</span>
                  {selected && <Check className="w-3.5 h-3.5 text-blue-500" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

interface PaginationDropdownProps {
  value: number;
  options: number[];
  onChange: (v: number) => void;
}

export const PaginationDropdown = ({ value, options, onChange }: PaginationDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all duration-200 ${
          open ? "border-blue-400 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
        }`}>
        <span>{value}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute bottom-full mb-1.5 left-0 min-w-[64px] bg-white rounded-lg border border-gray-200 shadow-xl z-50 overflow-hidden animate-fade-in">
          <div className="py-0.5">
            {options.map(n => (
              <button key={n} type="button"
                onClick={() => { onChange(n); setOpen(false); }}
                className={`w-full text-center px-3 py-1.5 text-[12px] font-semibold transition-all ${
                  value === n ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-blue-50/50 hover:text-blue-600"
                }`}>
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
