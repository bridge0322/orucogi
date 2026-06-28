export interface Record_ {
  t: number;
  principal: number;
  value: number;
}

export interface Feast {
  t: number;
  food: string;
  rank: number;
  amount: number;
}

export interface TrackerData {
  records: Record_[];
  xp: number;
  feasts: Feast[];
}

const STORE_KEY = "orucogi_personal_v1";

export function migrate(d: Partial<TrackerData> & Record<string, unknown>): TrackerData {
  if (!d.records) d.records = [];
  if (typeof d.xp !== "number") d.xp = 0;
  if (!Array.isArray(d.feasts)) d.feasts = [];
  return d as TrackerData;
}

export function loadData(): TrackerData {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return migrate(JSON.parse(raw));
  } catch {
    // ignore
  }
  const now = Date.now(), day = 86400000;
  return migrate({
    records: [
      { t: now - day * 30, principal: 900000, value: 1380000 },
      { t: now, principal: 1236000, value: 1012000 },
    ],
    xp: 0,
    feasts: [],
  });
}

export function saveData(d: TrackerData) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(d));
  } catch {
    // ignore
  }
}
