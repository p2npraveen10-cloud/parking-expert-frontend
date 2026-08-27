import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

/**
 * A user (from localStorage "user") is considered "company onboarded"
 * once a companyName is present. Google OAuth first-time users are
 * created with no company info, so this evaluates to false for them
 * until they complete /manage → Company tab.
 */
export const isCompanyOnboarded = (user) => Boolean(user?.companyName?.trim());

export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

export const Field = ({ label, icon: Icon, children }) => (
  <label className="block">
    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
      {Icon && <Icon size={13} strokeWidth={2.4} />}
      {label}
    </span>
    {children}
  </label>
);

export const PlateBadge = ({ value, size = "md" }) => {
  const sizes = {
    sm: "text-xs px-2 py-1",
    md: "text-base px-3 py-1.5",
    lg: "text-xl px-4 py-2",
  };
  return (
    <div className="inline-flex items-stretch rounded-md overflow-hidden border-2 border-slate-800 shadow-sm shrink-0">
      <div className="bg-blue-800 flex items-center justify-center px-1">
        <span
          className="text-white font-bold leading-none"
          style={{ fontSize: size === "lg" ? 8 : 6, writingMode: "vertical-rl" }}
        >
          IND
        </span>
      </div>
      <div
        className={`bg-white font-mono font-bold tracking-widest text-slate-900 uppercase flex items-center ${sizes[size]}`}
      >
        {value || "———— —"}
      </div>
    </div>
  );
};

export const StatusPill = ({ status }) => {
  const isGreen = status === "PAID" || status === "ENABLED" || status === "ACTIVE";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        isGreen
          ? "bg-emerald-50 text-emerald-600"
          : "bg-amber-50 text-amber-600"
      }`}
    >
      {status}
    </span>
  );
};

export const RippleButton = ({
  children,
  className = "",
  style,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  gradient = "linear-gradient(135deg, #2563EB, #06B6D4)",
}) => {
  const [ripples, setRipples] = React.useState([]);

  const handleClick = (e) => {
    if (disabled || loading) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now() + Math.random();
    setRipples((r) => [...r, { id, x, y, size }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
    onClick?.(e);
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.015, boxShadow: "0 12px 28px -8px rgba(37,99,235,0.45)" } : {}}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{ background: gradient, ...style }}
    >
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0, opacity: 0.45 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
        />
      ))}
      <span className="relative flex items-center justify-center gap-2">
        {loading ? <Loader2 size={16} className="animate-spin" /> : children}
      </span>
    </motion.button>
  );
};

export const formatDateTime = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

export const formatDuration = (minutes) => {
  if (minutes == null) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};