import React from "react";
import "./TopHeader.css";

export default function TopHeader({
  userName = "Reem Slama",
  onLogout = () => alert("Logout (mock)"),
}) {
  const menus = [
    { label: "Sales", items: ["Leads", "Opportunities"] },
    { label: "Approvals", items: ["Pending", "Approved"] },
    { label: "Projects", items: ["All Projects", "Create Project"] },
    { label: "Inventory", items: ["Units", "Availability"] },
    { label: "Reports", items: ["Summary", "Detailed"] },
    { label: "Market Research", items: ["Dashboard"] },
    { label: "Pricing", items: ["Price List"] },
    { label: "Users & Companies", items: ["Manage Users", "Companies"] },
  ];

  return (
    <div className="topheader">
      <div className="topheader-inner">
        <div className="topheader-left">
          {menus.map((m) => (
            <div className="topheader-dd" key={m.label}>
              <button className="topheader-dd-btn" type="button">
                {m.label} <span className="topheader-caret">▼</span>
              </button>

              <div className="topheader-dd-menu">
                {m.items.map((it) => (
                  <button
                    key={it}
                    className="topheader-dd-item"
                    type="button"
                    onClick={() => alert(`${m.label} → ${it} (mock)`)}
                  >
                    {it}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="topheader-right">
          <div className="topheader-dd">
            <button className="topheader-dd-btn" type="button">
              {userName} <span className="topheader-caret">▼</span>
            </button>
            <div className="topheader-dd-menu right">
              <button className="topheader-dd-item" type="button" onClick={() => alert("Profile (mock)")}>
                Profile
              </button>
              <button className="topheader-dd-item" type="button" onClick={() => alert("Settings (mock)")}>
                Settings
              </button>
            </div>
          </div>

          <button className="topheader-logout" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
