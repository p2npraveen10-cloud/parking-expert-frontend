import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Bell,
  ChevronDown,
  LogOut,
  Calendar,
  AlertTriangle,
  FileText,
  X,
} from "lucide-react";

import logo from "../assets/logo.png";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const notifications = [
  {
    id: 1,
    icon: Calendar,
    title: "New reservation confirmed",
    desc: "Level 2, Slot B14 booked for 6:00 PM",
    time: "2m ago",
    accent: "#2563EB",
    soft: "rgba(37,99,235,0.10)",
  },
  {
    id: 2,
    icon: AlertTriangle,
    title: "Occupancy threshold reached",
    desc: "Level 1 is at 92% capacity",
    time: "18m ago",
    accent: "#0EA5A0",
    soft: "rgba(14,165,160,0.10)",
  },
  {
    id: 3,
    icon: FileText,
    title: "Monthly report ready",
    desc: "June occupancy report has been generated",
    time: "1h ago",
    accent: "#8B5CF6",
    soft: "rgba(139,92,246,0.10)",
  },
];

const Header = ({ onLogout }) => {
  const readUser = () => {
    try {
      const data = localStorage.getItem("user");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(readUser);

  // Keep header in sync when profile is updated elsewhere
  useEffect(() => {
    const onProfileUpdated = () => setUser(readUser());
    const onStorage = (e) => {
      if (e.key === "user") setUser(readUser());
    };
    window.addEventListener("user-profile-updated", onProfileUpdated);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("user-profile-updated", onProfileUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const profileImage = user?.profile;

  const fullName =
    user?.firstName || user?.lastName
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
      : "Guest User";

  const initials = (
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}` || "GU"
  ).toUpperCase();

  const roleLabel = user?.role || "Admin";

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [bellHover, setBellHover] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [profilePreviewOpen, setProfilePreviewOpen] = useState(false);
  const rootRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setImgError(false);
  }, [profileImage]);

  // Close profile preview on Escape
  useEffect(() => {
    if (!profilePreviewOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setProfilePreviewOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [profilePreviewOpen]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await axios.post(
        `${API_BASE_URL}/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
      console.log("Logout successful");
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setMenuOpen(false);
      setLoggingOut(false);
      if (onLogout) {
        onLogout();
      } else {
        navigate("/login", { replace: true });
      }
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setMenuOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showImage = Boolean(profileImage) && !imgError;

  const openProfilePreview = (e) => {
    e.stopPropagation(); // don't toggle the dropdown
    if (showImage) {
      setProfilePreviewOpen(true);
      setMenuOpen(false);
      setNotifOpen(false);
    }
  };

  return (
    <>
      <header
        ref={rootRef}
        className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/90 backdrop-blur-xl"
        style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
      >
        <div className="h-[68px] flex items-center gap-4 px-4 md:px-6">
          {/* Left: brand */}
        <div className="flex items-center gap-3 shrink-0">
  <motion.div
    whileHover={{ scale: 1.06 }}
    transition={{ type: "spring", stiffness: 300, damping: 12 }}
    className="w-10 h-10 rounded-xl overflow-hidden shrink-0"
  >
    <img
      src={logo}
      alt="Parking Expert"
      className="w-full h-full object-contain"
    />
  </motion.div>

  <div className="hidden sm:block leading-tight">
    <h1 className="text-base font-bold text-slate-800 tracking-tight">
      Parking Expert
    </h1>
    <p className="text-[11px] text-slate-400">Facility Admin</p>
  </div>
</div>

          <div className="flex-1" />

          {/* Right: notifications + profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Notifications */}
            <div className="relative">
              <motion.button
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setMenuOpen(false);
                }}
                onMouseEnter={() => setBellHover(true)}
                onMouseLeave={() => setBellHover(false)}
                whileTap={{ scale: 0.94 }}
                className="relative text-slate-500 hover:text-blue-600 transition-colors w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200/70 hover:border-blue-200"
              >
                <AnimatePresence>
                  {bellHover && (
                    <motion.span
                      initial={{ scale: 0.6, opacity: 0.5 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full bg-blue-400/40"
                    />
                  )}
                </AnimatePresence>

                <motion.span
                  animate={
                    bellHover
                      ? { rotate: [0, -14, 12, -8, 4, 0] }
                      : { rotate: 0 }
                  }
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="flex"
                >
                  <Bell size={18} strokeWidth={2.2} />
                </motion.span>

                <span className="absolute top-1 right-1 bg-amber-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">
                  {notifications.length}
                </span>
              </motion.button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">
                        Notifications
                      </p>
                      <span className="text-[11px] font-medium text-blue-600">
                        {notifications.length} new
                      </span>
                    </div>

                    <div className="max-h-80 overflow-y-auto py-1">
                      {notifications.map((n) => {
                        const Icon = n.icon;
                        return (
                          <div
                            key={n.id}
                            className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                              style={{
                                background: n.soft,
                                color: n.accent,
                              }}
                            >
                              <Icon size={15} strokeWidth={2.2} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">
                                {n.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                {n.desc}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-1">
                                {n.time}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button className="w-full text-center py-2.5 text-xs font-semibold text-blue-600 hover:bg-blue-50/60 border-t border-slate-100 transition-colors">
                      View all notifications
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile pill — fixed alignment */}
            <div className="relative">
              <motion.button
                onClick={() => {
                  setMenuOpen((v) => !v);
                  setNotifOpen(false);
                }}
                whileHover={{ y: -1 }}
                className="flex items-center gap-2 h-10 pl-1 pr-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-blue-200 hover:bg-slate-100/80 transition-colors"
              >
                {/* Avatar — click opens Instagram-style preview */}
                {/* Avatar — perfect circle, no blue background */}
                <div
                  className="relative shrink-0 cursor-pointer"
                  onClick={openProfilePreview}
                  title={showImage ? "View profile photo" : undefined}
                  style={{ width: 34, height: 34 }}
                >
                  {showImage ? (
                    <img
                      src={profileImage}
                      alt={fullName}
                      onError={() => setImgError(true)}
                      className="block rounded-full object-cover object-center ring-2 ring-slate-200"
                      style={{
                        width: 34,
                        height: 34,
                        minWidth: 34,
                        minHeight: 34,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center rounded-full ring-2 ring-slate-200 text-[12px] font-semibold text-slate-600"
                      style={{
                        width: 34,
                        height: 34,
                        minWidth: 34,
                        minHeight: 34,
                        borderRadius: "50%",
                        backgroundColor: "#E2E8F0",
                      }}
                    >
                      {initials}
                    </div>
                  )}

                  {/* Online indicator */}
                  <span
                    className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
                    style={{ pointerEvents: "none" }}
                  />
                </div>

                {/* Name + role — vertically centered with avatar */}
                <div className="hidden md:flex flex-col justify-center leading-none text-left min-w-0">
                  <p className="font-semibold text-slate-800 text-[13px] truncate max-w-[120px]">
                    {fullName}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{roleLabel}</p>
                </div>

                <motion.span
                  animate={{ rotate: menuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <ChevronDown
                    size={15}
                    className="text-slate-400 shrink-0"
                  />
                </motion.span>
              </motion.button>

              {/* Dropdown menu */}
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden py-1.5 z-50"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/manage?tab=profile");
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      View my profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/settings");
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Account Settings
                    </button>
                    <div className="h-px bg-slate-100 my-1" />
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut size={15} />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Instagram-style profile picture modal */}
      <AnimatePresence>
        {profilePreviewOpen && showImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setProfilePreviewOpen(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setProfilePreviewOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X size={22} strokeWidth={2} />
            </button>

            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="flex flex-col items-center gap-4 px-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Large circular photo */}
              <div className="relative">
                <img
                  src={profileImage}
                  alt={fullName}
                  className="w-64 h-64 sm:w-72 sm:h-72 rounded-full object-cover object-center ring-4 ring-white/20 shadow-2xl"
                  onError={() => {
                    setImgError(true);
                    setProfilePreviewOpen(false);
                  }}
                />
              </div>

              {/* Name + role under the photo */}
              <div className="text-center">
                <p className="text-white font-semibold text-lg tracking-tight">
                  {fullName}
                </p>
                <p className="text-white/60 text-sm mt-0.5">{roleLabel}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;