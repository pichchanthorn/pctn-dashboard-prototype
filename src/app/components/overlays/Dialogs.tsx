import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useApp } from "../../lib/AppContext";
import { customers, categories, type Product } from "../../lib/mock";
import { fmtKHR } from "../../lib/format";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";
import { cn } from "../ui/utils";

function Field({ label, value, onChange, type = "text", placeholder, full, error }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; full?: boolean; error?: string;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "mt-1.5 w-full h-10 px-3 rounded-xl border bg-card text-sm focus:outline-none focus:ring-2",
          error
            ? "border-rose-400 focus:ring-rose-500/30"
            : "border-border focus:ring-emerald-500/30"
        )}
      />
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

// ── New Customer ──────────────────────────────────────────────────────────

export function NewCustomerDialog() {
  const { dialog, closeDialog } = useApp();
  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [village, setVillage] = useState("");
  const [commune, setCommune] = useState("");
  const [land, setLand]       = useState("");
  const [limit, setLimit]     = useState("");

  const save = () => {
    if (!name) { toast.error("Name is required"); return; }
    toast.success(`Customer "${name}" created`);
    closeDialog();
    setName(""); setPhone(""); setVillage(""); setCommune(""); setLand(""); setLimit("");
  };

  return (
    <Dialog open={dialog === "new-customer"} onOpenChange={(v) => !v && closeDialog()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Customer</DialogTitle>
          <DialogDescription>Add a farmer to your customer registry.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <Field label="Full name"          value={name}    onChange={setName}    placeholder="e.g. Sok Pisey" />
          <Field label="Phone"              value={phone}   onChange={setPhone}   placeholder="012 345 678" />
          <Field label="Village"            value={village} onChange={setVillage} placeholder="Village name" />
          <Field label="Commune"            value={commune} onChange={setCommune} />
          <Field label="Land (hectares)"    value={land}    onChange={setLand}    type="number" placeholder="0.0" />
          <Field label="Credit limit (KHR)" value={limit}   onChange={setLimit}   type="number" placeholder="0" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>Cancel</Button>
          <Button onClick={save} className="bg-emerald-600 hover:bg-emerald-700 text-white">Create customer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Record Payment ────────────────────────────────────────────────────────

export function RecordPaymentDialog() {
  const { dialog, dialogData, closeDialog } = useApp();
  const [customerId, setCustomerId] = useState<string>(dialogData?.customerId || "");
  const [amount, setAmount]         = useState("");
  const [method, setMethod]         = useState("Cash");
  const [note, setNote]             = useState("");

  const customer = customers.find(c => c.id === customerId);
  const open = dialog === "record-payment";

  const save = () => {
    if (!customerId) { toast.error("Select a customer"); return; }
    if (!amount)     { toast.error("Enter amount"); return; }
    toast.success(`Payment of ${fmtKHR(Number(amount))} recorded`);
    closeDialog();
    setAmount(""); setNote("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && closeDialog()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>Apply a payment to a customer's balance.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs text-muted-foreground">Customer</label>
            <select
              value={customerId} onChange={(e) => setCustomerId(e.target.value)}
              className="mt-1.5 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="">Select customer…</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {fmtKHR(c.outstanding)}</option>)}
            </select>
          </div>
          {customer && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Outstanding</span>
                <span className="tabular-nums">{fmtKHR(customer.outstanding)}</span>
              </div>
            </div>
          )}
          <Field label="Amount (KHR)" value={amount} onChange={setAmount} type="number" placeholder="0" full />
          <div>
            <label className="text-xs text-muted-foreground">Method</label>
            <div className="mt-1.5 grid grid-cols-4 gap-2">
              {["Cash", "ABA", "Wing", "Bank"].map(m => (
                <button
                  key={m} onClick={() => setMethod(m)}
                  className={"h-10 rounded-xl border text-sm transition " +
                    (method === m
                      ? "bg-emerald-500/15 border-emerald-400/50 text-emerald-600 dark:text-emerald-400"
                      : "border-border hover:bg-accent")}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <Field label="Note" value={note} onChange={setNote} placeholder="Optional" full />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>Cancel</Button>
          <Button onClick={save} className="bg-emerald-600 hover:bg-emerald-700 text-white">Record payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── New Product ───────────────────────────────────────────────────────────

export function NewProductDialog() {
  const { dialog, closeDialog } = useApp();
  const [name, setName]     = useState("");
  const [sku, setSku]       = useState("");
  const [cash, setCash]     = useState("");
  const [credit, setCredit] = useState("");

  const save = () => {
    if (!name) { toast.error("Product name is required"); return; }
    toast.success(`"${name}" added to inventory`);
    closeDialog();
    setName(""); setSku(""); setCash(""); setCredit("");
  };

  return (
    <Dialog open={dialog === "new-product"} onOpenChange={(v) => !v && closeDialog()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>New Product</DialogTitle>
          <DialogDescription>Add a new product to your catalog.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <Field label="Product name"       value={name}   onChange={setName}   placeholder="e.g. Urea Fertilizer 50kg" full />
          <Field label="SKU"                value={sku}    onChange={setSku}    placeholder="FRT-001" />
          <Field label="Category"           value=""       onChange={() => {}}  placeholder="Select…" />
          <Field label="Cash price (KHR)"   value={cash}   onChange={setCash}   type="number" />
          <Field label="Credit price (KHR)" value={credit} onChange={setCredit} type="number" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>Cancel</Button>
          <Button onClick={save} className="bg-emerald-600 hover:bg-emerald-700 text-white">Add product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── New Season ────────────────────────────────────────────────────────────

export function NewSeasonDialog() {
  const { dialog, closeDialog } = useApp();
  const [name, setName]         = useState("");
  const [type, setType]         = useState<"Wet" | "Dry">("Wet");
  const [start, setStart]       = useState("");
  const [end, setEnd]           = useState("");
  const [harvest, setHarvest]   = useState("");

  const save = () => {
    if (!name.trim()) { toast.error("Season name is required"); return; }
    if (!start)       { toast.error("Start date is required"); return; }
    if (!end)         { toast.error("End date is required"); return; }
    toast.success(`"${name}" created and set as active season`);
    closeDialog();
    setName(""); setType("Wet"); setStart(""); setEnd(""); setHarvest("");
  };

  return (
    <Dialog open={dialog === "new-season"} onOpenChange={(v) => !v && closeDialog()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Season</DialogTitle>
          <DialogDescription>Define the planting and harvest window for a new season.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Field label="Season name" value={name} onChange={setName} placeholder="e.g. Dry Season 2027" full />
          <div>
            <label className="text-xs text-muted-foreground">Type</label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {(["Wet", "Dry"] as const).map(t => (
                <button
                  key={t} onClick={() => setType(t)}
                  className={"h-10 rounded-xl border text-sm transition " +
                    (type === t
                      ? "bg-emerald-500/15 border-emerald-400/50 text-emerald-600 dark:text-emerald-400"
                      : "border-border hover:bg-accent")}
                >
                  {t === "Wet" ? "🌧 Wet Season" : "☀️ Dry Season"}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Start date"            value={start}   onChange={setStart}   type="date" />
            <Field label="End date"              value={end}     onChange={setEnd}     type="date" />
            <Field label="Expected harvest date" value={harvest} onChange={setHarvest} type="date" full />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>Cancel</Button>
          <Button onClick={save} className="bg-emerald-600 hover:bg-emerald-700 text-white">Create Season</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Add / Edit Product ─────────────────────────────────────────────────────

const UNITS = ["bag", "bottle", "pack", "unit", "kg", "L", "sack", "box"];

function NumField({ label, value, onChange, placeholder, error }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; error?: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input
        type="number" value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? "0"}
        className={cn(
          "mt-1.5 w-full h-10 px-3 rounded-xl border bg-card text-sm tabular-nums focus:outline-none focus:ring-2",
          error ? "border-rose-400 focus:ring-rose-500/30" : "border-border focus:ring-emerald-500/30"
        )}
      />
    </div>
  );
}

type FormErrors = Partial<Record<"name" | "category" | "cash" | "credit" | "cost" | "stock" | "reorder", string>>;

export function ProductFormDialog() {
  const { dialog, dialogData, closeDialog, updateProduct, addProduct } = useApp();
  const isEdit = dialog === "edit-product";
  const open   = dialog === "add-product" || dialog === "edit-product";
  const seed   = dialogData as Product | undefined;

  const [name,     setName]     = useState("");
  const [nameKh,   setNameKh]   = useState("");
  const [category, setCategory] = useState(categories[0]?.name ?? "");
  const [unit,     setUnit]     = useState("bag");
  const [cost,     setCost]     = useState("");
  const [cash,     setCash]     = useState("");
  const [credit,   setCredit]   = useState("");
  const [stock,    setStock]    = useState("");
  const [reorder,  setReorder]  = useState("");
  const [desc,     setDesc]     = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [tab,      setTab]      = useState<"basic" | "pricing" | "stock">("basic");
  const [errors,   setErrors]   = useState<FormErrors>({});

  // Seed form fields when the dialog opens for editing
  useEffect(() => {
    if (!open) return;
    if (seed) {
      setName(seed.name);
      setNameKh(seed.nameKh ?? "");
      setCategory(seed.category);
      setUnit(seed.unit);
      setCost(String(seed.cost));
      setCash(String(seed.cashPrice));
      setCredit(String(seed.creditPrice));
      setStock(String(seed.stock));
      setReorder(String(seed.reorder));
      setDesc(seed.description ?? "");
    } else {
      setName(""); setNameKh(""); setCategory(categories[0]?.name ?? ""); setUnit("bag");
      setCost(""); setCash(""); setCredit(""); setStock(""); setReorder(""); setDesc("");
    }
    setImageSrc(null);
    setTab("basic");
    setErrors({});
  }, [open, seed?.id]); // re-seed when the specific product being edited changes

  const clearError = (field: keyof FormErrors) =>
    setErrors(e => { const n = { ...e }; delete n[field]; return n; });

  const handleClose = () => { closeDialog(); setErrors({}); };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!name.trim())           e.name     = "Product name is required.";
    if (!category)              e.category = "Category is required.";
    if (!cash || Number(cash) <= 0)   e.cash   = "Enter a valid cash price.";
    if (!credit || Number(credit) <= 0) e.credit = "Enter a valid credit price.";
    if (Number(credit) < Number(cash))  e.credit = "Credit price must be ≥ cash price.";
    if (setErrors(e), Object.keys(e).length > 0) {
      // Navigate to the tab that contains the first error
      if (e.name || e.category) setTab("basic");
      else if (e.cash || e.credit || e.cost) setTab("pricing");
      else setTab("stock");
      return false;
    }
    return true;
  };

  const save = () => {
    if (!validate()) return;

    const updated: Product = {
      id:          seed?.id ?? `p-${Date.now()}`,
      sku:         seed?.sku ?? `NEW-${Date.now().toString().slice(-4)}`,
      name:        name.trim(),
      nameKh:      nameKh.trim() || undefined,
      description: desc.trim() || undefined,
      category,
      unit,
      cost:        Number(cost) || 0,
      cashPrice:   Number(cash),
      creditPrice: Number(credit),
      stock:       Number(stock) || 0,
      reorder:     Number(reorder) || 0,
      active:      seed?.active ?? true,
      expiry:      seed?.expiry,
    };

    if (isEdit) {
      updateProduct(updated);
      toast.success("Product updated successfully.");
    } else {
      addProduct(updated);
      toast.success(`"${updated.name}" added to catalog.`);
    }
    handleClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImageSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const formTabs = [
    { key: "basic"   as const, label: "Basic info",
      hasError: !!(errors.name || errors.category) },
    { key: "pricing" as const, label: "Pricing",
      hasError: !!(errors.cash || errors.credit || errors.cost) },
    { key: "stock"   as const, label: "Stock",
      hasError: !!(errors.stock || errors.reorder) },
  ];

  const onCashChange = (v: string) => {
    setCash(v);
    clearError("cash");
    // Auto-suggest credit = cash × 1.10 only when credit is currently empty
    if (!credit && v) setCredit(String(Math.ceil(Number(v) * 1.1 / 100) * 100));
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && handleClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle>{isEdit ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update product details." : "Add a new product to your catalog."}</DialogDescription>
        </DialogHeader>

        {/* Inner tabs — dot appears when tab contains a validation error */}
        <div className="flex items-center gap-1 px-6 mt-4 border-b border-border">
          {formTabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "px-4 h-9 text-sm relative flex items-center gap-1.5",
                tab === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
              {t.hasError && <span className="size-1.5 rounded-full bg-rose-500 shrink-0" />}
              {tab === t.key && <span className="absolute bottom-[-1px] inset-x-0 h-0.5 bg-emerald-600 rounded-full" />}
            </button>
          ))}
        </div>

        <div className="px-6 py-5 space-y-4 min-h-[300px]">

          {/* ── Basic info ── */}
          {tab === "basic" && (
            <>
              {/* Image upload */}
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  {imageSrc ? (
                    <div className="relative size-20 rounded-2xl overflow-hidden border border-border">
                      <img src={imageSrc} alt="product" className="size-full object-cover" />
                      <button
                        onClick={() => setImageSrc(null)}
                        className="absolute top-1 right-1 size-5 rounded-full bg-background/80 flex items-center justify-center"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="size-20 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-500/5 transition">
                      <ImagePlus className="size-6 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground mt-1">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <Field
                    label="Product name (EN)" value={name}
                    onChange={v => { setName(v); clearError("name"); }}
                    placeholder="e.g. Urea Fertilizer 50kg" full
                    error={errors.name}
                  />
                  <Field label="Product name (ខ្មែរ)" value={nameKh} onChange={setNameKh} placeholder="e.g. ជីអ៊ុយរ៉េ ៥០គីឡូ" full />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Category</label>
                  <select
                    value={category}
                    onChange={e => { setCategory(e.target.value); clearError("category"); }}
                    className={cn(
                      "mt-1.5 w-full h-10 px-3 rounded-xl border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30",
                      errors.category ? "border-rose-400 focus:ring-rose-500/30" : "border-border"
                    )}
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category}</p>}
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Unit of measure</label>
                  <select
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="mt-1.5 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Description</label>
                <textarea
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  rows={3}
                  placeholder="Product description, usage instructions, and notes…"
                  className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </>
          )}

          {/* ── Pricing ── */}
          {tab === "pricing" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NumField label="Purchase price (KHR)" value={cost}   onChange={v => { setCost(v); clearError("cost"); }}   error={errors.cost} />
                <NumField label="Cash price (KHR)"     value={cash}   onChange={onCashChange}                               error={errors.cash} />
                <NumField label="Credit price (KHR)"   value={credit} onChange={v => { setCredit(v); clearError("credit"); }} error={errors.credit} />
              </div>
              {cash && credit && (
                <div className="rounded-xl bg-muted/50 p-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1.5">
                    <div className="text-muted-foreground">Cash margin</div>
                    {cost ? (
                      <div className="text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {Math.round(((Number(cash) - Number(cost)) / Number(cash)) * 100)}%
                        · {fmtKHR(Number(cash) - Number(cost))}
                      </div>
                    ) : <div className="text-muted-foreground/50">Enter purchase price</div>}
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-muted-foreground">Interest added</div>
                    <div className="text-violet-600 dark:text-violet-400 tabular-nums">
                      {cash ? `${Math.round(((Number(credit) - Number(cash)) / Number(cash)) * 100)}%` : "—"}
                      · {fmtKHR(Number(credit) - Number(cash))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Stock ── */}
          {tab === "stock" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumField label="Opening stock"   value={stock}   onChange={setStock}   placeholder="0" />
                <NumField label="Minimum stock (reorder point)" value={reorder} onChange={setReorder} placeholder="0" />
              </div>
              {stock && reorder && Number(stock) <= Number(reorder) && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
                  Opening stock is at or below the reorder point — this product will be flagged as Low Stock.
                </div>
              )}
              <div>
                <label className="text-xs text-muted-foreground">Expiry date (optional)</label>
                <input
                  type="date"
                  className="mt-1.5 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Supplier (optional)</label>
                <select className="mt-1.5 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
                  <option value="">Select supplier…</option>
                  <option>Mekong Agri Imports</option>
                  <option>Cambodia Seed Co.</option>
                  <option>Phnom Penh Chemicals</option>
                  <option>Battambang Fertilizer Depot</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <div className="flex-1" />
          {tab !== "basic" && (
            <Button variant="outline" onClick={() => setTab(tab === "stock" ? "pricing" : "basic")}>← Back</Button>
          )}
          {tab !== "stock" ? (
            <Button onClick={() => setTab(tab === "basic" ? "pricing" : "stock")} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Next →
            </Button>
          ) : (
            <Button onClick={save} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {isEdit ? "Save changes" : "Add product"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
