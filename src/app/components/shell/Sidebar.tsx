import {
  LayoutDashboard, ShoppingCart, FileText, Users, CreditCard,
  Package2, Tags, Package, Truck, CalendarRange, Wallet,
  BarChart3, Bell, Settings, Sprout, ChevronsLeft,
} from "lucide-react";
import { cn } from "../ui/utils";
import { useApp } from "../../lib/AppContext";
import { seasons } from "../../lib/mock";

export type NavKey =
  | "dashboard"
  | "pos" | "invoices" | "customers" | "debts"
  | "products" | "product-categories"
  | "inventory" | "purchases" | "seasons" | "cashbook"
  | "reports" | "notifications" | "settings";

const items: { key: NavKey; label: string; icon: any; group: string; badge?: string }[] = [
  { key: "dashboard",          label: "Dashboard",   icon: LayoutDashboard, group: "Overview" },
  { key: "pos",                label: "New Sale",     icon: ShoppingCart,    group: "Sales" },
  { key: "invoices",           label: "Invoices",     icon: FileText,        group: "Sales" },
  { key: "customers",          label: "Customers",    icon: Users,           group: "Sales" },
  { key: "debts",              label: "Debts",        icon: CreditCard,      group: "Sales", badge: "12" },
  { key: "products",           label: "Products",     icon: Package2,        group: "Products" },
  { key: "product-categories", label: "Categories",   icon: Tags,            group: "Products" },
  { key: "inventory",          label: "Inventory",    icon: Package,         group: "Operations" },
  { key: "purchases",          label: "Purchases",    icon: Truck,           group: "Operations" },
  { key: "seasons",            label: "Seasons",      icon: CalendarRange,   group: "Operations" },
  { key: "cashbook",           label: "Cash Book",    icon: Wallet,          group: "Operations" },
  { key: "reports",            label: "Reports",      icon: BarChart3,       group: "Insights" },
  { key: "notifications",      label: "Notifications",icon: Bell,            group: "System", badge: "5" },
  { key: "settings",           label: "Settings",     icon: Settings,        group: "System" },
];

export function Sidebar({ active, onChange, collapsed, onToggle }: {
  active: NavKey;
  onChange: (k: NavKey) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { activeSeasonId } = useApp();
  const activeSeason = seasons.find(s => s.id === activeSeasonId) ?? seasons[0];

  const today    = new Date();
  const endDate  = new Date(activeSeason.end);
  const total    = Math.floor((endDate.getTime() - new Date(activeSeason.start).getTime()) / 86400000);
  const left     = Math.max(0, Math.floor((endDate.getTime() - today.getTime()) / 86400000));
  const progress = activeSeason.status === "closed" ? 100 : Math.round((1 - left / total) * 100);

  const groups = Array.from(new Set(items.map(i => i.group)));

  return (
    <aside className={cn(
      "hidden lg:flex h-screen sticky top-0 flex-col border-r border-border bg-sidebar transition-all duration-200",
      collapsed ? "w-[72px]" : "w-[248px]"
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-4 border-b border-border">
        <div className="size-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <Sprout className="size-5" />
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <div className="truncate">Sovann Agri</div>
              <div className="text-xs text-muted-foreground truncate">Store Management</div>
            </div>
            <button onClick={onToggle} className="size-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground">
              <ChevronsLeft className="size-4" />
            </button>
          </>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {groups.map(g => (
          <div key={g}>
            {!collapsed && (
              <div className="px-3 mb-2 text-xs uppercase tracking-wider text-muted-foreground">{g}</div>
            )}
            <div className="space-y-1">
              {items.filter(i => i.group === g).map(i => {
                const Icon = i.icon;
                const isActive = active === i.key;
                return (
                  <button
                    key={i.key}
                    onClick={() => onChange(i.key)}
                    title={collapsed ? i.label : undefined}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-emerald-500/15 text-emerald-500"
                        : "text-foreground/80 hover:bg-accent hover:text-foreground",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <Icon className={cn("size-[18px] shrink-0", isActive && "text-emerald-500")} />
                    {!collapsed && <span className="flex-1 text-left truncate">{i.label}</span>}
                    {!collapsed && i.badge && (
                      <span className={cn(
                        "text-xs px-1.5 rounded-md",
                        isActive ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"
                      )}>
                        {i.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Season card */}
      <div className="border-t border-border p-3">
        {collapsed ? (
          <button onClick={onToggle} className="w-full h-9 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground">
            <ChevronsLeft className="size-4 rotate-180" />
          </button>
        ) : (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
            <div className="text-sm text-emerald-500 truncate">{activeSeason.name}</div>
            <div className="text-xs text-emerald-500/70 mt-1">
              {activeSeason.status === "closed" ? "Season closed" : `${left} days remaining`}
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-emerald-500/20 overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export function MobileNav({ active, onChange }: { active: NavKey; onChange: (k: NavKey) => void }) {
  const mobile: { key: NavKey; label: string; icon: any }[] = [
    { key: "dashboard", label: "Home",      icon: LayoutDashboard },
    { key: "pos",       label: "Sale",      icon: ShoppingCart },
    { key: "products",  label: "Products",  icon: Package2 },
    { key: "debts",     label: "Debts",     icon: CreditCard },
    { key: "settings",  label: "More",      icon: Settings },
  ];
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border h-16 flex">
      {mobile.map(i => {
        const Icon = i.icon;
        const isActive = active === i.key;
        return (
          <button key={i.key} onClick={() => onChange(i.key)}
            className={cn("flex-1 flex flex-col items-center justify-center gap-1 text-xs",
              isActive ? "text-emerald-500" : "text-muted-foreground")}>
            <Icon className="size-5" />
            <span>{i.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
