import { useState, useMemo } from "react";
import { Search, Plus, Download, Filter, MoreHorizontal, Package, AlertTriangle, CalendarClock, ArrowUpRight, ArrowDownRight, Settings2 } from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusPill } from "../shell/Primitives";
import { Button } from "../ui/button";
import { products } from "../../lib/mock";
import { fmtKHR, fmtKHRShort, fmtDate, daysBetween } from "../../lib/format";
import { useApp } from "../../lib/AppContext";
import { toast } from "sonner";

export function Inventory() {
  const { openDialog } = useApp();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"products" | "categories" | "batches" | "movements" | "expiry">("products");
  const lowStock = products.filter(p => p.stock <= p.reorder);
  const totalValue = products.reduce((s, p) => s + p.stock * p.cost, 0);

  return (
    <div>
      <PageHeader
        title="Inventory"
        description={`${products.length} products tracked`}
        actions={
          <>
            <Button variant="outline" className="h-9" onClick={() => toast.success("Export started")}><Download className="size-4" /> Export</Button>
            <Button onClick={() => openDialog("new-product")} className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="size-4" /> New Product</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total products" value={products.length} icon={<Package className="size-4" />} />
        <StatCard label="Inventory value" value={fmtKHRShort(totalValue)} hint="at cost" />
        <StatCard label="Low stock" value={lowStock.length} intent="warning" icon={<AlertTriangle className="size-4" />} />
        <StatCard label="Expiring ≤30d" value={3} intent="warning" icon={<CalendarClock className="size-4" />} />
      </div>

      <div className="flex items-center gap-1 mb-6 border-b border-border overflow-x-auto">
        {(["products", "categories", "batches", "movements", "expiry"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={
            "px-4 h-10 text-sm relative capitalize whitespace-nowrap " + (tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground")
          }>
            {t}
            {tab === t && <span className="absolute bottom-[-1px] inset-x-0 h-0.5 bg-emerald-600 rounded-full" />}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <>
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products by name or SKU" className="w-full h-10 pl-10 pr-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
            </div>
            <Button variant="outline" className="h-10"><Filter className="size-4" /> Category</Button>
            <Button variant="outline" className="h-10">Stock</Button>
          </div>
          <SectionCard>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="px-5 py-3">SKU</th>
                    <th className="px-5 py-3">Product</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3 text-right">Cash Price</th>
                    <th className="px-5 py-3 text-right">Credit Price</th>
                    <th className="px-5 py-3 text-right">Stock</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.filter(p => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase())).map(p => (
                    <tr key={p.id} onClick={() => toast.info(`Open ${p.name}`)} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer">
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{p.sku}</td>
                      <td className="px-5 py-3">{p.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{p.category}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{fmtKHR(p.cashPrice)}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-violet-700">{fmtKHR(p.creditPrice)}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{p.stock} <span className="text-muted-foreground text-xs">{p.unit}</span></td>
                      <td className="px-5 py-3">
                        {p.stock === 0 ? <StatusPill status="overdue" /> :
                         p.stock <= p.reorder ? <StatusPill status="medium" /> :
                         <StatusPill status="low" />}
                      </td>
                      <td className="px-5 py-3"><MoreHorizontal className="size-4 text-muted-foreground" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </>
      )}

      {tab === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from(new Set(products.map(p => p.category))).map(cat => {
            const items = products.filter(p => p.category === cat);
            const value = items.reduce((s, p) => s + p.stock * p.cost, 0);
            return (
              <SectionCard key={cat}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base">{cat}</h3>
                    <div className="text-xs text-muted-foreground mt-1">{items.length} products</div>
                  </div>
                  <div className="size-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Package className="size-4"/></div>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground">Stock value</span>
                  <span className="tabular-nums">{fmtKHRShort(value)}</span>
                </div>
              </SectionCard>
            );
          })}
        </div>
      )}

      {tab === "batches" && (
        <SectionCard>
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Batch</th>
                  <th className="px-5 py-3">Expiry</th>
                  <th className="px-5 py-3 text-right">Qty</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.filter(p => p.expiry).map(p => {
                  const days = daysBetween(new Date(), p.expiry!);
                  return (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-3">{p.name}</td>
                      <td className="px-5 py-3 font-mono text-xs">B-{p.sku}-01</td>
                      <td className="px-5 py-3 text-muted-foreground">{fmtDate(p.expiry!)}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{p.stock}</td>
                      <td className="px-5 py-3">
                        {days < 30 ? <StatusPill status="overdue" /> :
                         days < 90 ? <StatusPill status="medium" /> :
                         <StatusPill status="low" />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {tab === "movements" && (
        <SectionCard title="Stock Movements"
          action={<Button variant="outline" className="h-8 text-xs" onClick={() => toast.success("Export started")}><Download className="size-3" /> Export</Button>}>
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Batch</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3 text-right">Qty</th>
                  <th className="px-5 py-3">Ref</th>
                  <th className="px-5 py-3">By</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date:"Jun 28", product:"Urea Fertilizer 50kg",       batch:"B-FRT-001-01", type:"out", qty:4,  ref:"INV-002418", by:"Sokun" },
                  { date:"Jun 27", product:"IR504 Rice Seed 25kg",        batch:"B-SED-101-01", type:"out", qty:3,  ref:"INV-002415", by:"Mealea" },
                  { date:"Jun 26", product:"Glyphosate Herbicide 1L",     batch:"B-PST-021-01", type:"out", qty:6,  ref:"INV-002413", by:"Sokun" },
                  { date:"Jun 24", product:"Urea Fertilizer 50kg",        batch:"B-FRT-001-01", type:"in",  qty:50, ref:"PO-00312",   by:"Davy" },
                  { date:"Jun 22", product:"Mancozeb Fungicide 1kg",      batch:"B-PST-052-01", type:"adjust", qty:-2, ref:"ADJ-0041", by:"Sokun" },
                  { date:"Jun 20", product:"Organic Compost 25kg",        batch:"B-FRT-010-01", type:"in",  qty:80, ref:"PO-00311",   by:"Davy" },
                ].map((m, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3 text-muted-foreground">{m.date}</td>
                    <td className="px-5 py-3">{m.product}</td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{m.batch}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md ${
                        m.type === "in" ? "bg-emerald-50 text-emerald-700" :
                        m.type === "out" ? "bg-slate-50 text-slate-700" :
                        "bg-amber-50 text-amber-700"
                      }`}>
                        {m.type === "in" ? <ArrowUpRight className="size-3"/> : m.type === "out" ? <ArrowDownRight className="size-3"/> : <Settings2 className="size-3"/>}
                        {m.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">{m.type === "out" ? `-${m.qty}` : `+${Math.abs(m.qty)}`}</td>
                    <td className="px-5 py-3 font-mono text-xs">{m.ref}</td>
                    <td className="px-5 py-3 text-muted-foreground">{m.by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {tab === "expiry" && (
        <SectionCard title="Expiry Watchlist"
          action={<Button variant="outline" className="h-8 text-xs" onClick={() => toast.success("Expiry report exported")}><Download className="size-3" /> Export</Button>}>
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Batch</th>
                  <th className="px-5 py-3">Expiry</th>
                  <th className="px-5 py-3 text-right">Qty</th>
                  <th className="px-5 py-3 text-right">Value at risk</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {products.filter(p => p.expiry).map(p => {
                  const days = daysBetween(new Date(), p.expiry!);
                  return (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3">{p.name}</td>
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">B-{p.sku}-01</td>
                      <td className="px-5 py-3 text-muted-foreground">{fmtDate(p.expiry!)}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{p.stock}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{fmtKHR(p.stock * p.cost)}</td>
                      <td className="px-5 py-3">
                        {days < 0   ? <StatusPill status="overdue" /> :
                         days < 30  ? <span className="text-xs px-2 py-0.5 rounded-full ring-1 ring-inset bg-rose-50 text-rose-700 ring-rose-200">Expires in {days}d</span> :
                         days < 90  ? <span className="text-xs px-2 py-0.5 rounded-full ring-1 ring-inset bg-amber-50 text-amber-700 ring-amber-200">Expires in {days}d</span> :
                         <StatusPill status="low" />}
                      </td>
                      <td className="px-5 py-3">
                        <Button variant="outline" className="h-7 text-xs" onClick={() => toast.info("Discount applied")}>Discount</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
