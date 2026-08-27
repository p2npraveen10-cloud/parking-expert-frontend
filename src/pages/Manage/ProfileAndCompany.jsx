import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Building2, Phone, MapPin, CalendarDays, Users as UsersIcon,
  CalendarClock, Building, BadgeCheck, Pencil, Check, Loader2, WifiOff,
  RefreshCcw, IdCard, Mail, Hash, Paperclip, Download, FileText,
  FileSpreadsheet, FileIcon, FileUp, FileDown, ArrowLeftRight, Send,
  Plus, Clock, Globe, X, ShieldCheck, Camera, Info, Trash2, PauseCircle, PlayCircle
} from "lucide-react";

import { useToast } from "../../context/ToastContext";
import {
  getUserProfile,
  updateUserProfile,
  getCompanyDetails,
  createCompany,
  updateCompanyDetails,
  getCompanyAttachments,
  deleteCompanyAttachment,
  uploadCompanyAttachment,
  exportCompanyJson,
  exportCompanyCsv,
  exportCompanyExcel,
  importCompanyDataJson,
  importCompanyDataCsv,
  getReportSchedule,
  saveReportSchedule,
  updateReportSchedule,
  deleteReportSchedule,
  toggleReportScheduleEnabled,
  uploadProfilePicture,
  uploadCompanyLogo,
} from "../../serviceCalls/apiCall";

import {
  FONT_DISPLAY,
  FONT_BODY,
  TOKENS,
  glossyInputClass,
  glossyInputStyle,
  RippleButton,
  FieldShell,
  Dropdown,
  Modal,
  ProfileSkeleton,
  formatMemberSince,
  formatScheduleSummary,
  extractScheduleList,
  FREQUENCY_OPTIONS,
  DAY_OF_WEEK_OPTIONS,
  TIMEZONE_OPTIONS,
  CONTENT_TYPE_OPTIONS,
  pad2,
} from "./manageShared";

const ProfileTab = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const toast = useToast();

  const syncHeaderUser = useCallback((p) => {
    if (!p) return;
    try {
      const raw = localStorage.getItem("user");
      const current = raw ? JSON.parse(raw) : {};
      const next = {
        ...current,
        firstName: p.firstName ?? current.firstName,
        lastName: p.lastName ?? current.lastName,
        profile: p.profile ?? current.profile,
        role: p.role ?? current.role,
        emailId: p.emailId ?? current.emailId,
        contactNo: p.contactNo ?? current.contactNo,
        mobileNumber: p.mobileNumber ?? current.mobileNumber,
        address: p.address ?? current.address,
        gender: p.gender ?? current.gender,
        dateOfBirth: p.dateOfBirth ?? current.dateOfBirth,
        company: p.company ?? current.company,
      };
      localStorage.setItem("user", JSON.stringify(next));
      window.dispatchEvent(new Event("user-profile-updated"));
    } catch (_) {}
  }, []);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getUserProfile();
      const p = data?.data ?? data;
      setProfile(p);
      syncHeaderUser(p);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Couldn't load your profile.");
    } finally {
      setLoading(false);
    }
  }, [syncHeaderUser]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const startEdit = () => {
    if (!profile) return;
    setForm({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      dateOfBirth: profile.dateOfBirth || "",
      mobileNumber: profile.mobileNumber || profile.contactNo || "",
      address: profile.address || "",
      contactNo: profile.contactNo || "",
      gender: profile.gender || "",
    });
    setAvatarFile(null);
    setAvatarPreview(null);
    setEditing(true);
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast?.error("Invalid file", "Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast?.error("File too large", "Please choose an image under 5MB.");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (avatarFile) {
        setUploadingAvatar(true);
        try {
          const formData = new FormData();
          formData.append("profilePicture", avatarFile);
          await uploadProfilePicture(formData);
        } catch (err) {
          const message = err?.response?.data?.message || err?.message || "Couldn't upload photo.";
          toast?.error("Photo upload failed", message);
          setUploadingAvatar(false);
          setSaving(false);
          return;
        }
        setUploadingAvatar(false);
      }

      await updateUserProfile(form);

      syncHeaderUser({
        ...profile,
        ...form,
      });

      toast?.success("Profile updated", "Your changes were saved successfully.");
      setEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      await loadProfile();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Couldn't save changes.";
      toast?.error("Update failed", message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ProfileSkeleton />;

  if (error) {
    return (
      <div
        className="pe-animate-up flex items-center justify-between gap-4 rounded-2xl border bg-white px-5 py-4 shadow-sm"
        style={{ borderColor: "#E8EDF5" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ background: `color-mix(in srgb, ${TOKENS.blue} 10%, white)`, color: TOKENS.blue }}
          >
            <WifiOff size={18} />
          </div>
          <div>
            <p className="text-[13px] font-bold" style={{ color: TOKENS.ink }}>
              Profile unavailable
            </p>
            <p className="mt-1 text-[11.5px]" style={{ color: TOKENS.inkSoft }}>
              {error}
            </p>
          </div>
        </div>
        <button
          onClick={loadProfile}
          className="flex h-9 w-9 items-center justify-center rounded-xl border transition hover:scale-105 active:scale-95"
          style={{ borderColor: TOKENS.line, color: TOKENS.blue, background: `color-mix(in srgb, ${TOKENS.blue} 6%, white)` }}
          title="Retry"
        >
          <RefreshCcw size={15} />
        </button>
      </div>
    );
  }

  if (!profile) return null;

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "—";
  const initials =
    [profile.firstName, profile.lastName]
      .filter(Boolean)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "—";

  const accentCycle = [TOKENS.indigo, TOKENS.blue, TOKENS.cyan];
  const infoItems = [
    { icon: Phone, label: "Contact number", value: profile.contactNo, mono: true },
    { icon: MapPin, label: "Address", value: profile.address },
    { icon: CalendarDays, label: "Date of birth", value: profile.dateOfBirth, mono: true },
    { icon: UsersIcon, label: "Gender", value: profile.gender },
    { icon: Building2, label: "Company", value: profile.company },
    { icon: CalendarClock, label: "Member since", value: formatMemberSince(profile.createdAt) },
  ];

  const avatarSrc = avatarPreview || profile.profile;

  return (
    <div className="pe-animate-up flex flex-col gap-5">
      <div className="rounded-[28px]">
        <div
          className="relative overflow-hidden rounded-[28px] px-6 pb-16 pt-8"
          style={{ background: `linear-gradient(155deg, ${TOKENS.blue} 0%, ${TOKENS.cyan} 55%, ${TOKENS.cyan} 150%)` }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-24 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={fullName}
                    className="h-[88px] w-[88px] rounded-[24px] object-cover ring-[3px] ring-white/40"
                    style={{ boxShadow: "0 16px 34px -12px rgba(0,0,0,0.55)" }}
                  />
                ) : (
                  <div
                    className="flex h-[88px] w-[88px] items-center justify-center rounded-[24px] bg-white/15 text-[24px] font-extrabold text-white ring-[3px] ring-white/30 backdrop-blur-md"
                    style={{ fontFamily: FONT_DISPLAY, boxShadow: "0 16px 34px -12px rgba(0,0,0,0.55)" }}
                  >
                    {initials}
                  </div>
                )}

                {!editing && (
                  <div
                    className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full ring-[3px] ring-white"
                    style={{ background: TOKENS.cyan }}
                    title="Verified account"
                  >
                    <BadgeCheck size={14} className="text-white" />
                  </div>
                )}

                {editing && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarPick}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="absolute inset-0 flex items-center justify-center rounded-[24px] bg-black/45 opacity-0 transition hover:opacity-100"
                      title="Change photo"
                    >
                      {uploadingAvatar ? (
                        <Loader2 size={18} className="pe-refresh-spin text-white" />
                      ) : (
                        <Camera size={18} className="text-white" />
                      )}
                    </button>
                  </>
                )}
              </div>

              <div className="min-w-0 pt-0.5">
                <p
                  className="truncate text-[23px] font-extrabold leading-tight tracking-tight text-white"
                  style={{ fontFamily: FONT_DISPLAY }}
                >
                  {fullName}
                </p>
                <div className="mt-1 h-[3px] w-10 rounded-full" style={{ background: "rgba(255,255,255,0.55)" }} />
                <p className="mt-2.5 truncate text-[12.5px] font-medium text-white/80">{profile.emailId || "—"}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/90">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck size={12} /> {profile.role || "—"}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span className="inline-flex items-center gap-1.5">
                    <Building size={12} /> {profile.company || "—"}
                  </span>
                </div>
              </div>
            </div>

            {!editing && (
              <RippleButton
                variant="secondary"
                onClick={startEdit}
                className="!border-white/30 !bg-white/15 !text-white shadow-[0_10px_24px_-10px_rgba(0,0,0,0.55)] backdrop-blur hover:!bg-white/25"
              >
                <Pencil size={13} /> Edit profile
              </RippleButton>
            )}
          </div>
        </div>

        <div
          className="relative z-10 -mt-10 rounded-[24px] border bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.45)]"
          style={{ borderColor: TOKENS.line }}
        >
          {!editing && (
            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {infoItems.map((item, i) => {
                const accent = accentCycle[i % accentCycle.length];
                return (
                  <div
                    key={item.label}
                    className="group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(15,23,42,0.35)]"
                    style={{ borderColor: TOKENS.line, background: `color-mix(in srgb, ${accent} 3%, white)` }}
                  >
                    <div className="absolute inset-y-0 left-0 w-[3px]" style={{ background: accent }} />
                    <div className="flex items-start gap-3 pl-1.5">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: `color-mix(in srgb, ${accent} 14%, white)`, color: accent }}
                      >
                        <item.icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: TOKENS.inkSoft }}>
                          {item.label}
                        </p>
                        <p
                          className={`mt-1 truncate text-[13.5px] font-semibold ${item.mono ? "font-mono tabular-nums" : ""}`}
                          style={{ color: TOKENS.ink }}
                        >
                          {item.value || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {editing && form && (
            <form onSubmit={handleSave} className="p-5">
              <div
                className="rounded-2xl border p-4 transition-shadow focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--pe-blue)_18%,transparent)]"
                style={{ borderColor: TOKENS.line, background: `color-mix(in srgb, ${TOKENS.blue} 2.5%, white)`, "--pe-blue": TOKENS.blue }}
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                    style={{ background: `linear-gradient(135deg, ${TOKENS.blue}, ${TOKENS.cyan})` }}
                  >
                    <IdCard size={15} />
                  </div>
                  <p className="text-[13px] font-bold" style={{ color: TOKENS.ink }}>
                    Personal details
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <FieldShell label="First name" icon={IdCard}>
                    <input required className={glossyInputClass} style={glossyInputStyle} value={form.firstName} onChange={set("firstName")} />
                  </FieldShell>
                  <FieldShell label="Last name" icon={IdCard}>
                    <input className={glossyInputClass} style={glossyInputStyle} value={form.lastName} onChange={set("lastName")} />
                  </FieldShell>
                  <FieldShell label="Date of birth" icon={CalendarDays}>
                    <input type="date" className={glossyInputClass} style={glossyInputStyle} value={form.dateOfBirth} onChange={set("dateOfBirth")} />
                  </FieldShell>
                  <FieldShell label="Gender">
                    <Dropdown
                      value={form.gender}
                      onChange={(v) => setForm((f) => ({ ...f, gender: v }))}
                      width="100%"
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                        { value: "Other", label: "Other" },
                      ]}
                    />
                  </FieldShell>
                </div>
              </div>

              <div
                className="mt-3.5 rounded-2xl border p-4 transition-shadow focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--pe-indigo)_18%,transparent)]"
                style={{ borderColor: TOKENS.line, background: `color-mix(in srgb, ${TOKENS.indigo} 2.5%, white)`, "--pe-indigo": TOKENS.indigo }}
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                    style={{ background: `linear-gradient(135deg, ${TOKENS.indigo}, ${TOKENS.blue})` }}
                  >
                    <Phone size={15} />
                  </div>
                  <p className="text-[13px] font-bold" style={{ color: TOKENS.ink }}>
                    Contact
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <FieldShell label="Contact number" icon={Phone}>
                    <input className={glossyInputClass} style={glossyInputStyle} value={form.contactNo} onChange={set("contactNo")} />
                  </FieldShell>
                  <FieldShell label="Address" icon={MapPin}>
                    <input className={glossyInputClass} style={glossyInputStyle} value={form.address} onChange={set("address")} />
                  </FieldShell>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t pt-4" style={{ borderColor: TOKENS.line }}>
                <RippleButton type="button" variant="secondary" onClick={() => setEditing(false)} disabled={saving}>
                  Cancel
                </RippleButton>
                <RippleButton
                  type="submit"
                  disabled={saving}
                  style={{ background: `linear-gradient(135deg, ${TOKENS.blue}, ${TOKENS.cyan})`, boxShadow: `0 12px 26px -10px color-mix(in srgb, ${TOKENS.blue} 60%, transparent)` }}
                >
                  {saving ? <Loader2 size={13} className="pe-refresh-spin" /> : <Check size={13} />}
                  {saving ? "Saving…" : "Save changes"}
                </RippleButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const ScheduleToggle = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className="relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 disabled:opacity-50"
    style={{
      background: checked
        ? `linear-gradient(135deg, ${TOKENS.indigo}, ${TOKENS.cyan})`
        : "#E2E8F0",
      boxShadow: checked
        ? `0 0 0 1px color-mix(in srgb, ${TOKENS.blue} 30%, transparent), 0 4px 10px -4px color-mix(in srgb, ${TOKENS.blue} 60%, transparent)`
        : "inset 0 1px 2px rgba(15,23,42,0.12)",
    }}
  >
    <span
      className="absolute top-0.5 h-6 w-6 rounded-full bg-white transition-all duration-300"
      style={{ left: checked ? "22px" : "2px", boxShadow: "0 2px 6px rgba(15,23,42,0.25)" }}
    />
  </button>
);

const ScheduleClock = ({ hour, minute }) => {
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;
  const rad = (deg) => (deg * Math.PI) / 180;
  return (
    <div className="pe3d-float relative mx-auto h-[132px] w-[132px]">
      <svg viewBox="0 0 200 200" className="pe3d-clock h-full w-full">
        <defs>
          <radialGradient id="peClockFace" cx="32%" cy="28%" r="85%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#F3F6FC" />
            <stop offset="100%" stopColor="#E4EAF5" />
          </radialGradient>
          <linearGradient id="peClockRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={TOKENS.indigo} />
            <stop offset="55%" stopColor={TOKENS.blue} />
            <stop offset="100%" stopColor={TOKENS.cyan} />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="96" fill="url(#peClockRim)" />
        <circle cx="100" cy="100" r="82" fill="url(#peClockFace)" />
        {[...Array(12)].map((_, i) => {
          const a = rad(i * 30);
          const x1 = 100 + 68 * Math.sin(a);
          const y1 = 100 - 68 * Math.cos(a);
          const x2 = 100 + 76 * Math.sin(a);
          const y2 = 100 - 76 * Math.cos(a);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#B8C4D9"
              strokeWidth={i % 3 === 0 ? 3 : 1.5}
              strokeLinecap="round"
            />
          );
        })}
        <line
          x1="100" y1="100"
          x2={100 + 40 * Math.sin(rad(hourAngle))}
          y2={100 - 40 * Math.cos(rad(hourAngle))}
          stroke={TOKENS.ink} strokeWidth="6" strokeLinecap="round"
        />
        <line
          x1="100" y1="100"
          x2={100 + 58 * Math.sin(rad(minuteAngle))}
          y2={100 - 58 * Math.cos(rad(minuteAngle))}
          stroke={TOKENS.blue} strokeWidth="4" strokeLinecap="round"
        />
        <circle cx="100" cy="100" r="6" fill={TOKENS.indigo} />
      </svg>
    </div>
  );
};

const CompanyTab = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);
  const [section, setSection] = useState("details");
  const [companyMissing, setCompanyMissing] = useState(null);
  const [createForm, setCreateForm] = useState({
    companyName: "",
    companyDescription: "",
    companyAddress: "",
    companyEmail: "",
    companyContactNo: "",
    gstNumber: "",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(null);
  const [contentType, setContentType] = useState("");
  const toast = useToast();

  const [importGuideOpen, setImportGuideOpen] = useState(false);
  const importGuideRef = useRef(null);

  const [deletingAttachmentId, setDeletingAttachmentId] = useState(null);
  const [attachmentDeleteConfirmId, setAttachmentDeleteConfirmId] = useState(null);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFileType, setUploadFileType] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadingAttachment, setUploadingAttachment] = useState(false);

  useEffect(() => {
    if (!importGuideOpen) return;
    const handleClickOutside = (e) => {
      if (importGuideRef.current && !importGuideRef.current.contains(e.target)) {
        setImportGuideOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [importGuideOpen]);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef(null);

  const [attachments, setAttachments] = useState(null);
  const [attachmentsLoading, setAttachmentsLoading] = useState(false);

  const [schedules, setSchedules] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleEditingId, setScheduleEditingId] = useState(null);
  const [deletingScheduleId, setDeletingScheduleId] = useState(null);
  const [togglingScheduleId, setTogglingScheduleId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [scheduleForm, setScheduleForm] = useState({
    frequency: "DAILY",
    hourOfDay: 9,
    minuteOfHour: 0,
    dayOfWeek: 1,
    dayOfMonth: 1,
    recipientEmail: "",
    enabled: true,
    timeZone: TIMEZONE_OPTIONS[0] || "UTC",
  });

  const defaultScheduleForm = () => ({
    frequency: "DAILY",
    hourOfDay: 9,
    minuteOfHour: 0,
    dayOfWeek: 1,
    dayOfMonth: 1,
    recipientEmail: "",
    enabled: true,
    timeZone: TIMEZONE_OPTIONS[0] || "UTC",
  });

  const loadCompany = useCallback(async ({ type = "", silent = false } = {}) => {
    if (silent) {
      setFiltering(true);
    } else {
      setLoading(true);
      setError(null);
    }

    try {
      /*
       * IMPORTANT COMPANY FLOW
       * ----------------------
       * Do NOT call getCompanyDetails() first.
       *
       * The logged-in user may legitimately have no company yet
       * (especially a first-time Google OAuth user). In that state the
       * company endpoint can return 404/throw "Company not found".
       * That is not a page error; it means we must show Create Company.
       *
       * Therefore we first read the authenticated user's profile and
       * determine whether the user is already attached to a company.
       * Only when a company exists do we call getCompanyDetails().
       */
      const profileResponse = await getUserProfile();
      const profilePayload = profileResponse?.data?.data ?? profileResponse?.data ?? null;

      console.log("[CompanyTab] Logged-in profile:", profilePayload);

      if (!profilePayload) {
        throw new Error("Unable to load the logged-in user profile.");
      }

      // The API may expose the relationship as `company`, or in some
      // projects as companyId/companyName. Support all of those shapes.
      const profileCompany = profilePayload.company;
      const profileCompanyId =
        profilePayload.companyId ??
        profilePayload.companyID ??
        profilePayload.company?.id ??
        profilePayload.company?.companyId;
      const profileCompanyName =
        profilePayload.companyName ??
        (typeof profileCompany === "string" ? profileCompany : profileCompany?.companyName);

      const hasCompany =
        (profileCompany &&
          (typeof profileCompany !== "object" || Object.keys(profileCompany).length > 0)) ||
        profileCompanyId != null ||
        Boolean(String(profileCompanyName || "").trim());

      // ------------------------------------------------------------
      // NO COMPANY: this is an expected state, not an API error.
      // Do NOT call getCompanyDetails().
      // ------------------------------------------------------------
      if (!hasCompany) {
        console.log("[CompanyTab] No company assigned -> showing Create Company UI");

        setCompany(null);
        setCompanyMissing(true);
        setError(null);

        // Pre-fill the company email from the logged-in user's email.
        // The user can still edit it before creating the company.
        if (profilePayload.emailId || profilePayload.email) {
          setCreateForm((prev) => ({
            ...prev,
            companyEmail:
              prev.companyEmail || profilePayload.emailId || profilePayload.email || "",
          }));
        }

        return;
      }

      // ------------------------------------------------------------
      // COMPANY EXISTS: now load the actual company record.
      // ------------------------------------------------------------
      console.log("[CompanyTab] Company exists -> loading company details");

      const params = type ? { contentType: type } : undefined;
      const { data } = await getCompanyDetails(params);

      let companyPayload = data?.data ?? data ?? null;

      if (
        companyPayload &&
        typeof companyPayload === "object" &&
        companyPayload.company &&
        typeof companyPayload.company === "object" &&
        !companyPayload.companyName &&
        !companyPayload.id &&
        !companyPayload.companyId
      ) {
        companyPayload = companyPayload.company;
      }

      const validCompany =
        companyPayload &&
        typeof companyPayload === "object" &&
        (
          companyPayload.id != null ||
          companyPayload.companyId != null ||
          Boolean(String(companyPayload.companyName || "").trim()) ||
          Boolean(String(companyPayload.companyEmail || "").trim())
        );

      if (!validCompany) {
        // The user profile says a company exists, but the details endpoint
        // did not return a usable company. Treat it as missing so the user
        // can recover instead of showing a generic error screen.
        console.warn("[CompanyTab] Company relationship exists but details are empty:", data);
        setCompany(null);
        setCompanyMissing(true);
        setError(null);
        return;
      }

      setCompany(companyPayload);
      setCompanyMissing(false);
      setError(null);
    } catch (err) {
      const status = err?.response?.status;
      const responseData = err?.response?.data;
      const apiMessage =
        responseData?.message ||
        responseData?.error ||
        (typeof responseData === "string" ? responseData : "") ||
        "";

      // Axios/Spring errors can put the message in err.message instead of
      // response.data.message, so inspect both.
      const combinedMessage = `${apiMessage} ${err?.message || ""}`.trim();

      const isMissingCompany =
        status === 404 ||
        status === 204 ||
        /company\s*(not\s*found|does\s*not\s*exist|missing|no\s*company)/i.test(
          combinedMessage
        );

      if (isMissingCompany) {
        console.log("[CompanyTab] Company missing -> showing Create Company UI");
        setCompany(null);
        setCompanyMissing(true);
        setError(null);
        return;
      }

      const message =
        apiMessage || err?.message || "Couldn't load your company information.";

      setCompany(null);
      setCompanyMissing(false);
      setError(message);

      if (silent) {
        toast?.error("Company load failed", message);
      }
    } finally {
      setLoading(false);
      setFiltering(false);
    }
  }, [toast]);

  const setCreateField = (key) => (e) =>
    setCreateForm((f) => ({ ...f, [key]: e.target.value }));

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!createForm.companyName.trim()) {
      setCreateError("Company name is required.");
      return;
    }
    if (!createForm.companyEmail.trim()) {
      setCreateError("Company email is required.");
      return;
    }

    setCreating(true);
    try {
      const { data: createRes } = await createCompany(createForm);
      const created =
        createRes?.data ?? createRes?.company ?? createRes ?? null;

      if (logoFile) {
        setUploadingLogo(true);
        try {
          const formData = new FormData();
          formData.append("companyLogo", logoFile);
          await uploadCompanyLogo(formData);
        } catch (err) {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Company was created, but the logo upload failed.";
          toast?.error("Logo upload failed", message);
        } finally {
          setUploadingLogo(false);
        }
      }

      toast?.success("Company created", "Your company details were saved.");
      setCompanyMissing(false);
      setCreateError("");
      setLogoFile(null);
      setLogoPreview(null);

      // Prefer the create response so the UI updates even if GET is briefly null
      if (
        created &&
        typeof created === "object" &&
        (created.companyName || created.id || created.companyId)
      ) {
        setCompany(created);
        setCompanyMissing(false);
      }

      // Re-fetch so attachments / status / owner match the server
      await loadCompany({ type: "", silent: false });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Couldn't create company.";
      setCreateError(message);
      toast?.error("Create failed", message);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    loadCompany({ type: "", silent: false });
  }, [loadCompany]);

  const loadAttachments = useCallback(async (type = "", { silent = false } = {}) => {
    if (silent) setFiltering(true);
    else setAttachmentsLoading(true);
    try {
      const normalized = (type || "").trim().toLowerCase();
      const supported = ["pdf", "excel", "image", "json", "csv"];
      const params =
        normalized && supported.includes(normalized)
          ? { contentType: normalized }
          : undefined;
      const { data } = await getCompanyAttachments(params);
      const payload = data?.data ?? data ?? [];
      let list = Array.isArray(payload) ? payload : payload?.attachments || [];
      if (normalized && !supported.includes(normalized) && normalized !== "all") {
        list = list.filter(
          (f) =>
            String(f.fileType || "").toLowerCase() === normalized ||
            String(f.contentType || "").toLowerCase().includes(normalized)
        );
      }
      setAttachments(list);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Couldn't load attachments.";
      toast?.error("Attachments failed", message);
      setAttachments([]);
    } finally {
      setAttachmentsLoading(false);
      setFiltering(false);
    }
  }, [toast]);

  useEffect(() => {
    if (section !== "attachments") return;
    loadAttachments(contentType);
  }, [section, contentType, loadAttachments]);

  const handleUploadAttachment = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      toast?.error("No file selected", "Please choose a file to upload.");
      return;
    }

    setUploadingAttachment(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      if (uploadFileType) {
        formData.append("fileType", String(uploadFileType).trim().toUpperCase());
      }
      if (uploadDescription?.trim()) {
        formData.append("description", uploadDescription.trim());
      }

      await uploadCompanyAttachment(formData);

      toast?.success("Attachment uploaded", "The file was added successfully.");
      setUploadModalOpen(false);
      setUploadFile(null);
      setUploadFileType("");
      setUploadDescription("");
      await loadAttachments(contentType, { silent: true });
    } catch (err) {
      toast?.error(
        "Upload failed",
        err?.response?.data?.message || err?.message || "Couldn't upload this file."
      );
    } finally {
      setUploadingAttachment(false);
    }
  };

  const handleDeleteAttachment = async (id) => {
    setDeletingAttachmentId(id);
    try {
      await deleteCompanyAttachment(id);
      setAttachments((prev) => (prev || []).filter((f) => f.id !== id));
      toast?.success("Attachment deleted", "The file was removed successfully.");
    } catch (err) {
      toast?.error(
        "Delete failed",
        err?.response?.data?.message || err?.message || "Couldn't delete this attachment."
      );
    } finally {
      setDeletingAttachmentId(null);
      setAttachmentDeleteConfirmId(null);
    }
  };

  const loadSchedules = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setScheduleLoading(true);
    try {
      const res = await getReportSchedule();
      const list = extractScheduleList(res?.data);
      setSchedules(list);
      if (!silent && list.length === 0) {
        console.info("[report/schedule] parsed empty list from response:", res?.data);
      }
    } catch (err) {
      console.error("[report/schedule] GET failed:", err?.response?.status, err?.response?.data || err?.message);
      setSchedules([]);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Couldn't load schedules.";
      toast?.error(
        err?.response?.status === 401 || err?.response?.status === 403
          ? "Auth required"
          : "Couldn't load schedules",
        err?.response?.status === 401 || err?.response?.status === 403
          ? "Schedule API needs the same login token as the rest of the app. Add getReportSchedule to apiCall or check localStorage token."
          : msg
      );
    } finally {
      setScheduleLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (section !== "reportScheduling") return;
    loadSchedules();
  }, [section, loadSchedules]);

  const handleContentTypeChange = (value) => {
    setContentType(value);
    loadAttachments(value, { silent: true });
  };

  const startEdit = () => {
    if (!company) return;
    setForm({
      companyName: company.companyName || "",
      companyDescription: company.companyDescription || "",
      companyAddress: company.companyAddress || "",
      companyContactNo: company.companyContactNo || "",
      gstNumber: company.gstNumber || "",
    });
    setLogoFile(null);
    setLogoPreview(null);
    setEditing(true);
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleLogoPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast?.error("Invalid file", "Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast?.error("File too large", "Please choose an image under 5MB.");
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (logoFile) {
        setUploadingLogo(true);
        try {
          const formData = new FormData();
          formData.append("companyLogo", logoFile);
          await uploadCompanyLogo(formData);
        } catch (err) {
          const message = err?.response?.data?.message || err?.message || "Couldn't upload logo.";
          toast?.error("Logo upload failed", message);
          setUploadingLogo(false);
          setSaving(false);
          return;
        }
        setUploadingLogo(false);
      }

      await updateCompanyDetails(form);

      setCompany((prev) => ({ ...prev, ...form }));

      toast?.success("Company updated", "Company details were saved successfully.");
      setEditing(false);
      setLogoFile(null);
      setLogoPreview(null);

      await loadCompany({ type: contentType, silent: true });
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Couldn't save changes.";
      toast?.error("Update failed", message);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format) => {
    setExporting(format);
    try {
      let response;
      if (format === "json") response = await exportCompanyJson();
      else if (format === "csv") response = await exportCompanyCsv();
      else response = await exportCompanyExcel();
      const data = response.data;
      const mime =
        format === "json"
          ? "application/json"
          : format === "csv"
            ? "text/csv"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const blob = new Blob([data], { type: mime });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `company-data.${format === "excel" ? "xlsx" : format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast?.success("Export ready", `Your ${format.toUpperCase()} file has been downloaded.`);
    } catch (err) {
      toast?.error("Export failed", err?.response?.data?.message || err?.message || "Couldn't export data.");
    } finally {
      setExporting(null);
    }
  };
  const getFileExt = (file) => file?.name?.split(".").pop()?.toLowerCase();

  const handleImport = async () => {
    if (!importFile) return;
    const ext = getFileExt(importFile);

    if (!["json", "csv"].includes(ext)) {
      toast?.error(
        "Unsupported file",
        "Only .json and .csv files can be imported right now."
      );
      return;
    }

    setImporting(true);
    try {
      const payload = new FormData();
      payload.append("file", importFile);

      if (ext === "csv") {
        await importCompanyDataCsv(payload);
      } else {
        await importCompanyDataJson(payload);
      }

      toast?.success("Import complete", "Your file has been imported successfully.");
      setImportFile(null);
      loadCompany({ type: contentType, silent: true });
      loadAttachments(contentType, { silent: true });
    } catch (err) {
      toast?.error("Import failed", err?.response?.data?.message || err?.message || "Couldn't import this file.");
    } finally {
      setImporting(false);
    }
  };

  const openCreateSchedule = () => {
    setScheduleEditingId(null);
    setScheduleForm(defaultScheduleForm());
    setScheduleModalOpen(true);
  };

  const openEditSchedule = (s) => {
    setScheduleEditingId(s.id ?? s.jobKey);
    setScheduleForm({
      frequency: s.frequency || "DAILY",
      hourOfDay: s.hourOfDay ?? 9,
      minuteOfHour: s.minuteOfHour ?? 0,
      dayOfWeek: s.dayOfWeek ?? 1,
      dayOfMonth: s.dayOfMonth ?? 1,
      recipientEmail: s.recipientEmail || "",
      enabled: s.enabled !== false,
      timeZone: s.timeZone || TIMEZONE_OPTIONS[0] || "UTC",
    });
    setScheduleModalOpen(true);
  };

  const handleScheduleSave = async (e) => {
    e.preventDefault();
    setScheduleSaving(true);
    try {
      const payload = {
        frequency: scheduleForm.frequency,
        hourOfDay: scheduleForm.hourOfDay,
        minuteOfHour: scheduleForm.minuteOfHour,
        dayOfWeek: scheduleForm.frequency === "WEEKLY" ? scheduleForm.dayOfWeek : null,
        dayOfMonth: scheduleForm.frequency === "MONTHLY" ? scheduleForm.dayOfMonth : null,
        recipientEmail: scheduleForm.recipientEmail,
        enabled: scheduleForm.enabled,
        timeZone: scheduleForm.timeZone,
      };

      if (scheduleEditingId) {
        await updateReportSchedule(scheduleEditingId, payload);
        toast?.success("Schedule updated", "The report email schedule was updated.");
      } else {
        await saveReportSchedule(payload);
        toast?.success("Schedule created", "The report email schedule was saved.");
      }

      setScheduleModalOpen(false);
      setScheduleEditingId(null);
      await loadSchedules({ silent: true });
    } catch (err) {
      toast?.error(
        "Save failed",
        err?.response?.data?.message || err?.message || "Couldn't save the schedule."
      );
    } finally {
      setScheduleSaving(false);
    }
  };
  const handleDeleteSchedule = async (id) => {
    setDeletingScheduleId(id);
    try {
      await deleteReportSchedule(id);
      setSchedules((prev) => (prev || []).filter((s) => (s.id ?? s.jobKey) !== id));
      toast?.success("Schedule deleted", "The report schedule was removed.");
    } catch (err) {
      toast?.error("Delete failed", err?.response?.data?.message || err?.message || "Couldn't delete the schedule.");
    } finally {
      setDeletingScheduleId(null);
      setDeleteConfirmId(null);
    }
  };

  const handleToggleEnabled = async (schedule) => {
    const id = schedule.id ?? schedule.jobKey;
    const next = !(schedule.enabled !== false);

    setTogglingScheduleId(id);
    setSchedules((prev) =>
      (prev || []).map((s) => ((s.id ?? s.jobKey) === id ? { ...s, enabled: next } : s))
    );

    try {
      await toggleReportScheduleEnabled(id, next);
    } catch (err) {
      setSchedules((prev) =>
        (prev || []).map((s) => ((s.id ?? s.jobKey) === id ? { ...s, enabled: !next } : s))
      );
      toast?.error("Update failed", err?.response?.data?.message || err?.message || "Couldn't update the schedule status.");
    } finally {
      setTogglingScheduleId(null);
    }
  };

  if (loading) return <ProfileSkeleton />;

  if (companyMissing === true) {
  return (
    <div
      className="pe-animate-up overflow-hidden rounded-3xl border bg-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)]"
      style={{ borderColor: TOKENS.line }}
    >
      {/* Header */}
      <div
        className="relative overflow-hidden px-6 py-5"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${TOKENS.blue} 8%, white), color-mix(in srgb, ${TOKENS.cyan} 6%, white))`,
          borderBottom: `1px solid ${TOKENS.line}`,
        }}
      >
        <div className="relative z-10 flex items-start gap-3.5">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${TOKENS.blue}, ${TOKENS.cyan})`,
              boxShadow: `0 10px 20px -8px color-mix(in srgb, ${TOKENS.blue} 55%, transparent)`,
            }}
          >
            <Building2 size={18} strokeWidth={2.2} />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className="text-[15px] font-bold tracking-tight" style={{ color: TOKENS.ink }}>
              Create your company
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: TOKENS.inkSoft }}>
              Add a few details to unlock parking management, reports, and invoicing.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleCreateCompany} className="px-6 pb-6 pt-5">
        {/* Logo picker */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative shrink-0">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoPick}
            />

            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Company logo preview"
                className="h-[72px] w-[72px] rounded-2xl object-cover ring-4 ring-white"
                style={{
                  boxShadow: "0 12px 28px -10px rgba(15,23,42,0.28)",
                }}
              />
            ) : (
              <div
                className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl text-white"
                style={{
                  background: `linear-gradient(145deg, ${TOKENS.indigo}, ${TOKENS.blue})`,
                  boxShadow: `0 12px 28px -10px color-mix(in srgb, ${TOKENS.indigo} 45%, transparent)`,
                }}
              >
                <Building2 size={26} strokeWidth={1.8} />
              </div>
            )}

            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={uploadingLogo}
              className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full text-white transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-70"
              style={{
                background: TOKENS.blue,
                boxShadow: "0 4px 12px -2px rgba(37,99,235,0.45)",
                border: "3px solid white",
              }}
              title="Choose logo"
            >
              {uploadingLogo ? (
                <Loader2 size={13} className="pe-refresh-spin" />
              ) : (
                <Camera size={13} strokeWidth={2.2} />
              )}
            </button>
          </div>

          <div className="min-w-0">
            <p className="text-[13px] font-semibold" style={{ color: TOKENS.ink }}>
              Company logo
            </p>
            <p className="mt-0.5 text-[11.5px] leading-snug" style={{ color: TOKENS.inkSoft }}>
              Optional · PNG or JPG · max 5 MB
            </p>
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={uploadingLogo}
              className="mt-2 text-[11.5px] font-semibold transition-colors hover:underline disabled:opacity-60"
              style={{ color: TOKENS.blue }}
            >
              {uploadingLogo ? "Uploading…" : "Upload image"}
            </button>
          </div>
        </div>

        {/* Error */}
        {/* {createError && (
          <div
            className="mb-5 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-[12.5px] font-medium"
            style={{
              background: "#FEF2F2",
              color: "#B91C1C",
              border: "1px solid #FECACA",
            }}
          >
            <span className="mt-0.5 shrink-0 text-[14px]">⚠</span>
            <span>{createError}</span>
          </div>
        )} */}

        {/* Fields */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div className="col-span-2">
            <FieldShell label="Company name" icon={Building2}>
              <input
                required
                className={glossyInputClass}
                style={glossyInputStyle}
                value={createForm.companyName}
                onChange={setCreateField("companyName")}
                placeholder="Acme Parking Pvt Ltd"
              />
            </FieldShell>
          </div>

          <FieldShell label="Company email" icon={Mail}>
            <input
              required
              type="email"
              className={glossyInputClass}
              style={glossyInputStyle}
              value={createForm.companyEmail}
              onChange={setCreateField("companyEmail")}
              placeholder="hello@company.com"
            />
          </FieldShell>

          <FieldShell label="Contact number" icon={Phone}>
            <input
              className={glossyInputClass}
              style={glossyInputStyle}
              value={createForm.companyContactNo}
              onChange={setCreateField("companyContactNo")}
              placeholder="9938205998"
            />
          </FieldShell>

          <FieldShell label="GST number" icon={Hash}>
            <input
              className={glossyInputClass}
              style={glossyInputStyle}
              value={createForm.gstNumber}
              onChange={setCreateField("gstNumber")}
              placeholder="22AAAAA0000A1Z5"
            />
          </FieldShell>

          <FieldShell label="Address" icon={MapPin}>
            <input
              className={glossyInputClass}
              style={glossyInputStyle}
              value={createForm.companyAddress}
              onChange={setCreateField("companyAddress")}
              placeholder="Street, City, PIN"
            />
          </FieldShell>
        </div>

        <div className="mt-4">
          <FieldShell label="Description" icon={FileText}>
            <textarea
              rows={3}
              className={`${glossyInputClass} resize-none`}
              style={glossyInputStyle}
              value={createForm.companyDescription}
              onChange={setCreateField("companyDescription")}
              placeholder="Briefly describe your company…"
            />
          </FieldShell>
        </div>

        {/* Footer action */}
        <div
          className="mt-6 flex items-center justify-end gap-3 border-t pt-5"
          style={{ borderColor: TOKENS.line }}
        >
          <RippleButton
            type="submit"
            disabled={creating}
            className="pe3d-shine min-w-[148px] justify-center gap-2 px-5 py-2.5 text-[13px] font-semibold"
            style={{
              background: `linear-gradient(135deg, ${TOKENS.indigo}, ${TOKENS.blue})`,
              boxShadow: `0 14px 30px -12px color-mix(in srgb, ${TOKENS.blue} 65%, transparent)`,
              color: "white",
            }}
          >
            {creating ? (
              <>
                <Loader2 size={14} className="pe-refresh-spin" />
                Creating…
              </>
            ) : (
              <>
                <Check size={14} strokeWidth={2.4} />
                Create company
              </>
            )}
          </RippleButton>
        </div>
      </form>
    </div>
  );
}


  if (error) {
    return (
      <div className="pe-animate-up flex items-center justify-between gap-4 rounded-2xl border bg-white px-5 py-4 shadow-sm" style={{ borderColor: "#E8EDF5" }}>
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: `color-mix(in srgb, ${TOKENS.blue} 10%, white)`, color: TOKENS.blue }}>
            <WifiOff size={18} />
          </div>
          <div>
            <p className="text-[13px] font-bold" style={{ color: TOKENS.ink }}>Company unavailable</p>
            <p className="mt-1 text-[11.5px]" style={{ color: TOKENS.inkSoft }}>{error}</p>
          </div>
        </div>
        <button onClick={() => loadCompany()} className="flex h-9 w-9 items-center justify-center rounded-xl border transition hover:scale-105 active:scale-95" style={{ borderColor: TOKENS.line, color: TOKENS.blue, background: `color-mix(in srgb, ${TOKENS.blue} 6%, white)` }} title="Retry">
          <RefreshCcw size={15} />
        </button>
      </div>
    );
  }

  if (!company) return null;

  const initials = (company.companyName || "—").split(" ").filter(Boolean).map((s) => s[0]?.toUpperCase()).slice(0, 2).join("");
  const statusTone = company.status === "ACTIVE" ? TOKENS.cyan : TOKENS.inkSoft;
  const accentCycle = [TOKENS.indigo, TOKENS.blue, TOKENS.cyan];
  const infoItems = [
    { icon: Mail, label: "Email", value: company.companyEmail },
    { icon: Phone, label: "Contact number", value: company.companyContactNo, mono: true },
    { icon: MapPin, label: "Address", value: company.companyAddress },
    { icon: Hash, label: "GST number", value: company.gstNumber },
    { icon: CalendarDays, label: "Registered on", value: formatMemberSince(company.createdAt) },
    { icon: CalendarClock, label: "Last updated", value: formatMemberSince(company.updatedAt) },
  ];
  const sections = [
    { id: "details", label: "Details", icon: Building2 },
    { id: "attachments", label: "Attachments", icon: Paperclip, count: attachments?.length || 0 },
    { id: "importExport", label: "Import & export", icon: ArrowLeftRight },
    { id: "reportScheduling", label: "Report scheduling", icon: Send },
  ];

  const fileIcon = (type) => {
    const t = String(type || "").toUpperCase();
    if (t === "PDF") return FileText;
    if (t === "EXCEL") return FileSpreadsheet;
    return FileIcon;
  };
  const fileTone = (type) => {
    const t = String(type || "").toUpperCase();
    if (t === "PDF") return "#E23744";
    if (t === "EXCEL") return "#1D7A46";
    if (t === "IMAGE") return TOKENS.cyan;
    if (t === "AUDIO") return TOKENS.indigo;
    return TOKENS.blue;
  };
  const formatBytes = (n) => {
    if (!n && n !== 0) return "—";
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="pe-animate-up flex flex-col gap-5">
      <style>{`
        @keyframes pe3dFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        .pe3d-float { animation: pe3dFloat 4.5s ease-in-out infinite; }
        @keyframes pe3dSpin { to { transform: rotate(360deg); } }
        .pe3d-ring { animation: pe3dSpin 9s linear infinite; }
        @keyframes pe3dShimmer { 0% { transform: translateX(-130%) rotate(8deg); } 100% { transform: translateX(230%) rotate(8deg); } }
        .pe3d-shine { position: relative; overflow: hidden; }
        .pe3d-shine::after {
          content: "";
          position: absolute;
          top: -40%;
          left: 0;
          width: 26%;
          height: 180%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.6), transparent);
          opacity: 0;
          pointer-events: none;
        }
        .pe3d-shine:hover::after { opacity: 1; animation: pe3dShimmer 1s ease; }
        .pe3d-card { transition: transform .35s ease, box-shadow .35s ease; transform-style: preserve-3d; }
        .pe3d-card:hover {  box-shadow: 0 16px 34px -18px rgba(15,23,42,0.4);}
        .pe3d-clock { filter: drop-shadow(0 14px 20px rgba(30, 41, 59, 0.28)); }
        @media (prefers-reduced-motion: reduce) {
          .pe3d-float, .pe3d-ring, .pe3d-shine::after { animation: none !important; }
        }
      `}</style>

      <div className="rounded-[28px]">
        <div className="relative overflow-hidden rounded-[28px] px-6 pb-16 pt-8" style={{ background: `linear-gradient(155deg, ${TOKENS.indigo} 0%, ${TOKENS.blue} 55%, ${TOKENS.cyan} 150%)` }}>
          <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-24 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute right-24 bottom-0 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0" style={{ perspective: "700px" }}>
                <div
                  className="pe3d-ring absolute -inset-1.5 rounded-[28px] opacity-70"
                  style={{ background: `conic-gradient(from 0deg, ${TOKENS.cyan}, ${TOKENS.blue}, ${TOKENS.indigo}, ${TOKENS.cyan})`, filter: "blur(3px)" }}
                />
                {(logoPreview || company.companyLogo) ? (
                  <img
                    src={logoPreview || company.companyLogo}
                    alt={company.companyName}
                    className="pe3d-card relative h-[88px] w-[88px] rounded-[24px] object-cover ring-[3px] ring-white/40"
                    style={{ boxShadow: "0 16px 34px -12px rgba(0,0,0,0.55)" }}
                  />
                ) : (
                  <div
                    className="pe3d-card relative flex h-[88px] w-[88px] items-center justify-center rounded-[24px] bg-white/15 text-[24px] font-extrabold text-white ring-[3px] ring-white/30 backdrop-blur-md"
                    style={{ fontFamily: FONT_DISPLAY, boxShadow: "0 16px 34px -12px rgba(0,0,0,0.55)" }}
                  >
                    {initials || <Building2 size={30} />}
                  </div>
                )}

                {!editing && (
                  <div
                    className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full ring-[3px] ring-white"
                    style={{ background: statusTone }}
                    title={company.status}
                  >
                    <ShieldCheck size={14} className="text-white" />
                  </div>
                )}

                {editing && (
                  <>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoPick}
                    />
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploadingLogo}
                      className="absolute inset-0 flex items-center justify-center rounded-[24px] bg-black/45 opacity-0 transition hover:opacity-100"
                      title="Change logo"
                    >
                      {uploadingLogo ? (
                        <Loader2 size={18} className="pe-refresh-spin text-white" />
                      ) : (
                        <Camera size={18} className="text-white" />
                      )}
                    </button>
                  </>
                )}
              </div>

              <div className="min-w-0 pt-0.5">
                <p className="truncate text-[23px] font-extrabold leading-tight tracking-tight text-white" style={{ fontFamily: FONT_DISPLAY }}>{company.companyName || "—"}</p>
                <div className="mt-1 h-[3px] w-10 rounded-full" style={{ background: "rgba(255,255,255,0.55)" }} />
                <p className="mt-2.5 max-w-md truncate text-[12.5px] font-medium text-white/80">{company.companyDescription || "—"}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/90">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusTone }} /> {company.status || "—"}
                  </span>
                </div>
              </div>
            </div>

            {!editing && section === "details" && (
              <RippleButton variant="secondary" onClick={startEdit} className="!border-white/30 !bg-white/15 !text-white shadow-[0_10px_24px_-10px_rgba(0,0,0,0.55)] backdrop-blur hover:!bg-white/25">
                <Pencil size={13} /> Edit company
              </RippleButton>
            )}
          </div>
        </div>

        <div className="relative z-10 -mt-10 rounded-[24px] border bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.45)]" style={{ borderColor: TOKENS.line }}>
          <div className="flex flex-wrap items-center gap-1.5 border-b p-3" style={{ borderColor: TOKENS.line }}>
            {sections.map((s) => {
              const active = section === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => { setSection(s.id); setEditing(false); }}
                  className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12px] font-bold transition"
                  style={active
                    ? { background: `color-mix(in srgb, ${TOKENS.blue} 12%, white)`, color: TOKENS.blue, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${TOKENS.blue} 22%, transparent)` }
                    : { color: TOKENS.inkSoft }}
                >
                  <s.icon size={14} />
                  {s.label}
                  {typeof s.count === "number" && (
                    <span className="rounded-full px-1.5 py-0.5 text-[10px]" style={{ background: active ? `color-mix(in srgb, ${TOKENS.blue} 18%, white)` : "#F1F5F9", color: active ? TOKENS.blue : TOKENS.inkSoft }}>
                      {s.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {section === "details" && !editing && (
            <div className="p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {infoItems.map((item, i) => {
                  const accent = accentCycle[i % accentCycle.length];
                  return (
                    <div key={item.label} className="pe3d-card group relative overflow-hidden rounded-2xl border p-4 hover:shadow-[0_16px_34px_-18px_rgba(15,23,42,0.4)]" style={{ borderColor: TOKENS.line, background: `color-mix(in srgb, ${accent} 3%, white)` }}>
                      <div className="absolute inset-y-0 left-0 w-[3px]" style={{ background: accent }} />
                      <div className="flex items-start gap-3 pl-1.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: `color-mix(in srgb, ${accent} 14%, white)`, color: accent, boxShadow: `0 6px 14px -8px color-mix(in srgb, ${accent} 60%, transparent)` }}>
                          <item.icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: TOKENS.inkSoft }}>{item.label}</p>
                          <p className={`mt-1 truncate text-[13.5px] font-semibold ${item.mono ? "font-mono tabular-nums" : ""}`} style={{ color: TOKENS.ink }}>{item.value || "—"}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {company.owner && (
                <div className="pe3d-card mt-4 rounded-2xl border p-4" style={{ borderColor: TOKENS.line, background: "linear-gradient(180deg, #ffffff 0%, #FAFBFD 100%)" }}>
                  <p className="mb-3 text-[10.5px] font-bold uppercase tracking-wide" style={{ color: TOKENS.inkSoft }}>Company owner</p>
                  <div className="flex flex-wrap items-center gap-4">
                    {company.owner.profile ? (
                      <img src={company.owner.profile} alt={company.owner.firstName} className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white" style={{ boxShadow: "0 8px 18px -8px rgba(15,23,42,0.35)" }} />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-[15px] font-extrabold text-white" style={{ background: `linear-gradient(135deg, ${TOKENS.indigo}, ${TOKENS.blue})`, fontFamily: FONT_DISPLAY }}>
                        {[company.owner.firstName, company.owner.lastName].filter(Boolean).map((s) => s[0]).join("")}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-bold" style={{ color: TOKENS.ink }}>{[company.owner.firstName, company.owner.lastName].filter(Boolean).join(" ")}</p>
                      <p className="truncate text-[12px]" style={{ color: TOKENS.inkSoft }}>{company.owner.emailId}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide" style={{ background: `color-mix(in srgb, ${TOKENS.blue} 12%, white)`, color: TOKENS.blue }}>
                      <ShieldCheck size={11} /> {company.owner.role}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ background: "#F1F5F9", color: TOKENS.inkSoft }}>
                      <Phone size={11} /> {company.owner.contactNo || "—"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {section === "details" && editing && form && (
            <form onSubmit={handleSave} className="p-5">
              <div className="rounded-2xl border p-4" style={{ borderColor: TOKENS.line, background: `color-mix(in srgb, ${TOKENS.blue} 2.5%, white)` }}>
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: `linear-gradient(135deg, ${TOKENS.blue}, ${TOKENS.cyan})` }}>
                    <Building2 size={15} />
                  </div>
                  <p className="text-[13px] font-bold" style={{ color: TOKENS.ink }}>Company details</p>
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <FieldShell label="Company name" icon={Building2}>
                    <input required className={glossyInputClass} style={glossyInputStyle} value={form.companyName} onChange={set("companyName")} />
                  </FieldShell>
                  <FieldShell label="GST number" icon={Hash}>
                    <input className={glossyInputClass} style={glossyInputStyle} value={form.gstNumber} onChange={set("gstNumber")} />
                  </FieldShell>
                  <FieldShell label="Contact number" icon={Phone}>
                    <input className={glossyInputClass} style={glossyInputStyle} value={form.companyContactNo} onChange={set("companyContactNo")} />
                  </FieldShell>
                  <FieldShell label="Address" icon={MapPin}>
                    <input className={glossyInputClass} style={glossyInputStyle} value={form.companyAddress} onChange={set("companyAddress")} />
                  </FieldShell>
                </div>
                <div className="mt-3.5">
                  <FieldShell label="Description" icon={FileText}>
                    <textarea rows={3} className={glossyInputClass} style={glossyInputStyle} value={form.companyDescription} onChange={set("companyDescription")} />
                  </FieldShell>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t pt-4" style={{ borderColor: TOKENS.line }}>
                <RippleButton type="button" variant="secondary" onClick={() => setEditing(false)} disabled={saving}>Cancel</RippleButton>
                <RippleButton type="submit" disabled={saving} className="pe3d-shine" style={{ background: `linear-gradient(135deg, ${TOKENS.indigo}, ${TOKENS.blue})`, boxShadow: `0 12px 26px -10px color-mix(in srgb, ${TOKENS.blue} 60%, transparent)` }}>
                  {saving ? <Loader2 size={13} className="pe-refresh-spin" /> : <Check size={13} />}
                  {saving ? "Saving…" : "Save changes"}
                </RippleButton>
              </div>
            </form>
          )}

          {section === "attachments" && (
            <div className="p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: TOKENS.inkSoft }}>
                  Filter by content type
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 rounded-xl border bg-[#F8F9FC] p-1" style={{ borderColor: TOKENS.line }}>
                    {CONTENT_TYPE_OPTIONS.map((o) => {
                      const active = contentType === o.value;
                      return (
                        <button
                          key={o.value || "all"}
                          type="button"
                          onClick={() => handleContentTypeChange(o.value)}
                          disabled={filtering}
                          className="rounded-lg px-2.5 py-1.5 text-[11.5px] font-bold transition disabled:opacity-60"
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
                    type="button"
                    onClick={() => setUploadModalOpen(true)}
                    className="pe3d-shine"
                    style={{ background: `linear-gradient(135deg, ${TOKENS.indigo}, ${TOKENS.blue})`, boxShadow: `0 10px 22px -10px color-mix(in srgb, ${TOKENS.blue} 55%, transparent)` }}
                  >
                    <Plus size={14} /> Upload attachment
                  </RippleButton>
                </div>
              </div>

              {filtering && (
                <div className="mb-3 flex items-center gap-2 text-[12px]" style={{ color: TOKENS.inkSoft }}>
                  <Loader2 size={14} className="pe-refresh-spin" />
                  Updating attachments…
                </div>
              )}

              {attachmentsLoading && attachments == null ? (
                <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed py-14 text-[12.5px] font-semibold" style={{ borderColor: TOKENS.line, color: TOKENS.inkSoft }}>
                  <Loader2 size={16} className="pe-refresh-spin" /> Loading attachments…
                </div>
              ) : !attachments || attachments.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed py-10 text-center" style={{ borderColor: TOKENS.line }}>
                  <Paperclip size={20} style={{ color: TOKENS.inkSoft }} />
                  <p className="text-[12.5px] font-semibold" style={{ color: TOKENS.inkSoft }}>
                    {contentType ? `No ${contentType.toUpperCase()} attachments` : "No attachments yet"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {attachments.map((file) => {
                    const Icon = fileIcon(file.fileType);
                    const tone = fileTone(file.fileType);
                    const confirming = attachmentDeleteConfirmId === file.id;
                    const isDeleting = deletingAttachmentId === file.id;
                    const name = file.fileName || file.name || "Untitled";
                    const url = file.fileUrl || file.url || "#";

                    return (
                      <div
                        key={file.id ?? name}
                        className="pe3d-card flex flex-col gap-3 rounded-2xl border p-4 hover:shadow-[0_16px_34px_-18px_rgba(15,23,42,0.4)]"
                        style={{ borderColor: TOKENS.line }}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                            style={{ background: `color-mix(in srgb, ${tone} 14%, white)`, color: tone }}
                          >
                            <Icon size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-bold" style={{ color: TOKENS.ink }} title={name}>
                              {name}
                            </p>
                            <p className="mt-0.5 truncate text-[11px]" style={{ color: TOKENS.inkSoft }}>
                              {formatBytes(file.fileSize)}
                              {file.fileType ? ` · ${file.fileType}` : ""}
                              {" · "}
                              {formatMemberSince(file.createdAt)}
                            </p>
                            {file.description ? (
                              <p className="mt-0.5 truncate text-[10.5px]" style={{ color: TOKENS.inkSoft }}>
                                {file.description}
                              </p>
                            ) : null}
                          </div>
                          {!confirming && (
                            <div className="flex shrink-0 items-center gap-1.5">
                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border transition hover:scale-105 active:scale-95"
                                style={{ borderColor: TOKENS.line, color: TOKENS.blue }}
                                title="Download"
                              >
                                <Download size={15} />
                              </a>
                              <button
                                type="button"
                                onClick={() => setAttachmentDeleteConfirmId(file.id)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border transition hover:scale-105 active:scale-95"
                                style={{ borderColor: TOKENS.line, color: "#EF4444" }}
                                title="Delete attachment"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          )}
                        </div>

                        {confirming && (
                          <div
                            className="flex items-center justify-between gap-2 rounded-xl border px-3 py-2"
                            style={{ borderColor: "#FCA5A5", background: "color-mix(in srgb, #EF4444 6%, white)" }}
                          >
                            <p className="text-[11px] font-semibold" style={{ color: "#B91C1C" }}>
                              Delete this file?
                            </p>
                            <div className="flex shrink-0 items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setAttachmentDeleteConfirmId(null)}
                                disabled={isDeleting}
                                className="rounded-lg px-2.5 py-1 text-[11px] font-bold"
                                style={{ color: TOKENS.inkSoft, border: `1px solid ${TOKENS.line}`, background: "white" }}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAttachment(file.id)}
                                disabled={isDeleting}
                                className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold text-white"
                                style={{ background: "#EF4444" }}
                              >
                                {isDeleting ? <Loader2 size={12} className="pe-refresh-spin" /> : <Trash2 size={12} />}
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          <Modal
            open={uploadModalOpen}
            onClose={() => {
              if (uploadingAttachment) return;
              setUploadModalOpen(false);
              setUploadFile(null);
              setUploadFileType("");
              setUploadDescription("");
            }}
            width={520}
          >
            <form onSubmit={handleUploadAttachment}>
              <div
                className="relative overflow-hidden px-6 pb-5 pt-6"
                style={{ background: `linear-gradient(140deg, ${TOKENS.indigo} 0%, ${TOKENS.blue} 50%, ${TOKENS.cyan} 140%)` }}
              >
                <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
                      <FileUp size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">Attachments</p>
                      <p className="text-[16px] font-extrabold text-white" style={{ fontFamily: FONT_DISPLAY }}>
                        Upload attachment
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (uploadingAttachment) return;
                      setUploadModalOpen(false);
                      setUploadFile(null);
                      setUploadFileType("");
                      setUploadDescription("");
                    }}
                    className="pe-focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="p-5">
                <div className="space-y-3.5">
                  <FieldShell label="File type" icon={FileText}>
                    <Dropdown
                      value={uploadFileType}
                      onChange={(v) => setUploadFileType(v)}
                      width="100%"
                      options={[
                        { value: "IMAGE", label: "Image" },
                        { value: "PDF", label: "PDF" },
                        { value: "EXCEL", label: "Excel" },
                        { value: "AUDIO", label: "Audio" },
                        { value: "OTHER", label: "Other" },
                      ]}
                    />
                  </FieldShell>

                  <FieldShell label="Description" icon={FileText}>
                    <input
                      className={glossyInputClass}
                      style={glossyInputStyle}
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      placeholder="Optional description"
                    />
                  </FieldShell>

                  <div>
                    <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wide" style={{ color: TOKENS.inkSoft }}>
                      File
                    </p>
                    <label
                      className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed py-8 text-center transition hover:bg-slate-50"
                      style={{ borderColor: TOKENS.line }}
                    >
                      <FileUp size={20} style={{ color: TOKENS.blue }} />
                      <span className="text-[12px] font-semibold" style={{ color: TOKENS.ink }}>
                        {uploadFile ? uploadFile.name : "Click to choose a file"}
                      </span>
                      <span className="text-[10.5px]" style={{ color: TOKENS.inkSoft }}>
                        PDF, Excel, audio, image, other
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t px-5 py-4" style={{ borderColor: TOKENS.line }}>
                <RippleButton
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    if (uploadingAttachment) return;
                    setUploadModalOpen(false);
                    setUploadFile(null);
                    setUploadFileType("");
                    setUploadDescription("");
                  }}
                  disabled={uploadingAttachment}
                >
                  Cancel
                </RippleButton>
                <RippleButton
                  type="submit"
                  disabled={uploadingAttachment || !uploadFile}
                  className="pe3d-shine"
                  style={{
                    background: `linear-gradient(135deg, ${TOKENS.indigo}, ${TOKENS.blue})`,
                    boxShadow: `0 12px 26px -10px color-mix(in srgb, ${TOKENS.blue} 60%, transparent)`,
                  }}
                >
                  {uploadingAttachment ? <Loader2 size={13} className="pe-refresh-spin" /> : <FileUp size={13} />}
                  {uploadingAttachment ? "Uploading…" : "Upload"}
                </RippleButton>
              </div>
            </form>
          </Modal>

          {section === "importExport" && (
            <div className="p-5">
              <div className="rounded-2xl border p-4" style={{ borderColor: TOKENS.line, background: `color-mix(in srgb, ${TOKENS.blue} 2.5%, white)` }}>
                <p className="mb-1 text-[13px] font-bold" style={{ color: TOKENS.ink }}>Export company data</p>
                <p className="mb-3.5 text-[11.5px]" style={{ color: TOKENS.inkSoft }}>Download your company records in the format you need.</p>
                <div className="flex flex-wrap gap-2.5">
                  {["json", "csv", "excel"].map((format) => (
                    <button
                      key={format}
                      onClick={() => handleExport(format)}
                      disabled={exporting === format}
                      className="pe3d-shine flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[12px] font-bold transition hover:-translate-y-0.5"
                      style={{ borderColor: TOKENS.line, color: TOKENS.blue, background: "white" }}
                    >
                      {exporting === format ? <Loader2 size={14} className="pe-refresh-spin" /> : <FileDown size={14} />}
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3.5 rounded-2xl border p-4" style={{ borderColor: TOKENS.line, background: `color-mix(in srgb, ${TOKENS.indigo} 2.5%, white)` }}>
                <div className="mb-1 flex items-center gap-1.5">
                  <p className="text-[13px] font-bold" style={{ color: TOKENS.ink }}>Import company data</p>

                  <div className="relative" ref={importGuideRef}>
                    <button
                      type="button"
                      onClick={() => setImportGuideOpen((v) => !v)}
                      className="flex h-5 w-5 items-center justify-center rounded-full transition hover:scale-110"
                      style={{ color: TOKENS.blue, background: `color-mix(in srgb, ${TOKENS.blue} 12%, white)` }}
                      title="Import guide"
                      aria-label="Import guide"
                    >
                      <Info size={12} />
                    </button>

                    {importGuideOpen && (
                      <div
                        className="absolute left-0 top-7 z-20 w-72 rounded-xl border bg-white p-3 text-[11px] leading-relaxed shadow-[0_16px_34px_-14px_rgba(15,23,42,0.35)]"
                        style={{ borderColor: TOKENS.line, color: TOKENS.inkSoft }}
                      >
                        <p className="mb-1 font-bold" style={{ color: TOKENS.ink }}>Before you import:</p>
                        <ul className="list-disc space-y-0.5 pl-4">
                          <li><span className="font-semibold" style={{ color: TOKENS.ink }}>.json</span> files should match the structure from "Export as JSON" above.</li>
                          <li><span className="font-semibold" style={{ color: TOKENS.ink }}>.csv</span> files should include a header row with matching column names.</li>
                          <li>Existing records with matching IDs will be updated; new rows will be created.</li>
                          <li>Max file size: 5MB.</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <p className="mb-3.5 text-[11.5px]" style={{ color: TOKENS.inkSoft }}>Upload a JSON or CSV file to bulk update your records.</p>

                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed py-8 text-center transition hover:bg-slate-50" style={{ borderColor: TOKENS.line }}>
                  <FileUp size={20} style={{ color: TOKENS.blue }} />
                  <span className="text-[12px] font-semibold" style={{ color: TOKENS.ink }}>{importFile ? importFile.name : "Click to choose a file"}</span>
                  <span className="text-[10.5px]" style={{ color: TOKENS.inkSoft }}>.json, .csv</span>
                  <input type="file" accept=".json,.csv" className="hidden" onChange={(e) => setImportFile(e.target.files?.[0] || null)} />
                </label>

                {importFile && (
                  <div className="mt-3.5 flex items-center justify-between gap-2">
                    <span
                      className="rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide"
                      style={{ background: `color-mix(in srgb, ${TOKENS.blue} 12%, white)`, color: TOKENS.blue }}
                    >
                      {getFileExt(importFile)} file
                    </span>
                    <div className="flex gap-2">
                      <RippleButton type="button" variant="secondary" onClick={() => setImportFile(null)} disabled={importing}>Clear</RippleButton>
                      <RippleButton type="button" onClick={handleImport} disabled={importing} style={{ background: `linear-gradient(135deg, ${TOKENS.indigo}, ${TOKENS.blue})` }}>
                        {importing ? <Loader2 size={13} className="pe-refresh-spin" /> : <FileUp size={13} />}
                        {importing ? "Importing…" : "Import file"}
                      </RippleButton>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {section === "reportScheduling" && (
            <div className="p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[13px] font-bold" style={{ color: TOKENS.ink }}>Scheduled reports</p>
                  <p className="mt-0.5 text-[11.5px]" style={{ color: TOKENS.inkSoft }}>
                    {schedules == null
                      ? "Loading…"
                      : schedules.length === 0
                        ? "No schedules yet"
                        : `${schedules.length} schedule${schedules.length === 1 ? "" : "s"}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => loadSchedules()}
                    disabled={scheduleLoading}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border transition hover:scale-105 active:scale-95 disabled:opacity-50"
                    style={{ borderColor: TOKENS.line, color: TOKENS.blue, background: `color-mix(in srgb, ${TOKENS.blue} 6%, white)` }}
                    title="Refresh"
                  >
                    <RefreshCcw size={15} className={scheduleLoading ? "pe-refresh-spin" : ""} />
                  </button>
                  <RippleButton
                    type="button"
                    onClick={openCreateSchedule}
                    className="pe3d-shine"
                    style={{ background: `linear-gradient(135deg, ${TOKENS.indigo}, ${TOKENS.blue})`, boxShadow: `0 10px 22px -10px color-mix(in srgb, ${TOKENS.blue} 55%, transparent)` }}
                  >
                    <Plus size={14} /> Create report
                  </RippleButton>
                </div>
              </div>

              {scheduleLoading && schedules == null ? (
                <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed py-14 text-[12.5px] font-semibold" style={{ borderColor: TOKENS.line, color: TOKENS.inkSoft }}>
                  <Loader2 size={16} className="pe-refresh-spin" /> Loading schedules…
                </div>
              ) : !schedules || schedules.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-12 text-center" style={{ borderColor: TOKENS.line }}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `color-mix(in srgb, ${TOKENS.blue} 12%, white)`, color: TOKENS.blue }}>
                    <Send size={20} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: TOKENS.ink }}>No report schedules</p>
                    <p className="mt-1 max-w-xs text-[12px]" style={{ color: TOKENS.inkSoft }}>
                      Create a schedule to email reports automatically on a daily, weekly, or monthly cadence.
                    </p>
                  </div>
                  <RippleButton type="button" onClick={openCreateSchedule} style={{ background: `linear-gradient(135deg, ${TOKENS.indigo}, ${TOKENS.blue})` }}>
                    <Plus size={14} /> Create your first schedule
                  </RippleButton>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {schedules.map((s) => {
                    const id = s.id ?? s.jobKey;
                    const summary = formatScheduleSummary({
                      frequency: s.frequency || "DAILY",
                      hourOfDay: s.hourOfDay ?? 0,
                      minuteOfHour: s.minuteOfHour ?? 0,
                      dayOfWeek: s.dayOfWeek ?? 1,
                      dayOfMonth: s.dayOfMonth ?? 1,
                    });
                    const enabled = s.enabled !== false;
                    const isToggling = togglingScheduleId === id;
                    const isDeleting = deletingScheduleId === id;
                    const confirmingDelete = deleteConfirmId === id;

                    return (
                      <div
                        key={id}
                        className="pe3d-card relative overflow-hidden rounded-2xl border p-4 transition-shadow hover:shadow-[0_18px_38px_-20px_rgba(15,23,42,0.4)]"
                        style={{ borderColor: TOKENS.line, background: `color-mix(in srgb, ${enabled ? TOKENS.cyan : TOKENS.inkSoft} 3%, white)` }}
                      >
                        <div className="absolute inset-y-0 left-0 w-[3px]" style={{ background: enabled ? TOKENS.cyan : TOKENS.inkSoft }} />

                        <div className="flex items-start justify-between gap-3 pl-1.5">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                                style={{
                                  background: enabled ? `color-mix(in srgb, ${TOKENS.cyan} 16%, white)` : "#F1F5F9",
                                  color: enabled ? "#0F7A5C" : TOKENS.inkSoft,
                                }}
                              >
                                <span className="h-1.5 w-1.5 rounded-full" style={{ background: enabled ? "#12B981" : TOKENS.inkSoft }} />
                                {enabled ? "Active" : "Paused"}
                              </span>
                              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ background: `color-mix(in srgb, ${TOKENS.blue} 12%, white)`, color: TOKENS.blue }}>
                                {s.frequency || "—"}
                              </span>
                            </div>

                            <p className="mt-2.5 truncate text-[13.5px] font-bold" style={{ color: TOKENS.ink }}>{summary}</p>
                            <p className="mt-1 flex items-center gap-1.5 truncate text-[11.5px]" style={{ color: TOKENS.inkSoft }}>
                              <Mail size={12} className="shrink-0" />
                              {s.recipientEmail || "—"}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px]" style={{ color: TOKENS.inkSoft }}>
                              <span className="inline-flex items-center gap-1"><Globe size={11} /> {s.timeZone || "—"}</span>
                              {s.cronExpression && (
                                <span className="font-mono tabular-nums opacity-80">{s.cronExpression}</span>
                              )}
                            </div>
                            {(s.createdAt || s.updatedAt) && (
                              <p className="mt-1.5 text-[10px]" style={{ color: TOKENS.inkSoft }}>
                                Updated {formatMemberSince(s.updatedAt || s.createdAt)}
                              </p>
                            )}
                          </div>

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `color-mix(in srgb, ${TOKENS.blue} 12%, white)`, color: TOKENS.blue }}>
                            <Clock size={18} />
                          </div>
                        </div>

                        {confirmingDelete ? (
                          <div
                            className="mt-3.5 flex items-center justify-between gap-2 rounded-xl border pl-1.5 pl-3 pr-2 py-2"
                            style={{ borderColor: "#FCA5A5", background: "color-mix(in srgb, #EF4444 6%, white)" }}
                          >
                            <p className="text-[11px] font-semibold" style={{ color: "#B91C1C" }}>Delete this schedule?</p>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                disabled={isDeleting}
                                className="rounded-lg px-2.5 py-1 text-[11px] font-bold transition"
                                style={{ color: TOKENS.inkSoft, background: "white", border: `1px solid ${TOKENS.line}` }}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSchedule(id)}
                                disabled={isDeleting}
                                className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold text-white transition"
                                style={{ background: "#EF4444" }}
                              >
                                {isDeleting ? <Loader2 size={12} className="pe-refresh-spin" /> : <Trash2 size={12} />}
                                Delete
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3.5 flex items-center justify-between gap-2 border-t pt-3" style={{ borderColor: TOKENS.line }}>
                            <button
                              type="button"
                              onClick={() => handleToggleEnabled(s)}
                              disabled={isToggling}
                              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-bold transition disabled:opacity-50"
                              style={{ color: enabled ? "#B45309" : "#0F7A5C" }}
                              title={enabled ? "Pause schedule" : "Resume schedule"}
                            >
                              {isToggling ? (
                                <Loader2 size={13} className="pe-refresh-spin" />
                              ) : enabled ? (
                                <PauseCircle size={13} />
                              ) : (
                                <PlayCircle size={13} />
                              )}
                              {enabled ? "Pause" : "Resume"}
                            </button>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openEditSchedule(s)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border transition hover:scale-105 active:scale-95"
                                style={{ borderColor: TOKENS.line, color: TOKENS.blue }}
                                title="Edit schedule"
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(id)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border transition hover:scale-105 active:scale-95"
                                style={{ borderColor: TOKENS.line, color: "#EF4444" }}
                                title="Delete schedule"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <Modal
                open={scheduleModalOpen}
                onClose={() => {
                  if (scheduleSaving) return;
                  setScheduleModalOpen(false);
                  setScheduleEditingId(null);
                }}
                width={720}
              >
                <form onSubmit={handleScheduleSave}>
                  <div
                    className="relative overflow-hidden px-6 pb-5 pt-6"
                    style={{ background: `linear-gradient(140deg, ${TOKENS.indigo} 0%, ${TOKENS.blue} 50%, ${TOKENS.cyan} 140%)` }}
                  >
                    <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-16 left-16 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
                          <Send size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
                            {scheduleEditingId ? "Edit schedule" : "New schedule"}
                          </p>
                          <p className="text-[16px] font-extrabold text-white" style={{ fontFamily: FONT_DISPLAY }}>
                            {scheduleEditingId ? "Update report schedule" : "Create report schedule"}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (scheduleSaving) return;
                          setScheduleModalOpen(false);
                          setScheduleEditingId(null);
                        }}
                        className="pe-focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white"
                        aria-label="Close"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[68vh] overflow-y-auto pe-scrollbar p-5">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px,1fr]">
                      <div className="rounded-2xl border p-4 text-center" style={{ borderColor: TOKENS.line, background: `linear-gradient(165deg, color-mix(in srgb, ${TOKENS.indigo} 6%, white), white)` }}>
                        <span
                          className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
                          style={{
                            background: scheduleForm.enabled ? `color-mix(in srgb, ${TOKENS.cyan} 16%, white)` : "#F1F5F9",
                            color: scheduleForm.enabled ? "#0F7A5C" : TOKENS.inkSoft,
                          }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: scheduleForm.enabled ? "#12B981" : TOKENS.inkSoft }} />
                          {scheduleForm.enabled ? "Active" : "Paused"}
                        </span>
                        <ScheduleClock hour={scheduleForm.hourOfDay} minute={scheduleForm.minuteOfHour} />
                        <p className="mt-2 text-[12px] font-bold" style={{ color: TOKENS.ink }}>{formatScheduleSummary(scheduleForm)}</p>
                        <p className="mt-0.5 truncate text-[10.5px]" style={{ color: TOKENS.inkSoft }}>{scheduleForm.timeZone}</p>
                      </div>

                      <div className="space-y-3.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-[12px] font-bold" style={{ color: TOKENS.ink }}>Schedule settings</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold" style={{ color: TOKENS.inkSoft }}>{scheduleForm.enabled ? "Enabled" : "Disabled"}</span>
                            <ScheduleToggle checked={scheduleForm.enabled} onChange={(v) => setScheduleForm((f) => ({ ...f, enabled: v }))} />
                          </div>
                        </div>

                        <div>
                          <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wide" style={{ color: TOKENS.inkSoft }}>Frequency</p>
                          <div className="flex w-fit flex-wrap items-center gap-1 rounded-xl border bg-[#F8F9FC] p-1" style={{ borderColor: TOKENS.line }}>
                            {FREQUENCY_OPTIONS.map((o) => {
                              const active = scheduleForm.frequency === o.value;
                              return (
                                <button
                                  key={o.value}
                                  type="button"
                                  onClick={() => setScheduleForm((f) => ({ ...f, frequency: o.value }))}
                                  className="rounded-lg px-3.5 py-1.5 text-[11.5px] font-bold transition"
                                  style={{ color: active ? "#fff" : TOKENS.inkSoft, background: active ? `linear-gradient(135deg, ${TOKENS.blue}, ${TOKENS.cyan})` : "transparent" }}
                                >
                                  {o.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <FieldShell label="Send time" icon={Clock}>
                            <input
                              type="time"
                              required
                              className={glossyInputClass}
                              style={glossyInputStyle}
                              value={`${pad2(scheduleForm.hourOfDay)}:${pad2(scheduleForm.minuteOfHour)}`}
                              onChange={(e) => {
                                const [h, m] = e.target.value.split(":").map(Number);
                                setScheduleForm((f) => ({ ...f, hourOfDay: h, minuteOfHour: m }));
                              }}
                            />
                          </FieldShell>
                          <FieldShell label="Time zone" icon={Globe}>
                            <select
                              className={glossyInputClass}
                              style={glossyInputStyle}
                              value={scheduleForm.timeZone}
                              onChange={(e) => setScheduleForm((f) => ({ ...f, timeZone: e.target.value }))}
                            >
                              {TIMEZONE_OPTIONS.map((tz) => (
                                <option key={tz} value={tz}>{tz}</option>
                              ))}
                            </select>
                          </FieldShell>
                        </div>

                        {scheduleForm.frequency === "WEEKLY" && (
                          <div>
                            <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wide" style={{ color: TOKENS.inkSoft }}>Day of week</p>
                            <div className="flex flex-wrap gap-1.5">
                              {DAY_OF_WEEK_OPTIONS.map((d) => {
                                const active = scheduleForm.dayOfWeek === d.value;
                                return (
                                  <button
                                    key={d.value}
                                    type="button"
                                    onClick={() => setScheduleForm((f) => ({ ...f, dayOfWeek: d.value }))}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl text-[11px] font-bold transition"
                                    style={{
                                      border: `1px solid ${active ? "transparent" : TOKENS.line}`,
                                      color: active ? "#fff" : TOKENS.ink,
                                      background: active ? `linear-gradient(135deg, ${TOKENS.indigo}, ${TOKENS.blue})` : "white",
                                    }}
                                  >
                                    {d.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {scheduleForm.frequency === "MONTHLY" && (
                          <FieldShell label="Day of month" icon={CalendarDays}>
                            <input
                              type="number"
                              min={1}
                              max={31}
                              required
                              className={glossyInputClass}
                              style={glossyInputStyle}
                              value={scheduleForm.dayOfMonth}
                              onChange={(e) => setScheduleForm((f) => ({ ...f, dayOfMonth: Number(e.target.value) }))}
                            />
                          </FieldShell>
                        )}

                        <FieldShell label="Recipient email" icon={Mail}>
                          <input
                            type="email"
                            required
                            placeholder="reports@yourcompany.com"
                            className={glossyInputClass}
                            style={glossyInputStyle}
                            value={scheduleForm.recipientEmail}
                            onChange={(e) => setScheduleForm((f) => ({ ...f, recipientEmail: e.target.value }))}
                          />
                        </FieldShell>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t px-5 py-4" style={{ borderColor: TOKENS.line }}>
                    <RippleButton
                      type="button"
                      variant="secondary"
                      onClick={() => { setScheduleModalOpen(false); setScheduleEditingId(null); }}
                      disabled={scheduleSaving}
                    >
                      Cancel
                    </RippleButton>
                    <RippleButton
                      type="submit"
                      disabled={scheduleSaving}
                      className="pe3d-shine"
                      style={{ background: `linear-gradient(135deg, ${TOKENS.indigo}, ${TOKENS.blue})`, boxShadow: `0 12px 26px -10px color-mix(in srgb, ${TOKENS.blue} 60%, transparent)` }}
                    >
                      {scheduleSaving ? <Loader2 size={13} className="pe-refresh-spin" /> : <Check size={13} />}
                      {scheduleSaving ? "Saving…" : scheduleEditingId ? "Update schedule" : "Save schedule"}
                    </RippleButton>
                  </div>
                </form>
              </Modal>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { ProfileTab, CompanyTab };