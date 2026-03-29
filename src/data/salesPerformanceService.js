// // services/salesPerformanceService.js
// import { companies, projects, units, premiumPercentages } from './mockDataAnalysis';

// const PREMIUM_FIELD_MAPPING = {
//   'main_view': 'main_view',
//   'secondary_view': 'secondary_view',
//   'north_breeze': 'north_breeze',
//   'corners': 'corners',
//   'accessibility': 'accessibility',
//   'special_premiums': 'special_premiums',
//   'special_discounts': 'special_discounts',
// };

// // Helper function to build status counts
// const buildStatusCounts = (unitsList) => {
//   const all = unitsList.length;
//   const released = unitsList.filter(u => 
//     u.status === 'Available' || u.status === 'Contracted' || u.status === 'Reserved'
//   ).length;
//   const available = unitsList.filter(u => u.status === 'Available').length;
//   const soldBooked = unitsList.filter(u => u.status === 'Contracted').length;

//   return {
//     all,
//     released,
//     available,
//     sold_booked: soldBooked
//   };
// };

// // Helper function to attach percentages
// const attachPercentages = (rows, totalAll) => {
//   rows.forEach(row => {
//     row.breakdown_percent = totalAll > 0 ? (row.all / totalAll) * 100 : 0;
//     row.released_percent = totalAll > 0 ? (row.released / totalAll) * 100 : 0;
//   });
// };

// // Simulated API delay
// const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// export const salesPerformanceService = {
//   // Get all companies
//   async getCompanies() {
//     await delay();
//     return {
//       success: true,
//       data: companies
//     };
//   },

//   // Get projects by company ID
//   async getCompanyProjects(companyId) {
//     await delay();
    
//     if (!companyId) {
//       return {
//         success: true,
//         data: []
//       };
//     }

//     const companyProjects = projects[companyId] || [];
//     return {
//       success: true,
//       data: companyProjects
//     };
//   },

//   // Get sales analysis data (price ranges)
//   async getSalesAnalysisData(projectId) {
//     await delay();

//     if (!projectId) {
//       return {
//         success: false,
//         error: 'project_id is required'
//       };
//     }

//     const projectUnits = units[projectId];
    
//     if (!projectUnits || projectUnits.length === 0) {
//       return {
//         success: true,
//         data: {
//           price_ranges: [],
//           totals: {}
//         }
//       };
//     }

//     // Filter units with valid prices
//     const validUnits = projectUnits.filter(u => u.interest_free_unit_price !== null);

//     if (validUnits.length === 0) {
//       return {
//         success: true,
//         data: {
//           price_ranges: [],
//           totals: {}
//         }
//       };
//     }

//     // Calculate min and max prices
//     const prices = validUnits.map(u => u.interest_free_unit_price);
//     const minPrice = Math.min(...prices);
//     const maxPrice = Math.max(...prices);

//     // Build price ranges (5 buckets)
//     const buckets = 5;
//     const rangeWidth = (maxPrice - minPrice) / buckets;
//     const priceRanges = [];

//     let currentFrom = minPrice;
//     for (let i = 0; i < buckets; i++) {
//       const currentTo = i < (buckets - 1) ? currentFrom + rangeWidth : maxPrice;

//       const rangeUnits = validUnits.filter(u => 
//         u.interest_free_unit_price >= currentFrom && 
//         u.interest_free_unit_price <= currentTo
//       );

//       const counts = buildStatusCounts(rangeUnits);

//       priceRanges.push({
//         from: currentFrom,
//         to: currentTo,
//         ...counts
//       });

//       currentFrom = currentTo + 1;
//     }

//     // Calculate totals
//     const totals = {
//       all: priceRanges.reduce((sum, r) => sum + r.all, 0),
//       released: priceRanges.reduce((sum, r) => sum + r.released, 0),
//       available: priceRanges.reduce((sum, r) => sum + r.available, 0),
//       sold_booked: priceRanges.reduce((sum, r) => sum + r.sold_booked, 0)
//     };

//     // Attach percentages
//     attachPercentages(priceRanges, totals.all);

//     return {
//       success: true,
//       data: {
//         price_ranges: priceRanges,
//         totals
//       }
//     };
//   },

//   // Get sales analysis by unit model
//   async getSalesAnalysisByUnitModel(projectId) {
//     await delay();

//     if (!projectId) {
//       return {
//         success: false,
//         error: 'project_id is required'
//       };
//     }

//     const projectUnits = units[projectId];

//     if (!projectUnits || projectUnits.length === 0) {
//       return {
//         success: true,
//         data: {
//           unit_models: [],
//           totals: {}
//         }
//       };
//     }

//     // Get distinct unit models
//     const distinctModels = [...new Set(projectUnits.map(u => u.unit_model))];

//     const unitModelsData = distinctModels.map(model => {
//       const modelUnits = projectUnits.filter(u => u.unit_model === model);
//       const counts = buildStatusCounts(modelUnits);

//       return {
//         unit_model: model,
//         ...counts
//       };
//     });

//     // Calculate totals
//     const totals = {
//       all: unitModelsData.reduce((sum, r) => sum + r.all, 0),
//       released: unitModelsData.reduce((sum, r) => sum + r.released, 0),
//       available: unitModelsData.reduce((sum, r) => sum + r.available, 0),
//       sold_booked: unitModelsData.reduce((sum, r) => sum + r.sold_booked, 0)
//     };

//     // Attach percentages
//     attachPercentages(unitModelsData, totals.all);

//     return {
//       success: true,
//       data: {
//         unit_models: unitModelsData,
//         totals
//       }
//     };
//   },

//   // Get premium analysis data
//   async getPremiumAnalysisData(projectId, premiumType) {
//     await delay();

//     if (!projectId) {
//       return {
//         success: false,
//         error: 'project_id is required'
//       };
//     }

//     if (!premiumType) {
//       return {
//         success: false,
//         error: 'premium_type is required'
//       };
//     }

//     const fieldName = PREMIUM_FIELD_MAPPING[premiumType];
    
//     if (!fieldName) {
//       return {
//         success: false,
//         error: 'Invalid premium type'
//       };
//     }

//     const projectUnits = units[projectId];

//     if (!projectUnits || projectUnits.length === 0) {
//       return {
//         success: true,
//         data: {
//           premium_groups: [],
//           totals: {}
//         }
//       };
//     }

//     // Get distinct values for the premium field
//     const distinctValues = [...new Set(
//       projectUnits
//         .map(u => u[fieldName])
//         .filter(v => v !== null && v !== undefined && v !== '')
//     )];

//     const premiumGroups = distinctValues.map(value => {
//       const premiumUnits = projectUnits.filter(u => u[fieldName] === value);
//       const counts = buildStatusCounts(premiumUnits);

//       // Get premium percentage
//       const premiumPercent = premiumPercentages[projectId]?.[value] || 0;

//       return {
//         premium_value: value,
//         ...counts,
//         premium_percent: premiumPercent
//       };
//     });

//     // Calculate totals
//     const totals = {
//       all: premiumGroups.reduce((sum, r) => sum + r.all, 0),
//       released: premiumGroups.reduce((sum, r) => sum + r.released, 0),
//       available: premiumGroups.reduce((sum, r) => sum + r.available, 0),
//       sold_booked: premiumGroups.reduce((sum, r) => sum + r.sold_booked, 0)
//     };

//     // Only add released_percent (not breakdown_percent as per original code)
//     premiumGroups.forEach(group => {
//       group.released_percent = totals.all > 0 ? (group.released / totals.all) * 100 : 0;
//     });

//     return {
//       success: true,
//       data: {
//         premium_groups: premiumGroups,
//         totals
//       }
//     };
//   }
// };

// export default salesPerformanceService;



// data/salesPerformanceService.js
// Mock data replacing Django API integration

/* ============================================================
   MOCK DATA
   ============================================================ */
const MOCK_COMPANIES = [
  { id: '1', name: 'Mint' },
  { id: '2', name: 'Palmier Developments' },
  { id: '3', name: 'IGI Developments' }
];

const MOCK_PROJECTS = {
  '1': [
    { id: 'p1', name: 'Skyline Towers' },
    { id: 'p2', name: 'Green Valley Residences' },
  ],
  '2': [
    { id: 'p3', name: 'Marina Bay Complex' },
    { id: 'p4', name: 'Downtown Heights' },
  ],
  '3': [
    { id: 'p5', name: 'Palm Gardens' },
  ],
};

const MOCK_PRICE_RANGE = {
  price_ranges: [
    { from: 1000000,  to: 2000000,  all: 120, released: 90,  available: 35, sold_booked: 55, breakdown_percent: 20.0 },
    { from: 2000000,  to: 3500000,  all: 180, released: 150, available: 60, sold_booked: 90, breakdown_percent: 30.0 },
    { from: 3500000,  to: 5000000,  all: 150, released: 110, available: 45, sold_booked: 65, breakdown_percent: 25.0 },
    { from: 5000000,  to: 7500000,  all: 90,  released: 70,  available: 28, sold_booked: 42, breakdown_percent: 15.0 },
    { from: 7500000,  to: 12000000, all: 60,  released: 40,  available: 18, sold_booked: 22, breakdown_percent: 10.0 },
  ],
  totals: { all: 600, released: 460, available: 186, sold_booked: 274 },
};

const MOCK_UNIT_TYPE = {
  unit_types: [
    { unit_type: 'Studio',    all: 80,  released: 70,  available: 22, sold_booked: 48, breakdown_percent: 13.3 },
    { unit_type: '1 Bedroom', all: 150, released: 130, available: 50, sold_booked: 80, breakdown_percent: 25.0 },
    { unit_type: '2 Bedroom', all: 200, released: 160, available: 65, sold_booked: 95, breakdown_percent: 33.3 },
    { unit_type: '3 Bedroom', all: 120, released: 80,  available: 35, sold_booked: 45, breakdown_percent: 20.0 },
    { unit_type: 'Penthouse', all: 50,  released: 20,  available: 14, sold_booked: 6,  breakdown_percent:  8.3 },
  ],
  totals: { all: 600, released: 460, available: 186, sold_booked: 274 },
};

const MOCK_UNIT_MODEL = {
  unit_models: [
    { unit_model: 'Type A - Classic',  all: 140, released: 120, available: 45, sold_booked: 75, breakdown_percent: 23.3 },
    { unit_model: 'Type B - Premium',  all: 160, released: 130, available: 52, sold_booked: 78, breakdown_percent: 26.7 },
    { unit_model: 'Type C - Deluxe',   all: 120, released: 90,  available: 38, sold_booked: 52, breakdown_percent: 20.0 },
    { unit_model: 'Type D - Standard', all: 100, released: 80,  available: 30, sold_booked: 50, breakdown_percent: 16.7 },
    { unit_model: 'Type E - Luxury',   all: 80,  released: 40,  available: 21, sold_booked: 19, breakdown_percent: 13.3 },
  ],
  totals: { all: 600, released: 460, available: 186, sold_booked: 274 },
};

function makePremiumData(groups) {
  const totals = groups.reduce(
    (acc, g) => ({
      all: acc.all + g.all,
      released: acc.released + g.released,
      available: acc.available + g.available,
      sold_booked: acc.sold_booked + g.sold_booked,
    }),
    { all: 0, released: 0, available: 0, sold_booked: 0 }
  );
  return { premium_groups: groups, totals };
}

const MOCK_PREMIUM = {
  main_view: makePremiumData([
    { premium_value: 'City View',   premium_percent: 0.08, all: 200, released: 160, available: 65, sold_booked: 95 },
    { premium_value: 'Garden View', premium_percent: 0.05, all: 180, released: 140, available: 58, sold_booked: 82 },
    { premium_value: 'Pool View',   premium_percent: 0.10, all: 120, released: 90,  available: 38, sold_booked: 52 },
    { premium_value: 'No View',     premium_percent: 0.00, all: 100, released: 70,  available: 25, sold_booked: 45 },
  ]),
  secondary_view: makePremiumData([
    { premium_value: 'Park View',     premium_percent: 0.06, all: 150, released: 120, available: 48, sold_booked: 72  },
    { premium_value: 'Street View',   premium_percent: 0.02, all: 250, released: 200, available: 82, sold_booked: 118 },
    { premium_value: 'Internal View', premium_percent: 0.00, all: 200, released: 140, available: 56, sold_booked: 84  },
  ]),
  back_view: makePremiumData([
    { premium_value: 'Open Landscape', premium_percent: 0.07, all: 130, released: 100, available: 40,  sold_booked: 60  },
    { premium_value: 'Closed',         premium_percent: 0.00, all: 470, released: 360, available: 146, sold_booked: 214 },
  ]),
  levels: makePremiumData([
    { premium_value: 'Ground (0%)',  premium_percent: 0.00, all: 50,  released: 40,  available: 15, sold_booked: 25 },
    { premium_value: 'Low (1-5)',    premium_percent: 0.03, all: 150, released: 120, available: 48, sold_booked: 72 },
    { premium_value: 'Mid (6-10)',   premium_percent: 0.05, all: 200, released: 160, available: 64, sold_booked: 96 },
    { premium_value: 'High (11-15)', premium_percent: 0.08, all: 130, released: 90,  available: 38, sold_booked: 52 },
    { premium_value: 'Penthouse',    premium_percent: 0.15, all: 70,  released: 50,  available: 21, sold_booked: 29 },
  ]),
  north_breeze: makePremiumData([
    { premium_value: 'North Facing', premium_percent: 0.04, all: 220, released: 180, available: 72, sold_booked: 108 },
    { premium_value: 'South Facing', premium_percent: 0.00, all: 190, released: 150, available: 60, sold_booked: 90  },
    { premium_value: 'East Facing',  premium_percent: 0.02, all: 110, released: 80,  available: 32, sold_booked: 48  },
    { premium_value: 'West Facing',  premium_percent: 0.01, all: 80,  released: 50,  available: 22, sold_booked: 28  },
  ]),
  corners: makePremiumData([
    { premium_value: 'Corner Unit',   premium_percent: 0.06, all: 160, released: 130, available: 52,  sold_booked: 78  },
    { premium_value: 'Standard Unit', premium_percent: 0.00, all: 440, released: 330, available: 134, sold_booked: 196 },
  ]),
  accessibility: makePremiumData([
    { premium_value: 'High (Grade A)',    premium_percent: 0.05, all: 180, released: 150, available: 60, sold_booked: 90  },
    { premium_value: 'Medium (Grade B)',  premium_percent: 0.02, all: 250, released: 200, available: 80, sold_booked: 120 },
    { premium_value: 'Standard (Grade C)',premium_percent: 0.00, all: 170, released: 110, available: 46, sold_booked: 64  },
  ]),
};

/* ============================================================
   SIMULATE NETWORK DELAY
   ============================================================ */
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/* ============================================================
   SERVICE
   ============================================================ */
export const salesPerformanceService = {
  /**
   * Get Context: List of Companies.
   * Returns selected_company_id=null for admins (can pick any company).
   * To simulate a restricted user, set selected_company_id to e.g. '1'.
   */
  async getCompanies() {
    await delay(200);
    return {
      success: true,
      data: MOCK_COMPANIES,
      meta: {
        selectedCompanyId: null,       // null = admin (dropdown shown)
        // selectedCompanyId: '1',     // set a value to simulate restricted user
        initialProjects: [],
      },
    };
  },

  /** Get Projects for a specific Company. */
  async getCompanyProjects(companyId) {
    await delay(150);
    const projects = MOCK_PROJECTS[companyId] || [];
    return { success: true, data: projects };
  },

  /** Get Sales Analysis Data – Price Range Breakdown. */
  async getSalesAnalysisData(projectId) {
    if (!projectId) return { success: false, error: 'project_id is required' };
    await delay(250);
    return { success: true, data: { ...MOCK_PRICE_RANGE, success: true } };
  },

  /** Get Sales Analysis – Unit Type. */
  async getSalesAnalysisByUnitType(projectId) {
    if (!projectId) return { success: false, error: 'project_id is required' };
    await delay(250);
    return { success: true, data: { ...MOCK_UNIT_TYPE, success: true } };
  },

  /** Get Sales Analysis – Unit Model. */
  async getSalesAnalysisByUnitModel(projectId) {
    if (!projectId) return { success: false, error: 'project_id is required' };
    await delay(250);
    return { success: true, data: { ...MOCK_UNIT_MODEL, success: true } };
  },

  /**
   * Get Premium Analysis Data.
   * @param {string} premiumType – 'main_view' | 'secondary_view' | 'back_view' |
   *                               'levels' | 'north_breeze' | 'corners' | 'accessibility'
   */
  async getPremiumAnalysisData(projectId, premiumType) {
    if (!projectId || !premiumType) return { success: false, error: 'Missing parameters' };
    await delay(200);
    const data = MOCK_PREMIUM[premiumType];
    if (!data) return { success: false, error: `Unknown premium type: ${premiumType}` };
    return { success: true, data: { ...data, success: true } };
  },
};

export default salesPerformanceService;