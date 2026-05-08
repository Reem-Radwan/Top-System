// ─── COMPANY / PROJECT DATA ───
export const COMPANY_PROJECTS = {
  alpha: [
    { id: '1', name: 'Skyline Residences' },
    { id: '2', name: 'Harbor View Tower' },
    { id: '3', name: 'North Gate Plaza' },
  ],
  beta: [
    { id: '4', name: 'Green Valley Villas' },
    { id: '5', name: 'Sunset Apartments' },
    { id: '6', name: 'Riverside Complex' },
  ],
  gamma: [
    { id: '7', name: 'Downtown Plaza' },
    { id: '8', name: 'Lakeside Towers' },
  ],
  delta: [
    { id: '9',  name: 'Palm Court Residences' },
    { id: '10', name: 'Central Park Heights' },
    { id: '11', name: 'Westfield Suites' },
  ],
};

// ─── MOCK DATABASE ───
export const MOCK_DB = {};

export const MOCK_SEEDS = {
  '1|1|flat|': {
    dp1: 10, dp1_discount_rate: 0, dp2: 5, dp2_discount_rate: 0,
    installment_0: 8.5,  installment_0_discount_rate: 12,
    installment_1: 8.5,  installment_1_discount_rate: 12,
    installment_2: 8.5,  installment_2_discount_rate: 12,
    installment_3: 8.5,  installment_3_discount_rate: 12,
    installment_4: 8.5,  installment_4_discount_rate: 12,
    installment_5: 8.5,  installment_5_discount_rate: 12,
    installment_6: 8.5,  installment_6_discount_rate: 12,
    installment_7: 8.5,  installment_7_discount_rate: 12,
    disable_additional_discount: false, interest_rate: 28.25,
  },
  '4|2|flat_back_loaded|': {
    dp1: 15, dp1_discount_rate: 0, dp2: 10, dp2_discount_rate: 0,
    installment_0: 5, installment_0_discount_rate: 10,
    installment_1: 5, installment_1_discount_rate: 10,
    installment_2: 5, installment_2_discount_rate: 10,
    installment_3: 5, installment_3_discount_rate: 10,
    installment_4: 5, installment_4_discount_rate: 10,
    installment_5: 5, installment_5_discount_rate: 10,
    installment_6: 5, installment_6_discount_rate: 10,
    installment_7: 5, installment_7_discount_rate: 10,
    installment_8: 5, installment_8_discount_rate: 10,
    installment_9: 5, installment_9_discount_rate: 10,
    disable_additional_discount: true, interest_rate: 20.0,
  },
  '7|3|bullet|': {
    dp1: 20, dp1_discount_rate: 0, dp2: 5, dp2_discount_rate: 0,
    installment_0: 5,  installment_0_discount_rate: 15,
    installment_1: 5,  installment_1_discount_rate: 15,
    installment_2: 5,  installment_2_discount_rate: 15,
    installment_3: 5,  installment_3_discount_rate: 15,
    installment_4: 5,  installment_4_discount_rate: 15,
    installment_5: 5,  installment_5_discount_rate: 15,
    installment_6: 5,  installment_6_discount_rate: 15,
    installment_7: 5,  installment_7_discount_rate: 15,
    installment_8: 5,  installment_8_discount_rate: 15,
    installment_9: 5,  installment_9_discount_rate: 15,
    installment_10: 5, installment_10_discount_rate: 15,
    installment_11: 5, installment_11_discount_rate: 15,
    disable_additional_discount: false, interest_rate: 25.0,
  },
  '9|1|bullet_back_loaded|': {
    dp1: 5, dp1_discount_rate: 0, dp2: 5, dp2_discount_rate: 0,
    installment_0: 9,  installment_0_discount_rate: 8,
    installment_1: 9,  installment_1_discount_rate: 8,
    installment_2: 9,  installment_2_discount_rate: 8,
    installment_3: 9,  installment_3_discount_rate: 8,
    installment_4: 9,  installment_4_discount_rate: 8,
    installment_5: 9,  installment_5_discount_rate: 8,
    installment_6: 9,  installment_6_discount_rate: 8,
    installment_7: 9,  installment_7_discount_rate: 8,
    installment_8: 9,  installment_8_discount_rate: 8,
    installment_9: 9,  installment_9_discount_rate: 8,
    installment_10: 9, installment_10_discount_rate: 8,
    disable_additional_discount: false, interest_rate: 18.5,
  },
  '5|2|flat|PLAN-A': {
    dp1: 25, dp1_discount_rate: 0, dp2: 15, dp2_discount_rate: 0,
    installment_0: 10, installment_0_discount_rate: 20,
    installment_1: 10, installment_1_discount_rate: 20,
    installment_2: 10, installment_2_discount_rate: 20,
    installment_3: 10, installment_3_discount_rate: 20,
    installment_4: 10, installment_4_discount_rate: 20,
    installment_5: 10, installment_5_discount_rate: 20,
    disable_additional_discount: true, interest_rate: 22.75,
  },
};

// ─── HELPERS ───
export function getMockKey(pid, yr, sc, code) {
  return `${pid}|${yr}|${sc}|${code}`;
}

export function mockFetch(pid, yr, sc, code) {
  const k = getMockKey(pid, yr, sc, code);
  return { success: true, data: Object.assign({}, MOCK_DB[k] || MOCK_SEEDS[k] || {}) };
}

export function mockSave(payload) {
  const k = getMockKey(payload.project_id, payload.year, payload.scheme, payload.payment_plan_code);
  if (!MOCK_DB[k]) MOCK_DB[k] = Object.assign({}, MOCK_SEEDS[k] || {});
  const rec = MOCK_DB[k];
  if (payload.disable_additional_discount !== undefined)
    rec.disable_additional_discount = payload.disable_additional_discount;
  if (payload.interest_rate !== undefined)
    rec.interest_rate = payload.interest_rate;
  if (payload.bulk_updates)
    payload.bulk_updates.forEach(it => applyIdx(rec, it.index, it.value, it.discount_rate));
  else if (payload.index !== undefined)
    applyIdx(rec, payload.index, payload.value, payload.discount_rate);
  return { success: true };
}

export function applyIdx(rec, idx, val, dr) {
  if (idx === 0) { rec.dp1 = val; rec.dp1_discount_rate = dr; }
  else if (idx === 1) { rec.dp2 = val; rec.dp2_discount_rate = dr; }
  else {
    const n = idx - 2;
    rec[`installment_${n}`] = val;
    rec[`installment_${n}_discount_rate`] = dr;
  }
}

export function mockDelete(pid, yr, sc, code) {
  const k = getMockKey(pid, yr, sc, code);
  if (MOCK_DB[k] || MOCK_SEEDS[k]) {
    delete MOCK_DB[k];
    return { success: true, message: 'Plan deleted successfully.' };
  }
  return { success: false, message: 'Plan not found.' };
}