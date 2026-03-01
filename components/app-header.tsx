"use client"

import { Shield, Signal } from "lucide-react"

interface AppHeaderProps {
  title?: string
}

export function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-none tracking-tight text-foreground font-mono">
              {title || "Safe Seek"}
            </h1>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Disaster Tracker</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-1">
            <Signal className="h-3 w-3 text-success" />
            <span className="text-[10px] font-medium text-success">Live</span>
          </div>
        </div>
      </div>
    </header>
  )
}
