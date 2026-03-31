// ─────────────────────────────────────────────────────────────────────────────
// unitbrochuremanagerdata.js  –  synced with catalogedata.js + masterplansdata.js
//
// BRIDGE SYNC:
//   • On first load, seeds brochureBridge for every unit_code that has images.
//   • UnitBrochureManager writes back via pushGalleryUpdate(…) on any change,
//     which calls setBridgeImages for BOTH the model key AND every unit_code
//     so masterplans.js and cataloge.jsx both pick up changes live.
// ─────────────────────────────────────────────────────────────────────────────

import {
  seedBridgeImages,
  setBridgeImages,
  getBridgeImages,
  makeModelKey,
  subscribeToBrochureChanges,
} from './brochureBridge';

// ── Shared brochure image sets (identical to masterplansdata.js) ──────────────
export const brochureImages = {
  villa: [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  ],
  apartment: [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  ],
  chalet: [
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80",
  ],
};

// ── Companies (synced with catalogedata.js mockCompanies) ────────────────────
export const ubmCompanies = [
  { id: 1, name: "Mint" },
  { id: 2, name: "Palmier Developments" },
  { id: 3, name: "IGI Developments" },
];

// ── Projects ─────────────────────────────────────────────────────────────────
export const ubmProjects = [
  { id: 101, company_id: 1, name: "Golden Hills" },
  { id: 201, company_id: 2, name: "Skyline Towers" },
  { id: 301, company_id: 3, name: "Blue Lagoon" },
];

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY DATA
// "unitCodes" = every unit_code that belongs to this model — when the manager
// updates images the bridge pushes to all of them so masterplans + catalog sync.
// ─────────────────────────────────────────────────────────────────────────────

let _idCounter = 1;
function makeImages(arr) {
  return arr.map((url, idx) => ({ id: _idCounter++, url, label: `Layout ${idx + 1}` }));
}

export const ubmGalleryData = [
  // ── Mint / Golden Hills ──────────────────────────────────────────────────────
  {
    company_id: 1, project_id: 101,
    building_type: "Villa", unit_type: "Standalone", unit_model: "Luxury",
    unitCodes: [
      "SUN-001",
      ...Array.from({ length: 26 }, (_, i) => `SUN-GEN-${100 + i}`).filter((_, i) => i % 3 === 0),
    ],
    images: makeImages(brochureImages.villa),
  },
  {
    company_id: 1, project_id: 101,
    building_type: "Villa", unit_type: "Standalone", unit_model: "Core & Shell",
    unitCodes: Array.from({ length: 26 }, (_, i) => `SUN-GEN-${100 + i}`).filter((_, i) => i % 3 !== 0),
    images: [],
  },
  {
    company_id: 1, project_id: 101,
    building_type: "Townhouse", unit_type: "Corner", unit_model: "Classic",
    unitCodes: ["SUN-002"],
    images: [],
  },

  // ── Palmier Developments / Skyline Towers ────────────────────────────────────
  {
    company_id: 2, project_id: 201,
    building_type: "Apartment", unit_type: "Typical Floor", unit_model: "Modern",
    unitCodes: ["URB-101", "URB-102"],
    images: makeImages(brochureImages.apartment),
  },
  {
    company_id: 2, project_id: 201,
    building_type: "Apartment", unit_type: "Flat", unit_model: "Standard",
    unitCodes: Array.from({ length: 50 }, (_, i) => `URB-GEN-${100 + i}`),
    images: makeImages(brochureImages.apartment),
  },

  // ── IGI Developments / Blue Lagoon ───────────────────────────────────────────
  {
    company_id: 3, project_id: 301,
    building_type: "Chalet", unit_type: "Ground", unit_model: "Beach House",
    unitCodes: ["SEA-505", ...Array.from({ length: 25 }, (_, i) => `SEA-${506 + i}`)],
    images: makeImages(brochureImages.chalet),
  },
];

// ── Seed bridge on module load ────────────────────────────────────────────────
ubmGalleryData.forEach(entry => {
  const mKey = makeModelKey(entry.company_id, entry.project_id, entry.building_type, entry.unit_type, entry.unit_model);
  seedBridgeImages(mKey, entry.images);
  if (entry.images.length > 0) {
    entry.unitCodes.forEach(code => seedBridgeImages(code, entry.images));
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// QUERY HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function getProjects(companyId) {
  if (!companyId) return [];
  return ubmProjects.filter(p => p.company_id === Number(companyId));
}

export function getBuildingTypes(companyId, projectId) {
  if (!companyId || !projectId) return [];
  return [...new Set(
    ubmGalleryData
      .filter(g => g.company_id === Number(companyId) && g.project_id === Number(projectId))
      .map(g => g.building_type)
  )].sort();
}

export function getUnitTypes(companyId, projectId, buildingType) {
  if (!companyId || !projectId || !buildingType) return [];
  return [...new Set(
    ubmGalleryData
      .filter(g =>
        g.company_id === Number(companyId) &&
        g.project_id === Number(projectId) &&
        g.building_type === buildingType
      )
      .map(g => g.unit_type)
  )].sort();
}

export function getUnitModels(companyId, projectId, buildingType, unitType) {
  if (!companyId || !projectId || !buildingType || !unitType) return [];
  return [...new Set(
    ubmGalleryData
      .filter(g =>
        g.company_id === Number(companyId) &&
        g.project_id === Number(projectId) &&
        g.building_type === buildingType &&
        g.unit_type === unitType
      )
      .map(g => g.unit_model)
  )].sort();
}

/**
 * Get live gallery for a fully-specified model.
 * Bridge-first (picks up manager uploads), falls back to static data.
 */
export function getGallery(companyId, projectId, buildingType, unitType, unitModel) {
  const mKey = makeModelKey(companyId, projectId, buildingType, unitType, unitModel);
  const live  = getBridgeImages(mKey);
  if (live !== null) return [...live];
  const entry = ubmGalleryData.find(g =>
    g.company_id === Number(companyId) &&
    g.project_id === Number(projectId) &&
    g.building_type === buildingType &&
    g.unit_type === unitType &&
    g.unit_model === unitModel
  );
  return entry ? [...entry.images] : [];
}

/**
 * Called by UnitBrochureManager whenever images change for a model.
 * Writes model key + every individual unit_code into the bridge.
 * Both masterplans.js (getUnitDetails) and cataloge.jsx (LayoutModal) react.
 */
export function pushGalleryUpdate(companyId, projectId, buildingType, unitType, unitModel, newImages) {
  const mKey = makeModelKey(companyId, projectId, buildingType, unitType, unitModel);
  setBridgeImages(mKey, newImages);

  const entry = ubmGalleryData.find(g =>
    g.company_id === Number(companyId) &&
    g.project_id === Number(projectId) &&
    g.building_type === buildingType &&
    g.unit_type === unitType &&
    g.unit_model === unitModel
  );
  if (entry) {
    entry.unitCodes.forEach(code => setBridgeImages(code, newImages));
  }
}

// Re-export so consumers need only one import
export { subscribeToBrochureChanges, getBridgeImages, makeModelKey };