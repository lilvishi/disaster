"use client"

import { MapPinOff, ArrowUpRight } from "lucide-react"

export function UntrackedPage({ onViewMap }: { onViewMap: () => void }) {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 pb-24">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
              <MapPinOff className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-muted-foreground">UNTRACKED AREA</p>
              <p className="text-sm font-semibold text-foreground mt-1">This area is not currently tracked for hazard status.</p>
              <p className="text-xs text-muted-foreground mt-1">Use the map to review nearby reports, shelters, and road closures.</p>
            </div>
          </div>

          <button
            onClick={onViewMap}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-95"
          >
            View map
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
