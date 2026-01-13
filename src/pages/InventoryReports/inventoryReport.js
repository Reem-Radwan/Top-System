import React, { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./inventoryReport.css";

function getDefaultUser() {
  return {
    full_name: "Demo User",
    email: "demo@example.com",
    // Change this to ["Manager"] to simulate manager behavior
    groups: ["Admin"],
    manager_company_id: 1
  };
}

export default function MainLayout() {
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("mock_user");
    return raw ? JSON.parse(raw) : getDefaultUser();
  });

  const isManager = useMemo(() => user.groups?.includes("Manager"), [user]);

  useEffect(() => {
    localStorage.setItem("mock_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const onDocClick = (e) => {
      const navLinks = document.getElementById("navLinks");
      const hamburger = document.querySelector(".mobile-menu-toggle");
      if (!navLinks) return;
      if (
        navLinks.classList.contains("active") &&
        !navLinks.contains(e.target) &&
        (!hamburger || !hamburger.contains(e.target))
      ) {
        navLinks.classList.remove("active");
      }
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const toggleMobile = (e) => {
    e.stopPropagation();
    const navLinks = document.getElementById("navLinks");
    if (navLinks) navLinks.classList.toggle("active");
  };

  return (
    <>
      <div className="navbar">
        <div
          className="hamburger mobile-menu-toggle"
          id="hamburger-1"
          onClick={toggleMobile}
          title="Menu"
        >
          ☰
        </div>

        <div className="nav-links" id="navLinks">
          <div className="dropdown" style={{ marginTop: 2 }}>
            <span className="dropdown-toggle">Reports</span>
            <div className="dropdown-menu">
              <Link className="dropdown-item-2" to="/inventory">
                Inventory Report
              </Link>
              <a className="dropdown-item-2" href="#" onClick={(e) => e.preventDefault()}>
                Sales Performance (placeholder)
              </a>
            </div>
          </div>

          <Link
            to="/"
            className="dropdown-toggle"
            style={{
              background: location.pathname === "/" ? "#E4E5E7" : "transparent",
              color: "#333"
            }}
          >
            Home
          </Link>
        </div>

        <div className="navbar-left-items" id="navbar-left-items">
          <div className="dropdown">
            <span className="user-name-btn" style={{ color: "white", cursor: "pointer" }}>
              {user.full_name} <i className="fas fa-caret-down"></i>
            </span>
            <div className="dropdown-menu user-menu-align">
              <div className="dropdown-item-2" style={{ cursor: "default" }}>
                Role: {isManager ? "Manager" : "Non-Manager"}
              </div>
              <button
                className="dropdown-item-2"
                onClick={() =>
                  setUser((u) => ({
                    ...u,
                    groups: u.groups?.includes("Manager") ? ["Admin"] : ["Manager"]
                  }))
                }
                style={{ textAlign: "left", background: "#f2f2f2", border: "none" }}
              >
                Toggle Manager
              </button>
            </div>
          </div>

          <button
            className="logout"
            onClick={() => alert("Mock logout (no backend).")}
            type="button"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container-new">
        <Outlet context={{ user }} />
      </div>
    </>
  );
}
