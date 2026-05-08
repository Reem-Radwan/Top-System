// // ============================================================
// //  user-traffic-analysisdata.js
// //  All mock data for the User Traffic Analysis dashboard
// // ============================================================

// const UTA_COMPANIES = [
//   'Acme Corp', 'GlobalTech', 'NovaSolutions', 'PrimeSales',
//   'DataBridge', 'ClearPath Inc', 'Summit Analytics', 'BlueWave Ltd'
// ];

// const UTA_PATHS = [
//   '/dashboard/', '/reports/sales/', '/reports/traffic/', '/upload/documents/',
//   '/api/export/', '/user/profile/', '/analytics/overview/', '/pipeline/',
//   '/leads/', '/contracts/', '/settings/', '/notifications/', '/calendar/', '/help/'
// ];

// const UTA_RAW_USERS = [
//   { id: 1,  email: 'alice.johnson@acmecorp.com',       name: 'Alice Johnson',   co: 'Acme Corp',        grp: 'Sales' },
//   { id: 2,  email: 'bob.smith@globaltech.com',          name: 'Bob Smith',       co: 'GlobalTech',       grp: 'Manager' },
//   { id: 3,  email: 'carol.white@novasolutions.com',     name: 'Carol White',     co: 'NovaSolutions',    grp: 'Uploader' },
//   { id: 4,  email: 'david.lee@primesales.com',          name: 'David Lee',       co: 'PrimeSales',       grp: 'Sales' },
//   { id: 5,  email: 'emma.clark@databridge.com',         name: 'Emma Clark',      co: 'DataBridge',       grp: 'Sales Ops' },
//   { id: 6,  email: 'frank.hall@clearpath.com',          name: 'Frank Hall',      co: 'ClearPath Inc',    grp: 'Viewer' },
//   { id: 7,  email: 'grace.kim@summitanalytics.com',     name: 'Grace Kim',       co: 'Summit Analytics', grp: 'Company Admin' },
//   { id: 8,  email: 'henry.wang@bluewave.com',           name: 'Henry Wang',      co: 'BlueWave Ltd',     grp: 'Sales Head' },
//   { id: 9,  email: 'irene.mason@acmecorp.com',          name: 'Irene Mason',     co: 'Acme Corp',        grp: 'Sales' },
//   { id: 10, email: 'jack.brown@globaltech.com',         name: 'Jack Brown',      co: 'GlobalTech',       grp: 'Manager' },
//   { id: 11, email: 'kate.jones@novasolutions.com',      name: 'Kate Jones',      co: 'NovaSolutions',    grp: 'Sales Ops' },
//   { id: 12, email: 'liam.taylor@primesales.com',        name: 'Liam Taylor',     co: 'PrimeSales',       grp: 'Sales' },
//   { id: 13, email: 'mia.wilson@databridge.com',         name: 'Mia Wilson',      co: 'DataBridge',       grp: 'Uploader' },
//   { id: 14, email: 'noah.martin@clearpath.com',         name: 'Noah Martin',     co: 'ClearPath Inc',    grp: 'Viewer' },
//   { id: 15, email: 'olivia.garcia@summitanalytics.com', name: 'Olivia Garcia',   co: 'Summit Analytics', grp: 'Company Admin' },
// ];

// // Generate 4200 log entries (deterministic-ish using index-seeded math)
// function _buildLogs() {
//   const logs = [];
//   const now = new Date();
//   for (let i = 0; i < 4200; i++) {
//     const u    = UTA_RAW_USERS[Math.floor(Math.random() * UTA_RAW_USERS.length)];
//     const daysBack = Math.floor(Math.pow(Math.random(), 0.7) * 180);
//     const hour = Math.floor(Math.abs(Math.sin(i) * 24 + 9) % 24);
//     const dt   = new Date(now);
//     dt.setDate(dt.getDate() - daysBack);
//     dt.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
//     logs.push({
//       dt,
//       uid:   u.id,
//       email: u.email,
//       name:  u.name,
//       co:    u.co,
//       grp:   u.grp,
//       path:  UTA_PATHS[Math.floor(Math.random() * UTA_PATHS.length)],
//     });
//   }
//   return logs;
// }

// const UTA_LOGS = _buildLogs();

// export const MOCK = {
//   logs:      UTA_LOGS,
//   companies: [...new Set(UTA_LOGS.map(r => r.co))].sort(),
//   emails:    [...new Set(UTA_LOGS.map(r => r.email))].sort(),
//   groups:    [...new Set(UTA_LOGS.map(r => r.grp))].sort(),
// };

// // URL → category mapping
// export const UTA_CATS = {
//   'Reports & Analytics': ['/reports/sales/', '/reports/traffic/', '/analytics/overview/'],
//   'Data Operations':     ['/upload/documents/', '/pipeline/', '/leads/', '/contracts/'],
//   'User Management':     ['/user/profile/', '/settings/', '/notifications/'],
//   'Core Dashboard':      ['/dashboard/'],
//   'API & Export':        ['/api/export/'],
//   'Calendar & Help':     ['/calendar/', '/help/'],
// };

// export function utaCatOf(path) {
//   for (const [cat, ps] of Object.entries(UTA_CATS)) {
//     if (ps.includes(path)) return cat;
//   }
//   return 'Other';
// }

// // Groups excluded from group charts
// export const UTA_EXCL = ['Client', 'Controller'];

// // Chart colour palette
// export const UTA_PRO = [
//   '#c2410c', '#ea580c', '#f97316', '#fdba74',
//   '#334155', '#64748b', '#94a3b8', '#cbd5e1', '#1e293b', '#7c3aed'
// ];











// ============================================================
//  user-traffic-analysisdata.js
//  All mock data for the User Traffic Analysis dashboard
// ============================================================

const UTA_PATHS = [
  '/dashboard/', '/reports/sales/', '/reports/traffic/', '/upload/documents/',
  '/api/export/', '/user/profile/', '/analytics/overview/', '/pipeline/',
  '/leads/', '/contracts/', '/settings/', '/notifications/', '/calendar/', '/help/'
];

const UTA_RAW_USERS = [
  { id: 1,  email: 'alice.johnson@acmecorp.com',       name: 'Alice Johnson',   co: 'Acme Corp',        grp: 'Sales' },
  { id: 2,  email: 'bob.smith@globaltech.com',          name: 'Bob Smith',       co: 'GlobalTech',       grp: 'Manager' },
  { id: 3,  email: 'carol.white@novasolutions.com',     name: 'Carol White',     co: 'NovaSolutions',    grp: 'Uploader' },
  { id: 4,  email: 'david.lee@primesales.com',          name: 'David Lee',       co: 'PrimeSales',       grp: 'Sales' },
  { id: 5,  email: 'emma.clark@databridge.com',         name: 'Emma Clark',      co: 'DataBridge',       grp: 'Sales Ops' },
  { id: 6,  email: 'frank.hall@clearpath.com',          name: 'Frank Hall',      co: 'ClearPath Inc',    grp: 'Viewer' },
  { id: 7,  email: 'grace.kim@summitanalytics.com',     name: 'Grace Kim',       co: 'Summit Analytics', grp: 'Company Admin' },
  { id: 8,  email: 'henry.wang@bluewave.com',           name: 'Henry Wang',      co: 'BlueWave Ltd',     grp: 'Sales Head' },
  { id: 9,  email: 'irene.mason@acmecorp.com',          name: 'Irene Mason',     co: 'Acme Corp',        grp: 'Sales' },
  { id: 10, email: 'jack.brown@globaltech.com',         name: 'Jack Brown',      co: 'GlobalTech',       grp: 'Manager' },
  { id: 11, email: 'kate.jones@novasolutions.com',      name: 'Kate Jones',      co: 'NovaSolutions',    grp: 'Sales Ops' },
  { id: 12, email: 'liam.taylor@primesales.com',        name: 'Liam Taylor',     co: 'PrimeSales',       grp: 'Sales' },
  { id: 13, email: 'mia.wilson@databridge.com',         name: 'Mia Wilson',      co: 'DataBridge',       grp: 'Uploader' },
  { id: 14, email: 'noah.martin@clearpath.com',         name: 'Noah Martin',     co: 'ClearPath Inc',    grp: 'Viewer' },
  { id: 15, email: 'olivia.garcia@summitanalytics.com', name: 'Olivia Garcia',   co: 'Summit Analytics', grp: 'Company Admin' },
];

// Generate 4200 log entries (deterministic-ish using index-seeded math)
function _buildLogs() {
  const logs = [];
  const now = new Date();
  for (let i = 0; i < 4200; i++) {
    const u    = UTA_RAW_USERS[Math.floor(Math.random() * UTA_RAW_USERS.length)];
    const daysBack = Math.floor(Math.pow(Math.random(), 0.7) * 180);
    const hour = Math.floor(Math.abs(Math.sin(i) * 24 + 9) % 24);
    const dt   = new Date(now);
    dt.setDate(dt.getDate() - daysBack);
    dt.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
    logs.push({
      dt,
      uid:   u.id,
      email: u.email,
      name:  u.name,
      co:    u.co,
      grp:   u.grp,
      path:  UTA_PATHS[Math.floor(Math.random() * UTA_PATHS.length)],
    });
  }
  return logs;
}

const UTA_LOGS = _buildLogs();

export const MOCK = {
  logs:      UTA_LOGS,
  companies: [...new Set(UTA_LOGS.map(r => r.co))].sort(),
  emails:    [...new Set(UTA_LOGS.map(r => r.email))].sort(),
  groups:    [...new Set(UTA_LOGS.map(r => r.grp))].sort(),
};

// URL → category mapping
export const UTA_CATS = {
  'Reports & Analytics': ['/reports/sales/', '/reports/traffic/', '/analytics/overview/'],
  'Data Operations':     ['/upload/documents/', '/pipeline/', '/leads/', '/contracts/'],
  'User Management':     ['/user/profile/', '/settings/', '/notifications/'],
  'Core Dashboard':      ['/dashboard/'],
  'API & Export':        ['/api/export/'],
  'Calendar & Help':     ['/calendar/', '/help/'],
};

export function utaCatOf(path) {
  for (const [cat, ps] of Object.entries(UTA_CATS)) {
    if (ps.includes(path)) return cat;
  }
  return 'Other';
}

// Groups excluded from group charts
export const UTA_EXCL = ['Client', 'Controller'];

// Chart colour palette
export const UTA_PRO = [
  '#c2410c', '#ea580c', '#f97316', '#fdba74',
  '#334155', '#64748b', '#94a3b8', '#cbd5e1', '#1e293b', '#7c3aed'
];