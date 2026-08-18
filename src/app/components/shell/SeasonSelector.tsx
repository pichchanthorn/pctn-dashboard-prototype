import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { ChevronDown, Check, Plus, CalendarRange, Droplets, Sun } from "lucide-react";
import { seasons } from "../../lib/mock";
import { useApp } from "../../lib/AppContext";
import { cn } from "../ui/utils";
import { fmtDate } from "../../lib/format";

// Group seasons by year, descending
function groupByYear(list: typeof seasons) {
  const map = new Map<string, typeof seasons>();
  for (const s of list) {
    const year = s.start.slice(0, 4);
    if (!map.has(year)) map.set(year, []);
    map.get(year)!.push(s);
  }
  // Sort years descending
  return Array.from(map.entries()).sort((a, b) => Number(b[0]) - Number(a[0]));
}

const STATUS_LABEL: Record<string, string> = {
  active:   "Active",
  closed:   "Closed",
  upcoming: "Upcoming",
};

export function SeasonSelector() {
  const { activeSeasonId, setActiveSeasonId, openDialog } = useApp();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef    = useRef<HTMLButtonElement>(null);
  const listRef      = useRef<HTMLDivElement>(null);

  const activeSeason = seasons.find(s => s.id === activeSeasonId) ?? seasons[0];
  const grouped = groupByYear(seasons);
  // Flat ordered list for keyboard nav (all seasons + "create" sentinel)
  const flatItems = [...seasons.map(s => s.id), "__create__"];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape; arrow nav
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        setFocused(flatItems.indexOf(activeSeasonId));
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocused(i => Math.min(i + 1, flatItems.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocused(i => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const id = flatItems[focused];
      if (!id) return;
      if (id === "__create__") {
        setOpen(false);
        openDialog("new-season");
      } else {
        setActiveSeasonId(id);
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    if (e.key === "Tab") {
      setOpen(false);
    }
  }, [open, focused, flatItems, activeSeasonId, setActiveSeasonId, openDialog]);

  // Scroll focused item into view
  useEffect(() => {
    if (!open || focused < 0) return;
    const el = listRef.current?.querySelector(`[data-idx="${focused}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: "nearest" });
  }, [focused, open]);

  const select = (id: string) => {
    if (id === "__create__") {
      openDialog("new-season");
    } else {
      setActiveSeasonId(id);
    }
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className="relative hidden md:block"
      onKeyDown={handleKeyDown}
    >
      {/* Trigger button */}
      <button
        ref={buttonRef}
        onClick={() => { setOpen(v => !v); setFocused(flatItems.indexOf(activeSeasonId)); }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select season"
        className={cn(
          "flex items-center gap-2 h-9 px-3 rounded-lg border text-sm transition-colors",
          open
            ? "border-emerald-400 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "border-border hover:bg-accent"
        )}
      >
        <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
        <span className="max-w-[140px] truncate">{activeSeason.name}</span>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label="Seasons"
          ref={listRef}
          className={cn(
            "absolute right-0 top-[calc(100%+6px)] z-50 min-w-[280px] rounded-2xl border border-border",
            "bg-card shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
            "overflow-hidden",
            // entrance animation via CSS
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150"
          )}
        >
          <div className="px-3 pt-3 pb-1 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
            Season
          </div>

          <div className="max-h-72 overflow-y-auto py-1">
            {grouped.map(([year, list]) => (
              <div key={year}>
                {/* Year header */}
                <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground/60">
                  {year}
                </div>

                {list.map(s => {
                  const idx = flatItems.indexOf(s.id);
                  const isActive = s.id === activeSeasonId;
                  const isFocused = idx === focused;
                  const Icon = s.type === "Wet" ? Droplets : Sun;

                  return (
                    <button
                      key={s.id}
                      role="option"
                      aria-selected={isActive}
                      data-idx={idx}
                      onClick={() => select(s.id)}
                      onMouseEnter={() => setFocused(idx)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors",
                        isFocused && "bg-muted",
                        isActive  && "text-emerald-600 dark:text-emerald-400"
                      )}
                    >
                      {/* Type icon */}
                      <div className={cn(
                        "size-8 rounded-lg flex items-center justify-center shrink-0",
                        s.type === "Wet"
                          ? "bg-sky-500/10 text-sky-500"
                          : "bg-amber-500/10 text-amber-500"
                      )}>
                        <Icon className="size-4" />
                      </div>

                      {/* Name + dates */}
                      <div className="flex-1 min-w-0">
                        <div className="truncate">{s.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                          {fmtDate(s.start)} → {fmtDate(s.end)}
                        </div>
                      </div>

                      {/* Status + checkmark */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full ring-1 ring-inset capitalize",
                          s.status === "active"
                            ? "bg-emerald-500/15 text-emerald-500 ring-emerald-500/25"
                            : s.status === "upcoming"
                            ? "bg-sky-500/15 text-sky-500 ring-sky-500/25"
                            : "bg-muted text-muted-foreground ring-border"
                        )}>
                          {STATUS_LABEL[s.status]}
                        </span>
                        {isActive && <Check className="size-3.5 text-emerald-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Divider + Create */}
          <div className="border-t border-border">
            <button
              role="option"
              data-idx={flatItems.indexOf("__create__")}
              onMouseEnter={() => setFocused(flatItems.indexOf("__create__"))}
              onClick={() => select("__create__")}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-3 text-sm text-muted-foreground",
                "hover:bg-muted hover:text-foreground transition-colors",
                focused === flatItems.indexOf("__create__") && "bg-muted text-foreground"
              )}
            >
              <div className="size-6 rounded-md border border-dashed border-border flex items-center justify-center">
                <Plus className="size-3.5" />
              </div>
              Create New Season
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
