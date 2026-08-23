import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import {
  getVehicleTypes,
  createVehicleEntry,
  getVehicleList,
  exitVehicle,
} from "../serviceCalls/apiCall";
import {

  Car, Bike, Truck, Bus, User, MapPin, Phone, Search, Clock, IndianRupee,
  CheckCircle2, XCircle, Loader2, ArrowRightLeft, LogIn, LogOut as ExitIcon,
  Ticket, Hash, Building2, PackageSearch, Check, RefreshCcw, ChevronDown, X,
} from "lucide-react";

const FACILITY_NAME = "Parking Expert";

const VEHICLE_ICON_RULES = [
  { match: /truck|lorry/i, icon: Truck },
  { match: /bus/i, icon: Bus },
  { match: /bike|motor|cycle|scoot|two.?wheel/i, icon: Bike },
  { match: /car|sedan|suv|hatch/i, icon: Car },
];

const getVehicleIcon = (typeName = "") => {
  const rule = VEHICLE_ICON_RULES.find((r) => r.match.test(typeName));
  return rule ? rule.icon : Car;
};

const VISIBLE_TYPE_COUNT = 4;

const EMPTY_ENTRY = {
  vehicleNumber: "",
  vehicleName: "",
  vehicleType: "",
  firstName: "",
  lastName: "",
  address: "",
  contactNo: "",
};

const PlateBadge = ({ value, size = "md" }) => {
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

const Field = ({ label, icon: Icon, children }) => (
  <label className="block">
    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
      {Icon && <Icon size={13} strokeWidth={2.4} />}
      {label}
    </span>
    {children}
  </label>
);

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

const StatusPill = ({ status }) => {
  const isPaid = status === "PAID";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        isPaid ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
      }`}
    >
      {isPaid ? <CheckCircle2 size={12} /> : <Clock size={12} />}
      {isPaid ? "Paid" : "Pending"}
    </span>
  );
};

const RippleButton = ({
  children,
  className = "",
  style,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  gradient = "linear-gradient(135deg, #2563EB, #06B6D4)",
}) => {
  const [ripples, setRipples] = useState([]);

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

const QRPlaceholder = () => (
  <div className="w-16 h-16 shrink-0 rounded-lg bg-slate-900 p-1.5 grid grid-cols-5 grid-rows-5 gap-[2px]">
    {Array.from({ length: 25 }).map((_, i) => (
      <span
        key={i}
        className={`rounded-[1px] ${
          [0, 1, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 23, 24, 12].includes(i)
            ? "bg-white"
            : "bg-transparent"
        }`}
      />
    ))}
  </div>
);
const QRImage = ({ src, size = 64 }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) return <QRPlaceholder />;

  return (
    <img
      src={src}
      alt="Vehicle QR code"
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className="shrink-0 rounded-lg border border-slate-200 bg-white object-contain"
    />
  );
};

const BarcodePlaceholder = () => (
  <div className="flex items-end gap-[2px] h-8 w-full">
    {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2].map((w, i) => (
      <span
        key={i}
        className="bg-slate-800"
        style={{ width: `${w}px`, height: "100%" }}
      />
    ))}
  </div>
);

const TabSwitch = ({ active, onChange }) => {
  const tabs = [
    { key: "entry", label: "Vehicle Entry", icon: LogIn },
    { key: "exit", label: "Vehicle Exit", icon: ExitIcon },
  ];
  return (
    <div className="grid grid-cols-2 w-full rounded-2xl bg-slate-100 p-1.5 gap-1.5 shadow-inner">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 ${
              isActive ? "text-white" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="tab-pill"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-xl shadow-md shadow-blue-500/25"
                style={{ background: "linear-gradient(135deg, #2563EB, #0891B2)" }}
              />
            )}
            <Icon size={16} className="relative shrink-0" strokeWidth={2.4} />
            <span className="relative whitespace-nowrap">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const generateTicketNo = () => `PE-${Date.now().toString().slice(-8)}`;

const VehicleTypeChip = ({ type, selected, onSelect }) => {
  const Icon = getVehicleIcon(type.vehicleType);
  return (
    <motion.button
      layout
      type="button"
      onClick={onSelect}
      title={type.vehicleDescription}
      whileTap={{ scale: 0.95 }}
      className={`flex flex-col items-center justify-center gap-1 rounded-xl border px-3 py-2.5 min-w-[72px] text-[10px] font-semibold transition-all duration-200 ${
        selected
          ? "border-transparent text-white shadow-md shadow-blue-500/20"
          : "border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:bg-blue-50/60 hover:text-blue-600"
      }`}
      style={selected ? { background: "linear-gradient(135deg, #2563EB, #06B6D4)" } : {}}
    >
      <Icon size={15} strokeWidth={2.3} />
      <span className="truncate max-w-[68px]">{type.vehicleType}</span>
    </motion.button>
  );
};

const VehicleTypeExpandToggle = ({ expanded, hiddenCount, onToggle }) => (
  <motion.button
    layout
    type="button"
    onClick={onToggle}
    whileTap={{ scale: 0.95 }}
    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-blue-200 bg-blue-50/50 px-3 py-2.5 min-w-[72px] text-[10px] font-semibold text-blue-600 hover:bg-blue-100/70 hover:border-blue-300 transition-all duration-200"
  >
    <motion.span
      animate={{ rotate: expanded ? 180 : 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex"
    >
      <ChevronDown size={15} strokeWidth={2.4} />
    </motion.span>
    <span className="whitespace-nowrap">{expanded ? "Show less" : `+${hiddenCount} more`}</span>
  </motion.button>
);

const EntryTab = () => {
  const [form, setForm] = useState(EMPTY_ENTRY);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const [ticketStatus, setTicketStatus] = useState("DRAFT");
  const [ticketNo, setTicketNo] = useState(generateTicketNo);
  const [now, setNow] = useState(new Date());

  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [typesError, setTypesError] = useState(false);
  const [typesExpanded, setTypesExpanded] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const loadVehicleTypes = useCallback(async () => {
    setTypesLoading(true);
    setTypesError(false);
    try {
     const { data } = await getVehicleTypes();
      const list = Array.isArray(data) ? data : [];
      setVehicleTypes(list);
      setForm((f) => (list.some((t) => String(t.id) === String(f.vehicleType))
        ? f
        : { ...f, vehicleType: list.length ? String(list[0].id) : "" }));
    } catch (err) {
      console.error("Failed to load vehicle types:", err);
      setTypesError(true);
    } finally {
      setTypesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVehicleTypes();
  }, [loadVehicleTypes]);

  useEffect(() => {
    setTypesExpanded(false);
  }, [vehicleTypes]);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const isValid =
    form.vehicleNumber.trim() &&
    form.vehicleName.trim() &&
    form.vehicleType !== "" &&
    form.firstName.trim() &&
    form.contactNo.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      const payload = { ...form, vehicleType: Number(form.vehicleType) };
await createVehicleEntry(payload);
      setTicketStatus("ISSUED");
      toast.success("Success", "Entry recorded. Ticket issued.");
      setForm((f) => ({ ...EMPTY_ENTRY, vehicleType: f.vehicleType }));
      setTicketNo(generateTicketNo());
      setTimeout(() => setTicketStatus("DRAFT"), 3000);
    } catch (err) {
      console.error("Vehicle entry failed:", err);
      toast.error(
        "Error",
        err?.response?.data?.message || "Couldn't save this entry. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const typeInfo = vehicleTypes.find((t) => String(t.id) === String(form.vehicleType));
  const TypeIcon = typeInfo ? getVehicleIcon(typeInfo.vehicleType) : Car;

  const hasOverflow = vehicleTypes.length > VISIBLE_TYPE_COUNT;
  const visibleTypes =
    typesExpanded || !hasOverflow ? vehicleTypes : vehicleTypes.slice(0, VISIBLE_TYPE_COUNT);
  const hiddenCount = vehicleTypes.length - VISIBLE_TYPE_COUNT;

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-5 items-start">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm min-w-0 flex flex-col"
      >
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="text-sm font-bold text-slate-800">Vehicle Entry Details</h2>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #2563EB, #06B6D4)" }}
          >
            <TypeIcon size={15} strokeWidth={2.2} />
          </div>
        </div>

        <div className="rounded-xl bg-slate-50/70 border border-slate-100 p-4 mb-4 shrink-0">
          <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-3">
            Vehicle Info
          </p>
          <div className="grid sm:grid-cols-2 gap-x-4 gap-y-4">
            <Field label="Vehicle Number" icon={Ticket}>
              <input
                className={`${inputClass} font-mono uppercase tracking-widest !py-2 !text-sm`}
                placeholder="TN 09 AB 1234"
                value={form.vehicleNumber}
                onChange={update("vehicleNumber")}
                required
              />
            </Field>

            <Field label="Vehicle Name / Model" icon={Car}>
              <input
                className={`${inputClass} !py-2 !text-sm`}
                placeholder="Hyundai Creta"
                value={form.vehicleName}
                onChange={update("vehicleName")}
                required
              />
            </Field>

            <div className="sm:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <Field label="Vehicle Type">
                {typesLoading ? (
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-[42px] w-[72px] rounded-xl bg-slate-100 animate-pulse"
                      />
                    ))}
                  </div>
                ) : typesError ? (
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2.5 text-[11px] font-medium text-rose-600">
                    <span className="flex items-center gap-1.5">
                      <XCircle size={13} className="shrink-0" />
                      Couldn't load vehicle types.
                    </span>
                    <button
                      type="button"
                      onClick={loadVehicleTypes}
                      className="flex items-center gap-1 font-semibold underline underline-offset-2 shrink-0"
                    >
                      <RefreshCcw size={11} />
                      Retry
                    </button>
                  </div>
                ) : vehicleTypes.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-white px-3 py-2.5 text-[11px] text-slate-400">
                    No vehicle types configured yet.
                  </div>
                ) : (
                  <motion.div layout className="flex flex-wrap gap-1.5">
                    <AnimatePresence initial={false}>
                      {visibleTypes.map((t) => (
                        <VehicleTypeChip
                          key={t.id}
                          type={t}
                          selected={String(form.vehicleType) === String(t.id)}
                          onSelect={() => setForm((f) => ({ ...f, vehicleType: String(t.id) }))}
                        />
                      ))}
                      {hasOverflow && (
                        <VehicleTypeExpandToggle
                          key="expand-toggle"
                          expanded={typesExpanded}
                          hiddenCount={hiddenCount}
                          onToggle={() => setTypesExpanded((v) => !v)}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </Field>

              <Field label="Contact No." icon={Phone}>
                <input
                  className={`${inputClass} !py-2 !text-sm`}
                  placeholder="98765 43210"
                  value={form.contactNo}
                  onChange={update("contactNo")}
                  required
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50/70 border border-slate-100 p-4 shrink-0">
          <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider mb-3">
            Owner Info
          </p>
          <div className="grid sm:grid-cols-2 gap-x-3 gap-y-4">
            <Field label="First Name" icon={User}>
              <input
                className={`${inputClass} !py-2 !text-sm`}
                placeholder="Arjun"
                value={form.firstName}
                onChange={update("firstName")}
                required
              />
            </Field>

            <Field label="Last Name" icon={User}>
              <input
                className={`${inputClass} !py-2 !text-sm`}
                placeholder="Kumar"
                value={form.lastName}
                onChange={update("lastName")}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Address" icon={MapPin}>
                <textarea
                  className={`${inputClass} resize-none !py-2 !text-sm`}
                  rows={1}
                  placeholder="House no, street, area, city"
                  value={form.address}
                  onChange={update("address")}
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-end shrink-0">
          <RippleButton
            type="submit"
            disabled={!isValid}
            loading={submitting}
            className="w-full sm:w-auto shadow-blue-500/20 !py-2.5 !text-xs"
          >
            {!submitting && <Check size={14} strokeWidth={2.6} />}
            {submitting ? "Saving..." : "Done"}
          </RippleButton>
        </div>
      </form>

      <div className="min-w-0 flex flex-col">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 px-1 shrink-0">
          Live preview
        </p>
        <div className="rounded-2xl bg-white border border-slate-200 shadow-md overflow-hidden">
          <div
            className="px-4 py-3 text-white flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, #2563EB, #06B6D4)" }}
          >
            <div>
              <p className="text-[9px] uppercase tracking-widest opacity-80">
                {FACILITY_NAME}
              </p>
              <p className="text-xs font-bold">Entry Ticket</p>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <Ticket size={16} className="opacity-90" />
              <span
                className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                  ticketStatus === "ISSUED"
                    ? "bg-white/90 text-emerald-600"
                    : "bg-white/20 text-white"
                }`}
              >
                {ticketStatus === "ISSUED" ? "Issued" : "Draft"}
              </span>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <PlateBadge value={form.vehicleNumber} size="md" />

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-[10px] text-slate-400">Vehicle</p>
                <p className="font-medium text-slate-800 truncate">
                  {form.vehicleName || "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Type</p>
                <p className="font-medium text-slate-800 truncate">
                  {typeInfo?.vehicleType || "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Rate</p>
                <p className="font-medium text-slate-800 flex items-center gap-0.5">
                  {typeInfo ? (
                    <>
                      <IndianRupee size={10} />
                      {typeInfo.perPrice}/hr
                    </>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Contact</p>
                <p className="font-medium text-slate-800 truncate">{form.contactNo || "—"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-slate-400">Driver</p>
                <p className="font-medium text-slate-800 truncate">
                  {`${form.firstName} ${form.lastName}`.trim() || "—"}
                </p>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-300" />

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Hash size={10} /> Ticket No.
                </p>
                <p className="font-semibold text-slate-700 font-mono">{ticketNo}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Building2 size={10} /> Facility
                </p>
                <p className="font-semibold text-slate-700 truncate">{FACILITY_NAME}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Date</p>
                <p className="font-semibold text-slate-700">
                  {now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Time</p>
                <p className="font-semibold text-slate-700">
                  {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-0.5">
              <div className="flex-1">
                <BarcodePlaceholder />
              </div>
              {/* Entry tab has no server-issued QR yet (ticket not saved), so
                  this stays on the generative placeholder. */}
              <QRPlaceholder />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatDateTime = (iso) => {
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

const formatDuration = (minutes) => {
  if (minutes == null) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const transformVehicle = (v) => {
  const entryTime = v.entryTime;
  const exitTime = v.exitTime;
  const durationMinutes = entryTime
    ? Math.max(0, Math.round((new Date(exitTime || Date.now()) - new Date(entryTime)) / 60000))
    : null;
  const hourlyRate = v.vehicleType?.perPrice ?? 0;
  const parkingFee =
    v.amount && v.amount > 0
      ? v.amount
      : exitTime
      ? Math.max(1, Math.ceil(durationMinutes / 60)) * hourlyRate
      : 0;
  return {
    tokenNo: v.tokenNo,
    vehicleNumber: v.vehicleNumber,
    vehicleName: v.vehicleName,
    vehicleTypeName: v.vehicleType?.vehicleType,
    ownerName: `${v.firstName || ""} ${v.lastName || ""}`.trim(),
    contactNo: v.contactNo,
    address: v.address,
    company: v.company || FACILITY_NAME,
    entryTime,
    exitTime,
    durationMinutes,
    parkingFee,
    paymentStatus: v.status === "EXIT" ? "PAID" : "PENDING",
    status: v.status,
    qrCode: v.qrCode, // base64 PNG string from the API, rendered live in ExitResultCard
  };
};

const EmptySearchState = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center text-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12"
  >
    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-4">
      <PackageSearch size={24} className="text-slate-300" strokeWidth={1.8} />
    </div>
    <p className="text-sm font-semibold text-slate-600">No vehicle found</p>
    <p className="text-xs text-slate-400 mt-1 max-w-xs">
      Double-check the vehicle number or token number and try again.
    </p>
  </motion.div>
);
const InfoItem = ({ label, value, icon: Icon }) => (
  <div className="group rounded-lg border border-slate-100 bg-slate-50/70 px-3.5 py-2.5 transition-colors duration-150 hover:border-blue-100 hover:bg-blue-50/40">
    <div className="flex items-center gap-1.5 mb-1">
      {Icon && (
        <Icon
          size={11}
          className="text-slate-400 group-hover:text-blue-500 transition-colors"
          strokeWidth={2.4}
        />
      )}
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
    <p className="text-[13px] font-semibold text-slate-800 truncate">{value}</p>
  </div>
);
const QRDialog = ({ result, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md px-4"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.82, rotateX: -18, y: 30 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, rotateX: 10, y: 16 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        style={{ perspective: 1400, transformStyle: "preserve-3d" }}
        className="relative w-full max-w-[360px]"
      >
        <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-blue-500/25 via-cyan-400/15 to-transparent blur-3xl pointer-events-none" />

        <div className="relative rounded-[28px] bg-white shadow-[0_50px_100px_-25px_rgba(15,23,42,0.55)] overflow-hidden border border-white/60">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
          >
            <X size={15} strokeWidth={2.4} />
          </button>

          <div
            className="relative px-6 pt-7 pb-16 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #2563EB, #06B6D4)" }}
          >
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 14px)",
              }}
            />
            <motion.div
              initial={{ x: "-120%" }}
              animate={{ x: "220%" }}
              transition={{ duration: 1.6, delay: 0.35, ease: "easeInOut" }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg]"
            />
            <div className="relative text-center">
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-blue-100/80">
                {result.company}
              </p>
              <p className="text-base font-bold text-white mt-0.5">Vehicle Pass</p>
            </div>
          </div>

          <div className="relative px-6 -mt-12 pb-7">
            <motion.div
              initial={{ y: 10, opacity: 0, rotateX: -8 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ delay: 0.1, duration: 0.35, ease: "easeOut" }}
              style={{ transformStyle: "preserve-3d" }}
              className="mx-auto w-fit p-3.5 rounded-3xl bg-white shadow-[0_20px_40px_-12px_rgba(37,99,235,0.35)] border border-slate-100"
            >
              <QRImage src={result.qrCode} size={172} />
            </motion.div>

            <div className="text-center mt-4">
              <p className="text-[10px] font-mono tracking-wider text-slate-400">{result.tokenNo}</p>
            </div>

            <div className="flex justify-center mt-3">
              <PlateBadge value={result.vehicleNumber} size="md" />
            </div>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 divide-y divide-slate-100">
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Owner</span>
                <span className="text-[13px] font-semibold text-slate-800">{result.ownerName || "—"}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Entry</span>
                <span className="text-[13px] font-semibold text-slate-800">{formatDateTime(result.entryTime)}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Status</span>
                <StatusPill status={result.paymentStatus} />
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Fee</span>
                <span className="text-[13px] font-bold text-blue-600 flex items-center gap-0.5">
                  <IndianRupee size={12} strokeWidth={2.6} />
                  {result.parkingFee ?? "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ExitResultCard = ({ result, onCheckout, checkingOut }) => {
  const isExited = Boolean(result.exitTime);
  const [qrOpen, setQrOpen] = useState(false);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 12, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97, y: -8 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_28px_-14px_rgba(15,23,42,0.14)] overflow-hidden"
      >
        <div
          className="relative px-5 py-4 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #2563EB, #06B6D4)" }}
        >
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 14px)",
            }}
          />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center shrink-0">
                <ExitIcon size={15} className="text-white" strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-blue-100/80">
                  {result.company}
                </p>
                <p className="text-[15px] font-bold text-white tracking-tight leading-tight">Exit Summary</p>
              </div>
            </div>
            <StatusPill status={result.paymentStatus} />
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <PlateBadge value={result.vehicleNumber} size="lg" />

            <div className="flex items-stretch rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white overflow-hidden shrink-0">
              <div className="relative pl-4 pr-4 py-2.5 flex flex-col justify-center">
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-gradient-to-b from-blue-500 to-cyan-400" />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Parking Fee</p>
                <p className="text-xl leading-tight font-extrabold text-slate-900 flex items-center gap-0.5">
                  <IndianRupee size={15} strokeWidth={2.6} className="text-blue-600" />
                  {result.parkingFee ?? "—"}
                </p>
              </div>
              <div className="w-px bg-slate-200" />
              <button
                type="button"
                onClick={() => setQrOpen(true)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50/60 transition-colors"
              >
                <div className="p-1 rounded-lg bg-white border border-slate-200 shrink-0">
                  <QRImage src={result.qrCode} size={38} />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Token</p>
                  <p className="text-[11px] font-mono font-semibold text-slate-700 truncate max-w-[72px]">
                    {result.tokenNo}
                  </p>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <InfoItem label="Vehicle" value={result.vehicleName || "—"} icon={Car} />
            <InfoItem label="Owner" value={result.ownerName || "—"} icon={User} />
            <InfoItem label="Contact" value={result.contactNo || "—"} icon={Phone} />
            <InfoItem label="Entry" value={formatDateTime(result.entryTime)} icon={LogIn} />
            <InfoItem label="Exit" value={formatDateTime(result.exitTime)} icon={ExitIcon} />
            <InfoItem label="Duration" value={formatDuration(result.durationMinutes)} icon={Clock} />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {isExited ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} className="text-white" strokeWidth={2.4} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-emerald-700">Vehicle exited successfully</p>
                  <p className="text-[11px] text-emerald-600/80">
                    Fee of ₹{result.parkingFee ?? 0} recorded for {result.vehicleNumber}.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="action"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex justify-end"
              >
                <RippleButton
                  onClick={onCheckout}
                  loading={checkingOut}
                  gradient="linear-gradient(135deg, #2563EB, #06B6D4)"
                  className="w-full sm:w-auto !px-6 !py-2.5 !text-xs"
                >
                  {!checkingOut && <ExitIcon size={14} strokeWidth={2.4} />}
                  {checkingOut ? "Processing..." : "Confirm Vehicle Exit"}
                </RippleButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {qrOpen && <QRDialog key="qr-dialog" result={result} onClose={() => setQrOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

const HISTORY_PAGE_SIZE = 10;

const ExitTab = () => {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const toast = useToast();

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [historyPage, setHistoryPage] = useState(0);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);

  const loadHistory = useCallback(
    async (pageToLoad = 0) => {
      if (pageToLoad === 0) {
        setHistoryLoading(true);
      } else {
        setLoadingMore(true);
      }
      try {
       const { data } = await getVehicleList({
  status: "EXIT",
  page: pageToLoad,
  size: HISTORY_PAGE_SIZE,
});
        const list = Array.isArray(data?.content) ? data.content.map(transformVehicle) : [];
        setHistory((prev) => (pageToLoad === 0 ? list : [...prev, ...list]));
        setHasMoreHistory(data?.last === false);
        setHistoryPage(pageToLoad);
      } catch (err) {
        console.error("Failed to load exit history:", err);
        toast.error("Error", err?.response?.data?.message || "Couldn't load recent vehicle exits.");
      } finally {
        setHistoryLoading(false);
        setLoadingMore(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    loadHistory(0);
  }, [loadHistory]);

  const handleHistoryScroll = (e) => {
    const el = e.currentTarget;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom && hasMoreHistory && !loadingMore && !historyLoading) {
      loadHistory(historyPage + 1);
    }
  };

  const canSearch = query.trim().length > 0;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!canSearch || searching) return;
    setSearching(true);
    setResult(null);
    setNotFound(false);
    try {
      const { data } = await getVehicleList({
  tokenIdOrVehicleNo: query.trim(),
  status: "ACTIVE",
});
      const list = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
      if (list.length > 0) {
        setResult(transformVehicle(list[0]));
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error("Vehicle exit search failed:", err);
      if (err?.response?.status === 404) {
        setNotFound(true);
      } else {
        toast.error("Error", err?.response?.data?.message || "Something went wrong while searching. Please try again.");
      }
    } finally {
      setSearching(false);
    }
  };

  const handleCheckout = async () => {
    if (!result || checkingOut) return;
    setCheckingOut(true);
    try {
      const identifier = result.tokenNo || result.vehicleNumber;
const { data } = await exitVehicle(identifier);
      setResult(transformVehicle(data));
      toast.success("Success", "Vehicle exit recorded successfully.", 6000);
      loadHistory(0);
      setTimeout(() => {
        setResult(null);
        setQuery("");
      }, 1600);
    } catch (err) {
      console.error("Checkout failed:", err);
      toast.error("Error", err?.response?.data?.message || "Couldn't complete the checkout. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <Field label="Vehicle Number / Token" icon={Ticket}>
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className={`${inputClass} pl-9 font-mono uppercase tracking-widest`}
              placeholder="TN 09 AB 1234 or PE-00312"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </Field>

        <div className="flex items-center justify-between gap-3 mt-5 flex-wrap">
          <p className="text-xs text-slate-400">Enter a vehicle number or a token number</p>
          <RippleButton
            type="submit"
            disabled={!canSearch}
            loading={searching}
            gradient="linear-gradient(135deg, #2563EB, #06B6D4)"
            className="w-full sm:w-auto"
          >
            {!searching && <Search size={16} />}
            {searching ? "Searching..." : "Find Vehicle"}
          </RippleButton>
        </div>
      </form>

      <AnimatePresence mode="wait">
        {result && (
          <ExitResultCard key="result" result={result} onCheckout={handleCheckout} checkingOut={checkingOut} />
        )}
        {!result && notFound && <EmptySearchState key="empty" />}
      </AnimatePresence>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 sm:px-8 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Recent Vehicle Exits</h3>
          <ArrowRightLeft size={18} className="text-slate-300" />
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400 py-10">
            <Loader2 size={16} className="animate-spin" />
            Loading history...
          </div>
        ) : history.length === 0 ? (
          <div className="text-center text-sm text-slate-400 py-10">No exits recorded yet today.</div>
        ) : (
          <div
            onScroll={handleHistoryScroll}
            className="overflow-y-auto overflow-x-auto max-h-[440px]"
          >
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                  <th className="px-6 sm:px-8 py-3 font-semibold">Vehicle</th>
                  <th className="px-3 py-3 font-semibold">Owner</th>
                  <th className="px-3 py-3 font-semibold">Entry</th>
                  <th className="px-3 py-3 font-semibold">Exit</th>
                  <th className="px-3 py-3 font-semibold">Duration</th>
                  <th className="px-3 py-3 font-semibold">Fee</th>
                  <th className="px-6 sm:px-8 py-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, i) => (
                  <tr
                    key={row.tokenNo ?? `${row.vehicleNumber}-${row.exitTime ?? i}`}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors duration-150"
                  >
                    <td className="px-6 sm:px-8 py-3">
                      <PlateBadge value={row.vehicleNumber} size="sm" />
                    </td>
                    <td className="px-3 py-3 text-slate-600">{row.ownerName || "—"}</td>
                    <td className="px-3 py-3 text-slate-500 whitespace-nowrap">{formatDateTime(row.entryTime)}</td>
                    <td className="px-3 py-3 text-slate-500 whitespace-nowrap">{formatDateTime(row.exitTime)}</td>
                    <td className="px-3 py-3 text-slate-600">{formatDuration(row.durationMinutes)}</td>
                    <td className="px-3 py-3 font-semibold text-slate-800">
                      <span className="inline-flex items-center gap-0.5">
                        <IndianRupee size={12} />
                        {row.parkingFee ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 sm:px-8 py-3 text-right">
                      <StatusPill status={row.paymentStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loadingMore && (
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-4">
                <Loader2 size={14} className="animate-spin" />
                Loading more...
              </div>
            )}

            {!hasMoreHistory && history.length > 0 && (
              <div className="text-center text-[11px] text-slate-300 py-4">
                You've reached the end of the list
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Park = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") === "exit" ? "exit" : "entry";

  const setTab = (next) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("tab", next);
      return params;
    });
  };

  return (
    <div className="w-full bg-slate-50/60">
      <TabSwitch active={tab} onChange={setTab} />
      <div className="mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {tab === "entry" ? <EntryTab /> : <ExitTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
export default Park;