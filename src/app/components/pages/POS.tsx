import { useState, useMemo } from "react";
import {
  Search, Plus, Minus, Trash2, Printer, Save,
  ChevronDown, CreditCard, Banknote, Calendar,
} from "lucide-react";
import { PageHeader, SectionCard, StatusPill, Avatar2 } from "../shell/Primitives";
import { Button } from "../ui/button";
import { products, customers } from "../../lib/mock";
import { fmtKHR } from "../../lib/format";
import { cn } from "../ui/utils";
import { toast } from "sonner";
import { useApp } from "../../lib/AppContext";

export function POS() {
  const { go } = useApp();
  const [mode, setMode]           = useState<"cash" | "credit">("credit");
  const [pickCustomer, setPickCustomer] = useState(false);
  const [cart, setCart]           = useState<{ id: string; qty: number }[]>([
    { id: "p1", qty: 2 }, { id: "p7", qty: 1 }, { id: "p4", qty: 3 },
  ]);
  const [customerId, setCustomerId] = useState("c1");
  const [cat, setCat]             = useState<string>("All");
  const [productQ, setProductQ]   = useState("");

  const customer = customers.find(c => c.id === customerId)!;
  const cats = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const visible = useMemo(() => products.filter(p => {
    if (cat !== "All" && p.category !== cat) return false;
    if (productQ && !(p.name.toLowerCase().includes(productQ.toLowerCase()) || p.sku.toLowerCase().includes(productQ.toLowerCase()))) return false;
    return true;
  }), [cat, productQ]);

  const lines = cart.map(c => {
    const p = products.find(x => x.id === c.id)!;
    const unit = mode === "credit" ? p.creditPrice : p.cashPrice;
    return { ...p, qty: c.qty, unit, total: unit * c.qty };
  });
  const subtotal  = lines.reduce((s, l) => s + l.total, 0);
  const cashEquiv = lines.reduce((s, l) => s + l.cashPrice * l.qty, 0);
  const interest  = mode === "credit" ? subtotal - cashEquiv : 0;

  const inc = (id: string) => setCart(c => c.map(x => x.id === id ? { ...x, qty: x.qty + 1 } : x));
  const dec = (id: string) => setCart(c => c.map(x => x.id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x));
  const rm  = (id: string) => setCart(c => c.filter(x => x.id !== id));
  const add = (id: string) => {
    if (cart.find(x => x.id === id)) {
      toast.info("Already in cart — use +/− to adjust qty");
      return;
    }
    setCart(c => [...c, { id, qty: 1 }]);
    toast.success("Added to cart");
  };

  const charge = () => {
    if (cart.length === 0) { toast.error("Cart is empty"); return; }
    toast.success(`Invoice created for ${customer.name} — ${fmtKHR(subtotal)}`);
    go("invoices");
  };

  return (
    <div>
      <PageHeader title="New Sale" description="Create an invoice — cash or credit." />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* ── Products ── */}
        <div className="xl:col-span-3 space-y-4">
          <div className="relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={productQ}
              onChange={e => setProductQ(e.target.value)}
              placeholder="Search by name, SKU, or barcode…"
              className="w-full h-11 pl-10 pr-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)} className={cn(
                "px-3 h-8 rounded-full text-xs whitespace-nowrap border shrink-0 transition",
                cat === c ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-card text-muted-foreground border-border hover:bg-accent"
              )}>{c}</button>
            ))}
          </div>

          {visible.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground rounded-2xl border border-dashed border-border">
              No products match "{productQ}"
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {visible.map(p => (
              <button key={p.id} onClick={() => add(p.id)}
                className={cn(
                  "text-left p-4 rounded-2xl border bg-card hover:border-emerald-300 hover:shadow-[0_4px_12px_rgba(16,24,40,0.06)] transition",
                  cart.find(x => x.id === p.id) ? "border-emerald-300 bg-emerald-50/30" : "border-border"
                )}>
                <div className="text-xs text-muted-foreground">{p.category}</div>
                <div className="mt-1 text-sm line-clamp-2 min-h-[40px]">{p.name}</div>
                <div className="mt-3 flex items-baseline justify-between gap-1">
                  <div>
                    <div className="text-sm tabular-nums">{fmtKHR(mode === "cash" ? p.cashPrice : p.creditPrice)}</div>
                    {mode === "credit" && <div className="text-xs text-muted-foreground tabular-nums">{fmtKHR(p.cashPrice)} cash</div>}
                  </div>
                  <span className={cn("text-xs px-1.5 py-0.5 rounded-md shrink-0",
                    p.stock === 0 ? "bg-rose-50 text-rose-600"
                    : p.stock <= p.reorder ? "bg-amber-50 text-amber-600"
                    : "bg-emerald-50 text-emerald-600"
                  )}>
                    {p.stock} {p.unit}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Cart ── */}
        <div className="xl:col-span-2">
          <div className="sticky top-20 space-y-4">

            {/* Customer picker */}
            <SectionCard title="Customer">
              <div className="flex items-center gap-3">
                <Avatar2 initials={customer.initials} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm">{customer.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{customer.village} · {customer.phone}</div>
                </div>
                <Button variant="outline" className="h-8 text-xs shrink-0" onClick={() => setPickCustomer(v => !v)}>
                  {pickCustomer ? "Close" : "Change"}
                </Button>
              </div>
              {pickCustomer && (
                <div className="mt-3 rounded-xl border border-border max-h-56 overflow-y-auto divide-y divide-border">
                  {customers.map(c => (
                    <button key={c.id} onClick={() => { setCustomerId(c.id); setPickCustomer(false); }}
                      className={cn("w-full flex items-center gap-3 p-2.5 text-left hover:bg-muted/50 transition", customerId === c.id && "bg-emerald-50/50")}>
                      <Avatar2 initials={c.initials} className="size-7 text-xs shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{c.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{c.village}</div>
                      </div>
                      <div className="text-xs text-muted-foreground tabular-nums shrink-0">{fmtKHR(c.outstanding)}</div>
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg bg-muted/50 p-2.5">
                  <div className="text-muted-foreground">Limit</div>
                  <div className="mt-1 tabular-nums">{fmtKHR(customer.creditLimit)}</div>
                </div>
                <div className="rounded-lg bg-muted/50 p-2.5">
                  <div className="text-muted-foreground">Outstanding</div>
                  <div className="mt-1 tabular-nums">{fmtKHR(customer.outstanding)}</div>
                </div>
                <div className="rounded-lg bg-muted/50 p-2.5">
                  <div className="text-muted-foreground">Risk</div>
                  <div className="mt-1"><StatusPill status={customer.risk} /></div>
                </div>
              </div>
            </SectionCard>

            {/* Cart items */}
            <SectionCard title="Cart">
              {/* Mode toggle */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button onClick={() => setMode("cash")} className={cn(
                  "h-10 rounded-xl border text-sm flex items-center justify-center gap-2 transition",
                  mode === "cash" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "border-border text-muted-foreground hover:bg-accent"
                )}><Banknote className="size-4" /> Cash</button>
                <button onClick={() => setMode("credit")} className={cn(
                  "h-10 rounded-xl border text-sm flex items-center justify-center gap-2 transition",
                  mode === "credit" ? "bg-violet-50 border-violet-200 text-violet-700" : "border-border text-muted-foreground hover:bg-accent"
                )}><CreditCard className="size-4" /> Credit</button>
              </div>

              {/* Line items */}
              {cart.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
                  Tap a product to add it
                </div>
              )}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {lines.map(l => (
                  <div key={l.id} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm truncate">{l.name}</div>
                      <div className="text-xs text-muted-foreground tabular-nums">{fmtKHR(l.unit)} × {l.qty}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => dec(l.id)} className="size-7 rounded-md border border-border hover:bg-accent flex items-center justify-center"><Minus className="size-3" /></button>
                      <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                      <button onClick={() => inc(l.id)} className="size-7 rounded-md border border-border hover:bg-accent flex items-center justify-center"><Plus className="size-3" /></button>
                      <button onClick={() => rm(l.id)} className="size-7 rounded-md hover:bg-rose-50 hover:text-rose-600 text-muted-foreground flex items-center justify-center transition"><Trash2 className="size-3" /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              {cart.length > 0 && (
                <div className="mt-5 pt-4 border-t border-border space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Cash equivalent</span>
                    <span className="tabular-nums">{fmtKHR(cashEquiv)}</span>
                  </div>
                  {mode === "credit" && (
                    <div className="flex justify-between text-violet-700">
                      <span>Interest (10%)</span>
                      <span className="tabular-nums">+ {fmtKHR(interest)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="tabular-nums">{fmtKHR(subtotal)}</span>
                  </div>
                  {mode === "credit" && (
                    <button className="w-full flex items-center justify-between text-xs text-muted-foreground pt-1 hover:text-foreground transition">
                      <span className="flex items-center gap-1"><Calendar className="size-3" /> Due date</span>
                      <span className="flex items-center gap-1">Nov 30, 2026 <ChevronDown className="size-3" /></span>
                    </button>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-11" onClick={() => toast.info("Cart held — resume any time")}>
                  <Save className="size-4" /> Hold
                </Button>
                <Button onClick={charge} className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Printer className="size-4" /> Charge
                </Button>
              </div>
            </SectionCard>

          </div>
        </div>
      </div>
    </div>
  );
}
