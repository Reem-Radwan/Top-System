import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./TopHeader.css";

export default function TopHeader({
  userName = "Reem Slama",
  onLogout,
}) {
  const navigate = useNavigate(); // programmatic navigation [web:638]
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // which dropdown open (mobile)
  const [openUser, setOpenUser] = useState(false);

  const menus = useMemo(
    () => [
      { label: "Sales", items: [{ label: "Leads", to: "/sales/leads" }, { label: "Cataloge", to: "/cataloge" }] },
      { label: "Approvals", items: [{ label: "Pending", to: "/approvals/pending" }, { label: "Approved", to: "/approvals/approved" }] },
      { label: "Projects", items: [{ label: "All Projects", to: "/projects" }, { label: "Create Project", to: "/create-project" }] },
      { label: "Inventory", items: [{ label: "Units", to: "/inventory/units" }, { label: "Availability", to: "/inventory/availability" }] },
      { label: "Reports", items: [{ label: "Summary", to: "/reports/summary" }, { label: "Detailed", to: "/reports/detailed" }] },
      { label: "Market Research", items: [{ label: "Dashboard", to: "/market-research" }] },
      { label: "Pricing", items: [{ label: "Price List", to: "/pricing" }] },
      { label: "Users & Companies", items: [{ label: "Manage Users", to: "/" }, { label: "Manage Companies", to: "/manage-companies" }] },
    ],
    []
  );

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) {
        setMobileOpen(false);
        setOpenMenu(null);
        setOpenUser(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close all on ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      setMobileOpen(false);
      setOpenMenu(null);
      setOpenUser(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(to) {
    navigate(to); // route change [web:638]
    setMobileOpen(false);
    setOpenMenu(null);
    setOpenUser(false);
  }

  function handleLogout() {
    if (onLogout) onLogout();
    else navigate("/login"); // fallback [web:638]
  }

  return (
    <header className="topheader">
      <div className="topheader-inner">
        {/* Left side */}
        <div className="topheader-left">
          <button
            type="button"
            className="topheader-burger"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            ☰
          </button>

          <div className={mobileOpen ? "topheader-menus open" : "topheader-menus"}>
            {menus.map((m) => (
              <div className="topheader-dd" key={m.label}>
                <button
                  className="topheader-dd-btn"
                  type="button"
                  onClick={() => {
                    // On mobile: toggle dropdown. On desktop: hover handles it.
                    if (window.innerWidth <= 900) setOpenMenu((prev) => (prev === m.label ? null : m.label));
                  }}
                >
                  {m.label} <span className="topheader-caret">▼</span>
                </button>

                <div
                  className={
                    window.innerWidth <= 900
                      ? openMenu === m.label
                        ? "topheader-dd-menu mobile-open"
                        : "topheader-dd-menu"
                      : "topheader-dd-menu"
                  }
                >
                  {m.items.map((it) => (
                    <NavLink
                      key={it.to}
                      to={it.to}
                      className={({ isActive }) => (isActive ? "topheader-dd-item active" : "topheader-dd-item")}
                      onClick={(e) => {
                        // ensure mobile closes after click
                        e.preventDefault();
                        go(it.to);
                      }}
                    >
                      {it.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="topheader-right">
          <div className="topheader-dd">
            <button
              className="topheader-dd-btn"
              type="button"
              onClick={() => setOpenUser((v) => !v)}
              aria-expanded={openUser}
            >
              {userName} <span className="topheader-caret">▼</span>
            </button>

            <div className={openUser ? "topheader-dd-menu right mobile-open" : "topheader-dd-menu right"}>
              <button className="topheader-dd-item" type="button" onClick={() => go("/profile")}>
                Profile
              </button>
              <button className="topheader-dd-item" type="button" onClick={() => go("/settings")}>
                Settings
              </button>
            </div>
          </div>

          <button className="topheader-logout" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

