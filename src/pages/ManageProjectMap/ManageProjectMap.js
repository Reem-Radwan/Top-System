// ManageProjectMapData.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import Sortable from "sortablejs";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import "./ManageProjectMap.css";
import {
  MOCK_COMPANIES,
  MOCK_PROJECT_MAP_DATA,
  CITY_OPTIONS,
} from "../../data/ManageProjectMapData";

let nextImgId = 9000;

// ── TOAST ──────────────────────────────────────────────────────────────────
function ToastContainer({ toasts }) {
  return (
    <div className="pjmap-toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`pjmap-toast${t.isError ? " pjmap-toast--error" : ""}`}>
          <div className="pjmap-toast__icon">
            {t.isError ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <div className="pjmap-toast__body">
            <strong>{t.title}</strong>
            {t.subtitle && <span>{t.subtitle}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── CUSTOM SELECT ──────────────────────────────────────────────────────────
function CustomSelect({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);
  const searchRef = useRef(null);

  const filtered = options.filter((o) =>
    !search || o.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = options.find((o) => o.value === value)?.label || null;

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current.focus(), 30);
    }
  }, [open]);

  function pick(val) {
    onChange(val);
    setOpen(false);
    setSearch("");
  }

  return (
    <div className={`pjmap-csel${open ? " pjmap-csel--open" : ""}`} ref={wrapperRef}>
      <button
        type="button"
        className="pjmap-csel__trigger"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
      >
        {/* FIX: placeholder text is a separate span with its own color class */}
        {selectedLabel ? (
          <span className="pjmap-csel__val">{selectedLabel}</span>
        ) : (
          <span className="pjmap-csel__placeholder">{placeholder}</span>
        )}
        <span className="pjmap-csel__arrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="pjmap-csel__dropdown">
          <input
            ref={searchRef}
            type="text"
            className="pjmap-csel__search"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="pjmap-csel__list">
            {filtered.length === 0 ? (
              <div className="pjmap-csel__empty">No results found</div>
            ) : (
              filtered.map((o) => (
                <div
                  key={o.value}
                  className={`pjmap-csel__opt${value === o.value ? " pjmap-csel__opt--selected" : ""}`}
                  onMouseDown={(e) => { e.preventDefault(); pick(o.value); }}
                >
                  {o.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAP ────────────────────────────────────────────────────────────────────
function MapEditor({ lat, lng, boundaryCoords, onMarkerChange, onBoundsChange }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markerRef = useRef(null);
  const drawnItems = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchTimeout = useRef(null);

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });

    if (leafletMap.current) {
      leafletMap.current.remove();
      leafletMap.current = null;
      markerRef.current = null;
      drawnItems.current = null;
    }

    const iLat = lat != null ? parseFloat(lat) : 30.0444;
    const iLng = lng != null ? parseFloat(lng) : 31.2357;

    const map = L.map(mapRef.current).setView([iLat, iLng], 12);
    leafletMap.current = map;

    L.tileLayer("https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(map);

    const drawn = new L.FeatureGroup();
    drawnItems.current = drawn;
    map.addLayer(drawn);

    map.addControl(
      new L.Control.Draw({
        draw: {
          polygon: { allowIntersection: false, showArea: true },
          marker: false,
          circle: false,
          circlemarker: false,
          polyline: false,
          rectangle: false,
        },
        edit: { featureGroup: drawn },
      })
    );

    const orangeIcon = L.divIcon({
      html: `<div style="width:18px;height:18px;background:#E8622A;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.4);"></div>`,
      className: "",
      iconAnchor: [9, 9],
    });

    const marker = L.marker([iLat, iLng], { draggable: true, icon: orangeIcon }).addTo(map);
    markerRef.current = marker;

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      onMarkerChange(pos.lat, pos.lng);
    });

    if (boundaryCoords && Array.isArray(boundaryCoords) && boundaryCoords.length > 0) {
      try {
        const poly = L.polygon(boundaryCoords, {
          color: "#E8622A",
          fillColor: "#E8622A",
          fillOpacity: 0.12,
          weight: 2,
        }).addTo(drawn);
        map.fitBounds(poly.getBounds());
        onBoundsChange(boundaryCoords);
      } catch (e) {
        console.error(e);
      }
    } else {
      onBoundsChange(null);
    }

    function extractBounds(layer) {
      if (layer && typeof layer.getLatLngs === "function") {
        let ll = layer.getLatLngs();
        if (Array.isArray(ll) && ll.length > 0 && Array.isArray(ll[0])) ll = ll[0];
        return ll.map((x) => [x.lat, x.lng]);
      }
      return null;
    }

    map.on(L.Draw.Event.CREATED, (e) => {
      drawn.clearLayers();
      drawn.addLayer(e.layer);
      onBoundsChange(extractBounds(e.layer));
    });

    map.on(L.Draw.Event.EDITED, (e) => {
      e.layers.eachLayer((layer) => {
        onBoundsChange(extractBounds(layer));
      });
    });

    map.on(L.Draw.Event.DELETED, () => {
      onBoundsChange(null);
    });

    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      leafletMap.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, boundaryCoords]);

  function handleMapSearch(e) {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchResults([]);
    if (query.trim().length < 3) return;

    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=10&location_bias=30.0444,31.2357&lang=en`
      )
        .then((r) => r.json())
        .then((data) => {
          if (data.features && data.features.length > 0) {
            setSearchResults(
              data.features.map((f) => {
                const p = f.properties;
                const c = f.geometry.coordinates;
                const dn = [p.name, p.street, p.city || p.state].filter(Boolean).join(", ");
                return { label: dn, lat: c[1], lng: c[0] };
              })
            );
          } else {
            return fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=eg&accept-language=en,ar`
            )
              .then((r) => r.json())
              .then((data) => {
                if (data && data.length > 0) {
                  setSearchResults(
                    data.map((item) => ({
                      label: item.display_name,
                      lat: parseFloat(item.lat),
                      lng: parseFloat(item.lon),
                    }))
                  );
                }
              });
          }
        })
        .catch(console.error);
    }, 350);
  }

  function selectResult(result) {
    const map = leafletMap.current;
    const marker = markerRef.current;
    if (map) map.setView([result.lat, result.lng], 16);
    if (marker) {
      marker.setLatLng([result.lat, result.lng]);
      onMarkerChange(result.lat, result.lng);
    }
    setSearchQuery(result.label);
    setSearchResults([]);
  }

  return (
    <div className="pjmap-map-wrapper">
      <div className="pjmap-map-search-container">
        <input
          type="text"
          className="pjmap-map-search-input"
          placeholder="Search city, street, or area…"
          value={searchQuery}
          onChange={handleMapSearch}
        />
        {searchResults.length > 0 && (
          <div className="pjmap-map-search-results">
            {searchResults.map((r, i) => (
              <div
                key={i}
                className="pjmap-search-result-item"
                onClick={() => selectResult(r)}
              >
                {r.label}
              </div>
            ))}
          </div>
        )}
      </div>
      <div id="pjmap-editor-map" ref={mapRef} />
    </div>
  );
}

// ── IMAGE GALLERY ──────────────────────────────────────────────────────────
function ImageGallery({ images, onImagesChange, showToast }) {
  const gridRef = useRef(null);
  const sortableRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current || images.length === 0) {
      if (sortableRef.current) {
        try { sortableRef.current.destroy(); } catch (_) {}
        sortableRef.current = null;
      }
      return;
    }

    if (sortableRef.current) {
      try { sortableRef.current.destroy(); } catch (_) {}
      sortableRef.current = null;
    }

    sortableRef.current = new Sortable(gridRef.current, {
      animation: 150,
      ghostClass: "pjmap-sortable-ghost",
      chosenClass: "pjmap-sortable-chosen",
      filter: ".pjmap-img__del",
      preventOnFilter: true,
      onEnd: () => {
        if (!gridRef.current) return;
        const cards = gridRef.current.querySelectorAll(".pjmap-img__card");
        const newOrder = Array.from(cards).map((card) => card.dataset.id);
        onImagesChange((prev) => {
          const map = Object.fromEntries(prev.map((img) => [String(img.id), img]));
          return newOrder.map((id, idx) => ({ ...map[id], sort: idx + 1 }));
        });
        cards.forEach((el, i) => {
          const num = el.querySelector(".pjmap-img__sort-num");
          if (num) num.textContent = i + 1;
        });
      },
    });

    return () => {
      if (sortableRef.current) {
        try { sortableRef.current.destroy(); } catch (_) {}
        sortableRef.current = null;
      }
    };
  }, [images, onImagesChange]);

  function handleDelete(imgId) {
    Swal.fire({
      title: "Delete this image?",
      text: "This action cannot be undone.",
      icon: "warning",
      iconColor: "#E8622A",
      showCancelButton: true,
      confirmButtonColor: "#E8622A",
      cancelButtonColor: "#7A7A7A",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        onImagesChange((prev) =>
          prev.filter((img) => img.id !== imgId).map((img, idx) => ({ ...img, sort: idx + 1 }))
        );
        showToast("Image deleted", "Removed from the gallery.");
      }
    });
  }

  function handleNewImages(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const total = files.length;
    let loaded = 0;
    const newImgs = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newImgs.push({ id: nextImgId++, sort: 0, url: ev.target.result });
        loaded++;
        if (loaded === total) {
          onImagesChange((prev) => {
            const combined = [...prev, ...newImgs].map((img, idx) => ({ ...img, sort: idx + 1 }));
            return combined;
          });
          showToast(`${total} image${total > 1 ? "s" : ""} added`, "Drag to reorder before saving.");
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }

  return (
    <div>
      <div className="pjmap-gallery-header">
        <div className="pjmap-gallery-header__left">
          <span>Gallery</span>
          <small>Drag cards to reorder · Click × to delete</small>
        </div>
        <button className="pjmap-add-image-btn" onClick={() => fileInputRef.current.click()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Add Images
        </button>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          multiple
          accept="image/*"
          onChange={handleNewImages}
        />
      </div>

      <div className="pjmap-img-grid" ref={gridRef}>
        {images.length === 0 ? (
          <div className="pjmap-img-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p>No images yet — click <strong>Add Images</strong> to upload.</p>
          </div>
        ) : (
          images
            .slice()
            .sort((a, b) => a.sort - b.sort)
            .map((img, idx) => (
              <div
                key={img.id}
                className="pjmap-img__card"
                data-id={String(img.id)}
              >
                {/* FIX 1: removed the word "image" from alt text — screen readers
                    already announce <img> as an image, making it redundant. */}
                <img src={img.url} alt={`Project gallery item ${idx + 1}`} loading="lazy" />
                <span className="pjmap-img__sort-num">{idx + 1}</span>
                <button
                  className="pjmap-img__del"
                  title="Delete image"
                  onClick={() => handleDelete(img.id)}
                >
                  &times;
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function ManageProjectMapData() {
  const [toasts, setToasts] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [removeVideoFlag, setRemoveVideoFlag] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const [centerLat, setCenterLat] = useState(null);
  const [centerLng, setCenterLng] = useState(null);
  const [boundaryCoords, setBoundaryCoords] = useState(null);
  const [currentBounds, setCurrentBounds] = useState(null);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const showEditor = !!projectId;

  const companyOptions = Object.entries(MOCK_COMPANIES).map(([id, co]) => ({
    value: id,
    label: co.name,
  }));

  const projectOptions = companyId
    ? MOCK_COMPANIES[companyId].projects.map((p) => ({ value: p.id, label: p.name }))
    : [];

  const cityOptions = CITY_OPTIONS.map((c) => ({ value: c, label: c }));

  function showToast(title, subtitle = "", isError = false) {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, subtitle, isError }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }

  function handleCompanyChange(val) {
    setCompanyId(val);
    setProjectId("");
  }

  function handleProjectChange(val) {
    setProjectId(val);
    if (!val) return;
    const data = MOCK_PROJECT_MAP_DATA[val];
    if (!data) return;

    setRemoveVideoFlag(false);
    setCity(data.city || CITY_OPTIONS[0]);
    setDescription(data.description || "");
    setVideoUrl(data.video_url || null);
    setCenterLat(data.center_lat);
    setCenterLng(data.center_lng);
    setBoundaryCoords(
      data.boundary_coordinates && data.boundary_coordinates.length > 0
        ? data.boundary_coordinates
        : null
    );
    setCurrentBounds(null);
    setImages(data.images ? [...data.images] : []);
    setMapKey((k) => k + 1);
  }

  function handleRemoveVideo(e) {
    e.preventDefault();
    Swal.fire({
      title: "Remove this video?",
      text: "The video will be cleared when you save.",
      icon: "warning",
      iconColor: "#E8622A",
      showCancelButton: true,
      confirmButtonColor: "#E8622A",
      cancelButtonColor: "#7A7A7A",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setRemoveVideoFlag(true);
        setVideoUrl(null);
        showToast("Video removed", "The video will be cleared on save.");
      }
    });
  }

  const handleMarkerChange = useCallback((lat, lng) => {
    setCenterLat(lat);
    setCenterLng(lng);
  }, []);

  const handleBoundsChange = useCallback((bounds) => {
    setCurrentBounds(bounds);
  }, []);

  function saveAllData() {
    if (!projectId) return showToast("No project selected", "Please choose a project first.", true);
    if (centerLat == null) return showToast("No map pin", "A centre pin is required on the map.", true);

    setSaving(true);
    setTimeout(() => {
      const d = MOCK_PROJECT_MAP_DATA[projectId];
      if (d) {
        d.city = city;
        d.description = description;
        d.center_lat = centerLat;
        d.center_lng = centerLng;
        if (currentBounds) d.boundary_coordinates = currentBounds;
        if (removeVideoFlag) d.video_url = null;
      }
      setSaving(false);
      showToast("Changes saved!", "Map data has been updated successfully.");
      handleProjectChange(projectId);
    }, 900);
  }

  return (
    <div className="pjmap-body">
      <ToastContainer toasts={toasts} />

      {/* FIX: added pjmap-header-wrap--padded for top padding */}
      <div className="pjmap-header-wrap">
        <header className="pjmap-header">
          <div className="pjmap-header__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="pjmap-header__text">
            <h1>Manage Project Map Data</h1>
            <p>Configure map pins, boundaries, descriptions &amp; media for each project</p>
          </div>
        </header>
      </div>

      <div className="pjmap-main">

        {/* ── STEP 1 ── */}
        <div className="pjmap-section-title">
          <div className="pjmap-step">1</div>
          <h2>Select Company &amp; Project</h2>
        </div>

        <div className="pjmap-card">
          <div className="pjmap-row pjmap-row--2col">
            <div className="pjmap-form-group">
              <label className="pjmap-label">
                Company <span className="pjmap-req">*</span>
              </label>
              <CustomSelect
                options={companyOptions}
                value={companyId}
                onChange={handleCompanyChange}
                placeholder="— Choose a company —"
              />
            </div>
            <div className="pjmap-form-group">
              <label className="pjmap-label">
                Project <span className="pjmap-req">*</span>
              </label>
              <CustomSelect
                options={projectOptions}
                value={projectId}
                onChange={handleProjectChange}
                placeholder="— Choose a project —"
              />
            </div>
          </div>
        </div>

        {showEditor && (
          <>
            {/* ── STEP 2 ── */}
            <div className="pjmap-section-title">
              <div className="pjmap-step">2</div>
              <h2>Project Details</h2>
            </div>

            <div className="pjmap-card">
              <div className="pjmap-row pjmap-row--2col" style={{ marginBottom: 24 }}>
                <div className="pjmap-form-group">
                  <label className="pjmap-label">
                    City / Location <span className="pjmap-req">*</span>
                  </label>
                  <CustomSelect
                    options={cityOptions}
                    value={city}
                    onChange={setCity}
                    placeholder="— Choose a city —"
                  />
                </div>
                <div className="pjmap-form-group">
                  {/* FIX: "(optional · MP4)" is now inline inside the label */}
                  <label className="pjmap-label">
                    Video File
                    <small className="pjmap-label__hint">(optional · MP4)</small>
                  </label>
                  <input
                    type="file"
                    className="pjmap-file-input"
                    accept="video/mp4,video/x-m4v,video/*"
                    onChange={() => {}}
                  />
                  {videoUrl && !removeVideoFlag && (
                    <small>
                      <span className="pjmap-video-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Video Active
                        {/* FIX 2: replaced <a href="#"> with a <button> styled as a link.
                            href="#" is not a valid navigable address and fails a11y rules. */}
                        <button
                          type="button"
                          className="pjmap-remove-video-btn"
                          onClick={handleRemoveVideo}
                        >
                          Remove
                        </button>
                      </span>
                    </small>
                  )}
                </div>
              </div>
              <div className="pjmap-row pjmap-row--1col">
                <div className="pjmap-form-group">
                  <label className="pjmap-label">Project Description</label>
                  <textarea
                    className="pjmap-textarea"
                    rows={4}
                    placeholder="Describe this project as it will appear in the map popup…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* ── STEP 3 ── */}
            <div className="pjmap-section-title">
              <div className="pjmap-step">3</div>
              <h2>Map Location &amp; Boundaries</h2>
            </div>

            <div className="pjmap-card">
              <p className="pjmap-map-hint">
                Drag the <strong>orange marker</strong> to set the project centre. Use the{" "}
                <strong>polygon tool</strong> (left toolbar) to draw boundary lines.
              </p>
              <MapEditor
                key={mapKey}
                lat={centerLat}
                lng={centerLng}
                boundaryCoords={boundaryCoords}
                onMarkerChange={handleMarkerChange}
                onBoundsChange={handleBoundsChange}
              />
            </div>

            {/* ── STEP 4 ── */}
            <div className="pjmap-section-title">
              <div className="pjmap-step">4</div>
              <h2>Project Images</h2>
            </div>

            <div className="pjmap-card">
              <ImageGallery
                images={images}
                onImagesChange={setImages}
                showToast={showToast}
              />
            </div>

            {/* ── SAVE BAR ── */}
            <div className="pjmap-save-bar">
              <p>
                All changes are stored per-project. Saving will update the map pin, description,
                boundaries &amp; media.
              </p>
              <button
                className="pjmap-btn-save"
                disabled={saving}
                onClick={saveAllData}
              >
                {saving ? (
                  <>
                    <span className="pjmap-spinner" />
                    Saving…
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Save All Map Data
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}