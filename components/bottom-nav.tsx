"use client"

import { AlertTriangle, Compass, Radio, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "crisis", label: "Crisis", icon: AlertTriangle },
  { id: "compass", label: "Compass", icon: Compass },
  { id: "comms", label: "Comms", icon: Radio },
  { id: "community", label: "Community", icon: Users },
] as const

export type TabId = (typeof tabs)[number]["id"]

interface BottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-lg px-3 py-2 transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "flex items-center justify-center rounded-full p-1.5 transition-all duration-200",
                isActive && "bg-primary/15"
              )}>
                <Icon className={cn("h-5 w-5", isActive && "animate-in zoom-in-75 duration-200")} />
              </div>
              <span className={cn(
                "text-[10px] font-medium leading-none",
                isActive && "font-semibold"
              )}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
