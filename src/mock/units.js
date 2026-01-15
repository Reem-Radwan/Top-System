export const REQUIRED_FIELDS = [
  "city",
  "project",
  "unit_type",
  "area_range",
  "status",
  "sales_value",
];

export const rawUnits = [
  {
    city: "Cairo",
    project: "Palm Hills",
    unit_type: "Apartment",
    area_range: "100-150",
    status: "Available",
    sales_value: 2000000,
  },
  {
    city: "Cairo",
    project: "Palm Hills",
    unit_type: "Villa",
    area_range: "300-400",
    status: "Sold",
    sales_value: 8000000,
  },
  {
    city: "Giza",
    project: "Badya",
    unit_type: "Apartment",
    area_range: "120-160",
    status: "Reserved",
    sales_value: 2500000,
  },
];

export function normalizeUnits(units) {
  return units.map(unit => {
    const item = {};
    REQUIRED_FIELDS.forEach(f => {
      if (unit[f] !== undefined) item[f] = unit[f];
    });
    return item;
  });
}
