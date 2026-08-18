import { useState, useMemo } from "react";
import { Filter, Download, Plus, Search, MoreHorizontal } from "lucide-react";
import { PageHeader, SectionCard, StatusPill } from "../shell/Primitives";
import { Button } from "../ui/button";
import { invoices } from "../../lib/mock";
import { fmtKHR, fmtDate } from "../../lib/format";
import { useApp } from "../../lib/AppContext";
import { toast } from "sonner";

const PAGE = 8;

export function Invoices() {
  const { go, openInvoice } = useApp();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [page, setPage] = useState(1);

  const tabs: { label: string; value: string }[] = [
    { label: "All", value: "All" },
    { label: "Unpaid", value: "unpaid" },
    { label: "Partial", value: "partial" },
    { label: "Overdue", value: "overdue" },
    { label: "Paid", value: "paid" },
  ];

  const counts = useMemo(() => ({
    All: invoices.length,
    unpaid: invoices.filter(i => i.status === "unpaid").length,
    partial: invoices.filter(i => i.status === "partial").length,
    overdue: invoices.filter(i => i.status === "overdue").length,
    paid: invoices.filter(i => i.status === "paid").length,
  }), []);

  const filtered = useMemo(() => {
    return invoices.filter(i => {
      if (status !== "All" && i.status !== status) return false;
      if (q && !(i.no.toLowerCase().includes(q.toLowerCase()) || i.customer.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [q, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const pageData = filtered.slice((page - 1) * PAGE, page * PAGE);

  return (
    <div>
      <PageHeader
        title="Invoices"
        description={`${filtered.length} of ${invoices.length} · ${invoices.filter(i => i.status === "unpaid" || i.status === "partial" || i.status === "overdue").length} open`}
        actions={
          <>
            <Button variant="outline" className="h-9" onClick={() => toast.success("Export started")}><Download className="size-4" /> Export</Button>
            <Button onClick={() => go("pos")} className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="size-4" /> New Invoice</Button>
          </>
        }
      />

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search by invoice # or customer" className="w-full h-10 pl-10 pr-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" className="h-10"><Filter className="size-4" /> Filters</Button>
          <Button variant="outline" className="h-10">Wet 2026</Button>
          <Button variant="outline" className="h-10">Last 30 days</Button>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-4 border-b border-border overflow-x-auto">
        {tabs.map(t => (
          <button key={t.value} onClick={() => { setStatus(t.value); setPage(1); }} className={
            "px-4 h-10 text-sm relative whitespace-nowrap " + (status === t.value ? "text-foreground" : "text-muted-foreground hover:text-foreground")
          }>
            {t.label} <span className="ml-1 text-xs text-muted-foreground">({counts[t.value as keyof typeof counts]})</span>
            {status === t.value && <span className="absolute bottom-[-1px] inset-x-0 h-0.5 bg-emerald-600 rounded-full" />}
          </button>
        ))}
      </div>

      <SectionCard>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-5 py-3 w-8"><input type="checkbox" className="rounded" /></th>
                <th className="px-5 py-3">Invoice</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Season</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3 text-right">Paid</th>
                <th className="px-5 py-3 text-right">Balance</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {pageData.map(i => (
                <tr key={i.id} onClick={() => openInvoice(i.id)} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer">
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded" /></td>
                  <td className="px-5 py-3 font-mono text-xs">{i.no}</td>
                  <td className="px-5 py-3 text-muted-foreground">{fmtDate(i.date)}</td>
                  <td className="px-5 py-3">{i.customer}</td>
                  <td className="px-5 py-3"><StatusPill status={i.type} /></td>
                  <td className="px-5 py-3 text-muted-foreground">{i.season}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{fmtKHR(i.total)}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{fmtKHR(i.paid)}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{fmtKHR(i.balance)}</td>
                  <td className="px-5 py-3"><StatusPill status={i.status} /></td>
                  <td className="px-5 py-3"><MoreHorizontal className="size-4 text-muted-foreground" /></td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr><td colSpan={11} className="px-5 py-12 text-center text-sm text-muted-foreground">No invoices match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between pt-4 text-xs text-muted-foreground">
          <div>Showing {pageData.length === 0 ? 0 : (page - 1) * PAGE + 1}–{(page - 1) * PAGE + pageData.length} of {filtered.length}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
            <span className="tabular-nums">Page {page} / {totalPages}</span>
            <Button variant="outline" className="h-8" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
