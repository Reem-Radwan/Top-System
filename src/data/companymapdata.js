// ─── CompanyMapData.js ───────────────────────────────────────────────────────
// All static data, helper functions, and derived constants used by CompanyMap.

export const CURRENT_USER = {
  role: "admin",
  name: "Ahmed Hassan",
  company: null,
};

export const COMPANIES = [
  {
    id: "Mint",
    name: "Mint",
    emoji: "🌿",
    color: "#10B981",
    bgColor: "rgba(16,185,129,0.12)",
    tagline: "Fresh Living Concepts",
    areas: ["New Sphinx", "New Zayed", "El Sheikh Zayed"],
  },
  {
    id: "Palmier",
    name: "Palmier",
    emoji: "🌴",
    color: "#F59E0B",
    bgColor: "rgba(245,158,11,0.12)",
    tagline: "Luxury Palm Residences",
    areas: ["6th of October", "6th of October Gardens", "New 6th of October"],
  },
  {
    id: "IGI",
    name: "IGI",
    emoji: "🏛️",
    color: "#6366F1",
    bgColor: "rgba(99,102,241,0.12)",
    tagline: "Premium Urban Estates",
    areas: ["El Sheikh Zayed", "New Zayed", "6th of October"],
  },
];

export const CITY_DATA = {
  "6th of October Gardens": {
    name: "6th of October Gardens",
    bounds: [
      [29.94644, 31.09877],[29.95923, 31.06993],[29.95775, 31.05997],
      [29.97559, 30.99371],[29.94852, 30.95148],[29.91371, 30.93534],
      [29.87948, 30.86084],[29.83691, 30.90135],[29.89407, 31.00401],
      [29.87591, 31.04109],[29.85805, 31.03697],[29.84851, 31.05997]
    ],
    center: [29.905, 30.975], color: "#4A90E2"
  },
  "6th of October": {
    name: "6th of October",
    bounds: [
      [30.036954149210995, 30.95747055848259],[29.944044731000705, 30.809075170746542],
      [29.879252770349698, 30.861725305446875],[29.91519196915136, 30.936747853548315],
      [29.952112997846946, 30.95427834288016],[29.976047370082153, 30.99192299778054],
      [29.97359454586479, 31.00379220477795],[29.97999011343248, 31.006355298258597]
    ],
    center: [29.9720, 30.9150], color: "#50C878"
  },
  "New 6th of October": {
    name: "New 6th of October",
    bounds: [
      [29.78304, 30.85246],[29.83666, 30.89984],[29.95988, 30.79341],
      [29.91882, 30.71032],[29.79972, 30.76525],[29.77112, 30.79547],
      [29.78900, 30.79821],[29.78721, 30.81538],[29.82951, 30.81607],
      [29.83011, 30.85177]
    ],
    center: [29.8550, 30.7950], color: "#9B59B6"
  },
  "El Sheikh Zayed": {
    name: "El Sheikh Zayed",
    bounds: [
      [30.00858, 30.98196],[30.00977, 30.98402],[30.00858, 30.99089],
      [30.04678, 31.05200],[30.08422, 30.99003],[30.08882, 30.97098],
      [30.08748, 30.96359],[30.07397, 30.94351],[30.07337, 30.94008],
      [30.07411, 30.93390],[30.06758, 30.93184],[30.06594, 30.93252]
    ],
    center: [30.0580, 30.9720], color: "#E74C3C"
  },
  "New Zayed": {
    name: "New Zayed",
    bounds: [
      [30.07328376012259, 30.93302316069314],[30.088715863862944, 30.873094104330875],
      [30.092492174200956, 30.871706550735432],[30.091452712151412, 30.853325400414512],
      [30.013160031862355, 30.85148835295458],[30.0273718564546, 30.9352810872753],
      [30.04036150843812, 30.954505323018854],[30.066513979733013, 30.932193709665157]
    ],
    center: [30.0540, 30.9050], color: "#F39C12"
  },
  "New Sphinx": {
    name: "New Sphinx",
    bounds: [
      [30.06726, 30.85131],[30.08687, 30.85062],[30.08954, 30.84959],
      [30.09281, 30.85302],[30.09430, 30.87156],[30.12815, 30.87397],
      [30.19227, 30.78127],[30.22906, 30.73973],[30.23381, 30.70814],
      [30.19405, 30.67827],[30.18841, 30.67690],[30.17387, 30.67656],
      [30.16616, 30.67209],[30.13825, 30.67312],[30.11865, 30.69715],
      [30.10410, 30.70642],[30.07528, 30.71775],[30.06726, 30.73114],
      [30.06815, 30.85165]
    ],
    center: [30.1450, 30.7750], color: "#1ABC9C"
  }
};

export function getPolygonCenter(bounds) {
  if (!bounds || !Array.isArray(bounds) || bounds.length === 0) return [30.0444, 31.2357];
  let latSum = 0, lngSum = 0;
  bounds.forEach(([lat, lng]) => { latSum += lat; lngSum += lng; });
  return [latSum / bounds.length, lngSum / bounds.length];
}

export function isPointInPolygon(point, polygon) {
  if (!point || !polygon || !Array.isArray(polygon)) return false;
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export function getPointInPolygonAtIndex(bounds, slotIndex, totalSlots) {
  if (!bounds || !Array.isArray(bounds) || bounds.length === 0) {
    return [30.0444, 31.2357];
  }
  const center = getPolygonCenter(bounds);
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  bounds.forEach(([lat, lng]) => {
    minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng); maxLng = Math.max(maxLng, lng);
  });
  const STEPS = 20;
  const candidates = [];
  for (let r = 0; r <= STEPS; r++) {
    for (let c = 0; c <= STEPS; c++) {
      const lat = minLat + (r / STEPS) * (maxLat - minLat);
      const lng = minLng + (c / STEPS) * (maxLng - minLng);
      if (isPointInPolygon([lat, lng], bounds)) candidates.push([lat, lng]);
    }
  }
  if (candidates.length === 0) {
    const angle = (slotIndex / Math.max(totalSlots, 1)) * Math.PI * 2;
    const r = 0.003;
    return [center[0] + Math.sin(angle) * r, center[1] + Math.cos(angle) * r];
  }
  const step = Math.max(1, Math.floor(candidates.length / Math.max(totalSlots, 1)));
  const picked = candidates[Math.min((slotIndex * step) % candidates.length, candidates.length - 1)];
  return picked;
}

export function moneyShort(egp) {
  if (!egp || egp === 0) return "-";
  const m = egp / 1_000_000;
  return (m >= 10 ? m.toFixed(0) : m.toFixed(1)) + "M";
}

export function makeProjectPolygon(location, type, seed) {
  // Guard: ensure location is a valid [lat, lng] pair
  if (!location || !Array.isArray(location) || location.length < 2) {
    return [[30.0444, 31.2357]]; // fallback single-point polygon
  }
  const [lat, lng] = location;
  if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
    return [[30.0444, 31.2357]];
  }

  const baseSize = 0.005;
  let size = baseSize, complexity = 6;
  if (type === "Villa" || type === "Townhouse") { size = baseSize * 2.2; complexity = 8; }
  else if (type === "Duplex" || type === "Penthouse" || type === "Twinhouse") { size = baseSize * 1.6; complexity = 6; }
  else if (type === "Office" || type === "Clinic") { size = baseSize * 1.1; complexity = 4; }
  else if (type === "Services Apartment") { size = baseSize * 1.3; complexity = 5; }
  const points = [];
  const angleStep = (Math.PI * 2) / complexity;
  for (let i = 0; i < complexity; i++) {
    const angle = angleStep * i + (seed * 0.15);
    const radiusVar = 0.65 + (Math.sin(seed * 2 + i * 1.5) * 0.35);
    points.push([lat + Math.sin(angle) * size * radiusVar, lng + Math.cos(angle) * size * radiusVar * 1.25]);
  }
  return points;
}

export function galleryFor(projectName, seed) {
  const baseUrls = [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
    "https://images.unsplash.com/photo-1600607687644-c7171b42498b",
    "https://images.unsplash.com/photo-1558036117-15d82a90b9b1",
    "https://images.unsplash.com/photo-1600573472556-e636b8e7b8b5",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa",
  ];
  const start = Math.floor(seed * 53) % baseUrls.length;
  const selectedUrls = [];
  for (let i = 0; i < 4; i++) {
    const idx = (start + i * 3) % baseUrls.length;
    selectedUrls.push(`${baseUrls[idx]}?w=900&h=600&fit=crop&crop=entropy&q=80&auto=format`);
  }
  return selectedUrls;
}

export function getVideoFilename(compoundName) {
  return "video1.mp4";
}

export const MASTERPLAN_IMAGES = {
  "ivy": "ivymasterplan.png",
  "badya": "masterplan1.png",
  "o west": "masterplan2.png",
  "mountain view icity": "masterplan3.png",
  "solana": "masterplan4.png",
  "zed": "masterplan5.png",
  "sun capital": "masterplan6.png",
  "kayan": "masterplan7.png",
  "hills of one": "masterplan8.png",
  "verde": "masterplan9.png",
  "ever": "masterplan10.png",
  "westdays": "masterplan11.png",
  "golf solimania": "masterplan12.png",
  "botanica": "masterplan13.png",
};

export function getMasterplanImage(compoundName) {
  if (!compoundName) return null;
  const key = compoundName.toLowerCase().trim();
  for (const [pattern, url] of Object.entries(MASTERPLAN_IMAGES)) {
    if (key.includes(pattern)) return url;
  }
  return null;
}

export const RAW_DATA = `Ever,Cred,6th of October,Office,115,13540906,2029
Ever,Cred,6th of October,Office,245,30500637,2029
Ever,Cred,6th of October,Clinic,66,15359234,2029
Ever,Cred,6th of October,Apartment,196,17321956,2029
O West,Orascom,6th of October,Office,125,9500000,2028
O West,Orascom,6th of October,Apartment,145,11200000,2029
Mountain View iCity,Mountain View,6th of October,Apartment,165,14797961,2026
Mountain View iCity,Mountain View,6th of October,Duplex,235,25152857,2026
Kayan,Badreldin,6th of October,Apartment,130,8945307,2025
Westdays,il Cazar,6th of October,Apartment,120,6000000,2029
Westdays,il Cazar,6th of October,Penthouse,130,10190740,2029
ZED,Ora Developers,El Sheikh Zayed,Apartment,180,15715000,2029
ZED,Ora Developers,El Sheikh Zayed,Apartment,220,25690000,2029
Kite Complex,Kite,El Sheikh Zayed,Office,95,9200000,2027
Kite Complex,Kite,El Sheikh Zayed,Office,185,26500000,2027
barcelo hotel,barcelo hotel,El Sheikh Zayed,Services Apartment,42,5000000,2026
intercontental,intercontental,El Sheikh Zayed,Services Apartment,252,39235000,2026
Solana,Ora Developers,New Zayed,Villa,285,29361000,2029
Solana,Ora Developers,New Zayed,Townhouse,215,45000000,2029
Solana,Ora Developers,New Zayed,Twinhouse,195,35000000,2029
Hills of One,People & Places,New Zayed,Apartment,145,13160000,2029
Verde,Verde Dev,New Zayed,Apartment,165,10400000,2028
Verde,Verde Dev,New Zayed,Penthouse,195,20900000,2028
Golf Solimania,Solimania,New Sphinx,Villa,245,12500000,2027
Golf Solimania,Solimania,New Sphinx,Townhouse,185,25000000,2027
Botanica,Botanica Dev,New Sphinx,Apartment,145,7100000,2026
Botanica,Botanica Dev,New Sphinx,Duplex,185,16500000,2026
IVY,IVY Dev,New Sphinx,Apartment,125,5100000,2026
IVY,IVY Dev,New Sphinx,Apartment,155,12900000,2026
sun capital,Arabia Holding,6th of October Gardens,Apartment,138,11000000,2026
sun capital,Arabia Holding,6th of October Gardens,Duplex,185,11500000,2026
badya,Palm Hills,6th of October Gardens,Apartment,112,10438446,2029
badya,Palm Hills,6th of October Gardens,Townhouse,191,17935000,2029
badya,Palm Hills,6th of October Gardens,Villa,276,32406000,2027
Edge October,Edge Dev,New 6th of October,Apartment,115,3900000,2027
Edge October,Edge Dev,New 6th of October,Duplex,155,9900000,2027
Nova Strip,Nova Dev,New 6th of October,Office,85,6100000,2028
Nova Strip,Nova Dev,New 6th of October,Clinic,95,17900000,2028`;

// ── Build compound order per city ──
const cityCompoundOrder = {};
RAW_DATA.split('\n').forEach(line => {
  if (!line.trim()) return; // skip empty lines
  const parts = line.split(',');
  if (parts.length < 3) return; // skip malformed lines
  const name = parts[0].trim();
  const location = parts[2].trim();
  if (!name || !location) return;
  if (!cityCompoundOrder[location]) cityCompoundOrder[location] = [];
  if (!cityCompoundOrder[location].includes(name)) cityCompoundOrder[location].push(name);
});

// ── Build raw PROJECTS list ──
const PROJECTS = RAW_DATA.split('\n').map((line, idx) => {
  if (!line.trim()) return null; // skip empty lines

  const parts = line.split(',');
  if (parts.length < 7) return null; // skip malformed lines

  const [name, developer, location, unitType, bua, price, delivery] = parts;

  const trimmedLocation = (location || '').trim();
  const cityData = CITY_DATA[trimmedLocation];
  if (!cityData) {
    console.warn(`[CompanyMapData] Unknown city: "${trimmedLocation}" on line: ${line}`);
    return null;
  }

  const trimmedName = (name || '').trim();
  const cityCompounds = cityCompoundOrder[trimmedLocation] || [];
  const slotIndex = cityCompounds.indexOf(trimmedName);
  const totalSlots = cityCompounds.length;

  let location2d;
  try {
    location2d = getPointInPolygonAtIndex(cityData.bounds, slotIndex, totalSlots);
  } catch (e) {
    console.warn(`[CompanyMapData] getPointInPolygonAtIndex failed for ${trimmedName}:`, e);
    location2d = getPolygonCenter(cityData.bounds);
  }

  // Ensure location2d is valid
  if (!location2d || !Array.isArray(location2d) || location2d.length < 2) {
    location2d = getPolygonCenter(cityData.bounds);
  }

  const priceNum = parseFloat(price) || 0;
  const trimmedUnitType = (unitType || '').trim();

  let projectBounds;
  try {
    projectBounds = makeProjectPolygon(location2d, trimmedUnitType, idx);
  } catch (e) {
    console.warn(`[CompanyMapData] makeProjectPolygon failed for ${trimmedName}:`, e);
    projectBounds = [location2d]; // fallback
  }

  // Final guard: ensure projectBounds is always a valid array
  if (!projectBounds || !Array.isArray(projectBounds) || projectBounds.length === 0) {
    projectBounds = [location2d];
  }

  return {
    id: idx + 1,
    name: trimmedName,
    developer: (developer || '').trim(),
    city: trimmedLocation,
    location: location2d,
    unitType: trimmedUnitType,
    bua: parseInt(bua) || 0,
    minPrice: priceNum,
    maxPrice: priceNum * 1.3,
    deliveryDate: (delivery || '').trim(),
    description: `Modern ${trimmedUnitType} in ${trimmedName}, developed by ${(developer || '').trim()}. Located in prime ${trimmedLocation} area with excellent connectivity and amenities.`,
    images: galleryFor(trimmedName, idx),
    projectBounds,
    bedrooms: trimmedUnitType.includes('Villa') ? 4 : trimmedUnitType.includes('Apartment') ? 2 : 0,
    bathrooms: trimmedUnitType.includes('Villa') ? 3 : trimmedUnitType.includes('Apartment') ? 2 : 1,
    hasGarden: trimmedUnitType.includes('Villa') || trimmedUnitType.includes('Townhouse'),
    hasRoof: trimmedUnitType.includes('Penthouse') || trimmedUnitType.includes('Villa'),
    hasPool: trimmedUnitType.includes('Villa') || trimmedUnitType.includes('Townhouse'),
    hasGarage: true,
    paymentPlans: ["Cash", "Installments"]
  };
}).filter(Boolean);

// ── Aggregate into COMPOUNDS (one per unique name+city) ──
export const COMPOUNDS = [];
const compoundMap = new Map();

PROJECTS.forEach(project => {
  if (!project) return;
  const key = `${project.name}-${project.city}`;
  if (!compoundMap.has(key)) {
    const cp = PROJECTS.filter(p => p && p.name === project.name && p.city === project.city);

    // Guard: ensure projectBounds is always a valid non-empty array
    const safeBounds = (project.projectBounds && Array.isArray(project.projectBounds) && project.projectBounds.length > 0)
      ? project.projectBounds
      : [project.location || [30.0444, 31.2357]];

    const compound = {
      id: COMPOUNDS.length + 1,
      name: project.name,
      developer: project.developer,
      city: project.city,
      location: project.location || [30.0444, 31.2357],
      unitTypes: [...new Set(cp.map(p => p.unitType).filter(Boolean))],
      bua: cp[0].bua || 0,
      minPrice: Math.min(...cp.map(p => p.minPrice || 0)),
      maxPrice: Math.max(...cp.map(p => p.maxPrice || 0)),
      deliveryDate: project.deliveryDate,
      units: cp.length,
      bedrooms: project.bedrooms,
      bathrooms: project.bathrooms,
      hasGarden: project.hasGarden,
      hasRoof: project.hasRoof,
      hasPool: project.hasPool,
      hasGarage: project.hasGarage,
      paymentPlans: project.paymentPlans || [],
      description: project.description,
      images: project.images || [],
      projectBounds: safeBounds,
      areaVariants: [...new Set(cp.map(p => p.bua).filter(Boolean))].sort((a, b) => a - b),
    };
    compoundMap.set(key, compound);
    COMPOUNDS.push(compound);
  }
});

export const PRICE_OPTIONS = [
  500000,1000000,1500000,2000000,2500000,3000000,3500000,4000000,
  5000000,6000000,7000000,8000000,9000000,10000000,15000000,20000000,
  25000000,30000000,40000000
];

export function countProjectsByCity(projects) {
  if (!projects || !Array.isArray(projects)) return {};
  const map = {};
  projects.forEach(p => {
    if (p && p.city) map[p.city] = (map[p.city] || 0) + 1;
  });
  return map;
}

export function getMarkerLocation(compound) {
  if (!compound) return [30.0444, 31.2357];
  return getMasterplanImage(compound.name)
    ? getPolygonCenter(compound.projectBounds)
    : (compound.location || [30.0444, 31.2357]);
}

export function addMasterplanLayer(map, compounds) {
  if (!map) return { setVisible: () => {}, update: () => {}, remove: () => {} };

  const L = window.L;
  if (!L) return { setVisible: () => {}, update: () => {}, remove: () => {} };

  const mapContainer = map.getContainer();
  const ns = 'http://www.w3.org/2000/svg';
  const xlinkNs = 'http://www.w3.org/1999/xlink';

  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('xmlns', ns);
  svg.style.cssText = [
    'position:absolute','top:0','left:0','width:100%','height:100%',
    'pointer-events:none','z-index:420','overflow:hidden'
  ].join(';');
  mapContainer.appendChild(svg);

  const defs = document.createElementNS(ns, 'defs');
  svg.appendChild(defs);

  const entries = [];
  let clipSeq = 0;

  (compounds || []).forEach(compound => {
    if (!compound) return;
    const url = getMasterplanImage(compound.name);
    if (!url) return;

    // Guard: ensure projectBounds is a valid array with at least 3 points
    const poly = compound.projectBounds;
    if (!poly || !Array.isArray(poly) || poly.length < 3) return;

    const clipId = `mpclip_${++clipSeq}`;
    const clipPath = document.createElementNS(ns, 'clipPath');
    clipPath.setAttribute('id', clipId);
    const clipPoly = document.createElementNS(ns, 'polygon');
    clipPath.appendChild(clipPoly);
    defs.appendChild(clipPath);
    const image = document.createElementNS(ns, 'image');
    image.setAttributeNS(xlinkNs, 'href', url);
    image.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    image.setAttribute('clip-path', `url(#${clipId})`);
    image.setAttribute('opacity', '0.88');
    svg.appendChild(image);
    entries.push({ compound, clipPoly, image });
  });

  function update() {
    if (!map) return;
    try {
      const mapSize = map.getSize();
      svg.setAttribute('width', mapSize.x);
      svg.setAttribute('height', mapSize.y);
      entries.forEach(({ compound, clipPoly, image }) => {
        const poly = compound.projectBounds;
        if (!poly || !Array.isArray(poly) || poly.length === 0) return;
        const pxPts = poly.map(([lat, lng]) => map.latLngToContainerPoint(L.latLng(lat, lng)));
        clipPoly.setAttribute('points', pxPts.map(p => `${p.x},${p.y}`).join(' '));
        const xs = pxPts.map(p => p.x), ys = pxPts.map(p => p.y);
        const minX = Math.min(...xs), minY = Math.min(...ys);
        image.setAttribute('x', minX);
        image.setAttribute('y', minY);
        image.setAttribute('width', Math.max(...xs) - minX);
        image.setAttribute('height', Math.max(...ys) - minY);
      });
    } catch (e) {
      console.warn('[addMasterplanLayer] update error:', e);
    }
  }

  map.on('move zoom viewreset zoomend moveend', update);
  update();

  return {
    setVisible(v) { svg.style.display = v ? '' : 'none'; },
    update,
    remove() {
      try {
        map.off('move zoom viewreset zoomend moveend', update);
        if (svg.parentNode) svg.parentNode.removeChild(svg);
      } catch (e) {
        console.warn('[addMasterplanLayer] remove error:', e);
      }
    }
  };
}