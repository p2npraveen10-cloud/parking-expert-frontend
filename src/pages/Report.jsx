import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ComposedChart,
} from "recharts";
import {
  CarFront,
  Bike,
  Truck,
  IndianRupee,
  LogIn,
  LogOut as ExitIcon,
  Users,
  Building2,
  Search,
  ChevronDown,
  RefreshCw,
  CalendarDays,
  CalendarRange,
  Phone,
  MapPin,
  Hash,
  QrCode,
  AlertCircle,
  Inbox,
  X,
  Download,
  ZoomIn,
  ImageOff,
  ExternalLink,
  Sparkles,
} from "lucide-react";

import { getDailyReport, getRangeReport } from "../serviceCalls/apiCall";
import { StatusPill } from "../components/shared";

const OCCUPANCY_ICONS = { Car: CarFront, Bike: Bike, Truck: Truck };
const TYPE_COLORS = { Car: "#2563EB", Bike: "#0EA5A0", Truck: "#F59E0B" };
const COLOR_PALETTE = [
  "#2563EB",
  "#0EA5A0",
  "#F59E0B",
  "#7C3AED",
  "#DB2777",
  "#059669",
  "#DC2626",
  "#4F46E5",
  "#0891B2",
  "#CA8A04",
];

const getTypeColor = (type) => {
  const key = type || "Unknown";
  if (TYPE_COLORS[key]) return TYPE_COLORS[key];
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];
};

const getTypeIcon = (type) => OCCUPANCY_ICONS[type] || CarFront;

const inr = (value) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);

const count = (value) => new Intl.NumberFormat("en-IN").format(Math.round(value || 0));

const toApiDate = (isoInputDate) => {
  if (!isoInputDate) return undefined;
  return isoInputDate;
};

const toInputDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const prettyDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const prettyDateTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const extractErrorMessage = (err, fallback) => {
  return (
    err?.message ||
    err?.raw?.response?.data?.message ||
    err?.response?.data?.message ||
    fallback
  );
};

const shortDay = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

/* ------------------------------------------------------------------ */
/*  Count-up hook                                                      */
/* ------------------------------------------------------------------ */

const useCountUp = (target, duration = 900) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame;
    let start = null;
    const from = 0;
    const tick = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (target - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
};

/* ------------------------------------------------------------------ */
/*  Shared building blocks                                             */
/* ------------------------------------------------------------------ */

const containerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const itemRise = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32 } },
};

const StatCard = ({ label, raw, formatter, prefix, icon: Icon, gradient, glow, trend }) => {
  const animated = useCountUp(raw);
  return (
    <motion.div variants={itemRise} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <div className="group relative overflow-hidden rounded-[20px] border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-16px_rgba(15,23,42,0.18)] transition-all duration-300 hover:border-slate-200 hover:shadow-[0_1px_2px_rgba(15,23,42,0.05),0_20px_40px_-16px_rgba(15,23,42,0.22)]">
        {/* ambient glow */}
        <div
          className="pointer-events-none absolute -right-8 -top-10 w-32 h-32 rounded-full opacity-70 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glow }}
        />
        {/* faint top hairline sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.08em] mb-2.5">
              {label}
            </p>
            <p className="text-[26px] leading-none font-extrabold text-slate-900 tabular-nums flex items-center gap-1 tracking-tight">
              {prefix}
              {formatter ? formatter(animated) : count(animated)}
            </p>
            {trend !== undefined && trend !== null && (
              <p
                className={`mt-2 text-[11px] font-semibold flex items-center gap-1 ${
                  trend >= 0 ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
                <span className="text-slate-400 font-medium">vs prior</span>
              </p>
            )}
          </div>
          <div
            className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.35)] ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-3deg]"
            style={{ background: gradient }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/25 to-transparent" />
            <Icon size={19} strokeWidth={2.3} className="relative" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SegmentedTabs = ({ value, onChange }) => {
  const tabs = [
    { key: "daily", label: "Daily report", icon: CalendarDays },
    { key: "range", label: "Range report", icon: CalendarRange },
  ];
  return (
    <div className="relative inline-flex items-center gap-1 rounded-2xl bg-slate-100/80 p-1 ring-1 ring-slate-200/70 shadow-inner">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = value === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="relative px-4 py-2 text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors duration-200"
            style={{ color: active ? "#1e293b" : "#64748b" }}
          >
            {active && (
              <motion.div
                layoutId="report-tab-pill"
                className="absolute inset-0 bg-white rounded-xl shadow-[0_1px_2px_rgba(15,23,42,0.06),0_6px_16px_-6px_rgba(15,23,42,0.25)] ring-1 ring-black/[0.03]"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <Icon size={15} strokeWidth={2.3} className={active ? "text-indigo-600" : ""} />
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

const PremiumTooltip = ({ active, payload, label, money }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/98 backdrop-blur-md px-3.5 py-2.5 shadow-[0_4px_10px_rgba(15,23,42,0.06),0_16px_32px_-12px_rgba(15,23,42,0.28)] text-xs min-w-[130px]">
      <p className="font-bold text-slate-700 mb-1.5 pb-1.5 border-b border-slate-100">{label}</p>
      <div className="space-y-1">
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 text-slate-600">
            <span
              className="w-2 h-2 rounded-full shrink-0 ring-2"
              style={{ background: p.color || p.fill, ringColor: `${p.color || p.fill}22` }}
            />
            <span className="capitalize">{p.name}</span>
            <span className="font-bold text-slate-800 ml-auto tabular-nums">
              {money && (p.dataKey === "revenue")
                ? `₹${inr(p.value)}`
                : count(p.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TypeBreakdown = ({ items, totalLabel, totalValue }) => {
  const max = Math.max(1, ...items.map((i) => i.value));
  const pieData = items.map((i) => ({ name: i.type, value: i.value }));
  return (
    <div className="rounded-[20px] border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-16px_rgba(15,23,42,0.18)] h-full">
      <p className="text-sm font-bold text-slate-800 mb-1 tracking-tight">Vehicle type mix</p>
      <p className="text-xs text-slate-400 mb-3">Breakdown by vehicle type</p>
      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={80}
              paddingAngle={3}
              isAnimationActive
              animationDuration={800}
            >
              {pieData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={getTypeColor(entry.name)}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<PremiumTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-2xl font-bold text-slate-800">{count(totalValue)}</p>
          <p className="text-[11px] text-slate-400 uppercase tracking-wide">{totalLabel}</p>
        </div>
      </div>
      <div className="mt-2 space-y-2">
        {items.map((item) => {
          const Icon = getTypeIcon(item.type);
          const color = getTypeColor(item.type);
          const percent = Math.round((item.value / max) * 100);
          return (
            <div key={item.type} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${color}1A`, color }}
              >
                <Icon size={15} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-slate-700">{item.type}</p>
                  <p className="text-xs font-semibold text-slate-500">{count(item.value)}</p>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4">No vehicle type data.</p>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-16 text-slate-400 rounded-[20px] border border-dashed border-slate-200 bg-slate-50/40">
    <div className="w-12 h-12 rounded-2xl bg-white ring-1 ring-slate-200 flex items-center justify-center shadow-sm">
      <Inbox size={20} strokeWidth={1.7} />
    </div>
    <p className="text-sm font-semibold text-slate-500 mt-3">{label}</p>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-[20px] border border-rose-100 bg-rose-50/40">
    <div className="w-12 h-12 rounded-2xl bg-white ring-1 ring-rose-100 flex items-center justify-center shadow-sm text-rose-500">
      <AlertCircle size={20} strokeWidth={1.8} />
    </div>
    <p className="text-sm font-semibold text-rose-500 mt-3 max-w-md break-words">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-3.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors rounded-lg px-3.5 py-1.5 shadow-sm"
      >
        Try again
      </button>
    )}
  </div>
);

const SkeletonBlock = ({ className }) => (
  <div className={`animate-pulse rounded-[20px] bg-gradient-to-br from-slate-100 to-slate-100/60 ${className}`} />
);

/* ------------------------------------------------------------------ */
/*  Vehicle table                                                       */
/* ------------------------------------------------------------------ */

/* Small bordered detail chip used inside the expanded row */
const DetailChip = ({ icon: Icon, label, children, span }) => (
  <div className={`flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] ${span || ""}`}>
    <div className="w-7 h-7 rounded-lg bg-slate-50 ring-1 ring-slate-100 flex items-center justify-center shrink-0 text-slate-400">
      <Icon size={13} strokeWidth={2.2} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-[0.06em] text-slate-400 font-bold mb-0.5">
        {label}
      </p>
      {children}
    </div>
  </div>
);

/* Renders the ImageKit QR as an actual thumbnail image, never the raw URL.
   Click opens a lightbox for a full-size look, with copy/open/download actions. */
const QrThumbnail = ({ src, vehicleNumber, onOpen }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="w-11 h-11 rounded-xl bg-slate-50 ring-1 ring-slate-100 flex items-center justify-center text-slate-300 shrink-0">
        <ImageOff size={16} strokeWidth={1.8} />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpen(src, vehicleNumber);
      }}
      className="group/qr relative w-11 h-11 rounded-xl overflow-hidden ring-1 ring-slate-200 shrink-0 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)] hover:ring-indigo-300 hover:shadow-md transition-all duration-200"
      title="View QR code"
    >
      <img
        src={src}
        alt={`QR code for ${vehicleNumber || "vehicle"}`}
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-full h-full object-contain p-1 bg-white"
      />
      <div className="absolute inset-0 bg-slate-900/0 group-hover/qr:bg-slate-900/40 flex items-center justify-center transition-colors duration-200">
        <ZoomIn
          size={14}
          className="text-white opacity-0 group-hover/qr:opacity-100 transition-opacity duration-200"
        />
      </div>
    </button>
  );
};

/* Full-size QR lightbox — shows the image itself, with open/download actions,
   and never surfaces the raw ImageKit URL as visible text. */
const QrLightbox = ({ src, vehicleNumber, onClose }) => (
  <AnimatePresence>
    {src && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 6 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-xs rounded-[24px] bg-white p-5 shadow-[0_24px_60px_-16px_rgba(15,23,42,0.45)] ring-1 ring-black/5"
        >
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white ring-1 ring-slate-200 shadow-md flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X size={15} strokeWidth={2.4} />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <QrCode size={14} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.06em] text-slate-400 font-bold">
                QR code
              </p>
              <p className="text-sm font-bold text-slate-800 truncate">
                {vehicleNumber || "Vehicle"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-100 p-4 flex items-center justify-center">
            <img
              src={src}
              alt={`QR code for ${vehicleNumber || "vehicle"}`}
              className="w-56 h-56 object-contain"
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors rounded-xl px-3 py-2.5"
            >
              <ExternalLink size={13} strokeWidth={2.3} />
              Open
            </a>
            <a
              href={src}
              download={`qr-${vehicleNumber || "vehicle"}.png`}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors rounded-xl px-3 py-2.5"
            >
              <Download size={13} strokeWidth={2.3} />
              Download
            </a>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const VehicleRow = ({ vehicle, isOpen, onToggle, onOpenQr }) => {
  const typeName = vehicle.vehicleType?.vehicleType || "Unknown";
  const color = getTypeColor(typeName);
  const Icon = getTypeIcon(typeName);
  const ownerName = [vehicle.firstName, vehicle.lastName].filter(Boolean).join(" ") || "—";

  return (
    <>
      <tr
        onClick={onToggle}
        className="border-b border-slate-50 last:border-0 hover:bg-indigo-50/30 transition-colors duration-150 cursor-pointer select-none"
      >
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ring-1"
              style={{ background: `${color}14`, color, borderColor: `${color}30`, boxShadow: `inset 0 0 0 1px ${color}22` }}
            >
              <Icon size={15} strokeWidth={2.3} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-800 truncate tracking-tight">{vehicle.vehicleNumber}</p>
              <p className="text-[11px] text-slate-400 truncate">{vehicle.vehicleName || typeName}</p>
            </div>
          </div>
        </td>
        <td className="px-3 py-3.5 text-slate-600 font-medium">{ownerName}</td>
        <td className="px-3 py-3.5 text-slate-600 whitespace-nowrap tabular-nums">
          {prettyDateTime(vehicle.entryTime)}
        </td>
        <td className="px-3 py-3.5 text-slate-600 whitespace-nowrap tabular-nums">
          {vehicle.exitTime ? prettyDateTime(vehicle.exitTime) : "—"}
        </td>
        <td className="px-3 py-3.5">
          <StatusPill status={vehicle.status} />
        </td>
        <td className="px-3 py-3.5 text-right font-bold text-slate-900 whitespace-nowrap tabular-nums">
          ₹{inr(vehicle.amount)}
        </td>
        <td className="px-5 py-3.5 text-right">
          <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center ml-auto">
            <ChevronDown
              size={13}
              className={`text-slate-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </td>
      </tr>
      <AnimatePresence initial={false}>
        {isOpen && (
          <tr>
            <td colSpan={7} className="px-5 pb-4 pt-0 bg-gradient-to-b from-slate-50/80 to-slate-50/30">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3">
                  <DetailChip icon={Hash} label="Token">
                    <p className="text-sm font-bold text-slate-700 truncate">
                      {vehicle.tokenNo || "—"}
                    </p>
                  </DetailChip>
                  <DetailChip icon={Phone} label="Contact">
                    <p className="text-sm font-bold text-slate-700 truncate">
                      {vehicle.contactNo || "—"}
                    </p>
                  </DetailChip>
                  <DetailChip icon={MapPin} label="Address" span="sm:col-span-2 lg:col-span-1">
                    <p className="text-sm font-bold text-slate-700 truncate">
                      {vehicle.address || "—"}
                    </p>
                  </DetailChip>

                  {/* QR code — rendered as an image, never as a raw ImageKit URL */}
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                    <QrThumbnail
                      src={vehicle.qrCode}
                      vehicleNumber={vehicle.vehicleNumber}
                      onOpen={onOpenQr}
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.06em] text-slate-400 font-bold mb-0.5">
                        QR code
                      </p>
                      {vehicle.qrCode ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenQr(vehicle.qrCode, vehicle.vehicleNumber);
                          }}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                        >
                          <ZoomIn size={11} strokeWidth={2.4} />
                          View code
                        </button>
                      ) : (
                        <p className="text-sm font-semibold text-slate-400">Not generated</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

const VehicleTable = ({ vehicles }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);
  const [lightbox, setLightbox] = useState({ src: null, vehicleNumber: null });

  const statusOptions = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.status).filter(Boolean));
    return ["ALL", ...Array.from(set)];
  }, [vehicles]);

  const filtered = vehicles.filter((v) => {
    const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      v.vehicleNumber?.toLowerCase().includes(q) ||
      v.tokenNo?.toLowerCase().includes(q) ||
      `${v.firstName || ""} ${v.lastName || ""}`.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const openQr = (src, vehicleNumber) => setLightbox({ src, vehicleNumber });
  const closeQr = () => setLightbox({ src: null, vehicleNumber: null });

  return (
    <div className="rounded-[20px] border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-16px_rgba(15,23,42,0.18)] overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3 bg-gradient-to-r from-slate-50/60 to-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            <CarFront size={15} strokeWidth={2.2} />
          </div>
          <p className="text-sm font-bold text-slate-800 tracking-tight">
            Vehicles <span className="text-slate-400 font-semibold">({filtered.length})</span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search number, token, name"
              className="pl-8 pr-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200/70 focus:border-indigo-200 transition-colors w-56"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200/70 transition-colors"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "ALL" ? "All statuses" : opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-5">
          <EmptyState label="No vehicles match your filters." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.07em] text-slate-400 border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-3 font-bold">Vehicle</th>
                <th className="px-3 py-3 font-bold">Owner</th>
                <th className="px-3 py-3 font-bold">Entry</th>
                <th className="px-3 py-3 font-bold">Exit</th>
                <th className="px-3 py-3 font-bold">Status</th>
                <th className="px-3 py-3 font-bold text-right">Amount</th>
                <th className="px-5 py-3 font-bold text-right w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((vehicle) => (
                <VehicleRow
                  key={vehicle.id}
                  vehicle={vehicle}
                  isOpen={expandedId === vehicle.id}
                  onToggle={() =>
                    setExpandedId(expandedId === vehicle.id ? null : vehicle.id)
                  }
                  onOpenQr={openQr}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <QrLightbox
        src={lightbox.src}
        vehicleNumber={lightbox.vehicleNumber}
        onClose={closeQr}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Company / range hero banner                                        */
/* ------------------------------------------------------------------ */

const ReportHero = ({ companyName, subtitle, onRefresh, refreshing }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="relative overflow-hidden rounded-[22px] p-6 text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_24px_48px_-20px_rgba(76,29,149,0.55)]"
    style={{ background: "linear-gradient(125deg, #3730A3 0%, #5B21B6 45%, #0D9488 100%)" }}
  >
    {/* ambient glows */}
    <div className="pointer-events-none absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
    <div className="pointer-events-none absolute -left-10 -bottom-16 w-44 h-44 rounded-full bg-teal-300/20 blur-3xl" />
    {/* subtle grain / mesh texture via radial dots */}
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    />
    {/* inner top hairline sheen */}
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

    <div className="relative flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-3.5">
        <div className="relative w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 backdrop-blur-md ring-1 ring-white/25 shadow-lg">
          <Building2 size={21} strokeWidth={2.1} />
        </div>
        <div>
          <p className="text-[15px] font-extrabold tracking-tight flex items-center gap-1.5">
            {companyName || "Your company"}
            <Sparkles size={12} className="text-white/60" strokeWidth={2.4} />
          </p>
          <p className="text-xs text-white/75 mt-0.5 font-medium">{subtitle}</p>
        </div>
      </div>
      <button
        onClick={onRefresh}
        className="flex items-center gap-1.5 text-xs font-bold bg-white/15 hover:bg-white/25 transition-colors duration-150 rounded-xl px-3.5 py-2 backdrop-blur-md ring-1 ring-white/20 shadow-sm"
      >
        <motion.span
          animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
          transition={refreshing ? { duration: 0.8, repeat: Infinity, ease: "linear" } : {}}
          className="flex"
        >
          <RefreshCw size={13} strokeWidth={2.4} />
        </motion.span>
        Refresh
      </button>
    </div>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  Daily report view                                                   */
/* ------------------------------------------------------------------ */

const DailyReportView = () => {
  const [date, setDate] = useState(toInputDate(new Date()));
  const [useDefault, setUseDefault] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async (targetDate, skipDate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDailyReport(skipDate ? undefined : toApiDate(targetDate));
      setData(response?.data ?? response ?? null);
    } catch (err) {
      setError(extractErrorMessage(err, "Could not load the daily report."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(date, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = data?.summary;
  const vehicles = data?.vehicles ?? [];
  const byType = summary?.byVehicleType ?? [];

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div className="flex items-center gap-2.5 flex-wrap bg-white rounded-2xl border border-slate-200/70 px-3 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <CalendarDays size={15} className="text-slate-400 shrink-0" />
          <input
            type="date"
            value={date}
            disabled={useDefault}
            onChange={(e) => setDate(e.target.value)}
            className="text-sm font-bold text-slate-700 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200/70 focus:border-indigo-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useDefault}
              onChange={(e) => setUseDefault(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-200"
            />
            Use today (default)
          </label>
        </div>
        <button
          onClick={() => load(date, useDefault)}
          className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 shadow-sm"
        >
          <RefreshCw size={13} strokeWidth={2.4} />
          Generate report
        </button>
      </motion.div>

      {loading && !data && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-28" />
          ))}
        </div>
      )}

      {error && !loading && <ErrorState message={error} onRetry={() => load(date, useDefault)} />}

      {!error && data && (
        <>
          <ReportHero
            companyName={data.companyName}
            subtitle={`Daily report · ${prettyDate(summary?.date || date)}`}
            onRefresh={() => load(date, useDefault)}
            refreshing={loading}
          />

          <motion.div
            variants={containerStagger}
            initial="hidden"
            animate="show"
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <StatCard
              label="Total entries"
              raw={summary?.totalEntries || 0}
              icon={LogIn}
              gradient="linear-gradient(135deg, #7C3AED, #A855F7)"
              glow="rgba(124,58,237,0.16)"
            />
            <StatCard
              label="Total exits"
              raw={summary?.totalExits || 0}
              icon={ExitIcon}
              gradient="linear-gradient(135deg, #D97706, #F59E0B)"
              glow="rgba(217,119,6,0.16)"
            />
            <StatCard
              label="Currently parked"
              raw={summary?.currentlyParked || 0}
              icon={CarFront}
              gradient="linear-gradient(135deg, #2563EB, #06B6D4)"
              glow="rgba(37,99,235,0.16)"
            />
            <StatCard
              label="Revenue"
              raw={summary?.revenue || 0}
              formatter={inr}
              prefix={<IndianRupee size={18} className="mr-0.5" />}
              icon={IndianRupee}
              gradient="linear-gradient(135deg, #0EA5A0, #14B8A6)"
              glow="rgba(14,165,160,0.16)"
            />
          </motion.div>

          <div className="grid lg:grid-cols-[340px_minmax(0,1fr)] gap-4 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <TypeBreakdown
                items={byType.map((t) => ({ type: t.vehicleType, value: t.todayCount }))}
                totalLabel="Vehicles"
                totalValue={summary?.currentlyParked || 0}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="rounded-[20px] border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-16px_rgba(15,23,42,0.18)]"
            >
              <p className="text-sm font-bold text-slate-800 mb-1">Type totals</p>
              <p className="text-xs text-slate-400 mb-4">Today vs this month vs all time</p>
              <div className="space-y-4">
                {byType.map((t) => {
                  const color = getTypeColor(t.vehicleType);
                  const Icon = getTypeIcon(t.vehicleType);
                  return (
                    <div key={t.vehicleType} className="flex items-center gap-4">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${color}1A`, color }}
                      >
                        <Icon size={16} strokeWidth={2.2} />
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
                            Today
                          </p>
                          <p className="text-sm font-bold text-slate-800">{count(t.todayCount)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
                            Month
                          </p>
                          <p className="text-sm font-bold text-slate-800">{count(t.monthCount)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
                            Total
                          </p>
                          <p className="text-sm font-bold text-slate-800">{count(t.totalCount)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {byType.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6">
                    No vehicle type data for this date.
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          <VehicleTable vehicles={vehicles} />
        </>
      )}

      {!error && !loading && data && vehicles.length === 0 && byType.length === 0 && (
        <EmptyState label="No activity recorded for this date." />
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Range report view                                                   */
/* ------------------------------------------------------------------ */

const RangeReportView = () => {
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 6);

  const [from, setFrom] = useState(toInputDate(weekAgo));
  const [to, setTo] = useState(toInputDate(today));
  const [includeDetails, setIncludeDetails] = useState(true);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async (f, t, details) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRangeReport(toApiDate(f), toApiDate(t), details);
      setData(response?.data ?? response ?? null);
    } catch (err) {
      setError(extractErrorMessage(err, "Could not load the range report."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(from, to, includeDetails);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dailySummaries = data?.dailySummaries ?? [];
  const vehicles = data?.vehicles ?? [];

  const totals = dailySummaries.reduce(
    (acc, d) => {
      acc.entries += d.totalEntries || 0;
      acc.exits += d.totalExits || 0;
      acc.revenue += d.revenue || 0;
      acc.peakParked = Math.max(acc.peakParked, d.currentlyParked || 0);
      return acc;
    },
    { entries: 0, exits: 0, revenue: 0, peakParked: 0 }
  );

  const typeTotals = useMemo(() => {
    const map = {};
    dailySummaries.forEach((d) => {
      (d.byVehicleType || []).forEach((t) => {
        map[t.vehicleType] = (map[t.vehicleType] || 0) + (t.todayCount || 0);
      });
    });
    return Object.entries(map).map(([type, value]) => ({ type, value }));
  }, [dailySummaries]);

  const trendData = dailySummaries.map((d) => ({
    day: shortDay(d.date),
    entries: d.totalEntries || 0,
    exits: d.totalExits || 0,
    revenue: d.revenue || 0,
    parked: d.currentlyParked || 0,
  }));

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div className="flex items-center gap-2.5 flex-wrap bg-white rounded-2xl border border-slate-200/70 px-3 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-2">
            <CalendarRange size={15} className="text-slate-400 shrink-0" />
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="text-sm font-bold text-slate-700 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200/70 focus:border-indigo-200 transition-colors"
            />
            <span className="text-slate-400 text-xs font-semibold">to</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="text-sm font-bold text-slate-700 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200/70 focus:border-indigo-200 transition-colors"
            />
          </div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 cursor-pointer select-none ml-1">
            <input
              type="checkbox"
              checked={includeDetails}
              onChange={(e) => setIncludeDetails(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-200"
            />
            Include vehicle details
          </label>
        </div>
        <button
          onClick={() => load(from, to, includeDetails)}
          className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 shadow-sm"
        >
          <RefreshCw size={13} strokeWidth={2.4} />
          Generate report
        </button>
      </motion.div>

      {loading && !data && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-28" />
          ))}
        </div>
      )}

      {error && !loading && <ErrorState message={error} onRetry={() => load(from, to, includeDetails)} />}

      {!error && data && (
        <>
          <ReportHero
            companyName={data.companyName}
            subtitle={`Range report · ${prettyDate(data.fromDate || from)} – ${prettyDate(
              data.toDate || to
            )}`}
            onRefresh={() => load(from, to, includeDetails)}
            refreshing={loading}
          />

          <motion.div
            variants={containerStagger}
            initial="hidden"
            animate="show"
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <StatCard
              label="Total entries"
              raw={totals.entries}
              icon={LogIn}
              gradient="linear-gradient(135deg, #7C3AED, #A855F7)"
              glow="rgba(124,58,237,0.16)"
            />
            <StatCard
              label="Total exits"
              raw={totals.exits}
              icon={ExitIcon}
              gradient="linear-gradient(135deg, #D97706, #F59E0B)"
              glow="rgba(217,119,6,0.16)"
            />
            <StatCard
              label="Peak occupancy"
              raw={totals.peakParked}
              icon={Users}
              gradient="linear-gradient(135deg, #2563EB, #06B6D4)"
              glow="rgba(37,99,235,0.16)"
            />
            <StatCard
              label="Total revenue"
              raw={totals.revenue}
              formatter={inr}
              prefix={<IndianRupee size={18} className="mr-0.5" />}
              icon={IndianRupee}
              gradient="linear-gradient(135deg, #0EA5A0, #14B8A6)"
              glow="rgba(14,165,160,0.16)"
            />
          </motion.div>

          <div className="grid lg:grid-cols-[340px_minmax(0,1fr)] gap-4 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <TypeBreakdown
                items={typeTotals}
                totalLabel="Vehicles"
                totalValue={typeTotals.reduce((s, t) => s + t.value, 0)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="rounded-[20px] border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-16px_rgba(15,23,42,0.18)] flex flex-col"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-slate-800">Entries, exits &amp; occupancy</p>
                <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-violet-500" /> Entries
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Exits
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Parked
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-3">Day by day across the selected range</p>
              <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendData} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
                    <defs>
                      <linearGradient id="rangeEntriesFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="rangeExitsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#F1F5F9" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                      width={28}
                    />
                    <Tooltip content={<PremiumTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="entries"
                      stroke="#7C3AED"
                      strokeWidth={2.5}
                      fill="url(#rangeEntriesFill)"
                      isAnimationActive
                      animationDuration={800}
                    />
                    <Area
                      type="monotone"
                      dataKey="exits"
                      stroke="#F59E0B"
                      strokeWidth={2.5}
                      fill="url(#rangeExitsFill)"
                      isAnimationActive
                      animationDuration={800}
                    />
                    <Line
                      type="monotone"
                      dataKey="parked"
                      stroke="#2563EB"
                      strokeWidth={2}
                      strokeDasharray="4 3"
                      dot={false}
                      isAnimationActive
                      animationDuration={800}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="rounded-[20px] border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-16px_rgba(15,23,42,0.18)]"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-bold text-slate-800">Revenue trend</p>
              <span className="text-[11px] text-slate-400">₹ per day</span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                  <defs>
                    <linearGradient id="rangeBarFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0EA5A0" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#0EA5A0" stopOpacity={0.35} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                    tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                  />
                  <Tooltip content={<PremiumTooltip money />} />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="url(#rangeBarFill)"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {includeDetails && <VehicleTable vehicles={vehicles} />}
        </>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Report page                                                         */
/* ------------------------------------------------------------------ */

const Report = () => {
  const [mode, setMode] = useState("daily");

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reports</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Detailed activity, revenue and vehicle breakdowns
          </p>
        </div>
        <SegmentedTabs value={mode} onChange={setMode} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: mode === "daily" ? -12 : 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: mode === "daily" ? 12 : -12 }}
          transition={{ duration: 0.22 }}
        >
          {mode === "daily" ? <DailyReportView /> : <RangeReportView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Report;