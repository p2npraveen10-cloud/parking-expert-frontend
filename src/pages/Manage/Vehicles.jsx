import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Car, Bike, Search, ChevronDown, Check, RefreshCcw, FileText, ShieldCheck,
  Ticket, ChevronLeft, ChevronRight, WifiOff, ListFilter, LogIn, LogOut,
  Eye, Pencil, Trash2, X, Loader2, AlertTriangle, Phone, Hash,
  FileSpreadsheet, FileDown, RotateCcw, IdCard, BadgeIndianRupee, Tag,
  CalendarClock, MapPin, Building, ArrowRight, User   // ← add User
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import {
  getVehicleList,
  getVehicle,
  updateVehicle,
  deleteVehicle,
  exportVehiclesPdf,
  exportVehiclesExcel,
  getVehicleTypes,
} from "../../serviceCalls/apiCall";

import {
  FONT_DISPLAY,
  FONT_BODY,
  FONT_MONO,
  TOKENS,
  inputClass,
  inputStyle,
  glossyInputClass,
  glossyInputStyle,
  RippleButton,
  IconButton,
  FieldShell,
  Dropdown,
  Modal,
  formatDateTime,
  formatDateTimeLocal,
  formatCurrency,
  STATUS_STYLES,
} from "./manageShared";

/* ------------------------------------------------------------------ */
/* StatusBadge                                                         */
/* ------------------------------------------------------------------ */
const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || { bg: "#F1F3F8", text: "#5B6478", dot: "#94A0B8", label: status || "—", live: false };
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide" style={{ background: s.bg, color: s.text, fontFamily: FONT_BODY }}>
      <span className={s.live ? "pe-live-dot" : ""} style={{ width: 6, height: 6, borderRadius: 999, background: s.dot }} />
      {s.label}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* VehicleTypeIcon                                                    */
/* ------------------------------------------------------------------ */
const VehicleTypeIcon = ({ type, size = 44, iconSize = 19 }) => {
  const isBike = (type || "").toUpperCase() === "BIKE";
  const Icon = isBike ? Bike : Car;
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl text-white"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${TOKENS.blue}, ${TOKENS.cyan})` }}
    >
      <Icon size={iconSize} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* TicketSkeleton                                                      */
/* ------------------------------------------------------------------ */
const TicketSkeleton = ({ delay = 0 }) => (
  <div className="pe-animate-up flex items-center gap-4 rounded-2xl border bg-white p-4" style={{ borderColor: TOKENS.line, animationDelay: `${delay}ms` }}>
    <div className="pe-shimmer h-11 w-11 rounded-xl" />
    <div className="flex-1 space-y-2">
      <div className="pe-shimmer h-3 w-40 rounded" />
      <div className="pe-shimmer h-2.5 w-24 rounded" />
    </div>
    <div className="hidden gap-6 sm:flex">
      <div className="pe-shimmer h-3 w-20 rounded" />
      <div className="pe-shimmer h-3 w-20 rounded" />
      <div className="pe-shimmer h-3 w-16 rounded" />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* DetailRow                                                           */
/* ------------------------------------------------------------------ */
const DetailRow = ({ label, value, mono, icon: Icon }) => (
  <div>
    <p className="flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
      {Icon && <Icon size={10} />}
      {label}
    </p>
    <p className="mt-1 text-[13px] font-bold" style={{ color: TOKENS.ink, fontFamily: mono ? FONT_MONO : FONT_BODY }}>
      {value ?? "—"}
    </p>
  </div>
);

/* ------------------------------------------------------------------ */
/* VehicleDetailModal                                                  */
/* ------------------------------------------------------------------ */
const VehicleDetailModal = ({ open, tokenIdOrVehicleNo, onClose, toast }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !tokenIdOrVehicleNo) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const { data: res } = await getVehicle(tokenIdOrVehicleNo);
        if (!cancelled) setData(res?.data ?? res);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || err?.message || "Couldn't load vehicle details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [open, tokenIdOrVehicleNo]);

  const isBike = (data?.vehicleType?.vehicleType || "").toUpperCase() === "BIKE";

  return (
    <Modal open={open} onClose={onClose} width={460} closeOnBackdrop={true}>
      {loading && (
        <div className="p-6">
          <div className="pe-shimmer h-40 w-full rounded-2xl" />
          <div className="mt-5 grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="pe-shimmer h-2.5 w-16 rounded" />
                <div className="pe-shimmer h-3.5 w-24 rounded" />
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
          <AlertTriangle size={20} className="text-rose-400" />
          <p className="text-[12.5px] font-semibold" style={{ color: TOKENS.ink }}>Couldn't load this vehicle</p>
          <p className="max-w-xs text-[11.5px] text-slate-400">{error}</p>
        </div>
      )}

      {!loading && !error && data && (
        <div>
          <div
            className="relative overflow-hidden px-6 pb-7 pt-6"
            style={{ background: `linear-gradient(150deg, ${TOKENS.indigo} 0%, ${TOKENS.blue} 55%, ${TOKENS.cyan} 135%)` }}
          >
            <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />

            <button
              type="button"
              onClick={onClose}
              className="pe-focus-ring absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="relative flex items-center justify-between">
              <span
                className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wider text-white ring-1 ring-white/25 backdrop-blur"
              >
                <Ticket size={10} /> Parking pass
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white ring-1 ring-white/25 backdrop-blur">
                <span
                  className={STATUS_STYLES[data.status]?.live ? "pe-live-dot" : ""}
                  style={{ width: 6, height: 6, borderRadius: 999, background: "#fff" }}
                />
                {STATUS_STYLES[data.status]?.label || data.status}
              </span>
            </div>

            <div className="relative mt-5 flex items-end gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
                {isBike ? <Bike size={20} /> : <Car size={20} />}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[22px] font-extrabold leading-none tracking-wide text-white" style={{ fontFamily: FONT_MONO }}>
                  {data.vehicleNumber || "—"}
                </p>
                <p className="mt-1.5 truncate text-[12px] font-medium text-white/75">
                  {data.vehicleName || "Vehicle"} &middot; {data.vehicleType?.vehicleType || "—"}
                </p>

              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full" style={{ background: TOKENS.bg }} />
            <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full" style={{ background: TOKENS.bg }} />
            <div className="h-0 w-full border-t border-dashed" style={{ borderColor: TOKENS.line }} />
          </div>

          <div className="max-h-[54vh] overflow-y-auto pe-scrollbar px-6 py-5">
            <div className="flex items-center gap-3 rounded-2xl border p-3.5" style={{ borderColor: TOKENS.line, background: "#FAFBFD" }}>
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[12px] font-extrabold text-white"
                style={{ background: `linear-gradient(135deg, ${TOKENS.indigo}, ${TOKENS.blue})`, fontFamily: FONT_DISPLAY }}
              >
                {[data.firstName, data.lastName].filter(Boolean).map((s) => s[0]?.toUpperCase()).join("") || "—"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold" style={{ color: TOKENS.ink }}>
                  {[data.firstName, data.lastName].filter(Boolean).join(" ") || "—"}
                </p>
                <p className="truncate text-[11px] text-slate-400">{data.contactNo || "—"}</p>
              </div>
              {data.qrCode && (
                <img
                  src={data.qrCode}
                  alt="Vehicle QR code"
                  className="h-12 w-12 shrink-0 rounded-lg border bg-white p-1"
                  style={{ borderColor: TOKENS.line }}
                />
              )}
            </div>

            {data.address && (
              <div className="mt-3 flex items-start gap-2 text-[11.5px]" style={{ color: TOKENS.inkSoft }}>
                <MapPin size={12} className="mt-0.5 shrink-0 text-slate-400" />
                <span>{data.address}</span>
              </div>
            )}

            <div className="my-5 h-px w-full" style={{ background: TOKENS.line }} />

            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <DetailRow icon={LogIn} label="Entry" value={formatDateTime(data.entryTime)} />
              <DetailRow icon={LogOut} label="Exit" value={data.exitTime ? formatDateTime(data.exitTime) : "Still parked"} />
              <DetailRow icon={Ticket} label="Token no." value={data.tokenNo} mono />
              <DetailRow icon={Tag} label="Rate" value={data.vehicleType?.perPrice != null ? `${formatCurrency(data.vehicleType.perPrice)} / hr` : "—"} mono />
            </div>

            {data.company && (
              <div className="mt-5 flex items-center gap-2 text-[11px] font-medium text-slate-400">
                <Building size={12} />
                {data.company}
              </div>
            )}
          </div>

          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ background: "#FAFBFD", borderTop: `1px solid ${TOKENS.line}` }}
          >
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400">Amount</p>
              <p className="text-[20px] font-extrabold leading-tight" style={{ fontFamily: FONT_DISPLAY, color: TOKENS.ink }}>
                {formatCurrency(data.amount)}
              </p>
            </div>
            <StatusBadge status={data.status} />
          </div>
        </div>
      )}
    </Modal>
  );
};

/* ------------------------------------------------------------------ */
/* SectionHeading                                                      */
/* ------------------------------------------------------------------ */
const SectionHeading = ({ icon: Icon, title, accent }) => (
  <div className="mb-3.5 flex items-center gap-2.5">
    <div
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white"
      style={{ background: accent || `linear-gradient(135deg, ${TOKENS.blue}, ${TOKENS.cyan})`, boxShadow: "0 4px 10px -3px rgba(37,84,235,0.45)" }}
    >
      <Icon size={13} />
    </div>
    <p className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: TOKENS.ink, fontFamily: FONT_DISPLAY }}>
      {title}
    </p>
  </div>
);

/* ------------------------------------------------------------------ */
/* EditVehicleModal                                                    */
/* ------------------------------------------------------------------ */
const EditVehicleModal = ({ open, vehicle, onClose, onSaved, toast }) => {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState([]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await getVehicleTypes();
        if (!cancelled) setVehicleTypes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load vehicle types:", err);
        if (!cancelled) setVehicleTypes([]);
      }
    })();
    return () => { cancelled = true; };
  }, [open]);

  useEffect(() => {
    if (open && vehicle) {
      const typeId =
        vehicle.vehicleType?.id ??
        vehicle.vehicleTypeId ??
        null;

      setForm({
        id: vehicle.id ?? vehicle.vehicleId ?? null,
        vehicleNumber: vehicle.vehicleNumber || "",
        vehicleName: vehicle.vehicleName || "",
        vehicleType: typeId != null ? String(typeId) : "",
        firstName: vehicle.firstName || "",
        lastName: vehicle.lastName || "",
        contactNo: vehicle.contactNo || "",
        address: vehicle.address || "",
        status: vehicle.status || "ACTIVE",
        amount: vehicle.amount ?? "",
        entryTime: formatDateTimeLocal(vehicle.entryTime),
        exitTime: formatDateTimeLocal(vehicle.exitTime),
        tokenNo: vehicle.tokenNo || "",
      });
    }
  }, [open, vehicle]);

  if (!open || !form) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const initials = [form.firstName, form.lastName].filter(Boolean).map((s) => s[0]?.toUpperCase()).join("") || "—";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const vehicleId = form.id ?? form.vehicleId ?? vehicle?.id ?? vehicle?.vehicleId;
      if (vehicleId == null) {
        toast?.error("Update failed", "Vehicle id is missing from this record.");
        return;
      }

      await updateVehicle(vehicleId, {
        vehicleNumber: form.vehicleNumber,
        vehicleName: form.vehicleName,
        vehicleType: form.vehicleType === "" ? null : Number(form.vehicleType),
        entryTime: form.entryTime ? new Date(form.entryTime).toISOString() : null,
        exitTime: form.exitTime ? new Date(form.exitTime).toISOString() : null,
        status: form.status,
        amount: form.amount === "" ? 0 : Number(form.amount),
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address,
        contactNo: form.contactNo,
      });

      toast?.success("Vehicle updated", `${form.vehicleNumber} was saved successfully.`);
      onSaved?.();
      onClose?.();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Couldn't save changes.";
      toast?.error("Update failed", message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} width={640}>
      <div
        className="relative overflow-hidden px-6 pb-6 pt-6"
        style={{ background: `linear-gradient(140deg, ${TOKENS.indigo} 0%, ${TOKENS.blue} 50%, ${TOKENS.cyan} 140%)` }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ background: "radial-gradient(120% 90% at 15% -10%, rgba(255,255,255,0.35) 0%, transparent 55%)" }}
        />
        <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-16 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)" }} />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-[15px] font-extrabold text-white ring-1 ring-white/30 backdrop-blur-md"
              style={{ fontFamily: FONT_DISPLAY, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 20px -8px rgba(0,0,0,0.35)" }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">Editing record</p>
              <p className="truncate text-[17px] font-extrabold tracking-wide text-white" style={{ fontFamily: FONT_MONO }}>
                {form.vehicleNumber || "New vehicle"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pe-focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-h-[68vh] overflow-y-auto pe-scrollbar px-6 py-5">
        <div
          className="rounded-2xl border p-4"
          style={{ borderColor: TOKENS.line, background: "linear-gradient(180deg, #ffffff 0%, #FAFBFD 100%)", boxShadow: "0 1px 2px rgba(15,23,42,0.03)" }}
        >
          <SectionHeading icon={Car} title="Vehicle" accent={`linear-gradient(135deg, ${TOKENS.blue}, ${TOKENS.cyan})`} />
          <div className="grid grid-cols-2 gap-3.5">
            <FieldShell label="Vehicle number" icon={Hash}>
              <input required className={glossyInputClass} style={glossyInputStyle} value={form.vehicleNumber} onChange={set("vehicleNumber")} />
            </FieldShell>
            <FieldShell label="Vehicle name" icon={Tag}>
              <input className={glossyInputClass} style={glossyInputStyle} value={form.vehicleName} onChange={set("vehicleName")} placeholder="e.g. Swift Dzire" />
            </FieldShell>
            <FieldShell label="Vehicle type">
              <Dropdown
                value={form.vehicleType}
                onChange={(v) => setForm((f) => ({ ...f, vehicleType: v }))}
                width="100%"
                options={
                  vehicleTypes.length > 0
                    ? vehicleTypes.map((t) => ({
                      value: String(t.id),
                      label: t.vehicleType,
                    }))
                    : [{ value: "", label: "Loading…" }]
                }
              />
            </FieldShell>
            <FieldShell label="Token no." icon={Ticket}>
              <input disabled className={`${glossyInputClass} font-mono`} style={glossyInputStyle} value={form.tokenNo} />
            </FieldShell>
          </div>
        </div>

        <div
          className="mt-3.5 rounded-2xl border p-4"
          style={{ borderColor: TOKENS.line, background: "linear-gradient(180deg, #ffffff 0%, #FAFBFD 100%)", boxShadow: "0 1px 2px rgba(15,23,42,0.03)" }}
        >
          <SectionHeading icon={User} title="Owner" accent={`linear-gradient(135deg, ${TOKENS.indigo}, ${TOKENS.blue})`} />
          <div className="grid grid-cols-2 gap-3.5">
            <FieldShell label="First name" icon={IdCard}>
              <input className={glossyInputClass} style={glossyInputStyle} value={form.firstName} onChange={set("firstName")} />
            </FieldShell>
            <FieldShell label="Last name" icon={IdCard}>
              <input className={glossyInputClass} style={glossyInputStyle} value={form.lastName} onChange={set("lastName")} />
            </FieldShell>
            <FieldShell label="Contact number" icon={Phone}>
              <input className={glossyInputClass} style={glossyInputStyle} value={form.contactNo} onChange={set("contactNo")} />
            </FieldShell>
            <FieldShell label="Address" icon={MapPin}>
              <input className={glossyInputClass} style={glossyInputStyle} value={form.address} onChange={set("address")} placeholder="e.g. Coimbatore" />
            </FieldShell>
          </div>
        </div>

        <div
          className="mt-3.5 rounded-2xl border p-4"
          style={{ borderColor: TOKENS.line, background: "linear-gradient(180deg, #ffffff 0%, #FAFBFD 100%)", boxShadow: "0 1px 2px rgba(15,23,42,0.03)" }}
        >
          <SectionHeading icon={ShieldCheck} title="Status & billing" accent="linear-gradient(135deg, #0E9F6E, #34D399)" />
          <div className="grid grid-cols-2 gap-3.5">
            <FieldShell label="Status">
              <Dropdown
                value={form.status}
                onChange={(v) => setForm((f) => ({ ...f, status: v }))}
                width="100%"
                options={[
                  { value: "ACTIVE", label: "Active" },
                  { value: "COMPLETED", label: "Exited" },
                  { value: "CANCELLED", label: "Cancelled" },
                ]}
              />
            </FieldShell>
            <FieldShell label="Amount" icon={BadgeIndianRupee}>
              <input type="number" min="0" step="0.01" className={glossyInputClass} style={glossyInputStyle} value={form.amount} onChange={set("amount")} />
            </FieldShell>
            <FieldShell label="Entry time" icon={LogIn}>
              <input type="datetime-local" className={glossyInputClass} style={glossyInputStyle} value={form.entryTime} onChange={set("entryTime")} />
            </FieldShell>
            <FieldShell label="Exit time" icon={CalendarClock}>
              <input type="datetime-local" className={glossyInputClass} style={glossyInputStyle} value={form.exitTime} onChange={set("exitTime")} />
            </FieldShell>
          </div>
        </div>

        <div className="sticky bottom-0 mt-5 -mx-6 flex items-center justify-end gap-2 border-t bg-white/95 px-6 pt-4 backdrop-blur" style={{ borderColor: TOKENS.line }}>
          <RippleButton type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </RippleButton>
          <RippleButton type="submit" disabled={saving}>
            {saving ? <Loader2 size={13} className="pe-refresh-spin" /> : <Check size={13} />}
            {saving ? "Saving…" : "Save changes"}
          </RippleButton>
        </div>
      </form>
    </Modal>
  );
};

/* ------------------------------------------------------------------ */
/* DeleteConfirmModal                                                  */
/* ------------------------------------------------------------------ */
const DeleteConfirmModal = ({ open, vehicle, onClose, onDeleted, toast }) => {
  const [deleting, setDeleting] = useState(false);
  if (!open || !vehicle) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const vehicleId = vehicle.id ?? vehicle.vehicleId;
      if (vehicleId == null) {
        toast?.error("Delete failed", "Vehicle id is missing from this record.");
        return;
      }
      await deleteVehicle(vehicleId);
      toast?.success("Vehicle removed", `${vehicle.vehicleNumber} was deleted.`);
      onDeleted?.();
      onClose?.();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Couldn't delete this vehicle.";
      toast?.error("Delete failed", message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} width={420}>
      <div className="px-6 py-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "#FEF2F2", color: TOKENS.danger }}>
          <AlertTriangle size={20} />
        </div>
        <h3 className="text-[15px] font-extrabold tracking-tight" style={{ fontFamily: FONT_DISPLAY, color: TOKENS.ink }}>
          Delete this vehicle record?
        </h3>
        <p className="mx-auto mt-2 max-w-xs text-[12.5px] leading-relaxed" style={{ color: TOKENS.inkSoft }}>
          <span className="font-mono font-semibold" style={{ color: TOKENS.ink }}>{vehicle.vehicleNumber}</span> and its parking history will be permanently removed. This can't be undone.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <RippleButton variant="secondary" onClick={onClose} disabled={deleting}>
            Cancel
          </RippleButton>
          <RippleButton variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Loader2 size={13} className="pe-refresh-spin" /> : <Trash2 size={13} />}
            {deleting ? "Deleting…" : "Delete vehicle"}
          </RippleButton>
        </div>
      </div>
    </Modal>
  );
};

/* ------------------------------------------------------------------ */
/* VehicleTicket                                                       */
/* ------------------------------------------------------------------ */
const VehicleTicket = ({ v, delay = 0, onView, onEdit, onDelete }) => (
  <div className="pe-ticket pe-animate-up relative flex flex-col gap-4 rounded-2xl border bg-white p-4 sm:flex-row sm:items-center" style={{ borderColor: TOKENS.line, animationDelay: `${delay}ms`, boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}>
    <div className="flex items-center gap-3 sm:w-[210px] sm:shrink-0">
      <VehicleTypeIcon type={v.vehicleType?.vehicleType} />
      <div className="min-w-0">
        <p className="truncate text-[14.5px] font-bold tracking-wide" style={{ fontFamily: FONT_MONO, color: TOKENS.ink }} title={v.vehicleNumber}>
          {v.vehicleNumber || "—"}
        </p>
        <p className="truncate text-[11px]" style={{ color: TOKENS.inkSoft }}>
          {v.vehicleName} &middot; {v.vehicleType?.vehicleType || "—"}
        </p>
      </div>
    </div>

    <div className="relative hidden self-stretch sm:block">
      <div className="h-full w-px" style={{ backgroundImage: `repeating-linear-gradient(to bottom, ${TOKENS.line} 0 6px, transparent 6px 12px)` }} />
      <span className="absolute -top-4 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full" style={{ background: TOKENS.bg }} />
      <span className="absolute -bottom-4 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full" style={{ background: TOKENS.bg }} />
    </div>
    <div className="block h-px w-full sm:hidden" style={{ backgroundImage: `repeating-linear-gradient(to right, ${TOKENS.line} 0 6px, transparent 6px 12px)` }} />

    <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Owner</p>
        <p className="truncate text-[12.5px] font-semibold" style={{ color: TOKENS.ink }}>
          {[v.firstName, v.lastName].filter(Boolean).join(" ") || "—"}
        </p>
        <p className="truncate text-[10.5px] text-slate-400">{v.contactNo || "—"}</p>
      </div>
      <div>
        <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400"><LogIn size={10} /> Entry</p>
        <p className="text-[12.5px] font-semibold" style={{ color: TOKENS.ink }}>{formatDateTime(v.entryTime)}</p>
      </div>
      <div>
        <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400"><LogOut size={10} /> Exit</p>
        <p className="text-[12.5px] font-semibold" style={{ color: TOKENS.ink }}>{v.exitTime ? formatDateTime(v.exitTime) : "Still parked"}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Status</p>
        <div className="mt-0.5"><StatusBadge status={v.status} /></div>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Token</p>
        <p className="inline-block rounded-md px-1.5 py-0.5 text-[11.5px] font-bold" style={{ fontFamily: FONT_MONO, color: TOKENS.blue, background: "#EEF2FF" }}>
          {v.tokenNo || "—"}
        </p>
        <p className="truncate text-[10.5px] text-slate-400" style={{ fontFamily: FONT_MONO }}>{formatCurrency(v.amount)}</p>
      </div>
    </div>

    <div className="flex shrink-0 items-center gap-1.5 self-start sm:self-center">
      <IconButton icon={Eye} label="View details" tone="blue" onClick={() => onView?.(v)} />
      <IconButton icon={Pencil} label="Edit vehicle" onClick={() => onEdit?.(v)} />
      <IconButton icon={Trash2} label="Delete vehicle" tone="danger" onClick={() => onDelete?.(v)} />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* DateField                                                           */
/* ------------------------------------------------------------------ */
const DateField = ({ label, value, onChange, icon: Icon }) => (
  <label className="flex flex-col gap-1">
    <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
      {Icon && <Icon size={11} />}
      {label}
    </span>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pe-focus-ring rounded-xl border bg-white px-3 py-2 text-[12.5px] font-medium outline-none transition"
      style={{ ...inputStyle, borderColor: TOKENS.line }}
    />
  </label>
);

/* ------------------------------------------------------------------ */
/* PageJump                                                            */
/* ------------------------------------------------------------------ */
const PageJump = ({ page, totalPages, onJump, disabled }) => {
  const [val, setVal] = useState(String(page + 1));

  useEffect(() => { setVal(String(page + 1)); }, [page]);

  const commit = () => {
    const n = parseInt(val, 10);
    const max = Math.max(1, totalPages);
    if (Number.isFinite(n) && n >= 1) {
      const clamped = Math.min(Math.max(1, n), max);
      onJump(clamped - 1);
    } else {
      setVal(String(page + 1));
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] text-slate-400">Go to</span>
      <input
        value={val}
        disabled={disabled}
        onChange={(e) => setVal(e.target.value.replace(/[^0-9]/g, ""))}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); }}
        onBlur={commit}
        className="pe-focus-ring w-12 rounded-lg border bg-white py-1.5 text-center text-[11.5px] font-bold outline-none disabled:opacity-50"
        style={{ borderColor: TOKENS.line, fontFamily: FONT_MONO, color: TOKENS.ink }}
      />
      <ArrowRight size={12} className="text-slate-300" />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* StatCard                                                            */
/* ------------------------------------------------------------------ */
const StatCard = ({ icon: Icon, label, value, suffix, accent, sub, delay = 0 }) => (
  <div
    className="pe-animate-up group relative overflow-hidden rounded-2xl p-5 transition-all duration-500 ease-out hover:-translate-y-2"
    style={{
      animationDelay: `${delay}ms`,
      background: "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
      border: "1px solid rgba(227, 231, 240, 0.8)",
      boxShadow: `
        0 2px 4px rgba(15,23,42,0.03),
        0 12px 28px -10px rgba(15,23,42,0.14),
        0 32px 64px -24px rgba(15,23,42,0.12),
        inset 0 1px 0 rgba(255,255,255,0.9)
      `,
    }}
  >
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-[1px]"
      style={{ background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.95) 50%, transparent 95%)" }}
    />
    <div
      className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-25 blur-3xl transition-all duration-500 group-hover:opacity-45 group-hover:scale-110"
      style={{ background: accent }}
    />
    <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full opacity-15 blur-3xl" style={{ background: accent }} />

    <div className="relative mb-5 inline-flex">
      <div className="absolute inset-0 translate-y-[6px] scale-95 rounded-2xl opacity-50 blur-[6px]" style={{ background: accent }} />
      <div
        className="relative flex h-12 w-12 items-center justify-center rounded-2xl text-white transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-0.5"
        style={{
          background: accent,
          boxShadow: `
            0 8px 20px -4px rgba(0,0,0,0.35),
            0 4px 8px -2px rgba(0,0,0,0.2),
            inset 0 2px 3px rgba(255,255,255,0.4),
            inset 0 -2px 4px rgba(0,0,0,0.2)
          `,
        }}
      >
        <div className="pointer-events-none absolute inset-[1px] rounded-[14px] bg-gradient-to-b from-white/25 to-transparent" />
        <Icon size={20} strokeWidth={2.3} className="relative drop-shadow-sm" />
      </div>
    </div>

    <p className="text-[28px] font-extrabold leading-none tracking-tight" style={{ fontFamily: FONT_DISPLAY, color: TOKENS.ink }}>
      {typeof value === "number" ? value.toLocaleString("en-IN") : value}
      {suffix && <span className="ml-1.5 text-[14px] font-semibold tracking-normal text-slate-400">{suffix}</span>}
    </p>
    <p className="mt-2 text-[12.5px] font-semibold tracking-wide" style={{ color: TOKENS.inkSoft, fontFamily: FONT_BODY }}>{label}</p>
    {sub && <p className="mt-1 text-[11px] font-medium text-slate-400/90">{sub}</p>}

    <div
      className="pointer-events-none absolute inset-x-4 bottom-0 h-px opacity-60"
      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)" }}
    />
  </div>
);

/* ------------------------------------------------------------------ */
/* FilterChip                                                          */
/* ------------------------------------------------------------------ */
const FilterChip = ({ label, onRemove }) => (
  <span
    className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold"
    style={{ borderColor: "#DCE3F5", background: "#F5F7FF", color: TOKENS.blue, fontFamily: FONT_BODY }}
  >
    {label}
    <button type="button" onClick={onRemove} className="rounded-full p-0.5 hover:bg-white/70" aria-label={`Remove ${label} filter`}>
      <X size={11} />
    </button>
  </span>
);

/* ------------------------------------------------------------------ */
/* VehiclesTab                                                         */
/* ------------------------------------------------------------------ */
const VehiclesTab = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const toast = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [meta, setMeta] = useState({ totalElements: 0, totalPages: 0, first: true, last: true });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  const [viewTarget, setViewTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [vehicleTypes, setVehicleTypes] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPageIndex(0);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const filterParams = useMemo(
    () => ({
      ...(search && { tokenIdOrVehicleNo: search }),
      ...(statusFilter && { status: statusFilter }),
      ...(typeFilter && { vehicleType: typeFilter }),
      ...(entryDate && { entryDate }),
      ...(exitDate && { exitDate }),
      page: pageIndex,
      size: pageSize,
    }),
    [search, statusFilter, typeFilter, entryDate, exitDate, pageIndex, pageSize]
  );

  const loadVehicles = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const { data } = await getVehicleList(filterParams);
      setVehicles(Array.isArray(data?.content) ? data.content : []);
      setMeta({
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? 0,
        first: data?.first ?? true,
        last: data?.last ?? true,
      });
      if (silent) toast.success("Refreshed", "Vehicle list is up to date.");
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Couldn't reach the parking API.";
      setError(message);
      setVehicles([]);
      setMeta({ totalElements: 0, totalPages: 0, first: true, last: true });
      if (silent) toast.error("Refresh Failed", message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filterParams, toast]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await getVehicleTypes();
        if (!cancelled) setVehicleTypes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load vehicle types:", err);
        if (!cancelled) setVehicleTypes([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleRefresh = () => loadVehicles({ silent: true });

  const handleFilterReset = (setter) => (val) => {
    setter(val);
    setPageIndex(0);
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatusFilter("");
    setTypeFilter("");
    setEntryDate("");
    setExitDate("");
    setPageIndex(0);
  };

  const activeFilterCount = [search, statusFilter, typeFilter, entryDate, exitDate].filter(Boolean).length;

  const downloadExport = async (kind) => {
    const setBusy = kind === "pdf" ? setExportingPdf : setExportingExcel;
    setBusy(true);
    try {
      const params = {
        ...(search && { tokenIdOrVehicleNo: search }),
        ...(statusFilter && { status: statusFilter }),
        ...(typeFilter && { vehicleType: typeFilter }),
        ...(entryDate && { entryDate }),
        ...(exitDate && { exitDate }),
      };

      const { data, headers } =
        kind === "pdf"
          ? await exportVehiclesPdf(params)
          : await exportVehiclesExcel(params);

      const blob = new Blob([data], {
        type: headers?.["content-type"] || (kind === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vehicles-export.${kind === "pdf" ? "pdf" : "xlsx"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Export ready", `Your ${kind.toUpperCase()} file has started downloading.`);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || `Couldn't export ${kind.toUpperCase()}.`;
      toast.error("Export failed", message);
    } finally {
      setBusy(false);
    }
  };

  const activeCount = vehicles.filter((v) => v.status === "ACTIVE").length;
  const busy = loading || refreshing;


  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard icon={Car} label="Total vehicles" value={meta.totalElements} accent={`linear-gradient(135deg, ${TOKENS.blue}, ${TOKENS.cyan})`} sub="across all pages" delay={0} />
        <StatCard icon={ShieldCheck} label="Active on this page" value={activeCount} accent="linear-gradient(135deg, #0E9F6E, #34D399)" sub={`of ${vehicles.length} shown`} delay={60} />
        <StatCard icon={FileText} label="Page" value={pageIndex + 1} suffix={meta.totalPages ? ` / ${meta.totalPages}` : ""} accent={`linear-gradient(135deg, ${TOKENS.indigo}, ${TOKENS.blue})`} sub={`${pageSize} per page`} delay={120} />
      </div>

      <div className="relative z-20 rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: TOKENS.line }}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className={`${inputClass} !py-2.5 !pl-9`}
              style={{ ...inputStyle, borderColor: TOKENS.line }}
              placeholder="Search by plate number or token…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl border bg-[#F8F9FC] p-1" style={{ borderColor: TOKENS.line }}>
              {[
                { value: "", label: "All" },
                { value: "ACTIVE", label: "Active" },
                { value: "EXIT", label: "Exited" },
              ].map((o) => {
                const active = statusFilter === o.value;
                return (
                  <button
                    key={o.value || "all"}
                    type="button"
                    onClick={() => handleFilterReset(setStatusFilter)(o.value)}
                    className="rounded-lg px-2.5 py-1.5 text-[11.5px] font-bold transition"
                    style={{
                      fontFamily: FONT_BODY,
                      color: active ? "#fff" : TOKENS.inkSoft,
                      background: active ? `linear-gradient(135deg, ${TOKENS.blue}, ${TOKENS.cyan})` : "transparent",
                    }}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>

            <RippleButton
              variant={showMoreFilters ? "secondary" : "secondary"}
              onClick={() => setShowMoreFilters((s) => !s)}
              className="!px-3"
              style={showMoreFilters ? { borderColor: TOKENS.blue, color: TOKENS.blue } : undefined}
            >
              <ListFilter size={13} />
              More filters
              {activeFilterCount > 0 && (
                <span
                  className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9.5px] font-extrabold text-white"
                  style={{ background: TOKENS.blue }}
                >
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown size={13} className="transition-transform" style={{ transform: showMoreFilters ? "rotate(180deg)" : "none" }} />
            </RippleButton>

            <RippleButton variant="secondary" onClick={() => downloadExport("excel")} disabled={exportingExcel} className="!px-3">
              {exportingExcel ? <Loader2 size={13} className="pe-refresh-spin" /> : <FileSpreadsheet size={13} />}
              Excel
            </RippleButton>
            <RippleButton variant="secondary" onClick={() => downloadExport("pdf")} disabled={exportingPdf} className="!px-3">
              {exportingPdf ? <Loader2 size={13} className="pe-refresh-spin" /> : <FileDown size={13} />}
              PDF
            </RippleButton>

            <RippleButton
              variant="secondary"
              onClick={handleRefresh}
              disabled={busy}
              className="!w-10 !h-10 !p-0 rounded-xl"
              title="Refresh"
              aria-label="Refresh vehicles"
            >
              <RefreshCcw size={16} strokeWidth={2} className={refreshing ? "pe-refresh-spin" : ""} />
            </RippleButton>
          </div>
        </div>

        {showMoreFilters && (
          <div className="pe-dropdown-panel mt-4 flex flex-wrap items-end gap-3 border-t pt-4" style={{ borderColor: TOKENS.line }}>
            <label className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400"><Car size={11} /> Vehicle type</span>
              <Dropdown
                value={typeFilter}
                onChange={handleFilterReset(setTypeFilter)}
                width={140}
                options={[
                  { value: "", label: "All types" },
                  ...(vehicleTypes.length > 0
                    ? vehicleTypes.map((t) => ({
                      value: t.vehicleType || String(t.id),
                      label: t.vehicleType || `Type ${t.id}`,
                    }))
                    : [{ value: "", label: "Loading…" }]),
                ]}
              />
            </label>

            <DateField label="Entry date" icon={LogIn} value={entryDate} onChange={handleFilterReset(setEntryDate)} />
            <DateField label="Exit date" icon={LogOut} value={exitDate} onChange={handleFilterReset(setExitDate)} />

            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Rows per page</span>
              <Dropdown
                value={String(pageSize)}
                onChange={(v) => { setPageSize(Number(v)); setPageIndex(0); }}
                width={120}
                options={[
                  { value: "10", label: "10 / page" },
                  { value: "20", label: "20 / page" },
                  { value: "50", label: "50 / page" },
                ]}
              />
            </label>

            <RippleButton variant="ghost" onClick={clearAllFilters} disabled={activeFilterCount === 0 && pageSize === 10} className="!px-3">
              <RotateCcw size={12} /> Clear all
            </RippleButton>
          </div>
        )}

        {activeFilterCount > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {search && <FilterChip label={`Search: ${search}`} onRemove={() => { setSearchInput(""); setSearch(""); setPageIndex(0); }} />}
            {statusFilter && <FilterChip label={STATUS_STYLES[statusFilter]?.label || statusFilter} onRemove={() => handleFilterReset(setStatusFilter)("")} />}
            {typeFilter && <FilterChip label={typeFilter === "CAR" ? "Car" : "Bike"} onRemove={() => handleFilterReset(setTypeFilter)("")} />}
            {entryDate && <FilterChip label={`Entry: ${entryDate}`} onRemove={() => handleFilterReset(setEntryDate)("")} />}
            {exitDate && <FilterChip label={`Exit: ${exitDate}`} onRemove={() => handleFilterReset(setExitDate)("")} />}
          </div>
        )}
      </div>

      {error && (
        <div className="pe-animate-up flex items-center justify-between gap-4 rounded-2xl border bg-white px-5 py-4" style={{ borderColor: "#E8EDF5", boxShadow: "0 8px 24px -18px rgba(15,23,42,0.25)" }}>
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: "#F1F5F9", color: "#64748B" }}>
              <WifiOff size={18} />
            </div>
            <div>
              <p className="text-[13px] font-bold" style={{ color: TOKENS.ink, fontFamily: FONT_BODY }}>Vehicle feed unavailable</p>
              <p className="mt-1 text-[11.5px]" style={{ color: TOKENS.inkSoft }}>Unable to load vehicles right now. Please try again.</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={busy}
            className="flex h-9 w-9 items-center justify-center rounded-xl border transition hover:bg-slate-50 active:scale-95 disabled:opacity-50"
            style={{ borderColor: TOKENS.line, color: TOKENS.inkSoft }}
            title="Retry"
          >
            <RefreshCcw size={15} className={refreshing ? "pe-refresh-spin" : ""} />
          </button>
        </div>
      )}

      <div className="relative z-0 flex flex-col gap-3">
        {loading && !error && Array.from({ length: 4 }).map((_, i) => <TicketSkeleton key={i} delay={i * 60} />)}

        {!loading && !error && vehicles.length === 0 && (
          <div className="rounded-2xl border border-dashed bg-white p-10 text-center" style={{ borderColor: TOKENS.line }}>
            <Ticket size={22} className="mx-auto mb-2 text-slate-300" />
            <p className="text-[12.5px] font-semibold" style={{ color: TOKENS.ink }}>No vehicles match these filters</p>
            <p className="mt-1 text-[11px] text-slate-400">Try clearing the search or switching filters.</p>
          </div>
        )}

        {!loading && vehicles.map((v, i) => (
          <VehicleTicket
            key={`${v.tokenNo}-${v.vehicleNumber}-${i}`}
            v={v}
            delay={i * 45}
            onView={(row) => setViewTarget(row.tokenNo || row.vehicleNumber)}
            onEdit={(row) => setEditTarget(row)}
            onDelete={(row) => setDeleteTarget(row)}
          />
        ))}
      </div>

      {!error && vehicles.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 sm:flex-row" style={{ borderColor: TOKENS.line }}>
          <p className="text-[11.5px] text-slate-400">
            Showing <span className="font-semibold text-slate-600">{pageIndex * pageSize + 1}</span>–
            <span className="font-semibold text-slate-600">{pageIndex * pageSize + vehicles.length}</span> of{" "}
            <span className="font-semibold text-slate-600">{meta.totalElements.toLocaleString("en-IN")}</span>
          </p>
          <div className="flex items-center gap-3">
            <PageJump page={pageIndex} totalPages={meta.totalPages} onJump={setPageIndex} disabled={busy} />
            <RippleButton variant="secondary" className="!px-3 !py-2" disabled={meta.first || busy} onClick={() => setPageIndex((p) => Math.max(0, p - 1))}>
              <ChevronLeft size={13} /> Prev
            </RippleButton>
            <span className="rounded-lg px-3 py-1.5 text-[11.5px] font-bold" style={{ background: "#EEF2FF", color: TOKENS.blue, fontFamily: FONT_MONO }}>
              {pageIndex + 1} / {Math.max(1, meta.totalPages)}
            </span>
            <RippleButton variant="secondary" className="!px-3 !py-2" disabled={meta.last || busy} onClick={() => setPageIndex((p) => p + 1)}>
              Next <ChevronRight size={13} />
            </RippleButton>
          </div>
        </div>
      )}

      <VehicleDetailModal
        open={!!viewTarget}
        tokenIdOrVehicleNo={viewTarget}
        onClose={() => setViewTarget(null)}
        toast={toast}
      />
      <EditVehicleModal
        open={!!editTarget}
        vehicle={editTarget}
        onClose={() => setEditTarget(null)}
        onSaved={() => loadVehicles({ silent: true })}
        toast={toast}
      />
      <DeleteConfirmModal
        open={!!deleteTarget}
        vehicle={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={() => loadVehicles({ silent: true })}
        toast={toast}
      />
    </div>
  );
};

export { VehiclesTab };