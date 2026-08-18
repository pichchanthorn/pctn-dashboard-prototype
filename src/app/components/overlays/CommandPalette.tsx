import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../ui/command";
import { LayoutDashboard, ShoppingCart, FileText, Users, CreditCard, Package2, Tags, Package, Truck, CalendarRange, Wallet, BarChart3, Bell, Settings, Plus, Search } from "lucide-react";
import { useApp } from "../../lib/AppContext";
import { customers, invoices, products } from "../../lib/mock";

export function CommandPalette() {
  const { paletteOpen, setPalette, go, openCustomer, openInvoice, openProduct, openDialog } = useApp();
  const run = (fn: () => void) => { fn(); setPalette(false); };

  return (
    <CommandDialog open={paletteOpen} onOpenChange={setPalette}>
      <CommandInput placeholder="Search pages, products, customers, invoices…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => run(() => go("pos"))}><Plus /> New Sale</CommandItem>
          <CommandItem onSelect={() => run(() => openDialog("add-product"))}><Plus /> Add Product</CommandItem>
          <CommandItem onSelect={() => run(() => openDialog("new-customer"))}><Plus /> New Customer</CommandItem>
          <CommandItem onSelect={() => run(() => openDialog("record-payment"))}><Plus /> Record Payment</CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => run(() => go("dashboard"))}><LayoutDashboard /> Dashboard</CommandItem>
          <CommandItem onSelect={() => run(() => go("pos"))}><ShoppingCart /> New Sale</CommandItem>
          <CommandItem onSelect={() => run(() => go("invoices"))}><FileText /> Invoices</CommandItem>
          <CommandItem onSelect={() => run(() => go("customers"))}><Users /> Customers</CommandItem>
          <CommandItem onSelect={() => run(() => go("debts"))}><CreditCard /> Debts</CommandItem>
          <CommandItem onSelect={() => run(() => go("products"))}><Package2 /> Products</CommandItem>
          <CommandItem onSelect={() => run(() => go("product-categories"))}><Tags /> Categories</CommandItem>
          <CommandItem onSelect={() => run(() => go("inventory"))}><Package /> Inventory</CommandItem>
          <CommandItem onSelect={() => run(() => go("purchases"))}><Truck /> Purchases</CommandItem>
          <CommandItem onSelect={() => run(() => go("seasons"))}><CalendarRange /> Seasons</CommandItem>
          <CommandItem onSelect={() => run(() => go("cashbook"))}><Wallet /> Cash Book</CommandItem>
          <CommandItem onSelect={() => run(() => go("reports"))}><BarChart3 /> Reports</CommandItem>
          <CommandItem onSelect={() => run(() => go("notifications"))}><Bell /> Notifications</CommandItem>
          <CommandItem onSelect={() => run(() => go("settings"))}><Settings /> Settings</CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Products">
          {products.slice(0, 8).map(p => (
            <CommandItem key={p.id} onSelect={() => run(() => { go("products"); openProduct(p.id); })}>
              <Search /> {p.name}
              <span className="ml-auto text-xs text-muted-foreground">{p.sku}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Customers">
          {customers.slice(0, 6).map(c => (
            <CommandItem key={c.id} onSelect={() => run(() => openCustomer(c.id))}>
              <Search /> {c.name}
              <span className="ml-auto text-xs text-muted-foreground">{c.village}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Invoices">
          {invoices.slice(0, 6).map(i => (
            <CommandItem key={i.id} onSelect={() => run(() => { go("invoices"); openInvoice(i.id); })}>
              <Search /> {i.no}
              <span className="ml-auto text-xs text-muted-foreground">{i.customer}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
