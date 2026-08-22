import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  LayoutDashboard,
  CarFront,
  MapPinned,
  BarChart3,
  Settings,
} from "lucide-react";


const menus = [
  {
    name: "Dashboard",
    path: "/dashboard",
    Icon: LayoutDashboard,
  },
  {
    name: "Parking",
    path: "/parking",
    Icon: CarFront,
  },
  {
    name: "Manage",
    path: "/manage",
    Icon: MapPinned,
  },
  {
    name: "Reports",
    path: "/reports",
    Icon: BarChart3,
  },
  {
    name: "Settings",
    path: "/settings",
    Icon: Settings,
  },
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      animate={{ width: expanded ? 252 : 76 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      className="relative h-screen sticky top-0 overflow-hidden z-30 flex flex-col"
      style={{ background: "#0B1220", borderRight: "1px solid #1E293B" }}
    >
      {/* Top bar — chevron only, centered, like the original */}
      <div
        className="h-16 shrink-0 flex items-center justify-center"
        style={{ borderBottom: "1px solid #1E293B" }}
      >
        <motion.span
          animate={{ rotate: expanded ? 0 : 180 }}
          transition={{ duration: 0.2 }}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "#16223B", border: "1px solid #1E293B", color: "#0A6BFF" }}
        >
          <ChevronLeft size={16} strokeWidth={2.4} />
        </motion.span>
      </div>

      {/* Navigation */}
      <nav className="mt-3 px-2.5 flex flex-col gap-1">
        {menus.map((item) => {
          const { Icon } = item;
          return (
            <NavLink key={item.name} to={item.path} end={item.path === "/"} className="block group">
              {({ isActive }) => (
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] cursor-pointer transition-all duration-150"
                  style={{
                    background: isActive ? "rgba(10,107,255,0.16)" : "transparent",
                    boxShadow: isActive ? "0 0 0 1px rgba(10,107,255,0.35)" : "none",
                  }}
                >
                  {/* Single hover source drives the icon box + label together */}
                  <div
                    className={`relative w-9 h-9 shrink-0 rounded-[9px] flex items-center justify-center transition-all duration-150 ${
                      isActive
                        ? ""
                        : "text-slate-400 group-hover:text-white group-hover:bg-[#0A6BFF] group-hover:shadow-[0_0_14px_rgba(10,107,255,0.55)]"
                    }`}
                    style={
                      isActive
                        ? { background: "#0A6BFF", color: "#FFFFFF", boxShadow: "0 0 16px rgba(10,107,255,0.6)" }
                        : undefined
                    }
                  >
                    <Icon size={18} strokeWidth={2.2} animateOnHover />

                  </div>

                  {/* Label */}
                  <AnimatePresence>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.18 }}
                        className={`text-[13.5px] font-medium whitespace-nowrap tracking-wide ${
                          isActive ? "" : "text-slate-200 group-hover:text-white"
                        }`}
                        style={isActive ? { color: "#7FB0FF" } : undefined}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;