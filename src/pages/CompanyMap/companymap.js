// ─── CompanyMap.js ────────────────────────────────────────────────────────────
import { useEffect, useMemo, useRef, useState } from "react";
import "./companymap.css";
import {
  CURRENT_USER,
  COMPANIES,
  CITY_DATA,
  COMPOUNDS,
  PRICE_OPTIONS,
  moneyShort,
  getPolygonCenter,
  getMarkerLocation,
  addMasterplanLayer,
  countProjectsByCity,
  getVideoFilename,
} from "../../data/companymapdata";

// ── EARTH INTRO ──────────────────────────────────────────────────────────────
function EarthIntro() {
  // FIX 1: moved `texts` inside the effect so texts.length is not an external dependency.
  // A separate read-only copy is kept outside the effect only for rendering.
  const texts = ["Loading...", "Loading real estate data...", "Analyzing properties...", "Ready!"];
  const [currentText, setCurrentText] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrentText(p => (p + 1) % 4), 800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="earth-intro">
      <div className="earth-container">
        <div className="earth">
          <div className="continent africa"><div className="country egypt"></div></div>
          <div className="continent europe"></div>
          <div className="continent asia"></div>
          <div className="continent north-america"></div>
          <div className="continent south-america"></div>
          <div className="continent australia"></div>
          <div className="continent antarctica"></div>
          <div className="country-borders">
            <div className="border-line africa-border"></div>
            <div className="border-line europe-border"></div>
            <div className="border-line asia-border"></div>
            <div className="border-line america-border"></div>
          </div>
          <div className="egypt-marker">
            <div className="pulse-ring ring-1"></div>
            <div className="pulse-ring ring-2"></div>
            <div className="pulse-ring ring-3"></div>
            <div className="egypt-dot"></div>
          </div>
        </div>
        <div className="zoom-lines">
          <div className="zoom-line line-1"></div>
          <div className="zoom-line line-2"></div>
          <div className="zoom-line line-3"></div>
        </div>
        <div className="earth-text">
          <div className="earth-main-title">PROMETHEUS</div>
          <div className="earth-subtitle">Real Estate Intelligence Platform</div>
          <div className="loading-text">{texts[currentText]}</div>
          <div className="progress-bar"><div className="progress-fill"></div></div>
        </div>
      </div>
    </div>
  );
}

// ── COMPANY SELECT MODAL ─────────────────────────────────────────────────────
function CompanySelectModal({ onSelect }) {
  const [selected, setSelected] = useState(null);
  return (
    <div className="overlay-backdrop">
      <div className="company-modal">
        <div className="company-modal-title">🏢 Select a Company</div>
        <div className="company-modal-sub">Choose the company whose projects you want to explore on the map</div>
        <div className="company-grid">
          {(COMPANIES || []).map(co => (
            <div key={co.id} className={`company-card ${selected === co.id ? "selected" : ""}`} onClick={() => setSelected(co.id)}>
              <div className="company-check">✓</div>
              <div className="company-card-logo" style={{ background: co.bgColor, color: co.color }}>{co.emoji}</div>
              <div className="company-card-name" style={{ color: selected === co.id ? co.color : undefined }}>{co.name}</div>
              <div className="company-card-sub">{co.tagline}</div>
            </div>
          ))}
        </div>
        <button className="company-modal-confirm" disabled={!selected} onClick={() => selected && onSelect(selected)}>
          {selected ? `Explore ${selected} Projects →` : "Select a Company"}
        </button>
      </div>
    </div>
  );
}

// ── PROJECT MODAL ────────────────────────────────────────────────────────────
// FIX 3: Close button moved inside modal-tabs bar (absolutely positioned top-right).
// Tabs come FIRST before gallery so the dark header renders correctly.
function ProjectModal({ project, onClose, company }) {
  const [idx, setIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("photos");
  const videoFile = getVideoFilename(project.name);
  useEffect(() => { setIdx(0); setActiveTab("photos"); }, [project?.id]);

  const images = project.images || [];

  return (
    <div className="project-modal">
      {/* Tabs bar — close button sits inside it, absolutely positioned */}
      <div className="modal-tabs" style={{ position: "relative" }}>
        <button
          className={`modal-tab ${activeTab === "photos" ? "active" : ""}`}
          onClick={() => setActiveTab("photos")}
        >🖼️ Photos</button>
        <button
          className={`modal-tab ${activeTab === "video" ? "active" : ""}`}
          onClick={() => setActiveTab("video")}
        >🎬 Video</button>
        <button
          className="project-modal-close"
          onClick={onClose}
          style={{ position: "absolute", top: 8, right: 10 }}
        >×</button>
      </div>

      {/* Gallery or Video */}
      {activeTab === "photos" ? (
        <div className="gallery" style={{ height: 260 }}>
          {images.length > 0 && (
            <img
              key={idx}
              src={images[idx]}
              alt={project.name}
              onError={e => { e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&h=600&fit=crop&q=80"; }}
            />
          )}
          {images.length > 1 && (
            <>
              <div className="gallery-nav">
                <button className="gbtn" onClick={() => setIdx(i => (i - 1 + images.length) % images.length)}>‹</button>
                <button className="gbtn" onClick={() => setIdx(i => (i + 1) % images.length)}>›</button>
              </div>
              <div className="gallery-dots">
                {images.map((_, i) => (
                  <div key={i} className={`dot ${i === idx ? "active" : ""}`} onClick={() => setIdx(i)} />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="video-panel" style={{ height: 260 }}>
          <video key={project.id} controls style={{ width: "100%", height: "100%", objectFit: "cover", background: "#000" }}>
            <source src={videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <div className="project-modal-body">
        <div className="pm-title">{project.name}</div>
        {company && (
          <div className="pm-company-tag">
            <span className="tag-icon">🏢</span>
            <span className="tag-text">{company.name} · {company.tagline}</span>
          </div>
        )}
        <div className="pm-sub"><span>📍 {project.city}</span> • {project.developer}</div>
        <div className="pm-grid">
          <div className="pm-card"><div className="pm-label">Starting Price</div><div className="pm-val" style={{ color: "var(--success)" }}>{moneyShort(project.minPrice)} EGP</div></div>
          <div className="pm-card"><div className="pm-label">Max Price</div><div className="pm-val" style={{ color: "var(--danger)" }}>{moneyShort(project.maxPrice)} EGP</div></div>
          <div className="pm-card"><div className="pm-label">Delivery</div><div className="pm-val">{project.deliveryDate}</div></div>
          <div className="pm-card"><div className="pm-label">Built-up Area</div><div className="pm-val">{project.bua} m²</div></div>
        </div>
        {project.areaVariants && project.areaVariants.length > 1 && (
          <div className="pm-areas">
            <div className="pm-areas-title">Available Areas</div>
            {project.areaVariants.map((sz, i) => (
              <div key={i} className="pm-area-item">
                <span className="pm-area-name">Option {i + 1}</span>
                <span className="pm-area-size">{sz} m²</span>
              </div>
            ))}
          </div>
        )}
        <div className="pm-desc">{project.description}</div>
        <div className="pm-grid" style={{ marginTop: 14 }}>
          <div className="pm-card"><div className="pm-label">Unit Types</div><div className="pm-val" style={{ fontSize: 12, lineHeight: 1.4 }}>{(project.unitTypes || []).join(", ")}</div></div>
          <div className="pm-card"><div className="pm-label">Bedrooms</div><div className="pm-val">{project.bedrooms || "-"}</div></div>
          <div className="pm-card"><div className="pm-label">Bathrooms</div><div className="pm-val">{project.bathrooms || "-"}</div></div>
          <div className="pm-card">
            <div className="pm-label">Amenities</div>
            <div className="pm-val" style={{ fontSize: 12 }}>
              {[project.hasGarden && "Garden", project.hasRoof && "Roof", project.hasPool && "Pool", project.hasGarage && "Garage"].filter(Boolean).join(", ") || "-"}
            </div>
          </div>
        </div>
        <div className="contact-buttons">
          <button className="contact-btn call">📞 Call Now</button>
          <button className="contact-btn whatsapp">💬 WhatsApp</button>
          <button className="contact-btn goto" style={{ flexBasis: "100%" }} onClick={() => window.location.href = "masterplans.html"}>🗺️ Go To Masterplans</button>
        </div>
      </div>
    </div>
  );
}

// ── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ title, subtitle, projects, selectedProject, onProjectClick, onClose }) {
  const safeProjects = projects || [];
  return (
    <div className="map-sidebar">
      <div className="sidebar-header">
        <div>
          <div className="sidebar-title">{title}</div>
          <div className="sidebar-subtitle">{subtitle}</div>
        </div>
        <button className="sidebar-close-filter" onClick={onClose}>×</button>
      </div>
      <div className="sidebar-content">
        {safeProjects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--gray-500)" }}>
            <div style={{ fontSize: "44px", marginBottom: "14px" }}>🏢</div>
            <div style={{ fontSize: "15px", fontWeight: "700", marginBottom: "6px" }}>No compounds found</div>
            <div style={{ fontSize: "13px" }}>Try adjusting your filters</div>
          </div>
        ) : safeProjects.map(p => (
          <div key={p.id} className={`project-row ${selectedProject?.id === p.id ? "selected" : ""}`} onClick={() => onProjectClick(p)}>
            <div className="thumb">
              <img src={(p.images || [])[0]} alt={p.name} loading="lazy" onError={e => { e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&h=600&fit=crop&q=80"; }} />
            </div>
            <div className="project-meta">
              <div className="project-name">{p.name}</div>
              <div className="project-dev">{p.developer}</div>
            </div>
            <div className="project-price">{moneyShort(p.minPrice)}<span>Starting</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FILTER PANELS ─────────────────────────────────────────────────────────────
// FIX 1: All panels now use position:absolute + top:100% + left:0 so they drop
// directly below their own pill button. No JS coordinate tracking needed.
// The wrapper div around each pill already has position:relative (set in the JSX below).

const PANEL_STYLE = {
  position: "absolute",
  top: "100%",
  left: 0,
  marginTop: 6,
  width: 310,
  maxHeight: "75vh",
  overflowY: "auto",
  zIndex: 1200,
  // prevent overflow off right edge of screen
  maxWidth: "calc(100vw - 20px)",
};

const PANEL_STYLE_MORE = {
  ...PANEL_STYLE,
  maxHeight: "65vh",
};

function PriceFilterPanel({ filters, setFilters, onClose, onClear }) {
  const chg = (type, value) => setFilters(prev => {
    const n = { ...prev };
    if (type === "min") { n.priceMin = value; if (n.priceMax && Number(value) > Number(n.priceMax)) n.priceMax = value; }
    else { n.priceMax = value; if (n.priceMin && Number(value) < Number(n.priceMin)) n.priceMin = value; }
    return n;
  });
  return (
    <div className="filter-panel" style={PANEL_STYLE}>
      <div className="filter-header"><div className="filter-title">Price Range</div><button className="close-filter" onClick={onClose}>×</button></div>
      <div className="filter-content">
        <div className="filter-section">
          <div className="filter-section-title">Price (EGP){(filters.priceMin || filters.priceMax) && <span className="filter-section-count">Set</span>}</div>
          <div className="price-inputs">
            <div className="input-wrapper"><label>Min Price</label>
              <select className="filter-input" value={filters.priceMin} onChange={e => chg("min", e.target.value)}>
                <option value="">No minimum</option>
                {(PRICE_OPTIONS || []).map(p => <option key={p} value={p}>{(p / 1e6).toFixed(1)}M EGP</option>)}
              </select>
            </div>
            <div className="input-wrapper"><label>Max Price</label>
              <select className="filter-input" value={filters.priceMax} onChange={e => chg("max", e.target.value)}>
                <option value="">No maximum</option>
                {(PRICE_OPTIONS || []).map(p => <option key={p} value={p}>{(p / 1e6).toFixed(1)}M EGP</option>)}
              </select>
            </div>
          </div>
          <div className="quick-presets">
            <button className="preset-btn" onClick={() => setFilters(p => ({ ...p, priceMin: "500000", priceMax: "5000000" }))}>0.5-5M</button>
            <button className="preset-btn" onClick={() => setFilters(p => ({ ...p, priceMin: "5000000", priceMax: "15000000" }))}>5-15M</button>
            <button className="preset-btn" onClick={() => setFilters(p => ({ ...p, priceMin: "15000000", priceMax: "" }))}>15M+</button>
          </div>
        </div>
        <div className="filter-actions">
          <button className="filter-btn clear" onClick={onClear}>Clear</button>
          <button className="filter-btn apply" onClick={onClose}>Apply</button>
        </div>
      </div>
    </div>
  );
}

function DeliveryFilterPanel({ filters, toggleSet, onClose, onClear }) {
  return (
    <div className="filter-panel" style={PANEL_STYLE}>
      <div className="filter-header"><div className="filter-title">Delivery Date</div><button className="close-filter" onClick={onClose}>×</button></div>
      <div className="filter-content">
        <div className="filter-section">
          <div className="filter-section-title">Select Years{filters.delivery.size > 0 && <span className="filter-section-count">{filters.delivery.size}</span>}</div>
          <div className="checkbox-grid">
            {["2025", "2026", "2027", "2028", "2029", "2030", "RTM"].map(y => (
              <label key={y} className={`checkbox-item ${filters.delivery.has(y) ? "selected" : ""}`}>
                <input type="checkbox" className="checkbox-input" checked={filters.delivery.has(y)} onChange={() => toggleSet("delivery", y)} />
                <span className="checkbox-label">{y === "RTM" ? "Ready" : y}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="filter-actions">
          <button className="filter-btn clear" onClick={onClear}>Clear All</button>
          <button className="filter-btn apply" onClick={onClose}>Apply</button>
        </div>
      </div>
    </div>
  );
}

function TypesFilterPanel({ filters, toggleSet, onClose, onClear }) {
  const types = [
    { value: "Apartment", label: "Apartment" }, { value: "Villa", label: "Villa" },
    { value: "Townhouse", label: "Townhouse" }, { value: "Duplex", label: "Duplex" },
    { value: "Penthouse", label: "Penthouse" }, { value: "Twinhouse", label: "Twinhouse" },
    { value: "Office", label: "Office" }, { value: "Clinic", label: "Clinic" },
    { value: "Services Apartment", label: "Services" },
  ];
  return (
    <div className="filter-panel" style={PANEL_STYLE}>
      <div className="filter-header"><div className="filter-title">Property Types</div><button className="close-filter" onClick={onClose}>×</button></div>
      <div className="filter-content">
        <div className="filter-section">
          <div className="filter-section-title">Select Types{filters.types.size > 0 && <span className="filter-section-count">{filters.types.size}</span>}</div>
          <div className="checkbox-grid">
            {types.map(t => (
              <label key={t.value} className={`checkbox-item ${filters.types.has(t.value) ? "selected" : ""}`}>
                <input type="checkbox" className="checkbox-input" checked={filters.types.has(t.value)} onChange={() => toggleSet("types", t.value)} />
                <span className="checkbox-label">{t.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="filter-actions">
          <button className="filter-btn clear" onClick={onClear}>Clear All</button>
          <button className="filter-btn apply" onClick={onClose}>Apply</button>
        </div>
      </div>
    </div>
  );
}

function MoreFilterPanel({ filters, setFilters, toggleArray, toggleSet, onClose, onClear }) {
  const [exp, setExp] = useState({ bb: true, area: false, feat: false });
  const tog = s => setExp(p => ({ ...p, [s]: !p[s] }));
  const aChg = (type, value) => setFilters(prev => {
    const n = { ...prev };
    if (type === "min") { n.areaMin = value; if (n.areaMax && Number(value) > Number(n.areaMax)) n.areaMax = value; }
    else { n.areaMax = value; if (n.areaMin && Number(value) < Number(n.areaMin)) n.areaMin = value; }
    return n;
  });
  return (
    <div className="filter-panel" style={PANEL_STYLE_MORE}>
      <div className="filter-header"><div className="filter-title">More Filters</div><button className="close-filter" onClick={onClose}>×</button></div>
      <div className="filter-content">
        <div className="filter-section">
          <div className="filter-section-title" style={{ cursor: "pointer" }} onClick={() => tog("bb")}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><span>Bedrooms & Bathrooms</span><span style={{ fontSize: "11px", color: "var(--gray-500)" }}>{exp.bb ? "▲" : "▼"}</span></div>
            {(filters.bedrooms.length > 0 || filters.bathrooms.length > 0) && <span className="filter-section-count">{filters.bedrooms.length + filters.bathrooms.length}</span>}
          </div>
          {exp.bb && <>
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "11px", color: "var(--gray-600)", fontWeight: 700, marginBottom: "5px" }}>Bedrooms</div>
              <div className="checkbox-grid" style={{ gridTemplateColumns: "repeat(5,1fr)", gap: "5px" }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <label key={n} className={`checkbox-item ${filters.bedrooms.includes(n) ? "selected" : ""}`} style={{ padding: "7px 4px" }}>
                    <input type="checkbox" className="checkbox-input" checked={filters.bedrooms.includes(n)} onChange={() => toggleArray("bedrooms", n)} />
                    <span className="checkbox-label" style={{ fontSize: "11px" }}>{n}{n === 5 ? "+" : " "}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--gray-600)", fontWeight: 700, marginBottom: "5px" }}>Bathrooms</div>
              <div className="checkbox-grid" style={{ gridTemplateColumns: "repeat(5,1fr)", gap: "5px" }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <label key={n} className={`checkbox-item ${filters.bathrooms.includes(n) ? "selected" : ""}`} style={{ padding: "7px 4px" }}>
                    <input type="checkbox" className="checkbox-input" checked={filters.bathrooms.includes(n)} onChange={() => toggleArray("bathrooms", n)} />
                    <span className="checkbox-label" style={{ fontSize: "11px" }}>{n}{n === 5 ? "+" : " "}</span>
                  </label>
                ))}
              </div>
            </div>
          </>}
        </div>
        <div className="filter-section">
          <div className="filter-section-title" style={{ cursor: "pointer" }} onClick={() => tog("area")}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><span>Square Meter</span><span style={{ fontSize: "11px", color: "var(--gray-500)" }}>{exp.area ? "▲" : "▼"}</span></div>
            {(filters.areaMin || filters.areaMax) && <span className="filter-section-count">Set</span>}
          </div>
          {exp.area && <>
            <div className="price-inputs">
              <div className="input-wrapper"><label>Min (m²)</label>
                <select className="filter-input" value={filters.areaMin} onChange={e => aChg("min", e.target.value)}>
                  <option value="">Min</option>
                  {[50, 100, 150, 200, 250, 300, 350, 400].map(a => <option key={a} value={a}>{a}m²</option>)}
                </select>
              </div>
              <div className="input-wrapper"><label>Max (m²)</label>
                <select className="filter-input" value={filters.areaMax} onChange={e => aChg("max", e.target.value)}>
                  <option value="">Max</option>
                  {[50, 100, 150, 200, 250, 300, 350, 400].map(a => <option key={a} value={a}>{a}m²</option>)}
                </select>
              </div>
            </div>
            <div className="quick-presets" style={{ marginTop: "8px" }}>
              {[{ l: "50-100m²", mn: 50, mx: 100 }, { l: "100-150m²", mn: 100, mx: 150 }, { l: "150-200m²", mn: 150, mx: 200 }, { l: "200-300m²", mn: 200, mx: 300 }, { l: "300m²+", mn: 300, mx: "" }].map(p => (
                <button key={p.l} className="preset-btn" onClick={() => setFilters(prev => ({ ...prev, areaMin: p.mn.toString(), areaMax: p.mx.toString() }))}>{p.l}</button>
              ))}
            </div>
          </>}
        </div>
        <div className="filter-section">
          <div className="filter-section-title" style={{ cursor: "pointer" }} onClick={() => tog("feat")}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><span>Features</span><span style={{ fontSize: "11px", color: "var(--gray-500)" }}>{exp.feat ? "▲" : "▼"}</span></div>
            {(filters.hasGarden || filters.hasRoof || filters.hasPool || filters.hasGarage) && (
              <span className="filter-section-count">{[filters.hasGarden, filters.hasRoof, filters.hasPool, filters.hasGarage].filter(Boolean).length}</span>
            )}
          </div>
          {exp.feat && (
            <div className="checkbox-grid" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
              {[{ k: "hasGarden", l: "Garden", i: "🌿" }, { k: "hasRoof", l: "Roof", i: "🏠" }, { k: "hasPool", l: "Pool", i: "🏊" }, { k: "hasGarage", l: "Garage", i: "🚗" }].map(f => (
                <label key={f.k} className={`checkbox-item ${filters[f.k] ? "selected" : ""}`} style={{ padding: "8px" }}>
                  <input type="checkbox" className="checkbox-input" checked={filters[f.k]} onChange={e => setFilters(p => ({ ...p, [f.k]: e.target.checked }))} />
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><span>{f.i}</span><span className="checkbox-label" style={{ fontSize: "11px" }}>{f.l}</span></div>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="filter-actions">
          <button className="filter-btn clear" onClick={onClear}>Clear All</button>
          <button className="filter-btn apply" onClick={onClose}>Apply Filters</button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function CompanyMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const osmColorRef = useRef(null);
  const esriSatRef = useRef(null);
  const esriLabelsRef = useRef(null);
  const cityPolygonsGroup = useRef(null);
  const projectPolygonsGroup = useRef(null);
  const cityLabelsGroup = useRef(null);
  const clusterGroupRef = useRef(null);
  const directMarkersRef = useRef(null);
  const masterplanLayerRef = useRef(null);
  const selectedMarkerRef = useRef(null);

  const isSales = CURRENT_USER.role === "sales";
  const isAdminOrDev = CURRENT_USER.role === "admin" || CURRENT_USER.role === "developer";

  // FIX 2: showEarthIntro is always false and setShowEarthIntro was never called,
  // so replaced useState with a plain constant to eliminate the unused-var warning.
  const showEarthIntro = false;
  const [showCompanyModal, setShowCompanyModal] = useState(isAdminOrDev);
  const [activeCompany, setActiveCompany] = useState(isSales ? CURRENT_USER.company : null);

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mapZoom, setMapZoom] = useState(10);
  const [visibleCities, setVisibleCities] = useState(new Set());
  const [showProjects, setShowProjects] = useState(false);

  const [filters, setFilters] = useState({
    priceMin: "", priceMax: "",
    delivery: new Set(), types: new Set(),
    bedrooms: [], bathrooms: [],
    areaMin: "", areaMax: "",
    hasGarden: false, hasRoof: false, hasPool: false, hasGarage: false,
    paymentPlan: null, downPayment: "", monthlyInstallments: "",
    installmentsYears: new Set(), finishing: new Set(), saleType: new Set(),
  });

  const cityLabelOffsetsRef = useRef({});

  // ── Debounced search query ──
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(search), 150);
    return () => clearTimeout(t);
  }, [search]);

  // ── Derived state ──
  const hasActiveFilters = useMemo(() => Boolean(
    filters.priceMin || filters.priceMax ||
    filters.delivery.size > 0 || filters.types.size > 0 ||
    filters.bedrooms.length > 0 || filters.bathrooms.length > 0 ||
    filters.areaMin || filters.areaMax ||
    filters.hasGarden || filters.hasRoof || filters.hasPool || filters.hasGarage ||
    filters.paymentPlan || filters.downPayment || filters.monthlyInstallments ||
    filters.installmentsYears.size > 0 || filters.finishing.size > 0 || filters.saleType.size > 0
  ), [filters]);

  const hasActiveCriteria = useMemo(() =>
    hasActiveFilters || Boolean(searchQuery.trim()) || Boolean(activeCompany),
    [hasActiveFilters, searchQuery, activeCompany]);

  const companyObj = useMemo(() => activeCompany ? (COMPANIES || []).find(c => c.id === activeCompany) : null, [activeCompany]);

  const companyFilteredCompounds = useMemo(() => {
    const safeCompounds = COMPOUNDS || [];
    if (!activeCompany || !companyObj) return safeCompounds;
    return safeCompounds.filter(p => p && companyObj.areas && companyObj.areas.includes(p.city));
  }, [activeCompany, companyObj]);

  const filteredProjects = useMemo(() => {
    const s = searchQuery.trim().toLowerCase();
    return (companyFilteredCompounds || []).filter(p => {
      if (!p) return false;
      if (s) { const hay = `${p.name} ${p.city} ${(p.unitTypes || []).join(" ")}`.toLowerCase(); if (!hay.includes(s)) return false; }
      if (filters.priceMin && p.minPrice < Number(filters.priceMin)) return false;
      if (filters.priceMax && p.minPrice > Number(filters.priceMax)) return false;
      if (filters.delivery.size > 0 && !filters.delivery.has(p.deliveryDate)) return false;
      if (filters.types.size > 0) { if (!(p.unitTypes || []).some(t => filters.types.has(t))) return false; }
      if (filters.bedrooms.length > 0) { if (!filters.bedrooms.some(n => n === 5 ? p.bedrooms >= 5 : p.bedrooms === n)) return false; }
      if (filters.bathrooms.length > 0) { if (!filters.bathrooms.some(n => n === 5 ? p.bathrooms >= 5 : p.bathrooms === n)) return false; }
      if (filters.areaMin && p.bua < Number(filters.areaMin)) return false;
      if (filters.areaMax && p.bua > Number(filters.areaMax)) return false;
      if (filters.hasGarden && !p.hasGarden) return false;
      if (filters.hasRoof && !p.hasRoof) return false;
      if (filters.hasPool && !p.hasPool) return false;
      if (filters.hasGarage && !p.hasGarage) return false;
      if (filters.paymentPlan && !(p.paymentPlans || []).includes(filters.paymentPlan)) return false;
      return true;
    });
  }, [filters, searchQuery, companyFilteredCompounds]);

  const citiesWithMatches = useMemo(() => {
    const s = new Set();
    (filteredProjects || []).forEach(p => { if (p && p.city) s.add(p.city); });
    return s;
  }, [filteredProjects]);

  const cityCounts = useMemo(() => countProjectsByCity(filteredProjects), [filteredProjects]);

  // ── Click outside to close panels ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activePanel && !e.target.closest(".filter-panel") && !e.target.closest(".filter-pill")) setActivePanel(null);
      if (searchFocused && !e.target.closest(".map-search-box") && !e.target.closest(".search-results")) {
        setTimeout(() => setSearchFocused(false), 200);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePanel, searchFocused]);

  // ── MAP INIT ──
  useEffect(() => {
    if (mapInstance.current) return;
    const L = window.L;
    if (!L) { console.error("[CompanyMap] Leaflet (window.L) is not loaded!"); return; }

    try {
      mapInstance.current = L.map("map", {
        zoomControl: false,
        preferCanvas: true,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
        zoomAnimationThreshold: 4,
      }).setView([30.0444, 31.2357], 6);

      L.control.zoom({ position: "bottomright" }).addTo(mapInstance.current);

      osmColorRef.current = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        { attribution: "", maxZoom: 19, subdomains: "abcd" }
      ).addTo(mapInstance.current);

      esriSatRef.current = L.tileLayer("https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", { attribution: "", maxZoom: 20 });
      esriLabelsRef.current = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",
        { attribution: "", maxZoom: 20 }
      );

      cityPolygonsGroup.current = L.layerGroup().addTo(mapInstance.current);
      projectPolygonsGroup.current = L.layerGroup().addTo(mapInstance.current);
      cityLabelsGroup.current = L.layerGroup().addTo(mapInstance.current);

      mapInstance.current.createPane("projectMarkerPane");
      mapInstance.current.getPane("projectMarkerPane").style.zIndex = 9000;
      mapInstance.current.createPane("selectedMarkerPane");
      mapInstance.current.getPane("selectedMarkerPane").style.zIndex = 9100;
      mapInstance.current.getPane("tooltipPane").style.zIndex = 9200;

      if (L.markerClusterGroup) {
        clusterGroupRef.current = L.markerClusterGroup({
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: false,
          disableClusteringAtZoom: 13,
          maxClusterRadius: 60,
          clusterPane: "projectMarkerPane",
          iconCreateFunction: (cluster) => {
            const count = cluster.getChildCount();
            return L.divIcon({
              html: `<div class="cluster-icon"><span>${count}</span></div>`,
              className: "",
              iconSize: [36, 36],
              iconAnchor: [18, 18],
            });
          },
        });
        mapInstance.current.addLayer(clusterGroupRef.current);
      } else {
        clusterGroupRef.current = L.layerGroup().addTo(mapInstance.current);
      }

      directMarkersRef.current = L.layerGroup().addTo(mapInstance.current);
      selectedMarkerRef.current = L.layerGroup().addTo(mapInstance.current);

      masterplanLayerRef.current = addMasterplanLayer(mapInstance.current, COMPOUNDS || []);
      if (masterplanLayerRef.current) masterplanLayerRef.current.setVisible(false);

      const applyZoomStyling = () => {
        if (!mapInstance.current) return;
        const z = mapInstance.current.getZoom();
        setMapZoom(z);
        const useSat = z >= 13;
        if (useSat) {
          if (mapInstance.current.hasLayer(osmColorRef.current)) mapInstance.current.removeLayer(osmColorRef.current);
          if (!mapInstance.current.hasLayer(esriSatRef.current)) mapInstance.current.addLayer(esriSatRef.current);
          if (!mapInstance.current.hasLayer(esriLabelsRef.current)) mapInstance.current.addLayer(esriLabelsRef.current);
        } else {
          if (mapInstance.current.hasLayer(esriSatRef.current)) mapInstance.current.removeLayer(esriSatRef.current);
          if (mapInstance.current.hasLayer(esriLabelsRef.current)) mapInstance.current.removeLayer(esriLabelsRef.current);
          if (!mapInstance.current.hasLayer(osmColorRef.current)) mapInstance.current.addLayer(osmColorRef.current);
        }
        if (masterplanLayerRef.current) masterplanLayerRef.current.setVisible(useSat);
      };

      mapInstance.current.on("zoomend", applyZoomStyling);
      mapInstance.current.on("zoomend", () => {
        if (!mapInstance.current) return;
        const z = mapInstance.current.getZoom();
        setMapZoom(z);
        if (z >= 13) setShowProjects(true);
      });

      const updateVisible = () => {
        if (!mapInstance.current) return;
        const bounds = mapInstance.current.getBounds();
        const visible = new Set();
        Object.values(CITY_DATA || {}).forEach(city => {
          if (city && city.bounds && city.bounds.length > 0) {
            try {
              if (bounds.intersects(L.latLngBounds(city.bounds))) visible.add(city.name);
            } catch (e) {
              console.warn("[CompanyMap] bounds.intersects error:", city.name, e);
            }
          }
        });
        setVisibleCities(visible);
      };
      mapInstance.current.on("moveend", updateVisible);
      setTimeout(updateVisible, 0);
      applyZoomStyling();

      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.flyTo([30.0444, 31.2357], 10, { animate: true, duration: 2.2, easeLinearity: 0.25 });
        }
      }, 4600);
    } catch (e) {
      console.error("[CompanyMap] Map init error:", e);
    }
  }, []);

  // ── COMPANY SELECTION: fly to areas ──
  // FIX 3: added companyObj to the dependency array
  useEffect(() => {
    if (!activeCompany || !mapInstance.current || !companyObj) return;
    const L = window.L;
    if (!L) return;

    setShowProjects(false);
    setSelectedCity(null);
    setSelectedProject(null);
    setSidebarOpen(false);

    const areaBounds = [];
    (companyObj.areas || []).forEach(areaName => {
      const city = CITY_DATA[areaName];
      if (city && city.bounds) areaBounds.push(...city.bounds);
    });
    if (areaBounds.length === 0) return;

    setTimeout(() => {
      if (!mapInstance.current) return;
      try {
        mapInstance.current.flyToBounds(L.latLngBounds(areaBounds), { padding: [60, 60], maxZoom: 12, duration: 1.4 });
      } catch (e) {
        console.warn("[CompanyMap] flyToBounds error:", e);
      }
    }, 100);
  }, [activeCompany, companyObj]); // FIX 3: companyObj added here

  // ── CITY POLYGONS ──
  useEffect(() => {
    if (!mapInstance.current || !cityPolygonsGroup.current) return;
    const L = window.L;
    if (!L) return;

    try {
      cityPolygonsGroup.current.clearLayers();
      Object.values(CITY_DATA || {}).forEach(city => {
        if (!city || !city.bounds || !Array.isArray(city.bounds) || city.bounds.length < 3) return;
        const isSelected = selectedCity?.name === city.name;
        const hasMatchingProjects = citiesWithMatches.has(city.name);
        if (!isSelected) {
          if (selectedCity) return;
          if (hasActiveCriteria && !hasMatchingProjects) return;
        }
        try {
          const poly = L.polygon(city.bounds, {
            color: isSelected ? "#FF6B35" : city.color, weight: isSelected ? 3 : 2,
            opacity: isSelected ? 1 : 0.7, fillColor: city.color,
            fillOpacity: isSelected ? 0.2 : 0.12,
          });
          poly.on("click", () => onCityClick(city));
          poly.addTo(cityPolygonsGroup.current);
        } catch (e) {
          console.warn("[CompanyMap] Error creating polygon:", city.name, e);
        }
      });
    } catch (e) {
      console.error("[CompanyMap] City polygons effect error:", e);
    }
  }, [selectedCity, citiesWithMatches, hasActiveCriteria]);

  // ── CITY LABELS ──
  useEffect(() => {
    if (!mapInstance.current || !cityLabelsGroup.current) return;
    const L = window.L;
    if (!L) return;

    try {
      cityLabelsGroup.current.clearLayers();
      let citiesToShow = [];
      if (selectedCity) {
        citiesToShow = [selectedCity];
      } else if (hasActiveCriteria) {
        citiesToShow = Object.values(CITY_DATA || {}).filter(c => c && citiesWithMatches.has(c.name));
      } else {
        citiesToShow = Object.values(CITY_DATA || {}).filter(Boolean);
      }

      citiesToShow.filter(c => c && visibleCities.has(c.name)).forEach(city => {
        if (!city || !city.bounds || !Array.isArray(city.bounds) || city.bounds.length === 0) return;
        const count = cityCounts[city.name] || 0;
        if (!selectedCity && hasActiveCriteria && count === 0) return;
        const isSelected = selectedCity?.name === city.name;

        if (!cityLabelOffsetsRef.current[city.name]) {
          const zf = Math.min(1, mapZoom / 12);
          cityLabelOffsetsRef.current[city.name] = {
            lat: (Math.random() - 0.5) * 0.01 * (1 - zf),
            lng: (Math.random() - 0.5) * 0.01 * (1 - zf),
          };
        }
        const off = cityLabelOffsetsRef.current[city.name];
        const center = getPolygonCenter(city.bounds);
        if (!center || center.length < 2) return;

        try {
          const icon = L.divIcon({
            className: "",
            html: `<div class="city-label ${isSelected ? "selected" : ""}"><span>${city.name}</span><span class="city-count">${count}</span></div>`,
            iconSize: [null, null], iconAnchor: [0, 0],
          });
          const marker = L.marker([center[0] + off.lat, center[1] + off.lng], { icon, interactive: true }).addTo(cityLabelsGroup.current);
          marker.on("click", (e) => { e.originalEvent.stopPropagation(); onCityClick(city); });
        } catch (e) {
          console.warn("[CompanyMap] Error creating city label:", city.name, e);
        }
      });
    } catch (e) {
      console.error("[CompanyMap] City labels effect error:", e);
    }
  }, [cityCounts, selectedCity, citiesWithMatches, hasActiveCriteria, mapZoom, visibleCities]);

  // ── PROJECT MARKERS ──
  useEffect(() => {
    if (!mapInstance.current) return;
    if (!clusterGroupRef.current || !projectPolygonsGroup.current || !selectedMarkerRef.current || !directMarkersRef.current) return;
    const L = window.L;
    if (!L) return;

    try {
      clusterGroupRef.current.clearLayers();
      projectPolygonsGroup.current.clearLayers();
      selectedMarkerRef.current.clearLayers();
      directMarkersRef.current.clearLayers();

      if (!showProjects && !selectedProject) return;

      const currentZoom = mapInstance.current.getZoom();
      const useDirectLayer = currentZoom >= 14 || Boolean(selectedCity);

      (filteredProjects || []).forEach(p => {
        if (!p) return;
        if (selectedCity && p.city !== selectedCity.name) return;
        if (!p.projectBounds || !Array.isArray(p.projectBounds) || p.projectBounds.length < 3) return;

        const isSelected = selectedProject?.id === p.id;

        try {
          const poly = L.polygon(p.projectBounds, {
            color: isSelected ? "#004E89" : "#FF6B35",
            weight: isSelected ? 3 : 2,
            opacity: isSelected ? 1 : 0.75,
            fillColor: isSelected ? "#004E89" : "#FF6B35",
            fillOpacity: isSelected ? 0.18 : 0.04,
          }).addTo(projectPolygonsGroup.current);
          poly.on("click", () => onProjectClick(p, { fly: false }));
        } catch (e) {
          console.warn("[CompanyMap] Error creating project polygon:", p.name, e);
        }

        let markerLatLng;
        try {
          markerLatLng = getMarkerLocation(p);
          if (!markerLatLng || !Array.isArray(markerLatLng) || markerLatLng.length < 2) {
            markerLatLng = p.location || [30.0444, 31.2357];
          }
        } catch (e) {
          markerLatLng = p.location || [30.0444, 31.2357];
        }

        try {
          if (isSelected) {
            const selIcon = L.divIcon({
              className: "cmpd-icon-wrap",
              html: `<div class="cmpd-marker selected"><div class="cmpd-label selected">${p.name}</div><div class="cmpd-pin selected"></div></div>`,
              iconSize: [0, 0], iconAnchor: [0, 0],
            });
            const selMarker = L.marker(markerLatLng, { icon: selIcon, zIndexOffset: 9999, pane: "selectedMarkerPane" });
            selMarker.on("click", () => onProjectClick(p, { fly: false }));
            selectedMarkerRef.current.addLayer(selMarker);
          } else {
            if (useDirectLayer) {
              const icon = L.divIcon({
                className: "cmpd-icon-wrap",
                html: `<div class="cmpd-marker"><div class="cmpd-label">${p.name}</div><div class="cmpd-pin"></div></div>`,
                iconSize: [0, 0], iconAnchor: [0, 0],
              });
              const m = L.marker(markerLatLng, { icon, pane: "projectMarkerPane" });
              m.on("click", () => onProjectClick(p, { fly: true }));
              directMarkersRef.current.addLayer(m);
            } else {
              const icon = L.divIcon({
                className: "cmpd-icon-wrap",
                html: `<div class="cmpd-marker cluster-mode"><div class="cmpd-pin"></div></div>`,
                iconSize: [0, 0], iconAnchor: [0, 0],
              });
              const m = L.marker(markerLatLng, { icon, pane: "projectMarkerPane" });
              m.bindTooltip(p.name, { className: "mytip", direction: "top", offset: [0, -8], opacity: 1, sticky: false, pane: "tooltipPane" });
              m.on("click", () => onProjectClick(p, { fly: true }));
              clusterGroupRef.current.addLayer(m);
            }
          }
        } catch (e) {
          console.warn("[CompanyMap] Error creating marker:", p.name, e);
        }
      });

      if (selectedProject) {
        const alreadyAdded = (filteredProjects || []).some(p => p && p.id === selectedProject.id && (!selectedCity || p.city === selectedCity.name));
        if (!alreadyAdded && selectedProject.projectBounds) {
          try {
            const p = selectedProject;
            let markerLatLng = getMarkerLocation(p);
            if (!markerLatLng || !Array.isArray(markerLatLng) || markerLatLng.length < 2) markerLatLng = p.location || [30.0444, 31.2357];
            const selIcon = L.divIcon({
              className: "cmpd-icon-wrap",
              html: `<div class="cmpd-marker selected"><div class="cmpd-label selected">${p.name}</div><div class="cmpd-pin selected"></div></div>`,
              iconSize: [0, 0], iconAnchor: [0, 0],
            });
            const selMarker = L.marker(markerLatLng, { icon: selIcon, zIndexOffset: 9999, pane: "selectedMarkerPane" });
            selMarker.on("click", () => onProjectClick(p, { fly: false }));
            selectedMarkerRef.current.addLayer(selMarker);
          } catch (e) {
            console.warn("[CompanyMap] Error creating selected project marker:", e);
          }
        }
      }
    } catch (e) {
      console.error("[CompanyMap] Project markers effect error:", e);
    }
  }, [filteredProjects, selectedProject, selectedCity, showProjects, mapZoom]);

  // ── Event handlers ──
  const onCityClick = (city) => {
    if (!city || !mapInstance.current) return;
    const L = window.L;
    if (!L) return;
    setSelectedCity(city);
    setSidebarOpen(true);
    setSelectedProject(null);
    setShowProjects(true);
    try {
      mapInstance.current.flyToBounds(L.latLngBounds(city.bounds), { padding: [90, 90], maxZoom: 15, duration: 0.8 });
    } catch (e) {
      console.warn("[CompanyMap] onCityClick flyToBounds error:", e);
    }
  };

  const onProjectClick = (project, { fly } = { fly: true }) => {
    if (!project) return;
    const L = window.L;
    if (!L) return;
    setSelectedProject(project);
    setSelectedCity(CITY_DATA[project.city] || null);
    setShowProjects(true);
    if (fly && project.projectBounds && project.projectBounds.length >= 3) {
      try {
        mapInstance.current.flyToBounds(L.latLngBounds(project.projectBounds), { padding: [80, 80], maxZoom: 17, duration: 0.9 });
      } catch (e) {
        console.warn("[CompanyMap] onProjectClick flyToBounds error:", e);
      }
    }
  };

  const handleSearchSelect = (item, type) => {
    if (!item) return;
    const L = window.L;
    if (!L) return;
    setSearchFocused(false);
    if (type === "city") {
      setSelectedProject(null);
      setSelectedCity(item);
      setSidebarOpen(true);
      setShowProjects(true);
      try {
        mapInstance.current.flyToBounds(L.latLngBounds(item.bounds), { padding: [60, 60], maxZoom: 14, duration: 0.95 });
      } catch (e) {}
      setSearch("");
    } else if (type === "project") {
      setSelectedProject(item);
      setSelectedCity(CITY_DATA[item.city] || null);
      setShowProjects(true);
      if (item.projectBounds && item.projectBounds.length >= 3) {
        try {
          mapInstance.current.flyToBounds(L.latLngBounds(item.projectBounds), { padding: [80, 80], maxZoom: 17, duration: 1 });
        } catch (e) {}
      }
      setSearch("");
    }
  };

  const resetView = () => {
    setSelectedCity(null);
    setSelectedProject(null);
    setSidebarOpen(false);
    setSearch("");
    setSearchQuery("");
    setSearchFocused(false);
    setShowProjects(false);
    setFilters({
      priceMin: "", priceMax: "", delivery: new Set(), types: new Set(),
      bedrooms: [], bathrooms: [], areaMin: "", areaMax: "",
      hasGarden: false, hasRoof: false, hasPool: false, hasGarage: false,
      paymentPlan: null, downPayment: "", monthlyInstallments: "",
      installmentsYears: new Set(), finishing: new Set(), saleType: new Set(),
    });
    setActivePanel(null);
    if (mapInstance.current) {
      try {
        mapInstance.current.flyTo([30.0444, 31.2357], 10, { animate: true, duration: 1.2, easeLinearity: 0.3 });
      } catch (e) {}
    }
  };

  const toggleSet = (key, value) => setFilters(prev => {
    const n = new Set(prev[key]);
    n.has(value) ? n.delete(value) : n.add(value);
    return { ...prev, [key]: n };
  });

  const toggleArray = (key, value) => setFilters(prev => {
    const a = [...(prev[key] || [])];
    return a.includes(value) ? { ...prev, [key]: a.filter(v => v !== value) } : { ...prev, [key]: [...a, value] };
  });

  const clearPanel = (panel) => {
    if (panel === "price") setFilters(prev => ({ ...prev, priceMin: "", priceMax: "" }));
    else if (panel === "delivery") setFilters(prev => ({ ...prev, delivery: new Set() }));
    else if (panel === "types") setFilters(prev => ({ ...prev, types: new Set() }));
    else if (panel === "more") setFilters(prev => ({
      ...prev, bedrooms: [], bathrooms: [], areaMin: "", areaMax: "",
      hasGarden: false, hasRoof: false, hasPool: false, hasGarage: false,
      paymentPlan: null, downPayment: "", monthlyInstallments: "",
      installmentsYears: new Set(), finishing: new Set(), saleType: new Set(),
    }));
  };

  const sidebarProjects = useMemo(() =>
    selectedCity ? (filteredProjects || []).filter(p => p && p.city === selectedCity.name) : (filteredProjects || []),
    [filteredProjects, selectedCity]);

  const activeFilterCount = useMemo(() => {
    let c = 0;
    if (filters.priceMin || filters.priceMax) c++;
    if (filters.delivery.size) c++;
    if (filters.types.size) c++;
    if (filters.bedrooms.length > 0 || filters.bathrooms.length > 0 || filters.areaMin || filters.areaMax ||
      filters.hasGarden || filters.hasRoof || filters.hasPool || filters.hasGarage ||
      filters.paymentPlan || filters.downPayment || filters.monthlyInstallments ||
      filters.installmentsYears.size > 0 || filters.finishing.size > 0 || filters.saleType.size > 0) c++;
    return c;
  }, [filters]);

  const handleFilterClick = (panel) => setActivePanel(activePanel === panel ? null : panel);

  const badgeCompoundsCount = selectedProject ? 1 : selectedCity ? sidebarProjects.length : (filteredProjects || []).length;
  const badgeAreasCount = selectedProject ? 1 : selectedCity ? 1 : citiesWithMatches.size;
  const hideBottomControls = badgeCompoundsCount === 1 && badgeAreasCount === 1;

  const handleCompanySelect = (companyId) => {
    setActiveCompany(companyId);
    setShowCompanyModal(false);
  };

  return (
    <div className="company-map-container">
      {showEarthIntro && <EarthIntro />}

      {!showEarthIntro && showCompanyModal && isAdminOrDev && (
        <CompanySelectModal onSelect={handleCompanySelect} />
      )}

      <div className="main-content">
        <div className="map-wrapper">
          <div id="map" ref={mapRef}></div>

          <div
            className="top-controls"
            style={{ animation: showEarthIntro ? "none" : "fadeIn 0.8s ease-out", opacity: showEarthIntro ? 0 : 1 }}
          >
            {/* ── Search ── */}
            {/* FIX 2: search-icon uses inline flex + lineHeight:1 to pin emoji to center */}
            <div className="map-search-container">
              <div className={`map-search-box ${searchFocused ? "focused" : ""}`}>
                <span
                  className="map-search-icon"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, fontSize: 14, width: 16, flexShrink: 0 }}
                >🔍</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  placeholder="Search by City or Compound"
                />
                {search && (
                  <button className="clear-search" onClick={() => { setSearch(""); setSearchQuery(""); }}>×</button>
                )}
              </div>

              {searchFocused && search.trim() && (
                <div className="search-results">
                  {(() => {
                    const s = search.trim().toLowerCase();
                    const areas = Object.values(CITY_DATA || {}).filter(c => c && c.name && c.name.toLowerCase().includes(s)).filter(c => {
                      if (selectedCity) return c.name === selectedCity.name;
                      if (hasActiveCriteria) return citiesWithMatches.has(c.name);
                      return true;
                    });
                    const compounds = (filteredProjects || []).filter(p =>
                      p && (p.name.toLowerCase().includes(s) || p.city.toLowerCase().includes(s))
                    ).slice(0, 6);

                    if (!areas.length && !compounds.length) return (
                      <div className="result-category">
                        <div className="result-category-title">No Results</div>
                        <div className="result-item"><div className="result-icon">❌</div><div className="result-content"><div className="result-name">No matches found</div></div></div>
                      </div>
                    );
                    return (
                      <>
                        {areas.length > 0 && (
                          <div className="result-category">
                            <div className="result-category-title">Areas ({areas.length})</div>
                            {areas.map(a => (
                              <div key={a.name} className="result-item" onClick={() => handleSearchSelect(a, "city")}>
                                <div className="result-icon">📍</div>
                                <div className="result-content">
                                  <div className="result-name">{a.name}</div>
                                  <div className="result-sub">{cityCounts[a.name] || 0} compounds</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {compounds.length > 0 && (
                          <div className="result-category">
                            <div className="result-category-title">Compounds ({compounds.length})</div>
                            {compounds.map(c => (
                              <div key={c.id} className="result-item" onClick={() => handleSearchSelect(c, "project")}>
                                <div className="result-icon">🏢</div>
                                <div className="result-content">
                                  <div className="result-name">{c.name}</div>
                                  <div className="result-sub">📍 {c.city}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="search-reset-row" onClick={resetView}><span>🔄</span><span>Reset View & Filters</span></div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* ── Right controls ── */}
            <div className="right-controls">
              <div className="map-filters-container">
                {isAdminOrDev && (
                  <button
                    className="filter-pill"
                    style={{ borderColor: companyObj?.color, color: companyObj?.color }}
                    onClick={() => setShowCompanyModal(true)}
                  >
                    <span className="filter-pill-icon">{companyObj?.emoji || "🏢"}</span>
                    <span>{companyObj ? companyObj.name : "Select Company"}</span>
                  </button>
                )}

                {/* FIX 1: each pill wrapper has position:relative so the panel drops
                    directly below it via position:absolute + top:100% + left:0.
                    No JS coordinate tracking, no filterRefs, no filterPositions. */}
                {[
                  { key: "price", icon: "💰", label: "Price Range", badge: (filters.priceMin || filters.priceMax) ? 1 : 0 },
                  { key: "delivery", icon: "📅", label: "Delivery", badge: filters.delivery.size },
                  { key: "types", icon: "🏠", label: "Property Types", badge: filters.types.size },
                  { key: "more", icon: "⚙️", label: "More Filters", badge: activeFilterCount },
                ].map(({ key, icon, label, badge }) => (
                  <div key={key} style={{ position: "relative" }}>
                    <button
                      className={`filter-pill ${activePanel === key ? "active" : ""}`}
                      onClick={() => handleFilterClick(key)}
                    >
                      <span className="filter-pill-icon">{icon}</span>
                      <span>{label}</span>
                      {badge > 0 && <span className="filter-badge">{badge}</span>}
                    </button>

                    {activePanel === key && (
                      key === "price" ? (
                        <PriceFilterPanel
                          filters={filters}
                          setFilters={setFilters}
                          onClose={() => setActivePanel(null)}
                          onClear={() => clearPanel("price")}
                        />
                      ) : key === "delivery" ? (
                        <DeliveryFilterPanel
                          filters={filters}
                          toggleSet={toggleSet}
                          onClose={() => setActivePanel(null)}
                          onClear={() => clearPanel("delivery")}
                        />
                      ) : key === "types" ? (
                        <TypesFilterPanel
                          filters={filters}
                          toggleSet={toggleSet}
                          onClose={() => setActivePanel(null)}
                          onClear={() => clearPanel("types")}
                        />
                      ) : (
                        <MoreFilterPanel
                          filters={filters}
                          setFilters={setFilters}
                          toggleArray={toggleArray}
                          toggleSet={toggleSet}
                          onClose={() => setActivePanel(null)}
                          onClear={() => clearPanel("more")}
                        />
                      )
                    )}
                  </div>
                ))}
              </div>
              <button className="reset-under-search" onClick={resetView}>🔄 Reset View</button>
            </div>
          </div>

          {/* ── Bottom controls ── */}
          {!hideBottomControls && (
            <div
              className="bottom-badge"
              style={{ animation: showEarthIntro ? "none" : "fadeIn 0.8s ease-out 0.3s forwards", opacity: showEarthIntro ? 0 : 1 }}
            >
              <span>{badgeCompoundsCount}</span>&nbsp;Compounds&nbsp;•&nbsp;<span>{badgeAreasCount}</span>&nbsp;Areas
            </div>
          )}
          {!hideBottomControls && (
            <div
              className="list-view-pill"
              onClick={() => setSidebarOpen(prev => !prev)}
              style={{ animation: showEarthIntro ? "none" : "fadeIn 0.8s ease-out 0.6s forwards", opacity: showEarthIntro ? 0 : 1 }}
            >
              ☰ List View ({sidebarProjects.length})
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        {sidebarOpen && (
          <Sidebar
            title={selectedCity ? selectedCity.name : (companyObj ? `${companyObj.name} Compounds` : "All Compounds")}
            subtitle={`${sidebarProjects.length} results`}
            projects={sidebarProjects}
            selectedProject={selectedProject}
            onClose={() => setSidebarOpen(false)}
            onProjectClick={p => onProjectClick(p, { fly: true })}
          />
        )}

        {/* ── Project modal ── */}
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            company={companyObj}
          />
        )}
      </div>
    </div>
  );
}