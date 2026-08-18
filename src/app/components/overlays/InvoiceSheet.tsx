import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Printer, Send, Plus, X } from "lucide-react";
import { invoices, products } from "../../lib/mock";
import { fmtKHR, fmtDate } from "../../lib/format";
import { StatusPill } from "../shell/Primitives";
import { useApp } from "../../lib/AppContext";

export function InvoiceSheet() {
  const { invoiceId, closeInvoice, openDialog, openCustomer } = useApp();
  const inv = invoices.find(i => i.id === invoiceId);

  return (
    <Sheet open={!!invoiceId} onOpenChange={(v) => !v && closeInvoice()}>
      <SheetContent className="w-full sm:max-w-xl p-0 overflow-y-auto">
        {inv && (
          <>
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <SheetTitle className="font-mono text-base">{inv.no}</SheetTitle>
                  <div className="text-sm text-muted-foreground mt-1">{fmtDate(inv.date)} · {inv.season}</div>
                </div>
                <StatusPill status={inv.status} />
              </div>
            </SheetHeader>

            <div className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground">Total</div>
                  <div className="mt-1 tabular-nums">{fmtKHR(inv.total)}</div>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground">Paid</div>
                  <div className="mt-1 tabular-nums text-emerald-700">{fmtKHR(inv.paid)}</div>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground">Balance</div>
                  <div className="mt-1 tabular-nums">{fmtKHR(inv.balance)}</div>
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Customer</div>
                <button onClick={() => { closeInvoice(); openCustomer(inv.customerId); }} className="w-full text-left p-3 rounded-xl border border-border hover:border-emerald-300 hover:bg-emerald-50/30 transition">
                  <div className="text-sm">{inv.customer}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">View profile →</div>
                </button>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Items</div>
                <div className="rounded-xl border border-border divide-y divide-border">
                  {products.slice(0, 3).map((p, i) => (
                    <div key={p.id} className="flex items-center justify-between p-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm truncate">{p.name}</div>
                        <div className="text-xs text-muted-foreground tabular-nums">{fmtKHR(p.creditPrice)} × {i + 1}</div>
                      </div>
                      <div className="text-sm tabular-nums">{fmtKHR(p.creditPrice * (i + 1))}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Timeline</div>
                <div className="space-y-3">
                  <Row label="Invoice created" date={inv.date} />
                  {inv.paid > 0 && <Row label={`Payment received · ${fmtKHR(inv.paid)}`} date={inv.date} />}
                  {inv.dueDate && <Row label="Due date" date={inv.dueDate} muted />}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex gap-2">
              <Button variant="outline" className="h-10"><Printer className="size-4" /> Print</Button>
              <Button variant="outline" className="h-10"><Send className="size-4" /> Share</Button>
              <div className="flex-1" />
              {inv.balance > 0 && (
                <Button onClick={() => openDialog("record-payment", { invoiceId: inv.id, customerId: inv.customerId })} className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Plus className="size-4" /> Record Payment
                </Button>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, date, muted }: { label: string; date: string; muted?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={"size-2 rounded-full " + (muted ? "bg-muted-foreground/30" : "bg-emerald-500")} />
      <div className="text-sm flex-1">{label}</div>
      <div className="text-xs text-muted-foreground">{fmtDate(date)}</div>
    </div>
  );
}
