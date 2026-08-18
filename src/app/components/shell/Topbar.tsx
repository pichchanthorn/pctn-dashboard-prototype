import { Search, Bell, Plus, Menu, Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useApp } from "../../lib/AppContext";
import { NavKey } from "./Sidebar";
import { SeasonSelector } from "./SeasonSelector";

const crumbToNav: Record<string, NavKey> = {
  "Dashboard": "dashboard",
  "New Sale": "pos",
  "Invoices": "invoices",
  "Customers": "customers",
  "Debts": "debts",
  "Products": "products",
  "Categories": "product-categories",
  "Inventory": "inventory",
  "Purchases": "purchases",
  "Seasons": "seasons",
  "Cash Book": "cashbook",
  "Reports": "reports",
  "Notifications": "notifications",
  "Settings": "settings",
};

export function Topbar({ breadcrumb }: { breadcrumb: string[] }) {
  const { go, setPalette, toggleTheme, theme } = useApp();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur flex items-center gap-3 px-4 lg:px-8">
      {/* Mobile menu */}
      <button className="lg:hidden size-9 rounded-md hover:bg-accent flex items-center justify-center">
        <Menu className="size-5" />
      </button>

      {/* Breadcrumb */}
      <div className="hidden lg:flex items-center gap-2 min-w-0">
        {breadcrumb.map((b, i) => {
          const last   = i === breadcrumb.length - 1;
          const target = crumbToNav[b];
          return (
            <div key={i} className="flex items-center gap-2 text-sm">
              {i > 0 && <span className="text-muted-foreground/50">/</span>}
              {target && !last ? (
                <button
                  onClick={() => go(target)}
                  className="text-muted-foreground hover:text-foreground transition"
                >{b}</button>
              ) : (
                <span className={last ? "text-foreground" : "text-muted-foreground"}>{b}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex-1" />

      {/* Global search */}
      <button
        onClick={() => setPalette(true)}
        className="hidden md:flex items-center gap-3 h-9 w-64 px-3 rounded-lg border border-border bg-muted/40 text-sm text-muted-foreground hover:bg-muted transition"
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="text-xs px-1.5 py-0.5 rounded bg-background border border-border shrink-0">⌘K</kbd>
      </button>

      {/* Season selector (interactive dropdown) */}
      <SeasonSelector />

      {/* Notifications */}
      <button
        onClick={() => go("notifications")}
        className="size-9 rounded-lg hover:bg-accent flex items-center justify-center relative transition"
        aria-label="Notifications"
      >
        <Bell className="size-[18px]" />
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-emerald-500" />
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        className="hidden md:flex size-9 rounded-lg hover:bg-accent items-center justify-center transition"
        aria-label="Toggle theme"
      >
        {theme === "light" ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
      </button>

      {/* New Sale */}
      <Button
        onClick={() => go("pos")}
        className="hidden md:flex bg-emerald-600 hover:bg-emerald-700 text-white h-9"
      >
        <Plus className="size-4" /> New Sale
      </Button>

      {/* Avatar → Settings */}
      <button onClick={() => go("settings")} title="Settings">
        <Avatar className="size-9">
          <AvatarFallback className="bg-emerald-500/15 text-emerald-500 text-sm">SK</AvatarFallback>
        </Avatar>
      </button>
    </header>
  );
}
