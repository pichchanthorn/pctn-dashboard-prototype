import { useState } from "react";
import {
  Store, DollarSign, Users, Shield, Layers, Hash, Globe,
  Database, Plug, History, ChevronRight, Plus, Trash2,
  Download, CheckCircle2, XCircle,
} from "lucide-react";
import { PageHeader, SectionCard, StatusPill } from "../shell/Primitives";
import { Button } from "../ui/button";
import { AlertTriangle, Package as PackageIcon, CalendarClock } from "lucide-react";
import { notifications } from "../../lib/mock";
import { cn } from "../ui/utils";
import { toast } from "sonner";

const groups = [
  { key: "store",        label: "Store",                icon: Store,    desc: "Name, logo, contact, invoice footer" },
  { key: "pricing",      label: "Pricing & Interest",   icon: DollarSign, desc: "Default interest, rounding, overrides" },
  { key: "users",        label: "Users",                icon: Users,    desc: "Team members and invitations" },
  { key: "roles",        label: "Roles & Permissions",  icon: Shield,   desc: "Custom access control" },
  { key: "categories",   label: "Categories & Units",   icon: Layers,   desc: "Product taxonomy" },
  { key: "numbering",    label: "Document Numbering",   icon: Hash,     desc: "Invoice and PO prefixes" },
  { key: "currency",     label: "Currency",             icon: Globe,    desc: "KHR / USD and FX rate" },
  { key: "backup",       label: "Backup & Export",      icon: Database, desc: "Export and restore data" },
  { key: "integrations", label: "Integrations",         icon: Plug,     desc: "Telegram, SMS, Bakong KHQR" },
  { key: "audit",        label: "Audit Log",            icon: History,  desc: "Full activity history" },
];

function Field({ label, value, full, type = "text", helper }: { label: string; value: string; full?: boolean; type?: string; helper?: string }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input type={type} defaultValue={value} className="mt-1.5 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
      {helper && <p className="mt-1 text-xs text-muted-foreground">{helper}</p>}
    </div>
  );
}

function SaveBar({ label = "Save Changes" }: { label?: string }) {
  return (
    <div className="mt-6 flex justify-end">
      <Button onClick={() => toast.success("Settings saved")} className="bg-emerald-600 hover:bg-emerald-700 text-white">{label}</Button>
    </div>
  );
}

const CATEGORIES = [
  { id: 1, name: "Chemical Fertilizer", color: "#10b981", products: 3 },
  { id: 2, name: "Organic Fertilizer",  color: "#6366f1", products: 1 },
  { id: 3, name: "Herbicide",           color: "#f59e0b", products: 2 },
  { id: 4, name: "Insecticide",         color: "#ef4444", products: 1 },
  { id: 5, name: "Fungicide",           color: "#8b5cf6", products: 1 },
  { id: 6, name: "Rice Seed",           color: "#0ea5e9", products: 2 },
  { id: 7, name: "Agricultural Product",color: "#64748b", products: 1 },
];

const AUDIT_LOG = [
  { id: 1, user: "Sokun",  entity: "Invoice",  action: "Created",  detail: "INV-002418 — 640,000 ៛",     time: "Jun 28, 10:41" },
  { id: 2, user: "Sokun",  entity: "Payment",  action: "Recorded", detail: "Chan Dara — 200,000 ៛",      time: "Jun 28, 09:18" },
  { id: 3, user: "Mealea", entity: "Customer", action: "Created",  detail: "Long Thida",                  time: "Jun 26, 14:02" },
  { id: 4, user: "Sokun",  entity: "Product",  action: "Updated",  detail: "Urea 50kg — price adjusted",  time: "Jun 25, 11:30" },
  { id: 5, user: "Mealea", entity: "Invoice",  action: "Voided",   detail: "INV-002380",                  time: "Jun 24, 16:55" },
  { id: 6, user: "Davy",   entity: "Payment",  action: "Recorded", detail: "Kim Sokha — 215,000 ៛",       time: "Jun 22, 13:20" },
];

const ROLES = ["Owner", "Manager", "Cashier", "Stock Keeper"] as const;
const PERMS = [
  "View dashboard", "Create invoices", "Void invoices",
  "Record payments", "Manage customers", "Manage inventory",
  "Manage suppliers", "View reports", "Export data",
  "Manage users", "Manage settings",
];
const ROLE_PERMS: Record<string, Set<string>> = {
  Owner:        new Set(PERMS),
  Manager:      new Set(PERMS.filter(p => !["Manage users", "Manage settings"].includes(p))),
  Cashier:      new Set(["View dashboard", "Create invoices", "Record payments", "View reports"]),
  "Stock Keeper": new Set(["View dashboard", "Manage inventory", "View reports"]),
};

const INTEGRATIONS = [
  { key: "telegram", name: "Telegram Bot",    desc: "Send debt reminders & receive payment confirmations",   enabled: false },
  { key: "sms",      name: "SMS Gateway",     desc: "Cellcard / Smart SMS for payment reminders",            enabled: false },
  { key: "aba",      name: "ABA PayWay",      desc: "Accept ABA mobile payments",                            enabled: true  },
  { key: "wing",     name: "Wing Money",      desc: "Accept Wing payment collection",                        enabled: true  },
  { key: "khqr",     name: "Bakong KHQR",     desc: "NBC KHQR QR code on invoices",                         enabled: false },
];

export function Settings() {
  const [active, setActive] = useState("store");
  const [integrations, setIntegrations] = useState(INTEGRATIONS);

  const toggleIntegration = (key: string) => {
    setIntegrations(prev => prev.map(i => i.key === key ? { ...i, enabled: !i.enabled } : i));
    const item = integrations.find(i => i.key === key);
    toast.success(item?.enabled ? `${item.name} disabled` : `${item?.name} enabled`);
  };

  return (
    <div>
      <PageHeader title="Settings" description="Configure your store, team, and integrations." />
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <nav className="space-y-1">
          {groups.map(g => {
            const Icon = g.icon;
            return (
              <button key={g.key} onClick={() => setActive(g.key)} className={cn(
                "w-full flex items-center gap-3 rounded-xl p-3 text-sm transition",
                active === g.key ? "bg-emerald-50 text-emerald-700" : "hover:bg-accent text-foreground/80"
              )}>
                <Icon className={cn("size-[18px] shrink-0", active === g.key && "text-emerald-600")} />
                <div className="flex-1 text-left min-w-0">
                  <div className="truncate">{g.label}</div>
                  <div className="text-xs text-muted-foreground truncate">{g.desc}</div>
                </div>
                <ChevronRight className={cn("size-4 shrink-0 transition-transform", active === g.key && "rotate-90 text-emerald-600")} />
              </button>
            );
          })}
        </nav>

        <div className="space-y-6 min-w-0">

          {/* ─── Store ─────────────────────────────── */}
          {active === "store" && (
            <SectionCard title="Store Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Store name (EN)" value="Sovann Agricultural Supplies" />
                <Field label="Store name (KH)" value="ហាង​ស្ករ​វណ្ណ" />
                <Field label="Phone" value="012 880 442" />
                <Field label="Tax ID" value="K001-9912-330" />
                <Field label="Address" value="National Road 5, Battambang" full />
                <Field label="Invoice footer (EN)" value="Thank you for trusting Sovann Agri." full />
              </div>
              <SaveBar />
            </SectionCard>
          )}

          {/* ─── Pricing ───────────────────────────── */}
          {active === "pricing" && (
            <>
              <SectionCard title="Default Interest Settings">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Default credit interest (%)" value="10" type="number" helper="Applied to credit price = cash × (1 + rate)" />
                  <Field label="Rounding (KHR)" value="100" type="number" helper="Round credit price to nearest N" />
                  <Field label="Default due window (days)" value="180" type="number" helper="Days from invoice date until due" />
                </div>
                <SaveBar />
              </SectionCard>
              <SectionCard title="Category Overrides">
                <p className="text-sm text-muted-foreground mb-4">Override the default interest rate per product category.</p>
                <div className="space-y-2">
                  {CATEGORIES.map(c => (
                    <div key={c.id} className="flex items-center gap-4 p-3 rounded-xl border border-border">
                      <span className="text-sm flex-1">{c.name}</span>
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue="10" className="w-20 h-8 px-3 rounded-lg border border-border bg-card text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <SaveBar label="Save Overrides" />
              </SectionCard>
            </>
          )}

          {/* ─── Users ─────────────────────────────── */}
          {active === "users" && (
            <SectionCard title="Team Members" action={
              <Button onClick={() => toast.info("Invite link copied to clipboard")} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs">+ Invite</Button>
            }>
              <div className="space-y-2">
                {[
                  { name: "Sokun Tep",   role: "Owner",       phone: "012 880 442", last: "Online now", online: true  },
                  { name: "Mealea Chum", role: "Manager",     phone: "017 220 991", last: "2h ago",     online: false },
                  { name: "Davy Heng",   role: "Cashier",     phone: "086 119 002", last: "Yesterday",  online: false },
                ].map(u => (
                  <div key={u.name} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30">
                    <div className="relative">
                      <div className="size-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm">{u.name.split(" ").map(x => x[0]).join("")}</div>
                      {u.online && <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.role} · {u.phone}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{u.last}</div>
                    <Button variant="outline" className="h-7 text-xs" onClick={() => toast.info(`Edit ${u.name}`)}>Edit</Button>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* ─── Roles ─────────────────────────────── */}
          {active === "roles" && (
            <SectionCard title="Role Permissions">
              <p className="text-sm text-muted-foreground mb-4">Control what each role can access.</p>
              <div className="overflow-x-auto -mx-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-5 py-2 text-left text-xs uppercase tracking-wider text-muted-foreground">Permission</th>
                      {ROLES.map(r => <th key={r} className="px-4 py-2 text-center text-xs uppercase tracking-wider text-muted-foreground">{r}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {PERMS.map(perm => (
                      <tr key={perm} className="border-b border-border last:border-0">
                        <td className="px-5 py-2.5 text-sm">{perm}</td>
                        {ROLES.map(role => {
                          const has = ROLE_PERMS[role].has(perm);
                          return (
                            <td key={role} className="px-4 py-2.5 text-center">
                              {has
                                ? <CheckCircle2 className="size-4 text-emerald-500 mx-auto" />
                                : <XCircle className="size-4 text-muted-foreground/30 mx-auto" />}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4"><Button variant="outline" onClick={() => toast.info("Custom role editor")} className="text-xs">+ Create Custom Role</Button></div>
            </SectionCard>
          )}

          {/* ─── Categories ────────────────────────── */}
          {active === "categories" && (
            <SectionCard title="Product Categories" action={
              <Button onClick={() => toast.info("Add category")} variant="outline" className="h-8 text-xs"><Plus className="size-3" /> Add</Button>
            }>
              <div className="space-y-2">
                {CATEGORIES.map(c => (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                    <div className="size-3 rounded-full shrink-0" style={{ background: c.color }} />
                    <span className="text-sm flex-1">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.products} products</span>
                    <Button variant="ghost" className="h-7 text-xs" onClick={() => toast.info(`Edit ${c.name}`)}>Edit</Button>
                    <button onClick={() => toast.error("Cannot delete category with products")} className="size-7 rounded-md hover:bg-rose-50 hover:text-rose-600 text-muted-foreground flex items-center justify-center">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">Units of Measure</p>
                <div className="flex flex-wrap gap-2">
                  {["kg", "L", "bag", "bottle", "pack", "unit", "sack"].map(u => (
                    <div key={u} className="flex items-center gap-1 px-3 h-8 rounded-full border border-border text-sm">
                      {u}
                      <button onClick={() => toast.error(`"${u}" is in use`)} className="ml-1 hover:text-rose-600"><XCircle className="size-3" /></button>
                    </div>
                  ))}
                  <Button variant="outline" className="h-8 rounded-full text-xs" onClick={() => toast.info("Add unit")}><Plus className="size-3" /> Add unit</Button>
                </div>
              </div>
            </SectionCard>
          )}

          {/* ─── Numbering ─────────────────────────── */}
          {active === "numbering" && (
            <SectionCard title="Document Numbering">
              <p className="text-sm text-muted-foreground mb-4">Configure prefixes and sequence for invoices, POs, and payments.</p>
              <div className="space-y-4">
                {[
                  { doc: "Invoice",          prefix: "INV",  next: 2419, padding: 6 },
                  { doc: "Purchase Order",   prefix: "PO",   next: 318,  padding: 5 },
                  { doc: "Payment Receipt",  prefix: "RCP",  next: 891,  padding: 5 },
                  { doc: "Credit Note",      prefix: "CN",   next: 42,   padding: 4 },
                ].map(d => (
                  <div key={d.doc} className="flex items-center gap-4 p-4 rounded-xl border border-border">
                    <div className="flex-1">
                      <div className="text-sm">{d.doc}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Next: <span className="font-mono">{d.prefix}-{String(d.next).padStart(d.padding, "0")}</span></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Prefix</label>
                        <input defaultValue={d.prefix} className="mt-1 w-20 h-8 px-2 rounded-lg border border-border bg-card text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Next #</label>
                        <input type="number" defaultValue={d.next} className="mt-1 w-20 h-8 px-2 rounded-lg border border-border bg-card text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <SaveBar />
            </SectionCard>
          )}

          {/* ─── Currency ──────────────────────────── */}
          {active === "currency" && (
            <SectionCard title="Currency Settings">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Primary currency" value="KHR — Cambodian Riel" />
                <Field label="Secondary currency" value="USD — US Dollar" />
                <Field label="Exchange rate (1 USD =)" value="4,100" type="number" helper="Last updated Jun 28, 2026" />
                <Field label="Rounding (KHR display)" value="100" type="number" helper="Round displayed amounts to nearest N" />
              </div>
              <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="size-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-sm text-amber-900">Exchange rate changes affect display only. Existing invoices keep their original amounts.</div>
              </div>
              <SaveBar />
            </SectionCard>
          )}

          {/* ─── Backup ────────────────────────────── */}
          {active === "backup" && (
            <SectionCard title="Backup & Export">
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-border flex items-center justify-between">
                  <div>
                    <div className="text-sm">Full Database Export</div>
                    <div className="text-xs text-muted-foreground mt-0.5">All customers, invoices, payments, and inventory as JSON</div>
                  </div>
                  <Button onClick={() => toast.success("Backup downloading…")} variant="outline" className="h-9"><Download className="size-4" /> Export</Button>
                </div>
                <div className="p-4 rounded-xl border border-border flex items-center justify-between">
                  <div>
                    <div className="text-sm">Export as Excel</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Customers, invoices, and payments in .xlsx format</div>
                  </div>
                  <Button onClick={() => toast.success("Excel export started…")} variant="outline" className="h-9"><Download className="size-4" /> Export</Button>
                </div>
                <div className="p-4 rounded-xl border border-border flex items-center justify-between">
                  <div>
                    <div className="text-sm">Auto Backup</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Last backup: Jun 28, 2026 00:00</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select className="h-9 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Manual only</option>
                    </select>
                    <Button onClick={() => toast.success("Backup schedule saved")} className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white">Save</Button>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border">
                  <div className="text-sm mb-2">Restore from backup</div>
                  <div className="flex items-center gap-3">
                    <input type="file" className="text-sm text-muted-foreground file:mr-3 file:h-8 file:rounded-lg file:border file:border-border file:bg-card file:text-sm file:text-foreground" accept=".json" />
                    <Button onClick={() => toast.info("Select a .json backup file first")} variant="outline" className="h-9 shrink-0">Restore</Button>
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {/* ─── Integrations ──────────────────────── */}
          {active === "integrations" && (
            <SectionCard title="Integrations">
              <div className="space-y-3">
                {integrations.map(i => (
                  <div key={i.key} className="flex items-center gap-4 p-4 rounded-xl border border-border">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">{i.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{i.desc}</div>
                    </div>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full ring-1 ring-inset", i.enabled ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-50 text-slate-500 ring-slate-200")}>
                      {i.enabled ? "Connected" : "Disabled"}
                    </span>
                    <Button variant="outline" className="h-8 text-xs shrink-0" onClick={() => toggleIntegration(i.key)}>
                      {i.enabled ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* ─── Audit ─────────────────────────────── */}
          {active === "audit" && (
            <SectionCard title="Audit Log" action={
              <Button onClick={() => toast.success("Audit log exported")} variant="outline" className="h-8 text-xs"><Download className="size-3" /> Export</Button>
            }>
              <div className="overflow-x-auto -mx-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                      <th className="px-5 py-3">User</th>
                      <th className="px-5 py-3">Entity</th>
                      <th className="px-5 py-3">Action</th>
                      <th className="px-5 py-3">Detail</th>
                      <th className="px-5 py-3">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AUDIT_LOG.map(row => (
                      <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-5 py-3">{row.user}</td>
                        <td className="px-5 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-md bg-muted">{row.entity}</span>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">{row.action}</td>
                        <td className="px-5 py-3 text-muted-foreground">{row.detail}</td>
                        <td className="px-5 py-3 text-muted-foreground tabular-nums">{row.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Notifications page
// ─────────────────────────────────────────────────────────────

type NotifTab = "All" | "Debts" | "Stock" | "System";

export function Notifications() {
  const [tab, setTab] = useState<NotifTab>("All");
  const [read, setRead] = useState<Set<string>>(new Set());

  const filtered = notifications.filter(n => {
    if (tab === "Debts")  return n.type === "debt";
    if (tab === "Stock")  return n.type === "stock";
    if (tab === "System") return n.type === "system";
    return true;
  });

  const markRead = (id: string) => setRead(prev => new Set([...prev, id]));
  const markAll  = () => setRead(new Set(notifications.map(n => n.id)));

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Alerts about debts, stock, and system events."
        actions={
          <Button variant="outline" className="h-9" onClick={markAll}>Mark all as read</Button>
        }
      />

      <div className="flex items-center gap-1 mb-4 border-b border-border">
        {(["All", "Debts", "Stock", "System"] as NotifTab[]).map(t => {
          const count = notifications.filter(n =>
            t === "All" ? true : t === "Debts" ? n.type === "debt" : t === "Stock" ? n.type === "stock" : n.type === "system"
          ).length;
          return (
            <button key={t} onClick={() => setTab(t)} className={cn(
              "px-4 h-10 text-sm relative",
              tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}>
              {t} <span className="ml-1 text-xs text-muted-foreground">({count})</span>
              {tab === t && <span className="absolute bottom-[-1px] inset-x-0 h-0.5 bg-emerald-600 rounded-full" />}
            </button>
          );
        })}
      </div>

      <SectionCard>
        <div className="divide-y divide-border -mx-5">
          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground">No notifications in this category.</div>
          )}
          {filtered.map(n => {
            const isRead = read.has(n.id);
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={cn("px-5 py-4 flex items-start gap-4 cursor-pointer transition", isRead ? "opacity-50" : "hover:bg-muted/30")}
              >
                {!isRead && <div className="mt-2 size-1.5 rounded-full bg-emerald-500 shrink-0" />}
                {isRead  && <div className="mt-2 size-1.5 shrink-0" />}
                <div className={cn("size-10 rounded-xl flex items-center justify-center shrink-0",
                  n.severity === "high"   ? "bg-rose-50 text-rose-600"
                  : n.severity === "medium" ? "bg-amber-50 text-amber-600"
                  :                          "bg-slate-50 text-slate-600"
                )}>
                  {n.type === "debt"   ? <AlertTriangle className="size-5" />
                  : n.type === "stock" ? <PackageIcon className="size-5" />
                  :                      <CalendarClock className="size-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn("text-sm", !isRead && "font-medium")}>{n.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{n.desc}</div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">{n.time}</div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
