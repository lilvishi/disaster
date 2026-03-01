"use client"

import { useMemo } from "react"
import { ShieldCheck, MapPin, ArrowUpRight, ChevronRight, HeartHandshake, Flame, Waves, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { safeModeData } from "@/lib/mock-data"

const riskColors = {
  high: { bg: "bg-primary/15", text: "text-primary", border: "border-primary/30", label: "HIGH" },
  moderate: { bg: "bg-warning/15", text: "text-warning", border: "border-warning/30", label: "MODERATE" },
  low: { bg: "bg-success/15", text: "text-success", border: "border-success/30", label: "LOW" },
} as const

function DisasterIcon({ type }: { type: string }) {
  const t = type.toLowerCase()
  if (t.includes("wildfire") || t.includes("fire")) return <Flame className="h-6 w-6 text-primary" />
  if (t.includes("flood")) return <Waves className="h-6 w-6 text-primary" />
  return <AlertTriangle className="h-6 w-6 text-primary" />
}

export function SafeModePage({
  onViewMap,
  onVolunteer,
  onFindShelter,
}: {
  onViewMap: () => void
  onVolunteer: () => void
  onFindShelter: () => void
}) {
  const data = safeModeData

  const nearestRisk = useMemo(() => {
    return riskColors[data.nearestDisaster.riskLevel] ?? riskColors.low
  }, [data.nearestDisaster.riskLevel])

  return (
    <div className="flex flex-col gap-4 px-4 py-4 pb-24">
      <div className={cn("rounded-xl p-4 flex items-center gap-3 border", "bg-sky-500/10 border-sky-500/20")}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background/20">
          <ShieldCheck className="h-5 w-5 text-sky-600" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold tracking-wider text-sky-700">SAFE MODE</p>
          <p className="text-xs mt-0.5 text-sky-700/80">No active danger at your location</p>
        </div>

        <button
          onClick={onViewMap}
          className="inline-flex items-center gap-1 rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-95"
        >
          View map
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 shrink-0">
              <DisasterIcon type={data.nearestDisaster.type} />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-bold text-foreground font-mono">
                {data.nearestDisaster.type}{" "}
                <span className="text-muted-foreground font-sans font-semibold">– {data.nearestDisaster.areaName}</span>
              </h2>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{data.nearestDisaster.distanceMiles} mi away</span>
                </div>

                <span className="text-xs text-muted-foreground">Updated {data.nearestDisaster.lastUpdated}</span>
              </div>
            </div>
          </div>

          <div className={cn("rounded-lg border px-3 py-1.5 shrink-0", nearestRisk.bg, nearestRisk.border)}>
            <span className={cn("text-xs font-bold tracking-wider", nearestRisk.text)}>{nearestRisk.label}</span>
          </div>
        </div>

        <p className="text-sm text-foreground/90 leading-relaxed mt-3">{data.nearestDisaster.shortDescription}</p>

        <div className="mt-3 flex gap-2">
          <button
            onClick={onViewMap}
            className="flex-1 rounded-lg bg-secondary/60 px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
          >
            View map
          </button>
          <button
            onClick={onFindShelter}
            className="flex-1 rounded-lg bg-secondary/60 px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
          >
            Find shelter nearby
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <HeartHandshake className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground font-mono">Help near {data.volunteerRegion}</h3>
        </div>

        <div className="flex flex-col gap-2">
          {data.volunteerOpportunities.slice(0, 3).map((v) => (
            <button
              key={v.id}
              onClick={onVolunteer}
              className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3 text-left transition-colors hover:bg-secondary/80"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-xs font-bold text-primary">VOL</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{v.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {v.locationText} • {v.timingText}
                </p>
              </div>

              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>

        <button
          onClick={onVolunteer}
          className="mt-3 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-95"
        >
          Look for volunteer work
        </button>
      </div>
    </div>
  )
}