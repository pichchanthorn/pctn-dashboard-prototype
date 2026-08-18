export type Customer = {
  id: string;
  name: string;
  phone: string;
  village: string;
  commune: string;
  province: string;
  landHa: number;
  crop: string;
  creditLimit: number;
  outstanding: number;
  risk: "low" | "medium" | "high";
  lastPurchase: string;
  initials: string;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  nameKh?: string;
  description?: string;
  category: string;
  unit: string;
  cashPrice: number;
  creditPrice: number;
  cost: number;
  stock: number;
  reorder: number;
  expiry?: string;
  active: boolean;
};

export type Category = {
  id: string;
  name: string;
  nameKh: string;
  color: string;
  description: string;
  productCount: number;
  totalValue: number;
};

export type Invoice = {
  id: string;
  no: string;
  date: string;
  customer: string;
  customerId: string;
  type: "cash" | "credit";
  season: string;
  total: number;
  paid: number;
  balance: number;
  status: "paid" | "partial" | "unpaid" | "overdue";
  dueDate?: string;
};

export type Payment = {
  id: string;
  date: string;
  customer: string;
  invoiceNo: string;
  method: "Cash" | "Bank" | "ABA" | "Wing";
  amount: number;
  by: string;
};

export type Season = {
  id: string;
  name: string;
  type: "Wet" | "Dry";
  start: string;
  end: string;
  sales: number;
  collected: number;
  outstanding: number;
  defaultRate: number;
  status: "active" | "closed" | "upcoming";
};

export type Supplier = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  owed: number;
  lastPO: string;
};

export const customers: Customer[] = [
  { id: "c1", name: "Sok Pisey", phone: "012 345 678", village: "Preah Damrei", commune: "Phnom Touch", province: "Battambang", landHa: 4.2, crop: "Rice", creditLimit: 2_000_000, outstanding: 1_240_000, risk: "low", lastPurchase: "2026-06-12", initials: "SP" },
  { id: "c2", name: "Chan Dara", phone: "017 882 901", village: "Trapeang Veng", commune: "Banteay Neang", province: "Battambang", landHa: 2.8, crop: "Rice", creditLimit: 1_500_000, outstanding: 980_000, risk: "low", lastPurchase: "2026-06-18", initials: "CD" },
  { id: "c3", name: "Meas Vanna", phone: "010 223 117", village: "Tuol Pongro", commune: "Kdol", province: "Battambang", landHa: 6.5, crop: "Rice + Cassava", creditLimit: 3_500_000, outstanding: 3_180_000, risk: "high", lastPurchase: "2026-05-04", initials: "MV" },
  { id: "c4", name: "Kim Sokha", phone: "078 441 002", village: "O Tabok", commune: "Maung", province: "Battambang", landHa: 1.5, crop: "Rice", creditLimit: 800_000, outstanding: 0, risk: "low", lastPurchase: "2026-06-22", initials: "KS" },
  { id: "c5", name: "Long Thida", phone: "092 110 558", village: "Khla Kham Chhke", commune: "Roka", province: "Battambang", landHa: 3.1, crop: "Rice", creditLimit: 1_800_000, outstanding: 620_000, risk: "medium", lastPurchase: "2026-06-09", initials: "LT" },
  { id: "c6", name: "Pich Sopheak", phone: "069 332 187", village: "Boeng Pruol", commune: "Snoeng", province: "Battambang", landHa: 5.8, crop: "Rice", creditLimit: 2_800_000, outstanding: 2_150_000, risk: "medium", lastPurchase: "2026-06-01", initials: "PS" },
  { id: "c7", name: "Nhem Bopha", phone: "086 220 991", village: "Andoung Pring", commune: "Kdol", province: "Battambang", landHa: 2.0, crop: "Vegetables", creditLimit: 1_000_000, outstanding: 420_000, risk: "low", lastPurchase: "2026-06-20", initials: "NB" },
  { id: "c8", name: "Heng Sambath", phone: "011 778 432", village: "Prey Khpos", commune: "Banteay Neang", province: "Battambang", landHa: 8.0, crop: "Rice", creditLimit: 4_000_000, outstanding: 3_650_000, risk: "high", lastPurchase: "2026-04-28", initials: "HS" },
];

export const products: Product[] = [
  { id: "p1",  sku: "FRT-001", name: "Urea Fertilizer 50kg",             nameKh: "ជីអ៊ុយរ៉េ ៥០គីឡូ",           description: "High-nitrogen fertilizer ideal for rice paddies. Promotes rapid vegetative growth and green colour.",                 category: "Chemical Fertilizer",  unit: "bag",    cashPrice: 145_000, creditPrice: 160_000, cost: 128_000, stock: 84,  reorder: 20, expiry: "2027-08-12", active: true },
  { id: "p2",  sku: "FRT-002", name: "DAP Fertilizer 50kg",              nameKh: "ជី DAP ៥០គីឡូ",               description: "Diammonium phosphate provides phosphorus and nitrogen. Best applied at planting for root establishment.",            category: "Chemical Fertilizer",  unit: "bag",    cashPrice: 195_000, creditPrice: 215_000, cost: 172_000, stock: 42,  reorder: 15, expiry: "2027-06-30", active: true },
  { id: "p3",  sku: "FRT-010", name: "Organic Compost 25kg",             nameKh: "ជីសរីរាង្គ ២៥គីឡូ",            description: "Natural compost from decomposed plant matter. Improves soil structure, water retention, and long-term fertility.",  category: "Organic Fertilizer",   unit: "bag",    cashPrice: 38_000,  creditPrice: 42_000,  cost: 30_000,  stock: 120, reorder: 30, active: true },
  { id: "p4",  sku: "PST-021", name: "Glyphosate Herbicide 1L",          nameKh: "ថ្នាំស្មៅ Glyphosate ១L",      description: "Broad-spectrum systemic herbicide. Effective against annual and perennial weeds before planting season.",             category: "Herbicide",            unit: "bottle", cashPrice: 32_000,  creditPrice: 36_000,  cost: 26_000,  stock: 18,  reorder: 25, expiry: "2026-09-15", active: true },
  { id: "p5",  sku: "PST-034", name: "Cypermethrin Insecticide 500ml",   nameKh: "ថ្នាំសត្វ Cypermethrin ៥០០ml", description: "Pyrethroid for broad-spectrum insect control. Targets stem borers, leaf folders, and thrips in rice.",               category: "Insecticide",          unit: "bottle", cashPrice: 28_000,  creditPrice: 31_500,  cost: 22_500,  stock: 56,  reorder: 20, expiry: "2027-01-10", active: true },
  { id: "p6",  sku: "PST-052", name: "Mancozeb Fungicide 1kg",           nameKh: "ថ្នាំផ្សិត Mancozeb ១គីឡូ",   description: "Protective fungicide for blast and sheath blight control. Apply preventively at tillering stage.",                    category: "Fungicide",            unit: "pack",   cashPrice: 45_000,  creditPrice: 50_000,  cost: 36_000,  stock: 8,   reorder: 15, expiry: "2026-08-04", active: true },
  { id: "p7",  sku: "SED-101", name: "IR504 Rice Seed 25kg",             nameKh: "ពូជស្រូវ IR504 ២៥គីឡូ",        description: "High-yielding semi-dwarf variety. Matures in 105 days. Suitable for both wet and dry season cultivation.",           category: "Rice Seed",            unit: "bag",    cashPrice: 175_000, creditPrice: 192_000, cost: 150_000, stock: 64,  reorder: 25, active: true },
  { id: "p8",  sku: "SED-108", name: "Phka Rumduol Rice Seed 25kg",      nameKh: "ពូជស្រូវផ្កា រំដួល ២៥គីឡូ",  description: "Premium fragrant variety. World's Best Rice award winner. Long grain, excellent aroma. Wet season only.",              category: "Rice Seed",            unit: "bag",    cashPrice: 210_000, creditPrice: 230_000, cost: 180_000, stock: 36,  reorder: 20, active: true },
  { id: "p9",  sku: "AGR-201", name: "Knapsack Sprayer 16L",             nameKh: "ម៉ាស៊ីនបាញ់ ១៦L",              description: "Manual backpack sprayer with adjustable nozzle. Durable polyethylene tank rated for all common pesticides.",          category: "Agricultural Product", unit: "unit",   cashPrice: 95_000,  creditPrice: 105_000, cost: 78_000,  stock: 14,  reorder: 5,  active: true },
  { id: "p10", sku: "FRT-005", name: "NPK 16-20-0 50kg",                 nameKh: "ជី NPK ១៦-២០-០ ៥០គីឡូ",       description: "Balanced NPK for panicle initiation. High phosphorus content supports grain filling and yield potential.",            category: "Chemical Fertilizer",  unit: "bag",    cashPrice: 168_000, creditPrice: 185_000, cost: 148_000, stock: 28,  reorder: 20, expiry: "2027-03-15", active: true },
  { id: "p11", sku: "FRT-008", name: "MOP Fertilizer 50kg",              nameKh: "ជី MOP ៥០គីឡូ",               description: "Muriate of potash. Increases plant resistance to disease and drought. Apply at panicle initiation.",                category: "Chemical Fertilizer",  unit: "bag",    cashPrice: 182_000, creditPrice: 200_000, cost: 160_000, stock: 0,   reorder: 10, expiry: "2027-05-20", active: true },
  { id: "p12", sku: "ORG-015", name: "Fish Amino Acid 1L",               nameKh: "ជីត្រីអាស៊ីដអាមីណូ ១L",       description: "Organic liquid fertilizer from fish byproducts. Enhances microbial activity and nutrient absorption rate.",           category: "Organic Fertilizer",   unit: "bottle", cashPrice: 22_000,  creditPrice: 25_000,  cost: 16_000,  stock: 45,  reorder: 20, active: true },
  { id: "p13", sku: "PST-067", name: "2,4-D Herbicide 1L",               nameKh: "ថ្នាំស្មៅ 2,4-D ១L",           description: "Selective systemic herbicide for broad-leaved weed control in rice. Post-emergence application only.",               category: "Herbicide",            unit: "bottle", cashPrice: 18_000,  creditPrice: 20_000,  cost: 14_000,  stock: 32,  reorder: 20, expiry: "2027-02-28", active: true },
  { id: "p14", sku: "AGR-310", name: "Hand Weeder",                      nameKh: "ឧបករណ៍ដកស្មៅ",               description: "Rotary hand weeder for inter-row weeding in rice paddies. Significantly reduces manual labour costs.",               category: "Agricultural Product", unit: "unit",   cashPrice: 35_000,  creditPrice: 38_000,  cost: 28_000,  stock: 22,  reorder: 5,  active: true },
  { id: "p15", sku: "SED-202", name: "Nerica Upland Rice Seed 20kg",     nameKh: "ពូជស្រូវ Nerica ២០គីឡូ",       description: "Upland rice tolerant to drought. Suitable for rain-fed areas with irregular water supply. No flooding required.",    category: "Rice Seed",            unit: "bag",    cashPrice: 145_000, creditPrice: 160_000, cost: 125_000, stock: 12,  reorder: 15, active: false },
];

export const categories: Category[] = [
  { id: "cat1", name: "Chemical Fertilizer",  nameKh: "ជីគីមី",               color: "emerald", description: "Synthetic fertilizers containing N, P, K and micronutrients for intensive rice farming.",      productCount: 5, totalValue: 86_432_000 },
  { id: "cat2", name: "Organic Fertilizer",   nameKh: "ជីសរីរាង្គ",           color: "lime",    description: "Natural fertilizers from plant or animal origin. Improves soil health and biodiversity.",       productCount: 2, totalValue: 5_265_000  },
  { id: "cat3", name: "Herbicide",            nameKh: "ថ្នាំបំបាត់ស្មៅ",        color: "amber",   description: "Chemical compounds used to control unwanted vegetation before and during cultivation.",         productCount: 2, totalValue: 1_152_000  },
  { id: "cat4", name: "Insecticide",          nameKh: "ថ្នាំសំលាប់សត្វល្អិត",  color: "orange",  description: "Pesticides targeting stem borers, leaf folders, and thrips common in Cambodian rice fields.",   productCount: 1, totalValue: 1_260_000  },
  { id: "cat5", name: "Fungicide",            nameKh: "ថ្នាំផ្សិត",             color: "violet",  description: "Agents for preventing and treating blast, sheath blight, and other fungal rice diseases.",     productCount: 1, totalValue: 288_000    },
  { id: "cat6", name: "Rice Seed",            nameKh: "ពូជស្រូវ",               color: "sky",     description: "Certified rice varieties for wet and dry seasons. Includes high-yield and aromatic types.",    productCount: 3, totalValue: 22_740_000 },
  { id: "cat7", name: "Agricultural Product", nameKh: "ផលិតផលកសិកម្ម",          color: "slate",   description: "Tools and equipment for field operations, spraying, weeding, and crop management.",            productCount: 2, totalValue: 2_100_000  },
];

export const invoices: Invoice[] = [
  { id: "i1", no: "INV-002418", date: "2026-06-28", customer: "Sok Pisey", customerId: "c1", type: "credit", season: "Wet 2026", total: 640_000, paid: 0, balance: 640_000, status: "unpaid", dueDate: "2026-11-30" },
  { id: "i2", no: "INV-002417", date: "2026-06-28", customer: "Kim Sokha", customerId: "c4", type: "cash", season: "Wet 2026", total: 215_000, paid: 215_000, balance: 0, status: "paid" },
  { id: "i3", no: "INV-002416", date: "2026-06-27", customer: "Chan Dara", customerId: "c2", type: "credit", season: "Wet 2026", total: 480_000, paid: 200_000, balance: 280_000, status: "partial", dueDate: "2026-11-30" },
  { id: "i4", no: "INV-002415", date: "2026-06-27", customer: "Meas Vanna", customerId: "c3", type: "credit", season: "Wet 2026", total: 920_000, paid: 0, balance: 920_000, status: "unpaid", dueDate: "2026-11-30" },
  { id: "i5", no: "INV-002414", date: "2026-06-26", customer: "Long Thida", customerId: "c5", type: "credit", season: "Wet 2026", total: 360_000, paid: 0, balance: 360_000, status: "unpaid", dueDate: "2026-11-30" },
  { id: "i6", no: "INV-002389", date: "2026-04-12", customer: "Heng Sambath", customerId: "c8", type: "credit", season: "Dry 2026", total: 1_240_000, paid: 0, balance: 1_240_000, status: "overdue", dueDate: "2026-05-30" },
  { id: "i7", no: "INV-002388", date: "2026-04-10", customer: "Meas Vanna", customerId: "c3", type: "credit", season: "Dry 2026", total: 880_000, paid: 0, balance: 880_000, status: "overdue", dueDate: "2026-05-30" },
  { id: "i8", no: "INV-002413", date: "2026-06-25", customer: "Nhem Bopha", customerId: "c7", type: "cash", season: "Wet 2026", total: 145_000, paid: 145_000, balance: 0, status: "paid" },
  { id: "i9", no: "INV-002412", date: "2026-06-24", customer: "Pich Sopheak", customerId: "c6", type: "credit", season: "Wet 2026", total: 720_000, paid: 200_000, balance: 520_000, status: "partial", dueDate: "2026-11-30" },
  { id: "i10", no: "INV-002411", date: "2026-06-23", customer: "Sok Pisey", customerId: "c1", type: "credit", season: "Wet 2026", total: 600_000, paid: 0, balance: 600_000, status: "unpaid", dueDate: "2026-11-30" },
];

export const payments: Payment[] = [
  { id: "pay1", date: "2026-06-28", customer: "Chan Dara", invoiceNo: "INV-002416", method: "Cash", amount: 200_000, by: "Sokun" },
  { id: "pay2", date: "2026-06-26", customer: "Pich Sopheak", invoiceNo: "INV-002412", method: "ABA", amount: 200_000, by: "Sokun" },
  { id: "pay3", date: "2026-06-22", customer: "Kim Sokha", invoiceNo: "INV-002417", method: "Cash", amount: 215_000, by: "Mealea" },
  { id: "pay4", date: "2026-06-20", customer: "Nhem Bopha", invoiceNo: "INV-002413", method: "Wing", amount: 145_000, by: "Sokun" },
  { id: "pay5", date: "2026-06-18", customer: "Long Thida", invoiceNo: "INV-002390", method: "Cash", amount: 380_000, by: "Mealea" },
];

export const seasons: Season[] = [
  { id: "s1", name: "Wet Season 2026", type: "Wet", start: "2026-05-01", end: "2026-12-15", sales: 28_400_000, collected: 4_200_000, outstanding: 24_200_000, defaultRate: 0, status: "active" },
  { id: "s2", name: "Dry Season 2026", type: "Dry", start: "2025-12-01", end: "2026-05-15", sales: 18_900_000, collected: 14_200_000, outstanding: 4_700_000, defaultRate: 8, status: "closed" },
  { id: "s3", name: "Wet Season 2025", type: "Wet", start: "2025-05-01", end: "2025-12-15", sales: 24_100_000, collected: 22_900_000, outstanding: 1_200_000, defaultRate: 5, status: "closed" },
];

export const suppliers: Supplier[] = [
  { id: "sup1", name: "Mekong Agri Imports", contact: "Mr. Vibol", phone: "023 884 002", owed: 4_200_000, lastPO: "2026-06-18" },
  { id: "sup2", name: "Cambodia Seed Co.", contact: "Ms. Channary", phone: "012 770 118", owed: 1_800_000, lastPO: "2026-06-10" },
  { id: "sup3", name: "Phnom Penh Chemicals", contact: "Mr. Sothea", phone: "017 220 991", owed: 0, lastPO: "2026-05-28" },
  { id: "sup4", name: "Battambang Fertilizer Depot", contact: "Mr. Rithy", phone: "086 119 002", owed: 2_650_000, lastPO: "2026-06-20" },
];

export const salesTrend = [
  { date: "Jun 22", cash: 1_240_000, credit: 1_840_000 },
  { date: "Jun 23", cash: 980_000, credit: 2_100_000 },
  { date: "Jun 24", cash: 1_120_000, credit: 2_640_000 },
  { date: "Jun 25", cash: 880_000, credit: 1_980_000 },
  { date: "Jun 26", cash: 1_460_000, credit: 2_220_000 },
  { date: "Jun 27", cash: 1_380_000, credit: 3_100_000 },
  { date: "Jun 28", cash: 1_580_000, credit: 2_780_000 },
];

export const aging = [
  { bucket: "0–30", amount: 14_200_000 },
  { bucket: "31–60", amount: 6_400_000 },
  { bucket: "61–90", amount: 2_800_000 },
  { bucket: "90+", amount: 1_900_000 },
];

export const seasonFlow = [
  { month: "Jan", disbursed: 1_200_000, collected: 600_000 },
  { month: "Feb", disbursed: 2_100_000, collected: 800_000 },
  { month: "Mar", disbursed: 2_800_000, collected: 1_400_000 },
  { month: "Apr", disbursed: 3_400_000, collected: 2_200_000 },
  { month: "May", disbursed: 4_100_000, collected: 3_800_000 },
  { month: "Jun", disbursed: 5_200_000, collected: 4_400_000 },
];

export const notifications = [
  { id: "n1", type: "debt", severity: "high", title: "Heng Sambath is 29 days overdue", desc: "INV-002389 · 1,240,000 ៛", time: "2h ago" },
  { id: "n2", type: "debt", severity: "high", title: "Meas Vanna is 29 days overdue", desc: "INV-002388 · 880,000 ៛", time: "2h ago" },
  { id: "n3", type: "stock", severity: "medium", title: "Mancozeb Fungicide low stock", desc: "8 units left · reorder at 15", time: "5h ago" },
  { id: "n4", type: "stock", severity: "medium", title: "Glyphosate Herbicide expiring soon", desc: "Batch B-2024-08 expires Sep 15", time: "1d ago" },
  { id: "n5", type: "system", severity: "low", title: "Daily backup completed", desc: "All data backed up successfully", time: "1d ago" },
];
