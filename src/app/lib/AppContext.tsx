import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
import { NavKey } from "../components/shell/Sidebar";
import { seasons, products as initialProducts, type Product } from "./mock";
import { ALL_SEASON_DATA, SeasonData } from "./seasonData";

export type DialogKind =
  | "new-customer" | "record-payment" | "new-product" | "new-invoice"
  | "new-season" | "add-product" | "edit-product"
  | null;

type Theme = "light" | "dark";

type AppState = {
  active: NavKey;
  customerId: string | null;
  invoiceId: string | null;
  productId: string | null;
  dialog: DialogKind;
  dialogData: any;
  paletteOpen: boolean;
  theme: Theme;
  activeSeasonId: string;
  seasonData: SeasonData;
  products: Product[];
};

type AppActions = {
  go: (k: NavKey) => void;
  openCustomer: (id: string) => void;
  closeCustomer: () => void;
  openInvoice: (id: string) => void;
  closeInvoice: () => void;
  openProduct: (id: string) => void;
  closeProduct: () => void;
  openDialog: (kind: Exclude<DialogKind, null>, data?: any) => void;
  closeDialog: () => void;
  setPalette: (v: boolean) => void;
  toggleTheme: () => void;
  setActiveSeasonId: (id: string) => void;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
};

const Ctx = createContext<(AppState & AppActions) | null>(null);

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem("agri-theme");
    if (saved === "dark" || saved === "light") return saved;
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  } catch {}
  return "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try { localStorage.setItem("agri-theme", theme); } catch {}
}

function getInitialSeason(): string {
  try {
    const saved = localStorage.getItem("agri-season");
    if (saved && ALL_SEASON_DATA[saved]) return saved;
  } catch {}
  return seasons.find(s => s.status === "active")?.id ?? seasons[0].id;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [active, setActive]           = useState<NavKey>("dashboard");
  const [customerId, setCustomerId]   = useState<string | null>(null);
  const [invoiceId, setInvoiceId]     = useState<string | null>(null);
  const [productId, setProductId]     = useState<string | null>(null);
  const [products, setProducts]       = useState<Product[]>(initialProducts);
  const [dialog, setDialog]           = useState<DialogKind>(null);
  const [dialogData, setDialogData]   = useState<any>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [theme, setTheme]             = useState<Theme>(getInitialTheme);
  const [activeSeasonId, setSeasonId] = useState<string>(getInitialSeason);

  const seasonData = useMemo(
    () => ALL_SEASON_DATA[activeSeasonId] ?? ALL_SEASON_DATA["s1"],
    [activeSeasonId]
  );

  useEffect(() => { applyTheme(theme); }, [theme]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(v => !v);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const setActiveSeasonId = (id: string) => {
    setSeasonId(id);
    try { localStorage.setItem("agri-season", id); } catch {}
  };

  const value: AppState & AppActions = {
    active, customerId, invoiceId, productId, dialog, dialogData,
    paletteOpen, theme, activeSeasonId, seasonData, products,
    go:            (k) => { setActive(k); setCustomerId(null); setInvoiceId(null); setProductId(null); },
    openCustomer:  (id) => { setActive("customers"); setCustomerId(id); },
    closeCustomer: ()   => setCustomerId(null),
    openInvoice:   (id) => setInvoiceId(id),
    closeInvoice:  ()   => setInvoiceId(null),
    openProduct:   (id) => setProductId(id),
    closeProduct:  ()   => setProductId(null),
    openDialog:    (kind, data) => { setDialog(kind); setDialogData(data); },
    closeDialog:   ()   => { setDialog(null); setDialogData(null); },
    setPalette:    setPaletteOpen,
    toggleTheme:   () => setTheme(t => t === "light" ? "dark" : "light"),
    setActiveSeasonId,
    addProduct:    (p) => setProducts(prev => [p, ...prev]),
    updateProduct: (p) => setProducts(prev => prev.map(x => x.id === p.id ? p : x)),
    deleteProduct: (id) => setProducts(prev => prev.filter(x => x.id !== id)),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp outside provider");
  return v;
}
