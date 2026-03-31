// // ─────────────────────────────────────────────────────────────────────────────
// // unitbrochuremanager.jsx
// //
// // • All original logic preserved: cascade filters, carousel, upload, delete,
// //   drag-and-drop reorder, toast, empty/idle states
// // • Every dropdown has an inline search field
// // • Bridge sync: upload/delete/reorder calls pushGalleryUpdate() →
// //   brochureBridge → masterplansdata.getUnitDetails + catalogedata.mockUnits
// //   both return the new images immediately
// // • Distinct CSS prefix: ubm2-
// // • Font: "Times New Roman", Times, serif
// // ─────────────────────────────────────────────────────────────────────────────

// import React, {
//   useState, useEffect, useRef, useCallback, useMemo,
// } from 'react';
// import Swal from 'sweetalert2';
// import './unitbrochuremanager.css';
// import {
//   ubmCompanies,
//   getProjects,
//   getBuildingTypes,
//   getUnitTypes,
//   getUnitModels,
//   getGallery,
//   pushGalleryUpdate,
//   subscribeToBrochureChanges,
// } from '../../data/unitbrochuremanagerdata';

// const CAN_MANAGE_LAYOUTS = true;   // set false → hide upload / delete / reorder
// const IS_COMPANY_SCOPED  = false;  // set true  → hide company dropdown

// // ─────────────────────────────────────────────────────────────────────────────
// // Toast
// // ─────────────────────────────────────────────────────────────────────────────
// function UbmToast({ type, message, onClose }) {
//   useEffect(() => {
//     const t = setTimeout(onClose, 4000);
//     return () => clearTimeout(t);
//   }, [onClose]);

//   const icons = {
//     success: 'fa-circle-check',
//     error:   'fa-circle-xmark',
//     warning: 'fa-triangle-exclamation',
//   };

//   return (
//     <div className={`ubm2-toast ubm2-t-${type}`}>
//       <i className={`ubm2-toast-ico fa-solid ${icons[type] || icons.success}`} />
//       <span className="ubm2-toast-msg">{message}</span>
//       <button className="ubm2-toast-cls" onClick={onClose}>&times;</button>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Searchable Select
// // ─────────────────────────────────────────────────────────────────────────────
// function UbmSelect({ label, value, options, onChange, disabled, placeholder = '— Select —' }) {
//   const [open,  setOpen]  = useState(false);
//   const [query, setQuery] = useState('');
//   const wrapRef           = useRef(null);
//   const inputRef          = useRef(null);

//   useEffect(() => {
//     const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
//     document.addEventListener('mousedown', h);
//     return () => document.removeEventListener('mousedown', h);
//   }, []);

//   useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     return q ? options.filter(o => String(o.label ?? o).toLowerCase().includes(q)) : options;
//   }, [options, query]);

//   const selectedLabel = useMemo(() => {
//     if (!value) return null;
//     const f = options.find(o => String(o.value ?? o) === String(value));
//     return f ? (f.label ?? f) : value;
//   }, [value, options]);

//   const toggle = () => { if (disabled) return; setOpen(p => !p); if (open) setQuery(''); };

//   const pick = (opt) => {
//     onChange(String(opt.value ?? opt));
//     setOpen(false);
//     setQuery('');
//   };

//   return (
//     <div className="ubm2-sel-wrap" ref={wrapRef}>
//       {label && <span className="ubm2-sel-label">{label}</span>}
//       <div
//         className={`ubm2-sel-trigger ${open ? 'ubm2-sel-open' : ''} ${disabled ? 'ubm2-sel-disabled' : ''}`}
//         onClick={toggle}
//         tabIndex={disabled ? -1 : 0}
//         onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggle(); }}
//         role="combobox"
//         aria-expanded={open}
//       >
//         <span className={`ubm2-sel-text ${!selectedLabel ? 'ubm2-placeholder' : ''}`}>
//           {selectedLabel ?? placeholder}
//         </span>
//         <i className={`ubm2-sel-caret fa-solid fa-chevron-down ${open ? 'ubm2-open' : ''}`} />
//       </div>

//       {open && (
//         <div className="ubm2-dd-panel" role="listbox">
//           <div className="ubm2-dd-search">
//             <i className="fa-solid fa-magnifying-glass" />
//             <input
//               ref={inputRef}
//               type="text"
//               placeholder="Search..."
//               value={query}
//               onChange={e => setQuery(e.target.value)}
//             />
//           </div>
//           <div className="ubm2-dd-opts">
//             {filtered.length > 0 ? filtered.map((opt, i) => {
//               const v = String(opt.value ?? opt);
//               const l = opt.label ?? opt;
//               const sel = v === String(value);
//               return (
//                 <div
//                   key={i}
//                   className={`ubm2-dd-opt ${sel ? 'ubm2-selected' : ''}`}
//                   onClick={() => pick(opt)}
//                   role="option"
//                   aria-selected={sel}
//                 >
//                   {sel && <i className="fa-solid fa-check" />}
//                   {l}
//                 </div>
//               );
//             }) : (
//               <div className="ubm2-dd-empty">No results</div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Carousel
// // ─────────────────────────────────────────────────────────────────────────────
// function UbmCarousel({ images, onDelete }) {
//   const vpRef             = useRef(null);
//   const [activeIdx, setActiveIdx] = useState(0);

//   const scrollTo = useCallback((idx) => {
//     const vp = vpRef.current;
//     if (!vp) return;
//     const slide = vp.children[idx];
//     if (slide) { vp.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' }); setActiveIdx(idx); }
//   }, []);

//   useEffect(() => {
//     const vp = vpRef.current;
//     if (!vp) return;
//     const h = () => {
//       const w = vp.clientWidth;
//       setActiveIdx(Math.round(vp.scrollLeft / (w || 1)));
//     };
//     vp.addEventListener('scroll', h, { passive: true });
//     return () => vp.removeEventListener('scroll', h);
//   }, []);

//   // Reset to slide 0 when images list changes (upload / delete)
//   useEffect(() => { setActiveIdx(0); if (vpRef.current) vpRef.current.scrollLeft = 0; }, [images]);

//   if (!images.length) return null;

//   return (
//     <div className="ubm2-gallery">
//       <section className="ubm2-carousel">
//         <ol className="ubm2-carousel-vp" ref={vpRef}>
//           {images.map((img) => (
//             <li key={img.id} className="ubm2-carousel-slide">
//               <img src={img.url} alt={img.label} className="ubm2-slide-img" />
//               {CAN_MANAGE_LAYOUTS && (
//                 <button className="ubm2-delete-btn" onClick={() => onDelete(img.id)} type="button">
//                   <i className="fa-solid fa-trash-can" /> Delete
//                 </button>
//               )}
//               <div className="ubm2-snapper" />
//             </li>
//           ))}
//         </ol>

//         {images.length > 1 && (
//           <>
//             <button className="ubm2-carousel-arrow ubm2-arrow-prev" onClick={() => scrollTo((activeIdx - 1 + images.length) % images.length)} type="button">
//               <i className="fa-solid fa-chevron-left" />
//             </button>
//             <button className="ubm2-carousel-arrow ubm2-arrow-next" onClick={() => scrollTo((activeIdx + 1) % images.length)} type="button">
//               <i className="fa-solid fa-chevron-right" />
//             </button>
//           </>
//         )}

//         <nav className="ubm2-carousel-nav">
//           <ol className="ubm2-nav-list">
//             {images.map((_, i) => (
//               <li key={i}>
//                 <button
//                   className={`ubm2-nav-dot ${i === activeIdx ? 'ubm2-dot-active' : ''}`}
//                   onClick={() => scrollTo(i)}
//                   type="button"
//                 >
//                   {i + 1}
//                 </button>
//               </li>
//             ))}
//           </ol>
//         </nav>
//       </section>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Sort Grid (HTML5 drag-and-drop)
// // ─────────────────────────────────────────────────────────────────────────────
// function UbmSortGrid({ images, onSave, onCancel }) {
//   const [items, setItems] = useState([...images]);
//   const dragIdx           = useRef(null);

//   const onDragStart = (i) => { dragIdx.current = i; };
//   const onDragOver  = (e, i) => {
//     e.preventDefault();
//     if (dragIdx.current === null || dragIdx.current === i) return;
//     const next = [...items];
//     const [moved] = next.splice(dragIdx.current, 1);
//     next.splice(i, 0, moved);
//     dragIdx.current = i;
//     setItems(next);
//   };
//   const onDragEnd = () => { dragIdx.current = null; };

//   return (
//     <div className="ubm2-sort-wrap">
//       <div className="ubm2-sort-alert">
//         <i className="fa-solid fa-info-circle" />
//         Drag and drop images to reorder. Click <strong style={{ marginLeft: 3 }}>Save Order</strong> when finished.
//       </div>
//       <div className="ubm2-sort-grid">
//         {items.map((img, i) => (
//           <div
//             key={img.id}
//             className="ubm2-sort-item"
//             draggable
//             onDragStart={() => onDragStart(i)}
//             onDragOver={(e) => onDragOver(e, i)}
//             onDragEnd={onDragEnd}
//           >
//             <div className="ubm2-sort-handle">
//               <i className="fa-solid fa-grip-vertical" />
//             </div>
//             <img src={img.url} alt={img.label} />
//           </div>
//         ))}
//       </div>
//       <div className="ubm2-sort-actions">
//         <button className="ubm2-btn ubm2-btn-secondary" onClick={onCancel} type="button">Cancel</button>
//         <button className="ubm2-btn ubm2-btn-primary"   onClick={() => onSave(items)} type="button">
//           <i className="fa-solid fa-save" /> Save Order
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Main
// // ─────────────────────────────────────────────────────────────────────────────
// export default function UnitBrochureManager() {
//   // ── Filter state ─────────────────────────────────────────────────────────────
//   const [selCompany,  setSelCompany]  = useState('');
//   const [selProject,  setSelProject]  = useState('');
//   const [selBType,    setSelBType]    = useState('');
//   const [selUType,    setSelUType]    = useState('');
//   const [selUModel,   setSelUModel]   = useState('');

//   // ── Derived dropdown options ──────────────────────────────────────────────────
//   const projects  = useMemo(() => getProjects(selCompany),                                [selCompany]);
//   const bTypes    = useMemo(() => getBuildingTypes(selCompany, selProject),               [selCompany, selProject]);
//   const uTypes    = useMemo(() => getUnitTypes(selCompany, selProject, selBType),         [selCompany, selProject, selBType]);
//   const uModels   = useMemo(() => getUnitModels(selCompany, selProject, selBType, selUType), [selCompany, selProject, selBType, selUType]);

//   // ── Gallery / UI state ────────────────────────────────────────────────────────
//   const [galleryImages, setGalleryImages] = useState([]);
//   const [showSort,      setShowSort]      = useState(false);
//   const [uploading,     setUploading]     = useState(false);
//   const fileInputRef                      = useRef(null);
//   const [toast,         setToast]         = useState(null);

//   const showToast = useCallback((type, message) => setToast({ type, message }), []);

//   // ── Fully selected ────────────────────────────────────────────────────────────
//   const ready = !!(selCompany && selProject && selBType && selUType && selUModel);

//   // ── Load gallery when fully selected ─────────────────────────────────────────
//   useEffect(() => {
//     if (!ready) { setGalleryImages([]); return; }
//     setGalleryImages(getGallery(selCompany, selProject, selBType, selUType, selUModel));
//     setShowSort(false);
//   }, [ready, selCompany, selProject, selBType, selUType, selUModel]);

//   // ── Subscribe to bridge changes made by other pages ──────────────────────────
//   // (e.g. if masterplans.js somehow writes back, the manager reflects it)
//   useEffect(() => {
//     if (!ready) return;
//     const unsub = subscribeToBrochureChanges(() => {
//       setGalleryImages(getGallery(selCompany, selProject, selBType, selUType, selUModel));
//     });
//     return unsub;
//   }, [ready, selCompany, selProject, selBType, selUType, selUModel]);

//   // ── Cascade reset helpers ─────────────────────────────────────────────────────
//   const handleCompany = v => { setSelCompany(v); setSelProject(''); setSelBType(''); setSelUType(''); setSelUModel(''); setShowSort(false); };
//   const handleProject = v => { setSelProject(v); setSelBType('');  setSelUType(''); setSelUModel(''); setShowSort(false); };
//   const handleBType   = v => { setSelBType(v);   setSelUType(''); setSelUModel(''); setShowSort(false); };
//   const handleUType   = v => { setSelUType(v);   setSelUModel(''); setShowSort(false); };

//   // ── Helper: push images to bridge + local state ───────────────────────────────
//   const commitImages = useCallback((newImages) => {
//     setGalleryImages(newImages);
//     pushGalleryUpdate(selCompany, selProject, selBType, selUType, selUModel, newImages);
//   }, [selCompany, selProject, selBType, selUType, selUModel]);

//   // ── Delete ────────────────────────────────────────────────────────────────────
//   const handleDelete = useCallback((id) => {
//     Swal.fire({
//       title: 'Delete this layout?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#e11d48',
//       confirmButtonText: 'Yes, delete',
//     }).then(result => {
//       if (!result.isConfirmed) return;
//       const next = galleryImages.filter(img => img.id !== id);
//       commitImages(next);
//       showToast('success', 'Image deleted.');
//     });
//   }, [galleryImages, commitImages, showToast]);

//   // ── Upload (mock — FileReader object URLs, same async pattern as original) ────
//   const handleUpload = useCallback(() => {
//     const files = fileInputRef.current?.files;
//     if (!files || files.length === 0) { showToast('warning', 'Please select files first.'); return; }
//     setUploading(true);

//     Promise.all(
//       Array.from(files).map(file =>
//         new Promise(resolve => {
//           const r = new FileReader();
//           r.onload = e => resolve({ id: Date.now() + Math.random(), url: e.target.result, label: file.name });
//           r.readAsDataURL(file);
//         })
//       )
//     ).then(newImgs => {
//       const next = [...galleryImages, ...newImgs];
//       commitImages(next);
//       if (fileInputRef.current) fileInputRef.current.value = '';
//       setUploading(false);
//       showToast('success', `${newImgs.length} image(s) uploaded. Brochure synced to Catalog & Masterplans.`);
//     });
//   }, [galleryImages, commitImages, showToast]);

//   // ── Sort save ─────────────────────────────────────────────────────────────────
//   const handleSortSave = useCallback((reordered) => {
//     commitImages(reordered);
//     setShowSort(false);
//     showToast('success', 'Order updated. Changes synced to Catalog & Masterplans.');
//   }, [commitImages, showToast]);

//   const hasImages = galleryImages.length > 0;

//   // ── Option arrays ─────────────────────────────────────────────────────────────
//   const coOpts  = ubmCompanies.map(c => ({ value: c.id,  label: c.name }));
//   const prOpts  = projects.map(p     => ({ value: p.id,  label: p.name }));

//   return (
//     <div className="ubm2-root">

//       {toast && (
//         <UbmToast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
//       )}

//       {/* ── Header ────────────────────────────────────────────────────────────── */}
//       <header className="ubm2-header">
//         <div className="ubm2-header-inner">
//           <div className="ubm2-header-icon">
//             <i className="fa-regular fa-images" />
//           </div>
//           <div>
//             <h1 className="ubm2-header-title">Brochure Manager</h1>
//             <p className="ubm2-header-sub">Upload and manage unit layout brochures by model</p>
//           </div>
//         </div>
//       </header>

//       {/* ── Filters ───────────────────────────────────────────────────────────── */}
//       <section className="ubm2-filters">
//         <div className="ubm2-filter-grid">

//           {!IS_COMPANY_SCOPED && (
//             <UbmSelect
//               label="Company"
//               value={selCompany}
//               options={coOpts}
//               onChange={handleCompany}
//               disabled={false}
//               placeholder="— Select Company —"
//             />
//           )}

//           <UbmSelect
//             label="Project"
//             value={selProject}
//             options={prOpts}
//             onChange={handleProject}
//             disabled={!selCompany}
//             placeholder="— Select Project —"
//           />

//           <UbmSelect
//             label="Building Type"
//             value={selBType}
//             options={bTypes}
//             onChange={handleBType}
//             disabled={!selProject}
//             placeholder="— Select Building Type —"
//           />

//           <UbmSelect
//             label="Unit Type"
//             value={selUType}
//             options={uTypes}
//             onChange={handleUType}
//             disabled={!selBType}
//             placeholder="— Select Unit Type —"
//           />

//           <UbmSelect
//             label="Unit Model"
//             value={selUModel}
//             options={uModels}
//             onChange={setSelUModel}
//             disabled={!selUType}
//             placeholder="— Select Unit Model —"
//           />
//         </div>
//       </section>

//       {/* ── Body ──────────────────────────────────────────────────────────────── */}
//       <main className="ubm2-body">

//         {/* Idle */}
//         {!ready && (
//           <div className="ubm2-idle">
//             <div className="ubm2-idle-circle">
//               <i className="fa-regular fa-images" />
//             </div>
//             <h4>Select all filters to view layouts</h4>
//             <p>Choose company, project, building type, unit type and model above.</p>
//           </div>
//         )}

//         {ready && (
//           <>
//             {/* Management bar */}
//             <div className="ubm2-mgmt-bar">
//               <div className="ubm2-mgmt-title">
//                 <i className="fa-solid fa-layer-group" style={{ color: 'var(--ubm2-orange)' }} />
//                 Layouts for <span className="ubm2-model-name">{selUModel}</span>
//               </div>

//               {CAN_MANAGE_LAYOUTS && (
//                 <div className="ubm2-bar-actions">
//                   <button
//                     type="button"
//                     className={`ubm2-btn ubm2-btn-outline ${showSort ? 'ubm2-active' : ''}`}
//                     onClick={() => setShowSort(p => !p)}
//                     disabled={!hasImages}
//                   >
//                     <i className="fa-solid fa-arrow-down-up-across-line" />
//                     {showSort ? 'Exit Reorder' : 'Reorder'}
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Upload area — visible when not in sort mode */}
//             {CAN_MANAGE_LAYOUTS && !showSort && (
//               <div className="ubm2-upload">
//                 <div className="ubm2-upload-title">
//                   <i className="fa-solid fa-cloud-arrow-up" />
//                   Upload New Layouts
//                 </div>
//                 <div className="ubm2-upload-row">
//                   <input
//                     type="file"
//                     className="ubm2-file-input"
//                     multiple
//                     accept="image/*"
//                     ref={fileInputRef}
//                   />
//                   <button
//                     type="button"
//                     className="ubm2-btn ubm2-btn-primary"
//                     onClick={handleUpload}
//                     disabled={uploading}
//                   >
//                     <i className={`fa-solid ${uploading ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up'}`} />
//                     {uploading ? 'Uploading…' : 'Upload'}
//                   </button>
//                 </div>
//                 {uploading && (
//                   <div className="ubm2-upload-spinner">
//                     <i className="fa-solid fa-spinner fa-spin" /> Processing files…
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Sort grid */}
//             {showSort && (
//               <UbmSortGrid
//                 images={galleryImages}
//                 onSave={handleSortSave}
//                 onCancel={() => setShowSort(false)}
//               />
//             )}

//             {/* Carousel */}
//             {!showSort && hasImages && (
//               <UbmCarousel images={galleryImages} onDelete={handleDelete} />
//             )}

//             {/* Empty */}
//             {!showSort && !hasImages && (
//               <div className="ubm2-empty">
//                 <i className="fa-regular fa-image ubm2-empty-icon" />
//                 <h4>No layouts found</h4>
//                 <p>Upload images above to add brochures for this unit model.</p>
//               </div>
//             )}
//           </>
//         )}
//       </main>
//     </div>
//   );
// }






// ─────────────────────────────────────────────────────────────────────────────
// unitbrochuremanager.jsx
//
// • All original logic preserved: cascade filters, carousel, upload, delete,
//   drag-and-drop reorder, toast, empty/idle states
// • Every dropdown has an inline search field
// • Bridge sync: upload/delete/reorder calls pushGalleryUpdate() →
//   brochureBridge → masterplansdata.getUnitDetails + catalogedata.mockUnits
//   both return the new images immediately
// • Distinct CSS prefix: ubm2-
// • Font: "Times New Roman", Times, serif
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  useState, useEffect, useRef, useCallback, useMemo,
} from 'react';
import Swal from 'sweetalert2';
import './unitbrochuremanager.css';
import {
  ubmCompanies,
  getProjects,
  getBuildingTypes,
  getUnitTypes,
  getUnitModels,
  getGallery,
  pushGalleryUpdate,
  subscribeToBrochureChanges,
} from '../../data/unitbrochuremanagerdata';

const CAN_MANAGE_LAYOUTS = true;   // set false → hide upload / delete / reorder
const IS_COMPANY_SCOPED  = false;  // set true  → hide company dropdown

// ─────────────────────────────────────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────────────────────────────────────
function UbmToast({ type, message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const icons = {
    success: 'fa-circle-check',
    error:   'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
  };

  return (
    <div className={`ubm2-toast ubm2-t-${type}`}>
      <i className={`ubm2-toast-ico fa-solid ${icons[type] || icons.success}`} />
      <span className="ubm2-toast-msg">{message}</span>
      <button className="ubm2-toast-cls" onClick={onClose}>&times;</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Searchable Select
// ─────────────────────────────────────────────────────────────────────────────
function UbmSelect({ label, value, options, onChange, disabled, placeholder = '— Select —' }) {
  const [open,  setOpen]  = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef           = useRef(null);
  const inputRef          = useRef(null);

  useEffect(() => {
    const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter(o => String(o.label ?? o).toLowerCase().includes(q)) : options;
  }, [options, query]);

  const selectedLabel = useMemo(() => {
    if (!value) return null;
    const f = options.find(o => String(o.value ?? o) === String(value));
    return f ? (f.label ?? f) : value;
  }, [value, options]);

  const toggle = () => { if (disabled) return; setOpen(p => !p); if (open) setQuery(''); };

  const pick = (opt) => {
    onChange(String(opt.value ?? opt));
    setOpen(false);
    setQuery('');
  };

  return (
    <div className="ubm2-sel-wrap" ref={wrapRef}>
      {label && <span className="ubm2-sel-label">{label}</span>}
      <div
        className={`ubm2-sel-trigger ${open ? 'ubm2-sel-open' : ''} ${disabled ? 'ubm2-sel-disabled' : ''}`}
        onClick={toggle}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggle(); }}
        role="combobox"
        aria-expanded={open}
        aria-controls="ubm2-dd-list"
        aria-haspopup="listbox"
      >
        <span className={`ubm2-sel-text ${!selectedLabel ? 'ubm2-placeholder' : ''}`}>
          {selectedLabel ?? placeholder}
        </span>
        <i className={`ubm2-sel-caret fa-solid fa-chevron-down ${open ? 'ubm2-open' : ''}`} />
      </div>

      {open && (
        <div id="ubm2-dd-list" className="ubm2-dd-panel" role="listbox">
          <div className="ubm2-dd-search">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="ubm2-dd-opts">
            {filtered.length > 0 ? filtered.map((opt, i) => {
              const v = String(opt.value ?? opt);
              const l = opt.label ?? opt;
              const sel = v === String(value);
              return (
                <div
                  key={i}
                  className={`ubm2-dd-opt ${sel ? 'ubm2-selected' : ''}`}
                  onClick={() => pick(opt)}
                  role="option"
                  aria-selected={sel}
                >
                  {sel && <i className="fa-solid fa-check" />}
                  {l}
                </div>
              );
            }) : (
              <div className="ubm2-dd-empty">No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Carousel
// ─────────────────────────────────────────────────────────────────────────────
function UbmCarousel({ images, onDelete }) {
  const vpRef             = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollTo = useCallback((idx) => {
    const vp = vpRef.current;
    if (!vp) return;
    const slide = vp.children[idx];
    if (slide) { vp.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' }); setActiveIdx(idx); }
  }, []);

  useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const h = () => {
      const w = vp.clientWidth;
      setActiveIdx(Math.round(vp.scrollLeft / (w || 1)));
    };
    vp.addEventListener('scroll', h, { passive: true });
    return () => vp.removeEventListener('scroll', h);
  }, []);

  // Reset to slide 0 when images list changes (upload / delete)
  useEffect(() => { setActiveIdx(0); if (vpRef.current) vpRef.current.scrollLeft = 0; }, [images]);

  if (!images.length) return null;

  return (
    <div className="ubm2-gallery">
      <section className="ubm2-carousel">
        <ol className="ubm2-carousel-vp" ref={vpRef}>
          {images.map((img) => (
            <li key={img.id} className="ubm2-carousel-slide">
              <img src={img.url} alt={img.label} className="ubm2-slide-img" />
              {CAN_MANAGE_LAYOUTS && (
                <button className="ubm2-delete-btn" onClick={() => onDelete(img.id)} type="button">
                  <i className="fa-solid fa-trash-can" /> Delete
                </button>
              )}
              <div className="ubm2-snapper" />
            </li>
          ))}
        </ol>

        {images.length > 1 && (
          <>
            <button className="ubm2-carousel-arrow ubm2-arrow-prev" onClick={() => scrollTo((activeIdx - 1 + images.length) % images.length)} type="button">
              <i className="fa-solid fa-chevron-left" />
            </button>
            <button className="ubm2-carousel-arrow ubm2-arrow-next" onClick={() => scrollTo((activeIdx + 1) % images.length)} type="button">
              <i className="fa-solid fa-chevron-right" />
            </button>
          </>
        )}

        <nav className="ubm2-carousel-nav">
          <ol className="ubm2-nav-list">
            {images.map((_, i) => (
              <li key={i}>
                <button
                  className={`ubm2-nav-dot ${i === activeIdx ? 'ubm2-dot-active' : ''}`}
                  onClick={() => scrollTo(i)}
                  type="button"
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sort Grid (HTML5 drag-and-drop)
// ─────────────────────────────────────────────────────────────────────────────
function UbmSortGrid({ images, onSave, onCancel }) {
  const [items, setItems] = useState([...images]);
  const dragIdx           = useRef(null);

  const onDragStart = (i) => { dragIdx.current = i; };
  const onDragOver  = (e, i) => {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === i) return;
    const next = [...items];
    const [moved] = next.splice(dragIdx.current, 1);
    next.splice(i, 0, moved);
    dragIdx.current = i;
    setItems(next);
  };
  const onDragEnd = () => { dragIdx.current = null; };

  return (
    <div className="ubm2-sort-wrap">
      <div className="ubm2-sort-alert">
        <i className="fa-solid fa-info-circle" />
        Drag and drop images to reorder. Click <strong style={{ marginLeft: 3 }}>Save Order</strong> when finished.
      </div>
      <div className="ubm2-sort-grid">
        {items.map((img, i) => (
          <div
            key={img.id}
            className="ubm2-sort-item"
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={(e) => onDragOver(e, i)}
            onDragEnd={onDragEnd}
          >
            <div className="ubm2-sort-handle">
              <i className="fa-solid fa-grip-vertical" />
            </div>
            <img src={img.url} alt={img.label} />
          </div>
        ))}
      </div>
      <div className="ubm2-sort-actions">
        <button className="ubm2-btn ubm2-btn-secondary" onClick={onCancel} type="button">Cancel</button>
        <button className="ubm2-btn ubm2-btn-primary"   onClick={() => onSave(items)} type="button">
          <i className="fa-solid fa-save" /> Save Order
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
export default function UnitBrochureManager() {
  // ── Filter state ─────────────────────────────────────────────────────────────
  const [selCompany,  setSelCompany]  = useState('');
  const [selProject,  setSelProject]  = useState('');
  const [selBType,    setSelBType]    = useState('');
  const [selUType,    setSelUType]    = useState('');
  const [selUModel,   setSelUModel]   = useState('');

  // ── Derived dropdown options ──────────────────────────────────────────────────
  const projects  = useMemo(() => getProjects(selCompany),                                [selCompany]);
  const bTypes    = useMemo(() => getBuildingTypes(selCompany, selProject),               [selCompany, selProject]);
  const uTypes    = useMemo(() => getUnitTypes(selCompany, selProject, selBType),         [selCompany, selProject, selBType]);
  const uModels   = useMemo(() => getUnitModels(selCompany, selProject, selBType, selUType), [selCompany, selProject, selBType, selUType]);

  // ── Gallery / UI state ────────────────────────────────────────────────────────
  const [galleryImages, setGalleryImages] = useState([]);
  const [showSort,      setShowSort]      = useState(false);
  const [uploading,     setUploading]     = useState(false);
  const fileInputRef                      = useRef(null);
  const [toast,         setToast]         = useState(null);

  const showToast = useCallback((type, message) => setToast({ type, message }), []);

  // ── Fully selected ────────────────────────────────────────────────────────────
  const ready = !!(selCompany && selProject && selBType && selUType && selUModel);

  // ── Load gallery when fully selected ─────────────────────────────────────────
  useEffect(() => {
    if (!ready) { setGalleryImages([]); return; }
    setGalleryImages(getGallery(selCompany, selProject, selBType, selUType, selUModel));
    setShowSort(false);
  }, [ready, selCompany, selProject, selBType, selUType, selUModel]);

  // ── Subscribe to bridge changes made by other pages ──────────────────────────
  useEffect(() => {
    if (!ready) return;
    const unsub = subscribeToBrochureChanges(() => {
      setGalleryImages(getGallery(selCompany, selProject, selBType, selUType, selUModel));
    });
    return unsub;
  }, [ready, selCompany, selProject, selBType, selUType, selUModel]);

  // ── Cascade reset helpers ─────────────────────────────────────────────────────
  const handleCompany = v => { setSelCompany(v); setSelProject(''); setSelBType(''); setSelUType(''); setSelUModel(''); setShowSort(false); };
  const handleProject = v => { setSelProject(v); setSelBType('');  setSelUType(''); setSelUModel(''); setShowSort(false); };
  const handleBType   = v => { setSelBType(v);   setSelUType(''); setSelUModel(''); setShowSort(false); };
  const handleUType   = v => { setSelUType(v);   setSelUModel(''); setShowSort(false); };

  // ── Helper: push images to bridge + local state ───────────────────────────────
  const commitImages = useCallback((newImages) => {
    setGalleryImages(newImages);
    pushGalleryUpdate(selCompany, selProject, selBType, selUType, selUModel, newImages);
  }, [selCompany, selProject, selBType, selUType, selUModel]);

  // ── Delete ────────────────────────────────────────────────────────────────────
  const handleDelete = useCallback((id) => {
    Swal.fire({
      title: 'Delete this layout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      confirmButtonText: 'Yes, delete',
    }).then(result => {
      if (!result.isConfirmed) return;
      const next = galleryImages.filter(img => img.id !== id);
      commitImages(next);
      showToast('success', 'Image deleted successfully.');
    });
  }, [galleryImages, commitImages, showToast]);

  // ── Upload (mock — FileReader object URLs) ────────────────────────────────────
  const handleUpload = useCallback(() => {
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) { showToast('warning', 'Please select files first.'); return; }
    setUploading(true);

    Promise.all(
      Array.from(files).map(file =>
        new Promise(resolve => {
          const r = new FileReader();
          r.onload = e => resolve({ id: Date.now() + Math.random(), url: e.target.result, label: file.name });
          r.readAsDataURL(file);
        })
      )
    ).then(newImgs => {
      const next = [...galleryImages, ...newImgs];
      commitImages(next);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploading(false);
      showToast('success', `${newImgs.length} image(s) uploaded successfully.`);
    });
  }, [galleryImages, commitImages, showToast]);

  // ── Sort save ─────────────────────────────────────────────────────────────────
  const handleSortSave = useCallback((reordered) => {
    commitImages(reordered);
    setShowSort(false);
    showToast('success', 'Order updated successfully.');
  }, [commitImages, showToast]);

  const hasImages = galleryImages.length > 0;

  // ── Option arrays ─────────────────────────────────────────────────────────────
  const coOpts  = ubmCompanies.map(c => ({ value: c.id,  label: c.name }));
  const prOpts  = projects.map(p     => ({ value: p.id,  label: p.name }));

  return (
    <div className="ubm2-root">

      {toast && (
        <UbmToast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <header className="ubm2-header">
        <div className="ubm2-header-inner">
          <div className="ubm2-header-icon">
            <i className="fa-regular fa-images" />
          </div>
          <div>
            <h1 className="ubm2-header-title">Brochure Manager</h1>
            <p className="ubm2-header-sub">Upload and manage unit layout brochures by model</p>
          </div>
        </div>
      </header>

      {/* ── Filters ───────────────────────────────────────────────────────────── */}
      <section className="ubm2-filters">
        <div className="ubm2-filter-grid">

          {!IS_COMPANY_SCOPED && (
            <UbmSelect
              label="Company"
              value={selCompany}
              options={coOpts}
              onChange={handleCompany}
              disabled={false}
              placeholder="— Select Company —"
            />
          )}

          <UbmSelect
            label="Project"
            value={selProject}
            options={prOpts}
            onChange={handleProject}
            disabled={!selCompany}
            placeholder="— Select Project —"
          />

          <UbmSelect
            label="Building Type"
            value={selBType}
            options={bTypes}
            onChange={handleBType}
            disabled={!selProject}
            placeholder="— Select Building Type —"
          />

          <UbmSelect
            label="Unit Type"
            value={selUType}
            options={uTypes}
            onChange={handleUType}
            disabled={!selBType}
            placeholder="— Select Unit Type —"
          />

          <UbmSelect
            label="Unit Model"
            value={selUModel}
            options={uModels}
            onChange={setSelUModel}
            disabled={!selUType}
            placeholder="— Select Unit Model —"
          />
        </div>
      </section>

      {/* ── Body ──────────────────────────────────────────────────────────────── */}
      <main className="ubm2-body">

        {/* Idle */}
        {!ready && (
          <div className="ubm2-idle">
            <div className="ubm2-idle-circle">
              <i className="fa-regular fa-images" />
            </div>
            <h4>Select all filters to view layouts</h4>
            <p>Choose company, project, building type, unit type and model above.</p>
          </div>
        )}

        {ready && (
          <>
            {/* Management bar */}
            <div className="ubm2-mgmt-bar">
              <div className="ubm2-mgmt-title">
                <i className="fa-solid fa-layer-group" style={{ color: 'var(--ubm2-orange)' }} />
                Layouts for <span className="ubm2-model-name">{selUModel}</span>
              </div>

              {CAN_MANAGE_LAYOUTS && (
                <div className="ubm2-bar-actions">
                  <button
                    type="button"
                    className={`ubm2-btn ubm2-btn-outline ${showSort ? 'ubm2-active' : ''}`}
                    onClick={() => setShowSort(p => !p)}
                    disabled={!hasImages}
                  >
                    <i className="fa-solid fa-arrow-down-up-across-line" />
                    {showSort ? 'Exit Reorder' : 'Reorder'}
                  </button>
                </div>
              )}
            </div>

            {/* Upload area — visible when not in sort mode */}
            {CAN_MANAGE_LAYOUTS && !showSort && (
              <div className="ubm2-upload">
                <div className="ubm2-upload-title">
                  <i className="fa-solid fa-cloud-arrow-up" />
                  Upload New Layouts
                </div>
                <div className="ubm2-upload-row">
                  <input
                    type="file"
                    className="ubm2-file-input"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                  />
                  <button
                    type="button"
                    className="ubm2-btn ubm2-btn-primary"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    <i className={`fa-solid ${uploading ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up'}`} />
                    {uploading ? 'Uploading…' : 'Upload'}
                  </button>
                </div>
                {uploading && (
                  <div className="ubm2-upload-spinner">
                    <i className="fa-solid fa-spinner fa-spin" /> Processing files…
                  </div>
                )}
              </div>
            )}

            {/* Sort grid */}
            {showSort && (
              <UbmSortGrid
                images={galleryImages}
                onSave={handleSortSave}
                onCancel={() => setShowSort(false)}
              />
            )}

            {/* Carousel */}
            {!showSort && hasImages && (
              <UbmCarousel images={galleryImages} onDelete={handleDelete} />
            )}

            {/* Empty */}
            {!showSort && !hasImages && (
              <div className="ubm2-empty">
                <i className="fa-regular fa-image ubm2-empty-icon" />
                <h4>No layouts found</h4>
                <p>Upload images above to add brochures for this unit model.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}