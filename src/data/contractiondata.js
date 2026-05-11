// ═══════════════════════════════════════
//  CONTRACTION — Mock Data
//  Cascading: Company → Projects → Units
// ═══════════════════════════════════════

export const CATALOG = {
  'Mint': {
    projects: {
      'Mint Residence': [
        'MR-101', 'MR-102', 'MR-201', 'MR-202', 'MR-301', 'MR-302',
      ],
      'Mint Business Park': [
        'MB-101', 'MB-102', 'MB-201', 'MB-202', 'MB-301',
      ],
      'Mint Heights': [
        'MH-101', 'MH-102', 'MH-201', 'MH-202', 'MH-301', 'MH-401',
      ],
    },
  },
  'Palmier Developments': {
    projects: {
      'Palmier Gardens': [
        'PG-101', 'PG-102', 'PG-201', 'PG-202', 'PG-301', 'PG-302',
      ],
      'Palmier Plaza': [
        'PP-101', 'PP-102', 'PP-201', 'PP-202', 'PP-301',
      ],
      'Palmier Villas': [
        'PV-101', 'PV-102', 'PV-201', 'PV-202', 'PV-301', 'PV-401',
      ],
    },
  },
  'IGI Developments': {
    projects: {
      'IGI Compound': [
        'IC-101', 'IC-102', 'IC-201', 'IC-202', 'IC-301', 'IC-302',
      ],
      'IGI Tower': [
        'IT-101', 'IT-102', 'IT-201', 'IT-202', 'IT-301',
      ],
      'IGI Golf Residences': [
        'IG-101', 'IG-102', 'IG-201', 'IG-202', 'IG-301', 'IG-401',
      ],
    },
  },
};

export const COMPANIES = Object.keys(CATALOG);

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Returns project names for a given company, or [] */
export function getProjects(company) {
  if (!company || !CATALOG[company]) return [];
  return Object.keys(CATALOG[company].projects);
}

/** Returns unit codes for a given company + project, or [] */
export function getUnits(company, project) {
  if (!company || !project) return [];
  return CATALOG[company]?.projects[project] ?? [];
}

/** Format ISO date string → "05 Jan 2025" */
export function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d} ${MONTHS[parseInt(m, 10) - 1]} ${y}`;
}

/** Format today as ISO string */
export function todayISO() {
  const t = new Date();
  return (
    t.getFullYear() +
    '-' +
    String(t.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(t.getDate()).padStart(2, '0')
  );
}