import { useState, useRef, useCallback, useLayoutEffect, useEffect } from "react";
import { User, Building2, Car, Users as UsersIcon } from "lucide-react";

import { GlobalStyle, TOKENS, FONT_DISPLAY, FONT_BODY, ComingSoon } from "./manageShared";
import { ProfileTab, CompanyTab } from "./ProfileAndCompany";
import { VehiclesTab } from "./Vehicles";

const UsersTab = () => (
  <ComingSoon
    icon={UsersIcon}
    title="Team & access"
    description="Invite teammates, assign roles like Facility Admin or Engineer, and manage permissions from a single screen."
    eta="est. next release"
  />
);
const readStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
};

const TABS = [
  { id: "profile", label: "Profile", icon: User, component: ProfileTab },
  { id: "company", label: "Company", icon: Building2, component: CompanyTab },
  { id: "vehicles", label: "Vehicles", icon: Car, component: VehiclesTab },
  { id: "users", label: "Users", icon: UsersIcon, component: UsersTab },
];

export default function Manage() {
  const [user, setUser] = useState(readStoredUser);

  const [tab, setTab] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("tab");
      if (t && ["profile", "company", "vehicles", "users"].includes(t)) return t;
    } catch (_) { }
    return "vehicles";
  });
  useEffect(() => {
    const syncUser = () => setUser(readStoredUser());

    window.addEventListener("user-profile-updated", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("user-profile-updated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const tabRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const measureIndicator = useCallback(() => {
    const el = tabRefs.current[tab];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [tab]);

  useLayoutEffect(() => {
    measureIndicator();
  }, [measureIndicator]);

  useEffect(() => {
    window.addEventListener("resize", measureIndicator);
    return () => window.removeEventListener("resize", measureIndicator);
  }, [measureIndicator]);

  const ActiveComponent = TABS.find((t) => t.id === tab)?.component || VehiclesTab;

  return (
    <div className="min-h-screen" style={{ background: TOKENS.bg, fontFamily: FONT_BODY }}>
      <GlobalStyle />

      <div className="pe-no-print border-b bg-white" style={{ borderColor: TOKENS.line }}>
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-slate-200">
  <img
    src={user.companyLogo}
    alt={user.companyName}
    className="h-full w-full object-cover"
  />
</div> */}

              <div className="group flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:shadow-md hover:ring-blue-200">
                <img
                  src={user.companyLogo}
                  alt={user.companyName}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>

              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.16em]" style={{ color: TOKENS.blue }}>
                  ParkEase Console
                </p>
                <h1
                  className="text-[20px] font-extrabold leading-tight tracking-tight"
                  style={{ fontFamily: FONT_DISPLAY, color: TOKENS.ink }}
                >
                  Manage
                </h1>
              </div>
            </div>
            <div
              className="flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-semibold"
              style={{ borderColor: TOKENS.line, color: TOKENS.inkSoft }}
            >
              <span className="pe-live-dot h-1.5 w-1.5 rounded-full" style={{ background: TOKENS.success }} />
              Live vehicle feed
            </div>
          </div>

          <div
            className="relative mt-5 flex w-fit items-center gap-1 rounded-2xl border bg-[#F8F9FC] p-1.5"
            style={{ borderColor: TOKENS.line }}
          >
            <div
              className="pe-tab-indicator absolute top-1.5 bottom-1.5 rounded-xl"
              style={{
                left: indicator.left,
                width: indicator.width,
                background: `linear-gradient(135deg, ${TOKENS.blue}, ${TOKENS.cyan})`,
                boxShadow: "0 8px 18px -8px rgba(37,84,235,0.55)",
              }}
            />
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  ref={(el) => (tabRefs.current[t.id] = el)}
                  onClick={() => setTab(t.id)}
                  className={`pe-tab-btn relative z-10 flex items-center gap-1.5 rounded-xl px-4 py-2 text-[12.5px] font-bold ${active ? "text-white" : "text-slate-500 hover:text-slate-700"
                    }`}
                  style={{ fontFamily: FONT_BODY }}
                >
                  <Icon size={13} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-6">
        <div key={tab} className="pe-panel-transition">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}