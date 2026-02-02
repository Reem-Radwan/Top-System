// Define the companies available in the dropdown
export const mockCompanies = [
  { id: 1, name: "Mint" },
  { id: 2, name: "Palmier Developments" },
  { id: 3, name: "IGI Developments" },
];


export const mockUnits = [
  // --- COMPANY 1: Sunset Developers (Has Gardens, Land, Penthouse) ---
  {
    unit_code: "SUN-001",
    company_id: 1,
    project: "Golden Hills",
    project_id: 101,
    status: "Available",
    sales_phasing: "Phase 1",
    num_bedrooms: "4",
    building_type: "Villa",
    unit_type: "Standalone",
    unit_model: "Luxury",
    development_delivery_date: "2026-06-01",
    finishing_specs: "Core & Shell",
    sellable_area: 350.0,
    garden_area: 150.0, // Has Garden
    land_area: 500.0, // Has Land
    penthouse_area: 50.0, // Has Penthouse
    roof_terraces_area: 80.0,
    interest_free_unit_price: 15000000,
    layout_images: ["https://placehold.co/600x400?text=Villa+Layout"],
    map_focus_code: "LOC_SUN_001",
  },
  {
    unit_code: "SUN-002",
    company_id: 1,
    project: "Golden Hills",
    project_id: 101,
    status: "Reserved",
    sales_phasing: "Phase 1",
    num_bedrooms: "3",
    building_type: "Townhouse",
    unit_type: "Corner",
    unit_model: "Classic",
    development_delivery_date: "2026-06-01",
    finishing_specs: "Core & Shell",
    sellable_area: 280.0,
    garden_area: 100.0,
    land_area: 300.0,
    penthouse_area: 0,
    roof_terraces_area: 40.0,
    interest_free_unit_price: 11000000,
    layout_images: [],
    map_focus_code: "LOC_SUN_002",
  },

  // --- COMPANY 2: Urban Living (Apartments ONLY - No Garden/Land) ---
  // When you select this company, "Garden", "Land", and "Penthouse" columns should disappear.
  {
    unit_code: "URB-101",
    company_id: 2,
    project: "Skyline Towers",
    project_id: 201,
    status: "Available",
    sales_phasing: "Launch",
    num_bedrooms: "2",
    building_type: "Apartment",
    unit_type: "Typical Floor",
    unit_model: "Modern",
    development_delivery_date: "2025-12-01",
    finishing_specs: "Fully Finished",
    sellable_area: 120.0,
    garden_area: 0, // Empty
    land_area: 0, // Empty
    penthouse_area: 0, // Empty
    roof_terraces_area: 0, // Empty
    interest_free_unit_price: 4500000,
    layout_images: ["https://placehold.co/600x400?text=Apt+Layout"],
    map_focus_code: "LOC_URB_101",
  },
  {
    unit_code: "URB-102",
    company_id: 2,
    project: "Skyline Towers",
    project_id: 201,
    status: "Sold",
    sales_phasing: "Launch",
    num_bedrooms: "3",
    building_type: "Apartment",
    unit_type: "Typical Floor",
    unit_model: "Modern",
    development_delivery_date: "2025-12-01",
    finishing_specs: "Fully Finished",
    sellable_area: 160.0,
    garden_area: 0,
    land_area: 0,
    penthouse_area: 0,
    roof_terraces_area: 0,
    interest_free_unit_price: 6200000,
    layout_images: [],
    map_focus_code: null,
  },

  // --- COMPANY 3: Seaside Resorts (Mixed) ---
  {
    unit_code: "SEA-505",
    company_id: 3,
    project: "Blue Lagoon",
    project_id: 301,
    status: "Available",
    sales_phasing: "Phase 2",
    num_bedrooms: "2",
    building_type: "Chalet",
    unit_type: "Ground",
    unit_model: "Beach House",
    development_delivery_date: "2027-08-01",
    finishing_specs: "Finished",
    sellable_area: 110.0,
    garden_area: 60.0, // Has Garden
    land_area: 0,
    penthouse_area: 0,
    roof_terraces_area: 0,
    interest_free_unit_price: 7500000,
    layout_images: [],
    map_focus_code: "LOC_SEA_505",
  },
];

// --- GENERATE BULK DATA ---
// We add 100 extra items to Company 1 (Villas) and Company 2 (Apartments)
// to test pagination and performance.

// Add more Villas to Company 1
for (let i = 0; i < 50; i++) {
  mockUnits.push({
    unit_code: `SUN-GEN-${i + 100}`,
    company_id: 1,
    project: i % 2 === 0 ? "Golden Hills" : "Silver Creek",
    status: i % 5 === 0 ? "Sold" : "Available",
    sales_phasing: `Phase ${Math.floor(i / 10) + 1}`,
    num_bedrooms: "4",
    building_type: "Villa",
    unit_type: "Standalone",
    unit_model: "Luxury",
    development_delivery_date: "2026-12-01",
    finishing_specs: "Core & Shell",
    sellable_area: 300 + i * 2,
    garden_area: 100 + i, // Ensure these have values
    land_area: 400 + i, // Ensure these have values
    penthouse_area: 0,
    roof_terraces_area: 40,
    interest_free_unit_price: 12000000 + i * 100000,
    layout_images: [],
    map_focus_code: null,
  });
}

// Add more Apartments to Company 2 (Ensure NO Garden/Land to test hiding)
for (let i = 0; i < 50; i++) {
  mockUnits.push({
    unit_code: `URB-GEN-${i + 100}`,
    company_id: 2,
    project: "Metro City",
    status: "Available",
    sales_phasing: "Tower A",
    num_bedrooms: i % 2 === 0 ? "2" : "3",
    building_type: "Apartment",
    unit_type: "Flat",
    unit_model: "Standard",
    development_delivery_date: "2025-06-01",
    finishing_specs: "Fully Finished",
    sellable_area: 100 + i,
    garden_area: 0, // Explicitly 0
    land_area: 0, // Explicitly 0
    penthouse_area: 0, // Explicitly 0
    roof_terraces_area: 0, // Explicitly 0
    interest_free_unit_price: 3000000 + i * 50000,
    layout_images: [],
    map_focus_code: null,
  });
}
