// ─────────────────────────────────────────────────────────────────────────────
// brochureBridge.js
//
// Shared singleton — persists to sessionStorage so data survives full-page
// navigations (window.location.href) between UBM, masterplans, and catalog.
//
// unitbrochuremanager.jsx  →  writes here  (upload / delete / reorder)
// masterplansdata.js       →  reads here   (getUnitDetails layout_images)
// catalogedata.js          →  reads here   (mockUnits layout_images)
// masterplans.js           →  subscribes   (re-renders tooltip brochure)
// cataloge.js              →  subscribes   (re-renders LayoutModal)
//
// KEY FORMAT:   "<unit_code>"   e.g.  "SUN-001", "URB-101", "SEA-505"
// For model-level keys (no single unit_code):
//               "<company_id>|<project_id>|<building_type>|<unit_type>|<unit_model>"
// ─────────────────────────────────────────────────────────────────────────────

const SESSION_KEY = '__brochureBridgeStore__';

// ── Persist helpers ───────────────────────────────────────────────────────────
function _loadFromSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {};
}

function _saveToSession(store) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(store));
  } catch (_) {}
}

// Live image store: key (string) → Image[]  { id, url, label }
// Initialised from sessionStorage so uploads survive page navigations.
export const brochureImageStore = _loadFromSession();

// Subscriber list (in-memory only — re-subscribed fresh on each page load)
const _subscribers = [];

/**
 * Get images for a unit_code (or model key).
 * Returns null if not yet overridden (caller should fall back to static data).
 */
export function getBridgeImages(key) {
  return brochureImageStore[key] !== undefined ? brochureImageStore[key] : null;
}

/**
 * Set images for a key. Called by UnitBrochureManager on upload/delete/reorder.
 * Writes through to sessionStorage so the data survives navigation.
 * Notifies all subscribers.
 */
export function setBridgeImages(key, images) {
  brochureImageStore[key] = images;
  _saveToSession(brochureImageStore);
  _notifyAll(key);
}

/**
 * Seed a key with images only if it hasn't been set yet by the manager.
 * Called by masterplansdata / catalogedata / unitbrochuremanagerdata on first
 * data load so subscribers always get live data even before the manager has
 * touched anything.
 *
 * NOTE: We do NOT overwrite sessionStorage values with static seed data —
 * if the key already exists (written by UBM on a previous page), we keep
 * the live value so uploads persist across navigations.
 */
export function seedBridgeImages(key, images) {
  if (brochureImageStore[key] === undefined) {
    brochureImageStore[key] = [...images];
    // Do NOT persist seeds to sessionStorage — only manager writes persist.
    // This avoids clobbering a live upload with stale static data on next load.
  }
}

/**
 * Subscribe to any image change.
 * fn receives the changed key.
 * Returns an unsubscribe function.
 */
export function subscribeToBrochureChanges(fn) {
  _subscribers.push(fn);
  return () => {
    const i = _subscribers.indexOf(fn);
    if (i !== -1) _subscribers.splice(i, 1);
  };
}

function _notifyAll(key) {
  _subscribers.forEach(fn => {
    try { fn(key); } catch (_) {}
  });
}

// ─── MODEL KEY HELPER ─────────────────────────────────────────────────────────
/** Build the model-level key used by UnitBrochureManager */
export function makeModelKey(companyId, projectId, buildingType, unitType, unitModel) {
  return `${companyId}|${projectId}|${buildingType}|${unitType}|${unitModel}`;
}

/**
 * Clear all manager-written data from sessionStorage.
 * Useful for testing / "reset to defaults" scenarios.
 */
export function clearBridgeStore() {
  Object.keys(brochureImageStore).forEach(k => delete brochureImageStore[k]);
  try { sessionStorage.removeItem(SESSION_KEY); } catch (_) {}
}