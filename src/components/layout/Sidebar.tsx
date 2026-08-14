import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, LogOut, ChevronDown, CalendarDays, BedDouble, Image as ImageIcon, Settings, User
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import yogaMandirLogo from "../../assets/yogaMandirImage.png";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: <LayoutDashboard size={17} />,
    end: true,
  },
  {
    label: "Reservations",
    icon: <CalendarDays size={17} />,
    subItems: [
      { label: "All Reservations", to: "/reservations" },
      { label: "New Booking", to: "/reservations/new" },
    ],
  },
  {
    label: "Rooms",
    to: "/rooms",
    icon: <BedDouble size={17} />,
  },
  {
    label: "Gallery",
    to: "/gallery",
    icon: <ImageIcon size={17} />,
  },
  {
    label: "Profile",
    to: "/profile",
    icon: <User size={17} />,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: <Settings size={17} />,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isExpanded = isMobile ? true : isOpen;

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isChildActive = (item: any) => {
    if (!item.subItems) return false;
    return item.subItems.some((sub: any) =>
      sub.subItems
        ? sub.subItems.some((nested: any) => location.pathname === nested.to)
        : location.pathname === sub.to
    );
  };

  return (
    <aside
      className={[
        "flex flex-col flex-shrink-0 z-[60] bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-divider)]",
        "transition-all duration-300 ease-in-out",
        "fixed inset-y-0 left-0 lg:relative",
        isOpen
          ? "translate-x-0 w-[280px] lg:w-[260px] shadow-2xl lg:shadow-none"
          : "-translate-x-full lg:translate-x-0 w-[280px] lg:w-[68px]",
      ].join(" ")}
    >
      <div
        className="absolute inset-0 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
        style={{ background: "var(--sidebar-bg)", borderRight: "var(--sidebar-border-right)" }}
      >
        {/* Logo */}
        <div
          className={["flex items-center h-[60px] px-4 flex-shrink-0", !isExpanded ? "justify-center" : "justify-start"].join(" ")}
          style={{ borderBottom: "1px solid var(--sidebar-divider)" }}
        >
          <Link to="/" className="flex items-center justify-center w-full h-full cursor-pointer hover:opacity-80 transition-opacity">
            {!isExpanded ? (
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                BY
              </div>
            ) : (
              <div className="animate-fade-in overflow-hidden flex items-center gap-2 h-full w-full py-2">
                 <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  BY
                 </div>
                 <div className="flex flex-col">
                  <span className="font-bold text-[14px] text-[var(--sidebar-brand-text)] tracking-tight leading-tight">
                    Banaras Yog
                  </span>
                  <span className="text-[9px] font-semibold text-[var(--sidebar-text-muted)] uppercase tracking-wider">
                    Mandir PMS
                  </span>
                </div>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1 custom-scrollbar">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="w-full">
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={[
                      "sidebar-item-btn w-full",
                      !isExpanded && "justify-center",
                      (openMenus[item.label] || isChildActive(item)) && "active",
                    ].filter(Boolean).join(" ")}
                  >
                    <span className="sidebar-icon flex-shrink-0">{item.icon}</span>
                    {isExpanded && (
                      <>
                        <span className="truncate flex-1 text-left animate-fade-in">{item.label}</span>
                        <ChevronDown
                          size={14}
                          className={`flex-shrink-0 transition-transform duration-200 ${openMenus[item.label] ? "rotate-180" : ""}`}
                        />
                      </>
                    )}
                  </button>

                  <div
                    className={["sidebar-submenu-container", openMenus[item.label] && isExpanded && "open"].filter(Boolean).join(" ")}
                  >
                    <div className="sidebar-submenu-content">
                      {item.subItems.map((sub, idx) => (
                         <NavLink
                           key={idx}
                           to={sub.to}
                           className={({ isActive }) => ["sidebar-sub-item", isActive && "active"].filter(Boolean).join(" ")}
                         >
                           <span className="truncate block w-full">{sub.label}</span>
                         </NavLink>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpenMenus({})}
                  title={!isExpanded ? item.label : undefined}
                  className={({ isActive }) =>
                    ["sidebar-item-btn w-full", !isExpanded && "justify-center", isActive ? "sidebar-link-active" : "sidebar-link-inactive"].join(" ")
                  }
                  style={({ isActive }) =>
                    isActive
                      ? { background: "var(--sidebar-active-bg)", color: "var(--sidebar-text-active)", border: "1px solid var(--sidebar-active-border)" }
                      : { color: "var(--sidebar-text)", border: "1px solid transparent" }
                  }
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.classList.contains("sidebar-link-active")) {
                      e.currentTarget.style.background = "var(--sidebar-hover-bg)";
                      e.currentTarget.style.color = "var(--sidebar-hover-text)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.classList.contains("sidebar-link-active")) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--sidebar-text)";
                    }
                  }}
                >
                  {({ isActive }) => (
                    <>
                      <span className="sidebar-icon flex-shrink-0">{item.icon}</span>
                      {isExpanded && <span className="animate-fade-in truncate flex-1">{item.label}</span>}
                      {isActive && isExpanded && (
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: "var(--sidebar-toggle-bg)", boxShadow: "0 0 4px var(--sidebar-toggle-bg)" }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* User card + Logout */}
        <div className="p-3 flex-shrink-0" style={{ borderTop: "1px solid var(--sidebar-divider)" }}>
          {isExpanded && (
            <div
              className="sidebar-user-card flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 animate-fade-in"
              style={{ background: "var(--sidebar-user-bg)", border: "1px solid var(--sidebar-user-border)" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--sidebar-user-avatar-bg)" }}
              >
                <span className="text-xs font-bold text-white">
                  {(user?.name ?? "A").charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="overflow-hidden min-w-0 flex-1">
                <p className="text-[13px] font-bold truncate" style={{ color: "var(--sidebar-user-text)" }}>
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] uppercase font-bold tracking-widest truncate mt-0.5" style={{ color: "var(--sidebar-user-sub)" }}>
                  SUPER ADMIN
                </p>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            title="Logout"
            className={[
              "sidebar-logout-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold tracking-wide outline-none",
              "transition-all duration-150 cursor-pointer mt-1",
              !isExpanded && "justify-center",
            ].join(" ")}
          >
            <LogOut size={16} className="flex-shrink-0 animate-[pulse_2s_infinite]" />
            {isExpanded && <span className="animate-fade-in">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
