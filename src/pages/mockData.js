export const mockCompanies = [
  { id: 1, name: 'Mint ' },
  { id: 2, name: 'SODIC' },
  { id: 3, name: 'Palm Hills' },
  { id: 4, name: 'Talaat Moustafa Group' },
  { id: 5, name: 'Madinet Nasr Housing' }
];

export const mockUnits = [
  // Emaar Misr Units
  ...Array.from({ length: 150 }, (_, i) => ({
    id: i + 1,
    company_id: 1,
    unit_code: `EMAAR-U${String(i + 1).padStart(3, '0')}`,
    project: `Uptown Cairo Phase ${Math.floor(i / 30) + 1}`,
    status: ['Available', 'Reserved', 'Sold'][Math.floor(Math.random() * 3)],
    sales_phasing: `Phase ${Math.floor(i / 25) + 1}`,
    num_bedrooms: [1, 2, 3, 4][Math.floor(Math.random() * 4)],
    building_type: ['Tower A', 'Tower B', 'Villa', 'Townhouse'][Math.floor(Math.random() * 4)],
    unit_type: ['Studio', '1BR', '2BR', '3BR', '4BR', 'Penthouse'][Math.floor(Math.random() * 6)],
    unit_model: `Model ${String.fromCharCode(65 + (i % 6))}`,
    development_delivery_date: `Q${Math.floor(Math.random() * 4) + 1} 2027`,
    finishing_specs: ['Semi-Furnished', 'Fully Furnished', 'Core & Shell'][Math.floor(Math.random() * 3)],
    sellable_area: (60 + Math.random() * 250).toFixed(2),
    garden_area: Math.random() > 0.7 ? (10 + Math.random() * 50).toFixed(2) : null,
    land_area: Math.random() > 0.8 ? (200 + Math.random() * 300).toFixed(2) : null,
    penthouse_area: Math.random() > 0.95 ? (300 + Math.random() * 200).toFixed(2) : null,
    roof_terraces_area: Math.random() > 0.85 ? (50 + Math.random() * 100).toFixed(2) : null,
    interest_free_unit_price: Math.floor(2000000 + Math.random() * 8000000),
    project_id: `proj_${Math.floor(i / 20) + 1}`,
    map_focus_code: Math.random() > 0.3 ? `MAP-${i}` : null,
    layout_images: Math.random() > 0.6 ? [
      `https://picsum.photos/800/600?random=${i + 1}`,
      `https://picsum.photos/800/600?random=${i + 100}`,
      `https://picsum.photos/800/600?random=${i + 200}`
    ] : []
  })),
  
  // SODIC Units (50 units)
  ...Array.from({ length: 50 }, (_, i) => ({
    id: i + 151,
    company_id: 2,
    unit_code: `SODIC-U${String(i + 1).padStart(3, '0')}`,
    project: `Vye Almaza`,
    status: ['Available', 'Reserved'][Math.floor(Math.random() * 2)],
    sales_phasing: 'Phase 1',
    num_bedrooms: [2, 3],
    building_type: 'Standalone Villas',
    unit_type: 'Villa',
    unit_model: 'Type V1',
    development_delivery_date: 'Q2 2026',
    finishing_specs: 'Fully Furnished',
    sellable_area: (250 + Math.random() * 150).toFixed(2),
    garden_area: (100 + Math.random() * 200).toFixed(2),
    land_area: (400 + Math.random() * 300).toFixed(2),
    interest_free_unit_price: Math.floor(12000000 + Math.random() * 5000000),
    project_id: 'vye_001',
    map_focus_code: `VYE-${i}`,
    layout_images: [`https://picsum.photos/800/600?random=${i + 300}`]
  }))
];
