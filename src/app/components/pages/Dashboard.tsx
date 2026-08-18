import { TrendingUp, Wallet, AlertTriangle, Package, CalendarClock, Download, Filter, ArrowRight } from "lucide-react";
import { PageHeader, StatCard, SectionCard, StatusPill, Avatar2 } from "../shell/Primitives";
import { Button } from "../ui/button";
import { invoices, customers } from "../../lib/mock";
import { fmtKHR, fmtKHRShort } from "../../lib/format";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from "recharts";
import { useApp } from "../../lib/AppContext";
import { seasons } from "../../lib/mock";
import { toast } from "sonner";

export function Dashboard() {
  const { go, openInvoice, openCustomer, activeSeasonId, seasonData } = useApp();

  const activeSeason = seasons.find(s => s.id === activeSeasonId) ?? seasons[0];
  const { stats, salesTrend, aging, seasonFlow, notifications, invoiceIds } = seasonData;

  // Filter invoices to those belonging to this season
  const seasonInvoices = invoices.filter(i => invoiceIds.includes(i.id));
  const topDebtors = [...customers]
    .filter(c => c.outstanding > 0)
    .sort((a, b) => b.outstanding - a.outstanding)
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Good morning, Sokun"
        description={`Viewing data for ${activeSeason.name}`}
        actions={
          <>
            <Button variant="outline" className="h-9" onClick={() => toast.info("Date filter")}><Filter className="size-4" /> Last 7 days</Button>
            <Button variant="outline" className="h-9" onClick={() => toast.success("Export started")}><Download className="size-4" /> Export</Button>
          </>
        }
      />

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label="Season Sales"
          value={fmtKHRShort(stats.totalSales)}
          delta={12}
          hint="total invoiced"
          icon={<TrendingUp className="size-4" />}
          intent="positive"
          onClick={() => go("invoices")}
        />
        <StatCard
          label="Outstanding"
          value={fmtKHRShort(stats.outstanding)}
          delta={-3}
          hint={`${Math.round((stats.totalCollected / stats.totalSales) * 100)}% collected`}
          icon={<Wallet className="size-4" />}
          onClick={() => go("debts")}
        />
        <StatCard
          label="Overdue"
          value={fmtKHRShort(stats.overdue)}
          hint="needs attention"
          icon={<AlertTriangle className="size-4" />}
          intent={stats.overdue > 0 ? "danger" : "default"}
          onClick={() => go("debts")}
        />
        <StatCard
          label="Cash in Hand"
          value={fmtKHRShort(stats.cashInHand)}
          delta={4}
          icon={<Wallet className="size-4" />}
          onClick={() => go("cashbook")}
        />
        <StatCard
          label="Low Stock"
          value={`${stats.lowStockCount} items`}
          hint="below reorder"
          icon={<Package className="size-4" />}
          intent={stats.lowStockCount > 0 ? "warning" : "default"}
          onClick={() => go("inventory")}
        />
        <StatCard
          label="Expiring Soon"
          value={`${stats.expiringCount} batches`}
          hint="≤30 days"
          icon={<CalendarClock className="size-4" />}
          intent={stats.expiringCount > 0 ? "warning" : "default"}
          onClick={() => go("inventory")}
        />
      </div>

      {/* ── Charts row 1 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <SectionCard
          className="xl:col-span-2"
          title="Sales Trend"
          action={
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-500" />Credit</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-slate-400" />Cash</span>
            </div>
          }
        >
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={salesTrend} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="gCredit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gCash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => fmtKHRShort(v)} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid rgba(128,128,128,0.15)", fontSize: 12 }}
                  formatter={(v: any) => fmtKHR(v as number)}
                />
                <Area key="credit" type="monotone" dataKey="credit" stroke="#10b981" strokeWidth={2} fill="url(#gCredit)" />
                <Area key="cash"   type="monotone" dataKey="cash"   stroke="#94a3b8" strokeWidth={2} fill="url(#gCash)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Debt Aging"
          action={<Button onClick={() => go("debts")} variant="ghost" className="h-8 text-xs text-muted-foreground">View report <ArrowRight className="size-3" /></Button>}
        >
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={aging} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" vertical={false} />
                <XAxis dataKey="bucket" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => fmtKHRShort(v)} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid rgba(128,128,128,0.15)", fontSize: 12 }}
                  formatter={(v: any) => fmtKHR(v as number)}
                />
                <Bar key="aging" dataKey="amount" radius={[8, 8, 0, 0]} fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* ── Tables row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <SectionCard
          className="xl:col-span-2"
          title={`Invoices — ${activeSeason.name}`}
          action={<Button onClick={() => go("invoices")} variant="ghost" className="h-8 text-xs text-muted-foreground">View all <ArrowRight className="size-3" /></Button>}
        >
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-right">Balance</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {seasonInvoices.slice(0, 6).map(i => (
                  <tr key={i.id} onClick={() => openInvoice(i.id)} className="border-b border-border last:border-0 hover:bg-muted/40 cursor-pointer">
                    <td className="px-5 py-3"><span className="font-mono text-xs">{i.no}</span></td>
                    <td className="px-5 py-3">{i.customer}</td>
                    <td className="px-5 py-3"><StatusPill status={i.type} /></td>
                    <td className="px-5 py-3 text-right tabular-nums">{fmtKHR(i.total)}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{fmtKHR(i.balance)}</td>
                    <td className="px-5 py-3"><StatusPill status={i.status} /></td>
                  </tr>
                ))}
                {seasonInvoices.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">No invoices for this season.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          title="Alerts"
          action={<Button onClick={() => go("notifications")} variant="ghost" className="h-8 text-xs text-muted-foreground">View all <ArrowRight className="size-3" /></Button>}
        >
          <div className="space-y-3">
            {notifications.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">No alerts for this season.</div>
            )}
            {notifications.slice(0, 5).map(n => (
              <div key={n.id} onClick={() => go("notifications")} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/40 cursor-pointer">
                <div className={
                  "size-8 rounded-lg flex items-center justify-center shrink-0 " +
                  (n.severity === "high"   ? "bg-rose-500/15 text-rose-500"
                  : n.severity === "medium" ? "bg-amber-500/15 text-amber-500"
                  :                          "bg-muted text-muted-foreground")
                }>
                  {n.type === "debt"   ? <AlertTriangle className="size-4" />
                  : n.type === "stock" ? <Package className="size-4" />
                  :                      <CalendarClock className="size-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm truncate">{n.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{n.desc}</div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">{n.time}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* ── Charts row 2 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <SectionCard
          className="xl:col-span-2"
          title={`Collections vs Disbursements — ${activeSeason.name}`}
          action={
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-violet-500" />Disbursed</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-500" />Collected</span>
            </div>
          }
        >
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={seasonFlow} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => fmtKHRShort(v)} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid rgba(128,128,128,0.15)", fontSize: 12 }}
                  formatter={(v: any) => fmtKHR(v as number)}
                />
                <Line key="disbursed" type="monotone" dataKey="disbursed" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                <Line key="collected" type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Top Debtors"
          action={<Button onClick={() => go("debts")} variant="ghost" className="h-8 text-xs text-muted-foreground">View all <ArrowRight className="size-3" /></Button>}
        >
          <div className="space-y-3">
            {topDebtors.map(c => (
              <div key={c.id} onClick={() => openCustomer(c.id)} className="flex items-center gap-3 cursor-pointer hover:bg-muted/40 -mx-2 px-2 py-1 rounded-lg">
                <Avatar2 initials={c.initials} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.village}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm tabular-nums">{fmtKHRShort(c.outstanding)}</div>
                  <div className="mt-1"><StatusPill status={c.risk} /></div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
