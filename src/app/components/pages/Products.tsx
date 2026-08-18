import { useState, useMemo } from "react";
import {
  Search, Plus, Download, Edit2, Trash2,
  ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight,
  FlaskConical, Leaf, Droplet, Bug, Shield, Wheat, Wrench, Package2,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard } from "../shell/Primitives";
import { Button } from "../ui/button";
import { products as allProducts, categories, type Product } from "../../lib/mock";
import { fmtKHR, fmtKHRShort } from "../../lib/format";
import { useApp } from "../../lib/AppContext";
import { toast } from "sonner";
import { cn } from "../ui/utils";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PAGE = 10;

type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

function stockStatus(p: Product): StockStatus {
  if (p.stock === 0) return "out-of-stock";
  if (p.stock <= p.reorder) return "low-stock";
  return "in-stock";
}

type SortKey = "name-asc" | "name-desc" | "stock-asc" | "stock-desc" | "price-asc" | "price-desc";

// Category → color mapping (alpha-based so light+dark both work)
const CAT_COLOR: Record<string, { bg: string; text: string; icon: any }> = {
  "Chemical Fertilizer":  { bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-400", icon: FlaskConical },
  "Organic Fertilizer":   { bg: "bg-lime-500/15",    text: "text-lime-600 dark:text-lime-400",       icon: Leaf        },
  "Herbicide":            { bg: "bg-amber-500/15",   text: "text-amber-600 dark:text-amber-400",     icon: Droplet     },
  "Insecticide":          { bg: "bg-orange-500/15",  text: "text-orange-600 dark:text-orange-400",   icon: Bug         },
  "Fungicide":            { bg: "bg-violet-500/15",  text: "text-violet-600 dark:text-violet-400",   icon: Shield      },
  "Rice Seed":            { bg: "bg-sky-500/15",     text: "text-sky-600 dark:text-sky-400",         icon: Wheat       },
  "Agricultural Product": { bg: "bg-slate-500/15",   text: "text-slate-600 dark:text-slate-400",     icon: Wrench      },
};

const CAT_DOT: Record<string, string> = {
  "Chemical Fertilizer":  "bg-emerald-500",
  "Organic Fertilizer":   "bg-lime-500",
  "Herbicide":            "bg-amber-500",
  "Insecticide":          "bg-orange-500",
  "Fungicide":            "bg-violet-500",
  "Rice Seed":            "bg-sky-500",
  "Agricultural Product": "bg-slate-500",
};

export function ProductTile({ category }: { category: string }) {
  const c = CAT_COLOR[category] ?? { bg: "bg-muted", text: "text-muted-foreground", icon: Package2 };
  const Icon = c.icon;
  return (
    <div className={cn("size-10 rounded-xl flex items-center justify-center shrink-0", c.bg)}>
      <Icon className={cn("size-5", c.text)} />
    </div>
  );
}

function StockPill({ p }: { p: Product }) {
  const s = stockStatus(p);
  if (s === "out-of-stock") return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ring-1 ring-inset bg-rose-500/15 text-rose-500 ring-rose-500/25"><span className="size-1.5 rounded-full bg-rose-500" />Out of stock</span>;
  if (s === "low-stock")    return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ring-1 ring-inset bg-amber-500/15 text-amber-500 ring-amber-500/25"><span className="size-1.5 rounded-full bg-amber-500" />Low stock</span>;
  return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ring-1 ring-inset bg-emerald-500/15 text-emerald-500 ring-emerald-500/25"><span className="size-1.5 rounded-full bg-emerald-500" />In stock</span>;
}

// ─── Products list tab ────────────────────────────────────────────────────────

function ProductsList() {
  const { openProduct, openDialog, products, deleteProduct } = useApp();
  const [q, setQ]                 = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatus] = useState("all");
  const [sort, setSort]           = useState<SortKey>("name-asc");
  const [page, setPage]           = useState(1);
  const [deleteId, setDeleteId]   = useState<string | null>(null);

  const catNames = Array.from(new Set(products.map(p => p.category)));

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      if (catFilter !== "all" && p.category !== catFilter) return false;
      if (statusFilter !== "all" && stockStatus(p) !== statusFilter) return false;
      if (q) {
        const lq = q.toLowerCase();
        if (!p.name.toLowerCase().includes(lq) && !p.sku.toLowerCase().includes(lq) && !(p.nameKh ?? "").includes(lq)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "name-asc")   return a.name.localeCompare(b.name);
      if (sort === "name-desc")  return b.name.localeCompare(a.name);
      if (sort === "stock-asc")  return a.stock - b.stock;
      if (sort === "stock-desc") return b.stock - a.stock;
      if (sort === "price-asc")  return a.cashPrice - b.cashPrice;
      if (sort === "price-desc") return b.cashPrice - a.cashPrice;
      return 0;
    });
    return list;
  }, [products, q, catFilter, statusFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const paged = filtered.slice((page - 1) * PAGE, page * PAGE);

  const cyclSort = (key: "name" | "stock" | "price") => {
    setPage(1);
    setSort(s => {
      if (s === `${key}-asc`)  return `${key}-desc` as SortKey;
      if (s === `${key}-desc`) return `${key}-asc`  as SortKey;
      return `${key}-asc` as SortKey;
    });
  };

  const SortIcon = ({ k }: { k: "name" | "stock" | "price" }) => {
    if (sort === `${k}-asc`)  return <ArrowUp className="size-3 ml-1" />;
    if (sort === `${k}-desc`) return <ArrowDown className="size-3 ml-1" />;
    return <ArrowUpDown className="size-3 ml-1 opacity-30" />;
  };

  const confirmDelete = (id: string) => {
    deleteProduct(id);
    setDeleteId(null);
    toast.success("Product deleted");
  };

  const inStock  = products.filter(p => stockStatus(p) === "in-stock").length;
  const lowStock = products.filter(p => stockStatus(p) === "low-stock").length;
  const outStock = products.filter(p => stockStatus(p) === "out-of-stock").length;

  return (
    <div>
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total products"  value={products.length} />
        <StatCard label="In stock"        value={inStock}    intent="positive" />
        <StatCard label="Low stock"       value={lowStock}   intent="warning" />
        <StatCard label="Out of stock"    value={outStock}   intent="danger" />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1); }}
            placeholder="Search by name, SKU, or Khmer name…"
            className="w-full h-10 pl-10 pr-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
        <select
          value={catFilter}
          onChange={e => { setCatFilter(e.target.value); setPage(1); }}
          className="h-10 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          <option value="all">All categories</option>
          {catNames.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="h-10 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          <option value="all">All statuses</option>
          <option value="in-stock">In stock</option>
          <option value="low-stock">Low stock</option>
          <option value="out-of-stock">Out of stock</option>
        </select>
        <Button
          variant="outline"
          className="h-10"
          onClick={() => toast.success("Export started")}
        >
          <Download className="size-4" /> Export
        </Button>
      </div>

      {/* Table */}
      <SectionCard>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-5 py-3 w-12"></th>
                <th className="px-5 py-3">
                  <button className="flex items-center hover:text-foreground transition" onClick={() => cyclSort("name")}>
                    Product <SortIcon k="name" />
                  </button>
                </th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Unit</th>
                <th className="px-5 py-3 text-right">
                  <button className="flex items-center hover:text-foreground transition ml-auto" onClick={() => cyclSort("stock")}>
                    Stock <SortIcon k="stock" />
                  </button>
                </th>
                <th className="px-5 py-3 text-right">Purchase</th>
                <th className="px-5 py-3 text-right">
                  <button className="flex items-center hover:text-foreground transition ml-auto" onClick={() => cyclSort("price")}>
                    Cash <SortIcon k="price" />
                  </button>
                </th>
                <th className="px-5 py-3 text-right">Credit</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map(p => (
                <tr
                  key={p.id}
                  onClick={() => openProduct(p.id)}
                  className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer"
                >
                  <td className="px-5 py-3">
                    <ProductTile category={p.category} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-medium truncate max-w-[200px]">{p.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-mono">{p.sku}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1.5">
                      <span className={cn("size-2 rounded-full shrink-0", CAT_DOT[p.category] ?? "bg-muted")} />
                      <span className="text-muted-foreground">{p.category}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{p.unit}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="tabular-nums">{p.stock}</div>
                    <div className="mt-1.5 w-16 ml-auto h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn("h-full", p.stock === 0 ? "bg-rose-500" : p.stock <= p.reorder ? "bg-amber-500" : "bg-emerald-500")}
                        style={{ width: `${Math.min(100, (p.stock / (p.reorder * 3)) * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{fmtKHR(p.cost)}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{fmtKHR(p.cashPrice)}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-violet-500">{fmtKHR(p.creditPrice)}</td>
                  <td className="px-5 py-3"><StockPill p={p} /></td>
                  <td className="px-5 py-3" onClick={e => e.stopPropagation()}>
                    {deleteId === p.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          className="h-7 px-2 rounded-md bg-rose-500 text-white text-xs hover:bg-rose-600 transition"
                          onClick={() => confirmDelete(p.id)}
                        >Yes</button>
                        <button
                          className="h-7 px-2 rounded-md border border-border text-xs hover:bg-accent transition"
                          onClick={() => setDeleteId(null)}
                        >No</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                        <button
                          className="size-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground transition"
                          onClick={() => openDialog("edit-product", p)}
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          className="size-7 rounded-md hover:bg-rose-500/15 hover:text-rose-500 flex items-center justify-center text-muted-foreground transition"
                          onClick={() => setDeleteId(p.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-12 rounded-2xl bg-muted flex items-center justify-center">
                        <Package2 className="size-5 text-muted-foreground" />
                      </div>
                      <div className="text-sm text-muted-foreground">No products match your filters.</div>
                      <Button variant="outline" className="h-8 text-xs" onClick={() => { setQ(""); setCatFilter("all"); setStatus("all"); }}>
                        Clear filters
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 text-xs text-muted-foreground">
          <div>
            {filtered.length === 0 ? "No results" : `Showing ${(page - 1) * PAGE + 1}–${Math.min(page * PAGE, filtered.length)} of ${filtered.length}`}
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="size-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={cn(
                  "size-8 rounded-lg border text-xs transition",
                  n === page
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "border-border hover:bg-accent"
                )}
              >
                {n}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="size-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Categories tab ───────────────────────────────────────────────────────────

function CategoriesGrid() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{categories.length} categories · {allProducts.length} total products</p>
        <Button onClick={() => toast.info("Add category dialog")} className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="size-4" /> Add Category
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map(cat => {
          const cfg = CAT_COLOR[cat.name] ?? { bg: "bg-muted", text: "text-muted-foreground", icon: Package2 };
          const Icon = cfg.icon;
          const catProds = allProducts.filter(p => p.category === cat.name);
          const inSt  = catProds.filter(p => stockStatus(p) === "in-stock").length;
          const lowSt = catProds.filter(p => stockStatus(p) === "low-stock").length;
          const outSt = catProds.filter(p => stockStatus(p) === "out-of-stock").length;

          return (
            <div
              key={cat.id}
              className="rounded-2xl border border-border bg-card p-5 hover:shadow-[0_4px_12px_rgba(16,24,40,0.06)] transition group"
            >
              <div className="flex items-start gap-4">
                <div className={cn("size-11 rounded-xl flex items-center justify-center shrink-0", cfg.bg)}>
                  <Icon className={cn("size-5", cfg.text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate">{cat.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">{cat.nameKh}</div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button className="size-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground" onClick={() => toast.info(`Edit ${cat.name}`)}>
                    <Edit2 className="size-3.5" />
                  </button>
                  <button className="size-7 rounded-md hover:bg-rose-500/15 hover:text-rose-500 flex items-center justify-center text-muted-foreground" onClick={() => toast.error("Cannot delete category with products")}>
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{cat.description}</p>

              <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-muted-foreground">Products</div>
                  <div className="mt-1">{cat.productCount}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Stock value</div>
                  <div className="mt-1 tabular-nums">{fmtKHRShort(cat.totalValue)}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs">
                {inSt  > 0 && <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">{inSt} in stock</span>}
                {lowSt > 0 && <span className="px-2 py-0.5 rounded-full bg-amber-500/15  text-amber-600  dark:text-amber-400">{lowSt} low</span>}
                {outSt > 0 && <span className="px-2 py-0.5 rounded-full bg-rose-500/15   text-rose-600   dark:text-rose-400">{outSt} out</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page shell ──────────────────────────────────────────────────────────────

type ProductsTab = "products" | "categories";

export function ProductsPage() {
  const { openDialog } = useApp();
  const [tab, setTab] = useState<ProductsTab>("products");

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your product catalog, pricing, and stock levels."
        actions={
          <>
            <Button variant="outline" className="h-9" onClick={() => toast.success("Export started")}>
              <Download className="size-4" /> Export
            </Button>
            <Button className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => openDialog("add-product")}>
              <Plus className="size-4" /> Add Product
            </Button>
          </>
        }
      />

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-6 border-b border-border">
        {(["products", "categories"] as ProductsTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 h-10 text-sm relative capitalize",
              tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t}
            {tab === t && <span className="absolute bottom-[-1px] inset-x-0 h-0.5 bg-emerald-600 rounded-full" />}
          </button>
        ))}
      </div>

      {tab === "products"   && <ProductsList />}
      {tab === "categories" && <CategoriesGrid />}
    </div>
  );
}

// ─── Categories page (sidebar nav target) ─────────────────────────────────────

export function CategoriesPage() {
  const { go } = useApp();
  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organise your product catalogue into categories."
        actions={
          <Button className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => toast.info("Add category dialog")}>
            <Plus className="size-4" /> Add Category
          </Button>
        }
      />
      <div className="mb-4 p-3 rounded-xl bg-muted/40 border border-border text-sm text-muted-foreground flex items-center gap-2">
        <span>You can also manage categories from the</span>
        <button onClick={() => go("products")} className="text-emerald-600 dark:text-emerald-400 underline-offset-2 hover:underline">Products → Categories tab</button>.
      </div>
      <CategoriesGrid />
    </div>
  );
}
