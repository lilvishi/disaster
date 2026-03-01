"use client"

import { useState } from "react"
import { Search, ShieldCheck, CloudLightning, Newspaper, Siren, Clock, ExternalLink, Wind, Droplets, Thermometer, TriangleAlert } from "lucide-react"
import { newsItems, weatherData } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type CategoryFilter = "all" | "government" | "weather" | "news" | "emergency"

const categories: { id: CategoryFilter; label: string; icon: typeof ShieldCheck }[] = [
  { id: "all", label: "All", icon: Siren },
  { id: "government", label: "Official", icon: ShieldCheck },
  { id: "weather", label: "Weather", icon: CloudLightning },
  { id: "news", label: "News", icon: Newspaper },
  { id: "emergency", label: "Emergency", icon: Siren },
]

const categoryColors: Record<string, string> = {
  government: "bg-primary/15 text-primary",
  weather: "bg-chart-3/15 text-chart-3",
  news: "bg-accent/15 text-accent-foreground",
  emergency: "bg-destructive/15 text-destructive",
}

export function CommsPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = newsItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-col gap-4 px-4 py-4 pb-24">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search updates, alerts, news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-secondary/50 py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                activeCategory === cat.id
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Weather Card */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <CloudLightning className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-bold text-foreground font-mono">Weather Conditions</h3>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-2.5">
            <Thermometer className="h-4 w-4 text-primary" />
            <span className="text-lg font-bold text-foreground">{weatherData.temperature}</span>
            <span className="text-[10px] text-muted-foreground">Temp (F)</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-2.5">
            <Droplets className="h-4 w-4 text-chart-3" />
            <span className="text-lg font-bold text-foreground">{weatherData.humidity}%</span>
            <span className="text-[10px] text-muted-foreground">Humidity</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-2.5">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-bold text-foreground">{weatherData.windSpeed}</span>
            <span className="text-[10px] text-muted-foreground">Wind mph</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-2.5">
            <span className="text-sm font-bold text-accent">{weatherData.windDirection}</span>
            <span className="text-lg font-bold text-foreground">--</span>
            <span className="text-[10px] text-muted-foreground">Direction</span>
          </div>
        </div>

        {/* Weather Alerts */}
        {weatherData.alerts.map((alert, i) => (
          <div key={i} className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-3.5 w-3.5 text-destructive shrink-0" />
              <span className="text-xs font-bold text-destructive">{alert.severity}: {alert.title}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{alert.description}</p>
          </div>
        ))}
      </div>

      {/* News Feed */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-foreground font-mono">Latest Updates</h3>
        {filtered.map((item) => (
          <article key={item.id} className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-card/80">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-medium", categoryColors[item.category])}>
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                  {item.isOfficial && (
                    <div className="flex items-center gap-0.5">
                      <ShieldCheck className="h-3 w-3 text-success" />
                      <span className="text-[10px] text-success font-medium">Official</span>
                    </div>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-foreground leading-snug">{item.title}</h4>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">{item.summary}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-muted-foreground">{item.source}</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-2.5 w-2.5" />
                    <span className="text-[10px]">{item.timestamp}</span>
                  </div>
                </div>
              </div>
              <button className="shrink-0 rounded-lg bg-secondary/50 p-2 text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No updates found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
