import { Plus, Download, Truck, CalendarRange, Wallet, ArrowUpRight, ArrowDownRight, FileText, MoreHorizontal } from "lucide-react";
import { PageHeader, SectionCard, StatCard, StatusPill } from "../shell/Primitives";
import { Button } from "../ui/button";
import { suppliers, seasons, seasonFlow } from "../../lib/mock";
import { fmtKHR, fmtKHRShort, fmtDate } from "../../lib/format";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

export function Purchases() {
  return (
    <div>
      <PageHeader
        title="Purchases"
        description="Manage suppliers, purchase orders, and stock-in."
        actions={
          <>
            <Button variant="outline" className="h-9" onClick={() => toast.success("Export started")}><Download className="size-4" /> Export</Button>
            <Button onClick={() => toast.info("PO form")} className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="size-4" /> New PO</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Suppliers" value={suppliers.length} icon={<Truck className="size-4" />} />
        <StatCard label="Open POs" value={4} hint="awaiting delivery" />
        <StatCard label="Payable" value={fmtKHRShort(suppliers.reduce((s, x) => s + x.owed, 0))} intent="warning" />
        <StatCard label="Spend MTD" value={fmtKHRShort(12_400_000)} delta={-6} hint="vs last month" />
      </div>

      <SectionCard title="Suppliers">
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-5 py-3">Supplier</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3 text-right">Owed</th>
                <th className="px-5 py-3">Last PO</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(s => (
                <tr key={s.id} onClick={() => toast.info(`Open ${s.name}`)} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer">
                  <td className="px-5 py-3">{s.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{s.contact}</td>
                  <td className="px-5 py-3 text-muted-foreground tabular-nums">{s.phone}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{fmtKHR(s.owed)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{fmtDate(s.lastPO)}</td>
                  <td className="px-5 py-3"><MoreHorizontal className="size-4 text-muted-foreground" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

export function Seasons() {
  return (
    <div>
      <PageHeader
        title="Seasons"
        description="Track sales, collections, and exposure across crop seasons."
        actions={<Button onClick={() => toast.info("Season form")} className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="size-4" /> New Season</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {seasons.map(s => (
          <div key={s.id} className="rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CalendarRange className="size-4 text-emerald-600" />
                  <h3 className="text-base">{s.name}</h3>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{fmtDate(s.start)} → {fmtDate(s.end)}</div>
              </div>
              <StatusPill status={s.status} />
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sales</span>
                <span className="tabular-nums">{fmtKHRShort(s.sales)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Collected</span>
                <span className="tabular-nums text-emerald-700">{fmtKHRShort(s.collected)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Outstanding</span>
                <span className="tabular-nums">{fmtKHRShort(s.outstanding)}</span>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Collection rate</span>
                  <span className="tabular-nums">{Math.round(s.collected / s.sales * 100)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: (s.collected / s.sales * 100) + "%" }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SectionCard title="Season Flow" action={<div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-violet-500"/>Disbursed</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-500"/>Collected</span>
      </div>}>
        <div className="h-72">
          <ResponsiveContainer>
            <AreaChart data={seasonFlow} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="d1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3}/><stop offset="100%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
                <linearGradient id="d2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="100%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => fmtKHRShort(v)} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => fmtKHR(v as number)} />
              <Area key="disbursed" type="monotone" dataKey="disbursed" stroke="#8b5cf6" strokeWidth={2} fill="url(#d1)" />
              <Area key="collected" type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={2} fill="url(#d2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}

export function Cashbook() {
  const entries = [
    { id: 1, date: "2026-06-28", type: "in", category: "Sale", amount: 1_580_000, note: "Cash sales", by: "Sokun" },
    { id: 2, date: "2026-06-28", type: "in", category: "Payment", amount: 200_000, note: "Chan Dara — INV-002416", by: "Sokun" },
    { id: 3, date: "2026-06-28", type: "out", category: "Supplier", amount: 800_000, note: "Mekong Agri Imports", by: "Sokun" },
    { id: 4, date: "2026-06-27", type: "out", category: "Expense", amount: 45_000, note: "Petrol — pickup truck", by: "Mealea" },
    { id: 5, date: "2026-06-27", type: "in", category: "Sale", amount: 1_380_000, note: "Cash sales", by: "Mealea" },
    { id: 6, date: "2026-06-26", type: "out", category: "Expense", amount: 120_000, note: "Electricity bill", by: "Sokun" },
  ];
  const inflow = entries.filter(e => e.type === "in").reduce((s, e) => s + e.amount, 0);
  const outflow = entries.filter(e => e.type === "out").reduce((s, e) => s + e.amount, 0);

  return (
    <div>
      <PageHeader
        title="Cash Book"
        description="Daily income, expenses, and reconciliation."
        actions={
          <>
            <Button variant="outline" className="h-9" onClick={() => toast.info("Daily close wizard")}><FileText className="size-4" /> Daily Close</Button>
            <Button onClick={() => toast.info("New entry form")} className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="size-4" /> New Entry</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Cash in hand" value={fmtKHRShort(8_240_000)} icon={<Wallet className="size-4" />} />
        <StatCard label="Inflow today" value={fmtKHRShort(inflow)} intent="positive" icon={<ArrowUpRight className="size-4" />} />
        <StatCard label="Outflow today" value={fmtKHRShort(outflow)} intent="danger" icon={<ArrowDownRight className="size-4" />} />
        <StatCard label="Net" value={fmtKHRShort(inflow - outflow)} delta={inflow > outflow ? 8 : -8} />
      </div>

      <SectionCard title="Recent Entries">
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Note</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3">By</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-5 py-3 text-muted-foreground">{fmtDate(e.date)}</td>
                  <td className="px-5 py-3">
                    <span className={"inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md " + (e.type === "in" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
                      {e.type === "in" ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                      {e.type === "in" ? "Income" : "Expense"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{e.category}</td>
                  <td className="px-5 py-3">{e.note}</td>
                  <td className={"px-5 py-3 text-right tabular-nums " + (e.type === "in" ? "text-emerald-700" : "text-rose-700")}>
                    {e.type === "in" ? "+" : "−"} {fmtKHR(e.amount)}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{e.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

export function Reports() {
  const reports = [
    { title: "Sales Report", desc: "Revenue, qty, COGS by product/staff", icon: ArrowUpRight },
    { title: "Credit Sales", desc: "Disbursed vs collected by period", icon: FileText },
    { title: "Debt Aging", desc: "Outstanding by bucket and customer", icon: FileText },
    { title: "Collections", desc: "Payments received timeline", icon: FileText },
    { title: "Inventory", desc: "Current stock and movement", icon: FileText },
    { title: "Expiry", desc: "At-risk batches and value", icon: FileText },
    { title: "Purchases", desc: "Spend by supplier and product", icon: FileText },
    { title: "Profit & Loss", desc: "Revenue − COGS − Expenses", icon: FileText },
    { title: "Season Performance", desc: "Disburse vs collect per season", icon: FileText },
    { title: "Top Customers", desc: "By revenue and reliability", icon: FileText },
    { title: "Top Defaulters", desc: "Overdue and default rate", icon: FileText },
    { title: "Audit Trail", desc: "All actions and changes", icon: FileText },
  ];
  return (
    <div>
      <PageHeader title="Reports" description="Exportable, filterable business intelligence." />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reports.map(r => {
          const Icon = r.icon;
          return (
            <button key={r.title} onClick={() => toast.info(`Opening ${r.title}`)} className="text-left p-5 rounded-2xl border border-border bg-card hover:border-emerald-300 hover:shadow-[0_4px_12px_rgba(16,24,40,0.06)] transition group">
              <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                <Icon className="size-5" />
              </div>
              <div className="mt-4">{r.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{r.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
