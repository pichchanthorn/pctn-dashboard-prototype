// Per-season data that changes when the user switches seasons.
// Each key matches a Season.id from mock.ts.

export type SeasonStats = {
  todaySales: number;
  outstanding: number;
  overdue: number;
  cashInHand: number;
  lowStockCount: number;
  expiringCount: number;
  collectionRate: number;    // 0–100
  defaultRate: number;       // 0–100
  totalSales: number;
  totalCollected: number;
};

export type TrendPoint   = { date: string; cash: number; credit: number };
export type AgingPoint   = { bucket: string; amount: number };
export type FlowPoint    = { month: string; disbursed: number; collected: number };
export type NotifItem    = { id: string; type: "debt"|"stock"|"system"; severity: "high"|"medium"|"low"; title: string; desc: string; time: string };

export type SeasonData = {
  stats: SeasonStats;
  salesTrend: TrendPoint[];
  aging: AgingPoint[];
  seasonFlow: FlowPoint[];
  notifications: NotifItem[];
  invoiceIds: string[];   // which invoices belong to this season
};

// ─── Wet Season 2026 (s1) ───────────────────────────────────────────────────
const s1: SeasonData = {
  stats: {
    todaySales: 4_360_000, outstanding: 25_300_000, overdue: 2_120_000,
    cashInHand: 8_240_000, lowStockCount: 7, expiringCount: 3,
    collectionRate: 15, defaultRate: 0, totalSales: 28_400_000, totalCollected: 4_200_000,
  },
  salesTrend: [
    { date: "Jun 22", cash: 1_240_000, credit: 1_840_000 },
    { date: "Jun 23", cash: 980_000,  credit: 2_100_000 },
    { date: "Jun 24", cash: 1_120_000, credit: 2_640_000 },
    { date: "Jun 25", cash: 880_000,  credit: 1_980_000 },
    { date: "Jun 26", cash: 1_460_000, credit: 2_220_000 },
    { date: "Jun 27", cash: 1_380_000, credit: 3_100_000 },
    { date: "Jun 28", cash: 1_580_000, credit: 2_780_000 },
  ],
  aging: [
    { bucket: "0–30",  amount: 14_200_000 },
    { bucket: "31–60", amount: 6_400_000  },
    { bucket: "61–90", amount: 2_800_000  },
    { bucket: "90+",   amount: 1_900_000  },
  ],
  seasonFlow: [
    { month: "May",  disbursed: 3_200_000,  collected: 0 },
    { month: "Jun",  disbursed: 9_400_000,  collected: 4_200_000 },
    { month: "Jul",  disbursed: 6_200_000,  collected: 0 },
    { month: "Aug",  disbursed: 4_800_000,  collected: 0 },
    { month: "Sep",  disbursed: 2_400_000,  collected: 0 },
    { month: "Nov",  disbursed: 0,          collected: 0 },
  ],
  notifications: [
    { id:"n1", type:"debt",   severity:"high",   title:"Heng Sambath is 29 days overdue",  desc:"INV-002389 · 1,240,000 ៛", time:"2h ago" },
    { id:"n2", type:"debt",   severity:"high",   title:"Meas Vanna is 29 days overdue",   desc:"INV-002388 · 880,000 ៛",  time:"2h ago" },
    { id:"n3", type:"stock",  severity:"medium", title:"Mancozeb Fungicide low stock",     desc:"8 units left · reorder at 15", time:"5h ago" },
    { id:"n4", type:"stock",  severity:"medium", title:"Glyphosate Herbicide expiring soon",desc:"Batch B-2024-08 expires Sep 15", time:"1d ago" },
    { id:"n5", type:"system", severity:"low",    title:"Daily backup completed",           desc:"All data backed up successfully", time:"1d ago" },
  ],
  invoiceIds: ["i1","i2","i3","i4","i5","i8","i9","i10"],
};

// ─── Dry Season 2026 (s2) ───────────────────────────────────────────────────
const s2: SeasonData = {
  stats: {
    todaySales: 0, outstanding: 4_700_000, overdue: 4_700_000,
    cashInHand: 12_800_000, lowStockCount: 2, expiringCount: 1,
    collectionRate: 75, defaultRate: 8, totalSales: 18_900_000, totalCollected: 14_200_000,
  },
  salesTrend: [
    { date: "Jan",  cash: 2_100_000, credit: 1_400_000 },
    { date: "Feb",  cash: 2_800_000, credit: 3_200_000 },
    { date: "Mar",  cash: 1_900_000, credit: 4_100_000 },
    { date: "Apr",  cash: 1_200_000, credit: 2_200_000 },
    { date: "May",  cash: 500_000,   credit: 400_000   },
  ],
  aging: [
    { bucket: "0–30",  amount: 0         },
    { bucket: "31–60", amount: 800_000   },
    { bucket: "61–90", amount: 1_900_000 },
    { bucket: "90+",   amount: 2_000_000 },
  ],
  seasonFlow: [
    { month: "Dec",  disbursed: 2_100_000,  collected: 800_000  },
    { month: "Jan",  disbursed: 3_500_000,  collected: 2_200_000 },
    { month: "Feb",  disbursed: 5_200_000,  collected: 3_800_000 },
    { month: "Mar",  disbursed: 4_100_000,  collected: 4_400_000 },
    { month: "Apr",  disbursed: 3_200_000,  collected: 2_600_000 },
    { month: "May",  disbursed: 800_000,    collected: 400_000   },
  ],
  notifications: [
    { id:"n1", type:"debt",   severity:"high",   title:"Season closed — 4 invoices still open",    desc:"4,700,000 ៛ outstanding",      time:"30d ago" },
    { id:"n2", type:"debt",   severity:"high",   title:"Heng Sambath — no payment after harvest", desc:"3,650,000 ៛ balance",          time:"25d ago" },
    { id:"n3", type:"system", severity:"low",    title:"Dry Season 2026 closed",                  desc:"Collection rate: 75%",         time:"45d ago" },
  ],
  invoiceIds: ["i6","i7"],
};

// ─── Wet Season 2025 (s3) ───────────────────────────────────────────────────
const s3: SeasonData = {
  stats: {
    todaySales: 0, outstanding: 1_200_000, overdue: 0,
    cashInHand: 22_400_000, lowStockCount: 0, expiringCount: 0,
    collectionRate: 95, defaultRate: 5, totalSales: 24_100_000, totalCollected: 22_900_000,
  },
  salesTrend: [
    { date: "Jun",  cash: 1_800_000, credit: 2_400_000 },
    { date: "Jul",  cash: 2_100_000, credit: 3_800_000 },
    { date: "Aug",  cash: 1_600_000, credit: 3_200_000 },
    { date: "Sep",  cash: 900_000,   credit: 2_100_000 },
    { date: "Oct",  cash: 600_000,   credit: 1_400_000 },
    { date: "Nov",  cash: 400_000,   collected: 0, credit: 800_000 } as any,
  ],
  aging: [
    { bucket: "0–30",  amount: 0         },
    { bucket: "31–60", amount: 0         },
    { bucket: "61–90", amount: 400_000   },
    { bucket: "90+",   amount: 800_000   },
  ],
  seasonFlow: [
    { month: "May",  disbursed: 2_800_000,  collected: 0         },
    { month: "Jun",  disbursed: 5_400_000,  collected: 1_200_000 },
    { month: "Jul",  disbursed: 7_200_000,  collected: 3_400_000 },
    { month: "Aug",  disbursed: 4_100_000,  collected: 6_200_000 },
    { month: "Sep",  disbursed: 2_200_000,  collected: 7_800_000 },
    { month: "Nov",  disbursed: 800_000,    collected: 4_300_000 },
  ],
  notifications: [
    { id:"n1", type:"system", severity:"low",    title:"Wet Season 2025 fully closed", desc:"Collection rate: 95% — excellent", time:"200d ago" },
    { id:"n2", type:"debt",   severity:"medium", title:"3 invoices still unpaid",      desc:"1,200,000 ៛ remaining",           time:"180d ago" },
  ],
  invoiceIds: [],
};

export const ALL_SEASON_DATA: Record<string, SeasonData> = {
  s1, s2, s3,
};
