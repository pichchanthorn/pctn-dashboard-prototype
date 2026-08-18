import { useState, useMemo } from "react";
import {
  Plus, Search, Download, MoreHorizontal,
  Phone, MessageCircle, Edit2, MapPin,
  FileText, TrendingUp, ArrowRight,
} from "lucide-react";
import { PageHeader, SectionCard, StatusPill, Avatar2, StatCard } from "../shell/Primitives";
import { Button } from "../ui/button";
import { customers, invoices, payments } from "../../lib/mock";
import { fmtKHR, fmtKHRShort, fmtDate } from "../../lib/format";
import { useApp } from "../../lib/AppContext";
import { toast } from "sonner";

const PAGE = 8;

// ─────────────────────────────────────────────────────────────
// List
// ─────────────────────────────────────────────────────────────
export function Customers() {
  const { openCustomer, openDialog } = useApp();
  const [q, setQ] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [hasDebt, setHasDebt] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => customers.filter(c => {
    if (q && !(c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q) || c.village.toLowerCase().includes(q.toLowerCase()))) return false;
    if (riskFilter !== "all" && c.risk !== riskFilter) return false;
    if (hasDebt && c.outstanding === 0) return false;
    return true;
  }), [q, riskFilter, hasDebt]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const pageData = filtered.slice((page - 1) * PAGE, page * PAGE);

  return (
    <div>
      <PageHeader
        title="Customers"
        description={`${customers.length} farmers · ${customers.filter(c => c.outstanding > 0).length} with open balance`}
        actions={
          <>
            <Button variant="outline" className="h-9" onClick={() => toast.info("CSV import — coming soon")}><Download className="size-4" /> Import</Button>
            <Button onClick={() => openDialog("new-customer")} className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="size-4" /> New Customer</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total customers"   value={customers.length} />
        <StatCard label="With open debt"    value={customers.filter(c => c.outstanding > 0).length} intent="warning" />
        <StatCard label="Avg outstanding"   value={fmtKHRShort(Math.round(customers.reduce((s, c) => s + c.outstanding, 0) / customers.length))} />
        <StatCard label="High risk"         value={customers.filter(c => c.risk === "high").length} intent="danger" />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Search by name, phone, or village…"
            className="w-full h-10 pl-10 pr-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
        <select
          value={riskFilter}
          onChange={(e) => { setRiskFilter(e.target.value); setPage(1); }}
          className="h-10 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none"
        >
          <option value="all">All risk levels</option>
          <option value="low">Low risk</option>
          <option value="medium">Medium risk</option>
          <option value="high">High risk</option>
        </select>
        <button
          onClick={() => { setHasDebt(v => !v); setPage(1); }}
          className={`h-10 px-4 rounded-xl border text-sm transition ${hasDebt ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-border bg-card text-muted-foreground hover:bg-accent"}`}
        >
          Has debt
        </button>
      </div>

      <SectionCard>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Village</th>
                <th className="px-5 py-3 text-right">Land</th>
                <th className="px-5 py-3">Crop</th>
                <th className="px-5 py-3 text-right">Credit Limit</th>
                <th className="px-5 py-3 text-right">Outstanding</th>
                <th className="px-5 py-3">Risk</th>
                <th className="px-5 py-3">Last Purchase</th>
                <th className="px-5 py-3 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {pageData.map(c => (
                <tr key={c.id} onClick={() => openCustomer(c.id)} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar2 initials={c.initials} className="size-8 text-xs" />
                      <span>{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground tabular-nums">{c.phone}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.village}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{c.landHa} ha</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.crop}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{fmtKHR(c.creditLimit)}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{fmtKHR(c.outstanding)}</td>
                  <td className="px-5 py-3"><StatusPill status={c.risk} /></td>
                  <td className="px-5 py-3 text-muted-foreground">{fmtDate(c.lastPurchase)}</td>
                  <td className="px-5 py-3" onClick={e => e.stopPropagation()}>
                    <MoreHorizontal className="size-4 text-muted-foreground" />
                  </td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr><td colSpan={10} className="px-5 py-12 text-center text-sm text-muted-foreground">No customers match your search.</td></tr>
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

// ─────────────────────────────────────────────────────────────
// 360 Profile
// ─────────────────────────────────────────────────────────────
type ProfileTab = "overview" | "invoices" | "payments" | "ledger" | "notes";

export function CustomerProfile({ id, onBack }: { id: string; onBack: () => void }) {
  const { openDialog, openInvoice } = useApp();
  const c = customers.find(x => x.id === id) || customers[0];
  const myInvoices = invoices.filter(i => i.customerId === c.id);
  const myPayments = payments.filter(p => p.customer === c.name);
  const [tab, setTab] = useState<ProfileTab>("overview");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([
    { id: 1, text: "Reliable farmer. Always pays after dry season.", date: "Jun 10, 2026", by: "Sokun" },
  ]);

  // Running ledger from invoices + payments
  const ledgerEntries = [
    ...myInvoices.map(i => ({ date: i.date, ref: i.no, desc: `Credit sale`, debit: i.total, credit: 0 })),
    ...myPayments.map(p => ({ date: p.date, ref: p.invoiceNo, desc: `Payment — ${p.method}`, debit: 0, credit: p.amount })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let runningBalance = c.outstanding;
  const ledgerWithBalance = ledgerEntries.map(e => {
    const bal = runningBalance;
    runningBalance -= e.credit - e.debit;
    return { ...e, balance: bal };
  });

  const tabs: { key: ProfileTab; label: string }[] = [
    { key: "overview",  label: "Overview" },
    { key: "invoices",  label: `Invoices (${myInvoices.length})` },
    { key: "payments",  label: `Payments (${myPayments.length})` },
    { key: "ledger",    label: "Ledger" },
    { key: "notes",     label: `Notes (${notes.length})` },
  ];

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition">
        <ArrowRight className="size-3.5 rotate-180" /> Back to customers
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
        <Avatar2 initials={c.initials} className="size-16 text-xl" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl tracking-tight">{c.name}</h1>
            <StatusPill status={c.risk} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {c.village}, {c.commune}, {c.province}</span>
            <span className="flex items-center gap-1"><FileText className="size-3.5" /> {c.landHa} ha</span>
            <span className="flex items-center gap-1"><TrendingUp className="size-3.5" /> {c.crop}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" className="h-9" onClick={() => toast.info(`Calling ${c.phone}`)}><Phone className="size-4" /> Call</Button>
          <Button variant="outline" className="h-9" onClick={() => toast.info("Telegram opened")}><MessageCircle className="size-4" /> Message</Button>
          <Button variant="outline" className="h-9" onClick={() => toast.info("Edit customer")}><Edit2 className="size-4" /> Edit</Button>
          <Button onClick={() => openDialog("record-payment", { customerId: c.id })} className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="size-4" /> Record Payment</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Credit Limit"    value={fmtKHRShort(c.creditLimit)} />
        <StatCard label="Outstanding"     value={fmtKHRShort(c.outstanding)}
          intent={c.outstanding > c.creditLimit * 0.8 ? "danger" : "default"}
          hint={`${Math.round(c.outstanding / c.creditLimit * 100)}% of limit`} />
        <StatCard label="Open invoices"   value={myInvoices.filter(i => i.balance > 0).length} />
        <StatCard label="Lifetime sales"  value={fmtKHRShort(myInvoices.reduce((s, i) => s + i.total, 0))} intent="positive" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-border overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={
            "px-4 h-10 text-sm relative whitespace-nowrap " +
            (tab === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground")
          }>
            {t.label}
            {tab === t.key && <span className="absolute bottom-[-1px] inset-x-0 h-0.5 bg-emerald-600 rounded-full" />}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard className="xl:col-span-2" title="Open Invoices"
            action={<Button variant="ghost" className="h-8 text-xs text-muted-foreground" onClick={() => setTab("invoices")}>All invoices <ArrowRight className="size-3" /></Button>}>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="px-5 py-3">Invoice</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Due</th>
                    <th className="px-5 py-3 text-right">Balance</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myInvoices.filter(i => i.balance > 0).map(i => (
                    <tr key={i.id} onClick={() => openInvoice(i.id)} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer">
                      <td className="px-5 py-3 font-mono text-xs">{i.no}</td>
                      <td className="px-5 py-3 text-muted-foreground">{fmtDate(i.date)}</td>
                      <td className="px-5 py-3 text-muted-foreground">{i.dueDate ? fmtDate(i.dueDate) : "—"}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{fmtKHR(i.balance)}</td>
                      <td className="px-5 py-3"><StatusPill status={i.status} /></td>
                    </tr>
                  ))}
                  {myInvoices.filter(i => i.balance > 0).length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">No open invoices.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="Recent Payments"
            action={<Button variant="ghost" className="h-8 text-xs text-muted-foreground" onClick={() => setTab("payments")}>All payments <ArrowRight className="size-3" /></Button>}>
            <div className="space-y-3">
              {myPayments.length === 0 && <div className="text-sm text-muted-foreground py-4 text-center">No payments recorded.</div>}
              {myPayments.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/40">
                  <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs shrink-0">✓</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm tabular-nums">{fmtKHR(p.amount)}</div>
                    <div className="text-xs text-muted-foreground truncate">{p.method} · {p.invoiceNo}</div>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">{fmtDate(p.date)}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {/* ── Invoices ── */}
      {tab === "invoices" && (
        <SectionCard title={`All Invoices (${myInvoices.length})`}>
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Season</th>
                  <th className="px-5 py-3 text-right">Total</th>
                  <th className="px-5 py-3 text-right">Paid</th>
                  <th className="px-5 py-3 text-right">Balance</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {myInvoices.map(i => (
                  <tr key={i.id} onClick={() => openInvoice(i.id)} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer">
                    <td className="px-5 py-3 font-mono text-xs">{i.no}</td>
                    <td className="px-5 py-3 text-muted-foreground">{fmtDate(i.date)}</td>
                    <td className="px-5 py-3"><StatusPill status={i.type} /></td>
                    <td className="px-5 py-3 text-muted-foreground">{i.season}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{fmtKHR(i.total)}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{fmtKHR(i.paid)}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{fmtKHR(i.balance)}</td>
                    <td className="px-5 py-3"><StatusPill status={i.status} /></td>
                  </tr>
                ))}
                {myInvoices.length === 0 && (
                  <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-muted-foreground">No invoices for this customer.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* ── Payments ── */}
      {tab === "payments" && (
        <SectionCard title={`Payment History (${myPayments.length})`}
          action={<Button onClick={() => openDialog("record-payment", { customerId: c.id })} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"><Plus className="size-3" /> Record Payment</Button>}>
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">Method</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3">Received by</th>
                </tr>
              </thead>
              <tbody>
                {myPayments.map(p => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3 text-muted-foreground">{fmtDate(p.date)}</td>
                    <td className="px-5 py-3 font-mono text-xs">{p.invoiceNo}</td>
                    <td className="px-5 py-3"><span className="text-xs px-2 py-0.5 rounded-md bg-muted">{p.method}</span></td>
                    <td className="px-5 py-3 text-right tabular-nums text-emerald-700">{fmtKHR(p.amount)}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.by}</td>
                  </tr>
                ))}
                {myPayments.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-muted-foreground">No payments yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* ── Ledger ── */}
      {tab === "ledger" && (
        <SectionCard title="Account Ledger"
          action={<Button variant="outline" className="h-8 text-xs" onClick={() => toast.success("Statement exported")}><Download className="size-3" /> Export Statement</Button>}>
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Ref</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3 text-right">Debit</th>
                  <th className="px-5 py-3 text-right">Credit</th>
                  <th className="px-5 py-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {ledgerWithBalance.map((e, idx) => (
                  <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3 text-muted-foreground tabular-nums">{fmtDate(e.date)}</td>
                    <td className="px-5 py-3 font-mono text-xs">{e.ref}</td>
                    <td className="px-5 py-3 text-muted-foreground">{e.desc}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{e.debit > 0 ? fmtKHR(e.debit) : "—"}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-emerald-700">{e.credit > 0 ? fmtKHR(e.credit) : "—"}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{fmtKHR(e.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* ── Notes ── */}
      {tab === "notes" && (
        <div className="space-y-4">
          <SectionCard title="Add Note">
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a note about this customer — visit, promise-to-pay, crop update…"
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
            />
            <div className="mt-3 flex justify-end">
              <Button
                className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!note.trim()}
                onClick={() => {
                  setNotes(prev => [{ id: Date.now(), text: note, date: "Jul 1, 2026", by: "Sokun" }, ...prev]);
                  setNote("");
                  toast.success("Note saved");
                }}
              >Save Note</Button>
            </div>
          </SectionCard>

          <div className="space-y-3">
            {notes.map(n => (
              <SectionCard key={n.id}>
                <div className="flex items-start gap-3">
                  <Avatar2 initials={n.by.slice(0, 2).toUpperCase()} className="size-8 text-xs shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{n.text}</p>
                    <div className="text-xs text-muted-foreground mt-1">{n.by} · {n.date}</div>
                  </div>
                </div>
              </SectionCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
