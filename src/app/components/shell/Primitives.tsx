import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "../ui/utils";
import { ReactNode, MouseEventHandler } from "react";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, delta, intent = "default", icon, hint, onClick }: {
  label: string;
  value: ReactNode;
  delta?: number;
  intent?: "default" | "positive" | "warning" | "danger";
  icon?: ReactNode;
  hint?: string;
  onClick?: MouseEventHandler;
}) {
  const iconBg = {
    default:  "bg-muted/60 text-foreground",
    positive: "bg-emerald-500/15 text-emerald-500",
    warning:  "bg-amber-500/15 text-amber-500",
    danger:   "bg-rose-500/15 text-rose-500",
  } as const;
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:shadow-[0_4px_12px_rgba(16,24,40,0.06)] transition",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {icon && <div className={cn("size-9 rounded-xl flex items-center justify-center", iconBg[intent])}>{icon}</div>}
      </div>
      <div className="mt-3 text-2xl tracking-tight">{value}</div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {typeof delta === "number" && (
          <span className={cn(
            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md",
            delta >= 0 ? "bg-emerald-500/15 text-emerald-500" : "bg-rose-500/15 text-rose-500"
          )}>
            {delta >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(delta)}%
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}

export function SectionCard({ title, action, children, className }: {
  title?: string; action?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(16,24,40,0.04)]", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          {title && <h3 className="text-base">{title}</h3>}
          {action}
        </div>
      )}
      <div className="px-5 pb-5">{children}</div>
    </div>
  );
}

// Alpha-based colors so they adapt to both light and dark backgrounds
const STATUS_CLASSES: Record<string, string> = {
  paid:     "bg-emerald-500/15 text-emerald-500 ring-emerald-500/25",
  partial:  "bg-amber-500/15   text-amber-500   ring-amber-500/25",
  unpaid:   "bg-muted          text-muted-foreground ring-border",
  overdue:  "bg-rose-500/15    text-rose-500    ring-rose-500/25",
  active:   "bg-emerald-500/15 text-emerald-500 ring-emerald-500/25",
  closed:   "bg-muted          text-muted-foreground ring-border",
  upcoming: "bg-sky-500/15     text-sky-500     ring-sky-500/25",
  low:      "bg-emerald-500/15 text-emerald-500 ring-emerald-500/25",
  medium:   "bg-amber-500/15   text-amber-500   ring-amber-500/25",
  high:     "bg-rose-500/15    text-rose-500    ring-rose-500/25",
  cash:     "bg-muted          text-muted-foreground ring-border",
  credit:   "bg-violet-500/15  text-violet-500  ring-violet-500/25",
};

const DOT_COLOR: Record<string, string> = {
  paid: "bg-emerald-500", active: "bg-emerald-500", low: "bg-emerald-500",
  partial: "bg-amber-500", medium: "bg-amber-500",  upcoming: "bg-amber-500",
  overdue: "bg-rose-500",  high: "bg-rose-500",
  credit: "bg-violet-500",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ring-1 ring-inset capitalize",
      STATUS_CLASSES[status] ?? "bg-muted text-muted-foreground ring-border"
    )}>
      <span className={cn("size-1.5 rounded-full", DOT_COLOR[status] ?? "bg-muted-foreground/50")} />
      {status}
    </span>
  );
}

export function Avatar2({ initials, className }: { initials: string; className?: string }) {
  return (
    <div className={cn(
      "size-9 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-sm shrink-0",
      className
    )}>
      {initials}
    </div>
  );
}
