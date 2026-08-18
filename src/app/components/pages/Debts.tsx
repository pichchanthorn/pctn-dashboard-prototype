import { useState, useMemo } from "react";
import { Search, Filter, Download, Send, Plus, ArrowRight } from "lucide-react";
import { PageHeader, SectionCard, StatusPill, Avatar2, StatCard } from "../shell/Primitives";
import { Button } from "../ui/button";
import { customers, invoices, payments, aging } from "../../lib/mock";
import { fmtKHR, fmtKHRShort, fmtDate, daysBetween } from "../../lib/format";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { useApp } from "../../lib/AppContext";
import { toast } from "sonner";
import { cn } from "../ui/utils";

type DebtTab = "outstanding" | "aging" | "overdue" | "payments" | "reminders";

export function Debts() {
  const { openCustomer, openInvoice, openDialog } = useApp();
  const [tab, setTab] = useState<DebtTab>("outstanding");

  // Outstanding tab filters
  const [q, setQ] = useState("");
  const [riskF, setRiskF] = useState("all");
  const [seasonF, setSeasonF] = useState("all");

  const debtors = useMemo(() => customers
    .filter(c => c.outstanding > 0)
    .filter(c => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.village.toLowerCase().includes(q.toLowerCase()))
    .filter(c => riskF === "all" || c.risk === riskF)
    .sort((a, b) => b.outstanding - a.outstanding),
  [q, riskF, seasonF]);

  const overdue = invoices.filter(i => i.status === "overdue");

  const tabs: { key: DebtTab; label: string; count?: number }[] = [
    { key: "outstanding", label: "Outstanding", count: debtors.length },
    { key: "aging",       label: "Aging" },
    { key: "overdue",     label: "Overdue",     count: overdue.length },
    { key: "payments",    label: "Payments",    count: payments.length },
    { key: "reminders",   label: "Reminders" },
  ];

  return (
    <div>
      <PageHeader
        title="Debts"
        description="Track credit sales, balances, and collections."
        actions={
          <>
            <Button variant="outline" className="h-9" onClick={() => toast.success("Export started — check your downloads")}><Download className="size-4" /> Export</Button>
            <Button onClick={() => openDialog("record-payment")} className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="size-4" /> Record Payment</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total outstanding"    value={fmtKHRShort(25_300_000)} />
        <StatCard label="Overdue"              value={fmtKHRShort(2_120_000)} intent="danger" hint={`${overdue.length} invoices`} />
        <StatCard label="Collected this month" value={fmtKHRShort(4_200_000)} delta={15}  intent="positive" />
        <StatCard label="Default rate"         value="3.2%"                   delta={-1}  intent="positive" hint="vs last season" />
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-6 border-b border-border overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn(
            "px-4 h-10 text-sm relative capitalize whitespace-nowrap",
            tab === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          )}>
            {t.label}
            {t.count !== undefined && <span className="ml-1 text-xs text-muted-foreground">({t.count})</span>}
            {tab === t.key && <span className="absolute bottom-[-1px] inset-x-0 h-0.5 bg-emerald-600 rounded-full" />}
          </button>
        ))}
      </div>

      {/* ── Outstanding ── */}
      {tab === "outstanding" && (
        <>
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by customer or village…"
                className="w-full h-10 pl-10 pr-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <select
              value={riskF}
              onChange={e => setRiskF(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none"
            >
              <option value="all">All risk</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              value={seasonF}
              onChange={e => setSeasonF(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none"
            >
              <option value="all">All seasons</option>
              <option value="wet26">Wet 2026</option>
              <option value="dry26">Dry 2026</option>
            </select>
          </div>
          <SectionCard>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Village</th>
                    <th className="px-5 py-3 text-right">Limit</th>
                    <th className="px-5 py-3 text-right">Outstanding</th>
                    <th className="px-5 py-3">Utilization</th>
                    <th className="px-5 py-3">Risk</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {debtors.map(c => {
                    const util = Math.min(100, Math.round(c.outstanding / c.creditLimit * 100));
                    return (
                      <tr key={c.id} onClick={() => openCustomer(c.id)} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar2 initials={c.initials} className="size-8 text-xs" />
                            <span>{c.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">{c.village}</td>
                        <td className="px-5 py-3 text-right tabular-nums">{fmtKHR(c.creditLimit)}</td>
                        <td className="px-5 py-3 text-right tabular-nums">{fmtKHR(c.outstanding)}</td>
                        <td className="px-5 py-3 w-40">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div className={"h-full " + (util > 80 ? "bg-rose-500" : util > 50 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: util + "%" }} />
                            </div>
                            <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">{util}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3"><StatusPill status={c.risk} /></td>
                        <td className="px-5 py-3" onClick={e => e.stopPropagation()}>
                          <Button variant="outline" className="h-8 text-xs" onClick={() => toast.success(`Reminder sent to ${c.name}`)}>
                            <Send className="size-3" /> Remind
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {debtors.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">No results match your filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </>
      )}

      {/* ── Aging ── */}
      {tab === "aging" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <SectionCard className="xl:col-span-2" title="Aging Buckets">
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={aging} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="bucket" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => fmtKHRShort(v)} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => fmtKHR(v as number)} />
                  <Bar key="amount" dataKey="amount" radius={[8, 8, 0, 0]}>
                    {aging.map((_, i) => <Cell key={i} fill={["#10b981", "#f59e0b", "#f97316", "#ef4444"][i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
          <SectionCard title="Bucket Summary">
            <div className="space-y-3">
              {aging.map((a, i) => (
                <div key={a.bucket} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full shrink-0" style={{ background: ["#10b981", "#f59e0b", "#f97316", "#ef4444"][i] }} />
                    <span className="text-sm">{a.bucket} days</span>
                  </div>
                  <span className="text-sm tabular-nums">{fmtKHR(a.amount)}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-border flex items-center justify-between text-sm">
                <span>Total</span>
                <span className="tabular-nums">{fmtKHR(aging.reduce((s, a) => s + a.amount, 0))}</span>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ── Overdue ── */}
      {tab === "overdue" && (
        <SectionCard>
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">Due date</th>
                  <th className="px-5 py-3 text-right">Days late</th>
                  <th className="px-5 py-3 text-right">Balance</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {overdue.map(i => (
                  <tr key={i.id} onClick={() => openInvoice(i.id)} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer">
                    <td className="px-5 py-3">
                      <button className="hover:underline text-left" onClick={e => { e.stopPropagation(); openCustomer(i.customerId); }}>{i.customer}</button>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs">{i.no}</td>
                    <td className="px-5 py-3 text-muted-foreground">{fmtDate(i.dueDate!)}</td>
                    <td className="px-5 py-3 text-right text-rose-600 tabular-nums">{daysBetween(i.dueDate!)} days</td>
                    <td className="px-5 py-3 text-right tabular-nums">{fmtKHR(i.balance)}</td>
                    <td className="px-5 py-3" onClick={e => e.stopPropagation()}>
                      <Button variant="outline" className="h-8 text-xs" onClick={() => toast.success("Reminder sent")}>
                        <Send className="size-3" /> Remind
                      </Button>
                    </td>
                  </tr>
                ))}
                {overdue.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">No overdue invoices.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* ── Payments ── */}
      {tab === "payments" && (
        <SectionCard title="Payment History"
          action={<Button onClick={() => openDialog("record-payment")} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"><Plus className="size-3" /> Record</Button>}>
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">Method</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3">Received by</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => {
                  const cust = customers.find(c => c.name === p.customer);
                  const inv  = invoices.find(i => i.no === p.invoiceNo);
                  return (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3 text-muted-foreground">{fmtDate(p.date)}</td>
                      <td className="px-5 py-3">
                        <button
                          className="hover:underline"
                          onClick={() => cust && openCustomer(cust.id)}
                        >{p.customer}</button>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          className="font-mono text-xs hover:underline"
                          onClick={() => inv && openInvoice(inv.id)}
                        >{p.invoiceNo}</button>
                      </td>
                      <td className="px-5 py-3"><span className="text-xs px-2 py-0.5 rounded-md bg-muted">{p.method}</span></td>
                      <td className="px-5 py-3 text-right tabular-nums text-emerald-700">{fmtKHR(p.amount)}</td>
                      <td className="px-5 py-3 text-muted-foreground">{p.by}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* ── Reminders ── */}
      {tab === "reminders" && (
        <SectionCard title="Reminder Campaigns">
          <div className="py-12 text-center">
            <div className="size-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Send className="size-5" />
            </div>
            <div className="mt-3 text-sm">No active reminder campaigns</div>
            <div className="text-xs text-muted-foreground mt-1">Send bulk SMS or Telegram reminders to customers with overdue balances.</div>
            <div className="flex items-center justify-center gap-3 mt-4">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => toast.info("Campaign builder — coming soon")}>
                <Plus className="size-4" /> New Campaign
              </Button>
              <Button variant="outline" onClick={() => toast.success(`Reminders sent to ${overdue.length} overdue customers`)}>
                Quick send to overdue ({overdue.length})
              </Button>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
