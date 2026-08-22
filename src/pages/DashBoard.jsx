import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import {
  CarFront,
  IndianRupee,
  LogIn,
  LogOut as ExitIcon,
  TrendingUp,
  TrendingDown,
  Bike,
  Truck,
  Wallet,
  CalendarClock,
  Mail,
  ChevronDown,
  Sparkles,
  Activity,
} from "lucide-react";
import {
  getDashboardSummary,
  getDashboardTrend,
  getReportSchedule,
} from "../serviceCalls/apiCall";


import { StatusPill, formatDateTime } from "../components/shared";


const MOCK_SUMMARY = {
  vehiclesParked: 37,
  todayRevenue: 2450.0,
  monthRevenue: 87500.5,
  totalRevenue: 412300.0,
  todayEntries: 52,
  todayExits: 41,
  totalVehicles: 1280,
  occupancyByType: [
    { type: "Car", todayCount: 28, monthCount: 620, totalCount: 3100 },
    { type: "Bike", todayCount: 13, monthCount: 410, totalCount: 1850 },
    { type: "Truck", todayCount: 0, monthCount: 45, totalCount: 210 },
  ],
};

// 7-day trend used for sparklines + the two headline charts.
// "Today" mirrors the live figures above so the charts stay consistent
// with the KPI cards.
const MOCK_TREND = [
  { day: "Mon", revenue: 61200, entries: 58, exits: 49, parked: 22 },
  { day: "Tue", revenue: 58900, entries: 55, exits: 52, parked: 26 },
  { day: "Wed", revenue: 73400, entries: 66, exits: 60, parked: 31 },
  { day: "Thu", revenue: 69800, entries: 60, exits: 57, parked: 29 },
  { day: "Fri", revenue: 81200, entries: 72, exits: 65, parked: 34 },
  { day: "Sat", revenue: 92500, entries: 80, exits: 74, parked: 40 },
  { day: "Today", revenue: 2450, entries: 52, exits: 41, parked: 37 },
];

const MOCK_SCHEDULE = {
  frequency: "DAILY",
  hourOfDay: 9,
  minuteOfHour: 0,
  recipientEmail: "reports@yourcompany.com",
  enabled: true,
  timeZone: "Asia/Kolkata",
  cronExpression: "0 0 9 * * ?",
  updatedAt: "2026-08-15T12:30:00",
};

const OCCUPANCY_ICONS = { Car: CarFront, Bike: Bike, Truck: Truck };
const TYPE_COLORS = { Car: "#2563EB", Bike: "#0EA5A0", Truck: "#F59E0B" };

/* ------------------------------------------------------------------ */
/*  Formatters                                                         */
/* ------------------------------------------------------------------ */

const inr = (value) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const count = (value) => new Intl.NumberFormat("en-IN").format(Math.round(value));

/* ------------------------------------------------------------------ */
/*  Count-up hook                                                      */
/* ------------------------------------------------------------------ */

const useCountUp = (target, duration = 1100) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame;
    let start = null;
    const tick = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(target * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
};

/* ------------------------------------------------------------------ */
/*  3D tilt card wrapper — mouse-driven perspective + spotlight        */
/* ------------------------------------------------------------------ */

const TiltCard = ({ children, className = "", glow = "rgba(37,99,235,0.18)" }) => {
  const ref = useRef(null);
  const [transform, setTransform] = useState(
    "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)"
  );
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -8;
    const rotateY = ((x - rect.width / 2) / rect.width) * 8;
    setTransform(
      `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015,1.015,1.015)`
    );
    setSpot({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, active: true });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
    setSpot((s) => ({ ...s, active: false }));
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden will-change-transform ${className}`}
      style={{ transform, transition: "transform 0.18s ease-out" }}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spot.active ? 1 : 0,
          background: `radial-gradient(320px circle at ${spot.x}% ${spot.y}%, ${glow}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

const containerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemRise = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const Sparkline = ({ data, dataKey, color }) => (
  <div className="h-10 w-24">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#spark-${dataKey})`}
          isAnimationActive
          animationDuration={900}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const Delta = ({ pct }) => {
  const up = pct >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-semibold rounded-full px-1.5 py-0.5 ${up ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
        }`}
    >
      <Icon size={11} strokeWidth={2.5} />
      {Math.abs(pct)}%
    </span>
  );
};

const MetricCard = ({
  label,
  raw,
  formatter,
  prefix,
  icon: Icon,
  gradient,
  glow,
  delay,
  sparkData,
  sparkKey,
  sparkColor,
  deltaPct,
  footnote,
}) => {
  const animated = useCountUp(raw);
  return (
    <motion.div variants={itemRise}>
      <TiltCard
        glow={glow}
        className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm p-5 shadow-sm hover:shadow-xl transition-shadow duration-300"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              {label}
            </p>
            <p className="text-2xl font-bold text-slate-800 tabular-nums flex items-center gap-1">
              {prefix}
              {formatter ? formatter(animated) : count(animated)}
            </p>
            <div className="mt-2 flex items-center gap-2">
              {deltaPct !== undefined ? <Delta pct={deltaPct} /> : null}
              {footnote ? (
                <span className="text-[11px] text-slate-400">{footnote}</span>
              ) : null}
            </div>
          </div>
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg"
            style={{ background: gradient }}
          >
            <Icon size={20} strokeWidth={2.2} />
          </div>
        </div>
        {sparkData ? (
          <div className="mt-3 -mb-1 flex justify-end">
            <Sparkline data={sparkData} dataKey={sparkKey} color={sparkColor} />
          </div>
        ) : null}
      </TiltCard>
    </motion.div>
  );
};

const OccupancyRow = ({ type, todayCount, percent }) => {
  const Icon = OCCUPANCY_ICONS[type] || CarFront;
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${TYPE_COLORS[type]}1A`, color: TYPE_COLORS[type] }}
      >
        <Icon size={15} strokeWidth={2.2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-slate-700">{type}</p>
          <p className="text-xs font-semibold text-slate-500">{todayCount}</p>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: TYPE_COLORS[type] }}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

const PremiumTooltip = ({ active, payload, label, money }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-1.5 text-slate-600">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: p.color || p.fill }}
          />
          <span className="capitalize">{p.name}</span>
          <span className="font-semibold text-slate-800 ml-auto">
            {money ? `₹${inr(p.value)}` : count(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Dashboard                                                          */
/* ------------------------------------------------------------------ */

const Dashboard = () => {
  // const [summary] = useState(MOCK_SUMMARY);
  // const [trend] = useState(MOCK_TREND);
  // const [schedule] = useState(MOCK_SCHEDULE);
  // const [expandedType, setExpandedType] = useState(null);

  const [summary, setSummary] = useState(MOCK_SUMMARY);
  const [trend, setTrend] = useState(MOCK_TREND);
  const [schedule, setSchedule] = useState(MOCK_SCHEDULE);
  const [expandedType, setExpandedType] = useState(null);


  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [summaryResponse, trendResponse, scheduleResponse] =
          await Promise.all([
            getDashboardSummary(),
            getDashboardTrend(),
            getReportSchedule(),
          ]);

        if (cancelled) return;

        console.log("SUMMARY API:", summaryResponse);
        console.log("TREND API:", trendResponse);
        console.log("SCHEDULE API:", scheduleResponse);

        // =========================================================
        // SUMMARY
        // API response:
        // {
        //   data: {
        //     vehiclesParked: 4998,
        //     todayRevenue: 0,
        //     ...
        //   }
        // }
        // =========================================================

        const summaryData = summaryResponse?.data;

        if (summaryData && typeof summaryData === "object") {
          setSummary({
            vehiclesParked: summaryData.vehiclesParked ?? 0,
            todayRevenue: summaryData.todayRevenue ?? 0,
            monthRevenue: summaryData.monthRevenue ?? 0,
            totalRevenue: summaryData.totalRevenue ?? 0,
            todayEntries: summaryData.todayEntries ?? 0,
            todayExits: summaryData.todayExits ?? 0,
            totalVehicles: summaryData.totalVehicles ?? 0,

            occupancyByType: Array.isArray(
              summaryData.occupancyByType
            )
              ? summaryData.occupancyByType
              : [],
          });
        }

        // =========================================================
        // TREND
        // API response:
        // {
        //   data: [...]
        // }
        // =========================================================

        const trendData = trendResponse?.data;

        if (Array.isArray(trendData)) {
          setTrend(trendData);
        }

        // =========================================================
        // SCHEDULE
        // API response:
        // {
        //   data: [...]
        // }
        // =========================================================

        const scheduleData = scheduleResponse?.data;

        if (Array.isArray(scheduleData) && scheduleData.length > 0) {
          const first = scheduleData[0];

          setSchedule({
            frequency: first.frequency ?? "DAILY",
            hourOfDay: first.hourOfDay ?? 0,
            minuteOfHour: first.minuteOfHour ?? 0,
            recipientEmail: first.recipientEmail ?? "—",
            enabled: Boolean(first.enabled),
            timeZone: first.timeZone ?? "—",
            cronExpression: first.cronExpression ?? "",
            updatedAt: first.updatedAt ?? null,
          });
        }
      } catch (err) {
        console.error(
          "Dashboard data load failed:",
          err
        );

        // API fail aana mattum mock data already state-la irukkum
        // so nothing else needed.
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);


  const maxOccupancy = Math.max(1, ...summary.occupancyByType.map((o) => o.todayCount));
  const totalFleet = summary.occupancyByType.reduce((s, o) => s + o.totalCount, 0);

  const scheduleTime = `${String(schedule.hourOfDay).padStart(2, "0")}:${String(
    schedule.minuteOfHour
  ).padStart(2, "0")}`;

  const pieData = summary.occupancyByType.map((o) => ({
    name: o.type,
    value: o.todayCount,
  }));

  return (

    <div className="w-full space-y-6">
      
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Dashboard
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 rounded-full px-2 py-0.5">
              <Sparkles size={11} /> Live
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Today's overview at a glance</p>
        </div>
      </div>

      {/* KPI row 1 */}
      <motion.div
        variants={containerStagger}
        initial="hidden"
        animate="show"
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <MetricCard
          label="Vehicles parked now"
          raw={summary.vehiclesParked}
          icon={CarFront}
          gradient="linear-gradient(135deg, #2563EB, #06B6D4)"
          glow="rgba(37,99,235,0.16)"
          sparkData={trend}
          sparkKey="parked"
          sparkColor="#2563EB"
          deltaPct={8.3}
        />
        <MetricCard
          label="Today's revenue"
          raw={summary.todayRevenue}
          formatter={inr}
          prefix={<IndianRupee size={18} className="mr-0.5" />}
          icon={TrendingUp}
          gradient="linear-gradient(135deg, #0EA5A0, #14B8A6)"
          glow="rgba(14,165,160,0.16)"
          sparkData={trend}
          sparkKey="revenue"
          sparkColor="#0EA5A0"
          footnote="as of now"
        />
        <MetricCard
          label="Today's entries"
          raw={summary.todayEntries}
          icon={LogIn}
          gradient="linear-gradient(135deg, #7C3AED, #A855F7)"
          glow="rgba(124,58,237,0.16)"
          sparkData={trend}
          sparkKey="entries"
          sparkColor="#7C3AED"
          deltaPct={9.1}
        />
        <MetricCard
          label="Today's exits"
          raw={summary.todayExits}
          icon={ExitIcon}
          gradient="linear-gradient(135deg, #D97706, #F59E0B)"
          glow="rgba(217,119,6,0.16)"
          sparkData={trend}
          sparkKey="exits"
          sparkColor="#D97706"
          deltaPct={-2.4}
        />
      </motion.div>

      {/* KPI row 2 */}
      <motion.div
        variants={containerStagger}
        initial="hidden"
        animate="show"
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <MetricCard
          label="This month's revenue"
          raw={summary.monthRevenue}
          formatter={inr}
          prefix={<IndianRupee size={16} className="mr-0.5" />}
          icon={Wallet}
          gradient="linear-gradient(135deg, #0891B2, #22D3EE)"
          glow="rgba(8,145,178,0.16)"
          deltaPct={14.2}
        />
        <MetricCard
          label="All-time revenue"
          raw={summary.totalRevenue}
          formatter={inr}
          prefix={<IndianRupee size={16} className="mr-0.5" />}
          icon={IndianRupee}
          gradient="linear-gradient(135deg, #4338CA, #7C3AED)"
          glow="rgba(67,56,202,0.16)"
          footnote="since launch"
        />
        <MetricCard
          label="Total vehicles served"
          raw={summary.totalVehicles}
          icon={Activity}
          gradient="linear-gradient(135deg, #475569, #64748B)"
          glow="rgba(71,85,105,0.16)"
          deltaPct={3.1}
        />
      </motion.div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-[340px_minmax(0,1fr)] gap-4 items-stretch">
        {/* Donut: today's mix */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-bold text-slate-800 mb-1">Today's vehicle mix</p>
          <p className="text-xs text-slate-400 mb-3">Share of vehicles currently parked</p>
          <div className="relative h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={86}
                  paddingAngle={3}
                  isAnimationActive
                  animationDuration={900}
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={TYPE_COLORS[entry.name]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PremiumTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-2xl font-bold text-slate-800">
                {summary.vehiclesParked}
              </p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                Parked
              </p>
            </div>
          </div>
          <div className="mt-2 space-y-2">
            {summary.occupancyByType.map((o) => (
              <OccupancyRow
                key={o.type}
                type={o.type}
                todayCount={o.todayCount}
                percent={Math.round((o.todayCount / maxOccupancy) * 100)}
              />
            ))}
          </div>
        </motion.div>

        {/* Area: entries vs exits */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-slate-800">Entries vs exits</p>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-violet-500" /> Entries
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Exits
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-3">Last 7 days, gate activity</p>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
                <defs>
                  <linearGradient id="entriesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="exitsFill" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#entriesFill)"
                  isAnimationActive
                  animationDuration={900}
                />
                <Area
                  type="monotone"
                  dataKey="exits"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  fill="url(#exitsFill)"
                  isAnimationActive
                  animationDuration={900}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Revenue bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-bold text-slate-800">Revenue trend</p>
          <span className="text-[11px] text-slate-400">Last 7 days · ₹</span>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <defs>
                <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
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
                fill="url(#barFill)"
                radius={[8, 8, 0, 0]}
                isAnimationActive
                animationDuration={900}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Vehicle breakdown table with expandable detail rows */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-800">Vehicle type breakdown</p>
          <span className="text-[11px] text-slate-400">Tap a row for more detail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-3 py-3 font-semibold text-right">Today</th>
                <th className="px-3 py-3 font-semibold text-right">This month</th>
                <th className="px-3 py-3 font-semibold text-right">Total</th>
                <th className="px-5 py-3 font-semibold text-right w-10" />
              </tr>
            </thead>
            <tbody>
              {summary.occupancyByType.map((row) => {
                const Icon = OCCUPANCY_ICONS[row.type] || CarFront;
                const isOpen = expandedType === row.type;
                const share = (row.totalCount / totalFleet) * 100;
                const avgPerDay = row.monthCount / 30;
                return (
                  <React.Fragment key={row.type}>
                    <tr
                      onClick={() =>
                        setExpandedType(isOpen ? null : row.type)
                      }
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors duration-150 cursor-pointer select-none"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background: `${TYPE_COLORS[row.type]}1A`,
                              color: TYPE_COLORS[row.type],
                            }}
                          >
                            <Icon size={14} strokeWidth={2.2} />
                          </div>
                          <span className="font-medium text-slate-700">
                            {row.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right text-slate-600">
                        {count(row.todayCount)}
                      </td>
                      <td className="px-3 py-3 text-right text-slate-600">
                        {count(row.monthCount)}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-slate-800">
                        {count(row.totalCount)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <ChevronDown
                          size={15}
                          className={`inline-block text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                            }`}
                        />
                      </td>
                    </tr>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <tr>
                          <td colSpan={5} className="px-5 pb-4 pt-0 bg-slate-50/60">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="grid sm:grid-cols-3 gap-4 pt-3">
                                <div>
                                  <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold mb-1">
                                    Avg. per day this month
                                  </p>
                                  <p className="text-sm font-semibold text-slate-700">
                                    {avgPerDay.toFixed(1)} vehicles
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold mb-1">
                                    Share of total fleet
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <div className="h-1.5 flex-1 rounded-full bg-slate-200 overflow-hidden">
                                      <motion.div
                                        className="h-full rounded-full"
                                        style={{ background: TYPE_COLORS[row.type] }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${share}%` }}
                                        transition={{ duration: 0.6 }}
                                      />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-600">
                                      {share.toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold mb-1">
                                    Today vs monthly average
                                  </p>
                                  <p className="text-sm font-semibold text-slate-700">
                                    {row.todayCount >= avgPerDay ? "Above" : "Below"}{" "}
                                    average
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Scheduled report */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.3 }}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-slate-800">Scheduled report</p>
          <StatusPill status={schedule.enabled ? "ENABLED" : "DISABLED"} />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <CalendarClock size={16} strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
                Frequency
              </p>
              <p className="text-sm font-semibold text-slate-700 capitalize">
                {schedule.frequency.toLowerCase()} · {scheduleTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Mail size={16} strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
                Recipient
              </p>
              <p className="text-sm font-semibold text-slate-700 break-all">
                {schedule.recipientEmail}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold mb-1">
              Time zone
            </p>
            <p className="text-sm font-semibold text-slate-700">
              {schedule.timeZone}
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold mb-1">
              Last updated
            </p>
            <p className="text-sm font-semibold text-slate-700">
              {formatDateTime(schedule.updatedAt)}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;