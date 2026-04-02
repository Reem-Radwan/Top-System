// ═══════════════════════════════════════════════════
// SALES TEAM PERFORMANCE — DATA & GENERATION
// ═══════════════════════════════════════════════════

export const COMPANIES = [
  { value: "mint",    label: "Mint" },
  { value: "palmier", label: "Palmier Developments" },
  { value: "igi",     label: "IGI Developments" },
];

const COMPANY_CONFIGS = {
  mint: {
    projects:  ["Skyline Towers", "Blue Ridge", "City Center", "Marina Heights"],
    teams:     ["Alpha Team", "Beta Team", "Gamma Team", "No Team"],
    heads:     ["Sarah Connor", "Kyle Reese", "T-800"],
    salesmen:  ["Ahmed Rashed", "John Doe", "Mike Johnson", "Jane Smith", "Lisa Brown"],
    multiplier: 1,
  },
  palmier: {
    projects:  ["Palm Gardens", "Desert Oasis", "Golden Sands", "Mirage Complex"],
    teams:     ["Phoenix Squad", "Eagle Unit", "Falcon Team", "No Team"],
    heads:     ["Marcus Reid", "Diana Prince", "Bruce Wayne"],
    salesmen:  ["Carlos Martinez", "Emma Wilson", "David Lee", "Sophia Chen", "Oliver King"],
    multiplier: 1.2,
  },
  igi: {
    projects:  ["Innovation Hub", "Tech Plaza", "Smart City", "Future Towers"],
    teams:     ["Omega Division", "Sigma Group", "Lambda Team", "No Team"],
    heads:     ["Tony Stark", "Natasha Romanoff", "Steve Rogers"],
    salesmen:  ["James Rodriguez", "Maria Garcia", "Robert Taylor", "Jennifer White", "Michael Brown"],
    multiplier: 0.9,
  },
};

function generateCompanyData(company) {
  const cfg = COMPANY_CONFIGS[company];
  const data = [];
  let id = 1000;

  // Build team→head→salesman structure
  const ts = {};
  cfg.teams
    .filter((t) => t !== "No Team")
    .forEach((team) => {
      ts[team] = {};
      cfg.heads
        .slice(0, Math.random() > 0.5 ? 2 : 1)
        .forEach((h) => {
          ts[team][h] = [];
          const av = [...cfg.salesmen];
          const n = 2 + Math.floor(Math.random() * 2);
          for (let i = 0; i < n && av.length; i++) {
            ts[team][h].push(av.splice(Math.floor(Math.random() * av.length), 1)[0]);
          }
        });
    });

  for (let i = 0; i < 50; i++) {
    const team = cfg.teams[Math.floor(Math.random() * cfg.teams.length)];
    let head, salesman;

    if (team === "No Team") {
      head = "No Head";
      salesman = cfg.salesmen[Math.floor(Math.random() * cfg.salesmen.length)];
    } else {
      const hs = Object.keys(ts[team]);
      head = hs[Math.floor(Math.random() * hs.length)];
      salesman =
        Math.random() > 0.7
          ? head
          : ts[team][head][Math.floor(Math.random() * ts[team][head].length)];
    }

    const yr = 2024 + Math.floor(Math.random() * 2);
    const mo = Math.floor(Math.random() * 12);
    const dy = Math.floor(Math.random() * 28) + 1;

    data.push({
      id: id++,
      client_name: `Client ${i}`,
      project: cfg.projects[Math.floor(Math.random() * cfg.projects.length)],
      salesman,
      team,
      head,
      date: new Date(yr, mo, dy, Math.floor(Math.random() * 24)).toISOString(),
      final_price:
        (100000 + Math.floor(Math.random() * 900000)) *
        cfg.multiplier *
        (0.85 + Math.random() * 0.15),
      is_approved: Math.random() > 0.25,
    });
  }

  return data;
}

// Pre-generate all company data once (stable across renders)
export const COMPANY_DATA = {
  mint:    generateCompanyData("mint"),
  palmier: generateCompanyData("palmier"),
  igi:     generateCompanyData("igi"),
};

// ── CHART COLOURS ───────────────────────────────────
export const C1 = [
  "#FF6B35","#2C5F8D","#4A5568","#FF8C5F","#4A7BA7",
  "#94A3B8","#E55527","#1A3A5C","#2D3748","#6B7280",
];
export const C2 = [
  "#2C5F8D","#FF6B35","#4A5568","#4A7BA7","#FF8C5F",
  "#94A3B8","#1A3A5C","#E55527","#2D3748","#6B7280",
];

// ── DATA HELPERS ─────────────────────────────────────

export function buildPieData(filteredData, field) {
  const stats = {};
  filteredData
    .filter((d) => d.is_approved)
    .forEach((d) => {
      if (!stats[d[field]]) stats[d[field]] = { count: 0, total: 0 };
      stats[d[field]].count++;
      stats[d[field]].total += d.final_price;
    });
  const sorted = Object.entries(stats)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10);
  return {
    labels: sorted.map((s) => s[0]),
    values: sorted.map((s) => s[1].total),
    counts: sorted.map((s) => s[1].count),
    total:  sorted.reduce((s, x) => s + x[1].total, 0),
  };
}

export function parsePeriodKey(k) {
  if (k.includes("Q")) {
    const [q, y] = k.split(" ");
    return new Date(parseInt(y), (parseInt(q.replace("Q", "")) - 1) * 3, 1);
  }
  if (k.length === 4) return new Date(parseInt(k), 0, 1);
  return new Date(k);
}

export function buildTrendData(filteredData, period) {
  const grouped = {};
  const counts = {};
  filteredData
    .filter((d) => d.is_approved)
    .forEach((d) => {
      const dt = new Date(d.date);
      let k;
      if      (period === "annually")  k = dt.getFullYear().toString();
      else if (period === "quarterly") k = `Q${Math.floor(dt.getMonth() / 3) + 1} ${dt.getFullYear()}`;
      else                             k = dt.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      grouped[k] = (grouped[k] || 0) + d.final_price;
      counts[k]  = (counts[k]  || 0) + 1;
    });
  const sorted = Object.entries(grouped).sort(
    (a, b) => parsePeriodKey(a[0]) - parsePeriodKey(b[0])
  );
  return {
    labels: sorted.map((s) => s[0]),
    values: sorted.map((s) => s[1]),
    counts: sorted.map((s) => counts[s[0]]),
  };
}

export function buildHierarchy(data) {
  const s = { teams: {}, noTeam: [] };
  data.forEach((d) => {
    if (d.team === "No Team") { s.noTeam.push(d); return; }
    if (!s.teams[d.team]) s.teams[d.team] = { heads: {}, salesmen: {} };
    if (d.salesman === d.head) {
      if (!s.teams[d.team].heads[d.head]) s.teams[d.team].heads[d.head] = [];
      s.teams[d.team].heads[d.head].push(d);
    } else {
      if (!s.teams[d.team].salesmen[d.salesman]) s.teams[d.team].salesmen[d.salesman] = [];
      s.teams[d.team].salesmen[d.salesman].push(d);
    }
  });
  return s;
}

export function calcStats(recs) {
  const app   = recs.filter((r) => r.is_approved).length;
  const unapp = recs.filter((r) => !r.is_approved).length;
  const tot   = app + unapp;
  return {
    approved:   app,
    unapproved: unapp,
    percentage: tot > 0 ? ((app / tot) * 100).toFixed(1) : 0,
    sales:      recs.reduce((s, r) => s + r.final_price, 0),
  };
}

export function fmt(v, type) {
  if (!v && v !== 0) return "—";
  if (v === 0) return "—";
  if (type === "sales") return Math.round(v).toLocaleString();
  return v;
}

export function getAvailableOptions(currentData, selectedFilters, type) {
  let d = currentData;
  if (selectedFilters.project.length > 0 && type !== "project")
    d = d.filter((x) => selectedFilters.project.includes(x.project));
  if (selectedFilters.team.length > 0 && type !== "team")
    d = d.filter((x) => selectedFilters.team.includes(x.team));
  if (selectedFilters.salesman.length > 0 && type !== "salesman")
    d = d.filter((x) => selectedFilters.salesman.includes(x.salesman));
  return new Set(d.map((x) => x[type]));
}

export function applyFilters(currentData, selectedFilters, startDate, endDate) {
  return currentData.filter((d) => {
    const mp = selectedFilters.project.length === 0  || selectedFilters.project.includes(d.project);
    const mt = selectedFilters.team.length === 0     || selectedFilters.team.includes(d.team);
    const ms = selectedFilters.salesman.length === 0 || selectedFilters.salesman.includes(d.salesman);
    let md = true;
    if (startDate || endDate) {
      const dt = new Date(d.date);
      if (startDate && dt < new Date(startDate)) md = false;
      if (endDate   && dt > new Date(endDate))   md = false;
    }
    return mp && mt && ms && md;
  });
}

export function sortRows(rows, column, direction) {
  return [...rows].sort((a, b) => {
    let va, vb;
    switch (column) {
      case "employee":
        va = a.name.replace(/<[^>]*>/g, "");
        vb = b.name.replace(/<[^>]*>/g, "");
        return direction === 1 ? vb.localeCompare(va) : va.localeCompare(vb);
      case "approved":   va = a.stats.approved;              vb = b.stats.approved;              break;
      case "unapproved": va = a.stats.unapproved;            vb = b.stats.unapproved;            break;
      case "percentage": va = parseFloat(a.stats.percentage); vb = parseFloat(b.stats.percentage); break;
      case "sales":      va = a.stats.sales;                 vb = b.stats.sales;                 break;
      default: return 0;
    }
    return direction === 1 ? vb - va : va - vb;
  });
}

export function makePieChartConfig({ labels, values, counts, total, colors, onClickCb, legendPos = "bottom", anchorThreshold = 5 }) {
  return {
    type: "pie",
    data: {
      labels,
      datasets: [{ data: values, backgroundColor: colors }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: legendPos,
          labels: {
            font: { family: '"Times New Roman", Times, serif', size: legendPos === "right" ? 12 : 11 },
          },
        },
        tooltip: {
          callbacks: {
            label(ctx) {
              const pct = ((ctx.parsed / total) * 100).toFixed(1);
              return [
                `${ctx.label}`,
                `Percentage: ${pct}%`,
                `Approved: ${counts[ctx.dataIndex]} requests`,
                `Total: ${Math.round(ctx.parsed).toLocaleString()}`,
              ];
            },
          },
        },
        datalabels: {
          display: true,
          color: "#ffffff",
          font: { weight: "bold", size: 12, family: '"Times New Roman", Times, serif' },
          textStrokeColor: "rgba(0,0,0,0.4)",
          textStrokeWidth: 2,
          anchor: "center",
          align: "center",
          formatter(value) {
            const pct = ((value / total) * 100).toFixed(1);
            return parseFloat(pct) >= anchorThreshold ? `${pct}%` : "";
          },
        },
      },
      onClick(event, elements) {
        if (elements.length > 0) onClickCb(labels[elements[0].index]);
      },
    },
  };
}

export function makeTrendChartConfig({ labels, values, counts }) {
  return {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Total Approved Sales",
        data: values,
        borderColor: "#FF6B35",
        backgroundColor: "rgba(255,107,53,0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "#FF6B35",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { bottom: 20 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(c) {
              const v = Math.round(c.parsed.y);
              return [`Approved: ${counts[c.dataIndex]}`, `Total Sales: ${v.toLocaleString()}`];
            },
          },
        },
        datalabels: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback(v) {
              return v >= 1e6 ? (v / 1e6).toFixed(1) + "M" : v >= 1e3 ? (v / 1e3).toFixed(0) + "K" : v;
            },
            font: { family: '"Times New Roman", Times, serif' },
          },
        },
        x: {
          ticks: {
            font: { family: '"Times New Roman", Times, serif' },
            maxRotation: 45,
            minRotation: 0,
          },
        },
      },
    },
    plugins: [{
      id: "trendLineLabels",
      afterDatasetsDraw(chart) {
        const c = chart.ctx;
        chart.data.datasets.forEach((ds, i) => {
          const meta = chart.getDatasetMeta(i);
          if (!meta.hidden)
            meta.data.forEach((el, idx) => {
              c.fillStyle = "#FF6B35";
              c.font = 'bold 11px "Times New Roman"';
              c.textAlign = "center";
              c.textBaseline = "bottom";
              const v = ds.data[idx];
              c.fillText(
                v >= 1e6 ? (v / 1e6).toFixed(1) + "M" : (v / 1e3).toFixed(0) + "K",
                el.x, el.y - 5
              );
            });
        });
      },
    }],
  };
}