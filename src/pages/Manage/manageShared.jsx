import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, X, Sparkles } from "lucide-react";

export const FONT_DISPLAY = "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif";
export const FONT_BODY = "'Inter', system-ui, sans-serif";
export const FONT_MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

export const TOKENS = {
  ink: "#0B1220",
  inkSoft: "#5B6478",
  bg: "#EEF1F7",
  surface: "#FFFFFF",
  line: "#E3E7F0",
  blue: "#2554EB",
  cyan: "#06B6D4",
  indigo: "#4F3FF0",
  amber: "#F0A93A",
  success: "#0E9F6E",
  danger: "#E11D48",
};

export const inputClass =
  "w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] outline-none transition " +
  "placeholder:text-slate-400 focus:ring-4 disabled:bg-slate-50 disabled:text-slate-500";

export const inputStyle = { fontFamily: FONT_BODY, borderColor: TOKENS.line, color: TOKENS.ink };

export const glossyInputClass =
  "w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] font-medium outline-none transition-all " +
  "placeholder:text-slate-400 focus:border-transparent focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 " +
  "shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)]";

export const glossyInputStyle = {
  fontFamily: FONT_BODY,
  borderColor: TOKENS.line,
  color: TOKENS.ink,
  "--tw-ring-color": "rgba(37,84,235,0.18)",
};

export const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

    @keyframes pe-fade-scale {
      from { opacity: 0; transform: translateY(6px) scale(0.994); }
      to { opacity: 1; transform: none; }
    }
    @keyframes pe-fade-up {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pe-shimmer {
      from { background-position: -420px 0; }
      to { background-position: 420px 0; }
    }
    @keyframes pe-pulse-ring {
      0% { box-shadow: 0 0 0 0 rgba(14,159,110,0.45); }
      70% { box-shadow: 0 0 0 7px rgba(14,159,110,0); }
      100% { box-shadow: 0 0 0 0 rgba(14,159,110,0); }
    }
    @keyframes pe-dropdown-in {
      from { opacity: 0; transform: translateY(-6px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes pe-modal-in {
      from { opacity: 0; transform: translateY(14px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes pe-backdrop-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes pe-refresh-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .pe-panel-transition { animation: pe-fade-scale 0.32s cubic-bezier(0.22,1,0.36,1) both; }
    .pe-animate-up { animation: pe-fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both; }
    .pe-dropdown-panel { animation: pe-dropdown-in 0.16s cubic-bezier(0.22,1,0.36,1) both; transform-origin: top; }
    .pe-modal-panel { animation: pe-modal-in 0.28s cubic-bezier(0.22,1,0.36,1) both; }
    .pe-backdrop { animation: pe-backdrop-in 0.2s ease both; }
    .pe-shimmer {
      background-image: linear-gradient(90deg, #eef1f7 0px, #f8f9fc 40px, #eef1f7 80px);
      background-size: 420px 100%;
      animation: pe-shimmer 1.4s ease-in-out infinite;
    }
    .pe-live-dot { animation: pe-pulse-ring 1.8s cubic-bezier(0.4,0,0.6,1) infinite; }
    .pe-refresh-spin { animation: pe-refresh-spin 0.9s linear infinite; }

    .pe-ticket { transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease, border-color 0.25s ease; }
    .pe-ticket:hover {
      transform: translateY(-3px);
      box-shadow: 0 20px 36px -16px rgba(15,23,42,0.22), 0 4px 10px -4px rgba(15,23,42,0.08);
      border-color: #c9d2e6;
    }

    .pe-tab-indicator { transition: left 0.32s cubic-bezier(0.65,0,0.35,1), width 0.32s cubic-bezier(0.65,0,0.35,1); }
    .pe-tab-btn { transition: color 0.2s ease; }

    .pe-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
    .pe-scrollbar::-webkit-scrollbar-thumb { background: #cbd3e3; border-radius: 999px; }

    .pe-focus-ring:focus-visible { outline: 2px solid #2554EB; outline-offset: 2px; }

    .pe-icon-btn { transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease; }
    .pe-icon-btn:hover { transform: translateY(-1px); }
    .pe-icon-btn:active { transform: translateY(0); }

    @media (prefers-reduced-motion: reduce) {
      .pe-live-dot, .pe-shimmer, .pe-animate-up, .pe-panel-transition, .pe-dropdown-panel,
      .pe-modal-panel, .pe-backdrop, .pe-refresh-spin { animation: none !important; }
      .pe-ticket:hover { transform: none; }
    }

    @media print {
      body * { visibility: hidden; }
      .pe-print-area, .pe-print-area * { visibility: visible; }
      .pe-print-area {
        position: absolute; left: 0; top: 0; width: 100%;
        box-shadow: none !important; border: none !important;
      }
      .pe-no-print { display: none !important; }
    }
  `}</style>
);

export const RippleButton = ({ children, className = "", variant = "primary", ...props }) => {
  const base =
    "pe-focus-ring inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold " +
    "transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap";
  const styles =
    variant === "primary"
      ? "text-white shadow-[0_8px_20px_-8px_rgba(37,84,235,0.55)] hover:shadow-[0_10px_26px_-8px_rgba(37,84,235,0.65)]"
      : variant === "danger"
        ? "border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
        : variant === "ghost"
          ? "text-slate-500 hover:bg-slate-100"
          : "border bg-white hover:bg-slate-50";
  return (
    <button
      className={`${base} ${styles} ${className}`}
      style={{
        fontFamily: FONT_BODY,
        ...(variant === "primary" ? { background: `linear-gradient(135deg, ${TOKENS.blue}, ${TOKENS.cyan})` } : {}),
        ...(variant === "secondary" ? { borderColor: TOKENS.line, color: TOKENS.ink } : {}),
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export const IconButton = ({ icon: Icon, label, tone = "default", ...props }) => {
  const tones = {
    default: { color: TOKENS.inkSoft, hoverBg: "#F1F5F9" },
    blue: { color: TOKENS.blue, hoverBg: "#EEF2FF" },
    danger: { color: TOKENS.danger, hoverBg: "#FEF2F2" },
    success: { color: TOKENS.success, hoverBg: "#E9FBF3" },
  };
  const t = tones[tone] || tones.default;
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="pe-icon-btn pe-focus-ring flex h-8 w-8 items-center justify-center rounded-lg border bg-white"
      style={{ borderColor: TOKENS.line, color: t.color }}
      onMouseEnter={(e) => (e.currentTarget.style.background = t.hoverBg)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
      {...props}
    >
      <Icon size={14} />
    </button>
  );
};

export const ComingSoon = ({ icon: Icon, title, description, eta }) => (
  <div className="pe-animate-up relative overflow-hidden rounded-2xl border bg-white p-10 text-center shadow-sm" style={{ borderColor: TOKENS.line }}>
    <div className="relative flex flex-col items-center">
      <div
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-white"
        style={{ background: `linear-gradient(135deg, ${TOKENS.blue}, ${TOKENS.cyan})`, boxShadow: "0 10px 24px -10px rgba(37,84,235,0.55)" }}
      >
        <Icon size={22} />
      </div>
      <h2 className="text-[17px] font-extrabold tracking-tight" style={{ fontFamily: FONT_DISPLAY, color: TOKENS.ink }}>
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-[12.5px] leading-relaxed" style={{ color: TOKENS.inkSoft, fontFamily: FONT_BODY }}>
        {description}
      </p>
      <div
        className="mt-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold"
        style={{ borderColor: TOKENS.line, color: TOKENS.inkSoft, fontFamily: FONT_BODY }}
      >
        <Sparkles size={12} className="text-amber-500" />
        In design &middot; {eta}
      </div>
    </div>
  </div>
);

export function formatMemberSince(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function formatDateTimeLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatCurrency(amount) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return "—";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

export const pad2 = (n) => String(n ?? 0).padStart(2, "0");

export const STATUS_STYLES = {
  ACTIVE: { bg: "#E9FBF3", text: "#0E9F6E", dot: "#0E9F6E", label: "Active", live: true },
  COMPLETED: { bg: "#F1F3F8", text: "#5B6478", dot: "#94A0B8", label: "Exited", live: false },
  EXITED: { bg: "#F1F3F8", text: "#5B6478", dot: "#94A0B8", label: "Exited", live: false },
  CANCELLED: { bg: "#FEF2F2", text: "#E11D48", dot: "#E11D48", label: "Cancelled", live: false },
};

export const FREQUENCY_OPTIONS = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
];

export const DAY_OF_WEEK_OPTIONS = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 7, label: "Sun" },
];

export const TIMEZONE_OPTIONS = Array.from(
  new Set(
    [
      typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : null,
      "UTC",
      "Asia/Kolkata",
      "Asia/Dubai",
      "Asia/Singapore",
      "Asia/Tokyo",
      "Europe/London",
      "Europe/Berlin",
      "America/New_York",
      "America/Chicago",
      "America/Los_Angeles",
      "Australia/Sydney",
    ].filter(Boolean)
  )
);

export const formatScheduleSummary = (f) => {
  const h12 = ((f.hourOfDay + 11) % 12) + 1;
  const meridiem = f.hourOfDay >= 12 ? "PM" : "AM";
  const time = `${h12}:${pad2(f.minuteOfHour)} ${meridiem}`;
  if (f.frequency === "WEEKLY") {
    const day = DAY_OF_WEEK_OPTIONS.find((d) => d.value === f.dayOfWeek)?.label || "Mon";
    return `Every ${day} at ${time}`;
  }
  if (f.frequency === "MONTHLY") {
    return `On day ${f.dayOfMonth} of every month at ${time}`;
  }
  return `Every day at ${time}`;
};

export const extractScheduleList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data?.content)) return payload.data.content;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (payload && typeof payload === "object" && (payload.id != null || payload.jobKey || payload.frequency)) {
    return [payload];
  }
  if (payload?.data && typeof payload.data === "object" && (payload.data.id != null || payload.data.jobKey)) {
    return [payload.data];
  }
  return [];
};

export const CONTENT_TYPE_OPTIONS = [
  { value: "", label: "All" },
  { value: "pdf", label: "PDF" },
  { value: "excel", label: "Excel" },
  { value: "image", label: "Image" },
  { value: "json", label: "JSON" },
  { value: "csv", label: "CSV" },
];

export const FieldShell = ({ label, icon: Icon, children }) => (
  <label className="flex flex-col gap-1.5">
    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
      {Icon && <Icon size={11} className="text-slate-400" />}
      {label}
    </span>
    {children}
  </label>
);

export const Dropdown = ({ value, onChange, options, icon: Icon, width = "auto" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const selected = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative" ref={ref} style={{ width }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="pe-focus-ring flex w-full items-center gap-2 rounded-xl border bg-white py-2.5 pl-3 pr-2.5 text-[12.5px] font-semibold outline-none transition hover:border-slate-300"
        style={{ borderColor: open ? TOKENS.blue : TOKENS.line, color: TOKENS.ink, fontFamily: FONT_BODY }}
      >
        {Icon && <Icon size={13} className="shrink-0 text-slate-400" />}
        <span className="flex-1 truncate text-left">{selected?.label}</span>
        <ChevronDown size={14} className="shrink-0 text-slate-400 transition-transform" style={{ transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {open && (
        <div
          className="pe-dropdown-panel absolute left-0 top-[calc(100%+6px)] z-50 min-w-full overflow-hidden rounded-xl border bg-white p-1.5 shadow-[0_16px_32px_-12px_rgba(15,23,42,0.28)]"
          style={{ borderColor: TOKENS.line }}
        >
          {options.map((o) => {
            const active = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => { onChange(o.value); setOpen(false); }}
                className="flex w-full items-center justify-between gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-left text-[12.5px] font-medium transition"
                style={{
                  fontFamily: FONT_BODY,
                  color: active ? TOKENS.blue : TOKENS.ink,
                  background: active ? "#EEF2FF" : "transparent",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#F5F7FB"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                {o.label}
                {active && <Check size={13} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Modal = ({ open, onClose, children, width = 620, closeOnBackdrop = true }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="pe-backdrop pe-no-print fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => { if (closeOnBackdrop && e.target === e.currentTarget) onClose?.(); }}
    >
      <div
        className="pe-modal-panel relative w-full overflow-hidden rounded-2xl bg-white shadow-[0_30px_70px_-20px_rgba(15,23,42,0.45)]"
        style={{ maxWidth: width, maxHeight: "88vh" }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export const ModalHeader = ({ icon: Icon, title, subtitle, onClose, accent }) => (
  <div className="flex items-start justify-between gap-3 border-b px-5 py-4" style={{ borderColor: TOKENS.line }}>
    <div className="flex items-center gap-3">
      {Icon && (
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ background: accent || `linear-gradient(135deg, ${TOKENS.blue}, ${TOKENS.cyan})` }}
        >
          <Icon size={17} />
        </div>
      )}
      <div>
        <h3 className="text-[15px] font-extrabold tracking-tight" style={{ fontFamily: FONT_DISPLAY, color: TOKENS.ink }}>
          {title}
        </h3>
        {subtitle && <p className="mt-0.5 text-[11.5px]" style={{ color: TOKENS.inkSoft }}>{subtitle}</p>}
      </div>
    </div>
    <button
      type="button"
      onClick={onClose}
      className="pe-focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
      aria-label="Close"
    >
      <X size={16} />
    </button>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="pe-animate-up rounded-2xl border bg-white p-6" style={{ borderColor: TOKENS.line }}>
    <div className="flex items-center gap-4">
      <div className="pe-shimmer h-20 w-20 rounded-2xl" />
      <div className="flex-1 space-y-2">
        <div className="pe-shimmer h-4 w-40 rounded" />
        <div className="pe-shimmer h-3 w-28 rounded" />
      </div>
    </div>
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="pe-shimmer h-2.5 w-16 rounded" />
          <div className="pe-shimmer h-3.5 w-24 rounded" />
        </div>
      ))}
    </div>
  </div>
);