import { useState } from "react";
import { Sidebar, MobileNav, NavKey } from "./components/shell/Sidebar";
import { Topbar } from "./components/shell/Topbar";
import { Dashboard } from "./components/pages/Dashboard";
import { POS } from "./components/pages/POS";
import { Invoices } from "./components/pages/Invoices";
import { Customers, CustomerProfile } from "./components/pages/Customers";
import { Debts } from "./components/pages/Debts";
import { ProductsPage, CategoriesPage } from "./components/pages/Products";
import { Inventory } from "./components/pages/Inventory";
import { Purchases, Seasons, Cashbook, Reports } from "./components/pages/MoreModules";
import { Settings, Notifications } from "./components/pages/Settings";
import { AppProvider, useApp } from "./lib/AppContext";
import { InvoiceSheet } from "./components/overlays/InvoiceSheet";
import { ProductSheet } from "./components/overlays/ProductSheet";
import {
  NewCustomerDialog,
  RecordPaymentDialog,
  NewProductDialog,
  NewSeasonDialog,
  ProductFormDialog,
} from "./components/overlays/Dialogs";
import { CommandPalette } from "./components/overlays/CommandPalette";
import { Toaster } from "./components/ui/sonner";

const titles: Record<NavKey, { title: string; crumbs: string[] }> = {
  dashboard:            { title: "Dashboard",  crumbs: ["Overview",  "Dashboard"]  },
  pos:                  { title: "New Sale",   crumbs: ["Sales",     "New Sale"]   },
  invoices:             { title: "Invoices",   crumbs: ["Sales",     "Invoices"]   },
  customers:            { title: "Customers",  crumbs: ["Sales",     "Customers"]  },
  debts:                { title: "Debts",      crumbs: ["Sales",     "Debts"]      },
  products:             { title: "Products",   crumbs: ["Products",  "Products"]   },
  "product-categories": { title: "Categories", crumbs: ["Products",  "Categories"] },
  inventory:            { title: "Inventory",  crumbs: ["Operations","Inventory"]  },
  purchases:            { title: "Purchases",  crumbs: ["Operations","Purchases"]  },
  seasons:              { title: "Seasons",    crumbs: ["Operations","Seasons"]    },
  cashbook:             { title: "Cash Book",  crumbs: ["Operations","Cash Book"]  },
  reports:              { title: "Reports",    crumbs: ["Insights",  "Reports"]    },
  notifications:        { title: "Notifications", crumbs: ["System", "Notifications"] },
  settings:             { title: "Settings",   crumbs: ["System",    "Settings"]   },
};

function Shell() {
  const { active, customerId, go, closeCustomer } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const t = titles[active];
  const breadcrumb =
    customerId && active === "customers"
      ? ["Sales", "Customers", "Profile"]
      : t.crumbs;

  return (
    <div className="min-h-screen w-full bg-background text-foreground antialiased">
      <div className="flex">
        <Sidebar
          active={active}
          onChange={go}
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
        />
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar breadcrumb={breadcrumb} />
          <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 max-w-[1600px] w-full mx-auto">
            {active === "dashboard"            && <Dashboard />}
            {active === "pos"                  && <POS />}
            {active === "invoices"             && <Invoices />}
            {active === "customers" && !customerId && <Customers />}
            {active === "customers" && customerId  && <CustomerProfile id={customerId} onBack={closeCustomer} />}
            {active === "debts"                && <Debts />}
            {active === "products"             && <ProductsPage />}
            {active === "product-categories"   && <CategoriesPage />}
            {active === "inventory"            && <Inventory />}
            {active === "purchases"            && <Purchases />}
            {active === "seasons"              && <Seasons />}
            {active === "cashbook"             && <Cashbook />}
            {active === "reports"              && <Reports />}
            {active === "notifications"        && <Notifications />}
            {active === "settings"             && <Settings />}
          </main>
        </div>
      </div>

      <MobileNav active={active} onChange={go} />

      {/* Global overlays */}
      <InvoiceSheet />
      <ProductSheet />
      <NewCustomerDialog />
      <RecordPaymentDialog />
      <NewProductDialog />
      <NewSeasonDialog />
      <ProductFormDialog />
      <CommandPalette />
      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
