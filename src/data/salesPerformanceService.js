// services/salesPerformanceService.js
import { companies, projects, units, premiumPercentages } from './mockDataAnalysis';

const PREMIUM_FIELD_MAPPING = {
  'main_view': 'main_view',
  'secondary_view': 'secondary_view',
  'north_breeze': 'north_breeze',
  'corners': 'corners',
  'accessibility': 'accessibility',
  'special_premiums': 'special_premiums',
  'special_discounts': 'special_discounts',
};

// Helper function to build status counts
const buildStatusCounts = (unitsList) => {
  const all = unitsList.length;
  const released = unitsList.filter(u => 
    u.status === 'Available' || u.status === 'Contracted' || u.status === 'Reserved'
  ).length;
  const available = unitsList.filter(u => u.status === 'Available').length;
  const soldBooked = unitsList.filter(u => u.status === 'Contracted').length;

  return {
    all,
    released,
    available,
    sold_booked: soldBooked
  };
};

// Helper function to attach percentages
const attachPercentages = (rows, totalAll) => {
  rows.forEach(row => {
    row.breakdown_percent = totalAll > 0 ? (row.all / totalAll) * 100 : 0;
    row.released_percent = totalAll > 0 ? (row.released / totalAll) * 100 : 0;
  });
};

// Simulated API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const salesPerformanceService = {
  // Get all companies
  async getCompanies() {
    await delay();
    return {
      success: true,
      data: companies
    };
  },

  // Get projects by company ID
  async getCompanyProjects(companyId) {
    await delay();
    
    if (!companyId) {
      return {
        success: true,
        data: []
      };
    }

    const companyProjects = projects[companyId] || [];
    return {
      success: true,
      data: companyProjects
    };
  },

  // Get sales analysis data (price ranges)
  async getSalesAnalysisData(projectId) {
    await delay();

    if (!projectId) {
      return {
        success: false,
        error: 'project_id is required'
      };
    }

    const projectUnits = units[projectId];
    
    if (!projectUnits || projectUnits.length === 0) {
      return {
        success: true,
        data: {
          price_ranges: [],
          totals: {}
        }
      };
    }

    // Filter units with valid prices
    const validUnits = projectUnits.filter(u => u.interest_free_unit_price !== null);

    if (validUnits.length === 0) {
      return {
        success: true,
        data: {
          price_ranges: [],
          totals: {}
        }
      };
    }

    // Calculate min and max prices
    const prices = validUnits.map(u => u.interest_free_unit_price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Build price ranges (5 buckets)
    const buckets = 5;
    const rangeWidth = (maxPrice - minPrice) / buckets;
    const priceRanges = [];

    let currentFrom = minPrice;
    for (let i = 0; i < buckets; i++) {
      const currentTo = i < (buckets - 1) ? currentFrom + rangeWidth : maxPrice;

      const rangeUnits = validUnits.filter(u => 
        u.interest_free_unit_price >= currentFrom && 
        u.interest_free_unit_price <= currentTo
      );

      const counts = buildStatusCounts(rangeUnits);

      priceRanges.push({
        from: currentFrom,
        to: currentTo,
        ...counts
      });

      currentFrom = currentTo + 1;
    }

    // Calculate totals
    const totals = {
      all: priceRanges.reduce((sum, r) => sum + r.all, 0),
      released: priceRanges.reduce((sum, r) => sum + r.released, 0),
      available: priceRanges.reduce((sum, r) => sum + r.available, 0),
      sold_booked: priceRanges.reduce((sum, r) => sum + r.sold_booked, 0)
    };

    // Attach percentages
    attachPercentages(priceRanges, totals.all);

    return {
      success: true,
      data: {
        price_ranges: priceRanges,
        totals
      }
    };
  },

  // Get sales analysis by unit model
  async getSalesAnalysisByUnitModel(projectId) {
    await delay();

    if (!projectId) {
      return {
        success: false,
        error: 'project_id is required'
      };
    }

    const projectUnits = units[projectId];

    if (!projectUnits || projectUnits.length === 0) {
      return {
        success: true,
        data: {
          unit_models: [],
          totals: {}
        }
      };
    }

    // Get distinct unit models
    const distinctModels = [...new Set(projectUnits.map(u => u.unit_model))];

    const unitModelsData = distinctModels.map(model => {
      const modelUnits = projectUnits.filter(u => u.unit_model === model);
      const counts = buildStatusCounts(modelUnits);

      return {
        unit_model: model,
        ...counts
      };
    });

    // Calculate totals
    const totals = {
      all: unitModelsData.reduce((sum, r) => sum + r.all, 0),
      released: unitModelsData.reduce((sum, r) => sum + r.released, 0),
      available: unitModelsData.reduce((sum, r) => sum + r.available, 0),
      sold_booked: unitModelsData.reduce((sum, r) => sum + r.sold_booked, 0)
    };

    // Attach percentages
    attachPercentages(unitModelsData, totals.all);

    return {
      success: true,
      data: {
        unit_models: unitModelsData,
        totals
      }
    };
  },

  // Get premium analysis data
  async getPremiumAnalysisData(projectId, premiumType) {
    await delay();

    if (!projectId) {
      return {
        success: false,
        error: 'project_id is required'
      };
    }

    if (!premiumType) {
      return {
        success: false,
        error: 'premium_type is required'
      };
    }

    const fieldName = PREMIUM_FIELD_MAPPING[premiumType];
    
    if (!fieldName) {
      return {
        success: false,
        error: 'Invalid premium type'
      };
    }

    const projectUnits = units[projectId];

    if (!projectUnits || projectUnits.length === 0) {
      return {
        success: true,
        data: {
          premium_groups: [],
          totals: {}
        }
      };
    }

    // Get distinct values for the premium field
    const distinctValues = [...new Set(
      projectUnits
        .map(u => u[fieldName])
        .filter(v => v !== null && v !== undefined && v !== '')
    )];

    const premiumGroups = distinctValues.map(value => {
      const premiumUnits = projectUnits.filter(u => u[fieldName] === value);
      const counts = buildStatusCounts(premiumUnits);

      // Get premium percentage
      const premiumPercent = premiumPercentages[projectId]?.[value] || 0;

      return {
        premium_value: value,
        ...counts,
        premium_percent: premiumPercent
      };
    });

    // Calculate totals
    const totals = {
      all: premiumGroups.reduce((sum, r) => sum + r.all, 0),
      released: premiumGroups.reduce((sum, r) => sum + r.released, 0),
      available: premiumGroups.reduce((sum, r) => sum + r.available, 0),
      sold_booked: premiumGroups.reduce((sum, r) => sum + r.sold_booked, 0)
    };

    // Only add released_percent (not breakdown_percent as per original code)
    premiumGroups.forEach(group => {
      group.released_percent = totals.all > 0 ? (group.released / totals.all) * 100 : 0;
    });

    return {
      success: true,
      data: {
        premium_groups: premiumGroups,
        totals
      }
    };
  }
};

export default salesPerformanceService;