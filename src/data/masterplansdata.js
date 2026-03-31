// ─────────────────────────────────────────────────────────────────────────────
// masterplansdata.js  –  Mock data fully aligned with catalogedata.js
// ─────────────────────────────────────────────────────────────────────────────

// Shared bridge — live position store written by masterplanssettingsdata
import { bridgePositionStore, subscribeToBridgeChanges } from './masterplansBridge';

// ── BROCHURE BRIDGE ───────────────────────────────────────────────────────────
// getBridgeImages: reads live images pushed by UnitBrochureManager
// seedBridgeImages: seeds static images on first load so the bridge is always populated
import { getBridgeImages, seedBridgeImages } from './brochureBridge';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
export const mockProjects = [
  { id: 101, name: "Golden Hills" },
  { id: 201, name: "Skyline Towers" },
  { id: 301, name: "Blue Lagoon" },
  { id: 401, name: "Desert Rose" }, // No masterplan project
];

// ─── MASTERPLAN IMAGES ────────────────────────────────────────────────────────
const masterplanImages = {
  101: "https://elbayt.com/assets/uploads/images/29319/311bbcbb424f23e919bb542352c22471/masterplan--the-square-new-cairo-al-ahly-sabbour1jpg.jpg",
  201: "https://www.nawy.com/blog/wp-content/uploads/2022/06/ever-master-plan.png",
  301: "https://s3.eu-central-1.amazonaws.com/prod.images.cooingestate.com/admin/compound/map/715/WhatsApp_Image_2025-01-27_at_13.21.37.jpeg",
  // 401 intentionally missing → no masterplan
};

// ─── BROCHURE IMAGES ──────────────────────────────────────────────────────────
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

// ─── UNIT POSITIONS ───────────────────────────────────────────────────────────
const unitPositions = {

  // ── GOLDEN HILLS (project 101) ────────────────────────────────────────────
  101: [
    {
      id: 1, unit_code: "SUN-001", x_percent: 22, y_percent: 20,
      unit_type: "single", unit_status: "Blocked Development",
      filter_data: [{ unit_code: "SUN-001", bedrooms: "4", finishing: "Luxury", model: "Luxury", status: "Blocked", area: 350 }],
    },
    {
      id: 2, unit_code: "SUN-002", x_percent: 38, y_percent: 16,
      unit_type: "single", unit_status: "Contracted",
      filter_data: [{ unit_code: "SUN-002", bedrooms: "3", finishing: "Premium", model: "Classic", status: "Reserved", area: 280 }],
    },
    { id: 3,  unit_code: "SUN-GEN-100", x_percent: 55, y_percent: 14, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-100", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 300 }] },
    { id: 4,  unit_code: "SUN-GEN-101", x_percent: 70, y_percent: 18, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-101", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 302 }] },
    { id: 5,  unit_code: "SUN-GEN-102", x_percent: 82, y_percent: 25, unit_type: "single", unit_status: "unavailable", filter_data: [{ unit_code: "SUN-GEN-102", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Sold", area: 304 }] },
    { id: 6,  unit_code: "SUN-GEN-103", x_percent: 87, y_percent: 38, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-103", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 306 }] },
    { id: 7,  unit_code: "SUN-GEN-104", x_percent: 84, y_percent: 52, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-104", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 308 }] },
    { id: 8,  unit_code: "SUN-GEN-105", x_percent: 78, y_percent: 65, unit_type: "single", unit_status: "unavailable", filter_data: [{ unit_code: "SUN-GEN-105", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Sold", area: 310 }] },
    { id: 9,  unit_code: "SUN-GEN-106", x_percent: 68, y_percent: 74, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-106", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 312 }] },
    { id: 10, unit_code: "SUN-GEN-107", x_percent: 54, y_percent: 79, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-107", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 314 }] },
    { id: 11, unit_code: "SUN-GEN-108", x_percent: 39, y_percent: 77, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-108", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 316 }] },
    { id: 12, unit_code: "SUN-GEN-109", x_percent: 27, y_percent: 71, unit_type: "single", unit_status: "unavailable", filter_data: [{ unit_code: "SUN-GEN-109", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Sold", area: 318 }] },
    { id: 13, unit_code: "SUN-GEN-110", x_percent: 14, y_percent: 62, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-110", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 320 }] },
    { id: 14, unit_code: "SUN-GEN-111", x_percent: 10, y_percent: 48, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-111", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 322 }] },
    { id: 15, unit_code: "SUN-GEN-112", x_percent: 12, y_percent: 34, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-112", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 324 }] },
    { id: 16, unit_code: "SUN-GEN-113", x_percent: 32, y_percent: 34, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-113", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 326 }] },
    { id: 17, unit_code: "SUN-GEN-114", x_percent: 44, y_percent: 29, unit_type: "single", unit_status: "unavailable", filter_data: [{ unit_code: "SUN-GEN-114", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Sold", area: 328 }] },
    { id: 18, unit_code: "SUN-GEN-115", x_percent: 57, y_percent: 30, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-115", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 330 }] },
    { id: 19, unit_code: "SUN-GEN-116", x_percent: 67, y_percent: 38, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-116", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 332 }] },
    { id: 20, unit_code: "SUN-GEN-117", x_percent: 71, y_percent: 50, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-117", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 334 }] },
    { id: 21, unit_code: "SUN-GEN-118", x_percent: 67, y_percent: 61, unit_type: "single", unit_status: "unavailable", filter_data: [{ unit_code: "SUN-GEN-118", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Sold", area: 336 }] },
    { id: 22, unit_code: "SUN-GEN-119", x_percent: 57, y_percent: 67, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-119", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 338 }] },
    { id: 23, unit_code: "SUN-GEN-120", x_percent: 44, y_percent: 67, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-120", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 340 }] },
    { id: 24, unit_code: "SUN-GEN-121", x_percent: 33, y_percent: 60, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-121", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 342 }] },
    { id: 25, unit_code: "SUN-GEN-122", x_percent: 29, y_percent: 47, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-122", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 344 }] },
    { id: 26, unit_code: "SUN-GEN-123", x_percent: 42, y_percent: 47, unit_type: "single", unit_status: "unavailable", filter_data: [{ unit_code: "SUN-GEN-123", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Sold", area: 346 }] },
    { id: 27, unit_code: "SUN-GEN-124", x_percent: 50, y_percent: 44, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-124", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 348 }] },
    { id: 28, unit_code: "SUN-GEN-125", x_percent: 57, y_percent: 47, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SUN-GEN-125", bedrooms: "4", finishing: "Core & Shell", model: "Luxury", status: "Available", area: 350 }] },
  ],

  // ── SKYLINE TOWERS (project 201) ──────────────────────────────────────────
  201: [
    {
      id: 101, unit_code: "URB-BLK-A", x_percent: 14, y_percent: 22,
      unit_type: "building", unit_status: null,
      child_codes: ["URB-101", "URB-102"],
      filter_data: [
        { unit_code: "URB-101", bedrooms: "2", finishing: "Ultra",          model: "Modern", status: "Available", area: 120 },
        { unit_code: "URB-102", bedrooms: "3", finishing: "Fully Finished", model: "Modern", status: "Sold",      area: 160 },
      ],
    },
    {
      id: 102, unit_code: "URB-BLK-B", x_percent: 35, y_percent: 18,
      unit_type: "building", unit_status: null,
      child_codes: ["URB-GEN-100", "URB-GEN-101", "URB-GEN-102"],
      filter_data: [
        { unit_code: "URB-GEN-100", bedrooms: "2", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 100 },
        { unit_code: "URB-GEN-101", bedrooms: "3", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 103 },
        { unit_code: "URB-GEN-102", bedrooms: "2", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 102 },
      ],
    },
    {
      id: 103, unit_code: "URB-BLK-C", x_percent: 55, y_percent: 15,
      unit_type: "building", unit_status: null,
      child_codes: ["URB-GEN-103", "URB-GEN-104", "URB-GEN-105"],
      filter_data: [
        { unit_code: "URB-GEN-103", bedrooms: "3", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 101 },
        { unit_code: "URB-GEN-104", bedrooms: "2", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 104 },
        { unit_code: "URB-GEN-105", bedrooms: "3", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 103 },
      ],
    },
    {
      id: 104, unit_code: "URB-BLK-D", x_percent: 74, y_percent: 18,
      unit_type: "building", unit_status: null,
      child_codes: ["URB-GEN-106", "URB-GEN-107", "URB-GEN-108"],
      filter_data: [
        { unit_code: "URB-GEN-106", bedrooms: "2", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 105 },
        { unit_code: "URB-GEN-107", bedrooms: "3", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 102 },
        { unit_code: "URB-GEN-108", bedrooms: "2", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 100 },
      ],
    },
    {
      id: 105, unit_code: "URB-BLK-E", x_percent: 88, y_percent: 28,
      unit_type: "building", unit_status: null,
      child_codes: ["URB-GEN-109", "URB-GEN-110", "URB-GEN-111"],
      filter_data: [
        { unit_code: "URB-GEN-109", bedrooms: "3", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 106 },
        { unit_code: "URB-GEN-110", bedrooms: "2", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 101 },
        { unit_code: "URB-GEN-111", bedrooms: "3", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 103 },
      ],
    },
    {
      id: 106, unit_code: "URB-BLK-F", x_percent: 88, y_percent: 50,
      unit_type: "building", unit_status: null,
      child_codes: ["URB-GEN-112", "URB-GEN-113"],
      filter_data: [
        { unit_code: "URB-GEN-112", bedrooms: "2", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 102 },
        { unit_code: "URB-GEN-113", bedrooms: "3", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 105 },
      ],
    },
    {
      id: 107, unit_code: "URB-BLK-G", x_percent: 82, y_percent: 66,
      unit_type: "building", unit_status: null,
      child_codes: ["URB-GEN-114", "URB-GEN-115", "URB-GEN-116"],
      filter_data: [
        { unit_code: "URB-GEN-114", bedrooms: "2", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 101 },
        { unit_code: "URB-GEN-115", bedrooms: "3", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 104 },
        { unit_code: "URB-GEN-116", bedrooms: "2", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 100 },
      ],
    },
    {
      id: 108, unit_code: "URB-BLK-H", x_percent: 63, y_percent: 74,
      unit_type: "building", unit_status: null,
      child_codes: ["URB-GEN-117", "URB-GEN-118"],
      filter_data: [
        { unit_code: "URB-GEN-117", bedrooms: "3", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 103 },
        { unit_code: "URB-GEN-118", bedrooms: "2", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 102 },
      ],
    },
    {
      id: 109, unit_code: "URB-BLK-I", x_percent: 42, y_percent: 76,
      unit_type: "building", unit_status: null,
      child_codes: ["URB-GEN-119", "URB-GEN-120", "URB-GEN-121"],
      filter_data: [
        { unit_code: "URB-GEN-119", bedrooms: "2", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 104 },
        { unit_code: "URB-GEN-120", bedrooms: "3", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 103 },
        { unit_code: "URB-GEN-121", bedrooms: "2", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 101 },
      ],
    },
    {
      id: 110, unit_code: "URB-BLK-J", x_percent: 22, y_percent: 72,
      unit_type: "building", unit_status: null,
      child_codes: ["URB-GEN-122", "URB-GEN-123"],
      filter_data: [
        { unit_code: "URB-GEN-122", bedrooms: "3", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 105 },
        { unit_code: "URB-GEN-123", bedrooms: "2", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 102 },
      ],
    },
    {
      id: 111, unit_code: "URB-BLK-K", x_percent: 10, y_percent: 58,
      unit_type: "building", unit_status: null,
      child_codes: ["URB-GEN-124", "URB-GEN-125"],
      filter_data: [
        { unit_code: "URB-GEN-124", bedrooms: "2", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 100 },
        { unit_code: "URB-GEN-125", bedrooms: "3", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 103 },
      ],
    },
    {
      id: 112, unit_code: "URB-BLK-L", x_percent: 10, y_percent: 40,
      unit_type: "building", unit_status: null,
      child_codes: ["URB-GEN-126", "URB-GEN-127", "URB-GEN-128"],
      filter_data: [
        { unit_code: "URB-GEN-126", bedrooms: "3", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 102 },
        { unit_code: "URB-GEN-127", bedrooms: "2", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 104 },
        { unit_code: "URB-GEN-128", bedrooms: "3", finishing: "Fully Finished", model: "Standard", status: "UNReleased", area: 103 },
      ],
    },
  ],

  // ── BLUE LAGOON (project 301) ─────────────────────────────────────────────
  301: [
    {
      id: 201, unit_code: "SEA-505", x_percent: 50, y_percent: 45,
      unit_type: "single", unit_status: "unavailable",
      filter_data: [{ unit_code: "SEA-505", bedrooms: "2", finishing: "Finished", model: "Beach House", status: "UNReleased", area: 110 }],
    },
    { id: 202, unit_code: "SEA-506", x_percent: 18, y_percent: 15, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-506", bedrooms: "2", finishing: "Finished", model: "Beach House", status: "Available", area: 112 }] },
    { id: 203, unit_code: "SEA-507", x_percent: 33, y_percent: 12, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-507", bedrooms: "3", finishing: "Finished", model: "Beach House", status: "Available", area: 140 }] },
    { id: 204, unit_code: "SEA-508", x_percent: 50, y_percent: 10, unit_type: "single", unit_status: "Contracted",  filter_data: [{ unit_code: "SEA-508", bedrooms: "3", finishing: "Finished", model: "Beach House", status: "Reserved",  area: 142 }] },
    { id: 205, unit_code: "SEA-509", x_percent: 66, y_percent: 12, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-509", bedrooms: "2", finishing: "Finished", model: "Beach House", status: "Available", area: 115 }] },
    { id: 206, unit_code: "SEA-510", x_percent: 80, y_percent: 18, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-510", bedrooms: "2", finishing: "Finished", model: "Beach House", status: "Available", area: 113 }] },
    { id: 207, unit_code: "SEA-511", x_percent: 88, y_percent: 30, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-511", bedrooms: "3", finishing: "Finished", model: "Beach House", status: "Available", area: 138 }] },
    { id: 208, unit_code: "SEA-512", x_percent: 86, y_percent: 48, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-512", bedrooms: "2", finishing: "Finished", model: "Beach House", status: "Available", area: 110 }] },
    { id: 209, unit_code: "SEA-513", x_percent: 80, y_percent: 63, unit_type: "single", unit_status: "Contracted",  filter_data: [{ unit_code: "SEA-513", bedrooms: "3", finishing: "Finished", model: "Beach House", status: "Reserved",  area: 141 }] },
    { id: 210, unit_code: "SEA-514", x_percent: 68, y_percent: 73, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-514", bedrooms: "2", finishing: "Finished", model: "Beach House", status: "Available", area: 114 }] },
    { id: 211, unit_code: "SEA-515", x_percent: 52, y_percent: 77, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-515", bedrooms: "3", finishing: "Finished", model: "Beach House", status: "Available", area: 143 }] },
    { id: 212, unit_code: "SEA-516", x_percent: 37, y_percent: 75, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-516", bedrooms: "2", finishing: "Finished", model: "Beach House", status: "Available", area: 111 }] },
    { id: 213, unit_code: "SEA-517", x_percent: 24, y_percent: 68, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-517", bedrooms: "3", finishing: "Finished", model: "Beach House", status: "Available", area: 139 }] },
    { id: 214, unit_code: "SEA-518", x_percent: 14, y_percent: 55, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-518", bedrooms: "2", finishing: "Finished", model: "Beach House", status: "Available", area: 116 }] },
    { id: 215, unit_code: "SEA-519", x_percent: 10, y_percent: 40, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-519", bedrooms: "3", finishing: "Finished", model: "Beach House", status: "Available", area: 144 }] },
    { id: 216, unit_code: "SEA-520", x_percent: 11, y_percent: 25, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-520", bedrooms: "2", finishing: "Finished", model: "Beach House", status: "Available", area: 112 }] },
    { id: 217, unit_code: "SEA-521", x_percent: 30, y_percent: 32, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-521", bedrooms: "2", finishing: "Finished", model: "Beach House", status: "Available", area: 117 }] },
    { id: 218, unit_code: "SEA-522", x_percent: 40, y_percent: 28, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-522", bedrooms: "3", finishing: "Finished", model: "Beach House", status: "Available", area: 145 }] },
    { id: 219, unit_code: "SEA-523", x_percent: 52, y_percent: 28, unit_type: "single", unit_status: "Contracted",  filter_data: [{ unit_code: "SEA-523", bedrooms: "2", finishing: "Finished", model: "Beach House", status: "Reserved",  area: 113 }] },
    { id: 220, unit_code: "SEA-524", x_percent: 63, y_percent: 32, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-524", bedrooms: "3", finishing: "Finished", model: "Beach House", status: "Available", area: 140 }] },
    { id: 221, unit_code: "SEA-525", x_percent: 68, y_percent: 43, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-525", bedrooms: "2", finishing: "Finished", model: "Beach House", status: "Available", area: 115 }] },
    { id: 222, unit_code: "SEA-526", x_percent: 65, y_percent: 55, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-526", bedrooms: "3", finishing: "Finished", model: "Beach House", status: "Available", area: 142 }] },
    { id: 223, unit_code: "SEA-527", x_percent: 55, y_percent: 62, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-527", bedrooms: "2", finishing: "Finished", model: "Beach House", status: "Available", area: 111 }] },
    { id: 224, unit_code: "SEA-528", x_percent: 43, y_percent: 62, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-528", bedrooms: "3", finishing: "Finished", model: "Beach House", status: "Available", area: 143 }] },
    { id: 225, unit_code: "SEA-529", x_percent: 32, y_percent: 56, unit_type: "single", unit_status: "Available", filter_data: [{ unit_code: "SEA-529", bedrooms: "2", finishing: "Finished", model: "Beach House", status: "Available", area: 116 }] },
    { id: 226, unit_code: "SEA-530", x_percent: 28, y_percent: 44, unit_type: "single", unit_status: "Contracted",  filter_data: [{ unit_code: "SEA-530", bedrooms: "3", finishing: "Finished", model: "Beach House", status: "Reserved",  area: 141 }] },
  ],
};

// ─── UNIT DETAILS ─────────────────────────────────────────────────────────────
const unitDetails = {};

// ── Golden Hills units ────────────────────────────────────────────────────────
unitDetails["SUN-001"] = {
  type: "single", company_id: 1, project: "Golden Hills", project_id: 101,
  data: {
    unit_code: "SUN-001", status: "Blocked",
    interest_free_unit_price: 15000000,
    development_delivery_date: "2026-06-01",
    finishing_specs: "Luxury",
    gross_area: 350, garden_area: 150, land_area: 500,
    penthouse_area: 50, roof_terraces_area: 80,
    num_bedrooms: "4", unit_model: "Luxury",
    floor: "G",
    layout_images: brochureImages.villa,
  },
};
// Seed bridge for SUN-001
seedBridgeImages("SUN-001", brochureImages.villa.map((url, i) => ({ id: i + 1, url, label: `Layout ${i + 1}` })));

unitDetails["SUN-002"] = {
  type: "single", company_id: 1, project: "Golden Hills", project_id: 101,
  data: {
    unit_code: "SUN-002", status: "Reserved",
    interest_free_unit_price: 11000000,
    development_delivery_date: "2026-06-01",
    finishing_specs: "Premium",
    gross_area: 280, garden_area: 100, land_area: 300,
    penthouse_area: 0, roof_terraces_area: 40,
    num_bedrooms: "3", unit_model: "Classic",
    floor: "G",
    layout_images: [], // No brochure
  },
};
seedBridgeImages("SUN-002", []);

// Generated GH villas
for (let i = 0; i < 26; i++) {
  const code = `SUN-GEN-${100 + i}`;
  const isSold = (i % 5 === 2);
  const staticImages = i % 3 === 0 ? brochureImages.villa : [];
  unitDetails[code] = {
    type: "single", company_id: 1, project: "Golden Hills", project_id: 101,
    data: {
      unit_code: code,
      status: isSold ? "Sold" : "Available",
      interest_free_unit_price: 12000000 + i * 100000,
      development_delivery_date: "2026-12-01",
      finishing_specs: "Core & Shell",
      gross_area: 300 + i * 2,
      garden_area: 100 + i,
      land_area: 400 + i,
      penthouse_area: 0,
      roof_terraces_area: (300 + i * 2) * 0.1,
      num_bedrooms: "4",
      unit_model: "Luxury",
      floor: "G",
      layout_images: staticImages,
    },
  };
  seedBridgeImages(code, staticImages.map((url, idx) => ({ id: idx + 1, url, label: `Layout ${idx + 1}` })));
}

// ── Skyline Towers buildings ──────────────────────────────────────────────────
unitDetails["URB-101"] = {
  type: "single", company_id: 2, project: "Skyline Towers", project_id: 201,
  data: {
    unit_code: "URB-101", status: "Available",
    interest_free_unit_price: 4500000,
    development_delivery_date: "2025-12-01",
    finishing_specs: "Ultra",
    gross_area: 120, garden_area: 0, land_area: 0,
    penthouse_area: 0, roof_terraces_area: 0,
    num_bedrooms: "2", unit_model: "Modern",
    floor: "3",
    layout_images: brochureImages.apartment,
  },
};
seedBridgeImages("URB-101", brochureImages.apartment.map((url, i) => ({ id: i + 1, url, label: `Layout ${i + 1}` })));

unitDetails["URB-102"] = {
  type: "single", company_id: 2, project: "Skyline Towers", project_id: 201,
  data: {
    unit_code: "URB-102", status: "Sold",
    interest_free_unit_price: 6200000,
    development_delivery_date: "2025-12-01",
    finishing_specs: "Fully Finished",
    gross_area: 160, garden_area: 0, land_area: 0,
    penthouse_area: 0, roof_terraces_area: 0,
    num_bedrooms: "3", unit_model: "Modern",
    floor: "4",
    layout_images: [], // No brochure
  },
};
seedBridgeImages("URB-102", []);

// Building blocks
const buildingBlockDefs = {
  "URB-BLK-A": {
    name: "Block A – Skyline Towers",
    units: [
      { unit_code: "URB-101", floor: "3", status: "Available", interest_free_unit_price: 4500000, finishing_specs: "Ultra", gross_area: 120, num_bedrooms: "2", unit_model: "Modern", layout_images: brochureImages.apartment },
      { unit_code: "URB-102", floor: "4", status: "Sold",      interest_free_unit_price: 6200000, finishing_specs: "Fully Finished", gross_area: 160, num_bedrooms: "3", unit_model: "Modern", layout_images: [] },
    ],
  },
};

"BCDEFGHIJKL".split("").forEach((letter, li) => {
  const blockCode = `URB-BLK-${letter}`;
  const startIdx = li * 3 + 100;
  const units = [];
  for (let j = 0; j < 3; j++) {
    const uc = `URB-GEN-${startIdx + j}`;
    const beds = j % 2 === 0 ? "2" : "3";
    const imgs = j === 0 ? brochureImages.apartment : [];
    units.push({
      unit_code: uc, floor: `${j + 2}`, status: "UNReleased",
      interest_free_unit_price: 3000000 + (startIdx + j) * 50000,
      finishing_specs: "Fully Finished", gross_area: 100 + j,
      num_bedrooms: beds, unit_model: "Standard",
      layout_images: imgs,
    });
    seedBridgeImages(uc, imgs.map((url, idx) => ({ id: idx + 1, url, label: `Layout ${idx + 1}` })));
  }
  buildingBlockDefs[blockCode] = { name: `Block ${letter} – Skyline Towers`, units };
});

Object.entries(buildingBlockDefs).forEach(([code, { name, units }]) => {
  unitDetails[code] = {
    type: "building",
    building_name: name,
    company_id: 2,
    project: "Skyline Towers",
    project_id: 201,
    data: units,
  };
});

// Generated URB single units
for (let i = 0; i < 50; i++) {
  const code = `URB-GEN-${100 + i}`;
  if (!unitDetails[code]) {
    const staticImages = i % 5 === 0 ? brochureImages.apartment : [];
    unitDetails[code] = {
      type: "single", company_id: 2, project: "Skyline Towers", project_id: 201,
      data: {
        unit_code: code, status: "UNReleased",
        interest_free_unit_price: 3000000 + i * 50000,
        development_delivery_date: "2025-06-01",
        finishing_specs: "Fully Finished",
        gross_area: 100 + i, garden_area: 0, land_area: 0,
        penthouse_area: 0, roof_terraces_area: 0,
        num_bedrooms: i % 2 === 0 ? "2" : "3",
        unit_model: "Standard",
        floor: `${i % 10 + 2}`,
        layout_images: staticImages,
      },
    };
    seedBridgeImages(code, staticImages.map((url, idx) => ({ id: idx + 1, url, label: `Layout ${idx + 1}` })));
  }
}

// ── Blue Lagoon units ─────────────────────────────────────────────────────────
unitDetails["SEA-505"] = {
  type: "single", company_id: 3, project: "Blue Lagoon", project_id: 301,
  data: {
    unit_code: "SEA-505", status: "UNReleased",
    interest_free_unit_price: 7500000,
    development_delivery_date: "2027-08-01",
    finishing_specs: "Finished",
    gross_area: 110, garden_area: 60, land_area: 0,
    penthouse_area: 0, roof_terraces_area: 0,
    num_bedrooms: "2", unit_model: "Beach House",
    floor: "G",
    layout_images: [],
  },
};
seedBridgeImages("SEA-505", []);

for (let i = 506; i <= 530; i++) {
  const code = `SEA-${i}`;
  const isReserved = (i % 7 === 0);
  const staticImages = (i - 505) % 4 === 0 ? brochureImages.chalet : [];
  unitDetails[code] = {
    type: "single", company_id: 3, project: "Blue Lagoon", project_id: 301,
    data: {
      unit_code: code,
      status: isReserved ? "Reserved" : "Available",
      interest_free_unit_price: 7500000 + (i - 505) * 200000,
      development_delivery_date: "2027-08-01",
      finishing_specs: "Finished",
      gross_area: 110 + (i - 505),
      garden_area: 60,
      land_area: 0,
      penthouse_area: 0,
      roof_terraces_area: 0,
      num_bedrooms: i % 2 === 0 ? "2" : "3",
      unit_model: "Beach House",
      floor: "G",
      layout_images: staticImages,
    },
  };
  seedBridgeImages(code, staticImages.map((url, idx) => ({ id: idx + 1, url, label: `Layout ${idx + 1}` })));
}

// ─── API SIMULATION ───────────────────────────────────────────────────────────

export async function getMasterplanData(projectId) {
  await delay(400);
  const id = parseInt(projectId, 10);
  if (!masterplanImages[id]) return { has_masterplan: false };

  if (bridgePositionStore[id] === undefined) {
    bridgePositionStore[id] = JSON.parse(JSON.stringify(unitPositions[id] || []));
  }

  return {
    has_masterplan: true,
    image_url: masterplanImages[id],
    unit_positions: bridgePositionStore[id],
    is_client: false,
  };
}

export function subscribeToSettingsChanges(fn) {
  return subscribeToBridgeChanges(fn);
}

/**
 * Returns unit details with layout_images resolved live from brochureBridge.
 *
 * Priority order:
 *   1. brochureBridge[unitCode]  — set by UnitBrochureManager upload/delete/reorder
 *   2. static unitDetails[unitCode].data.layout_images  — original seed data
 *
 * This means any upload in the Brochure Manager page is INSTANTLY reflected
 * here the next time masterplans.js opens a tooltip for that unit.
 */
export async function getUnitDetails(unitCode) {
  await delay(150);

  const entry = unitDetails[unitCode];
  if (!entry) {
    return {
      type: "single", company_id: 1, project: "Unknown", project_id: null,
      data: {
        unit_code: unitCode, status: "Available",
        interest_free_unit_price: 10000000,
        development_delivery_date: "TBD",
        finishing_specs: "Core & Shell",
        gross_area: 200, garden_area: 0, land_area: 0,
        penthouse_area: 0, roof_terraces_area: 0,
        num_bedrooms: "3", unit_model: "Standard",
        floor: "1",
        layout_images: [],
      },
    };
  }

  // ── BRIDGE RESOLUTION ────────────────────────────────────────────────────────
  // For single units: check bridge by unit_code directly.
  // For building units: patch each child unit's layout_images individually.
  if (entry.type === "building") {
    const liveUnits = entry.data.map(u => {
      const bridgeImgs = getBridgeImages(u.unit_code);
      if (bridgeImgs !== null) {
        // Bridge returns { id, url, label }[] — extract plain URLs for compatibility
        return { ...u, layout_images: bridgeImgs.map(img => img.url) };
      }
      return u;
    });
    return { ...entry, data: liveUnits };
  }

  // Single unit
  const bridgeImgs = getBridgeImages(unitCode);
  if (bridgeImgs !== null) {
    // Bridge returns { id, url, label }[] — extract plain URLs for compatibility
    return {
      ...entry,
      data: {
        ...entry.data,
        layout_images: bridgeImgs.map(img => img.url),
      },
    };
  }

  return entry;
}