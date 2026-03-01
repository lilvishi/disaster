"use client"

import { AlertTriangle, Flame, MapPin, Clock, ChevronRight, ShieldAlert, ArrowUpRight } from "lucide-react"
import { crisisData } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const riskColors = {
  critical: { bg: "bg-destructive/15", text: "text-destructive", border: "border-destructive/30", label: "CRITICAL" },
  high: { bg: "bg-primary/15", text: "text-primary", border: "border-primary/30", label: "HIGH" },
  moderate: { bg: "bg-warning/15", text: "text-warning", border: "border-warning/30", label: "MODERATE" },
  low: { bg: "bg-success/15", text: "text-success", border: "border-success/30", label: "LOW" },
}

const evacColors = {
  mandatory: { bg: "bg-destructive", text: "text-destructive-foreground", label: "MANDATORY EVACUATION" },
  advisory: { bg: "bg-primary", text: "text-primary-foreground", label: "EVACUATION ADVISORY" },
  "shelter-in-place": { bg: "bg-warning", text: "text-warning-foreground", label: "SHELTER IN PLACE" },
  none: { bg: "bg-success", text: "text-success-foreground", label: "NO EVACUATION" },
}

export function CrisisPage() {
  const data = crisisData
  const risk = riskColors[data.riskLevel]
  const evac = evacColors[data.evacuationStatus]

  return (
    <div className="flex flex-col gap-4 px-4 py-4 pb-24">
      {/* Evacuation Banner */}
      <div className={cn("rounded-xl p-4 flex items-center gap-3", evac.bg)}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background/20">
          <ShieldAlert className={cn("h-5 w-5", evac.text)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("text-xs font-bold tracking-wider", evac.text)}>{evac.label}</p>
          <p className={cn("text-xs mt-0.5 opacity-90", evac.text)}>Follow designated evacuation routes</p>
        </div>
        <ArrowUpRight className={cn("h-5 w-5 shrink-0", evac.text)} />
      </div>

      {/* Disaster Type & Risk */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
              <Flame className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground font-mono">{data.disasterType}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{data.location}</span>
              </div>
            </div>
          </div>
          <div className={cn("rounded-lg border px-3 py-1.5", risk.bg, risk.border)}>
            <span className={cn("text-xs font-bold tracking-wider", risk.text)}>{risk.label}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Updated {data.lastUpdated}</span>
          <div className="ml-auto flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
            </span>
            <span className="text-xs font-medium text-destructive">Active</span>
          </div>
        </div>
      </div>

      {/* Immediate Actions */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground font-mono">Immediate Actions</h3>
        </div>
        <div className="flex flex-col gap-2">
          {data.immediateActions.map((action, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                <span className="text-[10px] font-bold text-primary">{i + 1}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Steps / Advice */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold text-foreground font-mono mb-3">Steps & Advice</h3>
        <div className="flex flex-col gap-2">
          {data.steps.map((step, i) => (
            <button
              key={i}
              className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3 text-left transition-colors hover:bg-secondary/80"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{step.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
