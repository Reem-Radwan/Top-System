import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./TopHeader.css";

// Real Estate Icon Component - Simpler version
const RealEstateIcon = () => (
  <svg 
    className="real-estate-icon" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 21V10L12 3L21 10V21H14V14H10V21H3Z" fill="currentColor"/>
  </svg>
);

export default function TopHeader({
  userName = "Reem Radwan",
  onLogout,
}) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [openUser, setOpenUser] = useState(false);

  // Get user initials for avatar
  const userInitials = useMemo(() => {
    return userName
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [userName]);

  const menus = useMemo(
    () => [
      { label: "Sales", items: [{ label: "TOP", to: "/" },{ label: "MasterPlans", to: "/masterlans" }, { label: "Cataloge", to: "/cataloge" }, { label: "Approvals", to: "/approvals" }] },
      { label: "Approvals", items: [{ label: "Approvals", to: "/approvals" }, { label: "Approvals History", to: "/approvals-history" },] },
      { label: "Projects", items: [{ label: "Manage Projects", to: "/manage-projects" }, { label: "MasterPlan Settings", to: "/masterPlan-settings" },
        { label: "Payments Input", to: "/payments-input" } , { label: "Special Offer Input", to: "/special-offer-input" }, { label: "Web Configurations", to: "/web-configurations" }
      ] },
      { label: "Inventory", items: [{ label: "Manage Inventory", to: "/manage-inventory" }, { label: "Unit Brochure", to: "/unit-brochure" }] },
      { label: "Reports", items: [{ label: "Inventory Report", to: "/inventory-report" }, { label: "Sales Performance Analysis", to: "/sales-analysis" } ,
         { label: "Sales Team Report", to: "/sales-team-report" }] },
      { label: "Market Research", items: [{ label: "Master Data", to: "/master-data" }, { label: "Units Data", to: "/units-data" } ,{ label: "Market Explorer", to: "/units-analysis" }] },
      { label: "Pricing", items: [{ label: "Pricing Model", to: "/pricing-model" }] },
      { label: "Users & Companies", items: [{ label: "Manage Users", to: "/manage-users" },{ label: "Manage Companies", to: "/manage-companies" }, { label: "Attendance Sheet", to: "/attendance-sheet" } ,{ label: "Goole Sheets", to: "/google-sheets" }
      ] },
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
    navigate(to);
    setMobileOpen(false);
    setOpenMenu(null);
    setOpenUser(false);
  }

  async function handleLogout() {
  const res = await Swal.fire({
    title: "Logout?",
    text: "Are you sure you want to logout?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Logout",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#c45a18",
    cancelButtonColor: "#7a7a7a",
  });

  if (!res.isConfirmed) return;

  if (onLogout) onLogout();
  else navigate("/login");
}


  return (
    <header className="topheader">
      <div className="topheader-inner">
        {/* Left side with Logo */}
        <div className="topheader-left">
          {/* Logo with Real Estate Icon */}
          <div className="topheader-logo">
            <div className="logo-icon">
              <RealEstateIcon />
            </div>
            <div className="logo-text">Prometheus</div>
          </div>

          {/* Mobile burger menu */}
          <button
            type="button"
            className="topheader-burger"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>

          {/* Desktop Menus */}
          <div className={mobileOpen ? "topheader-menus open" : "topheader-menus"}>
            {menus.map((m) => (
              <div 
                className="topheader-dd" 
                key={m.label}
                onMouseEnter={() => window.innerWidth > 900 && setOpenMenu(m.label)}
                onMouseLeave={() => window.innerWidth > 900 && setOpenMenu(null)}
              >
                <button
                  className="topheader-dd-btn"
                  type="button"
                  onClick={() => {
                    if (window.innerWidth <= 900) {
                      setOpenMenu((prev) => (prev === m.label ? null : m.label));
                    }
                  }}
                >
                  {m.label} <span className="topheader-caret">▼</span>
                </button>

                <div
                  className={
                    window.innerWidth <= 900 && openMenu === m.label
                      ? "topheader-dd-menu mobile-open"
                      : "topheader-dd-menu"
                  }
                  onMouseEnter={() => window.innerWidth > 900 && setOpenMenu(m.label)}
                  onMouseLeave={() => window.innerWidth > 900 && setOpenMenu(null)}
                >
                  {m.items.map((it) => (
                    <NavLink
                      key={it.to}
                      to={it.to}
                      className={({ isActive }) => (isActive ? "topheader-dd-item active" : "topheader-dd-item")}
                      onClick={(e) => {
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

        {/* Right side with User Info and Logout */}
        <div className="topheader-right">
          {/* User Section - Compact */}
          <div className="topheader-dd">
            <div 
              className="user-section"
              onClick={() => setOpenUser((v) => !v)}
              onMouseEnter={() => window.innerWidth > 900 && setOpenUser(true)}
              onMouseLeave={() => window.innerWidth > 900 && setOpenUser(false)}
            >
              <div className="user-avatar">{userInitials}</div>
              <div className="user-name">{userName}</div>
              <span className="user-arrow">▼</span>
            </div>

            <div 
              className={openUser ? "topheader-dd-menu right mobile-open" : "topheader-dd-menu right"}
              onMouseEnter={() => window.innerWidth > 900 && setOpenUser(true)}
              onMouseLeave={() => window.innerWidth > 900 && setOpenUser(false)}
            >
              <button className="topheader-dd-item" type="button" onClick={() => go("/change-password")}>
                Change Password
              </button>
            </div>
          </div>

          {/* Logout Button - Now clearly visible */}
          <button className="topheader-logout" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
