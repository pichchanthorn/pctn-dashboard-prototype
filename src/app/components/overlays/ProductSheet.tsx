import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Edit2, Trash2, ShoppingCart, CalendarClock, Package2, ArrowUpRight, ArrowDownRight, Settings2 } from "lucide-react";
import { products } from "../../lib/mock";
import { fmtKHR, fmtDate } from "../../lib/format";
import { useApp } from "../../lib/AppContext";
import { toast } from "sonner";
import { cn } from "../ui/utils";
import { ProductTile } from "../pages/Products";

const MOVEMENTS = [
  { date: "Jun 28", type: "out",    qty: 4,  ref: "INV-002418", by: "Sokun"  },
  { date: "Jun 27", type: "out",    qty: 3,  ref: "INV-002415", by: "Mealea" },
  { date: "Jun 24", type: "in",     qty: 50, ref: "PO-00312",   by: "Davy"   },
  { date: "Jun 22", type: "adjust", qty: -2, ref: "ADJ-0041",   by: "Sokun"  },
];

export function ProductSheet() {
  const { productId, closeProduct, openDialog } = useApp();
  const p = products.find(x => x.id === productId);

  const stockPct = p ? Math.min(100, Math.round((p.stock / (p.reorder * 3)) * 100)) : 0;
  const isOut = p ? p.stock === 0 : false;
  const isLow = p ? p.stock > 0 && p.stock <= p.reorder : false;

  return (
    <Sheet open={!!productId} onOpenChange={open => !open && closeProduct()}>
      <SheetContent className="w-full sm:max-w-lg p-0 overflow-y-auto flex flex-col">
        {p && (
          <>
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
              <div className="flex items-start gap-4">
                {/* Large product tile */}
                <div className="shrink-0">
                  <ProductTile category={p.category} />
                </div>
                <div className="flex-1 min-w-0">
                  <SheetTitle className="leading-tight">{p.name}</SheetTitle>
                  {p.nameKh && <div className="text-sm text-muted-foreground mt-0.5">{p.nameKh}</div>}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{p.sku}</span>
                    {isOut && <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 ring-1 ring-inset ring-rose-500/25">Out of stock</span>}
                    {isLow && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 ring-1 ring-inset ring-amber-500/25">Low stock</span>}
                    {!isOut && !isLow && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 ring-1 ring-inset ring-emerald-500/25">In stock</span>}
                    {!p.active && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground ring-1 ring-inset ring-border">Inactive</span>}
                  </div>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* Pricing */}
              <section>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Pricing</div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Purchase price", value: p.cost,        sub: "cost" },
                    { label: "Cash price",     value: p.cashPrice,   sub: "retail" },
                    { label: "Credit price",   value: p.creditPrice, sub: "with interest" },
                  ].map(({ label, value, sub }) => (
                    <div key={label} className="rounded-xl bg-muted/50 p-3">
                      <div className="text-xs text-muted-foreground">{label}</div>
                      <div className="mt-1 tabular-nums text-sm">{fmtKHR(value)}</div>
                      <div className="text-xs text-muted-foreground/60 mt-0.5">{sub}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gross margin (cash)</span>
                    <span className="tabular-nums text-emerald-600 dark:text-emerald-400">
                      {Math.round(((p.cashPrice - p.cost) / p.cashPrice) * 100)}%
                      · {fmtKHR(p.cashPrice - p.cost)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-muted-foreground">Gross margin (credit)</span>
                    <span className="tabular-nums text-violet-600 dark:text-violet-400">
                      {Math.round(((p.creditPrice - p.cost) / p.creditPrice) * 100)}%
                      · {fmtKHR(p.creditPrice - p.cost)}
                    </span>
                  </div>
                </div>
              </section>

              {/* Stock */}
              <section>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Stock</div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="rounded-xl bg-muted/50 p-3">
                    <div className="text-xs text-muted-foreground">Current</div>
                    <div className="mt-1 tabular-nums text-sm">{p.stock} <span className="text-muted-foreground">{p.unit}</span></div>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-3">
                    <div className="text-xs text-muted-foreground">Reorder at</div>
                    <div className="mt-1 tabular-nums text-sm">{p.reorder} <span className="text-muted-foreground">{p.unit}</span></div>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-3">
                    <div className="text-xs text-muted-foreground">Value</div>
                    <div className="mt-1 tabular-nums text-sm">{fmtKHR(p.stock * p.cost)}</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Stock level</span>
                    <span className="tabular-nums">{stockPct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", isOut ? "bg-rose-500" : isLow ? "bg-amber-500" : "bg-emerald-500")}
                      style={{ width: `${stockPct}%` }}
                    />
                  </div>
                </div>
                {p.expiry && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarClock className="size-3.5 shrink-0" />
                    Expires {fmtDate(p.expiry)}
                  </div>
                )}
              </section>

              {/* Description */}
              {p.description && (
                <section>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Description</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                </section>
              )}

              {/* Recent movements */}
              <section>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Recent movements</div>
                <div className="space-y-2">
                  {MOVEMENTS.map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={cn(
                        "size-7 rounded-lg flex items-center justify-center shrink-0",
                        m.type === "in"     ? "bg-emerald-500/15 text-emerald-500"
                        : m.type === "out"  ? "bg-slate-500/15   text-slate-500"
                        :                     "bg-amber-500/15   text-amber-500"
                      )}>
                        {m.type === "in" ? <ArrowUpRight className="size-3.5" />
                        : m.type === "out" ? <ArrowDownRight className="size-3.5" />
                        : <Settings2 className="size-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">
                          {m.type === "in" ? `Received +${m.qty}` : m.type === "out" ? `Sold −${Math.abs(m.qty)}` : `Adjusted ${m.qty}`}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{m.ref} · {m.by}</div>
                      </div>
                      <div className="text-xs text-muted-foreground shrink-0">{m.date}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Footer actions */}
            <div className="border-t border-border px-6 py-4 flex gap-2 bg-background">
              <Button
                variant="outline"
                className="h-10 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30"
                onClick={() => { closeProduct(); toast.success("Product deleted"); }}
              >
                <Trash2 className="size-4" /> Delete
              </Button>
              <div className="flex-1" />
              <Button
                variant="outline"
                className="h-10"
                onClick={() => { closeProduct(); }}
              >
                <ShoppingCart className="size-4" /> Add to sale
              </Button>
              <Button
                className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => { openDialog("edit-product", p); closeProduct(); }}
              >
                <Edit2 className="size-4" /> Edit
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
